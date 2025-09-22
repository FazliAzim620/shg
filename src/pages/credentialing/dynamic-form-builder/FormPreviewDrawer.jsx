import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import React from "react";
import PreviewForm from "../../form-builder/PreviewForm";
import { Close } from "@mui/icons-material";

const FormPreviewDrawer = ({ open, onClose, formPreview, children }) => {
  const closeHandler = () => {
    onClose();
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          minWidth: "1000px",
        },
      }}
    >
      <Box
        sx={{
          pt: "24px",
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "text.black",
          }}
        >
          Form preview
        </Typography>
        <IconButton sx={{ mr: -2 }} onClick={closeHandler}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex" }}>
        {/* PDF Preview Panel */}
        <Box
          sx={{
            width: "60%",
            p: 4,
            borderRight: "1px solid rgba(231, 234, 243, .7)",
            overflowY: "auto",
            height: "85vh",
          }}
        >
          <PreviewForm data={formPreview} />
        </Box>

        <Box
          sx={{
            width: "40%",
            p: 4,
            borderRight: "1px solid rgba(231, 234, 243, .7)",
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </Box>
      <Box
        sx={{
          p: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ccc",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: 1,
            px: 2,
          }}
        >
          <Button
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "5px 16px",
              minWidth: 0,
              width: "87px",
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
            fullWidth
            onClick={closeHandler}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FormPreviewDrawer;
