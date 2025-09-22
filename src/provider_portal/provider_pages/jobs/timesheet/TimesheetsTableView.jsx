import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TablePagination,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { ImportExport, Print } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomChip from "../../../../components/CustomChip";
import { PROVIDER_ROUTES } from "../../../../routes/Routes";
import { se } from "date-fns/locale";

const TimesheetsTableView = ({ fetchTimesheets }) => {
  const ROWS_PER_PAGE_OPTIONS = [20, 30, 50];
  const TIMESHEET_STATUSES = {
    APPROVED: ["approved_by_client"],
    REJECTED: ["rejected_by_admin"],
    SUBMITTED: "submitted_by_provider",
  };

  const { allWeeks } = useSelector((state) => state.currentJob);
  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const getStatusChipProps = (status, timesheetStatus) => {
    const isSubmitted =
      status === "send" || status === TIMESHEET_STATUSES.SUBMITTED;

    return {
      dot: timesheetStatus !== "approved_by_client",
      // timesheetStatus !== "rejected_by_client",
      width: isSubmitted ? 40 : 80,
      chipText: getStatusText(timesheetStatus, status),
      color: getChipColor(status, timesheetStatus),
      bgcolor: getChipBackgroundColor(status, timesheetStatus),
    };
  };

  const getStatusText = (timesheetStatus, status) => {
    if (TIMESHEET_STATUSES.APPROVED.includes(timesheetStatus))
      return "Approved";
    if (TIMESHEET_STATUSES.REJECTED.includes(timesheetStatus))
      return "Rejected";
    return status === TIMESHEET_STATUSES.SUBMITTED
      ? "Submitted"
      : "Not Submitted";
  };

  const getChipColor = (status, timesheetStatus) => {
    if (status === "send" || status === TIMESHEET_STATUSES.SUBMITTED) {
      if (timesheetStatus === "approved_by_client") return "white";
      if (timesheetStatus === TIMESHEET_STATUSES.SUBMITTED) return "black";
      if (timesheetStatus === "rejected_by_client") return "black";
      if (timesheetStatus === "approved_by_admin") return "black";
      return "rgba(0, 201, 167)";
    }
    if (timesheetStatus === "rejected_by_admin") {
      return "rgba(237, 76, 120)";
    }
    return "#6d4a96";
  };

  const getChipBackgroundColor = (status, timesheetStatus) => {
    if (status === "send" || status === TIMESHEET_STATUSES.SUBMITTED) {
      if (timesheetStatus === "approved_by_client") return "rgba(0, 201, 167)";
      if (timesheetStatus === TIMESHEET_STATUSES.SUBMITTED) return "#DEE0E7";
      // if (timesheetStatus === "rejected_by_client") return "rgba(237, 76, 120)";
      if (timesheetStatus === "rejected_by_client") return "#DEE0E7";
      if (timesheetStatus === "approved_by_admin") return "#DEE0E7";
      return "rgba(0, 201, 167, 0.1)";
    }
    if (timesheetStatus === "rejected_by_admin") {
      return "rgba(237, 76, 120, 0.1)";
    }
    return "rgba(237, 76, 120, 0.1)";
  };

  const getActionRequiredText = (status, timesheetStatus) => {
    if (status === "send" || status === TIMESHEET_STATUSES.SUBMITTED) {
      if (timesheetStatus === "approved_by_admin")
        return "Awaiting client approval";
      if (timesheetStatus === "approved_by_client") return "No";

      if (timesheetStatus === "rejected_by_client")
        return "Awaiting client approval";
      return "Review by SHG";
    }
    if (timesheetStatus === "rejected_by_admin")
      return "Re-submission required";
    return "--";
  };

  const handleNavigation = (row) => {
    const path =
      row?.status == null || row?.status === "resubmission_required"
        ? `${PROVIDER_ROUTES.timeSheetDetail}/${row?.job_id}?week=${row?.id}`
        : `${PROVIDER_ROUTES.myTimeSheets}?review=${row?.id}`;
    navigate(path);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await fetchTimesheets(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    await fetchTimesheets(0, newRowsPerPage);
  };

  const renderTableRow = (row, index) => (
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
      <TableCell>
        <Button onClick={() => handleNavigation(row)} variant="text">
          #{row.id}
        </Button>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",

            flexDirection: "column",
          }}
        >
          <CustomChip
            {...getStatusChipProps(row.status, row.timesheet_status)}
          />

          <Typography
            variant="body2"
            sx={{ fontSize: "0.875rem", fontWeight: 400 }}
          >
            {TIMESHEET_STATUSES.APPROVED.includes(row.timesheet_status)
              ? "by client"
              : TIMESHEET_STATUSES.REJECTED.includes(row.timesheet_status)
              ? "by admin"
              : row.status === TIMESHEET_STATUSES.SUBMITTED && "by provider"}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {(row.status === "send" ||
          row.status === TIMESHEET_STATUSES.SUBMITTED) && (
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
          </>
        )}
        <Typography
          variant="body2"
          sx={{ fontSize: "0.875rem", fontWeight: 400 }}
        >
          {getActionRequiredText(row.status, row.timesheet_status)}
        </Typography>
      </TableCell>
      <TableCell>{format(new Date(row.end_date), "dd MMMM yyyy")}</TableCell>
      <TableCell align="right">
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderActionMenu = () => {
    const isUpdate =
      ["rejected_by_admin", "resubmission_required"].includes(
        selectedRow?.status
      ) || selectedRow?.status == null;

    const menuItems = [
      {
        icon: <VisibilityIcon sx={{ width: "16px" }} />,
        text: "View Details",
        handler: handleNavigation,
        show: true,
      },
      {
        icon: <EditIcon sx={{ width: "16px" }} />,
        text: "Update Timesheet",
        handler: handleNavigation,
        show: isUpdate,
      },
      {
        icon: <Print sx={{ width: "16px" }} />,
        text: "Print Timesheet",
        show: true,
      },
      {
        icon: <ImportExport sx={{ width: "16px" }} />,
        text: "Export PDF",
        show: true,
      },
    ];

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuItems
          .filter((item) => item.show)
          .map((action, index) => (
            <MenuItem key={index} onClick={handleMenuClose} sx={{ py: 0 }}>
              <Button
                startIcon={action.icon}
                size="small"
                onClick={() => action?.handler?.(selectedRow)}
                sx={{
                  mr: 1,
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {action.text}
              </Button>
            </MenuItem>
          ))}
      </Menu>
    );
  };
  const headerCellStyle = {
    backgroundColor: darkMode === "dark" ? "black" : "rgba(231, 234, 243, .4)",
    fontSize: "11.9px",
    textTransform: "uppercase",
  };
  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <TableContainer
        component={Paper}
        className="thin_slider"
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              bgcolor:
                darkMode === "dark" ? "black" : "rgba(231, 234, 243, .4)",
            }}
          >
            <TableRow>
              {[
                "Timesheet# No",
                "Timesheet Status",
                "Action Required",
                "Due Date",
                "Actions",
              ].map((header, index) => (
                <TableCell
                  key={header}
                  align={index === 4 ? "right" : "left"}
                  sx={{
                    ...headerCellStyle,
                    color: "text.black",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allWeeks
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => renderTableRow(row, index))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={allWeeks?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </TableContainer>

      {renderActionMenu()}
    </Box>
  );
};

export default TimesheetsTableView;
