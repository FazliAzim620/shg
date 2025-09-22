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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
import { useSelector } from "react-redux";
import { InputFilters } from "../../../pages/schedules/Filter";

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

const FilterProvider = ({
  open,
  onClose,
  user,
  onSave,
  mode,
  countAppliedFilters,
  clearFilter,
  rolesList,
  isLoading,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [formData, setFormData] = useState({
    roles: [],
    specialty: [],
    status: "all",
    from_date: "",
    end_date: "",
  });
  useEffect(() => {
    setFormData({
      roles: user?.roles || [],
      specialty: user?.specialty || [],
      status: user?.status || "all",
      from_date: user?.from_date || "",
      end_date: user?.end_date || "",
    });
  }, [user, mode, open]);

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

  const handleSave = () => {
    onSave(dataToSave);
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
          Filter providers{" "}
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
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Specialty
        </Typography>
        <MultipleSelectCheckmarks
          darkMode={darkMode}
          name="specialty"
          options={rolesList}
          value={formData.specialty}
          onChange={handleMultiSelectChange}
        />
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Roles
        </Typography>
        <MultipleSelectCheckmarks
          darkMode={darkMode}
          name="roles"
          options={rolesList}
          value={formData.roles}
          onChange={handleMultiSelectChange}
        />

        <>
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: darkMode === "dark" ? "#fff" : "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Verification status
          </Typography>
          <Select
            fullWidth
            name="status"
            value={formData.status}
            onChange={handleChange}
            input={
              <OutlinedInput
                sx={{
                  height: "2.6rem",
                  color: "text.black",
                  fontSize: "0.875rem",
                  backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                  border: "1px solid rgba(231, 234, 243, .7)",
                  "&.Mui-focused": {
                    backgroundColor: "#fff",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1.5px solid rgba(231, 234, 243, .7)",
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
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </>
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Date range
        </Typography>

        <InputFilters
          height={"38px"}
          name={"from_date"}
          type="date"
          value={formData.from_date}
          onChange={handleChange}
          textColor={formData.from_date ? "black" : "gray"}
        />
        <InputFilters
          height={"38px"}
          mt={"24px"}
          name={"end_date"}
          type="date"
          value={formData.end_date}
          onChange={handleChange}
          textColor={formData.end_date ? "black" : "gray"}
        />
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
          {countAppliedFilters(user) ? (
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

export default FilterProvider;
