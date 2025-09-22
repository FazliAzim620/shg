import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  Menu,
  Alert,
  Skeleton,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import Calendar from "react-calendar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Add, ExpandMoreOutlined } from "@mui/icons-material";
import { formatTo12Hour } from "../../../../util";
import CalendarFilters from "./CalendarFilters";
import { flxCntrSx } from "../../../../components/constants/data";
import EventDetailModal from "./EventDetailModal";
import { Link } from "react-router-dom";

const SchedulerCalendar = ({ darkMode, schedules, clientOptions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [isThisWeek, setIsThisWeek] = useState(false); // State for "This Week" filter
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const [selectedClients, setSelectedClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null); // For Popover
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAllEvents, setShowAllEvents] = useState({});
  const clickAwayRef = useRef(null);

  const rightLeftStyling = {
    cursor: "pointer",
    color: "#71869d",
    fontSize: "2.2rem",
    p: 1,
    "&:hover": {
      borderRadius: "100%",
      color: "#6d4a96",
      backgroundColor: "rgba(55, 125, 255, .1)",
    },
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleEventClick = (event, eventDetails) => {
    setSelectedEvent(eventDetails);
    setShowAllEvents({});
    setPopoverAnchorEl(event.currentTarget); // Set the anchor element for the popover
  };

  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
    setSelectedEvent(null);
  };

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1); // Go to the previous month
    setCurrentDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1); // Go to the next month
    setCurrentDate(nextMonth);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const day = localDate.toISOString().split("T")[0];

      const eventsForDay =
        schedules?.filter((event) => {
          const eventDate = new Date(event.date);
          const eventDay = eventDate.toISOString().split("T")[0];
          return eventDay === day;
        }) || [];

      return (
        <Box
          className="thin_slider"
          sx={{
            height: "6rem",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
          ref={clickAwayRef}
        >
          {eventsForDay.length > 0 && showAllEvents[day]
            ? eventsForDay.map((event, index) => (
                <Button
                  onClick={(e) => handleEventClick(e, event)}
                  key={index}
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    bgcolor: "primary.main",
                    color: "#fff",
                    borderRadius: "8px",
                    p: "0.2rem 0rem",
                    "&:hover": {
                      color: "text.main",
                    },
                  }}
                >
                  {formatTo12Hour(event?.start_time)} -{" "}
                  {formatTo12Hour(event?.end_time)}
                </Button>
              ))
            : eventsForDay.length > 0 && (
                <ClickAwayListener
                  onClickAway={() => toggleShowAllEvents(day, false)}
                  mouseEvent="onMouseDown"
                  touchEvent="onTouchStart"
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      onClick={(e) => handleEventClick(e, eventsForDay?.[0])}
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        lineHeight: 1.5,
                        bgcolor: "primary.main",
                        color: "#fff",
                        // borderRadius: "8px",
                        p: "0.2rem ",
                        "&:hover": {
                          color: "text.main",
                        },
                      }}
                    >
                      {eventsForDay?.length > 0 &&
                        formatTo12Hour(eventsForDay?.[0]?.start_time)}{" "}
                      -
                      {eventsForDay?.length > 0 &&
                        formatTo12Hour(eventsForDay?.[0]?.end_time)}
                    </Button>
                    {eventsForDay.length > 1 && (
                      <IconButton
                        onClick={() => toggleShowAllEvents(day, true)}
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          mt: 2,
                          width: "2rem",
                          color: "text.main",
                          borderRadius: "8px",
                          p: "0.2rem 0rem",
                          "&:hover": {
                            color: "text.main",
                          },
                        }}
                      >
                        <Add />
                      </IconButton>
                    )}
                  </Box>
                </ClickAwayListener>
              )}
        </Box>
      );
    }
    return null;
  };

  const toggleShowAllEvents = (day, show) => {
    setShowAllEvents((prevState) => ({
      ...prevState,
      [day]: show,
    }));
  };

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "event-details-popover" : undefined;

  return (
    <>
      <Box sx={{ mt: 4, mx: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ ...flxCntrSx, mb: 4 }}>
            {/* <Button
              sx={{
                color: "text.secondary",
                backgroundColor:
                  darkMode == "light" ? "#fff" : "background.paper",
                borderColor: "rgba(231, 234, 243, .7)",
                boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",
                fontWeight: 400,
                fontSize: "0.875rem",
                textTransform: "none",
                "&:hover": {
                  color: darkMode == "light" ? "#4f3870" : "#fff",
                  backgroundColor:
                    darkMode == "light" ? "#fff" : "background.paper",
                },
              }}
              onClick={() => setIsThisWeek(!isThisWeek)} // Toggle week filter
            >
              {!isThisWeek ? "This week" : "All events"}
            </Button> */}

            <Tooltip title="Previous Month" placement="top" arrow>
              <ChevronLeftIcon
                sx={rightLeftStyling}
                onClick={goToPreviousMonth}
              />
            </Tooltip>
            <Tooltip title="Next Month" placement="top" arrow>
              <ChevronRightIcon sx={rightLeftStyling} onClick={goToNextMonth} />
            </Tooltip>

            <Typography
              variant="h6"
              sx={{
                mx: 2,
                fontWeight: 600,

                lineHeight: 1.2,
                color: darkMode == "light" ? "#1e2022" : "text.main",
                fontSize: "1rem",
              }}
            >
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(currentDate)}
            </Typography>
          </Box>

          <Box>
            <Box>
              {/* <Tooltip
              placement="top"
              arrow
              title={
                clientOptions?.length < 2
                  ? "Filters are not applicable because y ou have no client"
                  : "Filters clients"
              }
            > */}
              <Button
                disabled={clientOptions?.length > 1 ? false : true}
                startIcon={<FilterListIcon />}
                endIcon={<ExpandMoreOutlined />}
                variant="outlined"
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  color: "text.secondary",
                  bgcolor: darkMode === "light" ? "white" : "background.paper",
                  borderColor: "#EEF0F7",
                  "&:hover": {
                    color: "#4F3870",
                    bgcolor: "white",
                    borderColor: "#EEF0F7",
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  },
                }}
                onClick={handleFilterClick}
              >
                Filter
              </Button>
              {/* </Tooltip> */}

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <CalendarFilters
                  close={handleFilterClose}
                  myCalendars={clientOptions}
                  setLoading={setLoading}
                  selectedClients={[]}
                  setSelectedClients={() => {}}
                />
              </Menu>

              {/* <Button
                variant="outlined"
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  bgcolor: "background.paper",
                  borderColor: "#EEF0F7",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
                onClick={toggleView}
              >
                {currentView === "month" ? "Month" : "Day"}
              </Button> */}
            </Box>

            <Menu
              anchorEl={filterAnchorEl}
              open={isFilterMenuOpen}
              onClose={handleFilterClose}
            >
              <CalendarFilters
                close={handleFilterClose}
                myCalendars={clientOptions}
                setLoading={setLoading}
                selectedClients={selectedClients}
                setSelectedClients={setSelectedClients}
              />
            </Menu>
          </Box>
        </Box>

        {isThisWeek && (
          <Alert severity="info" sx={{ mb: 2, textAlign: "center" }}>
            You are now viewing 'This Week' events.&nbsp;
            <Link onClick={() => setIsThisWeek(false)}>
              Show All Events again
            </Link>
          </Alert>
        )}

        {/* Show skeleton while loading */}
        {loading ? (
          <Box sx={{ width: "full", gap: 2 }}>
            <Skeleton height={100} sx={{ mt: 1 }} animation="wave" />
            <Skeleton height={100} sx={{ mt: 1 }} animation="wave" />
            <Skeleton height={100} sx={{ mt: 1 }} animation="wave" />
            <Skeleton height={100} sx={{ mt: 1 }} animation="wave" />
            <Skeleton height={100} sx={{ mt: 1 }} animation="wave" />
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid #EDF2F7",

              minHeight: "calc(100vh - 20rem)",
              bgcolor: "background.paper",
              p: 1,
              borderRadius: "10px",
            }}
          >
            <Calendar
              className={darkMode === "dark" && `custom_calendar`}
              value={currentDate}
              onChange={handleDateChange}
              tileContent={renderTileContent}
              view="month"
              showNavigation={false}
              onActiveStartDateChange={({ activeStartDate }) =>
                setCurrentDate(activeStartDate)
              }
            />
          </Box>
        )}
      </Box>
      <EventDetailModal
        handleClosePopover={handleClosePopover}
        popoverAnchorEl={popoverAnchorEl}
        isPopoverOpen={isPopoverOpen}
        popoverId={popoverId}
        selectedEvent={selectedEvent}
      />
    </>
  );
};

export default SchedulerCalendar;
