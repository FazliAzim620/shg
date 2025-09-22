import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import loginbackground from "../../../public/backgroundImage.png";
import SelectCard from "./SelectCard";
import { useSelector } from "react-redux";
import { EastOutlined } from "@mui/icons-material";
import API from "../../API";
import {
  addUserRolesPermissions,
  updateUserRole,
} from "../../feature/loginSlice";
import { useDispatch } from "react-redux";

const SelectRolePage = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const { user } = useSelector((state) => state.login);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const roleHandler = async () => {
    try {
      setIsLoading(true);
      const resp = await API.get(
        `/api/get-user-permissions-for-specific-role?user_id=${user?.user?.id}&role_id=${selectedRole?.id}`
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        if (resp?.data?.data?.user_roles_modules?.length === 1) {
          localStorage.setItem("redirect", "redirect");
        }

        dispatch(updateUserRole(selectedRole?.name));
        dispatch(addUserRolesPermissions(resp?.data?.data));
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <Box
      style={{
        // backgroundImage: `URL(${backgroundImage})`,
        backgroundImage: `URL(${loginbackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "text.primary",
          minHeight: "100vh",
          pt: 6,
          pb: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "24px",
              p: "24px",
              color: darkMode === "dark" ? "#fff" : "rgba(30, 32, 34, 1)",
            }}
          >
            Login as
          </Typography>
          <Divider sx={{ opacity: 0.5 }} />
          <Typography
            variant="h5"
            sx={{
              fontSize: "21px",
              fontWeight: 500,
              lineHeight: "21px",
              p: "24px 24px 0px 24px",
              color: darkMode === "dark" ? "#fff" : "rgba(52, 58, 64, 1)",
            }}
          >
            Select a Role for Login
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              p: "24px",
              width: "100%",
            }}
          >
            {user?.user_all_roles?.map((role, index) => {
              return (
                <Box sx={{ width: "32.2%" }}  key={index}>
                  <SelectCard
                    handleCardClick={() => setSelectedRole(role)}
                    selectedRole={selectedRole}
                    roleObj={role}
                    index={index}
                    key={index}
                  />
                </Box>
              );
            })}
          </Box>
          <Divider sx={{ opacity: 0.5 }} />
          <Box sx={{ p: "24px", textAlign: "right" }}>
            {isLoading ? (
              <Button
                disabled={!selectedRole}
                variant="contained"
                sx={{ textTransform: "initial" }}
              >
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              </Button>
            ) : (
              <Button
                disabled={!selectedRole}
                onClick={roleHandler}
                variant="contained"
                sx={{ textTransform: "initial" }}
              >
                Continue <EastOutlined sx={{ fontSize: "16px", ml: 1 }} />
              </Button>
            )}
          </Box>
        </Box>
        {/* <Grid
          container
          spacing={4}
          my={1}
          sx={{ bgcolor: "background.paper", borderRadius: "12px" }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <SelectCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SelectCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SelectCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SelectCard />
          </Grid>
        </Grid> */}
      </Container>
    </Box>
  );
};

export default SelectRolePage;
