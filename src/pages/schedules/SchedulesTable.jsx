import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  TablePagination,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import CustomChip from "../../components/CustomChip";
import {
  CheckOutlined,
  ExpandLess,
  ExpandMore,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/Routes";
import { setCurrentTimesheet } from "../../feature/timesheets/timesheetsSlice";
import { useDispatch } from "react-redux";
import { formatTo12Hour } from "../../util";
import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";
const SchedulesTable = ({
  shiftTab,
  timesheets,
  page,
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
  darkMode,
}) => {
  const dispatch = useDispatch();
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [expandMenuAnchor, setExpandMenuAnchor] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const navigate = useNavigate();
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTimesheets(timesheets?.data?.map((client) => client.id) || []);
    } else {
      setSelectedTimesheets([]);
    }
  };
  const handleSelectClient = (event, client_id) => {
    const selectedIndex = selectedTimesheets.indexOf(client_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedTimesheets, client_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedTimesheets.slice(1));
    } else if (selectedIndex === selectedTimesheets.length - 1) {
      newSelected = newSelected.concat(selectedTimesheets.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedTimesheets.slice(0, selectedIndex),
        selectedTimesheets.slice(selectedIndex + 1)
      );
    }
    setSelectedTimesheets(newSelected);
  };

  const viewTimesheetDetails = (timesheet) => {
    navigate(`${ROUTES.timesheetDetails}/${timesheet?.id}`);

    dispatch(setCurrentTimesheet(timesheet));
  };

  const handleExpandClick = (event, rowId) => {
    setExpandMenuAnchor(event.currentTarget);
    setExpandedRowId(rowId);
  };

  const handleExpandClose = () => {
    setExpandMenuAnchor(null);
    setExpandedRowId(null);
  };

  // Calculate the width for each column
  const columnCount = 11; // Including the checkbox column
  const columnWidth = `${100 / columnCount}%`;
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          overflowX: "auto",
          borderRadius: "0 0 10px 10px",
        }}
        className="thin_slider"
      >
        <Table sx={{ minWidth: 1440 }}>
          {" "}
          {/* Set a minimum width to ensure scrolling */}
          <TableHead
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#f9fafc",
            }}
          >
            <TableRow>
              <TableCell padding="checkbox" sx={{ minWidth: columnWidth }}>
                <BpCheckbox
                  className={`${selectedTimesheets.length < 1 && "checkbox"}`}
                  indeterminate={
                    selectedTimesheets.length > 0 &&
                    selectedTimesheets.length < (timesheets?.data?.length || 0)
                  }
                  checked={
                    timesheets?.data?.length > 0 &&
                    selectedTimesheets.length === timesheets?.data?.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Shift ID</TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Provider Name
              </TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>Recruiter</TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Role and Speciality
              </TableCell>
              {!shiftTab && (
                <TableCell sx={{ minWidth: columnWidth }}>
                  Client Name
                </TableCell>
              )}
              <TableCell sx={{ minWidth: columnWidth }}>Date</TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>Start Time</TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>End Time</TableCell>
              {/* <TableCell sx={{ minWidth: columnWidth }}>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {timesheets?.data?.length > 0 ? (
              timesheets.data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      index % 2 === 0
                        ? darkMode === "dark"
                          ? "#2F3235"
                          : "white"
                        : darkMode === "dark"
                        ? "rgba(0, 0, 0, 0.5)"
                        : "#f9fafc",
                  }}
                >
                  {/* =================================checkboxes=================================== */}
                  <TableCell padding="checkbox" sx={{ minWidth: columnWidth }}>
                    <BpCheckbox
                      className={
                        selectedTimesheets.includes(row.id) ? "" : "checkbox"
                      }
                      checked={selectedTimesheets.includes(row.id)}
                      onChange={(event) => handleSelectClient(event, row.id)}
                    />
                  </TableCell>
                  {/* ======================shift id============================= */}
                  <TableCell>{row.id}</TableCell>
                  {/* ======================provider detail========================= */}
                  <TableCell
                    sx={{ minWidth: columnWidth, display: "flex", gap: 1 }}
                  >
                    <Avatar />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textTransform: "capitalize",
                          color: "text.black",
                        }}
                      >
                        {row.job?.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.job?.email || "--"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: columnWidth }}>
                    {" "}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textTransform: "capitalize",
                        color: "text.black",
                      }}
                    >
                      {row.job?.provider?.recruiter?.name || "--"}
                    </Typography>
                  </TableCell>

                  {/* ==============provider role and speciality==================== */}
                  <TableCell sx={{ minWidth: columnWidth }}>
                    <Typography
                      sx={{ color: "text.black", fontWeight: "500" }}
                      variant="body2"
                    >
                      {row.job?.role?.name || "--"}
                    </Typography>
                    <Typography variant="body2">
                      {row.job?.speciality?.name || "--"}
                    </Typography>
                  </TableCell>
                  {/* ===============================client name=================== */}
                  {!shiftTab && (
                    <TableCell
                      sx={{
                        minWidth: columnWidth,
                        textTransform: "capitalize",
                        color: "text.black",
                        fontWeight: "500",
                      }}
                    >
                      {row.job?.client_name || "--"}
                    </TableCell>
                  )}

                  {/* ===============================date========================== */}
                  <TableCell sx={{ minWidth: columnWidth }}>
                    <Typography variant="body2">{row?.date || "--"}</Typography>
                  </TableCell>

                  {/* =============================== start time ==================== */}
                  <TableCell
                    sx={{
                      minWidth: columnWidth,
                    }}
                  >
                    {formatTo12Hour(row.start_time)}
                  </TableCell>

                  {/* ===============================End time ====================== */}
                  <TableCell
                    sx={{
                      minWidth: columnWidth,
                    }}
                  >
                    {formatTo12Hour(row.end_time)}
                  </TableCell>

                  {/* ===============================Actions====================== */}
                  {/* <TableCell sx={{ minWidth: columnWidth }}>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    aria-label="Platform"
                  >
                    <ToggleButton
                      onClick={() => viewTimesheetDetails(row)}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        color: "text.primary",
                        fontSize: "0.8125rem",
                        fontWeight: 400,
                        mr: "1px",
                        padding: "5px 16px",
                        minWidth: 0,
                        borderColor: "rgba(99, 99, 99, 0.1)",
                        bgcolor: "background.paper",
                        "&:hover": {
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          color: "text.btn_blue",
                          transform: "scale(1.01)",
                        },
                        "&:focus": { outline: "none" },
                      }}
                    >
                      <VisibilityOutlined
                        sx={{ fontSize: "1rem", color: "text.or_color" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.or_color",
                          pl: 1,
                        }}
                      >
                        View
                      </Typography>
                    </ToggleButton>
                    <ToggleButton
                      onClick={(event) => handleExpandClick(event, row.id)}
                      sx={{
                        borderColor: "rgba(99, 99, 99, 0.1)",
                        textTransform: "capitalize",
                        color:
                          row.id === expandedRowId
                            ? "text.btn_blue"
                            : "text.primary",
                        fontSize: "0.8125rem",
                        fontWeight: 400,
                        padding: "8px 16px",
                        minWidth: 0,
                        bgcolor: "background.paper",
                        "&:hover": {
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          color: "text.btn_blue",
                          transform: "scale(1.01)",
                        },
                      }}
                    >
                      {row.id === expandedRowId ? (
                        <ExpandLess
                          sx={{ fontSize: "1rem", color: "text.btn_blue" }}
                        />
                      ) : (
                        <ExpandMore
                          sx={{ fontSize: "1rem", color: "text.btn_blue" }}
                        />
                      )}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  sx={{ textAlign: "center", fontWeight: 600 }}
                >
                  No shifts data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Menu
          anchorEl={expandMenuAnchor}
          open={Boolean(expandMenuAnchor)}
          onClose={handleExpandClose}
          sx={{
            mt: 1,
            ml: -2,
            p: "0.5rem",
            boxShadow: "0 .6125rem 2.5rem .6125rem rgba(140, 152, 164, .175)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              textTransform: "uppercase",
              width: "160px",
              fontSize: "0.75rem",
              fontWeight: 500,
              px: 2,
              py: 1,
              color: "#8c98a4",
            }}
          >
            Options
          </Typography>
          <MenuItem>
            <CheckOutlined sx={{ fontSize: "1rem", color: "text.or_color" }} />{" "}
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "text.black",
                textTransform: "none",
                pl: 1,
              }}
            >
              Approve
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              viewTimesheetDetails(
                timesheets?.data?.find((row) => row.id === expandedRowId)
              );
              handleExpandClose();
            }}
          >
            <VisibilityOutlined
              sx={{ fontSize: "1rem", color: "text.or_color" }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "text.black",
                textTransform: "none",
                pl: 1,
              }}
            >
              View
            </Typography>
          </MenuItem>
        </Menu>
      </TableContainer>
      <TablePagination
        component="div"
        count={timesheets?.total || 0}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[20, 30, 50]}
      />
    </>
  );
};

export default SchedulesTable;
