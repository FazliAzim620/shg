import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Grid,
  FormControlLabel,
  Button,
  Chip,
} from "@mui/material";
import JobIcon from "../../assets/svg/icons/fin006.svg";
import providerIcon from "../../assets/svg/icons/com006.svg";
import ClientIcon from "../../assets/svg/icons/com005.svg";
import CredentialIcon from "../../assets/svg/icons/fil016.svg";
import ScheduleIcon from "../../assets/svg/icons/gen014.svg";
import ManagementIcon from "../../assets/svg/icons/abs037.svg";
import TimesheetIcon from "../../assets/svg/icons/gen013.svg";
import FinancialIcon from "../../assets/svg/icons/fin010.svg";
import AnalyticsIcon from "../../assets/svg/icons/gra012.svg";
import UsermanagementIcon from "../../assets/svg/icons/teh004.svg";
import SettingIcon from "../../assets/svg/icons/cod001.svg";
import { BpCheckbox } from "../common/CustomizeCHeckbox";
import { useSelector } from "react-redux";
import { CustomSwitch } from "./CustomSwitch";
import {
  Create,
  Delete,
  Edit,
  EditNoteOutlined,
  Visibility,
} from "@mui/icons-material";
import { scrollToTop } from "../../util";
import { DeleteConfirmModal as ConfirmRoleModal } from "../handleConfirmDelete";
import { DeleteConfirmModal as ConfirmationModal } from "../handleConfirmDelete";

const PermissionsComponent = ({
  currentRole,
  allPermissions,
  rolePermissions,
  onPermissionChange,
  isEdit,
  from,
  userEdit,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleStates, setModuleStates] = useState({});
  const [activePermissions, setActivePermissions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [changeText, setChangeText] = useState(false);
  const [changeTextAllow, setChangeTextAllow] = useState("Allow all");
  const [openAllowAlert, setOpenAllowAlert] = useState(false);
  const IconNames = [
    JobIcon,
    providerIcon,
    ClientIcon,
    CredentialIcon,
    ScheduleIcon,
    ManagementIcon,
    TimesheetIcon,
    FinancialIcon,
    AnalyticsIcon,
    UsermanagementIcon,
    SettingIcon,
  ];

  useEffect(() => {
    if (allPermissions) {
      const initialStates = {};
      Object.keys(allPermissions)?.forEach((module) => {
        const hasPermission = Object.values(allPermissions[module])
          ?.flat()
          ?.some((permission) =>
            rolePermissions?.some(
              (rolePermission) => rolePermission?.id === permission?.id
            )
          );
        initialStates[module] = hasPermission;
      });
      setModuleStates(initialStates);
      setActivePermissions(rolePermissions || []);

      // Find and set the first module that has permissions
      const firstActiveModule = Object.keys(initialStates).find(
        (module) => initialStates[module]
      );
      if (firstActiveModule) {
        setSelectedModule(firstActiveModule);
        // Set the first section of the selected module
        const firstSection = Object.keys(allPermissions[firstActiveModule])[0];
        setSelectedSection(firstSection);
      }
    }
  }, [allPermissions, rolePermissions]);

  const hasPermission = (permissionId) => {
    return activePermissions?.some(
      (permission) => permission?.id === permissionId
    );
  };
  const handleSelectAllPermissionsCheck = () => {
    if (!selectedModule || !allPermissions[selectedModule]) return;

    const modulePermissions = allPermissions[selectedModule];
    if (!selectedSection || !modulePermissions[selectedSection]) return;

    const sectionPermissions = modulePermissions[selectedSection];
    const allSelected = sectionPermissions.every((p) => hasPermission(p.id));

    if (allSelected) {
      setChangeText(true);
    } else {
      setChangeText(false);
    }
  };
  const handlePermissionToggle = (permission) => {
    const newActivePermissions = hasPermission(permission.id)
      ? activePermissions.filter((p) => p.id !== permission.id)
      : [...activePermissions, permission];

    setActivePermissions(newActivePermissions);
    if (onPermissionChange) {
      onPermissionChange(newActivePermissions);
    }
  };
  const handleAllowAllPermissionsChangeText = () => {
    if (!selectedModule || !allPermissions[selectedModule]) return;

    const modulePermissions = Object.values(
      allPermissions[selectedModule]
    )?.flat();
    const allSelected = modulePermissions.every((p) => hasPermission(p.id));
    // Update the setChangeTextAllow state based on whether all permissions are selected
    setChangeTextAllow(allSelected ? "Remove All" : "Allow All");
  };

  useEffect(() => {
    handleSelectAllPermissionsCheck();
    handleAllowAllPermissionsChangeText();
  }, [activePermissions, selectedSection]);
  const renderPermissions = (module) => {
    if (!module || !allPermissions[module]) return null;

    const modulePermissions = allPermissions[module];
    const sectionKeys = Object.keys(modulePermissions);

    const handleSelectAllPermissions = () => {
      if (!selectedModule || !allPermissions[selectedModule]) return;

      const modulePermissions = allPermissions[selectedModule];
      if (!selectedSection || !modulePermissions[selectedSection]) return;

      const sectionPermissions = modulePermissions[selectedSection];

      // Check if all permissions in the section are already selected
      const allSelected = sectionPermissions.every((p) => hasPermission(p.id));

      const newActivePermissions = allSelected
        ? activePermissions.filter(
            (p) => !sectionPermissions.some((sp) => sp.id === p.id)
          )
        : [
            ...activePermissions,
            ...sectionPermissions.filter((p) => !hasPermission(p.id)),
          ];

      setActivePermissions(newActivePermissions);
      if (onPermissionChange) {
        onPermissionChange(newActivePermissions);
      }
    };

    const handleAllowAllPermissions = () => {
      setOpenAllowAlert(false);
      if (!selectedModule || !allPermissions[selectedModule]) return;

      const modulePermissions = Object.values(
        allPermissions[selectedModule]
      )?.flat();
      const allSelected = modulePermissions.every((p) => hasPermission(p.id));

      const newActivePermissions = allSelected
        ? activePermissions.filter(
            (p) => !modulePermissions.some((mp) => mp.id === p.id)
          )
        : [
            ...activePermissions,
            ...modulePermissions.filter((p) => !hasPermission(p.id)),
          ];

      setActivePermissions(newActivePermissions);
      if (onPermissionChange) {
        onPermissionChange(newActivePermissions);
      }
    };
    if (!module || !allPermissions[module]) return null;

    // Filter sections that have at least one active permission
    const activeSections = sectionKeys.filter((section) =>
      modulePermissions[section].some((permission) =>
        hasPermission(permission.id)
      )
    );
    const sectionsToRender =
      from === "user" || !isEdit ? activeSections : sectionKeys;
    const matchingPermissionsCount = (permissionIds) => {
      return activePermissions?.filter((permission) =>
        permissionIds?.includes(permission?.id)
      )?.length;
    };
    return (
      <Box sx={{ py: "24px" }}>
        <ConfirmRoleModal
          isOpen={openAllowAlert}
          onClose={() => setOpenAllowAlert(false)}
          onConfirm={handleAllowAllPermissions}
          isLoading={false}
          title={
            changeTextAllow === "Remove All"
              ? "Remove permissions"
              : "Allow permissions"
          }
          bgcolor={
            changeTextAllow === "Remove All"
              ? "rgba(220, 53, 69, 1)"
              : "rgba(55, 125, 255, 1)"
          }
          action={changeTextAllow === "Remove All" ? "Remove" : "Allow"}
          bodyText={
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "21px",
                  pb: "1rem",
                  color: "rgba(52, 58, 64, 1)",
                }}
              >
                {changeTextAllow === "Remove All"
                  ? "Are you sure you want to remove permissions?"
                  : "Are you sure you want to allow permissions?"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
              >
                {/* {userEdit?.user
                  ? `${userEdit?.user?.name} will have full access and permissions to all resources within the selected module.`
                  : ` Updating this user's role will replace their current permissions
                with those of the new role. All existing permissions will be
                removed. Are you sure you want to proceed?`} */}
                {userEdit?.user
                  ? `${userEdit?.user?.name} will have full access and permissions to all resources within the selected module.`
                  : changeTextAllow === "Remove All"
                  ? `Are you sure you want to remove all permissions from the role for the selected module? This action will revoke their full access and permissions.`
                  : `Are you sure you want to assign all permissions to the new role for the selected module? This action will grant full access and permissions without affecting existing roles.`}
              </Typography>
            </Box>
          }
        />
        <Typography
          variant="h6"
          sx={{
            borderBottom: "1px solid rgba(222, 226, 230, 1)",
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "24px",
            color: "text.black",
            px: 2,
            pb: 2,
          }}
        >
          {module} module permissions{" "}
        </Typography>
        <Grid container spacing={2} sx={{ p: "24px" }}>
          <Grid item xs={6}>
            <Paper
              elevation={2}
              sx={{
                boxShadow: "rgba(0, 0, 0, 0.03) 0px 0px 16px",
                borderRadius: "12px",
                bgcolor: darkMode === "dark" ? "background.paper" : "#f9fafc",
                border: "0.5px solid rgba(222, 226, 230, 1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "1rem 0.5rem",
                  minHeight: "69px",
                  bgcolor: darkMode === "dark" ? "background.paper" : "#eceff6",
                  borderTopRightRadius: "12px",
                  borderTopLeftRadius: "12px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    color: "text.black",
                    px: 2,
                  }}
                >
                  Info
                </Typography>
                {(isEdit || userEdit) && (
                  <Button
                    // onClick={handleAllowAllPermissions}
                    onClick={() => setOpenAllowAlert(true)}
                    variant="text"
                    sx={{
                      color:
                        darkMode === "dark"
                          ? "rgba(55, 125, 255, 1)"
                          : "text.blue",
                      textTransform: "initial",
                    }}
                  >
                    {changeTextAllow}
                  </Button>
                )}
              </Box>
              <List component="nav" sx={{ mx: 2 }}>
                {sectionsToRender.map((section) => (
                  <Box
                    key={section}
                    sx={{
                      py: "12px",
                      borderBottom: "0.5px solid rgba(222, 226, 230, 1)",
                      borderRadius: "4px",
                    }}
                  >
                    <ListItem
                      button
                      selected={selectedSection === section}
                      onClick={() => {
                        scrollToTop(500);
                        setSelectedSection(section);
                      }}
                      sx={{
                        "&.Mui-selected": {
                          borderLeft: "2px solid rgba(55, 125, 255, 1)",
                          backgroundColor: "rgba(55, 125, 255, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(55, 125, 255, 0.1)",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary={section.replace(/_/g, " ")}
                        sx={{
                          color: "text.black",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "21px",
                        }}
                      />
                      <Chip
                        label={`${matchingPermissionsCount(
                          modulePermissions[section]?.map((item) => item?.id)
                        )} Permissions`}
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
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              sx={{
                boxShadow: "rgba(0, 0, 0, 0.03) 0px 0px 16px",
                border: "0.5px solid rgba(222, 226, 230, 1)",
                borderRadius: "12px",
                bgcolor: darkMode === "dark" ? "background.paper" : "#f9fafc",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "1rem 0.5rem",
                  minHeight: "69px",
                  bgcolor: darkMode === "dark" ? "background.paper" : "#eceff6",
                  borderTopRightRadius: "12px",
                  borderTopLeftRadius: "12px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    color: "text.black",
                    px: 2,
                  }}
                >
                  Permissions
                </Typography>
                {(isEdit || userEdit) && (
                  <Button
                    onClick={handleSelectAllPermissions}
                    variant="text"
                    sx={{
                      color:
                        darkMode === "dark"
                          ? "rgba(55, 125, 255, 1)"
                          : "text.blue",
                      textTransform: "initial",
                    }}
                  >
                    {changeText ? "Deselect all" : " Select all"}
                  </Button>
                )}
              </Box>
              {from === "user" || (!isEdit && !userEdit) ? (
                <Box sx={{ px: "24px", pt: "12px" }}>
                  {selectedSection ? (
                    <List component="nav" sx={{ mx: 2 }}>
                      {modulePermissions[selectedSection]?.map(
                        (permission) =>
                          hasPermission(permission?.id) ? (
                            <Box
                              key={permission.id}
                              sx={{
                                py: "12px",
                                borderBottom:
                                  "0.5px solid rgba(222, 226, 230, 1)",
                                borderRadius: "4px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  flex: 1,
                                  textAlign: "left",
                                  textTransform: "capitalize",
                                }}
                              >
                                {permission.name.split(" ")[0]}
                              </Typography>
                              {isEdit ? (
                                <FormControlLabel
                                  label=""
                                  control={
                                    <BpCheckbox
                                      checked={hasPermission(permission?.id)}
                                      color="primary"
                                      onChange={() => {
                                        if (isEdit) {
                                          handlePermissionToggle(permission);
                                        }
                                      }}
                                    />
                                  }
                                />
                              ) : permission.name.split(" ")[0] === "create" ? (
                                <Create
                                  sx={{
                                    color: "rgba(108, 117, 125, 1)",
                                    fontSize: "1rem",
                                  }}
                                />
                              ) : permission.name.split(" ")[0] === "read" ? (
                                <Visibility
                                  sx={{
                                    color: "rgba(108, 117, 125, 1)",
                                    fontSize: "1rem",
                                  }}
                                />
                              ) : permission.name.split(" ")[0] === "update" ? (
                                <UpdateIcon />
                              ) : permission.name.split(" ")[0] === "delete" ? (
                                <Delete
                                  sx={{
                                    color: "rgba(108, 117, 125, 1)",
                                    fontSize: "1rem",
                                  }}
                                />
                              ) : (
                                <EditNoteOutlined
                                  sx={{
                                    color: "rgba(108, 117, 125, 1)",
                                    fontSize: "1rem",
                                  }}
                                />
                              )}
                            </Box>
                          ) : null // Return nothing if hasPermission is false
                      )}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Select a section to view its permissions
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ px: "24px", pt: "12px" }}>
                  {selectedSection ? (
                    <List component="nav" sx={{ mx: 2 }}>
                      {modulePermissions[selectedSection]?.map((permission) => (
                        <Box
                          key={permission.id}
                          sx={{
                            py: "12px",
                            borderBottom: "0.5px solid rgba(222, 226, 230, 1)",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              flex: 1,
                              textAlign: "left",
                              textTransform: "capitalize",
                            }}
                          >
                            {permission.name.split(" ")[0]}
                          </Typography>
                          {isEdit || userEdit ? (
                            <FormControlLabel
                              label=""
                              control={
                                <BpCheckbox
                                  checked={hasPermission(permission?.id)}
                                  color="primary"
                                  onChange={() => {
                                    if (isEdit || userEdit) {
                                      handlePermissionToggle(permission);
                                    }
                                  }}
                                />
                              }
                            />
                          ) : // Display corresponding icon based on the permission type
                          permission.name.split(" ")[0] == "create" ? (
                            <Create
                              sx={{
                                color: "rgba(108, 117, 125, 1)",
                                fontSize: "1rem",
                              }}
                            />
                          ) : permission.name.split(" ")[0] === "read" ? (
                            <Visibility
                              sx={{
                                color: "rgba(108, 117, 125, 1)",
                                fontSize: "1rem",
                              }}
                            />
                          ) : permission.name.split(" ")[0] === "update" ? (
                            <UpdateIcon />
                          ) : permission.name.split(" ")[0] === "delete" ? (
                            <Delete
                              sx={{
                                color: "rgba(108, 117, 125, 1)",
                                fontSize: "1rem",
                              }}
                            />
                          ) : (
                            <EditNoteOutlined
                              sx={{
                                color: "rgba(108, 117, 125, 1)",
                                fontSize: "1rem",
                              }}
                            />
                          )}
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Select a section to view its permissions
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };
  // --------------------------------------------------- switch with confirm modal
  const [showModal, setShowModal] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState(null); // Track the module for pending confirmation

  const handleModuleSwitchChangeWithConfirmation = (module, e) => {
    console.log("e.target.checked", e.target.checked);
    // Show confirmation modal when the switch is toggled
    setPendingSwitch({ module, event: e.target.checked });
    setShowModal(true);
  };
  const confirmSwitchChange = () => {
    // Call the original function after confirmation
    if (pendingSwitch) {
      handleModuleSwitchChange(pendingSwitch?.module, pendingSwitch?.event);
      setPendingSwitch(null); // Clear pending switch
    }
    setShowModal(false); // Close the modal
  };

  const cancelSwitchChange = () => {
    setPendingSwitch(null); // Clear pending switch
    setShowModal(false); // Close the modal
  };

  // Original function with logic for switching
  const handleModuleSwitchChange = (module, checked) => {
    if (isEdit) {
      const newState = checked;
      setModuleStates({
        ...moduleStates,
        [module]: newState,
      });

      const modulePermissions = Object.values(allPermissions[module])?.flat();

      const newActivePermissions = newState
        ? [
            ...activePermissions,
            ...modulePermissions.filter((p) => !hasPermission(p?.id)),
          ]
        : activePermissions.filter(
            (p) => !modulePermissions.some((mp) => mp.id === p?.id)
          );

      if (moduleStates[module]) {
        setActivePermissions(newActivePermissions);
      }
      if (onPermissionChange && moduleStates[module]) {
        onPermissionChange(newActivePermissions);
      }

      setSelectedModule(module);
      setSelectedSection(null);

      if (checked) {
        setSelectedModule(module);
        setSelectedSection(null);
      } else {
        setSelectedModule(null);
        setSelectedSection(null);
      }
    }
  };
  // --------------------------------------------------- switch with confirm modal end
  return (
    <Grid container spacing={3} sx={{ mt: "16px" }}>
      <ConfirmationModal
        isOpen={showModal}
        onClose={cancelSwitchChange}
        onConfirm={confirmSwitchChange}
        isLoading={false}
        title={
          pendingSwitch?.event ? "Allow permissions" : "Remove permissions"
        }
        bgcolor={
          pendingSwitch?.event
            ? "rgba(55, 125, 255, 1)"
            : "rgba(220, 53, 69, 1)"
        }
        action={pendingSwitch?.event ? "Allow" : "Remove "}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              {pendingSwitch?.event
                ? " Are you sure you want to allow permissions?"
                : "Are you sure you want to remove permissions?"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              {pendingSwitch?.event
                ? `Are you sure you want to assign the new role to the selected module? No permissions will be automatically assigned. You will need to manually assign permissions to the role.`
                : "Are you sure you want to remove all permissions from the selected module? This action will revoke all access and permissions from the role."}
            </Typography>
          </Box>
        }
      />
      <Grid item xs={4}>
        <Paper
          sx={{
            borderRadius: "12px",
            boxShadow: "rgba(140, 152, 164, 0.08) 0px 0px 16px",
          }}
        >
          <List component="nav">
            <Typography
              variant="body2"
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "24px",
                color: darkMode === "dark" ? "white" : "rgba(30, 32, 34, 1)",
                px: "24px",
                py: 2,
                borderBottom: "1px solid rgba(222, 226, 230, 1)",
              }}
            >
              Permission
            </Typography>
            {from === "user" || !isEdit ? (
              <Box sx={{ mx: "24px", pt: "24px" }}>
                {allPermissions
                  ? Object.keys(allPermissions).map((module, index) => {
                      if (moduleStates[module]) {
                        return (
                          <ListItem
                            key={module}
                            button
                            selected={selectedModule === module}
                            onClick={() => {
                              if (moduleStates[module]) {
                                setSelectedModule(module);
                                setSelectedSection(null);
                              }
                            }}
                            sx={{
                              borderRadius: "4px",
                              "&.Mui-selected": {
                                backgroundColor: "rgba(55, 125, 255, 0.1)",
                                "&:hover": {
                                  backgroundColor: "rgba(55, 125, 255, 0.1)",
                                },
                              },
                            }}
                          >
                            <Box
                              component={"img"}
                              src={IconNames?.[index]}
                              alt={`${module} icon`}
                              sx={{ width: "1.5rem", mr: "3px" }}
                            />
                            <ListItemText primary={module} />

                            {from === "user" || !isEdit ? (
                              ""
                            ) : (
                              <CustomSwitch
                                edge="end"
                                size="small"
                                checked={moduleStates[module] || false}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  if (isEdit) {
                                    const newState = e.target.checked;
                                    setModuleStates({
                                      ...moduleStates,
                                      [module]: newState,
                                    });

                                    const modulePermissions = Object.values(
                                      allPermissions[module]
                                    )?.flat();

                                    const newActivePermissions = newState
                                      ? [
                                          ...activePermissions,
                                          ...modulePermissions.filter(
                                            (p) => !hasPermission(p?.id)
                                          ),
                                        ]
                                      : activePermissions.filter(
                                          (p) =>
                                            !modulePermissions.some(
                                              (mp) => mp.id === p?.id
                                            )
                                        );

                                    if (moduleStates[module]) {
                                      setActivePermissions(
                                        newActivePermissions
                                      );
                                    }
                                    if (
                                      onPermissionChange &&
                                      moduleStates[module]
                                    ) {
                                      onPermissionChange(newActivePermissions);
                                    }

                                    setSelectedModule(module);
                                    setSelectedSection(null);
                                  }
                                }}
                              />
                            )}
                          </ListItem>
                        );
                      }
                      return null; // Return nothing if the module state is false
                    })
                  : ""}
              </Box>
            ) : (
              <Box sx={{ mx: "24px", pt: "24px" }}>
                {allPermissions
                  ? Object.keys(allPermissions)?.map((module, index) => (
                      <ListItem
                        key={module}
                        button
                        selected={selectedModule === module}
                        onClick={() => {
                          if (moduleStates[module]) {
                            setSelectedModule(module);
                            setSelectedSection(null);
                          }
                        }}
                        sx={{
                          borderRadius: "4px",
                          "&.Mui-selected": {
                            backgroundColor: "rgba(55, 125, 255, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(55, 125, 255, 0.1)",
                            },
                          },
                        }}
                      >
                        <Box
                          component={"img"}
                          src={IconNames?.[index]}
                          alt={`${module} icon`}
                          sx={{ width: "1.5rem", mr: "3px" }}
                        />
                        <ListItemText primary={module} />

                        <CustomSwitch
                          edge="end"
                          size="small"
                          checked={moduleStates[module] || false}
                          disabled={!isEdit}
                          onChange={(e) =>
                            handleModuleSwitchChangeWithConfirmation(module, e)
                          }
                          // onChange={(e) => {
                          //   if (isEdit) {
                          //     const newState = e.target.checked;
                          //     setModuleStates({
                          //       ...moduleStates,
                          //       [module]: newState,
                          //     });

                          //     const modulePermissions = Object.values(
                          //       allPermissions[module]
                          //     )?.flat();

                          //     const newActivePermissions = newState
                          //       ? [
                          //           ...activePermissions,
                          //           ...modulePermissions.filter(
                          //             (p) => !hasPermission(p?.id)
                          //           ),
                          //         ]
                          //       : activePermissions.filter(
                          //           (p) =>
                          //             !modulePermissions.some(
                          //               (mp) => mp.id === p?.id
                          //             )
                          //         );

                          //     if (moduleStates[module]) {
                          //       setActivePermissions(newActivePermissions);
                          //     }
                          //     if (onPermissionChange && moduleStates[module]) {
                          //       onPermissionChange(newActivePermissions);
                          //     }

                          //     setSelectedModule(module);
                          //     setSelectedSection(null);
                          //   }
                          // }}
                        />
                      </ListItem>
                    ))
                  : ""}
              </Box>
            )}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: "12px",
            boxShadow: " rgba(140, 152, 164, 0.08) 0px 0px 16px",
          }}
        >
          {selectedModule ? (
            renderPermissions(selectedModule)
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">
                Select a module to view its permissions
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PermissionsComponent;
export const UpdateIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4697_62763)">
      <path
        d="M12 0.5H4C3.46957 0.5 2.96086 0.710714 2.58579 1.08579C2.21071 1.46086 2 1.96957 2 2.5V14.5C2 15.0304 2.21071 15.5391 2.58579 15.9142C2.96086 16.2893 3.46957 16.5 4 16.5H12C12.5304 16.5 13.0391 16.2893 13.4142 15.9142C13.7893 15.5391 14 15.0304 14 14.5V2.5C14 1.96957 13.7893 1.46086 13.4142 1.08579C13.0391 0.710714 12.5304 0.5 12 0.5V0.5ZM7.5 7.207L6.354 8.354C6.26011 8.44789 6.13278 8.50063 6 8.50063C5.86722 8.50063 5.73989 8.44789 5.646 8.354C5.55211 8.26011 5.49937 8.13278 5.49937 8C5.49937 7.86722 5.55211 7.73989 5.646 7.646L7.646 5.646C7.69245 5.59944 7.74762 5.56249 7.80837 5.53729C7.86911 5.51208 7.93423 5.49911 8 5.49911C8.06577 5.49911 8.13089 5.51208 8.19163 5.53729C8.25238 5.56249 8.30755 5.59944 8.354 5.646L10.354 7.646C10.4005 7.69249 10.4374 7.74768 10.4625 7.80842C10.4877 7.86916 10.5006 7.93426 10.5006 8C10.5006 8.06574 10.4877 8.13084 10.4625 8.19158C10.4374 8.25232 10.4005 8.30751 10.354 8.354C10.3075 8.40049 10.2523 8.43736 10.1916 8.46252C10.1308 8.48768 10.0657 8.50063 10 8.50063C9.93426 8.50063 9.86916 8.48768 9.80842 8.46252C9.74768 8.43736 9.69249 8.40049 9.646 8.354L8.5 7.207V11C8.5 11.1326 8.44732 11.2598 8.35355 11.3536C8.25979 11.4473 8.13261 11.5 8 11.5C7.86739 11.5 7.74021 11.4473 7.64645 11.3536C7.55268 11.2598 7.5 11.1326 7.5 11V7.207Z"
        fill="#6C757D"
      />
    </g>
    <defs>
      <clipPath id="clip0_4697_62763">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);
