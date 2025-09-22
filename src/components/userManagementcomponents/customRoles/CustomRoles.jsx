import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Grid,
  IconButton,
  Skeleton,
  TextField, // Import the TextField component for the search bar
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import NodataFoundCard from "../../../provider_portal/provider_components/NodataFoundCard";
import AddRoleModal from "./AddRoleModal";
import CreateRoleButton from "./CreateRoleButton";
import CustomRoleIndexPage from "./CustomRoleIndexPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import UserRoleCard from "../UserRoleCard";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes/Routes";

const CustomRoles = ({ darkMode, searchTerm, setSearchTerm, from }) => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const customRoles = roles?.roles?.filter((curr) => curr?.is_default === 0);
  const rolesLength = customRoles && customRoles.length;

  const roleTypeStyle = {
    marginTop: 0,
    fontSize: "0.98438rem",
    fontWeight: 600,
    color: "#1e2022",
  };

  const iconStyles = {
    color: "#8c98a4",
    fontSize: 20,
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleAdd = () => {
    navigate(`${ROUTES.roleAddEditPage} `);
  };

  // Filter roles based on the search term
  const filteredRoles = customRoles?.filter((role) =>
    role?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box>
      <Box
        sx={{
          mt: "72px",
          gap: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            gap: 0.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={roleTypeStyle}>Custom Roles</Typography>
          <Tooltip
            sx={{
              "& .MuiTooltip-tooltip": {
                backgroundColor: "#132144",
                fontWeight: 500,
              },
            }}
            arrow
            placement="right"
            title="You can create, rename, or delete custom roles to fit your organization's unique needs."
          >
            <IconButton variant="text">
              <HelpOutlineOutlinedIcon sx={iconStyles} />
            </IconButton>
          </Tooltip>
        </Box>

        {rolesLength > 0 &&
          from !== "user" &&
          permissions?.includes("create role & permissions role") && (
            <CreateRoleButton rolesLength={rolesLength} onClick={handleAdd} />
          )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {loading ? (
          // Skeleton Loader when loading
          <>
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
          // Content when data is loaded
          <Grid container spacing={4} my={1}>
            {filteredRoles.map((role, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                <UserRoleCard
                  isEditOpen={isModalOpen}
                  editClose={handleCloseModal}
                  roleObj={role}
                  customRole={true}
                  darkMode={darkMode}
                  handleEditOpen={(data) => {
                    setIsModalOpen(true);
                    setEditData(data);
                  }}
                  from={from ? from : ""}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              mt: 2,
              mb: 10,
              borderRadius: "13px",
              width: "100%",
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #EAECF4",
            }}
          >
            <NodataFoundCard userManagement={true} />
            {loading
              ? ""
              : permissions?.includes("create role & permissions role") && (
                  <CreateRoleButton
                    rolesLength={rolesLength}
                    onClick={handleAdd}
                  />
                )}
          </Box>
        )}

        <AddRoleModal
          darkMode={darkMode}
          open={isModalOpen}
          handleClose={handleCloseModal}
          editRecord={editData}
        />
      </Box>
    </Box>
  );
};

export default CustomRoles;
