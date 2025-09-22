import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Divider,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";

// Import a single icon file to avoid multiple network requests
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DynamicFormBuilder = () => {
  const [formName, setFormName] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [formComponents, setFormComponents] = useState([]);
  const [currentEditingComponent, setCurrentEditingComponent] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // 0: form details, 1: design form
  const [previewMode, setPreviewMode] = useState(false);

  // Use simple strings for component types instead of icon components
  const componentTypes = [
    { type: "textField", label: "Short answer" },
    { type: "paragraph", label: "Paragraph" },
    { type: "radioGroup", label: "Radio button group" },
    { type: "checkbox", label: "Check boxes" },
    { type: "dropdown", label: "Dropdown" },
    { type: "rating", label: "Rating scale" },
    { type: "date", label: "Date" },
    { type: "time", label: "Time" },
    { type: "fileUpload", label: "Attachment" },
    { type: "signature", label: "Signature input" },
  ];

  const addComponent = (type) => {
    const newComponent = {
      id: Date.now().toString(),
      type: type,
      label: `Write question here`,
      required: false,
      options:
        type === "radioGroup" || type === "checkbox" || type === "dropdown"
          ? [
              { value: "Option 1", label: "Option 1" },
              { value: "Option 2", label: "Option 2" },
            ]
          : [],
    };

    setFormComponents([...formComponents, newComponent]);
    setCurrentEditingComponent(newComponent);
  };

  const updateComponent = (id, updates) => {
    const updatedComponents = formComponents.map((component) =>
      component.id === id ? { ...component, ...updates } : component
    );
    setFormComponents(updatedComponents);

    if (currentEditingComponent && currentEditingComponent.id === id) {
      setCurrentEditingComponent({ ...currentEditingComponent, ...updates });
    }
  };

  const removeComponent = (id) => {
    const updatedComponents = formComponents.filter(
      (component) => component.id !== id
    );
    setFormComponents(updatedComponents);

    if (currentEditingComponent && currentEditingComponent.id === id) {
      setCurrentEditingComponent(null);
    }
  };

  const addOption = (componentId) => {
    const component = formComponents.find((c) => c.id === componentId);
    if (!component) return;

    const newOption = {
      value: `Option ${component.options.length + 1}`,
      label: `Option ${component.options.length + 1}`,
    };

    const updatedOptions = [...component.options, newOption];
    updateComponent(componentId, { options: updatedOptions });
  };

  const updateOption = (componentId, optionIndex, newValue) => {
    const component = formComponents.find((c) => c.id === componentId);
    if (!component) return;

    const updatedOptions = [...component.options];
    updatedOptions[optionIndex] = {
      value: newValue,
      label: newValue,
    };

    updateComponent(componentId, { options: updatedOptions });
  };

  const removeOption = (componentId, optionIndex) => {
    const component = formComponents.find((c) => c.id === componentId);
    if (!component) return;

    const updatedOptions = component.options.filter(
      (_, index) => index !== optionIndex
    );
    updateComponent(componentId, { options: updatedOptions });
  };

  const moveToNextStep = () => {
    setActiveStep(1);
  };

  const moveToPreviousStep = () => {
    setActiveStep(0);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const renderFormSetup = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create new reference form
      </Typography>
      <Typography variant="caption" color="primary">
        • Active
      </Typography>

      <Box sx={{ mt: 3 }}>
        <TextField
          label="Form name"
          fullWidth
          required
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter the reference form name"
          margin="normal"
        />

        <TextField
          label="Submission deadline (Days)"
          fullWidth
          required
          type="number"
          value={submissionDeadline}
          onChange={(e) => setSubmissionDeadline(e.target.value)}
          placeholder="Enter the number of days"
          margin="normal"
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button sx={{ mr: 1 }} variant="outlined" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={moveToNextStep}
          disabled={!formName}
        >
          Next
        </Button>
      </Box>
    </Box>
  );

  const renderComponentEditor = () => {
    if (!currentEditingComponent) return null;

    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Question"
          value={currentEditingComponent.label}
          onChange={(e) =>
            updateComponent(currentEditingComponent.id, {
              label: e.target.value,
            })
          }
          margin="normal"
        />

        {(currentEditingComponent.type === "radioGroup" ||
          currentEditingComponent.type === "checkbox" ||
          currentEditingComponent.type === "dropdown") && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Options
            </Typography>

            {currentEditingComponent.options.map((option, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <TextField
                  value={option.label}
                  onChange={(e) =>
                    updateOption(
                      currentEditingComponent.id,
                      index,
                      e.target.value
                    )
                  }
                  size="small"
                  fullWidth
                />
                <IconButton
                  size="small"
                  onClick={() =>
                    removeOption(currentEditingComponent.id, index)
                  }
                  disabled={currentEditingComponent.options.length <= 1}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={() => addOption(currentEditingComponent.id)}
              size="small"
              sx={{ mt: 1 }}
            >
              Add option
            </Button>
          </Box>
        )}

        <FormControlLabel
          control={
            <Switch
              checked={currentEditingComponent.required}
              onChange={(e) =>
                updateComponent(currentEditingComponent.id, {
                  required: e.target.checked,
                })
              }
            />
          }
          label="Required"
          sx={{ mt: 2 }}
        />
      </Paper>
    );
  };

  const renderFormDesigner = () => (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">Design reference form</Typography>
        <Box>
          <Button
            startIcon={<VisibilityIcon />}
            onClick={togglePreviewMode}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            onClick={() => setCurrentEditingComponent(null)}
          >
            Add Section
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, minHeight: "500px" }}>
            {formComponents.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 4,
                }}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                >
                  Add section title here
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  align="center"
                >
                  Description
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    Add form components from the right panel
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6">Add section title here</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Description
                </Typography>
                <Divider sx={{ my: 2 }} />

                {formComponents.map((component, index) => (
                  <Box
                    key={component.id}
                    sx={{
                      mb: 3,
                      p: 2,
                      border:
                        currentEditingComponent?.id === component.id
                          ? "1px solid #1976d2"
                          : "1px solid transparent",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={() => setCurrentEditingComponent(component)}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Typography variant="body1" sx={{ flexGrow: 1, mt: 1 }}>
                        {index + 1}. {component.label}{" "}
                        {component.required && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeComponent(component.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <DragHandleIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {previewMode
                      ? renderComponentPreview(component)
                      : renderComponentPlaceholder(component)}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={moveToPreviousStep}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {currentEditingComponent ? renderComponentEditor() : null}

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add question
            </Typography>
            <List>
              {componentTypes.map((componentType) => (
                <ListItem
                  button
                  key={componentType.type}
                  onClick={() => addComponent(componentType.type)}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary={componentType.label} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderComponentPlaceholder = (component) => {
    switch (component.type) {
      case "radioGroup":
        return (
          <RadioGroup>
            {component.options.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option.value}
                control={<Radio disabled />}
                label={option.label}
              />
            ))}
            {component.options.length < 1 && (
              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  addOption(component.id);
                }}
              >
                Add option
              </Button>
            )}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <Box>
            {component.options.map((option, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox disabled />}
                label={option.label}
              />
            ))}
            {component.options.length < 1 && (
              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  addOption(component.id);
                }}
              >
                Add option
              </Button>
            )}
          </Box>
        );

      case "dropdown":
        return (
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select</InputLabel>
            <Select value="" disabled label="Select">
              {component.options.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "textField":
        return (
          <TextField
            disabled
            fullWidth
            placeholder="Short answer"
            sx={{ mt: 1 }}
          />
        );

      case "paragraph":
        return (
          <TextField
            disabled
            fullWidth
            multiline
            rows={3}
            placeholder="Long answer"
            sx={{ mt: 1 }}
          />
        );

      case "date":
        return <TextField disabled fullWidth type="date" sx={{ mt: 1 }} />;

      case "time":
        return <TextField disabled fullWidth type="time" sx={{ mt: 1 }} />;

      case "rating":
        return (
          <Box sx={{ display: "flex", mt: 1 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Box key={num} sx={{ p: 1, border: "1px solid #ccc", m: 0.5 }}>
                {num}
              </Box>
            ))}
          </Box>
        );

      case "fileUpload":
        return (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            disabled
            sx={{ mt: 1 }}
          >
            Attach file
          </Button>
        );

      case "signature":
        return (
          <Box
            sx={{
              border: "1px dashed grey",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Signature Input
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderComponentPreview = (component) => {
    // In preview mode, render actual interactive components
    return renderComponentPlaceholder(component); // For simplicity, we're using the same rendering for now
  };

  return (
    <Container maxWidth="lg">
      <Card sx={{ mt: 4, mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          {activeStep === 0 ? renderFormSetup() : renderFormDesigner()}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DynamicFormBuilder;
