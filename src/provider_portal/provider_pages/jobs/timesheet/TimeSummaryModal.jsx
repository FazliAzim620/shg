import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  styled,
  Grid,
  Divider,
  Checkbox,
  Skeleton,
  TextareaAutosize,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import { Close, Send } from "@mui/icons-material";
import { renderFileSection } from "../../../provider_components/AttachmentItem";
import API from "../../../../API";
import Signature from "../../../provider_components/settings/Signature";
import { getCurrentDateTime } from "../../../../api_request";
import { useDispatch } from "react-redux";
import { updateStatus } from "../../../../feature/providerPortal/currentJobSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PROVIDER_ROUTES } from "../../../../routes/Routes";
import ExpensesTable from "../../../provider_components/ExpensesTable";
import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";

const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px",
  padding: "8px",
  resize: "none",
  outline: "none",
  transition: "box-shadow 0.2s",
  backgroundColor: isLightMode ? "white" : "#25282A",
  color: isLightMode ? "black" : "white",
  "&:focus": {
    boxShadow:
      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    backgroundColor: isLightMode ? "white" : "#25282A",
  },
}));

const TimeSummaryModal = ({ open, handleClose, weekData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWeek = parseInt(searchParams.get("week"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme.mode);
  const [attachments, setAttachments] = useState([]);
  const [signature, setSignature] = useState(null);
  const [addSignature, setAddSignature] = useState(false);
  const [isFetchingSignature, setIsFetchingSignature] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isLightMode = mode === "light";
  const [overtimeExplanation, setOvertimeExplanation] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const { currentJob } = useSelector((state) => state.currentJob);
  const { userData } = useSelector((state) => state?.userInfo);
  const [ipAddress, setIpAddress] = useState("");
  const handleOvertimeChange = (event) => {
    setOvertimeExplanation(event.target.value);
  };

  const getTotalHours = () => {
    let total = 0;
    weekData?.timesheets?.forEach((timesheet) => {
      timesheet?.timesheet_details?.forEach((detail) => {
        total +=
          parseFloat(detail.regular_hours) + parseFloat(detail.overtime_hours);
      });
    });
    return total;
  };

  const getOverTimeHours = () => {
    let total = 0;
    weekData?.timesheets?.forEach((timesheet) => {
      timesheet?.timesheet_details?.forEach((detail) => {
        total += parseFloat(detail.overtime_hours);
      });
    });
    return total;
  };
  const getRegularHours = () => {
    let total = 0;
    weekData?.timesheets?.forEach((timesheet) => {
      timesheet?.timesheet_details?.forEach((detail) => {
        total += parseFloat(detail.regular_hours);
      });
    });
    return total;
  };
  const NoBorderTableCell = styled(TableCell)(({ theme }) => ({
    border: "none", // Remove the border
    padding: theme.spacing(2),
    color: "#71869d",
    textTransform: "uppercase",
  }));

  //-------------------------------------------------------------- digital signature
  const fetchSignature = async () => {
    setIsFetchingSignature(true); // Start fetching
    try {
      const response = await API.get(`/api/get-user-signature/${userData?.id}`);
      if (response?.data?.data?.signature) {
        const savedSignature = response?.data?.data;
        setSignature(savedSignature);
        // sigCanvas.current.fromDataURL(savedSignature);
      }
    } catch (error) {
      console.log("Error fetching signature:", error);
    } finally {
      setIsFetchingSignature(false); // End fetching
    }
  };
  //-------------------------------------------------------------- digital signature end
  const getAttachments = async () => {
    try {
      const resp = await API.get(
        `/api/get-job-timesheet-detail-attachments-per-week/${weekData?.id}`
      );
      if (resp?.data?.success) {
        setAttachments(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onAddSignatureHandler = () => {
    setAddSignature(false);
    setIsFetchingSignature(true);
    fetchSignature();
  };
  const onCloseHandler = () => {
    handleClose();
    setAddSignature(false);
  };
  const getIpAddress = async () => {
    // Fetch the IP address from the API
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data?.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  };
  const sendHandler = async () => {
    setIsSubmitting(true);
    try {
      const obj = {
        signature: signature,
        overtime_explanation: overtimeExplanation,
        ip_address: ipAddress,
      };

      // navigate(`${PROVIDER_ROUTES.myTimeSheets}?submitted=${weekData?.id}`);
      const resp = await API.post(`/api/submit-timesheet/${weekData?.id}`, obj);
      if (resp?.data?.success) {
        navigate(`${PROVIDER_ROUTES.myTimeSheets}?submitted=${weekData?.id}`);
        setIsSubmitting(false);
        dispatch(updateStatus(initialWeek));
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getIpAddress();
    fetchSignature();
    if (open) {
      getAttachments();
    }
  }, [open]);
  const calculateTotalHours = useMemo(() => {
    return weekData?.timesheets?.reduce((total, dayData) => {
      const dayTotal = dayData.timesheet_details.reduce((daySum, shift) => {
        let hours = 0;

        // If total_hours is in time format (HH:mm)
        if (shift.total_hours && typeof shift.total_hours === "string") {
          const [hour, minute] = shift.total_hours.split(":").map(Number);
          hours = hour + minute / 60;
        }
        // If total_hours is in numeric format
        else {
          hours =
            Number(shift.total_hours) ||
            Number(shift.overtime_hours) + Number(shift.regular_hours);
        }

        return daySum + hours;
      }, 0);
      return total + dayTotal;
    }, 0);
  }, [weekData]);
  const calculateTotalRegularHours = useMemo(() => {
    return weekData?.timesheets?.reduce((total, dayData) => {
      const dayTotal = dayData.timesheet_details.reduce((daySum, shift) => {
        let hours = 0;

        hours = Number(shift.overtime_hours) + Number(shift.regular_hours);

        return daySum + hours;
      }, 0);
      return total + dayTotal;
    }, 0);
  }, [weekData]);
  const formatTotalHours = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <Modal open={open} onClose={onCloseHandler}>
      <Box
        sx={{
          width: { sm: "100%", xl: "100%" },
          boxShadow: 24,
          pt: 4,
          overflowY: "auto",
          height: "100vh",
          bgcolor: "transparent",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: "background.paper",
            px: "1.5rem",
            pt: "0.5rem",
            pb: "1.5rem",
            width: { xs: "95vw", md: "80vw" },
            m: "0 auto",
            mb: { md: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
            }}
          >
            <CustomTypographyBold fontSize={"0.75rem"} color={"text.black"}>
              Everything look ok on your timesheet?
            </CustomTypographyBold>
            <IconButton onClick={onCloseHandler}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{}}>
              <Grid container sx={{ width: 600 }}>
                <Grid item xs={2}>
                  <CustomTypographyBold
                    weight={400}
                    fontSize={"0.75rem"}
                    color={"text.or_color"}
                  >
                    Provider:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={10}>
                  <CustomTypographyBold
                    weight={500}
                    fontSize={"0.875rem"}
                    color={"text.black"}
                  >
                    {currentJob?.name || "--"}
                  </CustomTypographyBold>
                </Grid>
              </Grid>
              <Grid container sx={{ width: 600, mt: 1 }}>
                <Grid item xs={2}>
                  <CustomTypographyBold
                    weight={400}
                    fontSize={"0.75rem"}
                    color={"text.or_color"}
                  >
                    Client:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={10}>
                  <CustomTypographyBold
                    weight={500}
                    fontSize={"0.875rem"}
                    color={"text.black"}
                  >
                    {currentJob?.client_name || "--"}
                  </CustomTypographyBold>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{}}>
              <Box sx={{ display: "flex", gap: 4 }}>
                <CustomTypographyBold
                  weight={400}
                  fontSize={"0.75rem"}
                  color={"text.or_color"}
                >
                  Week of:
                </CustomTypographyBold>
                <CustomTypographyBold
                  weight={500}
                  fontSize={"0.875rem"}
                  color={"text.black"}
                >
                  {weekData?.start_date}
                </CustomTypographyBold>
              </Box>
              <Box sx={{ display: "flex", gap: 4, pt: 1 }}>
                <CustomTypographyBold
                  weight={400}
                  fontSize={"0.75rem"}
                  color={"text.or_color"}
                >
                  Due date:
                </CustomTypographyBold>
                <CustomTypographyBold
                  weight={500}
                  fontSize={"0.875rem"}
                  color={"text.black"}
                >
                  {weekData?.end_date}
                </CustomTypographyBold>
              </Box>
            </Box>
          </Box>
          <Table>
            <TableHead sx={{ bgcolor: "rgba(231, 234, 243, .4)" }}>
              <TableRow>
                <NoBorderTableCell sx={{ py: 1 }}>Date</NoBorderTableCell>
                <NoBorderTableCell sx={{ py: 1 }}>Day</NoBorderTableCell>
                <NoBorderTableCell sx={{ py: 1 }}>Start Time</NoBorderTableCell>
                <NoBorderTableCell sx={{ py: 1 }}>End Time</NoBorderTableCell>
                <NoBorderTableCell sx={{ py: 1 }}>
                  Regular Hours
                </NoBorderTableCell>
                <NoBorderTableCell sx={{ py: 1 }}>
                  Overtime Hours
                </NoBorderTableCell>
                <NoBorderTableCell sx={{ py: 1 }}>
                  Total Hours
                </NoBorderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekData?.timesheets?.map((timesheet) =>
                timesheet?.timesheet_details?.map((shift, index) => {
                  const [shours, sminutes, sseconds = 0] = shift.start_time
                    .split(":")
                    .map(Number);
                  const [hours, minutes, seconds = 0] = shift.end_time
                    .split(":")
                    .map(Number);

                  // Create a date object with the provided time
                  const startDate = new Date();
                  startDate.setHours(shours);
                  startDate.setMinutes(sminutes);
                  startDate.setSeconds(sseconds);

                  const date = new Date();
                  date.setHours(hours);
                  date.setMinutes(minutes);
                  date.setSeconds(seconds);

                  // Format the date object to 12-hour format
                  const formattedStartTime = format(startDate, "hh:mm a");
                  const formattedEndTime = format(date, "hh:mm a");
                  return (
                    <TableRow key={shift.id}>
                      <NoBorderTableCell sx={{ fontWeight: 600 }}>
                        {format(timesheet.date, "dd/MM/yy")}
                      </NoBorderTableCell>
                      <NoBorderTableCell>{timesheet.day}</NoBorderTableCell>

                      <NoBorderTableCell>
                        {formattedStartTime}
                      </NoBorderTableCell>
                      <NoBorderTableCell>{formattedEndTime}</NoBorderTableCell>
                      <NoBorderTableCell>
                        {shift.regular_hours || "0"}
                      </NoBorderTableCell>
                      <NoBorderTableCell>
                        {shift.overtime_hours || "0"}
                      </NoBorderTableCell>
                      <NoBorderTableCell>
                        {shift?.total_hours}
                        {/* {Number(shift.regular_hours) +
                          Number(shift.overtime_hours) || "0"} */}
                      </NoBorderTableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <Divider sx={{ opacity: 0.4 }} />
          <Box
            sx={{
              width: "90%",
              pt: 2,
              display: "flex",
              justifyContent: "end",
              gap: 12,
              alignItems: "center",
            }}
          >
            <CustomTypographyBold color="text.secondary" weight={400}>
              Weekly total hours:
            </CustomTypographyBold>
            <CustomTypographyBold color="text.black">
              {formatTotalHours(calculateTotalHours)}
            </CustomTypographyBold>
          </Box>
          <Box
            sx={{
              width: "90%",
              pt: 1,
              display: "flex",
              justifyContent: "end",
              gap: 12,
              alignItems: "center",
            }}
          >
            <CustomTypographyBold color="text.secondary" weight={400}>
              Weekly Regular total hours:
            </CustomTypographyBold>
            <CustomTypographyBold color="text.black">
              {formatTotalHours(getRegularHours().toFixed(2))}
            </CustomTypographyBold>
          </Box>
          <Box
            sx={{
              width: "90%",
              pt: 1,
              display: "flex",
              justifyContent: "end",
              gap: 12,
              alignItems: "center",
            }}
          >
            <CustomTypographyBold color="text.secondary" weight={400}>
              Weekly Overtime total hours:
            </CustomTypographyBold>
            <CustomTypographyBold color="text.black">
              {formatTotalHours(getOverTimeHours().toFixed(2))}
            </CustomTypographyBold>
          </Box>
          <Divider sx={{ opacity: 0.4, mb: 2 }} />
          <CustomTypographyBold
            color="text.form_input"
            weight={400}
            fontSize={"0.875rem"}
            textTransform={"none"}
          >
            Receipts:
          </CustomTypographyBold>
          <Box
            mt={3}
            sx={{ width: "100%", overflowX: "auto" }}
            className="thin_slider"
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                  gap: 2,
                }}
              >
                {Array.from(new Array(3)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton variant="rectangular" width="100%" height={30} />
                  </Grid>
                ))}
              </Box>
            ) : (
              <>
                {/* {renderFileSection("Receipts", attachments)} */}
                <ExpensesTable expenses={attachments} view={true} />
              </>
            )}
          </Box>
          <Box sx={{ py: 2 }}>
            <CustomTypographyBold
              color="text.form_input"
              weight={400}
              fontSize={"0.875rem"}
              textTransform={"none"}
            >
              Overtime explanation
            </CustomTypographyBold>
            <StyledTextarea
              minRows={3}
              value={overtimeExplanation}
              onChange={handleOvertimeChange}
              placeholder="Explain..."
              isLightMode={isLightMode}
              sx={{ mt: 1, fontFamily: "Inter, sans-serif" }}
            />
          </Box>
          <Divider sx={{ opacity: 0.4 }} />
          <Box
            sx={{
              py: 3,
              display: "flex",
              alignItems: "start",
            }}
          >
            <BpCheckbox
              size="small"
              className={isAgree ? "" : `${"checkbox"}`}
              checked={isAgree}
              onChange={() => setIsAgree(!isAgree)}
              sx={{ mt: -1 }}
            />

            <Box>
              <CustomTypographyBold
                color="text.form_input"
                weight={400}
                fontSize={"0.65rem"}
                textTransform={"none"}
              >
                By signing this work log, you certify that the reported hours
                accurately reflect the time worked for the designated client
                under a contractual relationship.
              </CustomTypographyBold>

              <CustomTypographyBold
                color="text.form_input"
                weight={400}
                fontSize={"0.6rem"}
                textTransform={"none"}
              >
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  You will receive notifications about actions to your email.
                </Typography>
              </CustomTypographyBold>
            </Box>
          </Box>
          <Divider sx={{ opacity: 0.4 }} />
          <Grid container sx={{ py: 2 }}>
            <Grid item xs={6} sx={{ py: 1 }}>
              <Box>
                {isFetchingSignature ? (
                  <Skeleton
                    variant="rectangular"
                    width={400}
                    height={200}
                    animation="wave"
                  />
                ) : signature ? (
                  <Box
                    component={"img"}
                    src={signature?.signature}
                    sx={{ width: "10rem" }}
                  />
                ) : addSignature ? (
                  <Signature add={true} onClose={onAddSignatureHandler} />
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setAddSignature(true)}
                  >
                    Add signature
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <CustomTypographyBold
                color="text.form_input"
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                Signed by {signature?.name}
              </CustomTypographyBold>
              <CustomTypographyBold
                color="text.form_input"
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                {getCurrentDateTime()}
              </CustomTypographyBold>
              <CustomTypographyBold
                color="text.form_input"
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                IP Address: {ipAddress}
              </CustomTypographyBold>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "end" }}>
            <Button
              onClick={onCloseHandler}
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.2)",
                padding: "5px 16px",
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
            <Button
              disabled={!isAgree || !signature || isSubmitting}
              variant="contained"
              color="primary"
              onClick={sendHandler}
              size="small"
              startIcon={
                <Send sx={{ rotate: "-37deg", fontSize: "1rem", mt: -0.6 }} />
              }
              sx={{ textTransform: "none", height: "2.2rem" }}
            >
              {isSubmitting ? <CircularProgress size={18} sx={{}} /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TimeSummaryModal;
