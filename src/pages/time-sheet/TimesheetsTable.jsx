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
import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";

const TimesheetsTable = ({
  providerSide,
  timesheets,
  page,
  count,
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
  darkMode,
}) => {
  const timesheetData = providerSide ? timesheets : timesheets?.data;
  const dispatch = useDispatch();
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [expandMenuAnchor, setExpandMenuAnchor] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const navigate = useNavigate();
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTimesheets(timesheetData?.map((client) => client.id) || []);
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
  // const "150px" = `${100 / columnCount}%`;
  return (
    <Box>
      <TableContainer
        component={Paper}
        className="thin_slider"
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          overflowX: "auto",
        }}
      >
        <Table sx={{ mt: 3 }}>
          {/* Set a minimum width to ensure scrolling */}
          <TableHead
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#f9fafc",
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <BpCheckbox
                  className={`${selectedTimesheets.length < 1 && "checkbox"}`}
                  indeterminate={
                    selectedTimesheets.length > 0 &&
                    selectedTimesheets.length < (timesheetData?.length || 0)
                  }
                  checked={
                    timesheetData?.length > 0 &&
                    selectedTimesheets.length === timesheetData?.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ minWidth: "130px" }}>Timesheet #NO</TableCell>
              {!providerSide && (
                <>
                  {" "}
                  <TableCell sx={{ minWidth: "185px" }}>
                    Provider Name
                  </TableCell>
                  <TableCell sx={{ minWidth: "185px" }}>Client Name</TableCell>{" "}
                </>
              )}
              <TableCell sx={{ minWidth: "185px" }}>
                Timesheet Date Range
              </TableCell>
              <TableCell sx={{ minWidth: "127px" }}>Weekly Totals</TableCell>
              <TableCell sx={{ minWidth: "150px" }}>Timesheet Status</TableCell>
              <TableCell sx={{ minWidth: "185px" }}>Action Required</TableCell>
              <TableCell sx={{ minWidth: "185px" }}>
                Client Approval Status
              </TableCell>
              <TableCell sx={{ minWidth: "100px" }}>Invoice Status</TableCell>
              <TableCell sx={{ minWidth: "185px" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timesheetData?.length > 0 ? (
              timesheetData?.map((row, index) => (
                <TableRow
                  key={row.id}
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
                  <TableCell padding="checkbox">
                    <BpCheckbox
                      className={
                        selectedTimesheets.includes(row.id) ? "" : "checkbox"
                      }
                      checked={selectedTimesheets.includes(row.id)}
                      onChange={(event) => handleSelectClient(event, row.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "138px" }}>
                    <Button
                      onClick={() => viewTimesheetDetails(row)}
                      variant="text"
                    >
                      #{row.id}
                    </Button>
                  </TableCell>
                  {!providerSide && (
                    <>
                      <TableCell sx={{ minWidth: "185px" }}>
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
                          {row.job?.email}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: "185px",
                          textTransform: "capitalize",
                        }}
                      >
                        {row.job?.client_name}
                      </TableCell>
                    </>
                  )}

                  <TableCell sx={{ minWidth: "185px" }}>
                    <Typography variant="body2">
                      {row.start_date
                        ? format(new Date(row.start_date), "dd/MM/yyyy")
                        : "--"}
                    </Typography>
                    <Typography variant="body2">
                      {row.end_date
                        ? format(new Date(row.end_date), "dd/MM/yyyy")
                        : "--"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.black",
                    }}
                  >
                    {row.total_hours ?? "--"}
                  </TableCell>
                  <TableCell>
                    <CustomChip
                      dot={
                        row.timesheet_status !== "approved_by_client" &&
                        row.timesheet_status !== "rejected_by_client"
                      }
                      width={
                        row.status === "send" ||
                        row.status === "submitted_by_provider"
                          ? 40
                          : 80
                      }
                      chipText={
                        ["approved_by_admin", "approved_by_client"].includes(
                          row.timesheet_status
                        )
                          ? "Approved"
                          : [
                              "rejected_by_admin",
                              "rejected_by_client",
                            ].includes(row.timesheet_status)
                          ? "Rejected"
                          : row.status === "submitted_by_provider"
                          ? "Submitted"
                          : "Not Submitted"
                      }
                      color={
                        row.status === "send" ||
                        row.status === "submitted_by_provider"
                          ? row.timesheet_status === "approved_by_client"
                            ? "white"
                            : row.timesheet_status === "submitted_by_provider"
                            ? "black"
                            : row.timesheet_status === "rejected_by_client"
                            ? "white"
                            : "rgba(0, 201, 167)"
                          : "rgba(237, 76, 120)"
                      }
                      bgcolor={
                        row.status === "send" ||
                        row.status === "submitted_by_provider"
                          ? row.timesheet_status === "approved_by_client"
                            ? "rgba(0, 201, 167)"
                            : row.timesheet_status === "submitted_by_provider"
                            ? "#DEE0E7"
                            : row.timesheet_status === "rejected_by_client"
                            ? "rgba(237, 76, 120)"
                            : "rgba(0, 201, 167, 0.1)"
                          : "rgba(237, 76, 120, 0.1)"
                      }
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.875rem", fontWeight: 400 }}
                    >
                      {["approved_by_admin", "rejected_by_admin"].includes(
                        row.timesheet_status
                      )
                        ? "by admin"
                        : ["approved_by_client", "rejected_by_client"].includes(
                            row.timesheet_status
                          )
                        ? "by client"
                        : row.status === "submitted_by_provider" &&
                          "by provider"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: "185px" }}>
                    {row.status === "send" ||
                    row.status === "submitted_by_provider" ? (
                      <>
                        {![
                          "approved_by_admin",
                          "approved_by_client",
                          "rejected_by_client",
                        ].includes(row.timesheet_status) && (
                          <CustomChip
                            dot
                            width={40}
                            dotColor="rgba(245, 202, 153)"
                            chipText="Pending"
                            color="text.black"
                            bgcolor="rgba(245, 202, 153, 0.1)"
                          />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.875rem", fontWeight: 400 }}
                        >
                          {row.timesheet_status === "approved_by_admin"
                            ? "Awaiting client approval"
                            : row.timesheet_status === "approved_by_client"
                            ? "No"
                            : row.timesheet_status === "rejected_by_client"
                            ? "Correction required"
                            : "Review by SHG"}
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.875rem", fontWeight: 400 }}
                      >
                        Re-submission Required
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: "185px" }}>
                    {[
                      "approved_by_admin",
                      "approved_by_client",
                      "rejected_by_client",
                    ].includes(row.timesheet_status) && (
                      <CustomChip
                        dot
                        dotColor={
                          row.timesheet_status === "approved_by_admin"
                            ? "rgba(245, 202, 153)"
                            : row.timesheet_status === "approved_by_client"
                            ? "rgba(0, 201, 167)"
                            : "rgba(237, 76, 120)"
                        }
                        width={row.status === "send" ? 40 : 80}
                        chipText={
                          row.timesheet_status === "approved_by_client"
                            ? "Approved"
                            : row.timesheet_status === "rejected_by_client"
                            ? "Rejected"
                            : "Pending"
                        }
                        color={
                          row.timesheet_status === "approved_by_admin"
                            ? "black"
                            : row.timesheet_status === "approved_by_client"
                            ? "rgba(0, 201, 167)"
                            : "rgba(237, 76, 120)"
                        }
                        bgcolor={
                          row.timesheet_status === "approved_by_admin"
                            ? "rgba(245, 202, 153, 0.1)"
                            : row.timesheet_status === "approved_by_client"
                            ? "rgba(0, 201, 167, 0.1)"
                            : "rgba(237, 76, 120, 0.1)"
                        }
                      />
                    )}
                    {row.timesheet_status === "approved_by_admin"
                      ? "Client review"
                      : row.timesheet_status === "rejected_by_admin"
                      ? "N/A"
                      : ["approved_by_client", "rejected_by_client"].includes(
                          row.timesheet_status
                        )
                      ? row.client_action_date || "--"
                      : "N/A"}
                  </TableCell>
                  <TableCell sx={{ minWidth: "130px" }}>--</TableCell>
                  <TableCell sx={{ minWidth: "185px" }}>
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
                    </ToggleButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  sx={{ textAlign: "center", fontWeight: 600 }}
                >
                  No timesheet data available.
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
                timesheetData?.find((row) => row.id === expandedRowId)
              );
              handleExpandClose();
            }}
          >
            <VisibilityOutlined
              sx={{ fontSize: "1rem", color: "text.or_color" }}
            />{" "}
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
        count={count}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[20, 30, 50]}
      />
    </Box>
  );
};

export default TimesheetsTable;
