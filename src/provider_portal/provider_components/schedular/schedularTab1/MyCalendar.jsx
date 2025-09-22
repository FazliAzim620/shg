import React, { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import localizer from "../../../../components/common/calendarLocalizer";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { eventStyleGetter, selectOptions } from "../../../../util";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  DoneOutlined,
  FilterList,
  KeyboardArrowDown,
} from "@mui/icons-material";
import doneIcon from "../../../../assets/doneIcon.svg";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import { lineHeight } from "@mui/system";
import { useDispatch } from "react-redux";
import CalendarFilters from "./CalendarFilters";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { fetchProviderSchedules } from "../../../../thunkOperation/job_management/scheduleThunk";

import SkeletonRow from "../../../../components/SkeletonRow";
import NodataFoundCard from "../../NodataFoundCard";
import ScheduleFilter from "./ScheduleFilter";
import AppliedFilterDesign from "../../../../components/common/filterChips/AppliedFilterDesign";
import ClearFilterDesign from "../../../../components/common/filterChips/ClearFilterDesign";
const CustomToolbar = (toolbar) => {
  const params = useParams();
  const dispatch = useDispatch();
  const currentLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step"));
  const [selectedClients, setSelectedClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const open = Boolean(anchorEl);
  const [filterStates, setFilterStates] = useState({
    client: "",
    from_date: "",
    to_date: "",
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState([]);
  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const openFilter = Boolean(anchorElFilter);

  const handleClickFilter = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setAnchorElFilter(null);
  };

  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };
  // ------=============----- getting scheduler data from store -------==============-------
  const { schedules, error } = useSelector((state) => state.providerSchedules);
  const clientOptions = schedules?.clients?.map((client) => client);

  useEffect(() => {
    const id = localStorage.getItem("provider_id");
    if (id) {
      setProviderId(id);
    }
    if (
      params.id &&
      !currentLocation.pathname.includes("service-provider-details")
    ) {
      dispatch(
        fetchProviderSchedules({ provider_id: id, client_id: params.id })
      );
    } else {
      dispatch(fetchProviderSchedules());
    }
  }, [dispatch]);
  // --------------------------======================================================-----------
  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  const filterClient = clientOptions?.find(
    (client) => client?.id == filters?.[0]?.client
  );
  const clearFilterHandler = () => {
    const id = localStorage.getItem("provider_id");
    if (id) {
      setProviderId(id);
    }
    if (params.id) {
      if (currentLocation.pathname.includes("service-provider-details")) {
        dispatch(fetchProviderSchedules({ provider_id: params.id }));
      } else {
        dispatch(
          fetchProviderSchedules({ provider_id: id, client_id: params.id })
        );
      }
      // dispatch(fetchProviderSchedules({ provider_id: id }));
    } else {
      dispatch(fetchProviderSchedules({ provider_id: id }));
    }
    setFilters([]);
  };
  const handleRemove = (filterIndex, key) => {
    const id = localStorage.getItem("provider_id");
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;

      dispatch(
        fetchProviderSchedules({
          provider_id: id,
          client_id: updatedFilters?.[0]?.client,
          from_date: updatedFilters?.[0]?.from_date,
          to_date: updatedFilters?.[0]?.to_date,
        })
      );

      return updatedFilters;
    });
  };

  return (
    <>
      {filters.map((filter, filterIndex) => (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexWrap: "wrap",
            // gap: "16px",
            alignItems: "center",
          }}
          key={filterIndex}
        >
          {Object.entries(filter).map(([key, value]) => {
            if (value !== "") {
              return (
                <Box
                  key={key}
                  sx={{
                    pl: "1rem",

                    display: "flex",
                    flexWrap: "wrap",
                    // gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{
                      py: 0.5,
                      border: "1px solid #DEE2E6",
                      bgcolor: "white",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      px: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        gap: 0.5,
                        color: "#1E2022",
                        fontWeight: 500,
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      {key?.replace("_", " ")}:{" "}
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 500, fontSize: "14px" }}
                      >
                        {key === "client"
                          ? clientOptions?.find((item) => item?.id === value)
                              ?.name
                          : value}
                      </Typography>
                    </Typography>
                    <Close
                      onClick={() => handleRemove(filterIndex, key)}
                      sx={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        color: "#1E2022",
                        pl: "3px",
                      }}
                    />
                  </Button>
                </Box>
              );
            }
            return null;
          })}
          {countAppliedFilters() ? (
            <ClearFilterDesign clearFilters={clearFilterHandler} />
          ) : (
            ""
          )}
        </Box>
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <ScheduleFilter
          clientOptions={selectOptions(clientOptions)}
          setIsDrawerOpen={setIsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          setFilters={setFilters}
          countAppliedFilters={countAppliedFilters}
          filterStates={filterStates}
          setFilterStates={setFilterStates}
          setLoading={setLoading}
          client_id={params.id}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Box> */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <Button
            onClick={goToToday}
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
            This week
          </Button> */}
            <IconButton onClick={goToBack}>
              <ChevronLeft sx={{ color: "text.or_color" }} />
            </IconButton>
            <Box>
              <CustomTypographyBold fontSize={"0.875rem"} height={1.5}>
                {toolbar.label}
              </CustomTypographyBold>
            </Box>
            <IconButton onClick={goToNext}>
              <ChevronRight sx={{ color: "text.or_color" }} />
            </IconButton>
          </Box>
        </Box>

        <Box>
          {/* ------------------------------------------------------------------ */}

          {!currentLocation.pathname.includes("job-provider-sheet") && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                bgcolor: "background.paper",
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: " .8125rem",
                fontWeight: 400,
                borderColor: "rgba(231, 234, 243, .7)",
                "&:hover": {
                  borderColor: "rgba(231, 234, 243, .7)",
                },
                mr: 2,
              }}
              onClick={() => toggleDrawer(true)}
            >
              {countAppliedFilters() > 0 ? (
                <>
                  Clear Filters
                  <Box
                    sx={{
                      bgcolor: "rgba(231, 234, 243, .7)",
                      px: 1,
                      color: "text.black",
                      borderRadius: "50%",
                    }}
                  >
                    {countAppliedFilters()}
                  </Box>
                </>
              ) : (
                "Filter"
              )}
            </Button>
          )}
          {/* ------------------------------------------------------------------ */}

          <Button
            endIcon={<KeyboardArrowDown />}
            onClick={handleClick}
            sx={{
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
                bgcolor: "background.paper",
                color: "text.main",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            {toolbar.view == "agenda" ? "List" : toolbar.view}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {["month", "week", "day", "agenda"].map((view) => (
              <MenuItem
                key={view}
                onClick={() => {
                  toolbar.onView(view);
                  handleClose();
                }}
                sx={{
                  minWidth: "120px",
                  bgcolor:
                    toolbar.view === view &&
                    " rgba(196.88125, 200.3, 203.71875,0.3)",
                }}
              >
                {view === "agenda"
                  ? "List"
                  : view.charAt(0).toUpperCase() + view.slice(1)}
                {toolbar.view === view && (
                  // <DoneOutlined sx={{ fontSize: "1.3rem", ml: 0.5 }} />
                  <Box
                    component={"img"}
                    src={doneIcon}
                    atl="done"
                    sx={{ width: "1rem", ml: 0.5 }}
                  />
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </>
  );
};

const MyCalendar = ({ schedularData, loading, serviceProvider, myJobs }) => {
  const { currentJob } = useSelector((state) => state.currentJob);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.login);
  const [events, setEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  ``;
  const views = {
    month: true,
    week: true,
    day: true,
    agenda: true,
  };

  useEffect(() => {
    if (schedularData?.length > 0) {
      const formattedEvents =
        schedularData &&
        schedularData?.map((event) => {
          const clientName = myJobs
            ? currentJob?.client_name
            : event.job?.client?.name
            ? event.job.client.name
            : "No client added yet";

          return {
            title: `${formatTime(event.start_time)} - ${formatTime(
              event.end_time
            )}`,
            start: new Date(`${event.date}T${event.start_time}`),
            end: new Date(`${event.date}T${event.end_time}`),
            allDay: false,
            details: {
              clientName,
              date: event.date,
              startTime: event.start_time,
              endTime: event.end_time,
            },
          };
        });
      setEvents(formattedEvents);
    } else {
      setEvents([]);
    }
  }, [schedularData]);

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleEventClick = (event, e) => {
    setSelectedEvent(event);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const open = Boolean(anchorEl);

  // Custom date header component for centering the date text
  const CustomDateHeader = ({ label }) => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>{label}</div>
    );
  };
  const eventPropGetter = (event) => {
    const admin = user?.user?.role === "provider" ? "provider" : "admin";

    // Utility function to generate a color based on the string (client name)
    const stringToColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      // Generate a color code from the hash
      const color = `hsl(${hash % 360}, 50%, 80%)`;
      return color;
    };
    const stringToTextColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 2) - hash);
      }
      // Generate a color code from the hash
      const color = `hsl(${hash % 360}, 50%, 80%)`;
      return color;
    };

    // Get the client name from the event details
    const clientName = event.details?.clientName;

    // If clientName exists, generate a dynamic color based on the name
    const color = clientName
      ? stringToColor(clientName)
      : darkMode === "light"
      ? "#b1f1fb"
      : "#EAF1FF";

    const eventStyle = {
      backgroundColor: color,
      borderRadius: "5px",
      // color: clientName
      //   ? stringToTextColor(clientName)
      //   : darkMode === "light"
      //   ? "#b1f1fb"
      //   : "#EAF1FF",
      color: "black",
      // border: "none",
      fontSize: "12px",
      padding: "5px",
      textAlign: "center",
      marginTop: "5px",
    };

    return {
      style: eventStyle,
    };
  };

  return (
    <Box sx={{ mx: 2, borderRadius: "10px" }}>
      <Calendar
        className={
          darkMode == "light" ? "big_calendar_white" : "big_calendar_dark"
        }
        views={views}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "650px", borderRadius: "10px" }}
        onSelectEvent={handleEventClick}
        eventPropGetter={eventPropGetter}
        // eventPropGetter={(event) => {
        //   const admin = user?.user?.role === "provider" ? "provider" : "admin";
        //   const color =
        //     darkMode === "light"
        //       ? user?.user?.role === "provider"
        //         ? "#EAF1FF"
        //         : "#b1f1fb"
        //       : user?.user?.role === "provider"
        //       ? "#EAF1FF"
        //       : "#b1f1fb";
        //   return eventStyleGetter(event, color, admin);
        // }}
        defaultView="month"
        formats={{
          dayFormat: (date, culture, localizer) =>
            localizer.format(date, "EEEE"),
        }}
        components={{
          day: {
            header: CustomDateHeader,
          },
          toolbar: CustomToolbar,
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {selectedEvent && (
          <Box sx={{ padding: "1.5rem", minWidth: "300px" }}>
            <Typography
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                color: "#1e2022",
              }}
            >
              {formatTime(selectedEvent.details.startTime)} -{" "}
              {formatTime(selectedEvent.details.endTime)}
            </Typography>
            <Typography
              sx={{ fontSize: "15px", color: "#1e2022 !important" }}
              mt={2.5}
              ml={2.5}
              display="flex"
              alignItems="center"
            >
              <EventNoteOutlinedIcon
                sx={{ mr: 2, fontSize: "19px", color: "#677778" }}
              />
              {selectedEvent.details.date}
            </Typography>
            <Typography
              sx={{ fontSize: "15px", color: "#1e2022 !important" }}
              pt={1}
              ml={2.5}
              display="flex"
              alignItems="center"
            >
              <AccountCircleOutlinedIcon
                sx={{
                  mr: 2,
                  fontSize: "19px",
                  color: "#677778",
                }}
              />
              Client: {selectedEvent.details.clientName}
            </Typography>

            <Box textAlign={"right"}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 2,
                  textTransform: "capitalize",
                  color: "text.secondary",
                  bgcolor: "white",
                  borderColor: "#EEF0F7",
                  "&:hover": {
                    color: "text.main",
                    bgcolor: "white",
                    borderColor: "#EEF0F7",
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  },
                }}
                onClick={handleClose}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Popover>
    </Box>
  );
};

export default MyCalendar;
