import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Menu, MenuItem, Button } from "@mui/material";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const CalnderView = () => {
  const [view, setView] = useState("month"); // Default view is 'month'
  const [anchorEl, setAnchorEl] = useState(null); // For managing dropdown anchor
  const [date, setDate] = useState(new Date());

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open dropdown
  };

  const handleClose = (selectedView) => {
    if (selectedView) {
      setView(selectedView); // Set the selected view (Month, Week, Day, or List)
    }
    setAnchorEl(null); // Close dropdown
  };

  // Render Week View
  const renderWeekView = () => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    const weekDays = eachDayOfInterval({ start, end });

    return (
      <div>
        <h3>
          Week of {format(start, "MMM dd")} - {format(end, "MMM dd")}
        </h3>
        <div className="week-view">
          {weekDays.map((day) => (
            <div key={day} className="day-box">
              <p>{format(day, "EEEE, MMM dd")}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => (
    <div>
      <h3>{format(date, "MMMM dd, yyyy")}</h3>
      <p>Details for the day will go here...</p>
    </div>
  );

  // Render List View
  const renderListView = () => (
    <div>
      <h3>List of Events</h3>
      <p>Events for the selected date will go here...</p>
    </div>
  );

  return (
    <div style={{ height: "500px" }}>
      {/* Dropdown Button */}
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleClick}
      >
        Select View
      </Button>

      {/* Dropdown Menu */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        <MenuItem onClick={() => handleClose("month")}>Month</MenuItem>
        <MenuItem onClick={() => handleClose("week")}>Week</MenuItem>
        <MenuItem onClick={() => handleClose("day")}>Day</MenuItem>
        <MenuItem onClick={() => handleClose("list")}>List</MenuItem>
      </Menu>

      {/* Calendar Component */}
      {view === "month" && (
        <Calendar
          onChange={setDate}
          value={date}
          style={{ marginTop: "20px" }}
        />
      )}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
      {view === "list" && renderListView()}
    </div>
  );
};

export default CalnderView;
