import React, { useState } from "react";
import { Close, FilterList } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";

const DrawerFilter = ({
  title,
  children,
  appliedFilterCount,
  filterStates,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };

  return (
    <>
      {/* Filter Button */}
      <Button
        variant="outlined"
        startIcon={<FilterList />}
        sx={{
          textTransform: "capitalize",
          color: "text.primary",
          fontSize: ".8125rem",
          fontWeight: 400,
          borderColor: "rgba(231, 234, 243, .7)",
          "&:hover": {
            borderColor: "rgba(231, 234, 243, .7)",
          },
          ml: 3,
        }}
        onClick={() => toggleDrawer(true)} // Open the drawer on click
      >
        Filter
        {appliedFilterCount > 0 && (
          <Box
            component="span"
            sx={{
              ml: 1,
              px: 1,
              py: 0.25,
              backgroundColor: "secondary.main",
              color: "white",
              borderRadius: "8px",
              fontSize: "0.75rem",
            }}
          >
            {appliedFilterCount}
          </Box>
        )}
      </Button>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
      >
        {/* Header */}
        <Box
          sx={{
            py: 2,
            px: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          <IconButton onClick={() => toggleDrawer(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ opacity: 0.5 }} />

        {/* Content */}
        <Box
          sx={{
            borderBottom: "1px solid #ccc",
            pt: 2,
            pb: 6,
            mb: 2,
            px: 3,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            pb: 2,
            backgroundColor: "#fff",
            textAlign: "right",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleDrawer(false)}
            sx={{ textTransform: "none", px: 4 }}
          >
            Show Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default DrawerFilter;
