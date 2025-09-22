import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Group, KeyboardBackspaceOutlined } from "@mui/icons-material";
import ROUTES from "../../routes/Routes";
import { capitalizeFirstLetter, logoutHandler } from "../../util";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import PermissionsSkeleton from "../../components/userManagementcomponents/PermissionsSkeleton";
import PermissionsComponent from "../../components/userManagementcomponents/PermissionsComponent";
import API from "../../API";

const UserRoleDetails = () => {
  const navigate = useNavigate();
  const { currentRole } = useSelector((state) => state.users);
  const darkMode = useSelector((state) => state.theme.mode);
  const location = useLocation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Role Management", href: ROUTES?.userManagement },
    {
      text: location?.state?.roleDetails?.is_default
        ? "Default role"
        : "Custom role",
    },
  ];

  const getRolePermissoin = async () => {
    setIsLoading(true);
    try {
      const resp = await API.get(
        `/api/get-permissions?role_id=${location?.state?.roleDetails?.id}`
      );
      if (resp?.data?.success) {
        setData(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        navigate("/login");
        logoutHandler();
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRolePermissoin();
  }, [location?.state?.roleDetails?.id]);

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Header />
      <Box
        sx={{
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
          pb: 2,
          px: 2,
        }}
      >
        <Breadcrumb
          items={breadcrumbItems}
          title={
            location?.state?.roleDetails?.is_default
              ? "Default role"
              : "Custom role"
          }
        >
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              onClick={() => {
                navigate(-1);
              }}
              variant="contained"
              sx={{
                bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
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
              <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
              Back
            </Button>
          </Box>
        </Breadcrumb>

        <Card
          sx={{
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 2,
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "text.black",
                  fontWeight: 600,
                  fontSize: "20px",
                  textTransform: "capitalize",
                }}
              >
                {currentRole?.name}
              </Typography>
              <Chip
                icon={<Group />}
                label={`${currentRole?.user_count} users`}
                size="small"
                sx={{
                  p: "4px 6px",
                  bgcolor: "#EDF5FF",
                  color: "#0066FF",
                  "& .MuiChip-icon": {
                    color: "#0066FF",
                  },
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mt: 2, px: 2, pt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                    width: "50%",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                  }}
                >
                  Role name:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    width: "50%",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "21px",
                    color:
                      darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                  }}
                >
                  {capitalizeFirstLetter(location.state.roleDetails.name)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: "24px" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                    width: "50%",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                  }}
                >
                  Role description:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    width: "50%",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "21px",
                    color:
                      darkMode === "dark" ? "white" : "rgba(52, 58, 64, 1)",
                  }}
                >
                  {capitalizeFirstLetter(
                    location.state.roleDetails.description
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {isLoading ? (
          <PermissionsSkeleton />
        ) : (
          <PermissionsComponent
            currentRole={currentRole}
            allPermissions={data.all_permissions}
            rolePermissions={data.role_permissions}
            isEdit={false}
            from="user"
          />
        )}
      </Box>
    </Box>
  );
};

export default UserRoleDetails;
