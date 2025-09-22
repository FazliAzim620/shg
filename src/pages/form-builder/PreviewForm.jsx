import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { Box, Typography } from "@mui/material";
import React from "react";

function PreviewForm({ data, readonly }) {
  const [submittedData, setSubmittedData] = React.useState(null); // State to hold submitted data

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

  // Set survey to read-only and hide complete button if readonly is true
  if (readonly) {
    survey.mode = "display"; // Makes the form read-only
    survey.showNavigationButtons = false; // Hides the complete button
  }

  survey.onComplete.add((sender) => {
    const surveyData = sender.data;
    setSubmittedData(surveyData);
  });

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Display the survey form */}
      <Survey model={survey} />

      {/* Display the submitted data */}
      {/* {submittedData && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Form Submission Data:</Typography>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </Box>
      )} */}
    </Box>
  );
}

export default PreviewForm;
