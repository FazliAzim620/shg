import React from "react";
import {
  Box,
  Button,
  Typography,
  Popover,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AccessTime,
  GroupOutlined,
  Notes,
  PersonOutline,
} from "@mui/icons-material";
import { formatTo12Hour } from "../../../../util";

const EventDetailModal = ({
  handleClosePopover,
  popoverAnchorEl,
  isPopoverOpen,
  popoverId,
  selectedEvent,
}) => {
  return (
    <>
      <Popover
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={
          {
            // boxShadow: "0 .6125rem 2.5rem .6125rem rgba(140, 152, 164, .175)",
          }
        }
      >
        <Box
          sx={{
            px: 2,
            minWidth: { md: "400px" },
            position: "relative",
          }}
        >
          <Typography sx={{ pt: 2 }} variant="h6" component="div">
            {selectedEvent &&
              `${formatTo12Hour(selectedEvent?.start_time)} - ${formatTo12Hour(
                selectedEvent?.end_time
              )}`}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <AccessTime />
              </ListItemIcon>
              <ListItemText primary={selectedEvent?.date} />
            </ListItem>
          </List>
          <Box display="flex" alignItems="center" mt={2}>
            {/* <Avatar
              src="AB"
              alt="Mark Williams"
            /> */}
            <Typography variant="body1" ml={2}>
              {selectedEvent?.job?.client?.name}
            </Typography>
          </Box>
        </Box>
        <Box textAlign={"right"}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              m: 2,
              textTransform: "capitalize",
              color: "text.secondary",
              bgcolor: "white",
              borderColor: "#EEF0F7",
              "&:hover": {
                color: "#4F3870",
                bgcolor: "white",

                borderColor: "#EEF0F7",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              },
            }}
            onClick={handleClosePopover}
          >
            Close
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default EventDetailModal;
