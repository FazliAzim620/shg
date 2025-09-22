import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  OutlinedInput,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  CircularProgress,
  styled,
  TextareaAutosize,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
import { useSelector } from "react-redux";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../../components/job-component/CommonSelect";
import { InputFilters } from "../../schedules/Filter";
import { selectOptions } from "../../../util";
const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px", // optional: adjust for styling
  padding: "8px",
  resize: "vertical", // prevent resizing if desired
  outline: "none",
  height: "100",
  transition: "box-shadow 0.2s",
  backgroundColor: isLightMode ? "#f8fafd" : "#25282A",
  color: isLightMode ? "black" : "white",
  "&:focus": {
    boxShadow: " rgba(0, 0, 0, 0.09) 0px 3px 12px",
    backgroundColor: isLightMode ? "white" : "#25282A",
  },
}));

const MultipleSelectCheckmarks = ({
  darkMode,
  options = [],
  name,
  value = [],
  onChange,
  error = false,
  countAppliedFilters,
}) => {
  const borderColor = error ? "#d32f2f" : `rgba(231, 234, 243, .7)`;
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Box>
      <FormControl sx={{ width: "100%" }}>
        <Select
          multiple
          value={value}
          onChange={(event) => {
            const { value } = event.target;
            onChange(
              name,
              typeof value === "string" ? value.split(",") : value
            );
          }}
          input={
            <OutlinedInput
              sx={{
                height: "2.6rem",
                color: "text.black",
                fontSize: "0.875rem",
                backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                border: `1px solid ${borderColor}`,
                "&.Mui-focused": {
                  backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                  color: darkMode === "dark" ? "#fff" : "text.black",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  border: "none",
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: `1.5px solid rgba(231, 234, 243, .7)`,
                  },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          }
          renderValue={() => selectedLabels}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <BpCheckbox checked={value.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const OrganizationDocFilter = ({
  open,
  onClose,
  data,
  onSave,
  mode,
  countAppliedFilters,
  clearFilter,
  documentTypes,
  isLoading,
}) => {
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const [viewDetails, setViewDetails] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    document_name: "",
    purpose: "",
    roles: [],
  });

  useEffect(() => {
    if (mode === "Filter") {
      setFormData({
        roles: data?.roles || [],
        document_name: data?.document_name || "",
        purpose: data?.purpose || " ",
      });
    }
    if (data && mode === "edit") {
      setFormData({
        id: data?.id,
        roles: data?.provider_roles?.map((item) => item?.id) || [],
        document_name: data?.name || "",
        purpose: data?.purpose || " ",
        // roles: data.roles || [],
      });
    }
  }, [data, mode, open]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    onSave(formData);
    if (!isLoading) {
      onClose();
    }
  };

  const handleClearFilter = () => {
    onClose();
    clearFilter();
  };
  const closeHandler = () => {
    onClose();
    setViewDetails(false);
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
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
          Filter organization documents
        </Typography>
        <IconButton sx={{ mr: -2 }} onClick={closeHandler}>
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
        {" "}
        <>
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "white" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Roles <span style={{ color: "red" }}>*</span>
          </Typography>
          <MultipleSelectCheckmarks
            darkMode={darkMode}
            name="roles"
            options={selectOptions(providerRolesList)}
            value={formData.roles}
            onChange={handleMultiSelectChange}
          />
        </>
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Document name <span style={{ color: "red" }}>*</span>
        </Typography>
        <CommonInputField
          name="document_name"
          placeholder="Enter the document name"
          value={formData.document_name}
          onChange={handleChange}
        />
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Purpose
            </Typography>
          </FormLabel>
          <RadioGroup
            onChange={handleChange}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="purpose"
            value={formData?.purpose}
          >
            <FormControlLabel
              value="signature"
              control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
              label={
                <Typography
                  variant="caption"
                  sx={{ fontSize: "14px", fontWeight: 400 }}
                >
                  Signature required
                </Typography>
              }
            />
            <FormControlLabel
              value="download"
              control={<Radio size="small" sx={{ color: "#d9d9d9" }} />}
              label={
                <Typography
                  variant="caption"
                  sx={{ fontSize: "14px", fontWeight: 400 }}
                >
                  Download only{" "}
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
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
            bgcolor: "background.paper",
          }}
        >
          {countAppliedFilters(data) ? (
            <Button
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.2)",
                padding: "5px 16px",
                minWidth: 0,
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
              onClick={handleClearFilter}
            >
              Clear all filters
            </Button>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFilter}
            sx={{ textTransform: "none", py: 1 }}
          >
            Show results
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default OrganizationDocFilter;
