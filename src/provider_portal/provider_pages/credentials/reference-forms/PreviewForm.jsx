import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { Box } from "@mui/material";
import React, { useEffect } from "react";

function PreviewForm({ data, onSubmit, editData, readonly, surveyRef }) {
  // Define the survey model with data and the custom completion message
  const survey = new Model({
    ...data,
    completedHtml: `
      <div class="custom-completion">
        <h3>Submission Received! ✅</h3>
        <p>Thank you {FirstName} for your response.</p>
        <small>We've sent a confirmation to your email</small>
      </div>
    `,
  });
  // Pre-populate the form with editData if it exists
  if (editData) {
    survey.data = editData; // Set the survey's data to pre-fill the form
  }

  // Set survey to read-only if readonly is true
  if (readonly) {
    survey.mode = "display"; // Makes the form read-only
  }

  // Always hide the default navigation buttons (including Complete button)
  survey.showNavigationButtons = false;

  // Handle survey completion
  useEffect(() => {
    survey.onComplete.add((sender) => {
      const surveyData = sender.data;
      onSubmit(surveyData); // Pass data to parent component
    });

    // Assign the survey instance to the ref
    if (surveyRef) {
      surveyRef.current = survey;
    }

    // Cleanup on unmount
    return () => {
      survey.onComplete.clear();
    };
  }, [survey, onSubmit, surveyRef]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Survey model={survey} />
    </Box>
  );
}

export default PreviewForm;
