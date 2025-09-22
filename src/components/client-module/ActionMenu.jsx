import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const ActionMenu = ({
  menuItems,
  background,
  padding,
  client,
  title,
  color,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const handleItemClick = (action) => {
    action(client);
    handleClose();
  };
  const importIon = (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_7279_13053)">
        <path
          d="M15.4991 9.94727C15.6318 9.94727 15.7599 9.99998 15.8536 10.0938C15.9473 10.1875 15.9991 10.3148 15.9991 10.4473V12.9473C15.9991 13.4776 15.7891 13.9863 15.4142 14.3613C15.0391 14.7364 14.5296 14.9473 13.9991 14.9473H1.99915C1.46888 14.9471 0.960043 14.7363 0.585083 14.3613C0.210186 13.9863 -0.000854492 13.4776 -0.000854492 12.9473V10.4473C-0.000831946 10.3148 0.0520038 10.1875 0.14563 10.0938C0.239286 10.0001 0.366709 9.94739 0.499146 9.94727C0.631754 9.94727 0.75987 9.99998 0.853638 10.0938C0.947256 10.1875 0.999123 10.3148 0.999146 10.4473V12.9473C0.999146 13.2123 1.10475 13.4668 1.29211 13.6543C1.47954 13.8417 1.7341 13.9471 1.99915 13.9473H13.9991C14.2644 13.9473 14.5196 13.8418 14.7072 13.6543C14.8945 13.4668 14.9991 13.2123 14.9991 12.9473V10.4473C14.9992 10.3148 15.052 10.1875 15.1456 10.0938C15.2393 10.0001 15.3667 9.94739 15.4991 9.94727ZM7.99915 1.04688C8.06491 1.04688 8.13078 1.05975 8.19153 1.08496C8.25214 1.11016 8.30728 1.14688 8.35364 1.19336L11.3536 4.19336C11.4474 4.28713 11.5 4.41428 11.5001 4.54688C11.5001 4.67965 11.4475 4.80748 11.3536 4.90137C11.2598 4.99525 11.1319 5.04785 10.9991 5.04785C10.8665 5.04773 10.7394 4.99513 10.6456 4.90137L8.49915 2.75391V11.5469C8.49915 11.6795 8.44741 11.8076 8.35364 11.9014C8.25987 11.9951 8.13175 12.0469 7.99915 12.0469C7.86671 12.0467 7.73928 11.995 7.64563 11.9014C7.55186 11.8076 7.49915 11.6795 7.49915 11.5469V2.75391L5.35364 4.90137C5.30723 4.94778 5.25214 4.98461 5.19153 5.00977C5.13079 5.03492 5.06489 5.04785 4.99915 5.04785C4.93356 5.04779 4.86833 5.03486 4.80774 5.00977C4.74712 4.98461 4.69204 4.94777 4.64563 4.90137C4.59922 4.85496 4.56239 4.79987 4.53723 4.73926C4.51207 4.67852 4.49915 4.61262 4.49915 4.54688C4.49921 4.48129 4.51213 4.41606 4.53723 4.35547C4.56239 4.29485 4.59922 4.23977 4.64563 4.19336L7.64563 1.19336C7.69199 1.14688 7.74712 1.11016 7.80774 1.08496C7.86834 1.05982 7.93354 1.04694 7.99915 1.04688Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_7279_13053">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.046875)"
          />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<ExpandMore />}
        onClick={handleClick}
        sx={{
          textTransform: "capitalize",
          color: color ? color : open ? "text.btn_blue" : "text.primary",
          fontSize: " .8125rem",
          fontWeight: 400,
          background,
          py: padding,
          borderColor: "rgba(231, 234, 243, .7)",
          "&:hover": {
            background,
            borderColor: background ? background : "transparent",
            color: color ? color : "text.btn_blue",
          },
        }}
      >
        <span style={{ marginRight: "10px", marginTop: "5px" }}>
          {importIon}
        </span>{" "}
        {title ? title : "More actions"}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleItemClick(item.action);
            }}
          >
            {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : ""}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;
