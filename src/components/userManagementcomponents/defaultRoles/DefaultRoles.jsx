import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import UserRoleCard from "../UserRoleCard";
import defaultrolesIcon from "../../../assets/userManagemnet/defaultrolesIcons/providers.svg";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoles } from "../../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import { SearchIcon } from "../../post-job/PostedJobsIcons";
import NodataFoundCard from "../../../provider_portal/provider_components/NodataFoundCard";

const DefaultRoles = ({ darkMode, searchTerm, setSearchTerm, from }) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchRoles()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const defaultRoles = roles?.roles?.filter(
    (curr) => curr?.is_default === 1 && curr?.name !== "provider"
  );
  // Filter roles based on search term
  const filteredRoles = defaultRoles?.filter((role) => {
    return role?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          gap: 0.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.6,
        }}
      >
        <Box sx={{ gap: 0.2, display: "flex", alignItems: "center", mb: 1.6 }}>
          <Typography
            sx={{
              marginTop: 0,
              fontSize: "0.98438rem",
              fontWeight: 600,
              color: darkMode ? "fff" : "#1e2022",
            }}
          >
            Default roles
          </Typography>
          <Tooltip
            sx={{
              "& .MuiTooltip-tooltip": {
                backgroundColor: "#132144",
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
            arrow
            placement="right"
            title="These are default system roles created by SHG. You cannot delete or modify these roles. They are essential for core system functions and ensure consistent access control across the platform."
          >
            <IconButton sx={{ backgroundColor: "transparent" }} variant="text">
              <HelpOutlineOutlinedIcon
                sx={{ color: "#8c98a4", fontSize: 20 }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          variant="standard"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ cursor: "pointer" }} />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          sx={{
            borderRadius: "4px",
            p: "0px 12px",
            bgcolor: "#E9ECEF",
            border: "1px solid ",
            borderColor: "rgba(206, 212, 218, 1)",
          }}
        />
      </Box>

      {loading ? (
        <>
          <Grid container spacing={2} my={1}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} lg={4} key={index}>
                <Skeleton
                  sx={{ borderRadius: "10px" }}
                  variant="rectangular"
                  height={60}
                />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2} my={1}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                <Skeleton
                  sx={{ borderRadius: "10px" }}
                  variant="rectangular"
                  height={60}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : filteredRoles?.length > 0 ? (
        <Grid container spacing={4} sx={{ mb: 2 }}>
          {filteredRoles.map((role, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
              <UserRoleCard
                roleObj={role}
                index={index}
                icon={defaultrolesIcon}
                from={from ? from : ""}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <NodataFoundCard title="No roles found matching your search criteria " />
          ;
        </Box>
      )}
    </>
  );
};

export default DefaultRoles;
