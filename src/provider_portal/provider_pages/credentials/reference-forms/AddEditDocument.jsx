import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import PreviewForm from "./PreviewForm";

const AddEditDocument = ({
  open,
  onClose,
  data,
  mode,
  againstDocument,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const surveyRef = useRef(null);

  const handleSave = async () => {
    if (surveyRef.current) {
      setIsLoading(true);
      try {
        surveyRef.current.doComplete(); // Trigger survey completion
      } catch (error) {
        console.error("Survey completion failed:", error);
        setIsLoading(false);
      }
    }
  };
  const handleSurveyComplete = async (surveyData) => {
    try {
      await onSave(surveyData);
      onClose();
    } catch (error) {
      console.error("Backend submission failed:", error);
      // Keep the form intact if submission fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data && againstDocument?.submitted_forms?.length > 0) {
      const index = againstDocument.submitted_forms.findIndex(
        (form) => form.id === data.id
      );
      setCurrentIndex(index);
    }
  }, [data, againstDocument]);

  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          minWidth: { md: "700px" },
        },
      }}
    >
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ width: "100%" }}>
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
              Document Preview
            </Typography>
            <IconButton sx={{ mr: -2 }} onClick={onClose}>
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
            {data?.json_structure ? (
              <PreviewForm
                data={JSON.parse(
                  againstDocument
                    ? againstDocument?.json_structure
                    : data.json_structure
                )}
                editData={
                  mode === "edit" || mode === "view"
                    ? againstDocument
                      ? currentIndex == null
                        ? ""
                        : JSON.parse(
                            againstDocument.submitted_forms?.[currentIndex]
                              ?.json_structure
                          )
                      : data.submitted_forms?.[0]?.json_structure
                      ? JSON.parse(data.submitted_forms?.[0]?.json_structure)
                      : ""
                    : ""
                }
                onSubmit={handleSurveyComplete}
                surveyRef={surveyRef}
                readonly={mode == "view"}
              />
            ) : (
              <Typography variant="body2">
                {" "}
                "No JSON data available for preview"
              </Typography>
            )}
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
                onClick={onClose}
              >
                Cancel
              </Button>
              {mode == "view" ? (
                ""
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={isLoading}
                  sx={{ textTransform: "none", py: 1, width: "71px" }}
                >
                  {isLoading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    "Save"
                  )}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddEditDocument;
