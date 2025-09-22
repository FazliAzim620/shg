import { Box, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Breadcrumb from "../components/BreadCrumb";
import UserRole_main from "../components/userManagementcomponents/UserRole_main";
import { useSelector } from "react-redux";
import NoPermissionCard from "../components/common/NoPermissionCard";
const RolesAndPermission = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Roles & Permission Management" },
  ];
  if (permissions?.includes("read role & permissions role")) {
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
          <Breadcrumb
            items={breadcrumbItems}
            title={"Roles & Permission Management"}
          />
          <Divider
            sx={{
              opacity: 0.3,
              my: 4.2,
              "&::before, &::after": {
                bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
              },
            }}
          />
          <UserRole_main />
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default RolesAndPermission;
