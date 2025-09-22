import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

import AvatarNameEmail from "../common/AvatarNameEmail";
import { docIcon, msgIcon } from "../Images";
import Accordion_ from "../common/Accordion_";
import MoreActionMenu from "../common/MoreActionMenu";
import ViewApplicantDetails from "./postJobDetailpage/ViewApplicantDetails";
const docmsgNum = {
  color: "#377DFF",
  ml: 0.5,
  mr: 1,
  fontWeight: 500,
  fontSize: "12px",
};

const KanbanCard = ({ card, index }) => {
  // ========================more menu  canbancard actions=========================
  const [drawerOpen, setDrawerOpen] = useState(false); // State to control drawer visibility
  const handleOpenDrawer = () => setDrawerOpen(true); // Open the drawer
  const handleCloseDrawer = () => setDrawerOpen(false); // Close the drawer
  const KanbanCardActions = [
    {
      label: "Shortlist",
      action: () => console.log("Shortlist clicked"),
    },
    {
      label: "Reject",
      action: () => console.log("reject clicked"),
    },
    {
      label: "Contact",
      action: () => console.log("contac clicked"),
    },
    {
      label: "View Detail",
      action: handleOpenDrawer,
    },
    {
      label: "Delete",
      action: () => console.log("contac clicked"),
    },
  ];
  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              mb: 10,
              // pb: 2,
              opacity: snapshot.isDragging ? 0.5 : 1,
              height: "100%",
              minWidth: "317px",
              border: "1px solid #DEE2E6",
              borderRadius: "12px",
              // boxShadow: "offset-x offset-y blur-radius1 color"
              boxShadow: "0 0 12px 0 #8C98A440",
            }}
          >
            <CardHeader
              sx={{
                mb: "0px",
              }}
              title={
                <Box
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
                      color: "#868686",
                    }}
                  >
                    #001
                  </Typography>
                  <MoreActionMenu options={KanbanCardActions} horiz={true} />
                </Box>
              }
            />
            {/*========= Content =============*/}
            <Accordion_
              kanbanCard={true}
              heading={
                <>
                  <AvatarNameEmail
                    kanbanCard={true}
                    username="Abc"
                    email={"example@gmail.com"}
                  />
                </>
              }
            >
              {[
                { label: "Location", value: "Florida" },
                { label: "Apply date", value: "15/02/2025" },
                { label: "Experience", value: "3 years" },
                { label: "Hourly rate", value: "$100" },
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
                      color: "#667085",
                      fontWeight: 400,
                      fontSize: "14px",
                      width: "90px",
                    }}
                  >
                    {curr.label}:{" "}
                  </Typography>
                  <Typography
                    sx={{ color: "#344054", fontSize: "14px", fontWeight: 600 }}
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
                  borderTop: "1px solid #DEE2E6", // Adding a border to the top of the footer
                }}
              >
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  <Box
                    sx={{
                      p: 1, // Adjusting padding to make it look more like a pill
                      height: "30px", // You can adjust this height for the pill’s size
                      color: "#377DFF",
                      fontWeight: 500,
                      bgcolor: "#E4EBFA",
                      borderRadius: "50px", // Ensure it's large enough to create a rounded pill shape
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Doctor</Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1, // Adjusting padding to make it look more like a pill
                      height: "30px", // You can adjust this height for the pill’s size
                      color: "#123F84",
                      fontWeight: 500,
                      bgcolor: "#E4EBFA",
                      borderRadius: "50px", // Ensure it's large enough to create a rounded pill shape
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Health Care</Typography>
                  </Box>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                  <img src={docIcon} alt="docs icon" />
                  <Typography sx={docmsgNum}>3</Typography>
                  <img src={msgIcon} alt="msg icon" />
                  <Typography sx={docmsgNum}>3</Typography>
                </Box>
              </Box>
            </Accordion_>
          </Card>
        )}
      </Draggable>
      <ViewApplicantDetails open={drawerOpen} onClose={handleCloseDrawer} />
    </>
  );
};

const KanbanColumn = ({ column, index, KanbanColumnActions }) => (
  <Droppable droppableId={column.id}>
    {(provided, snapshot) => (
      <Box
        sx={{
          minWidth: "365px",
          py: "24px",
          bgcolor: "#F0F2F5",
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
                color: "#1E2022",
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
              <Typography>{5}</Typography>
            </Box>
          </Box>
          <MoreActionMenu options={KanbanColumnActions} horiz={true} />
        </Box>
        <Box
          className="thin_slider"
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            px: "24px",
            minHeight: "1405px",
            maxHeight: "1405px",
            // Set a fixed height for the column
            overflowY: "auto", // Enable vertical scrolling
            backgroundColor: snapshot.isDraggingOver ? "#f0f0f0" : "inherit",
          }}
        >
          <Box
            sx={{
              width: "300px",
            }}
          >
            {column.cards.map((card, index) => (
              <KanbanCard key={card.id} card={card} index={index} />
            ))}
          </Box>
        </Box>
      </Box>
    )}
  </Droppable>
);

const JobsKanbanView = ({ searchTerm }) => {
  const [columns, setColumns] = useState([
    {
      id: "column-1",
      title: "New Applications",
      cards: [{ id: "card-1", content: "Task 1" }],
    },
    {
      id: "column-2",
      title: "Contacted",
      cards: [{ id: "card-2", content: "Task 2" }],
    },
    {
      id: "column-3",
      title: "Credentials",
      cards: [{ id: "card-3", content: "Task 3" }],
    },
    {
      id: "column-4",
      title: "Interested",
      cards: [{ id: "card-4", content: "Task 4" }],
    },
    {
      id: "column-5",
      title: "Shortlisted",
      cards: [{ id: "card-5", content: "Task 5" }],
    },
    {
      id: "column-6",
      title: "Interviewed",
      cards: [{ id: "card-6", content: "Task 6" }],
    },
    {
      id: "column-7",
      title: "Contract send",
      cards: [{ id: "card-7", content: "Task 7" }],
    },
    {
      id: "column-8",
      title: "Hired",
      cards: [{ id: "card-8", content: "Task 8" }],
    },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = columns.find((col) => col.id === source.droppableId);
      const [removed] = column.cards.splice(source.index, 1);
      column.cards.splice(destination.index, 0, removed);
      setColumns([...columns]);
    } else {
      // Moving the card to a different column
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destinationColumn = columns.find(
        (col) => col.id === destination.droppableId
      );
      const [removed] = sourceColumn.cards.splice(source.index, 1);
      destinationColumn.cards.splice(destination.index, 0, removed);
      setColumns([...columns]);
    }
    console.log("Drag end:", result);
  };
  // ======================== more menu kanbanColumn actions ========================
  const KanbanColumnActions = [
    {
      label: "Collapse Cards",
      action: () => console.log("Shortlist clicked"),
    },
    {
      label: "Action here",
      action: () => console.log("reject clicked"),
    },
  ];

  return (
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
          display: "flex",
          overflowX: "auto",
          mx: 2,
          mb: 5,
          pb: 2,
          gap: 2,
        }}
      >
        {columns.map((column, index) => (
          <KanbanColumn
            KanbanColumnActions={KanbanColumnActions}
            key={column.id}
            column={column}
            index={index}
          />
        ))}
      </Box>
    </DragDropContext>
  );
};

export default JobsKanbanView;
