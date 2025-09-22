import {
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import CustomChip from "../../../components/CustomChip";
import { useSelector } from "react-redux";
import { format, isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";

const TableforServiceProvider = ({ timesheets }) => {
  const navigate = useNavigate();
  const { currentJob } = useSelector((state) => state.currentJob);
  const darkMode = useSelector((state) => state.theme.mode);
  const providerDetails = useSelector(
    (state) => state.providerDetails?.provider
  );
  const columnCount = 11; // Including the checkbox column
  const columnWidth = `${100 / columnCount}%`;

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          overflowX: "auto",
          borderRadius: "10px",
        }}
      >
        <Table sx={{ mt: 3, minWidth: 1440 }}>
          <TableHead
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#f9fafc",
            }}
          >
            <TableRow>
              <TableCell sx={{ minWidth: columnWidth }}>
                Timesheet #NO
              </TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Provider Name
              </TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>Client Name</TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Timesheet Date Range
              </TableCell>
              {/* <TableCell sx={{ minWidth: columnWidth }}>Weekly Totals</TableCell> */}
              <TableCell sx={{ minWidth: columnWidth }}>
                Timesheet Status
              </TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Action Required
              </TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Client Approval Status
              </TableCell>
              <TableCell sx={{ minWidth: columnWidth }}>
                Invoice Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timesheets?.map((row, index) => {
              console.log(
                "test",
                row?.status === null &&
                  isBefore(new Date(row?.end_date), new Date())
              );
              return (
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
                  <TableCell sx={{ minWidth: columnWidth }}>
                    {/* <Button variant="text">#{row.id}</Button> */}

                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize", color: "text.black" }}
                    >
                      {row?.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: columnWidth }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "capitalize", color: "text.black" }}
                    >
                      {providerDetails?.user?.name || providerDetails?.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {providerDetails?.user?.email || providerDetails?.email}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ minWidth: columnWidth, textTransform: "capitalize" }}
                  >
                    {currentJob?.client_name}
                  </TableCell>
                  <TableCell sx={{ minWidth: columnWidth }}>
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

                  <TableCell sx={{ minWidth: 120 }}>
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
                          : row.status === null || row.status === null
                          ? "text.black"
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
                          : row.status === null || row.status === null
                          ? "rgba(245, 202, 153, 0.1)"
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
                        : (row.status === "submitted_by_provider" ||
                            row.status === null) &&
                          "by provider"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: columnWidth }}>
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
                    ) : row.timesheet_status === null ? (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.875rem", fontWeight: 400 }}
                      >
                        N/A
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.875rem", fontWeight: 400 }}
                      >
                        Re-submission Required
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: columnWidth }}>
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
                  <TableCell sx={{ minWidth: columnWidth }}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.875rem", fontWeight: 400 }}
                    >
                      --
                      {/* {row.timesheet_status === "approved_by_client"
                        ? "Approved"
                        : "Pending"} */}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableforServiceProvider;
