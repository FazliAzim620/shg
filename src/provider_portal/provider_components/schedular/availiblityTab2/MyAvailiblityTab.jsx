import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { Calendar } from "react-big-calendar";
import localizer from "../../../../components/common/calendarLocalizer";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eventStyleGetter } from "../../../../util";
import { useSelector, useDispatch } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import AvailabilityDetailModal from "./AvailabilityDetailModal";
import AddEditAvailiblityModal from "./AddEditAvailiblityModal";
import { DeleteConfirmModal } from "../../../../components/handleConfirmDelete";
import API from "../../../../API";
import {
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
} from "@mui/icons-material";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";

import doneIcon from "../../../../assets/doneIcon.svg";
import DropdownMenu from "./DropdownMenu";
import { fetchProviderAvailability } from "../../../../thunkOperation/job_management/availiblityThunk";
import SkeletonRow from "../../../../components/SkeletonRow";
import NodataFoundCard from "../../NodataFoundCard";

const MyAvailiblityTab = ({ admin, provider_id }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.login);
  const { availability } = useSelector((state) => state?.providerAvailability);
  const getAvailiblityData = availability?.data;
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [DataLoading, setDataLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddMenu, setOpenAddMenu] = useState(false);
  const [type, setType] = useState("");
  const [Availibity, setAvailibity] = useState({
    from_date: "",
    to_date: "",
    start_time: "",
    end_time: "",
    type,
    selected_days: [],
  });
  const [open, setOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (admin) {
        await dispatch(fetchProviderAvailability(provider_id));
      } else {
        await dispatch(fetchProviderAvailability());
      }
      setDataLoading(false);
    };
    fetchData();
  }, [dispatch, admin, provider_id]);

  useEffect(() => {
    if (getAvailiblityData) {
      const formattedEvents = getAvailiblityData.map((event) => ({
        title: event.type === "available" ? "Available" : "Unavailable",
        start: new Date(`${event.date}T${event.start_time}`),
        end: new Date(`${event.date}T${event.end_time}`),
        allDay: false,
        ...event,
      }));
      setEvents(formattedEvents);
    }
  }, [getAvailiblityData]);

  const handleEventClick = (event, e) => {
    setSelectedAvailability(event);
    setPopoverAnchorEl(e.currentTarget);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenAddMenu(true);
  };

  const handleCloseAddMenu = () => {
    setAnchorEl(null);
    setOpenAddMenu(false);
  };

  const handleOptionClick = (option) => {
    setOpen(true);
    setType(option);
    handleCloseAddMenu();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleClose = () => {
    setOpen(false);
    setAvailibity({
      from_date: "",
      to_date: "",
      start_time: "",
      end_time: "",
      selected_days: [],
    });
  };

  const deletePopupHandler = () => {
    setShowModal(true);
    setPopoverAnchorEl(null);
  };

  const editHandler = () => {
    setPopoverAnchorEl(null);
    setOpen(true);
    setAvailibity({
      id: selectedAvailability?.id,
      from_date: selectedAvailability?.date,
      start_time: selectedAvailability?.start_time,
      end_time: selectedAvailability?.end_time,
      type: selectedAvailability?.type,
    });
  };

  const deleteHandler = async () => {
    setPopoverAnchorEl(null);
    try {
      setLoading(true);
      const resp = await API.delete(
        `/api/delete-provider-availability/${selectedAvailability?.id}`
      );
      if (resp?.data?.success) {
        const data = dispatch(fetchProviderAvailability());
        if (data) {
          setLoading(false);
          setShowModal(false);
          setSelectedAvailability(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box>
        {DataLoading ? (
          <Box sx={{ height: "100vh" }}>
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
          </Box>
        ) : (
          //  getAvailiblityData?.length === 0 ? (
          //   <NodataFoundCard />
          // ) :
          <Calendar
            className={
              darkMode === "light" ? "big_calendar_white" : "big_calendar_dark"
            }
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={(event) => {
              const admin =
                user?.user?.role === "provider" ? "provider" : "admin";
              const color =
                darkMode === "light"
                  ? user?.user?.role === "provider"
                    ? "#EAF1FF"
                    : "#b1f1fb"
                  : user?.user?.role === "provider"
                  ? "#EAF1FF"
                  : "#b1f1fb";
              return eventStyleGetter(event, color, admin);
            }}
            onSelectEvent={handleEventClick}
            components={{
              // showMore: ({ onClick, count }) => (
              //   <Button
              //     sx={{
              //       color: "text.main",
              //       fontSize: "12px",
              //       textTransform: "none",
              //       p: 0,
              //       p
              //     }}
              //     onClick={onClick}
              //     // style={{
              //     //   backgroundColor: "#ff5722", // Customize the background
              //     //   color: "white", // Customize the text color
              //     //   border: "none",
              //     //   borderRadius: "4px",
              //     //   padding: "5px 10px",
              //     // }}
              //   >
              //     + {count} More
              //   </Button>
              // ),
              toolbar: (toolbarProps) => (
                <CustomToolbar
                  {...toolbarProps}
                  admin={admin}
                  handleAddClick={handleClick}
                  openAddMenu={openAddMenu}
                  handleCloseAddMenu={handleCloseAddMenu}
                  handleOptionClick={handleOptionClick}
                />
              ),
            }}
          />
        )}
      </Box>
      <AddEditAvailiblityModal
        type={type}
        open={open}
        handleClose={handleClose}
        Availibity={Availibity}
        saveLoading={saveLoading}
        setAvailibity={setAvailibity}
      />
      <AvailabilityDetailModal
        admin={admin}
        deletePopupHandler={deletePopupHandler}
        editHandler={editHandler}
        popoverAnchorEl={popoverAnchorEl}
        setPopoverAnchorEl={setPopoverAnchorEl}
        isPopoverOpen={Boolean(popoverAnchorEl)}
        popoverId={
          Boolean(popoverAnchorEl) ? "event-availiblity-popover" : undefined
        }
        selectedAvailability={selectedAvailability}
      />
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={deleteHandler}
        isLoading={isLoading}
        itemName={"Schedule"}
        title={"Delete"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to delete this Schedule?
            <br /> This action cannot be undone.
          </Typography>
        }
      />
    </>
  );
};

const CustomToolbar = ({
  label,
  onNavigate,
  onView,
  view,
  admin,
  handleAddClick,
  openAddMenu,
  handleCloseAddMenu,
  handleOptionClick,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToToday = () => {
    onNavigate("TODAY");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Box> */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <Button
            onClick={goToToday}
            sx={{
              mr: 2,
              textTransform: "capitalize",
              color: "text.or_color",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "5px 16px",
              minWidth: 0,
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                color: "text.main",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            This week
          </Button> */}
            <IconButton onClick={goToBack}>
              <ChevronLeft sx={{ color: "text.or_color" }} />
            </IconButton>
            <Box>
              <CustomTypographyBold mx={4} fontSize={"0.875rem"} height={1.5}>
                {label}
              </CustomTypographyBold>
            </Box>
            <IconButton onClick={goToNext}>
              <ChevronRight sx={{ color: "text.or_color" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          endIcon={<KeyboardArrowDown />}
          onClick={handleClick}
          sx={{
            textTransform: "capitalize",
            color: "text.primary",
            fontSize: "0.8125rem",
            fontWeight: 400,
            border: "1px solid rgba(99, 99, 99, 0.2)",
            padding: "5px 16px",
            minWidth: 0,
            bgcolor: "background.paper",
            "&:hover": {
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              bgcolor: "background.paper",
              color: "text.main",
              transform: "scale(1.01)",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          {view === "agenda" ? "List" : view}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {["month", "week", "day", "agenda"].map((viewOption) => (
            <MenuItem
              key={viewOption}
              onClick={() => {
                onView(viewOption);
                handleClose();
              }}
              sx={{
                minWidth: "120px",
                bgcolor:
                  view === viewOption &&
                  " rgba(196.88125, 200.3, 203.71875,0.3)",
              }}
            >
              {viewOption === "agenda"
                ? "List"
                : viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
              {view === viewOption && (
                <Box
                  component={"img"}
                  src={doneIcon}
                  alt="done"
                  sx={{ width: "1rem", ml: 0.5 }}
                />
              )}
            </MenuItem>
          ))}
        </Menu>
        {!admin && (
          <>
            <DropdownMenu handleOptionClick={handleOptionClick} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default MyAvailiblityTab;
