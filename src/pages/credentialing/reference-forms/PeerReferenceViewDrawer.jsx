import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import PreviewForm from "../../form-builder/PreviewForm";

const PeerReferenceViewDrawer = ({ open, onClose, viewData }) => {
  const onCloseHandler = () => {
    onClose();
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onCloseHandler}
        sx={{
          "& .MuiDrawer-paper": {
            minWidth: { md: "800px" },
            maxWidth: "1000px",
          },
        }}
      >
        <Box
          sx={{
            p: "24px",

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.paper",
            width: "100%",
            borderBottom: "1px solid rgba(222, 226, 230, 1)",
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
          <IconButton sx={{ mr: -2 }} onClick={onCloseHandler}>
            <Close />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 4,
            pb: 11,
            flexGrow: 1,
            overflowY: "auto",
            height: "calc(100vh - 150px)",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", height: "100%", pt: "24px" }}>
            {/* Left Side - Scrollable Content */}
            <Box
              sx={{
                width: "60%",
                // p: 4,
                borderRight: "1px solid rgba(231, 234, 243, .7)",

                overflowY: "auto",
                pr: 3,
                mr: 2,
                height: "100%",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "-ms-overflow-style": "none",
              }}
            >
              <PreviewForm
                data={
                  viewData?.json_structure
                    ? JSON.parse(viewData?.json_structure)
                    : ""
                }
              />
            </Box>

            {/* Right Side - Non-scrollable Content */}
            <Box
              sx={{
                width: "40%",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                pl: 2,
                borderLeft: "1px solid rgba(222, 226, 230, 1)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "text.black",
                }}
              >
                Form details
              </Typography>

              <Box
                sx={{
                  pt: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px", fontWeight: 400, pr: 1 }}
                >
                  Form name:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontSize: "14px",
                    fontWeight: 500,
                    flex: 1,
                    color: "text.black",
                    textTransform: "capitalize",
                  }}
                >
                  {viewData?.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  pt: "12px",
                  display: "flex",
                  // flexWrap: "wrap",
                  // alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    flex: 1,
                    pr: 1,
                  }}
                >
                  Roles:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {viewData?.provider_roles?.map((item, index) => {
                    return (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "text.black",
                          flexWrap: "wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {item?.provider_role?.name}
                        {index < viewData?.provider_roles.length - 1 &&
                          ","}{" "}
                      </Typography>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>{" "}
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
              onClick={onCloseHandler}
            >
              Cancel
            </Button>
            {/* <Button
              variant="contained"
              color="primary"
              fullWidth
              // onClick={handleSave}
              sx={{ textTransform: "none", py: 1, width: "110px" }}
            >
              Download
            </Button> */}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default PeerReferenceViewDrawer;
