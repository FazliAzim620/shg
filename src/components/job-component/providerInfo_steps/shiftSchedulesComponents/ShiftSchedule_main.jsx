import React, { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizer from "../../../common/calendarLocalizer";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { formatTime, formatTo12Hour } from "../../../../util";
import { eventStyleGetter } from "../../../../util";
import { setJobId } from "../../../../feature/shiftSchedulesSlice";
import CustomBadge from "../../../CustomBadge";
import AddEditShiftModal from "./AddEditShiftModal";
import { fetchShiftSchedules } from "../../../../thunkOperation/job_management/providerInfoStep";
import CustomTypographyBold from "../../../CustomTypographyBold";
import { updateNewUserDataField } from "../../../../feature/jobSlice";

const ShiftSchedule_main = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.login);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const dispatch = useDispatch();
  const params = useParams();
  const { schedules } = useSelector((state) => state.shiftSchedules);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchShiftSchedules(params?.id));
    dispatch(setJobId(params?.id));
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const newEvents = schedules.map((schedule) => {
        const startDate = new Date(`${schedule.date}T${schedule.start_time}`);
        const endDate = new Date(`${schedule.date}T${schedule.end_time}`);

        return {
          start: startDate,
          end: endDate,
          date: schedule?.date,
          start_time: schedule?.start_time,
          end_time: schedule?.end_time,
          title: `${formatTo12Hour(schedule.start_time)} - ${formatTo12Hour(
            schedule.end_time
          )}`,
          id: schedule.id,
        };
      });

      setEvents(newEvents);
    } else {
      dispatch(
        updateNewUserDataField({ field: "shift_schedules_count", value: 0 })
      );
    }
  }, [schedules]);

  const handleOpen = (event = null) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Custom Date Header Component
  const CustomDateHeader = ({ label }) => (
    <div style={{ marginBottom: "10px", textAlign: "center" }}>
      <span>{label}</span>
    </div>
  );
  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: ".75rem",
          backgroundColor: "text.paper",
          boxShadow: "none",
        }}
      >
        <CardHeader
          sx={{
            pb: 1.5,
            borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
          }}
          title={
            <Box
              sx={{
                ml: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "text.black",
                }}
              >
                Shift schedules
                <CustomBadge
                  color={
                    schedules?.[0]?.id
                      ? "rgba(0, 201, 167)"
                      : "rgba(55, 125, 255)"
                  }
                  bgcolor={
                    schedules?.[0]?.id
                      ? "rgba(0, 201, 167, .1)"
                      : "rgba(55, 125, 255, .1)"
                  }
                  text={schedules?.[0]?.id ? "Completed" : "In progress"}
                  width="90px"
                  ml={6}
                />
              </Typography>
              {permissions?.includes("create job management info") ? (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: "#3b82f6",
                  }}
                  startIcon={<Add />}
                  onClick={() => handleOpen()}
                >
                  Create schedule
                </Button>
              ) : (
                ""
              )}
            </Box>
          }
        />
        <CardContent sx={{ p: 2, mt: 0.5 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ minHeight: 870, height: "100%" }}
            eventPropGetter={(event) => {
              const width = "90%";
              const admin =
                user?.user?.role === "provider" ? "provider" : "admin";
              const color =
                darkMode === "light"
                  ? user?.user?.role === "provider"
                    ? "#EAF1FF"
                    : "#b1f1fb"
                  : user?.user?.role === "provider"
                  ? "#EAF1FF"
                  : "#b1f1fb";
              const marginBottom = "10px";
              const style = eventStyleGetter(event, color, admin, width);

              return {
                style: {
                  ...style.style,

                  marginBottom,
                },
              };
            }}
            onSelectEvent={(event) => handleOpen(event)}
            components={{
              toolbar: CustomToolbar,
            }}
          />
        </CardContent>
      </Card>

      {/* AddEditModal component */}
      <AddEditShiftModal
        darkMode={darkMode}
        modalOpen={modalOpen}
        handleClose={handleClose}
        selectedEvent={selectedEvent}
        permissions={permissions}
      />
    </>
  );
};

export default ShiftSchedule_main;
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };
  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          {toolbar.view === "day" ? (
            <Button
              onClick={() => toolbar.onView("month")}
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.or_color",
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
              Back
            </Button>
          ) : (
            ""
            // <Button
            //   onClick={goToToday}
            //   sx={{
            //     mr: 2,
            //     textTransform: "capitalize",
            //     color: "text.or_color",
            //     fontSize: "0.8125rem",
            //     fontWeight: 400,
            //     border: "1px solid rgba(99, 99, 99, 0.2)",
            //     padding: "5px 16px",
            //     minWidth: 0,
            //     bgcolor: "background.paper",
            //     "&:hover": {
            //       boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            //       color: "text.main",
            //       transform: "scale(1.01)",
            //     },
            //     "&:focus": {
            //       outline: "none",
            //     },
            //   }}
            // >
            //   This week
            // </Button>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton onClick={goToBack}>
              <ChevronLeft sx={{ color: "text.or_color" }} />
            </IconButton>
            <Box sx={{ m: 2 }}>
              <CustomTypographyBold fontSize={"0.875rem"} height={1.5}>
                {toolbar.label}
              </CustomTypographyBold>
            </Box>
            <IconButton onClick={goToNext}>
              <ChevronRight sx={{ color: "text.or_color" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
