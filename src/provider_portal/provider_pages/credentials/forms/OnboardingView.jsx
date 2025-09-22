import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../../../util";
import FormPreview from "./FormPreview";

const OnboardingView = ({ open, onClose, mode, data, selectedForm }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const closeHandler = () => onClose();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeHandler}
      sx={{
        "& .MuiDrawer-paper": {
          width: isMobile ? "100%" : "90vw",
          maxWidth: "1200px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            px: 4,
            py: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {capitalizeFirstLetter(data?.name || "Document Preview")}
          </Typography>
          <IconButton onClick={closeHandler}>
            <Close />
          </IconButton>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflowY: "auto",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Form Preview
            </Typography>
            <Box sx={{ width: "100%", minHeight: 400 }}>
              {selectedForm?.json_structure ? (
                <FormPreview
                  data={JSON.parse(data.json_structure)}
                  editData={JSON.parse(selectedForm?.json_structure)}
                  readonly={"view"}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2">
                    No form data available to preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: "background.paper",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={closeHandler}>
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default OnboardingView;
