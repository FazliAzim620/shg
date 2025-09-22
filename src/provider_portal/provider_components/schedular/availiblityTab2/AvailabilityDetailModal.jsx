import React from "react";
import { Box, Button, Typography, Popover, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { formatTo12Hour } from "../../../../util";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
const AvailabilityDetailModal = ({
  admin,
  popoverAnchorEl,
  setPopoverAnchorEl,
  selectedAvailability,
  deletePopupHandler,
  editHandler,
  isPopoverOpen,
  popoverId,
}) => {
  const handleClosePopover = () => {
    setPopoverAnchorEl(null);
  };

  return (
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
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          minWidth: { md: "300px" },
          // position: "relative",
        }}
      >
        {!admin && (
          <IconButton
            aria-label="close"
            onClick={handleClosePopover}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {selectedAvailability && (
          <>
            <Typography
              sx={{ fontWeight: 600, lineHeight: 2, color: "#1e2022" }}
              gutterBottom
            >
              {selectedAvailability.type === "available"
                ? "Available"
                : "Unavailable"}
            </Typography>

            <Box sx={{ ml: 1 }}>
              <Typography
                sx={{ fontSize: "13px", color: "#1e2022 !important" }}
                pt={0.5}
                display="flex"
                alignItems="center"
              >
                <AccessTimeIcon
                  sx={{ mr: 2, fontSize: "14px", color: "#677778" }} // Correct hex color
                />
                {formatTo12Hour(selectedAvailability.start_time)} -{" "}
                {formatTo12Hour(selectedAvailability.end_time)}
              </Typography>
              <Typography
                sx={{ fontSize: "13px", color: "#1e2022 !important" }}
                pt={0.5}
                display="flex"
                alignItems="center"
              >
                <EventNoteOutlinedIcon
                  sx={{ mr: 2, fontSize: "14px", color: "#677778" }} // Correct hex color
                />
                {selectedAvailability.date}
              </Typography>
            </Box>

            {!admin ? (
              <Box mt={2} display="flex" gap={2} justifyContent="end">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={deletePopupHandler}
                  color="error"
                  sx={{ textTransform: "none", minWidth: 0, py: 0.5, px: 1.5 }}
                >
                  Delete
                </Button>
                <Button
                  // size="small"
                  onClick={editHandler}
                  startIcon={<ModeEditOutlineOutlinedIcon />}
                  sx={{
                    color: "#fff",
                    backgroundColor: "#4f3870",
                    fontSize: "0.8125rem",
                    borderRadius: "0.3125rem",
                    border: "1px solid #4f3870",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "#4f3870",
                      fontSize: "0.8125rem",
                      borderRadius: "0.3125rem",
                      border: "1px solid #2c64cc",
                      boxShadow: "0 4px 11px rgba(55, 125, 255, .35)",
                      transition:
                        "boxShadow 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    },
                  }}
                >
                  Edit
                </Button>
              </Box>
            ) : (
              <Box textAlign={"right"}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    m: 1,
                    textTransform: "capitalize",
                    color: "text.secondary",
                    bgcolor: "white",
                    borderColor: "#EEF0F7",
                    "&:hover": {
                      color: "#2c64cc",
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
            )}
          </>
        )}
      </Box>
    </Popover>
  );
};

export default AvailabilityDetailModal;
