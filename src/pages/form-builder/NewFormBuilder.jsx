import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Alert,
  Grid,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  ViewList as ViewListIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";

// Form Builder Component
const NewFormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState("New Form");
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleDrop = (item) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: item.type,
      label: `New ${item.label}`,
      placeholder: "",
      required: false,
      options:
        item.type === "dropdown" ||
        item.type === "radio" ||
        item.type === "checkbox"
          ? ["Option 1", "Option 2"]
          : [],
      value: "",
    };

    setFormElements([...formElements, newElement]);
  };

  const handleElementUpdate = (id, updates) => {
    setFormElements(
      formElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const handleRemoveElement = (id) => {
    setFormElements(formElements.filter((el) => el.id !== id));
  };

  const moveElement = (dragIndex, hoverIndex) => {
    const draggedElement = formElements[dragIndex];
    const newElements = [...formElements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, draggedElement);
    setFormElements(newElements);
  };

  const saveForm = async () => {
    setIsSaving(true);
    // Simulating API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formData = {
        id: Date.now(),
        name: formName,
        elements: formElements,
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would be an actual API call
      console.log("Form saved:", formData);

      // Store in localStorage for demo purposes
      const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
      localStorage.setItem(
        "savedForms",
        JSON.stringify([...savedForms, formData])
      );

      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Paper
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          elevation={1}
        >
          <TextField
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            variant="standard"
            sx={{ fontSize: "1.5rem", fontWeight: "bold", width: "50%" }}
            InputProps={{ disableUnderline: true }}
            placeholder="Enter form name"
          />
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveForm}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Form"}
          </Button>
        </Paper>

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Sidebar onDrop={handleDrop} />

          <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
            <DropArea
              formElements={formElements}
              handleElementUpdate={handleElementUpdate}
              handleRemoveElement={handleRemoveElement}
              moveElement={moveElement}
            />
          </Box>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Form saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

// Sidebar Component
const Sidebar = ({ onDrop }) => {
  const formElements = [
    { type: "section", label: "Section" },
    { type: "question", label: "Question" },
    { type: "radio", label: "Radio button group" },
    { type: "checkbox", label: "Check boxes" },
    { type: "dropdown", label: "Dropdown" },
    { type: "rating", label: "Rating scale" },
    { type: "short_answer", label: "Short answer" },
    { type: "paragraph", label: "Paragraph" },
    { type: "date", label: "Date" },
    { type: "time", label: "Time" },
    { type: "attachment", label: "Attachment" },
    { type: "signature", label: "Signature input" },
  ];

  return (
    <Paper
      sx={{
        width: 280,
        overflowY: "auto",
        borderRadius: 0,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          p: 2,
          fontWeight: "medium",
          bgcolor: "#f9f9f9",
          borderBottom: "1px solid #eee",
        }}
      >
        Form Elements
      </Typography>
      <List sx={{ p: 1 }}>
        {formElements.map((item) => (
          <DraggableItem key={item.type} item={item} onDrop={onDrop} />
        ))}
      </List>
    </Paper>
  );
};

// Draggable Item Component
const DraggableItem = ({ item, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_ELEMENT",
    item: { ...item },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItem
      ref={drag}
      sx={{
        cursor: "grab",
        mb: 1,
        opacity: isDragging ? 0.5 : 1,
        bgcolor: "white",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "#f5f9ff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DragIndicatorIcon sx={{ mr: 1, color: "#888" }} />
      <Typography variant="body2">{item.label}</Typography>
    </ListItem>
  );
};

// Drop Area Component
const DropArea = ({
  formElements,
  handleElementUpdate,
  handleRemoveElement,
  moveElement,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "FORM_ELEMENT",
    drop: () => ({ name: "FormDropArea" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <Paper
      ref={drop}
      sx={{
        minHeight: 400,
        p: 3,
        bgcolor: formElements.length === 0 ? "#f9f9f9" : "white",
      }}
    >
      {formElements.length === 0 ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            py: 8,
          }}
        >
          <ViewListIcon sx={{ fontSize: 60, mb: 2, color: "#ddd" }} />
          <Typography variant="h6" color="textSecondary">
            Drag and drop elements from the sidebar
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            to build your form
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {formElements.map((element, index) => (
            <FormElementEditor
              key={element.id}
              element={element}
              index={index}
              updateElement={handleElementUpdate}
              removeElement={handleRemoveElement}
              moveElement={moveElement}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

// Form Element Editor Component
const FormElementEditor = ({
  element,
  index,
  updateElement,
  removeElement,
  moveElement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "FORM_ELEMENT_CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveElement(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "FORM_ELEMENT_CARD",
    item: () => {
      return { id: element.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const renderElementPreview = () => {
    switch (element.type) {
      case "section":
        return (
          <Typography variant="h6" sx={{ fontWeight: "medium", py: 1 }}>
            {element.label}
          </Typography>
        );
      case "question":
      case "short_answer":
        return (
          <TextField
            fullWidth
            label={element.label}
            placeholder={element.placeholder || "Short answer text"}
            size="small"
            disabled
          />
        );
      case "paragraph":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            label={element.label}
            placeholder={element.placeholder || "Long answer text"}
            size="small"
            disabled
          />
        );
      case "radio":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}
            </Typography>
            {element.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Box
                    component="span"
                    sx={{
                      ml: 2,
                      mr: 1,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "2px solid #999",
                      display: "inline-block",
                    }}
                  />
                }
                label={option}
                disabled
              />
            ))}
          </Box>
        );
      case "checkbox":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}
            </Typography>
            {element.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Box
                    component="span"
                    sx={{
                      ml: 2,
                      mr: 1,
                      width: 16,
                      height: 16,
                      border: "2px solid #999",
                      display: "inline-block",
                    }}
                  />
                }
                label={option}
                disabled
              />
            ))}
          </Box>
        );
      case "dropdown":
        return (
          <TextField
            select
            fullWidth
            label={element.label}
            value=""
            placeholder="Select an option"
            size="small"
            disabled
          />
        );
      case "date":
        return (
          <TextField
            fullWidth
            label={element.label}
            type="date"
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled
          />
        );
      case "time":
        return (
          <TextField
            fullWidth
            label={element.label}
            type="time"
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled
          />
        );
      case "rating":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Box
                  key={num}
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1px solid #999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  {num}
                </Box>
              ))}
            </Box>
          </Box>
        );
      case "attachment":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              disabled
            >
              Add file
            </Button>
          </Box>
        );
      case "signature":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}
            </Typography>
            <Box
              sx={{
                border: "1px dashed #999",
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Click to sign
              </Typography>
            </Box>
          </Box>
        );
      default:
        return <Typography>Unknown element type: {element.type}</Typography>;
    }
  };

  const renderElementEditor = () => {
    return (
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Label"
          value={element.label}
          onChange={(e) => updateElement(element.id, { label: e.target.value })}
          margin="normal"
          size="small"
        />

        {["short_answer", "paragraph"].includes(element.type) && (
          <TextField
            fullWidth
            label="Placeholder"
            value={element.placeholder || ""}
            onChange={(e) =>
              updateElement(element.id, { placeholder: e.target.value })
            }
            margin="normal"
            size="small"
          />
        )}

        {["radio", "checkbox", "dropdown"].includes(element.type) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Options
            </Typography>
            {element.options.map((option, idx) => (
              <Box key={idx} sx={{ display: "flex", mb: 1 }}>
                <TextField
                  fullWidth
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...element.options];
                    newOptions[idx] = e.target.value;
                    updateElement(element.id, { options: newOptions });
                  }}
                  size="small"
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    const newOptions = element.options.filter(
                      (_, i) => i !== idx
                    );
                    updateElement(element.id, { options: newOptions });
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                updateElement(element.id, {
                  options: [
                    ...element.options,
                    `Option ${element.options.length + 1}`,
                  ],
                });
              }}
              size="small"
              sx={{ mt: 1 }}
            >
              Add Option
            </Button>
          </Box>
        )}

        <FormControlLabel
          control={
            <Switch
              checked={element.required}
              onChange={(e) =>
                updateElement(element.id, { required: e.target.checked })
              }
              color="primary"
            />
          }
          label="Required"
          sx={{ mt: 2 }}
        />
      </Box>
    );
  };

  return (
    <Card
      ref={ref}
      sx={{
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isEditing ? 3 : 1,
        border: isEditing ? "1px solid #4dabf5" : "none",
        transition: "all 0.2s",
      }}
      data-handler-id={handlerId}
    >
      <CardHeader
        avatar={<DragIndicatorIcon sx={{ cursor: "grab", color: "#999" }} />}
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ textTransform: "uppercase", mr: 1 }}
            >
              {element.type.replace("_", " ")}
            </Typography>
            {element.required && (
              <Chip
                label="Required"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.6rem" }}
              />
            )}
          </Box>
        }
        action={
          <Box>
            <IconButton
              size="small"
              onClick={() => setIsEditing(!isEditing)}
              color={isEditing ? "primary" : "default"}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => removeElement(element.id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{ py: 1, bgcolor: "#fafafa" }}
      />
      <CardContent sx={{ p: isEditing ? 0 : 2 }}>
        {isEditing ? renderElementEditor() : renderElementPreview()}
      </CardContent>
    </Card>
  );
};

// FormFiller Component - For displaying and filling out saved forms
const FormFiller = () => {
  const [savedForms, setSavedForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load saved forms on component mount
  React.useEffect(() => {
    const forms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    setSavedForms(forms);
  }, []);

  const handleFormSelect = (formId) => {
    const form = savedForms.find((f) => f.id === formId);
    setCurrentForm(form);

    // Initialize form values
    const initialValues = {};
    form.elements.forEach((element) => {
      initialValues[element.id] = element.value || "";
    });
    setFormValues(initialValues);
  };

  const handleInputChange = (elementId, value) => {
    setFormValues({
      ...formValues,
      [elementId]: value,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingRequired = currentForm.elements
        .filter((element) => element.required && !formValues[element.id])
        .map((element) => element.label);

      if (missingRequired.length > 0) {
        alert(
          `Please fill in the following required fields: ${missingRequired.join(
            ", "
          )}`
        );
        setIsSubmitting(false);
        return;
      }

      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const submission = {
        formId: currentForm.id,
        formName: currentForm.name,
        submittedAt: new Date().toISOString(),
        values: formValues,
      };

      // In a real app, this would be an API call
      console.log("Form submission:", submission);

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormElement = (element) => {
    switch (element.type) {
      case "section":
        return (
          <Typography
            variant="h6"
            sx={{ fontWeight: "medium", py: 1, borderBottom: "1px solid #eee" }}
          >
            {element.label}
          </Typography>
        );
      case "question":
      case "short_answer":
        return (
          <TextField
            fullWidth
            label={element.label}
            placeholder={element.placeholder || "Your answer"}
            size="small"
            required={element.required}
            value={formValues[element.id] || ""}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            margin="normal"
          />
        );
      case "paragraph":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            label={element.label}
            placeholder={element.placeholder || "Your answer"}
            size="small"
            required={element.required}
            value={formValues[element.id] || ""}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            margin="normal"
          />
        );
      case "radio":
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}{" "}
              {element.required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            {element.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Box
                    component="input"
                    type="radio"
                    name={element.id}
                    value={option}
                    checked={formValues[element.id] === option}
                    onChange={() => handleInputChange(element.id, option)}
                  />
                }
                label={option}
              />
            ))}
          </Box>
        );
      case "checkbox":
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}{" "}
              {element.required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            {element.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Box
                    component="input"
                    type="checkbox"
                    name={element.id}
                    value={option}
                    checked={
                      Array.isArray(formValues[element.id]) &&
                      formValues[element.id].includes(option)
                    }
                    onChange={(e) => {
                      const currentValues = Array.isArray(
                        formValues[element.id]
                      )
                        ? [...formValues[element.id]]
                        : [];

                      if (e.target.checked) {
                        handleInputChange(element.id, [
                          ...currentValues,
                          option,
                        ]);
                      } else {
                        handleInputChange(
                          element.id,
                          currentValues.filter((val) => val !== option)
                        );
                      }
                    }}
                  />
                }
                label={option}
              />
            ))}
          </Box>
        );
      case "dropdown":
        return (
          <TextField
            select
            fullWidth
            label={element.label}
            value={formValues[element.id] || ""}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            required={element.required}
            size="small"
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select an option</option>
            {element.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        );
      case "date":
        return (
          <TextField
            fullWidth
            label={element.label}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formValues[element.id] || ""}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            required={element.required}
            size="small"
            margin="normal"
          />
        );
      case "time":
        return (
          <TextField
            fullWidth
            label={element.label}
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formValues[element.id] || ""}
            onChange={(e) => handleInputChange(element.id, e.target.value)}
            required={element.required}
            size="small"
            margin="normal"
          />
        );
      case "rating":
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}{" "}
              {element.required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Box
                  key={num}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor:
                      formValues[element.id] === num ? "primary.main" : "white",
                    color: formValues[element.id] === num ? "white" : "inherit",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => handleInputChange(element.id, num)}
                >
                  {num}
                </Box>
              ))}
            </Box>
          </Box>
        );
      case "attachment":
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}{" "}
              {element.required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddCircleOutlineIcon />}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleInputChange(element.id, e.target.files[0].name);
                  }
                }}
              />
            </Button>
            {formValues[element.id] && (
              <Chip
                label={formValues[element.id]}
                onDelete={() => handleInputChange(element.id, "")}
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        );
      case "signature":
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {element.label}{" "}
              {element.required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            <Box
              sx={{
                border: "1px dashed #999",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                cursor: "pointer",
                bgcolor: "#f9f9f9",
                p: 2,
              }}
              onClick={() =>
                handleInputChange(element.id, "Signature captured")
              }
            >
              {formValues[element.id] ? (
                <Typography variant="body1" sx={{ fontFamily: "cursive" }}>
                  {formValues[element.id]}
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Click to sign
                </Typography>
              )}
            </Box>
          </Box>
        );
      default:
        return <Typography>Unknown element type: {element.type}</Typography>;
    }
  };

  // Main app structure with conditional rendering
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
        <Typography variant="h5" gutterBottom>
          Form Filler
        </Typography>
        {!currentForm ? (
          <Typography variant="body2">Select a form to fill out</Typography>
        ) : (
          <Typography variant="h6">{currentForm.name}</Typography>
        )}
      </Paper>

      <Box sx={{ display: "flex", height: "calc(100vh - 100px)" }}>
        {/* Sidebar with forms list */}
        <Sidebar />
      </Box>
    </Box>
  );
};
export default FormFiller;
