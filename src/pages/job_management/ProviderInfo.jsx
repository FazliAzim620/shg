import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  Add,
  AttachMoneyOutlined,
  CreateNewFolderOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
  FilterListOutlined,
  PersonOutlineOutlined,
  Share,
} from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ProviderInformation from "../../components/job-component/providerInfo_steps/ProviderInformation";
import JobSetupChecklist from "../../components/job-component/providerInfo_steps/JobSetupChecklist";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import ClientInformation from "../../components/job-component/providerInfo_steps/ClientInformation";
import BudgetPreferences from "../../components/job-component/providerInfo_steps/BudgetPreferences";
import ClientConfirmationLetter from "../../components/job-component/providerInfo_steps/ClientConfirmationLetter";
import ProviderConfirmationLetter from "../../components/job-component/providerInfo_steps/ProviderConfirmationLetter";
import ShiftSchedules from "../../components/job-component/providerInfo_steps/ShiftSchedules";
import TravelItinerary from "../../components/job-component/providerInfo_steps/TravelItinerary";
import { addNewUser } from "../../feature/jobSlice";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import ShiftSchedule_main from "../../components/job-component/providerInfo_steps/shiftSchedulesComponents/ShiftSchedule_main";
import NoPermissionCard from "../../components/common/NoPermissionCard";
const ProviderInfo = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const params = useParams();
  const dispatch = useDispatch();
  const [from, setFrom] = useState(localStorage.getItem("order_job") || null);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 0;
  const { newUserData, jobsTableData } = useSelector((state) => state.job);
  const [showAlert, setShowAlert] = useState(false);
  const darkMode = useSelector((state) => state.theme.mode);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const { newClientData } = useSelector((state) => state.client);
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    {
      text: from ? "Client" : "Assignment Management",
      href: from ? from : "/assignment-management",
    },
    { text: "Provider Information" },
  ];
  const onClose = () => {
    setShowAlert(false);
  };

  const addHandler = () => {
    setSearchParams({ step: 1 });
  };
  if (permissions?.includes("read job management info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <Collapse in={showAlert}>
          <Alert
            severity={"success"}
            variant="filled"
            onClose={onClose}
            sx={{
              mt: "3rem",
              bgcolor: "rgba(0, 201, 167, .15)",
              color: "#00c9a7",
              fontSize: "0.875rem",
              fontWeight: 400,

              width: { sm: "100%", xl: "78%" },
              m: "3rem auto -2.6rem auto",
            }}
          >
            <b>Awesome!</b> A new job has been set up. The job number is :
            <b> #{params.id}</b>
          </Alert>
        </Collapse>
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
            //   px: 2,
          }}
        >
          <Breadcrumb items={breadcrumbItems} title={`Job # ${params.id}`} />
          <Grid container sx={{ pb: "2rem" }}>
            <Grid item xs={6} md={2.5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  px: "12px",
                  mt: "8px",
                }}
              >
                <PersonOutlineOutlined sx={{ mr: 1, color: "#377DFF" }} />
                <Box
                  sx={{ display: "flex", flexDirection: "column", pl: 0.65 }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", lineHeight: 1.5 }}
                  >
                    Provider
                  </Typography>
                  <CustomTypographyBold color="text.black" fontSize="18px">
                    {newUserData?.name}
                  </CustomTypographyBold>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3.15}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  px: "12px",
                  mt: "8px",
                }}
              >
                <AttachMoneyOutlined sx={{ mr: 1, color: "#377DFF" }} />
                <Box
                  sx={{ display: "flex", flexDirection: "column", pl: 0.65 }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", lineHeight: 1.5 }}
                  >
                    Provider rate ({newUserData?.p_regular_rate_type === 'daily' ? 'per day' : 'per hour'})
                  </Typography>
                  <CustomTypographyBold color="text.black" fontSize="18px">
                    $ {newUserData?.p_regular_hourly_rate}- ${" "}
                    {newUserData?.p_holiday_hourly_rate}
                  </CustomTypographyBold>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={2.5}
              sx={{ marginTop: { xs: "15px", md: "0px" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  px: "12px",
                  mt: "8px",
                }}
              >
                <BusinessIcon sx={{ mr: 1, color: "#377DFF" }} />
                <Box
                  sx={{ display: "flex", flexDirection: "column", pl: 0.65 }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", lineHeight: 1.5 }}
                  >
                    Client
                  </Typography>
                  {newClientData?.client_name ? (
                    <CustomTypographyBold color="text.black" fontSize="18px">
                      {newClientData?.client_name}
                    </CustomTypographyBold>
                  ) : (
                    permissions?.includes("create job management info") && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addHandler}
                        sx={{
                          textTransform: "initial",
                          bgcolor: "rgba(55, 125, 255, .1)",
                          boxShadow: "none",
                          color: "rgba(55, 125, 255)",
                          px: 2,
                          maxWidth: "80px",
                          fontWeight: 400,
                          "&:hover": {
                            color: "white",
                            bgcolor: "rgba(55, 125, 255)",
                          },
                        }}
                      >
                        <Add
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            mr: "0.5rem",
                          }}
                        />
                        Add
                      </Button>
                    )
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={2.5}
              sx={{ marginTop: { xs: "15px", md: "0px" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  px: "12px",
                  mt: "8px",
                }}
              >
                <AttachMoneyOutlined sx={{ mr: 1, color: "#377DFF" }} />
                <Box
                  sx={{ display: "flex", flexDirection: "column", pl: 0.65 }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "13px", lineHeight: 1.5 }}
                  >
                    Client rate ({newClientData?.c_regular_rate_type === 'daily' ? 'per day' : 'per hour'})
                  </Typography>
                  {newClientData?.c_regular_hourly_rate &&
                  newClientData?.c_holiday_hourly_rate ? (
                    <CustomTypographyBold color="text.black" fontSize="18px">
                      $ {newClientData?.c_regular_hourly_rate}- ${" "}
                      {newClientData?.c_holiday_hourly_rate}
                    </CustomTypographyBold>
                  ) : (
                    permissions?.includes("create job management info") && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addHandler}
                        sx={{
                          textTransform: "initial",
                          bgcolor: "rgba(55, 125, 255, .1)",
                          boxShadow: "none",
                          color: "rgba(55, 125, 255)",
                          px: 2,
                          maxWidth: "80px",
                          fontWeight: 400,
                          "&:hover": {
                            color: "white",
                            bgcolor: "rgba(55, 125, 255)",
                          },
                        }}
                      >
                        <Add
                          sx={{
                            fontWeight: 400,
                            fontSize: "16px",
                            mr: "0.5rem",
                          }}
                        />
                        Add
                      </Button>
                    )
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={4}
              md={1.3}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography></Typography>
              <Button
                variant="text"
                endIcon={<ExpandMoreOutlined />}
                sx={{
                  mt: 3,
                  mr: 1,
                  textTransform: "capitalize",
                  color: isFilterMenuOpen ? "text.btn_blue" : "text.primary",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  border: "none",
                  padding: "8px auto",
                  minWidth: 0,
                  bgcolor: "background.paper",
                  "&:hover": {
                    // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    bgcolor: "background.paper",
                    color: "text.btn_blue",

                    transform: "scale(1.01)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
                onClick={handleFilterClick}
              >
                More actions
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={isFilterMenuOpen}
                onClose={handleFilterClose}
                sx={{ mt: 0.51 }}
              >
                <MenuItem onClick={handleFilterClose}>
                  <Share sx={{ mr: 1 }} /> Share
                </MenuItem>
                <MenuItem onClick={handleFilterClose}>
                  <CreateNewFolderOutlined sx={{ mr: 1 }} />
                  Move to active{" "}
                </MenuItem>
                <MenuItem onClick={handleFilterClose}>
                  <DeleteOutlineOutlined sx={{ mr: 1 }} /> Delete
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
          <Divider
            sx={{
              mb: "36px",
              borderColor:
                darkMode == "dark"
                  ? "rgba(255, 255, 255, .7"
                  : "rgba(231, 234, 243, 01)",
            }}
          />

          <Grid
            container
            spacing={0}
            sx={{
              paddingLeft: { xs: "15px", md: "0px" },
              paddingRight: { xs: "15px", md: "0px" },
            }}
          >
            <Grid
              item
              xs={12}
              md={8}
              xl={8.2}
              sx={{
                //   bgcolor: "background.paper",
                m: { md: "0 auto", xl: "0" },
                px: 0,
                borderRadius: ".6875rem  ",
                mb: 2,
                maxHeight: { xs: "450px", md: "none" },
                overflowY: { xs: "auto", md: "none" },
              }}
            >
              {initialStep === 0 && <ProviderInformation />}
              {initialStep === 1 && <ClientInformation />}
              {initialStep === 2 && (
                <BudgetPreferences
                  batchStatus={
                    newUserData?.budget_preferences?.id ||
                    (newUserData?.budget_count &&
                      newUserData?.budget_count !== 0)
                      ? "Completed"
                      : "In progress"
                  }
                />
              )}
              {initialStep === 3 && <ClientConfirmationLetter />}
              {initialStep === 4 && <ProviderConfirmationLetter />}
              {/* {initialStep === 5 && <ShiftSchedules />} */}
              {initialStep === 5 && <ShiftSchedule_main />}
              {initialStep === 6 && <TravelItinerary />}
            </Grid>
            <Grid
              item
              xs={12}
              md={3.5}
              xl={3.6}
              sx={{
                bgcolor: "background.paper",
                // ml: { md: 2, xl: 3 },
                ml: { md: 2, xl: 2.2 },
                mr: { md: 2, xl: 0 },
                borderRadius: ".6875rem",
                marginBottom: "15px",
                maxHeight: { xs: "450px", md: "none" },
                overflowY: { xs: "auto", md: "none" },
              }}
            >
              <JobSetupChecklist />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ProviderInfo;
