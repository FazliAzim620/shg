import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AvailiblityUnavailiblityBtn = ({ onOptionSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openAddMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAddMenu = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    onOptionSelect(option); // Call the callback with the selected option
    handleCloseAddMenu();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ExpandMoreIcon />}
          onClick={handleClick}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <AddIcon />
          <Typography>Add</Typography>
        </Button>
        <Menu
          anchorEl={anchorEl}
          openAddMenu={openAddMenu}
          onClose={handleCloseAddMenu}
          PaperProps={{
            sx: {
              width: 150,
            },
          }}
        >
          <MenuItem onClick={() => handleOptionClick("available")}>
            Availability
          </MenuItem>
          <MenuItem onClick={() => handleOptionClick("unavailable")}>
            Unavailability
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default AvailiblityUnavailiblityBtn;
