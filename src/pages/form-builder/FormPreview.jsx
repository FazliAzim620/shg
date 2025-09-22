import React from "react";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from "@mui/material";

const FormPreview = ({ formData, onBack }) => {
  const handleAnswerChange = (index, value) => {
    console.log(`Answer for question ${index + 1}:`, value);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {formData?.formName || "Preview"}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Deadline: {formData?.deadline} days
      </Typography>

      {formData?.fields.map((field, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {field.question || `Question ${index + 1}`}
          </Typography>

          {/* Render input fields based on the field type */}
          {field.type === "text" && (
            <TextField
              fullWidth
              placeholder="Your answer"
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          )}

          {field.type === "radio" && (
            <RadioGroup
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              {field.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          )}

          {field.type === "checkbox" && (
            <Box>
              {field.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  control={
                    <Checkbox
                      onChange={(e) => {
                        handleAnswerChange(index, {
                          option,
                          checked: e.target.checked,
                        });
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </Box>
          )}

          {field.type === "dropdown" && (
            <TextField
              select
              fullWidth
              SelectProps={{ native: true }}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          )}
        </Box>
      ))}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Back to Edit
        </Button>
        <Button
          variant="contained"
          onClick={() => console.log("Form submitted!")}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default FormPreview;
