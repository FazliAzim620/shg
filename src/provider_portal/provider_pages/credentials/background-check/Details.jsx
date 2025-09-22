import React from "react";
import {
  Chip,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import {
  CheckCircle,
  KeyboardBackspaceOutlined,
  MoreVert,
} from "@mui/icons-material";
import CustomChip from "../../../../components/CustomChip";
import { useSelector } from "react-redux";

const Details = ({ data, onBack }) => {
  // Sample data for demonstration
  const sampleData = data?.details || [];
  const darkMode = useSelector((state) => state.theme.mode);
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
          textTransform: "capitalize",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
  return (
    <>
      <Box sx={{}}>
        <Box sx={{ p: "24px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
          >
            {data?.name} results
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
              sx={{
                borderRadius: 3,
                // border: "1px solid #e0e0e0",
                backgroundColor: "white",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Header Section */}
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
                          data?.status === "Clear"
                            ? "rgba(0, 201, 167, 1)"
                            : "rgba(237, 76, 120, 1)"
                        }
                        chipText={
                          data?.status === "Clear" ? "Clear" : "Not clear"
                        }
                        color="rgba(103, 119, 136, 1)"
                        bgcolor={
                          data?.status === "Clear"
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
                      LAST CHECK{" "}
                      {data?.lastUpdate
                        ? new Date(data?.lastUpdate).toISOString().split("T")[0]
                        : null}
                    </Typography>
                  </Box>
                  <Button
                    onClick={onBack}
                    variant="contained"
                    sx={{
                      bgcolor:
                        darkMode === "dark" ? "background.paper" : "#dee6f6",
                      boxShadow: "none",
                      color: "text.btn_blue",
                      textTransform: "inherit",
                      py: 1.2,
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      "&:hover": {
                        color: "#fff",
                        boxShadow: "none",
                        bgcolor: "text.btn_blue",
                      },
                    }}
                  >
                    <KeyboardBackspaceOutlined
                      sx={{ mr: 1, fontSize: "1rem" }}
                    />
                    Back
                  </Button>
                </Box>

                {/* Details Section */}
                <Box sx={{ px: 3 }}>
                  <InfoRow
                    label="Name on license"
                    value={sampleData.nameOnLicense}
                  />
                  <InfoRow
                    label="DOB"
                    value={
                      sampleData.dob
                        ? new Date(sampleData.dob).toISOString().split("T")[0]
                        : null
                    }
                  />
                  {sampleData?.request_address ? (
                    <InfoRow
                      label="Request address"
                      value={sampleData?.request_address}
                    />
                  ) : (
                    ""
                  )}
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Details;
