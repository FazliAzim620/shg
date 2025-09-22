import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

import { EditCustomIcon, FileIcon } from "../../../pages/users/Icons";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
import Loading from "../../../components/common/Loading";

const OrganizeSections = ({ getItems, selectDocumentFormsHandler }) => {
  const dispatch = useDispatch();
  const packageInfo = useSelector((state) => state.package.packageInfo);
  const organizeItems = useSelector((state) => state.package.organizeItems);
  const [tabValue, setTabValue] = useState(0);
  const [sections, setSections] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [Isgroup, setIsGroup] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  // Added state variables for group editing
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupItems, setEditGroupItems] = useState([]);
  const [showAddItems, setShowAddItems] = useState(false);
  const [itemsToAdd, setItemsToAdd] = useState([]);

  useEffect(() => {
    if (organizeItems?.items) {
      setSections(organizeItems?.items);
    }
  }, [organizeItems]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCheckboxChange = (itemId) => {
    const isInGroup = sections.some(
      (section) =>
        section.group_id &&
        section.group_items.some((groupItem) => groupItem.id === itemId)
    );

    if (isInGroup) {
      setIsGroup(true);
      setSelectedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
      return;
    } else {
      setIsGroup(false);
    }
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleOpenModal = () => {
    if (selectedItems.length > 0) {
      setOpenModal(true);
    }
  };

  const handleUngroup = async () => {
    setIsSorting(true);
    try {
      const formData = new FormData();
      formData.append("group_item_ids", selectedItems.join(","));
      const resp = await API.post("/api/ungroup-cred-onb-group-item", formData);
      setIsSorting(false);
      getItems();
    } catch (error) {
      setIsSorting(false);
    }
    // const updatedSections = sections
    //   .map((section) => {
    //     if (section.group_id) {
    //       const updatedGroupItems = section.group_items.filter(
    //         (item) => !selectedItems.includes(item.id)
    //       );

    //       const ungroupedItems = section.group_items.filter((item) =>
    //         selectedItems.includes(item.id)
    //       );

    //       return {
    //         ...section,
    //         group_items: updatedGroupItems,
    //       };
    //     }
    //     return section;
    //   })
    //   .filter((section) => section.group_items.length > 0);

    // const ungroupedItems = sections
    //   .flatMap((section) => section.group_items)
    //   .filter((item) => selectedItems.includes(item.id));

    // setSections([
    //   ...updatedSections,
    //   ...ungroupedItems.map((item) => ({
    //     ...item,
    //     group_id: null,
    //   })),
    // ]);

    // setSelectedItems([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setGroupTitle("");
    setEditGroupId(null);
    setEditGroupItems([]);
    setShowAddItems(false);
    setItemsToAdd([]);
    setSelectedItems([]);
  };

  const handleCreateGroup = async (id = null) => {
    try {
      if (id) {
        // Handle group update case with item deletion or edit
        const groupSection = sections.find(
          (section) => section.group_id === id
        );
        if (groupSection) {
          let updatedGroupItems = [...groupSection.group_items];

          // If deleting an item
          if (selectedItemId) {
            updatedGroupItems = groupSection.group_items.filter(
              (item) => item.id !== selectedItemId
            );
          } else {
            // If editing, use editGroupItems
            updatedGroupItems = editGroupItems;
          }

          // Update sections state before API call
          const updatedSections = sections
            .map((section) => {
              if (section.group_id === id) {
                return {
                  ...section,
                  group_items: updatedGroupItems,
                  name: groupTitle || section.name,
                };
              }
              return section;
            })
            .filter(
              (section) => !section.group_id || section.group_items.length > 0
            );

          setSections(updatedSections);

          const modifiedItems = updatedGroupItems.map((item) => ({
            item_id: item.fromable_id,
            item_class: item.fromable_type,
          }));

          const obj = {
            group_title: groupTitle || groupSection.name,
            group_items: modifiedItems,
            package_id: packageInfo?.id || "",
            id: id,
          };

          const resp = await API.post(`/api/save-cred-onb-group`, obj);

          if (resp?.data?.success) {
            getItems();
            setOpenModal(false);
            setEditGroupId(null);
            setGroupTitle("");
            setEditGroupItems([]);
            setShowAddItems(false);
            setItemsToAdd([]);
            setSelectedItems([]);
            Swal.fire(
              "Updated!",
              selectedItemId
                ? "The item has been removed from the group."
                : "The group has been updated.",
              "success"
            );
          } else {
            throw new Error(resp?.data?.message || "Something went wrong!");
          }
        }
      } else if (selectedItems.length > 0 && groupTitle.trim()) {
        const group_items = sections.filter(
          (item) => selectedItems.includes(item.id) && !item.group_id
        );

        const modifiedItems = group_items?.map((item) => ({
          item_id: item?.fromable_id,
          item_class: item?.fromable_type,
        }));

        const obj = {
          group_title: groupTitle,
          group_items: modifiedItems,
          package_id: packageInfo?.id || "",
        };

        const resp = await API.post(`/api/save-cred-onb-group`, obj);

        if (resp?.data?.success) {
          getItems();
          setOpenModal(false);
          setGroupTitle("");
          setSelectedItems([]);
          Swal.fire("Created!", "The group has been created.", "success");
        } else {
          throw new Error(resp?.data?.message || "Something went wrong!");
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.msg ||
          "An error occurred while processing the request. Please try again later.",
      });
    }
  };

  const handleMenuOpen = (event, itemId) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  const handleMenuAction = (action) => {
    if (action === "select" || action === "unselect") {
      handleCheckboxChange(selectedItemId);
    } else if (action === "delete") {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const isInGroup = sections.some(
            (section) =>
              section.group_id &&
              section.group_items.some(
                (groupItem) => groupItem.id === selectedItemId
              )
          );

          if (isInGroup) {
            const groupSection = sections.find(
              (section) =>
                section.group_id &&
                section.group_items.some(
                  (groupItem) => groupItem.id === selectedItemId
                )
            );
            handleCreateGroup(groupSection.group_id);
          } else {
            const remainItem = sections.filter(
              (item) => item.id !== selectedItemId && !item.group_id
            );
            const updatedDocuments = remainItem.map((doc) => ({
              item_id: doc.fromable_id,
              item_name: doc.name,
              item_class: doc.fromable_type,
            }));
            const obj = {
              package_id: packageInfo?.id,
              package_items: updatedDocuments,
            };

            selectDocumentFormsHandler(obj);
            setSections(sections.filter((item) => item.id !== selectedItemId));
            setSelectedItems(
              selectedItems.filter((id) => id !== selectedItemId)
            );
            Swal.fire("Deleted!", "The item has been deleted.", "success");
          }
        }
      });
    }
    handleMenuClose();
  };
  const sortingHandler = async (data, desti) => {
    try {
      setIsSorting(true);
      const resp = await API.post(
        desti === "group"
          ? `/api/update-cred-onb-group-item-sort`
          : "/api/update-cred-onb-pkg-item-sort",
        data
      );
      if (resp?.data?.success) {
        setIsSorting(false);
        return true;
      } else {
        setIsSorting(false);
      }
    } catch (error) {
      setIsSorting(false);
      console.log(error);
    }
  };
  const onDragEnd = async (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    const sectionsCopy = JSON.parse(JSON.stringify(sections));

    if (type === "section") {
      const [reorderedItem] = sectionsCopy.splice(source.index, 1);
      sectionsCopy.splice(destination.index, 0, reorderedItem);
      // setSections(sectionsCopy);
      const sortData = {
        package_id: packageInfo?.id,
        package_items: sectionsCopy,
      };
      const resp = await sortingHandler(sortData, "item");
      if (resp) {
        setSections(sectionsCopy);
      }
      return;
    }

    if (type.startsWith("group-")) {
      const groupId = parseInt(type.split("-")[1]);
      const groupIndex = sectionsCopy.findIndex(
        (item) => item.group_id === groupId
      );

      if (groupIndex !== -1) {
        const groupItems = sectionsCopy[groupIndex].group_items;
        const [reorderedItem] = groupItems.splice(source.index, 1);
        groupItems.splice(destination.index, 0, reorderedItem);
        sectionsCopy[groupIndex].group_items = groupItems;
        const sortData = {
          group_id: sectionsCopy[groupIndex]?.group_id,
          group_items: (sectionsCopy[groupIndex].group_items = groupItems),
        };

        const resp = await sortingHandler(sortData, "group");
        if (resp) {
          setSections(sectionsCopy);
        }
      }
    }
  };

  const handleAccordionChange = (groupId) => (event, isExpanded) => {
    setExpandedGroup(isExpanded ? groupId : null);
  };

  // Added function to handle group edit
  const groupEditHandler = (groupId) => {
    const group = sections.find((section) => section.group_id === groupId);
    if (group) {
      setEditGroupId(groupId);
      setGroupTitle(group.name);
      setEditGroupItems(group.group_items);
      setOpenModal(true);
      setShowAddItems(false);
    }
  };

  // Added function to handle adding more items
  const handleAddMoreItems = () => {
    setShowAddItems(true);
    const ungroupedItems = sections.filter((section) => !section.group_id);
    setItemsToAdd(ungroupedItems);
  };

  // Added function to handle adding selected items to the group
  const handleAddItemsToGroup = () => {
    const selectedUngroupedItems = itemsToAdd.filter((item) =>
      selectedItems.includes(item.id)
    );

    // Filter out items that already exist in editGroupItems
    const newItemsToAdd = selectedUngroupedItems.filter(
      (newItem) =>
        !editGroupItems.some((existingItem) => existingItem.id === newItem.id)
    );

    if (newItemsToAdd.length > 0) {
      setEditGroupItems([...editGroupItems, ...newItemsToAdd]);
    } else {
      alert("The selected items are already part of this group");
    }

    setShowAddItems(false);
    setItemsToAdd([]);
    setSelectedItems([]);
  };

  const filterSections = () => {
    switch (tabValue) {
      case 0:
        return sections;
      case 1:
        return sections.filter((section) => section.group_id);
      case 2:
        return sections.filter((section) => !section.group_id);
      default:
        return sections;
    }
  };

  const renderDocumentItem = (item, index, isDraggable = true) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <Draggable
        key={item.id.toString()}
        draggableId={item.id.toString()}
        index={index}
        isDragDisabled={!isDraggable}
      >
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid rgba(228, 231, 236, 1)",
              bgcolor: "background.paper",
              borderRadius: "8px",
              p: "1rem ",
            }}
          >
            <Box sx={{ mr: 1, color: "#aaa" }}>
              <DragIndicatorIcon fontSize="small" />
            </Box>
            <BpCheckbox
              size="small"
              checked={isSelected}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, ml: 1 }}>
              <FileIcon />
              {/* <FileCopyOutlinedIcon
                fontSize="small"
                sx={{ mr: 1, color: "#aaa" }}
              /> */}
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  ml: 1,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {item.name}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, item.id)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Draggable>
    );
  };

  const renderGroupItem = (groupItem, index, groupId) => {
    const isSelected = selectedItems.includes(groupItem.id);
    return (
      <Draggable
        key={groupItem.id.toString()}
        draggableId={`group-item-${groupItem.id}`}
        index={index}
      >
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #eaeaea",
              py: 1,
              width: "98%",
              mx: "auto",
            }}
          >
            <Box sx={{ mr: 1, color: "#aaa" }}>
              <DragIndicatorIcon fontSize="small" />
            </Box>
            <BpCheckbox
              size="small"
              checked={isSelected}
              onChange={() => handleCheckboxChange(groupItem.id)}
            />
            <Box sx={{ display: "flex", alignItems: "center", flex: 1, ml: 1 }}>
              <FileIcon />
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  ml: 1,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {groupItem?.name.split("\\").pop()}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, groupItem.id)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Draggable>
    );
  };

  const renderSection = (section, index) => {
    if (section.group_id) {
      return (
        <Draggable
          key={`group-${section.group_id}`}
          draggableId={`group-${section.group_id}`}
          index={index}
        >
          {(provided) => (
            <Accordion
              ref={provided.innerRef}
              {...provided.draggableProps}
              expanded={expandedGroup === section.group_id}
              onChange={handleAccordionChange(section.group_id)}
              sx={{
                mb: 2,
                boxShadow: "none",
                "&::before": { display: "none" },
                borderBottom: "1px solid rgba(228, 231, 236, 1)",
                bgcolor: "background.paper",
                borderRadius: "8px",
                p: "0.5rem 0px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: "background.paper",
                  "&.Mui-expanded": { minHeight: "48px" },
                }}
                {...provided.dragHandleProps}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box sx={{ mr: 1, color: "#aaa" }}>
                    <DragIndicatorIcon fontSize="small" />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      fontSize: "20px",
                      color: "text.black",
                      pr: 1,
                    }}
                  >
                    {section.name.charAt(0).toUpperCase() +
                      section.name.slice(1)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      groupEditHandler(section.group_id);
                    }}
                  >
                    <EditCustomIcon />
                  </IconButton>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <Droppable
                  droppableId={`group-items-${section.group_id}`}
                  type={`group-${section.group_id}`}
                >
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ p: 2 }}
                    >
                      {section.group_items &&
                        section.group_items.map((groupItem, groupItemIndex) =>
                          renderGroupItem(
                            groupItem,
                            groupItemIndex,
                            section.group_id
                          )
                        )}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </AccordionDetails>
            </Accordion>
          )}
        </Draggable>
      );
    } else {
      return renderDocumentItem(section, index);
    }
  };

  return (
    <Box>
      <Loading open={isSorting} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Organize into sections
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
        Select items to create sections (required and optional). Keep similar
        items together for better organization. If you do not wish to create
        sections, you can proceed without it.
      </Typography>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ minHeight: "36px" }}
        >
          <Tab label="All" sx={{ minHeight: "36px", textTransform: "none" }} />
          <Tab
            label="Group"
            sx={{ minHeight: "36px", textTransform: "none" }}
          />
          <Tab
            label="Not grouped"
            sx={{
              minHeight: "36px",
              textTransform: "none",
              "& .MuiTab-wrapper": {
                display: "flex",
                alignItems: "center",
              },
            }}
            icon={
              <Box
                component="span"
                sx={{
                  backgroundColor: "#e0e0e0",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  ml: 1,
                }}
              >
                {sections.filter((s) => !s.group_id).length}
              </Box>
            }
            iconPosition="end"
          />
        </Tabs>
        <Box sx={{ textAlign: "right", mb: 1 }}>
          {selectedItems.length > 0 && Isgroup && (
            <Button
              variant="outlined"
              onClick={handleUngroup}
              size="small"
              sx={{ textTransform: "none", borderRadius: "4px" }}
            >
              Un Group
            </Button>
          )}

          {Isgroup ? (
            ""
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              disabled={selectedItems.length === 0}
              sx={{
                textTransform: "none",
                borderRadius: "4px",
                backgroundColor: "#4c84ff",
              }}
            >
              Create group
            </Button>
          )}
        </Box>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ bgcolor: "background.paper" }}
            >
              {filterSections().map((section, index) =>
                renderSection(section, index)
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            handleMenuAction(
              selectedItems.includes(selectedItemId) ? "unselect" : "select"
            )
          }
        >
          {selectedItems.includes(selectedItemId) ? "Unselect" : "Select"}
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction("delete")}>Delete</MenuItem>
      </Menu>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="create-group-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", md: "800px" },
            bgcolor: "white",
            borderRadius: "12px",
            p: 0,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: "1.1rem", color: "text.black" }}
            >
              {editGroupId ? "Edit group" : "Create group"}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              size="small"
              sx={{ color: "#9e9e9e" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography sx={{ mb: 2, fontSize: "0.9rem", color: "text.black" }}>
              {editGroupId
                ? "Edit the group details below:"
                : "Are you sure you want to create a new group of selected forms?"}
            </Typography>

            <Typography sx={{ mb: 1, fontSize: "0.9rem", color: "text.black" }}>
              Group title
            </Typography>
            <CommonInputField
              name="groupTitle"
              placeholder="Personal information"
              value={groupTitle || ""}
              onChange={(e) => setGroupTitle(e.target.value)}
              type="text"
              error={!groupTitle.trim()}
            />

            {editGroupId && !showAddItems && (
              <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                {editGroupItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      borderBottom: "1px solid #eaeaea",
                      py: 1,
                    }}
                  >
                    <FileCopyOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "#aaa" }}
                    />
                    <Typography variant="body2">
                      {item.fromable_type.split("\\").pop()}
                    </Typography>
                  </Box>
                ))}
                {!showAddItems && (
                  <Button
                    variant="text"
                    onClick={handleAddMoreItems}
                    sx={{
                      textTransform: "none",
                      position: "fixed",
                      bottom: 50,
                      color: "#2979ff",
                      mt: 2,
                      p: 0,
                    }}
                  >
                    Add more items
                  </Button>
                )}
              </Box>
            )}

            {showAddItems && (
              <Box sx={{ mt: 2 }}>
                {itemsToAdd.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #eaeaea",
                      py: 1,
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <FileCopyOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "#aaa" }}
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  onClick={handleAddItemsToGroup}
                  disabled={selectedItems.length === 0}
                  sx={{
                    textTransform: "none",
                    mt: 2,
                    bgcolor: "#2979ff",
                    "&:hover": { bgcolor: "#1976d2" },
                  }}
                >
                  Add to group
                </Button>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{
                  textTransform: "none",
                  px: 3,
                  borderColor: "#e0e0e0",
                  color: "#616161",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleCreateGroup(editGroupId)}
                disabled={!groupTitle.trim()}
                sx={{
                  textTransform: "none",
                  px: 3,
                  bgcolor: "#2979ff",
                  "&:hover": { bgcolor: "#1976d2" },
                }}
              >
                {editGroupId ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrganizeSections;
