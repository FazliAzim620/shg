import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { Box, Typography } from "@mui/material";
import React from "react";

function FormPreview({ data, readonly, editData, name }) {
  const [submittedData, setSubmittedData] = React.useState(null);

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
  if (editData) {
    survey.data = editData;
  }
  if (readonly) {
    survey.mode = "display";
    survey.showNavigationButtons = name ? true : false;
  }

  survey.onComplete.add((sender) => {
    const surveyData = sender.data;
    setSubmittedData(surveyData);
  });

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Survey model={survey} />
    </Box>
  );
}

export default FormPreview;
