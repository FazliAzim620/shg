import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import axios from "axios";
import { useSelector } from "react-redux";
import API from "../../../../API";
import Swal from "sweetalert2";

const FormDrawer = ({
  open,
  onClose,
  jsonStructure,
  documentName,
  selectedId,
  ipAddress,
  selectedForm,
  formId,
  reloadData,
  userId,
  name,
}) => {
  const { user } = useSelector((state) => state.login);
  const [surveyModel, setSurveyModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const surveyRef = useRef(null);

  useEffect(() => {
    if (jsonStructure) {
      const model = new Model(jsonStructure);

      // Show Next/Previous buttons if name is provided
      model.showNavigationButtons = name ? true : false;

      // Prevent default completion
      model.showCompletedPage = false;
      model.onComplete.add((sender, options) => {
        options.allowComplete = false; // Block default complete action
      });

      // Handle file uploads to prevent page reset
      model.onUploadFiles.add((sender, options) => {
        const currentPage = sender.currentPageNo;
        options.callback(
          "success",
          options.files.map((file) => ({
            file: file,
            content: URL.createObjectURL(file),
          }))
        );
        sender.currentPageNo = currentPage;
      });

      // Hide Complete button after page render
      model.onAfterRenderPage.add((sender, options) => {
        const completeButton = document.querySelector(
          '.sv-action-bar-item[title="Complete"], .sd-navigation__complete-btn'
        );
        if (completeButton) {
          completeButton.style.display = "none";
        }
      });

      // Set completion message
      model.completedHtml = `
        <div class="custom-completion">
          <h3>Submission Received! ✅</h3>
          <p>Thank you {FirstName} for your response.</p>
        </div>
      `;

      // Pre-fill form if selectedForm exists
      if (selectedForm) {
        model.data = selectedForm;
      }

      surveyRef.current = model;
      setSurveyModel(model);
    }

    return () => {
      if (surveyRef.current) {
        surveyRef.current.onComplete.clear();
        surveyRef.current.onUploadFiles.clear();
        surveyRef.current.onAfterRenderPage.clear();
      }
    };
  }, [jsonStructure, selectedForm, name]);

  const handleSave = async () => {
    if (!surveyRef.current) return;

    // Validate form
    const isValid = surveyRef.current.validate();
    if (!isValid) {
      surveyRef.current.focusFirstError(); // Scroll to first invalid field
      Swal.fire({
        title: "Error!",
        text: "Please fill out all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    if (selectedForm) {
      formData.append("form_submitted_id", formId);
    }
    formData.append("for_provider_user_id", userId ? userId : user?.user?.id);
    formData.append("form_id", selectedId);
    formData.append("ip", ipAddress);
    formData.append("json_structure", JSON.stringify(surveyRef.current.data));

    setLoading(true);

    try {
      const response = await API.post("/api/save-prov-cred-form", formData);

      Swal.fire({
        title: "Success!",
        text: response.data.msg || "Your form has been saved successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        onClose();
      });
      onClose();
      reloadData();
    } catch (error) {
      console.error("Error saving form data:", error);

      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          "There was an error saving your form. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "500px", md: "600px" },
          boxSizing: "border-box",
          p: 3,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{documentName || "Form"}</Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>

      {surveyModel ? (
        <>
          <Survey model={surveyModel} />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={24} color="inherit" /> : null
              }
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1">Loading form...</Typography>
      )}
      <style>{`
        /* Hide the Complete button */
        .sv-action-bar-item[title="Complete"],
        .sd-navigation__complete-btn {
          display: none !important;
        }
      `}</style>
    </Drawer>
  );
};

export default FormDrawer;
