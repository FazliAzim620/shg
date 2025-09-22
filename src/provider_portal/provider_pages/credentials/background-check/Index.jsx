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
  CircularProgress,
  Skeleton,
  Drawer,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddCircleOutline, ExpandMore } from "@mui/icons-material";
import Details from "./Details";
import CustomChip from "../../../../components/CustomChip";
import BackgroundCheckDrawer from "./BackgroundCheckDrawer";
import API from "../../../../API";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import BackgroundCheckHistoryDrawer from "./BackgroundCheckHistoryDrawer";

const BackgroundCheck = ({
  backTrigger,
  showDetails,
  setShowDetails,
  onboarding,
  userId,
}) => {
  const { user } = useSelector((state) => state.login);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]); // Store raw API data for history
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [drawerCheckType, setDrawerCheckType] = useState(null);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [formData, setFormData] = useState({
    for_provider_user_id: userId ? userId : user?.user?.id,
    first_name: "",
    last_name: "",
    dob: "",
    upin: "",
    npi: "",
    address: "",
    state_id: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const websiteMap = {
    OIG: "www.oig.com",
    SAM: "www.sam.com",
    NewCheck: "www.check.com",
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/get-background-checks", {
        params: { for_provider_user_id: userId ? userId : user?.user?.id },
      });

      if (!response.data.success) {
        throw new Error(
          response.data.msg || "Failed to fetch background check data"
        );
      }

      const mappedData = response.data.data.map((item) => {
        const latestSubmission =
          item.submissions[item.submissions?.length - 1] || {};
        return {
          name: item.name,
          website: websiteMap[item.name] || "N/A",
          status:
            item.clear === 1 ? "Clear" : item.clear === 0 ? "Not clear" : "",
          addedAt: latestSubmission.created_at || "N/A",
          lastUpdate: latestSubmission.updated_at || "N/A",
          details: {
            lastCheck: latestSubmission.created_at || "N/A",
            nameOnLicense:
              `${latestSubmission.request_first_name || ""} ${
                latestSubmission.request_last_name || ""
              }`.trim() || "N/A",
            dob: latestSubmission.request_dob || "N/A",

            request_address: latestSubmission?.request_address,
          },
        };
      });

      setRawData(response.data.data); // Store raw data for history
      setData(mappedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.user?.id]);

  useEffect(() => {
    if (backTrigger) {
      handleBack();
    }
  }, [backTrigger]);

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
    handleMenuClose();
  };

  const handleViewHistory = () => {
    setHistoryDrawerOpen(true);
    handleMenuClose();
  };

  const handleVerify = (index) => {
    const checkType = data[index].name;
    if (checkType === "OIG" || checkType === "SAM") {
      setDrawerCheckType(checkType);
      setDrawerOpen(true);
    }
    handleMenuClose();
  };

  const handleAddDetails = (index) => {
    const checkType = data[index].name;
    if (checkType === "OIG" || checkType === "SAM") {
      setDrawerCheckType(checkType);
      setDrawerOpen(true);
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedRow(null);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerCheckType(null);
    setFormData({
      for_provider_user_id: userId ? userId : user?.user?.id,
      first_name: "",
      last_name: "",
      dob: "",
      upin: "",
      npi: "",
      address: "",
      state_id: "",
    });
    setFormErrors({});
  };

  const handleHistoryDrawerClose = () => {
    setHistoryDrawerOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields = ["first_name", "last_name", "dob"];
    if (drawerCheckType === "SAM") {
      requiredFields.push("state_id");
    }

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field
          .replace("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: Object.values(newErrors).join(", "),
      });
      return;
    }

    try {
      setFormErrors((prev) => ({ ...prev, submitError: null }));
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      setIsLoading(true);
      const endpoint =
        drawerCheckType === "OIG" ? "/api/oig-submit" : "/api/sam-submit";
      const response = await API.post(endpoint, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) {
        setIsLoading(false);
        setFormErrors((prev) => ({
          ...prev,
          submitError: response.data.msg || "Submission failed",
        }));
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            response.data.msg || "An error occurred while submitting the form.",
        });
      } else {
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text:
            response.data.msg ||
            `${drawerCheckType} details submitted successfully!`,
        });
        handleDrawerClose();
        fetchData();
      }
    } catch (err) {
      setIsLoading(false);
      setFormErrors((prev) => ({
        ...prev,
        submitError: err.message || "An error occurred during submission",
      }));
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "An unexpected error occurred.",
      });
    }
  };

  if (loading) {
    return (
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}>
            {["Name", "Status", "Added at", "Last update", "Action"].map(
              (item, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  {item}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        {Array.from({ length: 3 }).map((_, index) => (
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
              <Skeleton variant="rectangular" width={80} height={30} />
            </TableCell>
          </TableRow>
        ))}
      </Table>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (showDetails && selectedRow !== null) {
    const selected = data[selectedRow];
    if (!selected) {
      return (
        <Box sx={{ p: "20px" }}>
          <Typography variant="h6">No details available</Typography>
          <Button variant="outlined" onClick={handleBack} sx={{ mt: "20px" }}>
            Back
          </Button>
        </Box>
      );
    }

    return <Details data={selected} onBack={handleBack} />;
  }

  return (
    <Box sx={{}}>
      <Box sx={{ p: "24px" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
        >
          Background Checks
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
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}>
                {["Name", "Status", "Added at", "Last update", "Action"].map(
                  (item, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontSize: "11.9px",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {row.name === "OIG" && (
                        <img
                          src="./oig.png"
                          alt="OIG logo"
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      {row.name === "SAM" && (
                        <img
                          src="./sam.png"
                          alt="SAM logo"
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      {row.name === "NewCheck" && (
                        <img
                          src="./newcheck.png"
                          alt="NewCheck logo"
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      <a
                        href={row.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {row.website}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.status ? (
                      <CustomChip
                        dot
                        width={40}
                        dotColor={
                          row.status === "Clear"
                            ? "rgba(0, 201, 167, 1)"
                            : "rgba(237, 76, 120, 1)"
                        }
                        chipText={row.status}
                        color="rgba(103, 119, 136, 1)"
                        bgcolor={
                          row.status === "Clear"
                            ? "rgba(0, 201, 167, 0.1)"
                            : "rgba(237, 76, 120, 0.1)"
                        }
                      />
                    ) : (
                      <Button
                        variant="text"
                        onClick={() => handleAddDetails(index)}
                        sx={{
                          textTransform: "initial",
                          color: "background.btn_blue",
                          boxShadow: "none",
                          fontWeight: 600,
                        }}
                      >
                        <AddCircleOutline
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            mr: "0.5rem",
                          }}
                        />
                        Add details
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.status
                      ? new Date(row.addedAt).toISOString().split("T")[0]
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {row.status
                      ? new Date(row.lastUpdate).toISOString().split("T")[0]
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        color: "text.secondary",
                        borderColor: "#EEF0F7",
                        "&:hover": {
                          color: "text.btn_blue",
                          borderColor: "#EEF0F7",
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        },
                      }}
                      onClick={(e) => {
                        setSelectedCheck(row);
                        handleMenuClick(e, index);
                      }}
                    >
                      More
                      <ExpandMore sx={{ fontSize: "14px" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onboarding || !selectedCheck?.status ? (
          ""
        ) : (
          <MenuItem onClick={handleViewDetails}>View details</MenuItem>
        )}
        <MenuItem onClick={() => handleVerify(selectedRow)}>Verify</MenuItem>
        <MenuItem onClick={handleViewHistory}>View History</MenuItem>
      </Menu>
      <BackgroundCheckDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        checkType={drawerCheckType}
        formData={formData}
        errors={formErrors}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <BackgroundCheckHistoryDrawer
        open={historyDrawerOpen}
        onClose={handleHistoryDrawerClose}
        checkType={selectedRow !== null ? data[selectedRow]?.name : ""}
        submissions={
          selectedRow !== null
            ? rawData.find((item) => item.name === data[selectedRow]?.name)
                ?.submissions || []
            : []
        }
      />
    </Box>
  );
};

export default BackgroundCheck;
