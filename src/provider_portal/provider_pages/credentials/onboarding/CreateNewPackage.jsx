import { Box, Typography, Button, Divider, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// import Header from "../../../components/Header";
// import usePersistedTab from "../../../components/customHooks/usePersistedTab";
import usePersistedTab from "../../../../components/customHooks/usePersistedTab";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

import Breadcrumb from "../../../../components/BreadCrumb";
import { fetchProviderRoles } from "../../../../thunkOperation/job_management/states";
import ROUTES from "../../../../routes/Routes";
import { cancelPackage } from "../../../../feature/onboarding/packageSlice";
import PackageStepper from "../../../provider_components/onboarding-components/PackageStepper";
// import { KeyboardBackspaceOutlined } from "@mui/icons-material";
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
const CreateNewPackage = () => {
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.mode);
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [changeOccure, setChangeOccure] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const { roles } = useSelector((state) => state.users);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const userRole = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  useEffect(() => {
    dispatch(fetchProviderRoles()).finally(() => {});
  }, [dispatch]);

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Credentialing", href: "/credentialing" },
    { text: "Onboarding" },
  ];

  const [value, setValue] = usePersistedTab(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [deleteProvider, setDeleteProvider] = useState(false);

  const closeModal = () => {
    // setChangeStatus(false);
    setDeleteProvider(false);
    setIsLoading(false);
    // setSelectedUser(null);
  };

  const changeStatusHandler = async () => {
    alert("under construction");
  };

  const deleteProviderHandler = async () => {
    alert("under construction");
  };

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      {/* <Header /> */}
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            pr: 2,
          }}
        >
          <Breadcrumb items={breadcrumbItems} title={"Credentialing"} />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(cancelPackage());
              navigate(ROUTES?.credentialing, {
                state: { from: state?.from, active: state?.active },
              });
            }}
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
              boxShadow: "none",
              color: "text.btn_blue",
              textTransform: "inherit",
              // mr: 3,
              py: 1,
              fontWeight: 400,
              "&:hover": {
                color: "#fff",
                boxShadow: "none",
                bgcolor: "background.btn_blue",
              },
            }}
          >
            <KeyboardBackspaceOutlined
              sx={{
                mr: 1,
                fontSize: "1rem",
              }}
            />
            Back
          </Button>
        </Box>
        <Box sx={{ width: "97%", m: "0 auto", mt: 1.8 }}></Box>
        <Box
          sx={{
            flexGrow: 1,
            pb: 4,
            px: 2,
            //   width: { sm: "100%", md: "70%", xl: "55%" },
            m: "0 auto",
          }}
        >
          <PackageStepper />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateNewPackage;
