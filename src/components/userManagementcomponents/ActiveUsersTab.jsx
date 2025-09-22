import {
  Box,
  Typography,
  Button,
  Chip,
  CardContent,
  Avatar,
  Badge,
  Card,
  IconButton,
  MenuItem,
  Menu,
  Skeleton,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useNavigate } from "react-router-dom";
import { DeleteOutlineOutlined, MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import CustomChip from "../CustomChip";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import ROUTES from "../../routes/Routes";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
import { fetchUsers } from "../../thunkOperation/userManagementModulethunk/getUsersThunk";
import UserModal from "./customRoles/UserModal";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteConfirmModal } from "../handleConfirmDelete";
import API from "../../API";
import { set } from "date-fns";

const ActiveUsersTab = ({ currentRole }) => {
  const { users } = useSelector((state) => state?.users);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editData, setEditData] = useState(null);
  const darkMode = useSelector((state) => state.theme.mode);
  const [userModal, setUserModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(null);
  const isMoreMenuOpen = Boolean(moreOpen);
  const moreMenuClose = () => {
    setMoreOpen(null);
  };
  const deleteModalClose = (e) => {
    setDeleteModalOpen(false);
  };
  useEffect(() => {
    const data = { role: currentRole?.name, status: 1 };

    // Fetch users and set loading to false when completed
    dispatch(fetchUsers(data)).then(() => setIsLoading(false));
  }, [currentRole, dispatch]);

  /* ========================= handleDeleteAccount ========================= */
  const deleteHandler = async () => {
    try {
      let url = `/api/delete-user-account?id=${deleteUserId}`;
      const response = await API.post(url, null);
      if (response?.data?.success) {
        setEditData(null);
        setDeleteModalOpen(false);
        const data = { role: currentRole?.name, status: 1 };
        dispatch(fetchUsers(data));
      }
    } catch (error) {
      setIsLoading(false);
      console.log("err", error);
    }
  };

  // ================ handleOpenPermissionModal ============
  const userModalOpen = () => {
    setUserModal(true);
  };
  // ================ handleCloseUserModal =================
  const handleCloseUserModal = () => {
    setIsEdit(false);
    setUserModal(false);
    setEditData(null);
  };

  // =================handleMenuopen======================
  const MoreVertClick = (e, current) => {
    setMoreOpen(e.currentTarget);
    setEditData(current);
    setDeleteUserId(current?.id);
  };

  // ===================styles============================
  const subHeadingStyle = {
    fontWeight: 600,
    lineHeight: 1.2,
    color: darkMode === "light" ? "#1e2022" : "white",
    fontSize: "1.14844rem",
    textTransform: "capitalize",
  };

  const ModalTitleStyle = {
    fontSize: "0.875rem",
    mt: 2.5,
    fontWeight: 600,
    lineHeight: 1.2,
    color: "#1e2022",
  };
  return (
    <Box
      sx={{
        minHeight: "70vh",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 1.5,
          }}
        >
          <Skeleton width={"90%"} height={"100px"} />
          <Skeleton width={"90%"} height={"100px"} />
          <Skeleton width={"90%"} height={"100px"} />
          <Skeleton width={"90%"} height={"100px"} />
        </Box>
      ) : (
        <>
          {/* ======================== when no user in this role ========================= */}
          {users?.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 1.5,
                  mb: 4,
                }}
              >
                <Box>
                  <Typography sx={subHeadingStyle}>
                    {users?.length} {users?.length === 1 ? "user" : "users"}
                  </Typography>
                </Box>
                <Button
                  onClick={userModalOpen}
                  variant="contained"
                  startIcon={<PersonAddAltIcon />}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Invite users
                </Button>
              </Box>
              {/* ============================ User card list ============================ */}
              {users?.map((user) => (
                <Card
                  sx={{
                    boxShadow:
                      "rgba(140, 152, 164, 0.075) 0px 0.375rem 0.75rem",
                    mb: 2,
                    borderRadius: "0.75rem",
                    mx: 2,
                  }}
                  key={user.id}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { lg: 15, md: 10 },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Badge
                            sx={{
                              "& .MuiBadge-dot": {
                                backgroundColor: "background.online_clr",
                                width: "13.5px",
                                height: "13.5px",
                                borderRadius: 10,
                                border: `2px solid ${
                                  darkMode === "dark" ? "#25282A" : "white"
                                }`,
                              },
                            }}
                            overlap="circular"
                            badgeContent=" "
                            variant="dot"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                          >
                            <Avatar
                              alt={`${user.name} Profile Image`}
                              src={
                                user.avatar ? (
                                  user.avatar
                                ) : (
                                  <AccountCircleIcon />
                                )
                              }
                              sx={{ width: "53.9px", height: "53.9px" }}
                            />
                          </Badge>
                          <Box>
                            <Typography
                              onClick={() => {
                                navigate(ROUTES?.userDetail, {
                                  state: { user, rolename: currentRole?.name },
                                });
                                setUserName(user.name);
                              }}
                              sx={{
                                ...subHeadingStyle,
                                ":hover": {
                                  color: "#377dff",
                                  cursor: "pointer",
                                },
                              }}
                            >
                              {user.name}
                            </Typography>
                            <Typography
                              sx={{
                                width: "150px",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                textTransform: "lowercase",
                              }}
                            >
                              <MailOutlineIcon sx={{ fontSize: "14px" }} />
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CustomChip
                          dot={true}
                          width={100}
                          chipText={user.status === 1 ? "Active" : "InActive"}
                          color={
                            user.status === 1 ? "rgba(0, 201, 167)" : "#F5CA99"
                          }
                          bgcolor={user.status === 1 ? "#DCF1F1" : "#F5F2F0"}
                        />
                        {currentRole?.name === "admin" ? (
                          <IconButton
                            onClick={() => {
                              userModalOpen();
                              setEditData(user);
                              setIsEdit(true);
                            }}
                          >
                            <EditOutlinedIcon
                              sx={{ fontSize: "18px", color: "text.btn_blue" }}
                            />
                          </IconButton>
                        ) : (
                          <MoreVert
                            sx={{ cursor: "pointer" }}
                            onClick={(e) => {
                              setMoreOpen(e.currentTarget);
                              setEditData(user);
                              setDeleteUserId(user?.id);
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Box
                sx={{
                  mx: 2,
                  mt: 2,
                  mb: 10,
                  borderRadius: "13px",
                  width: "100%",
                  py: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: "340px",
                  border: "1px solid #EAECF4",
                }}
              >
                <NodataFoundCard userManagement={true} />
                <Button
                  sx={{
                    border: "1.5px solid transparent",
                    borderColor: "rgba(231, 234, 243, 0.7)",
                    backgroundColor: "#fff",
                    padding: "0.75rem 2rem",
                    fontSize: "0.875rem",
                    textTransform: "none",
                    ":hover": {
                      backgroundColor: "#fff",
                      borderRadius: "0.3125rem",
                      borderColor: "rgba(231, 234, 243, 0.7)",
                      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                    },
                  }}
                  startIcon={<PersonAddAltIcon />}
                  onClick={userModalOpen}
                  variant="text"
                >
                  Invite users
                </Button>
              </Box>
            </>
          )}
        </>
      )}

      {/* =============add user modal================== */}
      <UserModal
        rolename={currentRole?.name}
        ModalTitleStyle={ModalTitleStyle}
        open={userModal}
        editRecord={isEdit ? editData : null}
        // editRecord={editData }
        handleClose={handleCloseUserModal}
      />
      {/* ===============================more vert drop options ========================== */}
      <Menu
        sx={{
          mt: 1,
        }}
        anchorEl={moreOpen} // Use the anchor element here
        open={isMoreMenuOpen}
        onClose={moreMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom   ",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            moreMenuClose();
            userModalOpen();
            setIsEdit(true);
          }}
          sx={{ minWidth: "100px", fontSize: "0.875rem" }}
        >
          <EditOutlinedIcon
            sx={{ mr: 1, color: "#909CA9", fontSize: "14px" }}
          />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            moreMenuClose();
            setDeleteModalOpen(true);
          }}
          sx={{ color: "red", fontSize: "0.875rem" }}
        >
          <DeleteOutlineOutlined diable sx={{ mr: 1, fontSize: "14px" }} />
          Delete
        </MenuItem>
      </Menu>
      {/* =============delete modal================== */}
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

export default ActiveUsersTab;
