import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import Accordion_ from "../../common/Accordion_";
import MoreActionMenu from "../../common/MoreActionMenu";
import ViewApplicantDetails from "../postJobDetailpage/ViewApplicantDetails";
import AvatarNameEmail from "../../common/AvatarNameEmail";
import { docIcon, msgIcon } from "../../Images";
import {
  DeleteConfirmModal as ConfirmModal,
  DeleteConfirmModal,
} from "../../handleConfirmDelete";
import KanbanAccordion from "./KanbanAccordion";
import { useSelector } from "react-redux";

const docmsgNum = {
  color: "#377DFF",
  ml: 0.5,
  mr: 1,
  fontWeight: 500,
  fontSize: "12px",
};

const KanbanCard = ({
  isCollapse,
  setIsCollapse,
  title,
  card,
  index,
  updateStatusHandler,
  deleteOpenModalWithId,
  setDeleteOpenModalWithId,
  deleteLoader,
  setDeleteLoader,
  deleteApplicantHandler,
  expandedCards,
  setExpandedCards,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mode = useSelector((state) => state.theme.mode);
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
  const [details, setDetails] = useState(null);
  const KanbanCardActions = [
    {
      label: "Shortlist",

      action: (id) => updateStatusHandler("shortlisted", id, "showConfirm"),
    },
    {
      label: "Reject",
      action: (id) => updateStatusHandler("rejected", id, "showConfirm"),
    },
    {
      label: "Contact",
      action: (id) => updateStatusHandler("contacted", id, "showConfirm"),
    },
    {
      label: "View Detail",
      action: handleOpenDrawer,
    },
    {
      label: "Delete",
      action: (id) => setDeleteOpenModalWithId(id),
    },
  ];
  const deleteModalClose = () => {
    setDeleteOpenModalWithId(false);
  };

  const handleCardToggle = (cardId) => {
    setIsCollapse(null);
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };
  useEffect(() => {
    setExpandedCards({});
  }, []);

  return (
    <>
      <DeleteConfirmModal
        closeJob={true}
        isOpen={deleteOpenModalWithId}
        onClose={deleteModalClose}
        onConfirm={deleteApplicantHandler}
        isLoading={deleteLoader}
        itemName={"Applicant"}
        title={"Delete Applicant"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to Delete this job?
          </Typography>
        }
      />
      <Draggable draggableId={`card-${card.id}`} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              borderRadius: "12px",
              mb: 2,
              opacity: snapshot.isDragging ? 0.5 : 1,
              height: "100%",
              minWidth: "317px",
              border: "1px solid #DEE2E6",
              boxShadow: "0 0 12px 0 #8C98A440",
            }}
          >
            <CardHeader
              sx={{
                mb: "0px",

                pb: "12px",
              }}
              title={
                <Box
                  onClick={() => setDetails(card)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #DEE2E6",
                    paddingBottom: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: mode === "dark" ? "#fff" : "#868686",
                    }}
                  >
                    #{card.id}
                  </Typography>
                  <MoreActionMenu
                    options={KanbanCardActions}
                    horiz={true}
                    id={card?.id}
                  />
                </Box>
              }
            />

            <KanbanAccordion
              expanded={
                expandedCards[card.id]
                  ? expandedCards[card.id]
                  : isCollapse === title
              }
              handleCardToggle={handleCardToggle}
              id={card.id}
              heading={
                <Box onClick={() => handleCardToggle(card.id)} sx={{}}>
                  <AvatarNameEmail
                    kanbanCard={true}
                    username={card.name}
                    email={card.email}
                  />
                </Box>
              }
            >
              {[
                { label: "Location", value: card.location || "Not specified" },
                {
                  label: "Apply date",
                  value: new Date(card.created_at).toLocaleDateString(),
                },
                { label: "Experience", value: `${card.experience} ` },
                { label: "Qualification", value: card.qualification },
              ]?.map((curr, ind) => (
                <Box
                  key={ind}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3.2,
                  }}
                >
                  <Typography
                    sx={{
                      color: mode === "dark" ? "#fff" : "#667085",
                      fontWeight: 400,
                      fontSize: "14px",
                      width: "90px",
                    }}
                  >
                    {curr.label}:
                  </Typography>
                  <Typography
                    sx={{
                      color: mode === "dark" ? "#fff" : "#344054",
                      fontSize: "14px",
                      fontWeight: mode === "dark" ? 400 : 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {curr.value}
                  </Typography>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mt: 2,
                  pt: 2,
                  px: 1,
                  borderTop: "1px solid #DEE2E6",
                  pb: "20px",
                }}
              >
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  <Box
                    sx={{
                      p: 1,
                      minWidth: "70px",
                      height: "30px",
                      color: mode === "dark" ? "#fff" : "#377DFF",
                      fontWeight: 500,
                      bgcolor: mode === "dark" ? "background.paper" : "#E4EBFA",
                      borderRadius: { xs: "10px", xl: "40px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" textTransform={"capitalize"}>
                      {card?.qualification}
                    </Typography>
                  </Box>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                  <img src={docIcon} alt="docs icon" />
                  <Typography sx={docmsgNum}>1</Typography>
                  <img src={msgIcon} alt="msg icon" />
                  <Typography sx={docmsgNum}>0</Typography>
                </Box>
              </Box>
            </KanbanAccordion>
          </Card>
        )}
      </Draggable>
      <ViewApplicantDetails
        open={drawerOpen}
        onClose={handleCloseDrawer}
        applicant={card}
        details={details}
      />
    </>
  );
};

const KanbanColumn = ({
  column,
  index,

  updateStatusHandler,
  deleteOpenModalWithId,
  setDeleteOpenModalWithId,
  deleteLoader,
  setDeleteLoader,
  deleteApplicantHandler,
}) => {
  const [isCollapse, setIsCollapse] = useState(null);
  const [clickedColumn, setClickedColumn] = useState(null);
  const mode = useSelector((state) => state.theme.mode);
  const [expandedCards, setExpandedCards] = useState({});
  const KanbanColumnActions = [
    {
      label: "Collapse Cards",
      action: () => {
        setExpandedCards({});
        if (isCollapse === clickedColumn) {
          setIsCollapse(null);
        }
        //  else {
        //   setIsCollapse(clickedColumn);
        // }
      },
    },
    {
      label: "Expand",
      action: () => {
        const newExpandedState = {};
        column.cards.forEach((card) => {
          newExpandedState[card.id] = true; // Set all cards to expanded (true)
        });
        setExpandedCards(newExpandedState);
        // setExpandedCards({});
        {
          setIsCollapse(clickedColumn);
        }
      },
    },
  ];

  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <Box
          sx={{
            minWidth: "365px",
            py: "24px",
            bgcolor: mode === "dark" ? "background.paper" : "#F0F2F5",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={3.5}
            mx="24px"
          >
            <Box display={"flex"} gap={1}>
              <Typography
                sx={{
                  color: mode === "dark" ? "#fff" : "#1E2022",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {column.title}
              </Typography>
              <Box
                sx={{
                  p: 2,
                  width: "25px",
                  height: "25px",
                  color: "#377DFF",
                  bgcolor: "#E4EBFA",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>{column.cards.length}</Typography>
              </Box>
            </Box>
            <MoreActionMenu
              // options={
              //   !isCollapse
              //     ? KanbanColumnActions.filter(
              //         (action) => action.label !== "Collapse Cards"
              //       )
              //     : KanbanColumnActions.filter(
              //         (action) => action.label !== "Expand"
              //       )
              // }
              options={KanbanColumnActions}
              horiz={true}
              job={column.title}
              setViewDetails={setClickedColumn}
            />
          </Box>
          <Box
            className="thin_slider"
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              px: "24px",
              minHeight: "1405px",
              maxHeight: "1405px",
              overflowY: "auto",
              backgroundColor: snapshot.isDraggingOver
                ? mode === "dark"
                  ? "#377DDD"
                  : "#92c0fc"
                : "inherit",
            }}
          >
            <Box
              sx={{
                width: "300px",
              }}
            >
              {column.cards.map((card, index) => (
                <KanbanCard
                  isCollapse={isCollapse}
                  setIsCollapse={setIsCollapse}
                  expandedCards={expandedCards}
                  setExpandedCards={setExpandedCards}
                  title={column.title}
                  key={card.id}
                  card={card}
                  index={index}
                  updateStatusHandler={updateStatusHandler}
                  deleteOpenModalWithId={deleteOpenModalWithId}
                  setDeleteOpenModalWithId={setDeleteOpenModalWithId}
                  deleteLoader={deleteLoader}
                  setDeleteLoader={setDeleteLoader}
                  deleteApplicantHandler={deleteApplicantHandler}
                />
              ))}
            </Box>
            {provided.placeholder}
          </Box>
        </Box>
      )}
    </Droppable>
  );
};

const ApplicantsKanbanView = ({
  data,
  darkMode,
  pagination,
  handleChangeRowsPerPage,
  handleChangePage,
  isLoading,
  updateStatusHandler,
  deleteOpenModalWithId,
  setDeleteOpenModalWithId,
  deleteLoader,
  setDeleteLoader,
  deleteApplicantHandler,
}) => {
  const scrollContainerRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [columns, setColumns] = useState({
    "column-1": {
      id: "column-1",
      title: "New Applications",
      cards: data.filter((app) => !app.status || app.status === "applied"),
    },
    "column-2": {
      id: "column-2",
      title: "Contacted",
      cards: data.filter((app) => app.status === "contacted"),
    },
    // "column-3": {
    //   id: "column-3",
    //   title: "Credentials",
    //   cards: data.filter((app) => app.status === "credentials"),
    // },
    // "column-4": {
    //   id: "column-4",
    //   title: "Interested",
    //   cards: data.filter((app) => app.status === "interested"),
    // },
    "column-5": {
      id: "column-5",
      title: "Shortlisted",
      cards: data.filter((app) => app.status === "shortlisted"),
    },
    "column-6": {
      id: "column-6",
      title: "Interviewed",
      cards: data.filter((app) => app.status === "interviewed"),
    },
    "column-7": {
      id: "column-7",
      title: "Contract send",
      cards: data.filter((app) => app.status === "contract"),
    },
    "column-8": {
      id: "column-8",
      title: "Hired",
      cards: data.filter((app) => app.status === "hired"),
    },
  });
  // Update columns when the data changes
  useEffect(() => {
    setColumns({
      "column-1": {
        id: "column-1",
        title: "New Applications",
        cards: data.filter((app) => !app.status || app.status === "applied"),
      },
      "column-2": {
        id: "column-2",
        title: "Contacted",
        cards: data.filter((app) => app.status === "contacted"),
      },
      "column-5": {
        id: "column-5",
        title: "Shortlisted",
        cards: data.filter((app) => app.status === "shortlisted"),
      },
      "column-6": {
        id: "column-6",
        title: "Interviewed",
        cards: data.filter((app) => app.status === "interviewed"),
      },
      "column-7": {
        id: "column-7",
        title: "Contract send",
        cards: data.filter((app) => app.status === "contract"),
      },
      "column-8": {
        id: "column-8",
        title: "Hired",
        cards: data.filter((app) => app.status === "hired"),
      },
    });
  }, [data]); // The effect depends on `data` so it will rerun when `data` changes

  const handleMove = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const newColumns = { ...columns };

    if (sourceColId === destColId) {
      // Reordering within the same column
      const column = newColumns[sourceColId];
      const newCards = Array.from(column.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      newColumns[sourceColId].cards = newCards;
    } else {
      // Moving between columns
      const sourceCards = Array.from(newColumns[sourceColId].cards);
      const destCards = Array.from(newColumns[destColId].cards);
      const [moved] = sourceCards.splice(source.index, 1);

      // Update the status based on the destination column
      const newStatus = getStatusFromColumnId(destColId);
      moved.status = newStatus;

      if (updateStatusHandler) {
        updateStatusHandler(newStatus, moved.id);
      }

      destCards.splice(destination.index, 0, moved);

      newColumns[sourceColId].cards = sourceCards;
      newColumns[destColId].cards = destCards;
    }
    setColumns(newColumns);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    setPendingMove(result);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (pendingMove) {
      handleMove(pendingMove);
    }
    setShowConfirmation(false);
    setPendingMove(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingMove(null);
    // Reset the dragged item to its original position
    setColumns({ ...columns });
  };

  const getStatusFromColumnId = (columnId) => {
    const statusMap = {
      "column-1": "applied",
      "column-2": "contacted",
      // "column-3": "credentials",
      // "column-4": "interested",
      "column-5": "shortlisted",
      "column-6": "interviewed",
      "column-7": "contract",
      "column-8": "hired",
    };
    return statusMap[columnId] || "applied";
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            borderTop: "2px solid #ECEFF6",
            mb: 2,
          }}
        />
        <Box
          className="thin_slider"
          sx={{
            mx: 2,
            mb: 5,
            pb: 2,
            display: "flex",
            overflowX: "auto",
            gap: 2,
          }}
        >
          {Object.values(columns).map((column, index) => (
            <KanbanColumn
              // KanbanColumnActions={KanbanColumnActions}
              key={column.id}
              column={column}
              index={index}
              updateStatusHandler={updateStatusHandler}
              deleteOpenModalWithId={deleteOpenModalWithId}
              setDeleteOpenModalWithId={setDeleteOpenModalWithId}
              deleteLoader={deleteLoader}
              setDeleteLoader={setDeleteLoader}
              deleteApplicantHandler={deleteApplicantHandler}
            />
          ))}
        </Box>
      </DragDropContext>
      <ConfirmModal
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        isLoading={""}
        title={"Confirm Status Change"}
        action={"Yes, Change Status"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to change the applicant's status?
          </Typography>
        }
        bgcolor={"#00c9a7"}
      />
    </>
  );
};

export default ApplicantsKanbanView;
