import React, { useState } from "react";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MoreVert, MoreHoriz } from "@mui/icons-material";
import { useSelector } from "react-redux";

const MoreActionMenu = ({
  id,
  horiz,
  kanban,
  more,
  width,
  options = [],
  buttonStyles = {},

  stopPropagation = false,
  job,
  setViewDetails,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const mode = useSelector((state) => state.theme.mode);
  const handleOpenMenu = (event) => {
    if (setViewDetails) {
      setViewDetails(job);
    }

    // Conditionally stop event propagation based on the prop
    if (stopPropagation) {
      event.stopPropagation();
    }
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      {more ? (
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "capitalize",
            color: "text.secondary",
            bgcolor: mode === "dark" ? "background.paper" : "white",
            borderColor: "#EEF0F7",
            "&:hover": {
              color: "text.btn_blue",
              bgcolor: mode === "dark" ? "background.paper" : "white",
              borderColor: "#EEF0F7",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            },
            ...buttonStyles,
          }}
          aria-controls={open ? "more-action-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpenMenu}
        >
          More&nbsp;
          <ExpandMoreIcon
            sx={{
              fontSize: "14px",
              "&:hover": {
                color: "text.btn_blue",
              },
            }}
          />
        </Button>
      ) : horiz ? (
        <MoreHoriz
          sx={{
            cursor: "pointer",
          }}
          onClick={handleOpenMenu}
        />
      ) : (
        <MoreVert
          sx={{
            cursor: "pointer",
          }}
          onClick={handleOpenMenu}
        />
      )}

      <Menu
        sx={{ width }}
        id="more-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "more-action-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: kanban ? "left" : "right", // Adjust based on the kanban prop
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: kanban ? "left" : "right", // Adjust based on the kanban prop
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              // Conditionally stop event propagation for the menu item click as well
              if (stopPropagation) {
                e.stopPropagation();
              }
              handleCloseMenu(e);
              if (option.action) {
                option.action(id);
              }
            }}
          >
            <Typography
              color={
                (option.label === "Delete" || option.label === "Archive") &&
                "#dc3545"
              }
            >
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreActionMenu;
