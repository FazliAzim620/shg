import React from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
} from "@mui/material";
import CustomChip from "../../../../components/CustomChip";

const Details = ({ data, onBack }) => {
  console.log("data------------------", data);

  const InfoRow = ({ label, value }) => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        py: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.black",
          fontWeight: 400,
          textAlign: "left",
          fontSize: "14px",
          flex: 1,
        }}
      >
        {label}:
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.black",
          fontWeight: 500,
          textAlign: "left",
          flex: 1,
          fontSize: "14px",
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );

  const lastSubmission = data?.submissions?.[data.submissions.length - 1];

  return (
    <Box>
      <Box sx={{ p: "24px" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
        >
          {lastSubmission?.job_complete_response?.FirstName}{" "}
          {lastSubmission?.job_complete_response?.LastName} results
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
            border: "1px solid rgba(222, 226, 230, 1)",
          }}
        >
          <Card
            elevation={0}
            sx={{ borderRadius: 3, backgroundColor: "white" }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: -1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "text.black",
                        fontSize: "20px",
                      }}
                    >
                      Provider check
                    </Typography>
                    <CustomChip
                      dot
                      width={40}
                      dotColor={
                        data?.verified === 1
                          ? "rgba(0, 201, 167, 1)"
                          : "rgba(237, 76, 120, 1)"
                      }
                      chipText={
                        data?.verified === 1 ? "Verified" : "Not verified"
                      }
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        data?.verified === 1
                          ? "rgba(0, 201, 167, 0.1)"
                          : "rgba(237, 76, 120, 0.1)"
                      }
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(140, 152, 164, 1)",
                      fontSize: "11.4px",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    LAST CHECK {data?.transaction_date}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ px: 3 }}>
                {/* Submission-Based Details */}
                <InfoRow
                  label="First Name"
                  value={lastSubmission?.job_complete_response?.FirstName}
                />
                <InfoRow
                  label="Last Name"
                  value={lastSubmission?.job_complete_response?.LastName}
                />
                <InfoRow label="NCSBN ID" value={lastSubmission?.ncsbnId} />
                <InfoRow
                  label="License Type"
                  value={lastSubmission?.request_license_type}
                />
                <InfoRow
                  label="License Number"
                  value={lastSubmission?.license_number}
                />
                <InfoRow
                  label="Jurisdiction"
                  value={lastSubmission?.license_jurisdiction}
                />
                <InfoRow
                  label="Jurisdiction Abbreviation"
                  value={lastSubmission?.license_jurisdiction_abbreviation}
                />
                <InfoRow
                  label="License Status"
                  value={lastSubmission?.license_status}
                />
                <InfoRow
                  label="Active"
                  value={lastSubmission?.license_active}
                />
                <InfoRow
                  label="License Expiration Date"
                  // value={lastSubmission?.license_expiration_date}
                  value={
                    lastSubmission?.license_expiration_date
                      ? new Date(lastSubmission.license_expiration_date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"
                  }
                />
                <InfoRow
                  label="License Original Issue Date"
                  // value={lastSubmission?.license_original_issue_date}
                  value={
                    lastSubmission?.license_original_issue_date
                      ? new Date(lastSubmission.license_original_issue_date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"
                  }
                />
                <InfoRow
                  label="Compact Status"
                  value={lastSubmission?.compact_status}
                />
                <InfoRow
                  label="Authorization To Practice Code"
                  value={lastSubmission?.auth_to_practice_code}
                />
                <InfoRow
                  label="Authorization To Practice Description"
                  value={lastSubmission?.auth_to_practice_description}
                />
                <InfoRow
                  label="Authorization State"
                  value={lastSubmission?.auth_state_description}
                />
                <InfoRow
                  label="Authorization State Abbreviation"
                  value={lastSubmission?.auth_state_abbreviation}
                />
                <InfoRow
                  label="Transaction ID"
                  value={lastSubmission?.transaction_id || data?.transaction_id}
                />
                <InfoRow
                  label="Transaction Success Flag"
                  value={
                    lastSubmission?.transaction_success_flag?.toString() ||
                    data?.transaction_success_flag?.toString()
                  }
                />
                <InfoRow
                  label="Transaction Date"
                  // value={
                  //   lastSubmission?.transaction_date || data?.transaction_date
                  // }
                  value={
                    lastSubmission?.transaction_date
                      ? new Date(lastSubmission.transaction_date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>

      <Button
        sx={{
          mb: 3,
          mx: 3,
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
            color: "text.main",
            transform: "scale(1.01)",
          },
          "&:focus": {
            outline: "none",
          },
        }}
        onClick={onBack}
      >
        Back
      </Button>
    </Box>
  );
};

export default Details;
