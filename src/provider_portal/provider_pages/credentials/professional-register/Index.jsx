import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Chip,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";
import { AddCircleOutline, CheckCircle, ExpandMore } from "@mui/icons-material";
import Details from "./Details";
import CustomChip from "../../../../components/CustomChip";
import AddLicense from "./AddLicense";
import API from "../../../../API";
import { useSelector } from "react-redux";

const ProfessionalRegistration = ({
  backTrigger,
  showDetails,
  setShowDetails,
  setAddProfessional,
  userId,
}) => {
  const { user } = useSelector((state) => state.login);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addLicenseState, setAddLicenseState] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/get-profess-regs?for_provider_user_id=${
          userId ? userId : user?.user?.id
        }`
      );
      if (response?.data?.success) {
        setApiData(response?.data?.data || []);
      } else {
        setApiData([]);
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
      setApiData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
    setAddLicenseState(false);
    handleMenuClose();
    if (setAddProfessional) {
      setAddProfessional(true);
    }
  };

  const handleAddLicense = () => {
    if (setAddProfessional) {
      setAddProfessional(true);
    }
    setShowDetails(true);
    setAddLicenseState(true);
    handleMenuClose();
  };

  useEffect(() => {
    if (backTrigger) {
      handleBack();
    }
  }, [backTrigger]);

  const handleBack = () => {
    setShowDetails(false);
    setSelectedRow(null);
  };

  const closeAddHandler = () => {
    setAddLicenseState(false);
    setShowDetails(false);
    fetchData();
  };

  // New: Handle grid view selection
  const handleCardClick = (index) => {
    const selected = apiData[index];
    if (selected.verified === 1) {
      setSelectedRow(index);
      handleViewDetails();
    } else {
      // Show message box for unverified
      setShowDetails(true);
      setAddLicenseState(false); // Ensure no license addition flow
      setSelectedRow(index); // For reference
    }
  };

  if (showDetails && selectedRow !== null && !addLicenseState) {
    const selected = apiData[selectedRow];
    if (!selected) {
      return (
        <div style={{ padding: "20px" }}>
          <h2>No details available</h2>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ marginTop: "20px" }}
          >
            Back
          </Button>
        </div>
      );
    }
    return selected.verified === 1 ? (
      <Details data={selected} onBack={handleBack} />
    ) : (
      <Box
        sx={{
          padding: "30px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px",
          }}
        >
          Registration Not Verified
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#777", marginBottom: "20px" }}
        >
          Please verify your registration to access the full details.
        </Typography>

        <Button
          variant="contained"
          onClick={handleAddLicense}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "25px",
            width: "100%",
            "&:hover": {
              backgroundColor: "primary.main",
            },
          }}
        >
          Verify Now
        </Button>

        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{
            marginTop: "15px",
            borderColor: "#3f51b5",
            color: "#3f51b5",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "25px",
            width: "100%",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white",
            },
          }}
        >
          Back
        </Button>
      </Box>
    );
  }

  if (showDetails && addLicenseState) {
    return <AddLicense closeAddHandler={closeAddHandler} userId={userId} />;
  }

  return (
    <Box>
      <Box sx={{ p: "24px" }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "20px" }}>
          Professional registration
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>
        {userId ? (
          // New grid view for userId
          <Box sx={{ display: "flex", gap: 2 }}>
            {apiData.map((row, index) => (
              <Paper
                key={index}
                sx={{
                  py: 4,
                  px: 2,
                  borderRadius: "10px",
                  width: "200px",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => {
                  if (row.verified == 1) {
                    handleAddLicense();
                  } else {
                    handleCardClick(index);
                  }
                }}
              >
                <img
                  src="./nurses.png"
                  alt={row.name}
                  style={{
                    marginBottom: "10px",
                  }}
                />
                <Typography>{row.name}</Typography>
                {row.verified == 1 ? (
                  <CheckCircle
                    sx={{
                      color: "rgba(26, 161, 121, 1)",
                      position: "absolute",
                      right: 10,
                      top: 10,
                      fontSize: "14px",
                    }}
                  />
                ) : (
                  <Chip label="Not Verified" color="error" sx={{ mt: 1 }} />
                )}
                {row.verified === 1 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, index);
                    }}
                    sx={{ mt: 1 }}
                  >
                    More
                  </Button>
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          // Existing table view
          <Paper
            sx={{ width: "100%", overflow: "hidden", borderRadius: "10px" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}>
                  {["Name", "Status", "Added at", "Last update", "Action"].map(
                    (item, index) => (
                      <TableCell
                        key={index}
                        sx={{ fontSize: "11.9px", fontWeight: 500 }}
                      >
                        {item}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant="text" width={100} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={60} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={30}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : apiData.length > 0 ? (
                  apiData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          src="./nurses.png"
                          alt="nurses logo"
                          style={{ marginRight: "10px" }}
                        />
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <CustomChip
                          dot
                          width={40}
                          dotColor={
                            row.verified === 1
                              ? "rgba(0, 201, 167, 1)"
                              : "rgba(237, 76, 120, 1)"
                          }
                          chipText={
                            row.verified === 1 ? "Verified" : "Not verified"
                          }
                          color="rgba(103, 119, 136, 1)"
                          bgcolor={
                            row.verified === 1
                              ? "rgba(0, 201, 167, 0.1)"
                              : "rgba(237, 76, 120, 0.1)"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {row?.submissions?.[0]?.created_at
                          ? new Date(row.submissions?.[0]?.created_at)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {row?.submissions?.[0]?.updated_at
                          ? new Date(row.submissions?.[0]?.updated_at)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => handleMenuClick(e, index)}
                        >
                          More
                          <ExpandMore sx={{ fontSize: "14px" }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {setAddProfessional ? (
          ""
        ) : (
          <MenuItem onClick={handleViewDetails}>View details</MenuItem>
        )}
        {apiData[selectedRow]?.verified !== "1" && (
          <MenuItem onClick={handleAddLicense}>Verify</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ProfessionalRegistration;
