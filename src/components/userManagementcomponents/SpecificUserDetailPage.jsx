import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../BreadCrumb";
import Header from "../Header";
import {
  Delete,
  DeleteOutlineOutlined,
  KeyboardBackspaceOutlined,
  PersonOutline,
} from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useSelector, useDispatch } from "react-redux";
import CustomOutlineBtn from "../button/CustomOutlineBtn";
import CardCommon from "../CardCommon";
import CustomTypographyBold from "../CustomTypographyBold";
import { menuItems } from "../MainMenuDropdown";
import { useState } from "react";
import { IosCommonSwitch } from "../common/IosCommonSwitch";
import DeleteAccountTab from "../../provider_portal/provider_components/settings/DeleteAccountTab";
import { DeleteConfirmModal } from "../handleConfirmDelete";
import { deleteShiftSchedule } from "../../thunkOperation/job_management/providerInfoStep";
import ROUTES from "../../routes/Routes";
import { capitalizeFirstLetter } from "../../util";
const SpecificUserDetailPage = () => {
  const location = useLocation()?.state;
  const userDetail = location?.user;
  const rolename = location?.rolename;
  const userName = `${userDetail?.first_name} ${userDetail?.last_name}`;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteHandler = async () => {
    setIsLoading(true);
    const result = await dispatch(deleteShiftSchedule(newEvent?.id));
    if (deleteShiftSchedule.fulfilled.match(result)) {
      deleteModalClose();
      setIsLoading(false);
      setNewEvent({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        recurrence: "Daily",
        selectedDays: [],
      });
    }
  };

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "User Management", href: ROUTES?.userManagement },
    { text: capitalizeFirstLetter(rolename), href: ROUTES?.roleIndexPage },
    { text: userName },
  ];

  const [permissionStates, setPermissionStates] = useState(
    menuItems?.reduce((acc, permission) => {
      acc[permission.title] = false;
      return acc;
    }, {})
  );

  const handlePermissionChange = (name) => {
    setPermissionStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Breadcrumb items={breadcrumbItems} title={userName}>
          <Box>
            <CustomOutlineBtn
              startIcon={<DeleteOutlineOutlined sx={{}} />}
              text="Delete"
              onClick={() => setDeleteModalOpen(true)}
              hover={"text.btn_blue"}
            />
            {/* ==============Delete Modal================== */}
            <DeleteConfirmModal
              isOpen={deleteModalOpen}
              onClose={deleteModalClose}
              onConfirm={deleteHandler}
              isLoading={isLoading}
              itemName={"File"}
              title={"Delete"}
              action={"Delete"}
              bodyText={
                <Typography variant="body2">
                  Are you sure you want to delete this user? Because once <br />
                  deleted then it cannot be undone.
                </Typography>
              }
            />
            {/* ============================================ */}
            <Button
              onClick={
                () => navigate(-1)
                // () => navigate(ROUTES?.roleIndexPage)
              }
              variant="contained"
              sx={{
                bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
                boxShadow: "none",
                color: "text.btn_blue",
                textTransform: "inherit",
                py: 1,
                mt: 1.1,
                fontSize: "0.875rem",
                fontWeight: 400,
                "&:hover": {
                  color: "#fff",
                  boxShadow: "none",
                  bgcolor: "text.btn_blue",
                },
              }}
            >
              <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
              Back
            </Button>
          </Box>
        </Breadcrumb>
        <Divider
          sx={{
            opacity: 0.3,
            my: 4.2,
            "&::before, &::after": {
              bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
            },
          }}
        />
        {/* ========================== Side nav and permissions card ======================== */}
        <Box
          sx={{
            mx: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <CardCommon minHeight={306} cardTitle={"Basic information"}>
                <Box>
                  <CustomTypographyBold
                    weight={400}
                    fontSize={"0.7rem"}
                    color={"text.or_color"}
                    lineHeight={1.5}
                  >
                    NAME
                  </CustomTypographyBold>

                  <Box display="flex" alignItems="center" mb={1} mt={1}>
                    <PersonOutline
                      sx={{ mr: 1, color: "text.or_color", fontSize: "1rem" }}
                    />
                    <CustomTypographyBold
                      weight={400}
                      fontSize={"0.875rem"}
                      color={"text.black"}
                      lineHeight={1.5}
                    >
                      {userName}
                    </CustomTypographyBold>
                  </Box>
                  <CustomTypographyBold
                    weight={400}
                    fontSize={"0.7rem"}
                    color={"text.or_color"}
                    lineHeight={1.5}
                    mt={3}
                  >
                    EMAIL
                  </CustomTypographyBold>

                  <Box display="flex" alignItems="center" mb={1} mt={1}>
                    <AlternateEmailIcon
                      sx={{ mr: 1, color: "text.or_color", fontSize: "1rem" }}
                    />
                    <CustomTypographyBold
                      weight={400}
                      fontSize={"0.875rem"}
                      color={"text.black"}
                      lineHeight={1.5}
                    >
                      {userDetail?.email}
                    </CustomTypographyBold>
                  </Box>

                  <CustomTypographyBold
                    mt={3}
                    weight={400}
                    fontSize={"0.7rem"}
                    color={"text.or_color"}
                    lineHeight={1.5}
                  >
                    ROLE
                  </CustomTypographyBold>
                  <CustomTypographyBold
                    weight={400}
                    fontSize={"0.875rem"}
                    color={"text.black"}
                    lineHeight={1.5}
                    ml={3}
                  >
                    {rolename}
                  </CustomTypographyBold>
                </Box>
              </CardCommon>
            </Grid>
            <Grid item xs={12} md={9}>
              <CardCommon
                cardTitle={"Permissions"}
                // btnText={"Edit"}
                // handleEditClick={}
              >
                <Typography
                  sx={{
                    mb: 2,
                  }}
                >
                  Manage access to critical modules, ensuring the user has the
                  right level of control over SHG operations.
                </Typography>
                {menuItems?.map((permission) => (
                  <>
                    <Box
                      key={permission.title}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      padding="9px 0"
                    >
                      <Box
                        py={"12px"}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <img
                          src={permission.icon}
                          alt={`${permission.title} icon`}
                          style={{ width: "30px" }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              color: "#1e2022",
                              fontSize: "16px",
                              fontWeight: 600,
                            }}
                          >
                            {permission.title}
                          </Typography>
                          <Typography>Full Access</Typography>
                        </Box>
                      </Box>
                      <IosCommonSwitch
                        checked={permissionStates[permission.title]}
                        onChange={() =>
                          handlePermissionChange(permission.title)
                        }
                      />
                    </Box>
                    <Divider />
                  </>
                ))}

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  {isLoading ? (
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: "1rem",
                        py: 1.3,
                        px: 2,
                        bgcolor: "background.btn_blue",
                        "&:hover": { bgcolor: "background.btn_blue" },
                      }}
                    >
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      // onClick={handleSubmit}
                      sx={{
                        marginTop: "1.5rem",
                        py: 1,
                        px: 3,
                        "&:hover": { bgcolor: "background.btn_blue" },
                      }}
                    >
                      Save
                    </Button>
                  )}
                </Box>
              </CardCommon>
              <Box sx={{ my: 3 }}>
                <DeleteAccountTab
                  rolename={rolename}
                  id={userDetail?.id}
                  deleteTitle={"Delete User Account"}
                  desc={
                    "When you delete user account, the user lose access to SHG account services, and we permanently delete user personal data. You can cancel the deletion for 14 days."
                  }
                  confrimMsg={"Confirm that I want to delete user account."}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SpecificUserDetailPage;
