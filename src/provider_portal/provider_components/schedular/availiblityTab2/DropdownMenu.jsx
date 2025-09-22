import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Add, ExpandMore } from "@mui/icons-material";
import { Typography } from "@mui/material";

export default function DropdownMenu({ handleAddClick, handleOptionClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        color="primary"
        endIcon={<ExpandMore />}
        onClick={handleClick}
        sx={{
          ml: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,

          textTransform: "capitalize",
        }}
      >
        <Add />
        <Typography variant="body2">Add</Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleOptionClick("available")}>
          Availability
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick("unavailable")}>
          Unavailability
        </MenuItem>
      </Menu>
    </div>
  );
}
