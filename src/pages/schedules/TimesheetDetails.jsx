import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import {
  Box,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  Typography,
} from "@mui/material";

import {
  KeyboardBackspaceOutlined,
  UploadFile,
  Share,
  Check,
  CheckCircleOutlined,
  CancelOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import CustomChip from "../../components/CustomChip";
import API from "../../API";
import { format } from "date-fns";
import TimesheetInfoCard from "./TimesheetInfoCard";
import TimesheetActionModal from "./TimesheetActionModal";
import TimesheetActivity from "./TimesheetActivity";
import { useDispatch } from "react-redux";
import {
  clearCurrentTimesheet,
  setCurrentTimesheet,
  updateCurrentTimesheet,
} from "../../feature/timesheets/timesheetsSlice";
import ExpensesModal from "./ExpensesModal";
import SkeletonRow from "../../components/SkeletonRow";

const TimesheetDetails = () => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();
  const currentTimesheet = useSelector(
    (state) => state.currentTimesheet.currentTimesheet
  );

  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Timesheet", href: "/timesheets" },
    { text: "Details" },
  ];
  const darkMode = useSelector((state) => state.theme.mode);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [clientActionDate, setClientActionDate] = useState("");

  const { currentJob, allWeeks, submitted } = useSelector(
    (state) => state.currentJob
  );
  const [weekData, setWeekData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getDetails = async () => {
    try {
      const resp = await API.get(`/api/get-timesheet-summary/${param?.id}`);
      if (resp?.data?.success) {
        setWeekData(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);
  const NoBorderTableCell = styled(TableCell)(({ theme }) => ({
    border: "none", // Remove the border
    padding: theme.spacing(2),
    color: darkMode == "light" ? "#71869d" : "text.or_color",
    fontWeight: 400,
  }));
  const handleActionClick = (action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleConfirmAction = async (action, notes, signature) => {
    try {
      const formData = new FormData();
      formData.append("data_type", action);
      formData.append("note", notes);
      formData.append("signature", signature);
      const resp = await API.post(
        `/api/submit-timesheet/${param.id}`,
        formData
      );

      if (resp?.data?.success) {
        handleModalClose();
        getDetails();
        dispatch(updateCurrentTimesheet(resp?.data?.data));
        setClientActionDate(resp?.data?.data?.client_action_date);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Cleanup function
    return () => {
      // dispatch(clearCurrentTimesheet());
    };
  }, [dispatch]);

  const shouldShowActions =
    currentTimesheet?.admin_status === "pending_admin_review" ||
    currentTimesheet?.admin_status == null ||
    (currentTimesheet?.timesheet_status === "rejected_by_client" &&
      !currentClient?.id) ||
    (currentTimesheet?.timesheet_status === "approved_by_admin" &&
      currentClient?.id);
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
  const formatTotalHours = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };
  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <ExpensesModal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(!openExpenseModal)}
        data={expenses}
      />
      <TimesheetActionModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmAction}
        action={modalAction}
        timesheetId={param?.id}
      />

      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Breadcrumb
          items={breadcrumbItems}
          title={"Timesheets"}
          id={currentTimesheet?.id}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
              boxShadow: "none",
              color: "text.btn_blue",
              textTransform: "inherit",
              py: 1.2,
              fontSize: "0.875rem",
              fontWeight: 400,
              "&:hover": { color: "#fff", boxShadow: "none" },
            }}
          >
            <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
            Back to timesheets
          </Button>
        </Breadcrumb>
        <Grid container mx={2} mb={5}>
          <Grid item xs={6} md={3} xl={2.5}>
            <Box>
              <CustomTypographyBold
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                Timesheets status
              </CustomTypographyBold>
              <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
                <CustomChip
                  dot={true}
                  width={
                    currentTimesheet?.status === "send" ||
                    currentTimesheet?.status === "submitted_by_provider"
                      ? 40
                      : 80
                  }
                  chipText={
                    currentTimesheet?.timesheet_status ===
                      "approved_by_admin" ||
                    currentTimesheet?.timesheet_status === "approved_by_client"
                      ? "Approved"
                      : currentTimesheet?.timesheet_status ===
                          "rejected_by_admin" ||
                        currentTimesheet?.timesheet_status ===
                          "rejected_by_client"
                      ? "Rejected"
                      : currentTimesheet?.status === "submitted_by_provider"
                      ? "Submitted"
                      : "Not Submitted"
                  }
                  color={
                    currentTimesheet?.status === "send" ||
                    currentTimesheet?.status === "submitted_by_provider"
                      ? currentTimesheet?.timesheet_status ===
                        "approved_by_client"
                        ? "white"
                        : currentTimesheet?.timesheet_status ===
                          "submitted_by_provider"
                        ? "black"
                        : currentTimesheet?.timesheet_status ===
                            "rejected_by_client" ||
                          currentTimesheet?.timesheet_status ===
                            "rejected_by_admin"
                        ? "white"
                        : "rgba(0, 201, 167)"
                      : "rgba(237, 76, 120)"
                  }
                  bgcolor={
                    currentTimesheet?.status === "send" ||
                    currentTimesheet?.status === "submitted_by_provider"
                      ? currentTimesheet?.timesheet_status ===
                        "approved_by_client"
                        ? "rgba(0, 201, 167)"
                        : currentTimesheet?.timesheet_status ===
                          "submitted_by_provider"
                        ? "#DEE0E7"
                        : currentTimesheet?.timesheet_status ===
                            "rejected_by_client" ||
                          currentTimesheet?.timesheet_status ===
                            "rejected_by_admin"
                        ? "rgba(237, 76, 120)"
                        : "rgba(0, 201, 167, 0.1)"
                      : "rgba(237, 76, 120, 0.1)"
                  }
                />
                <CustomTypographyBold
                  weight={600}
                  color="text.black"
                  textTransform={"none"}
                >
                  {currentTimesheet?.timesheet_status === "approved_by_admin" ||
                  currentTimesheet?.timesheet_status === "rejected_by_admin"
                    ? "by admin"
                    : currentTimesheet?.timesheet_status ===
                        "approved_by_client" ||
                      currentTimesheet?.timesheet_status ===
                        "rejected_by_client"
                    ? "by client"
                    : "by provider"}
                </CustomTypographyBold>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3} xl={2.5}>
            <Box>
              <CustomTypographyBold
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                Action required
              </CustomTypographyBold>
              <Box sx={{ display: "flex", mt: 1 }}>
                {currentTimesheet?.status === "send" ||
                (currentTimesheet?.status === "submitted_by_provider" &&
                  currentTimesheet?.timesheet_status !==
                    "rejected_by_admin") ? (
                  <>
                    {currentTimesheet?.timesheet_status ==
                      "approved_by_admin" &&
                      currentTimesheet?.timesheet_status !==
                        "approved_by_client" &&
                      currentTimesheet?.timesheet_status !==
                        "rejected_by_client" && (
                        <CustomChip
                          dot={true}
                          width={40}
                          dotColor="rgba(245, 202, 153)"
                          chipText={
                            currentTimesheet?.timesheet_status ===
                            "approved_by_admin"
                              ? "Pending"
                              : "Pending"
                          }
                          color="text.black"
                          bgcolor={"rgba(245, 202, 153, 0.1)"}
                        />
                      )}
                    <CustomTypographyBold
                      weight={600}
                      color="text.black"
                      textTransform={"none"}
                    >
                      {currentTimesheet?.timesheet_status ===
                      "approved_by_admin"
                        ? "Awaiting client approval"
                        : currentTimesheet?.timesheet_status ===
                          "approved_by_client"
                        ? "No"
                        : currentTimesheet?.timesheet_status ===
                          "rejected_by_client"
                        ? "Correction required"
                        : "Review by SHG"}
                    </CustomTypographyBold>
                  </>
                ) : (
                  <CustomTypographyBold
                    weight={600}
                    color="text.black"
                    textTransform={"none"}
                  >
                    Re-submission Required
                  </CustomTypographyBold>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={2.5} xl={2.5}>
            <Box>
              <CustomTypographyBold
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                Client approval status
              </CustomTypographyBold>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, pt: 0.3 }}
              >
                <Box sx={{ display: "flex", mt: 1, gap: 1 }}>
                  {currentTimesheet?.timesheet_status == "approved_by_admin" ||
                    (currentTimesheet?.timesheet_status ===
                      "approved_by_client" && (
                      <CustomChip
                        dot={true}
                        width={currentTimesheet?.status === "send" ? 40 : 80}
                        chipText={
                          currentTimesheet?.timesheet_status ===
                          "approved_by_client"
                            ? "Approved"
                            : currentTimesheet?.timesheet_status ===
                              "rejected_by_admin"
                            ? "Rejected"
                            : "Pending"
                        }
                        color={
                          currentTimesheet?.status === "send" ||
                          currentTimesheet?.status === "submitted_by_provider"
                            ? currentTimesheet?.timesheet_status ===
                              "approved_by_client"
                              ? "rgba(0, 201, 167)"
                              : "rgba(0, 201, 167, 0.1)"
                            : "rgba(237, 76, 120)"
                        }
                        bgcolor={
                          currentTimesheet?.status === "send" ||
                          currentTimesheet?.status === "submitted_by_provider"
                            ? currentTimesheet?.timesheet_status ===
                              "approved_by_client"
                              ? "rgba(0, 201, 167, 0.1)"
                              : "rgba(0, 201, 167)"
                            : "rgba(237, 76, 120, 0.1)"
                        }
                      />
                    ))}

                  {currentTimesheet?.timesheet_status ===
                    "approved_by_admin" && (
                    <CustomChip
                      dot={true}
                      dotColor="rgba(245, 202, 153)"
                      width={currentTimesheet?.status === "send" ? 40 : 80}
                      chipText={"Pending"}
                      color="text.black"
                      bgcolor={"rgba(245, 202, 153, 0.1)"}
                    />
                  )}
                  <CustomTypographyBold
                    weight={600}
                    color="text.black"
                    textTransform={"none"}
                  >
                    {currentTimesheet?.timesheet_status === "approved_by_admin"
                      ? "Client review"
                      : currentTimesheet?.timesheet_status ===
                        "rejected_by_admin"
                      ? "N/A"
                      : currentTimesheet?.timesheet_status ===
                        "approved_by_client"
                      ? clientActionDate
                        ? clientActionDate
                        : currentTimesheet?.client_action_date || "--"
                      : currentTimesheet?.timesheet_status ===
                        "submitted_by_provider"
                      ? "N/A"
                      : "N/A"}
                  </CustomTypographyBold>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={3} xl={2.5}>
            <Box>
              <CustomTypographyBold
                weight={400}
                fontSize={"0.875rem"}
                textTransform={"none"}
              >
                Invoice status
              </CustomTypographyBold>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, pt: 0.3 }}
              >
                {/* <CustomChip
                dot={true}
                width={40}
                chipText="Submitted"
                color={"text.black"}
                bgcolor={" rgba(0, 0, 0, 0.1)"}
                dotColor={"black"}
              /> */}
                <CustomTypographyBold
                  weight={600}
                  color="text.black"
                  textTransform={"none"}
                >
                  Not yet invoiced
                </CustomTypographyBold>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ opacity: 0.3 }} />
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",

              mx: "auto",
            }}
          >
            <SkeletonRow column={8} />
            <SkeletonRow column={8} />
            <SkeletonRow column={8} />
            <SkeletonRow column={8} />
          </Box>
        ) : (
          <Grid container mt={5}>
            <Grid
              item
              xs={12}
              md={8.7}
              xl={9}
              sx={{
                order: { xs: 2, md: 1 },
                mr: { md: 1.8 },
                ml: { md: 1.3 },
              }}
            >
              <Box
                sx={{
                  minHeight: "50vh",
                  overflowX: "hidden",
                  mb: 2,
                }}
              >
                {/* ------------------------------------------------------------------- table  and header */}
                <Box
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "background.paper",

                    pt: "1rem",
                    pb: "1.5rem",
                    boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
                  }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    pb={2}
                    sx={{ px: "1.5rem" }}
                  >
                    <CustomTypographyBold
                      color="text.black"
                      fontSize={"1.1rem"}
                    >
                      Timesheet details
                    </CustomTypographyBold>
                    {shouldShowActions && (
                      <Box display={"flex"} gap={1} justifyContent={"end"}>
                        <Button
                          variant="contained"
                          startIcon={<CheckCircleOutlined sx={{ width: 16 }} />}
                          onClick={() =>
                            handleActionClick(
                              currentClient?.id
                                ? "admin_client_approve"
                                : "admin_approve"
                            )
                          }
                          sx={{
                            bgcolor: "background.btn_blue",
                            boxShadow: "none",
                            color: "white",
                            textTransform: "inherit",
                            px: 1.5,
                            fontSize: "0.875rem",
                            fontWeight: 400,
                          }}
                        >
                          Approve
                        </Button>

                        <Button
                          variant="contained"
                          startIcon={<CancelOutlined sx={{ width: 16 }} />}
                          onClick={() =>
                            handleActionClick(
                              currentClient?.id
                                ? "admin_client_reject"
                                : "admin_reject"
                            )
                          }
                          sx={{
                            bgcolor: "background.btn_blue",
                            boxShadow: "none",
                            color: "white",
                            textTransform: "inherit",
                            px: 1.5,
                            fontSize: "0.875rem",
                            fontWeight: 400,
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ opacity: 0.4 }} />
                  <Box sx={{ p: "1.5rem" }}>
                    <Table>
                      <TableHead
                        sx={{
                          bgcolor:
                            darkMode === "light"
                              ? "#F8FAFD"
                              : "background.navbar_bg",
                        }}
                      >
                        <TableRow>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Date
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Day
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Start Time
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            End Time
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Regular Hours
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Overtime Hours
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Expenses
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Total Hours
                          </NoBorderTableCell>
                          <NoBorderTableCell sx={{ py: 1 }}>
                            Attachments
                          </NoBorderTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {weekData?.timesheets?.map((timesheet) =>
                          timesheet?.timesheet_details?.map((shift, index) => {
                            const eHours = parseInt(
                              shift.end_time.split(":")[0],
                              10
                            );
                            const eMinutes = shift.end_time.split(":")[1];
                            const ePeriod = eHours >= 12 ? "PM" : "AM";
                            const eFormattedHours = eHours % 12 || 12;

                            const sHours = parseInt(
                              shift.start_time.split(":")[0],
                              10
                            );
                            const sMinutes = shift.start_time.split(":")[1];
                            const sPeriod = sHours >= 12 ? "PM" : "AM";
                            const sFormattedHours = sHours % 12 || 12;
                            return (
                              <TableRow key={shift.id}>
                                <NoBorderTableCell sx={{ fontWeight: 600 }}>
                                  {format(timesheet.date, "dd/MM/yy")}
                                </NoBorderTableCell>
                                <NoBorderTableCell>
                                  {timesheet.day}
                                </NoBorderTableCell>

                                <NoBorderTableCell sx={{ width: 100 }}>
                                  {/* {shift.end_time || "--"} */}
                                  {sFormattedHours}:{sMinutes} {sPeriod}
                                </NoBorderTableCell>
                                <NoBorderTableCell sx={{ width: 100 }}>
                                  {/* {shift.end_time || "--"} */}
                                  {eFormattedHours}:{eMinutes} {ePeriod}
                                </NoBorderTableCell>
                                <NoBorderTableCell>
                                  {shift.regular_hours || "0"}
                                </NoBorderTableCell>
                                <NoBorderTableCell>
                                  {shift.overtime_hours || "0"}
                                </NoBorderTableCell>
                                <NoBorderTableCell>
                                  {shift?.timesheet_detail_attachments
                                    ?.reduce(
                                      (sum, item) => sum + item.amount,
                                      0
                                    )
                                    .toFixed(2)}
                                </NoBorderTableCell>

                                <NoBorderTableCell>
                                  {Number(shift.regular_hours) +
                                    Number(shift.overtime_hours) || "0"}
                                </NoBorderTableCell>
                                <NoBorderTableCell>
                                  <Button
                                    disabled={
                                      shift?.timesheet_detail_attachments
                                        ?.length === 0
                                    }
                                    onClick={() => {
                                      setOpenExpenseModal(true);
                                      setExpenses(shift);
                                    }}
                                    variant="text"
                                    sx={{
                                      bgcolor: darkMode === "dark" && "gray",
                                      color:
                                        darkMode === "light"
                                          ? "text.btn_blue"
                                          : "white",
                                    }}
                                  >
                                    {shift?.timesheet_detail_attachments
                                      ?.length || "0"}
                                  </Button>
                                </NoBorderTableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </Box>{" "}
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
                  <Divider sx={{ opacity: 0.4, mt: 3 }} />
                  <Box sx={{ py: 2, px: "1.5rem" }}>
                    <CustomTypographyBold
                      color="text.form_input"
                      weight={400}
                      fontSize={"0.875rem"}
                      textTransform={"none"}
                    >
                      Overtime explanation
                    </CustomTypographyBold>
                    <CustomTypographyBold
                      color="text.form_input"
                      weight={400}
                      fontSize={"0.65rem"}
                      textTransform={"none"}
                    >
                      {weekData?.overtime_explanation}
                    </CustomTypographyBold>
                  </Box>
                  <Box sx={{ py: 2, px: "1.5rem" }}>
                    <CustomTypographyBold
                      color="text.form_input"
                      fontSize={"0.875rem"}
                      textTransform={"none"}
                    >
                      Provider signature
                    </CustomTypographyBold>
                    {weekData?.signature ? (
                      <Box
                        component={"img"}
                        src={JSON.parse(weekData?.signature)?.signature}
                        sx={{ width: "10rem" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          minWidth: "4rem",
                          height: "4rem",
                          bgcolor: "background.navbar_bg",
                        }}
                      ></Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.or_color"
                    sx={{ px: "1.5rem" }}
                  >
                    © 2024 SHG Helthcare.
                  </Typography>
                </Box>
              </Box>
              {/* ============================================================= Activity section */}
              <TimesheetActivity
                data={weekData?.history}
                timesheet={currentTimesheet}
              />
            </Grid>

            <Grid item xs={12} md={3} xl={2.7} sx={{ order: { xs: 1, md: 2 } }}>
              <TimesheetInfoCard data={currentTimesheet} job={weekData?.job} />{" "}
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default TimesheetDetails;
