import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import roleicon from "../../assets/userManagemnet/defaultrolesIcons/providers.svg";

import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {
  CheckCircleOutline,
  ContentCopy,
  DeleteOutlineOutlined,
  ReportGmailerrorred,
  Visibility,
} from "@mui/icons-material";
import { Routes, useNavigate, useNavigation } from "react-router-dom";
import ROUTES from "../../routes/Routes";
import { DeleteConfirmModal } from "../handleConfirmDelete";
import API from "../../API";
import AddRoleModal from "./customRoles/AddRoleModal";
import { toSentenceCase } from "../../util";
import { useDispatch } from "react-redux";
import { fetchRoles } from "../../thunkOperation/userManagementModulethunk/getUerRolesThunk";
import { addCurrentRole } from "../../feature/userManagmentModule/GetRolesSlice";
import { useSelector } from "react-redux";
import {
  AdminIcon,
  JobManagerIcon,
  ProviderManagerIcon,
  RecruiterIcon,
  SuperAdminIcon,
  UserIcon,
} from "./defaultRoles/Icons";
import Swal from "sweetalert2";
import Loading from "../common/Loading";
const UserRoleCard = ({
  roleObj,
  icon,
  index,
  customRole,
  handleEditOpen,
  from,
}) => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moreOpen, setMoreOpen] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const isMoreMenuOpen = Boolean(moreOpen);

  const Icons = [
    SuperAdminIcon,
    AdminIcon,
    JobManagerIcon,
    UserIcon,
    ProviderManagerIcon,
    RecruiterIcon,
  ];

  const moreMenuClose = (e) => {
    e?.stopPropagation();
    setMoreOpen(null);
  };
  const deleteModalClose = (e) => {
    e.stopPropagation();
    setDeleteModalOpen(false);
  };

  const deleteHandler = async (e) => {
    setIsLoading(true);
    e?.stopPropagation();

    try {
      const resp = await API.delete(`api/delete-role/${roleObj.id}`);
      if (resp?.data?.success) {
        Swal.fire({
          title: "Delete Role!",
          text: "The role has been deleted successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
        deleteModalClose(e);
        setIsLoading(false);
        dispatch(fetchRoles(0));
      } else {
        setIsLoading(false);
        deleteModalClose(e);
        // Optionally handle the case where the duplication fails
        Swal.fire({
          title: "Oops!",
          text:
            resp?.data?.msg || "Something went wrong while deleting the role.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      setIsLoading(false);
      deleteModalClose(e);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while deleting the role.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const navigate = useNavigate();
  const handleCardClick = () => {
    dispatch(addCurrentRole(roleObj));
    if (from === "user") {
      navigate(ROUTES?.userRoleDetailsPage, {
        state: { roleDetails: roleObj },
      });
    } else {
      navigate(ROUTES?.roleIndexPage, {
        state: { roleDetails: roleObj },
      });
    }
  };

  const duplicateRole = async (role) => {
    setIsDuplicating(true);
    const permissionIds = roleObj?.permissions?.map(
      (permission) => permission?.id
    );

    try {
      const duplicateRoleAndPermissionsData = new FormData();
      duplicateRoleAndPermissionsData.append("name", roleObj?.name + " Copy");
      duplicateRoleAndPermissionsData.append("duplicate", 1);
      duplicateRoleAndPermissionsData.append(
        "permissions",
        permissionIds?.join(",")
      );
      duplicateRoleAndPermissionsData.append(
        "description",
        roleObj?.description
      );

      const resp = await API.post(
        "/api/add-role",
        duplicateRoleAndPermissionsData
      );
      if (resp?.data?.success) {
        setIsDuplicating(false);
        setIsLoading(false);
        dispatch(fetchRoles(0));
        Swal.fire({
          title: "Role Duplicated!",
          text: "The role has been duplicated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        setIsDuplicating(false);
        // Optionally handle the case where the duplication fails
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while duplicating the role.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.log(error);
      setIsDuplicating(false);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error while duplicating the role.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  const handleEdit = (currentRole) => {
    navigate(`${ROUTES.roleAddEditPage}?id=${currentRole?.id}`, {
      state: { roleDetails: currentRole },
    });
  };
  return (
    <Box
      onClick={handleCardClick}
      sx={{
        background: darkMode === "light" ? "white" : "background.paper",
        width: { xl: "100%", sm: "400px" },
        borderRadius: 3,
        minHeight: "107px",
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        py: 2,
        px: 2,
        ":hover": {
          cursor: "pointer",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        },
        border: ".0625rem solid rgba(231, 234, 243, 0.7)",
      }}
    >
      <Loading open={isDuplicating} />
      {Icons?.[index] ? (
        Icons?.map((Icon, ind) => {
          return index === ind && <Icon key={ind} />;
        })
      ) : (
        <ProviderManagerIcon />
      )}
      <Box
        sx={{
          flexGrow: 1,
          justifyContent: "start",
          alignItems: "start",
          // bgcolor: "gray",
        }}
      >
        <Box sx={{ padding: "0px 0.5rem", ml: 0.7 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#1e2022",
              padding: "0px 0.5rem",
              // ml: 0.7,
            }}
          >
            {roleObj?.name?.length > 30
              ? roleObj?.name?.slice(0, 30) + "..."
              : toSentenceCase(roleObj?.name)}
          </Typography>
          <Tooltip
            arrow
            placement="top"
            title={
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "400px",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: "#ffffff",
                }}
              >
                {toSentenceCase(roleObj?.description)}
              </Typography>
            }
          >
            <Typography
              variant="body2"
              sx={{ padding: "0px 0.5rem", fontSize: "12px", fontWeight: 400 }}
            >
              {roleObj?.description?.length > 100
                ? `${roleObj.description.slice(0, 100)}...`
                : roleObj.description}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
      <Chip
        onClick={(e) => {
          e.stopPropagation();
          navigate(ROUTES?.userManagement, { state: { role: roleObj?.name } });
        }}
        sx={{
          color: "rgba(55, 125, 255, 1)",
          bgcolor: "rgba(55, 125, 255, 0.1)",
          fontWeight: 600,
          fontSize: "12px",
          height: 20,
          minHeight: 20,
          px: 0.6,
          py: 0.4,
          "& .MuiChip-label": {
            padding: 0,
          },
        }}
        label={`${roleObj?.user_count} ${
          roleObj?.users_count === 1 ? "user" : "users"
        }`}
      />
      {/* {customRole && ( */}
      {from !== "user" ? (
        <MoreVertIcon
          sx={{
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(e) => {
            e.stopPropagation();
            setMoreOpen(e.currentTarget);
            // setMoreOpen(true);
          }}
        />
      ) : (
        ""
      )}

      <Menu
        anchorEl={moreOpen}
        open={isMoreMenuOpen}
        onClose={moreMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "end",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "end",
        }}
      >
        <MenuItem
          // onClick={editHandler}
          onClick={(e) => {
            e.stopPropagation();
            moreMenuClose();
            handleCardClick();
          }}
          sx={{ minWidth: "200px", fontSize: "0.875rem" }}
        >
          <Visibility sx={{ mr: 1, color: "#909CA9", fontSize: "14px" }} /> View
          Details
        </MenuItem>
        {permissions?.includes("update role & permissions role") ? (
          <MenuItem
            // onClick={editHandler}
            onClick={(e) => {
              e.stopPropagation();
              moreMenuClose();
              duplicateRole();
            }}
            sx={{ minWidth: "200px", fontSize: "0.875rem" }}
          >
            <ContentCopy sx={{ mr: 1, color: "#909CA9", fontSize: "14px" }} />{" "}
            Duplicate
          </MenuItem>
        ) : (
          ""
        )}
        {customRole &&
          permissions?.includes("update role & permissions role") && (
            <MenuItem
              // onClick={editHandler}
              onClick={(e) => {
                e.stopPropagation();
                moreMenuClose();
                // handleEditOpen(roleObj);
                dispatch(addCurrentRole(roleObj));
                handleEdit(roleObj);
              }}
              sx={{ minWidth: "200px", fontSize: "0.875rem" }}
            >
              <EditOutlinedIcon
                sx={{ mr: 1, color: "#909CA9", fontSize: "14px" }}
              />{" "}
              Edit
            </MenuItem>
          )}
        {/* {customRole && roleObj?.user_count === 0 && ( */}
        {customRole &&
          permissions?.includes("delete role & permissions role") && (
            <MenuItem
              onClick={(e) => {
                moreMenuClose();
                e.stopPropagation();
                setDeleteModalOpen(true);
              }}
              sx={{ color: "red", fontSize: "0.875rem" }}
            >
              <DeleteOutlineOutlined diable sx={{ mr: 1, fontSize: "14px" }} />
              Delete
            </MenuItem>
          )}
      </Menu>
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
            Are you sure you want to delete this role? Because once <br />
            deleted then it cannot be undone.
          </Typography>
        }
      />
    </Box>
  );
};

export default UserRoleCard;
