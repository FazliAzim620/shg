import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  CheckCircle,
  AddCircleOutline,
  DoDisturbOn,
} from "@mui/icons-material";
import API from "../../API";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

const NavListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: "8px",
  marginBottom: theme.spacing(1),
  backgroundColor: active ? "rgba(55, 125, 255, 0.1)" : "transparent",
  "&:hover": {
    backgroundColor: active ? "rgba(55, 125, 255, 0.1)" : "#f5f5f5",
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FieldValue = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  backgroundColor: "#fff",
  border: "1px solid #eaeaea",
  borderRadius: "4px",
}));

const Preview = () => {
  const packageInfo = useSelector((state) => state.package.packageInfo);
  const [previewData, setPreviewData] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState(null); // New state for sidebar navigation
  const [activeParentItem, setActiveParentItem] = useState(null); // Track parent item when sub-item is selected
  const [openGroupsLeft, setOpenGroupsLeft] = useState({});
  const [openSections, setOpenSections] = useState({});

  // Fetch preview data
  const getPreviewData = async () => {
    try {
      const resp = await API.get(
        `/api/get-cred-onb-preview?package_id=${packageInfo?.id}`
      );
      const packageData = resp?.data?.data?.package;
      setPreviewData(packageData);

      if (packageData?.items?.length > 0) {
        setActiveItem(packageData.items[0]);
        setActiveNavItem(packageData.items[0]);
        setActiveParentItem(packageData.items[0]);
        const initialSections = {};
        packageData.items[0]?.fromable?.sections?.forEach((section) => {
          if (section?.id) {
            initialSections[section.id] = true;
          }
        });
        setOpenSections(initialSections);
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  useEffect(() => {
    if (packageInfo?.id) {
      getPreviewData();
    }
  }, [packageInfo]);

  // Handle group collapse/expand on the left side
  const handleGroupToggleLeft = (e, itemId) => {
    e.stopPropagation();
    setOpenGroupsLeft((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Handle section collapse/expand
  const handleSectionToggle = (sectionId) => {
    if (sectionId) {
      setOpenSections((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }));
    }
  };

  // Find parent item for a given sub-item
  const findParentItem = (subItemId) => {
    if (!previewData?.items) return null;

    for (const item of previewData.items) {
      if (item?.group_items?.some((subItem) => subItem.id === subItemId)) {
        return item;
      }
    }
    return null;
  };

  // Handle main item click
  const handleMainItemClick = (item) => {
    if (!item) return;

    setActiveItem(item);
    setActiveNavItem(item);
    setActiveParentItem(item);

    // Auto-expand sections for the selected item
    const newSections = {};
    item?.fromable?.sections?.forEach((section) => {
      if (section?.id) {
        newSections[section.id] = true;
      }
    });
    setOpenSections(newSections);
  };

  // Handle sub-item click
  const handleSubItemClick = (subItem, parentItem) => {
    if (!subItem) return;

    setActiveItem(subItem); // For content area
    setActiveNavItem(subItem); // For sidebar highlighting
    setActiveParentItem(parentItem); // Keep track of parent

    // Auto-expand the parent group if it's not already open
    setOpenGroupsLeft((prev) => ({
      ...prev,
      [parentItem.id]: true,
    }));

    // Auto-expand sections for the selected sub-item
    const newSections = {};
    subItem?.fromable?.sections?.forEach((section) => {
      if (section?.id) {
        newSections[section.id] = true;
      }
    });
    setOpenSections(newSections);
  };

  // Render field based on type
  const renderField = (field) => {
    const dummyData = {
      text: "John Doe",
      email: "john.doe@example.com",
    };
    switch (field?.type?.toLowerCase()) {
      case "text":
        return (
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: "text.black", pb: 1 }}
          >
            {field.value || dummyData.text}
          </Typography>
        );

      case "email":
        return (
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: "text.black", pb: 1 }}
          >
            {field.value || dummyData.email}
          </Typography>
        );

      case "color":
      case "date":
      case "datetime-local":
      case "month":
      case "number":
      case "password":
      case "range":
      case "tel":
      case "time":
      case "url":
      case "week":
        return (
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: "text.black", pb: 1 }}
          >
            {field.value || "Not set"}
          </Typography>
          // <FieldValue>
          //   <Typography variant="body1">{field.value || "Not set"}</Typography>
          // </FieldValue>
        );

      case "radiogroup":
        return (
          <FieldValue>
            <Typography variant="body1">{field.value || "Not set"}</Typography>
          </FieldValue>
        );

      case "checkbox":
        return (
          <FieldValue>
            <Typography variant="body1">
              {field.value?.join(", ") || "Not set"}
            </Typography>
          </FieldValue>
        );

      case "dropdown":
        return (
          <FieldValue>
            <Typography variant="body1">{field.value || "Not set"}</Typography>
          </FieldValue>
        );

      case "rating":
        return (
          <FieldValue>
            <Typography variant="body1">{field.value || "Not set"}</Typography>
          </FieldValue>
        );

      case "file":
        return (
          <FieldValue>
            <Typography variant="body1">
              {field.value
                ? `File uploaded: ${field.value}`
                : "No file uploaded"}
            </Typography>
          </FieldValue>
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Unsupported field type: {field.input_type}
          </Typography>
        );
    }
  };

  // Render table based on fromable_type
  const renderTable = (fromableType, itemName, sections = []) => {
    switch (fromableType) {
      case "App\\Models\\Credentialing\\CredentialingDoc":
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Expiry</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        bgcolor: "rgba(255, 193, 7, 0.1)",
                        width: "120px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "20px",
                        textAlign: "center",
                      }}
                    >
                      Pending
                    </Typography>
                  </TableCell>
                  <TableCell>Not Approved</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );

      case "App\\Models\\Credentialing\\CredentialingOrgGeneratedDoc":
      case "App\\Models\\Credentialing\\CredentialingOrgUploadDoc":
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doc Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        bgcolor: "#00c9a7",
                        width: "120px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "20px",
                        textAlign: "center",
                      }}
                    >
                      Uploaded
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );

      case "App\\Models\\Credentialing\\CredentialingPeerRefForm":
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Referee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Send</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Sent</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );

      case "App\\Models\\Credentialing\\CredentialingProfessRefForm":
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference Status</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Submission Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>2025-04-15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );

      case "App\\Models\\Credentialing\\CredentialingForm":
        return sections.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {sections.map((section) =>
                    section.fields.map((field) => (
                      <TableCell key={field.id}>
                        {field.label || field.name}
                      </TableCell>
                    ))
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {sections.map((section) =>
                    section.fields.map((field) => (
                      <TableCell key={field.id}>
                        {field.value || "N/A"}
                      </TableCell>
                    ))
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No fields available.</Typography>
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Unknown fromable type: {fromableType}
          </Typography>
        );
    }
  };

  if (!previewData) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          minHeight: "30vh",
        }}
      >
        {" "}
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      {/* Left Side: Navigation Menu */}
      <Box
        sx={{
          width: "27%",
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: "12px",
          boxShadow: " rgba(140, 152, 164, 0.08) 0px 3px 12px",
        }}
      >
        <List disablePadding>
          {previewData?.items?.map((item) => (
            <Box key={item?.id || `item-${Math.random()}`}>
              <NavListItem
                button
                active={
                  activeNavItem?.id === item?.id ||
                  (activeParentItem?.id === item?.id &&
                    activeNavItem?.id !== item?.id)
                    ? 1
                    : 0
                }
                onClick={() => handleMainItemClick(item)}
              >
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <CheckCircle
                    sx={{
                      color: "rgba(26, 161, 121, 1)",
                      fontSize: "17px",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item?.name || "Unnamed Item"}
                  primaryTypographyProps={{
                    fontWeight:
                      activeNavItem?.id === item?.id ||
                      activeParentItem?.id === item?.id
                        ? 600
                        : 400,
                  }}
                />
                {item?.group_items?.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleGroupToggleLeft(e, item.id)}
                  >
                    {openGroupsLeft[item.id] ? (
                      <DoDisturbOn
                        sx={{
                          fontSize: "20px",
                          color: "rgba(108, 117, 125, 1)",
                        }}
                      />
                    ) : (
                      <AddCircleOutline
                        sx={{
                          fontSize: "20px",
                          color: "rgba(108, 117, 125, 1)",
                        }}
                      />
                    )}
                  </IconButton>
                )}
              </NavListItem>

              {item?.group_items?.length > 0 && (
                <Collapse
                  in={!!openGroupsLeft[item.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ position: "relative", mt: 2 }}>
                    <List component="div" disablePadding>
                      {item.group_items.map((subItem, index) => (
                        <NavListItem
                          key={subItem?.id || `subitem-${Math.random()}`}
                          button
                          active={activeNavItem?.id === subItem?.id ? 1 : 0}
                          onClick={() => handleSubItemClick(subItem, item)}
                          sx={{
                            width: "90%",
                            ml: 4,
                            mt: -2,
                            pl: 1,
                            "&:hover": {
                              bgcolor: "transparent",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              borderLeft: `2px solid rgba(55, 125, 255, 1)`,
                              width: "15px",
                              height:
                                index === item?.group_items?.length - 1
                                  ? "60%"
                                  : "100%",
                              position: "absolute",
                              top: 10,
                              left: -5,
                            }}
                          ></Box>
                          {index === item?.group_items?.length - 1 && (
                            <Box
                              sx={{
                                width: "10px",
                                height: "10px",
                                position: "absolute",
                                bottom: 15,
                                left: -9,
                                bgcolor: "rgba(55, 125, 255, 1)",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              bgcolor:
                                activeNavItem?.id === subItem?.id
                                  ? "rgba(55, 125, 255, 0.1)"
                                  : "#ebeef0",
                              width: "100%",
                              pl: 2,
                              py: 1,
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <ListItemText
                              primary={subItem?.name || "Unnamed Subitem"}
                              primaryTypographyProps={{
                                fontWeight:
                                  activeNavItem?.id === subItem?.id ? 600 : 400,
                              }}
                            />
                            <ListItemIcon sx={{ minWidth: "32px" }}>
                              <CheckCircle
                                sx={{
                                  color: "rgba(26, 161, 121, 1)",
                                  fontSize: "17px",
                                }}
                              />
                            </ListItemIcon>
                          </Box>
                        </NavListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              )}
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </List>
      </Box>

      {/* Right Side: Content Area */}
      <Box
        sx={{
          width: "70%",
        }}
      >
        <List>
          {previewData?.items?.map((item, index) => (
            <Box
              key={item?.id || `content-${Math.random()}`}
              sx={{
                backgroundColor: "background.paper",
                p: 2,
                boxShadow: " rgba(231, 234, 243, 0.7) 0px 3px 12px",
                mt: index > 0 && "32px",
                borderRadius: "12px",
              }}
            >
              <ListItem sx={{ px: 0 }}>
                <Box
                  onClick={() => handleMainItemClick(item)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "20px",
                      color: "text.black",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.name || "Unnamed Item"}
                  </Typography>
                  <IconButton>
                    {activeItem?.id === item?.id ||
                    activeParentItem?.id === item?.id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Box>
              </ListItem>

              <Collapse
                in={
                  activeItem?.id === item?.id ||
                  activeParentItem?.id === item?.id
                }
                timeout="auto"
                unmountOnExit
              >
                {/* Show main item content only if it's the active item (not just parent of active sub-item) */}
                {activeItem?.id === item?.id && item?.fromable_type ? (
                  item.fromable_type ===
                    "App\\Models\\Credentialing\\CredentialingForm" &&
                  item.fromable.has_multiple_submissions === 0 ? (
                    <Box>
                      {item.fromable.sections?.length > 0 ? (
                        item.fromable.sections.map((section) => (
                          <Box
                            key={section?.id || `section-${Math.random()}`}
                            ml={4}
                            mb={3}
                          >
                            <SectionHeader>
                              <Box>
                                <Typography variant="h6" fontWeight={500}>
                                  {section?.title || "Untitled Section"}
                                </Typography>
                                {section?.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={0.5}
                                  >
                                    {section.description}
                                  </Typography>
                                )}
                              </Box>
                              <IconButton
                                onClick={() => handleSectionToggle(section?.id)}
                              >
                                {openSections[section?.id] ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </IconButton>
                            </SectionHeader>

                            <Collapse
                              in={!!openSections[section?.id]}
                              timeout="auto"
                              unmountOnExit
                            >
                              {section?.fields?.length > 0 ? (
                                <Box>
                                  {section.fields.map((field) => (
                                    <FormField
                                      key={
                                        field?.id || `field-${Math.random()}`
                                      }
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        // justifyContent: "space-between",
                                        gap: 4,
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        mb={1}
                                        sx={{ textTransform: "capitalize" }}
                                      >
                                        {field?.label ||
                                          field?.name ||
                                          "Unlabeled Field"}
                                        {field?.is_required && (
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        )}
                                      </Typography>
                                      {renderField(field)}
                                      {field?.helper_text && (
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          mt={0.5}
                                        >
                                          {field.helper_text}
                                        </Typography>
                                      )}
                                    </FormField>
                                  ))}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  No fields available in this section.
                                </Typography>
                              )}
                            </Collapse>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={4}
                        >
                          No form data available for this item.
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box ml={4} mt={2}>
                      {renderTable(
                        item.fromable_type,
                        item.name,
                        item.fromable?.sections || []
                      )}
                    </Box>
                  )
                ) : null}

                {item?.group_items?.length > 0 && (
                  <Box ml={4} mb={2}>
                    <List disablePadding>
                      {item.group_items.map((subItem) => (
                        <Box
                          key={
                            subItem?.id || `subitem-content-${Math.random()}`
                          }
                          sx={{
                            mb: 2,
                            px: 2,
                            py: activeItem?.id === subItem?.id ? 2 : "5px",
                            boxShadow:
                              " rgba(140, 152, 164, 0.08) 0px 3px 12px",
                            borderRadius: "4px",
                            backgroundColor:
                              activeItem?.id === subItem?.id
                                ? "rgba(55, 125, 255, 0.1)"
                                : "#EBEEF0",
                          }}
                        >
                          <ListItem
                            button
                            onClick={() => handleSubItemClick(subItem, item)}
                            sx={{
                              pl: 0,
                              color: "text.black",
                              fontWeight: 500,
                              "&:hover": {
                                bgcolor: "transparent",
                              },
                            }}
                          >
                            <ListItemText
                              primary={subItem?.name || "Unnamed Subitem"}
                            />
                            <ExpandMore />
                          </ListItem>
                          {activeItem?.id === subItem?.id && (
                            <Box mt={2}>
                              {subItem.fromable_type ===
                                "App\\Models\\Credentialing\\CredentialingForm" &&
                              subItem.fromable?.has_multiple_submissions ===
                                0 ? (
                                subItem.fromable?.sections?.length > 0 ? (
                                  subItem.fromable.sections.map((section) => (
                                    <Box
                                      key={
                                        section?.id ||
                                        `section-${Math.random()}`
                                      }
                                      mb={3}
                                    >
                                      <SectionHeader>
                                        <Box>
                                          <Typography
                                            variant="h6"
                                            fontWeight={500}
                                          >
                                            {section?.title ||
                                              "Untitled Section"}
                                          </Typography>
                                          {section?.description && (
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              mt={0.5}
                                            >
                                              {section.description}
                                            </Typography>
                                          )}
                                        </Box>
                                        <IconButton
                                          onClick={() =>
                                            handleSectionToggle(section?.id)
                                          }
                                        >
                                          {openSections[section?.id] ? (
                                            <ExpandLess />
                                          ) : (
                                            <ExpandMore />
                                          )}
                                        </IconButton>
                                      </SectionHeader>

                                      <Collapse
                                        in={!!openSections[section?.id]}
                                        timeout="auto"
                                        unmountOnExit
                                      >
                                        {section?.fields?.length > 0 ? (
                                          <Box>
                                            {section.fields.map((field) => (
                                              <FormField
                                                key={
                                                  field?.id ||
                                                  `field-${Math.random()}`
                                                }
                                              >
                                                <Typography
                                                  variant="subtitle2"
                                                  mb={1}
                                                >
                                                  {field?.label ||
                                                    "Unlabeled Field"}
                                                  {field?.is_required && (
                                                    <span
                                                      style={{ color: "red" }}
                                                    >
                                                      *
                                                    </span>
                                                  )}
                                                </Typography>
                                                {renderField(field)}
                                                {field?.helper_text && (
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    mt={0.5}
                                                  >
                                                    {field.helper_text}
                                                  </Typography>
                                                )}
                                              </FormField>
                                            ))}
                                          </Box>
                                        ) : (
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            No fields available in this section.
                                          </Typography>
                                        )}
                                      </Collapse>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    No form data available for this subitem.
                                  </Typography>
                                )
                              ) : (
                                renderTable(
                                  subItem.fromable_type,
                                  subItem.name,
                                  subItem.fromable?.sections || []
                                )
                              )}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </List>
                  </Box>
                )}
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Preview;
