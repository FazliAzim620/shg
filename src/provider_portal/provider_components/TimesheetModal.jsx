import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Divider,
  Paper,
  styled,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Close, Edit } from "@mui/icons-material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../components/job-component/CreateJobModal";
import API from "../../API";
import { setJobWeeks } from "../../feature/providerPortal/currentJobSlice";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
const TableCellCustom = styled(TableCell)(({ theme }) => ({
  fontSize: "0.75rem",
}));
const TimesheetModal = ({ open, onClose, shift, onSave, edit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWeek = parseInt(searchParams.get("week"));
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility
  const [showBtn, setShowBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { week, allWeeks, currentJob } = useSelector(
    (state) => state.currentJob
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState({
    start_time: "",
    end_time: "",
    regular_hours: "",
    overtime_hours: "",
    total_hours: "",
  });
  const closeHandler = () => {
    setIsLoading(false);
    setShowBtn(false);
    onClose();
  };

  useEffect(() => {
    if (shift) {
      setShifts(shift.shifts || []);
      if (shift.editingShift) {
        setCurrentShift({
          ...shift.editingShift,
          total_hours:
            Number(shift?.editingShift?.regular_hours) +
            Number(shift?.editingShift?.overtime_hours),
        });
      } else {
        setCurrentShift({
          start_time: "",
          end_time: "",
          regular_hours: "",
          overtime_hours: "",
          total_hours: "",
        });
      }
    }
  }, [shift]);
  const cw = allWeeks?.find((cw) => cw?.id === initialWeek);

  const calculateHours = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(`2000-01-01T${start}`);
    const endDate = new Date(`2000-01-01T${end}`);
    let diff = (endDate - startDate) / 3600000; // difference in hours
    if (diff < 0) diff += 24; // handle midnight crossing
    return diff.toFixed(2);
  };

  const handleChange = (field, value) => {
    setCurrentShift((prevShift) => {
      const newShift = { ...prevShift, [field]: value };

      // Calculate total_hours if start_time or end_time is changed
      if (field === "start_time" || field === "end_time") {
        const totalHours = calculateHours(
          newShift.start_time,
          newShift.end_time
        );
        newShift.total_hours = totalHours;
        newShift.regular_hours = totalHours;
        newShift.date = shift?.date;
        newShift.week_id = allWeeks ? cw?.id : week?.id;
        newShift.job_id = allWeeks ? cw?.job_id : week?.job_id;
      }

      // Check for overtime_hours
      if (field === "overtime_hours") {
        const overtime = parseFloat(value) || "";
        const total = parseFloat(newShift.total_hours) || 0;

        // Ensure overtime_hours is not greater than total_hours
        if (overtime > total) {
          console.warn("Overtime hours cannot exceed total hours.");
          // Optionally, you could reset overtime_hours or prevent the change:
          newShift.overtime_hours = total; // Reset to total_hours if exceeds
        } else {
          newShift.overtime_hours = overtime;
        }

        // Adjust regular_hours based on the updated overtime_hours
        newShift.regular_hours = Math.max(
          0,
          total - newShift.overtime_hours
        ).toFixed(1);
      }

      return newShift;
    });
  };

  const handleAddOrUpdateShift = () => {
    setShowBtn(true);
    const shiftIndex = shifts.findIndex(
      (s) => s.start_time === currentShift?.start_time
    );
    if (shiftIndex !== -1) {
      // Update existing shift
      setShifts(
        shifts.map((s, index) => (index === shiftIndex ? currentShift : s))
      );
    } else {
      // Add new shift
      setShifts([...shifts, currentShift]);
    }
    setCurrentShift({
      start_time: "",
      end_time: "",
      regular_hours: "",
      overtime_hours: "",
      total_hours: "",
    });
  };

  const handleEditShift = (shiftToEdit) => {
    setCurrentShift(shiftToEdit);
  };

  const handleDeleteShift = (startTime) => {
    setShifts(shifts.filter((s) => s.start_time !== startTime));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Filter shifts to include only those with id as null
      const filteredShifts = shifts.filter(
        (data) => !data?.id || data?.id == edit?.id
      );
      filteredShifts.forEach((data, index) => {
        formData.append(
          `timesheetDetail[${index}][job_timesheet_detail_id]`,
          data?.id || " "
        );
        formData.append(
          `timesheetDetail[${index}][job_id]`,
          data.job_id || allWeeks ? cw?.job_id : week?.job_id
        );
        formData.append(
          `timesheetDetail[${index}][week_id]`,
          data.week_id || allWeeks ? cw?.id : week?.id
        );
        formData.append(`timesheetDetail[${index}][date]`, shift?.date);
        formData.append(
          `timesheetDetail[${index}][start_time]`,
          data.start_time
        );
        formData.append(`timesheetDetail[${index}][end_time]`, data.end_time);
        formData.append(
          `timesheetDetail[${index}][regular_hours]`,
          data.regular_hours
        );
        formData.append(
          `timesheetDetail[${index}][overtime_hours]`,
          data.overtime_hours
        );
      });

      if (filteredShifts.length > 0) {
        setIsLoading(true);
        const resp = await API.post("/api/add-job-timesheet-detail", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (resp?.data?.success) {
          setIsLoading(false);
          // dispatch(setJobWeeks(resp?.data?.data));
          closeHandler();
          onSave(shifts);
        }
      } else {
        console.log("No items with null id to send.");

        setShowAlert(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <Modal open={open} onClose={closeHandler}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", md: 700, xl: 800 },
          bgcolor: "background.paper",
          boxShadow: 24,
          px: 3,
          py: 2,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <CustomTypographyBold
              weight={600}
              fontSize={"0.75rem"}
              color={"text.black"}
            >
              {shift && shift.editingShift
                ? "Edit Today's Shift"
                : "Today's Shift"}
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={400}
              fontSize={"0.75rem"}
              color={"text.or_color"}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </CustomTypographyBold>
          </Box>
          <Close
            sx={{ color: "text.or_color", cursor: "pointer" }}
            onClick={closeHandler}
          />
        </Box>
        {showAlert && (
          <Alert severity="error" onClose={() => setShowAlert(false)}>
            {"Please add shift then make changes"}
          </Alert>
        )}
        <Grid
          container
          sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}
        >
          <Grid item xs={6} md={2}>
            <CustomTypographyBold
              color={darkMode === "dark" ? "#6D747B" : "text.or_color"}
              fontSize={"0.75rem"}
              textTransform={"none"}
            >
              Start time:
            </CustomTypographyBold>
          </Grid>
          <Grid item xs={6} md={10}>
            <Divider
              sx={{
                borderColor:
                  darkMode === "dark"
                    ? "rgba(255, 255, 255, .7)"
                    : "rgba(231, 234, 243, 1)",
              }}
            />
          </Grid>
        </Grid>

        <Box mb={2}>
          <CommonInputField
            placeholder="Start time"
            type="time"
            name="start_time"
            onChange={(e) => {
              handleChange("start_time", e.target.value);
              handleChange("overtime_hours", currentShift.overtime_hours);
            }}
            value={currentShift.start_time}
          />
        </Box>

        <Grid
          container
          sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}
        >
          <Grid item xs={6} md={2}>
            <CustomTypographyBold
              color={darkMode === "dark" ? "#6D747B" : "text.or_color"}
              fontSize={"0.75rem"}
              textTransform={"none"}
            >
              End time:
            </CustomTypographyBold>
          </Grid>
          <Grid item xs={6} md={10}>
            <Divider
              sx={{
                borderColor:
                  darkMode === "dark"
                    ? "rgba(255, 255, 255, .7)"
                    : "rgba(231, 234, 243, 1)",
              }}
            />
          </Grid>
        </Grid>

        <Box mb={2}>
          <CommonInputField
            placeholder="End time"
            type="time"
            name="end_time"
            value={currentShift.end_time}
            onChange={(e) => {
              handleChange("end_time", e.target.value);
              handleChange("overtime_hours", currentShift.overtime_hours);
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <CustomTypographyBold
              color={darkMode === "dark" ? "#6D747B" : "text.or_color"}
              fontSize={"0.75rem"}
              textTransform={"none"}
              weight={400}
            >
              Total regular hours:
            </CustomTypographyBold>
            {currentShift.regular_hours ? (
              <CustomTypographyBold
                color={"text.black"}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                {currentShift.regular_hours}
              </CustomTypographyBold>
            ) : (
              <CustomTypographyBold
                color={"text.black"}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                00:00
              </CustomTypographyBold>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "right", my: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: 2,
            }}
          >
            <Box sx={{ width: "80%" }}>
              <CustomTypographyBold
                color={darkMode === "dark" ? "#6D747B" : "text.or_color"}
                fontSize={"0.75rem"}
                textTransform={"none"}
                weight={400}
              >
                Overtime hours: (if applicable)
              </CustomTypographyBold>
            </Box>
            <CommonInputField
              placeholder="00:00"
              type="number"
              value={currentShift.overtime_hours}
              onChange={(e) => handleChange("overtime_hours", e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <CustomTypographyBold
              color={darkMode === "dark" ? "#6D747B" : "text.or_color"}
              fontSize={"0.75rem"}
              textTransform={"none"}
              weight={400}
            >
              Total hours:
            </CustomTypographyBold>
            {currentShift.total_hours ||
            Number(currentShift.overtime_hours) +
              Number(currentShift.regular_hours) ? (
              <CustomTypographyBold
                color={"text.black"}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                {/* {!currentShift.overtime_hours && "00:00"} */}
                {currentShift.total_hours ||
                  Number(currentShift.overtime_hours) +
                    Number(currentShift.regular_hours)}
              </CustomTypographyBold>
            ) : (
              <CustomTypographyBold
                color={"text.black"}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                00:00
              </CustomTypographyBold>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "right", my: 2 }}>
          {currentShift?.start_time && currentShift?.end_time && (
            <Button
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.2)",
                padding: "8px 16px",
                minWidth: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  color: "text.main",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
              onClick={handleAddOrUpdateShift}
            >
              {edit ? "Edit Shift" : " Add Shift"}
            </Button>
          )}
        </Box>

        <Divider sx={{ mt: 2 }} />

        {shifts?.filter((data) => !data?.id || data?.id == edit?.id)?.length >
          0 &&
          showBtn && (
            <Box mt={2}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                    }}
                  >
                    <TableRow>
                      <TableCellCustom>S:Time</TableCellCustom>
                      <TableCellCustom>E:Time</TableCellCustom>
                      <TableCellCustom>Total:H</TableCellCustom>
                      <TableCellCustom> Regular:H</TableCellCustom>
                      <TableCellCustom>Overtime</TableCellCustom>
                      <TableCellCustom>Actions</TableCellCustom>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shifts
                      ?.filter((data) => !data?.id || data?.id == edit?.id)
                      ?.map(
                        (shift, index) =>
                          // !shift?.id ||
                          showBtn && (
                            <TableRow key={index}>
                              <TableCell>{shift.start_time}</TableCell>
                              <TableCell>{shift.end_time}</TableCell>
                              <TableCell>
                                {shift.total_hours ||
                                  Number(shift.overtime_hours) +
                                    Number(shift.regular_hours)}
                              </TableCell>
                              <TableCell>{shift.regular_hours}</TableCell>
                              <TableCell>{shift.overtime_hours}</TableCell>
                              <TableCell sx={{ display: "flex" }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditShift(shift)}
                                >
                                  <Edit
                                    sx={{
                                      color: "#6d4a96",
                                    }}
                                  />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteShift(shift.start_time)
                                  }
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        <Box mt={3} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={closeHandler}
            sx={{
              mr: 2,
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "8px 16px",
              minWidth: 0,
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                color: "text.main",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Cancel
          </Button>

          {showBtn &&
            (isLoading ? (
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  width: "8rem",
                }}
              >
                <CircularProgress size={18} sx={{ color: "white" }} />
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.875rem",
                }}
              >
                Apply
              </Button>
            ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default TimesheetModal;
