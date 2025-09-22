import {
  Box,
  Button,
  Drawer,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const BackgroundCheckHistoryDrawer = ({
  open,
  onClose,
  checkType,
  submissions,
}) => {
  // Define table columns based on check type
  const getTableColumns = () => {
    const baseColumns = [
      "Submission #",
      "Name",
      "Date of Birth",
      "Created At",
      "Updated At",
    ];

    if (checkType === "OIG") {
      return [...baseColumns, "UPIN", "NPI", "Address"];
    } else if (checkType === "SAM") {
      return [...baseColumns, "Requested state"];
    }

    return baseColumns;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "800px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          paddingBottom: 2,
          borderBottom: "2px solid #eee",
          marginBottom: 2,
          color: "primary.main",
        }}
      >
        {checkType} Submission History
      </Typography>

      {/* No submissions case */}
      {submissions.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No submission history available.
        </Typography>
      ) : (
        <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "10px",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
              border: "1px solid rgba(222, 226, 230, 1)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}>
                  {getTableColumns().map((column, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontSize: "11.9px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "12px" }}>
                      #{submissions.length - index}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {`${submission.request_first_name || "N/A"} ${
                        submission.request_last_name || "N/A"
                      }`}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {formatDate(submission.request_dob)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {formatDateTime(submission.created_at)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px" }}>
                      {formatDateTime(submission.updated_at)}
                    </TableCell>

                    {/* OIG specific columns */}
                    {checkType === "OIG" && (
                      <>
                        <TableCell sx={{ fontSize: "12px" }}>
                          {submission.request_upin || "N/A"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "12px" }}>
                          {submission.request_npi || "N/A"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "12px", maxWidth: "200px" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "12px",
                            }}
                            title={submission.request_address || "N/A"}
                          >
                            {submission.request_address || "N/A"}
                          </Typography>
                        </TableCell>
                      </>
                    )}

                    {/* SAM specific columns */}
                    {checkType === "SAM" && (
                      <TableCell sx={{ fontSize: "12px" }}>
                        {submission.request_state || "N/A"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Footer (Close button) */}
      <Box sx={{ mt: 2, maxWidth: "100px" }}>
        <Button
          sx={{
            textTransform: "capitalize",
            color: "text.primary",
            fontSize: "0.8125rem",
            fontWeight: 400,
            border: "1px solid rgba(99, 99, 99, 0.2)",
            padding: "8px 16px",
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
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default BackgroundCheckHistoryDrawer;
