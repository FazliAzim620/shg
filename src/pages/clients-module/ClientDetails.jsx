import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  Link,
  Divider,
  Modal,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  KeyboardBackspaceOutlined,
  LocationOnOutlined,
  PersonOutlineOutlined,
  PeopleOutlineOutlined,
  Share,
  Comment,
  Delete,
  Approval,
  PersonAddAlt,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Header from "../../components/Header";
import ActionMenu from "../../components/client-module/ActionMenu";
import businessIcon from "../../assets/business.svg";
import ClientBasicInfoDetails from "../../components/client-module/ClientBasicInfoDetails";
import ClientBillingAddressDetails from "../../components/client-module/ClientBillingAddressDetails";
import ClientSiteAddressDetails from "../../components/client-module/ClientSiteAddressDetails";
import ClientTeams from "../../components/client-module/ClientTeams";
import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
import AddMemberModal from "../../components/client-module/AddMemberModal";
import {
  addClientMember,
  deleteClientMember,
  getClientMembers,
} from "../../api_request";
import { DeleteConfirmModal } from "../../components/handleConfirmDelete";
import ClientSiteAddressDetailsUpdated from "../../components/client-module/ClientSiteAddressDetailsUpdated";
import NoPermissionCard from "../../components/common/NoPermissionCard";

const ClientDetails = () => {
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const param = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Basic information");
  const [activeTab1, setActiveTab1] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const menuItems = useMemo(
    () => [
      {
        label: "Action 1",
        icon: <Share fontSize="small" />,
        action: () => console.log("Action 1 clicked"),
      },
      {
        label: "Action 2",
        icon: <Comment fontSize="small" />,
        action: () => console.log("Action 2 clicked"),
      },
      {
        label: "Delete",
        icon: <Delete fontSize="small" />,
        action: () => console.log("Delete clicked"),
      },
    ],
    []
  );

  const tabItems = useMemo(
    () => [
      {
        label: "Basic information",
        icon: <PersonOutlineOutlined />,
      },
      {
        label: "Billing address",
        icon: <LocationOnOutlined />,
      },
      // {
      //   label: "Site address",
      //   icon: <Approval />,
      // },
      { label: "Teams", icon: <PeopleOutlineOutlined /> },
    ],
    []
  );

  const breadcrumbItems = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "Clients", href: "/clients" },
      {
        text: currentClient?.name,
        href: `/client/${currentClient?.name
          ?.toLowerCase()
          ?.replace(/ /g, "-")}/${param.id}`,
      },
      { text: activeTab },
    ],
    [currentClient, activeTab]
  );

  const handleTabChange = (newValue) => {
    setActiveTab1(newValue);
    // You can add any additional logic here when a tab changes
  };
  // ----------------------------------------------------------------------------- teams states and functions
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const [teamsData, setTeamsData] = useState([
    {
      name: "Rachel Doe",
      jobTitle: "Credentialing coordinator",
      phone: "+1 822 012 3281",
      email: "user1@webdev.com",
      isOnline: false,
    },
  ]);

  const addTeamMemberHandler = async (data) => {
    setIsLoading(true);
    const obj = {
      id: data?.id || null,
      client_id: param.id,
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
      phone: data?.phone,
      phone_type: data?.phone_type,
      job_title: data?.job_title,
    };

    try {
      const resp = await addClientMember(obj); // Ensure this function is defined

      if (resp?.data?.success) {
        setEditData({});
        if (data?.id) {
          // Update the existing team member in the state
          setTeamsData((prevTeamsData) =>
            prevTeamsData.map((member) =>
              member.id === data.id ? resp.data.data : member
            )
          );
        } else {
          // Add the new team member to the state
          setTeamsData((prevTeamsData) => [...prevTeamsData, resp.data.data]);
        }
        handleCloseModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setEditData({});
    setOpenModal(false);
    // setEditingSite(null);
  };
  const handleCloseDeleteModal = () => {
    setOpenModal(false);
    // setEditingSite(null);
  };
  // ----------------------------------------------------------------------------- teams states and functions end
  const deleteHandler = async () => {
    setIsLoading(true);
    try {
      const resp = await deleteClientMember(deleteId);

      if (resp?.data?.success) {
        getTeamMembersHandler();
        setDeleteId(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "Basic information":
        return <ClientBasicInfoDetails />;
      case "Billing address":
        return <ClientBillingAddressDetails />;
      // case "Site address":
      //   // return <ClientSiteAddressDetails />;
      //   return <ClientSiteAddressDetailsUpdated />;    we hide accoriding to client doc share also discuss the add stepper time site address with SOHAIL
      case "Teams":
        return (
          <ClientTeams
            data={teamsData}
            setEditData={setEditData}
            setOpenModal={setOpenModal}
            deleteMember={deleteMember}
          />
        );
      default:
        return null;
    }
  };
  const getTeamMembersHandler = async () => {
    try {
      const resp = await getClientMembers(param?.id);
      if (resp?.data?.success) {
        setTeamsData(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTeamMembersHandler();
  }, []);
  const closeWarningModal = () => {
    setDeleteId(null);
  };
  const deleteMember = (id) => {
    setDeleteId(id);
  };
  if (permissions?.includes("read clients info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <DeleteConfirmModal
          isOpen={deleteId}
          onClose={closeWarningModal}
          onConfirm={deleteHandler}
          isLoading={isLoading}
          itemName={"Member"}
          title={"Delete"}
          action={"Delete"}
          bodyText={
            <Typography variant="body2">
              Are you sure you want to delete this Member?
              <br /> This action cannot be undone.
            </Typography>
          }
        />
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <AddMemberModal
            isLoading={isLoading}
            handleCloseModal={handleCloseModal}
            addTeamMemberHandler={addTeamMemberHandler}
            editData={editData}
          />
        </Modal>

        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Box pt={6} px={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src={businessIcon}
                  alt="logo"
                  sx={{ width: "3rem" }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "21px",
                      color: "text.black",
                    }}
                  >
                    {currentClient?.name}
                  </Typography>
                  <Breadcrumbs aria-label="breadcrumb">
                    {breadcrumbItems.map((item, index) =>
                      index === breadcrumbItems.length - 1 ? (
                        <Typography
                          key={item.text}
                          sx={{
                            color: "text.black",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            pt: 0.2,
                          }}
                        >
                          {item.text}
                        </Typography>
                      ) : (
                        <Link
                          component={RouterLink}
                          to={item.href}
                          key={item.text}
                          underline="hover"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            "&:hover": { color: "text.link" },
                          }}
                        >
                          {item.text}
                        </Link>
                      )
                    )}
                  </Breadcrumbs>
                </Box>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/clients`)}
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
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
                  <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                  Back to clients
                </Button>
                {/* <ActionMenu
                  menuItems={menuItems}
                  background={darkMode === "dark" ? "background.paper" : "#fff"}
                  padding={1.2}
                /> */}
              </Box>
            </Box>
          </Box>

          <ScrollableTabBar
            activeTab={activeTab1}
            onTabChange={handleTabChange}
          />
          <Divider sx={{ mx: 5, opacity: 0.3 }} />

          <Box
            sx={{
              mt: 5,
              mx: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "21px",
                color: "text.black",
              }}
            >
              {activeTab}
            </Typography>
            {activeTab === "Teams" &&
              permissions?.includes("update clients info") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                  sx={{
                    boxShadow: "none",
                    color: darkMode === "dark" ? "" : "text.blue_btn",
                    textTransform: "inherit",
                    mr: 3,
                    py: 1,
                    fontWeight: 400,
                    "&:hover": {
                      color: "#fff",
                      boxShadow: "none",
                      bgcolor: "background.btn_blue",
                    },
                  }}
                >
                  <PersonAddAlt sx={{ mr: 1, fontSize: "1rem" }} />
                  Add new
                </Button>
              )}
          </Box>

          <Box sx={{ display: "flex", mt: 4, mx: 1 }}>
            {/* Sidebar */}
            <Box
              sx={{
                width: "16%",
                bgcolor: "background.paper",
                p: 2,
                mr: 1,
                mb: 2,
                borderRadius: "10px",
              }}
            >
              {tabItems.map((item) => (
                <Button
                  key={item.label}
                  startIcon={
                    <Box
                      component="span"
                      sx={{
                        px: "5px",
                        color:
                          activeTab === item.label
                            ? darkMode === "dark"
                              ? "text.black"
                              : "primary.main"
                            : "text.disabled",
                        "& > svg": {
                          fontSize: "20px",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                  }
                  onClick={() => setActiveTab(item.label)}
                  sx={{
                    justifyContent: "flex-start",
                    width: "100%",
                    mb: 1,
                    fontSize: "14px",
                    borderRadius: "7px",
                    textTransform: "none",
                    py: 0,
                    fontWeight: 400,
                    color:
                      activeTab === item.label
                        ? darkMode === "dark"
                          ? "text.black"
                          : "primary.main"
                        : "text.black",
                    bgcolor:
                      activeTab === item.label
                        ? darkMode === "dark"
                          ? "background.default"
                          : "#EBF2FF"
                        : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {activeTab === "Teams" ? (
              renderActiveComponent()
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  width: "83.33%",
                  bgcolor: "background.paper",
                  ml: 2,
                  mb: 2,
                  borderRadius: "10px",
                }}
              >
                {renderActiveComponent()}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ClientDetails;
