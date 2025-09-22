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
  Select,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";

const OrganizationDocFilter = ({
  open,
  onClose,
  data,
  onSave,
  mode,
  countAppliedFilters,
  clearFilter,
  isLoading,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [formData, setFormData] = useState({
    status: "",
  });

  const statusOptions = [
    { value: "downloaded", label: "Downloaded" },
    { value: "downloadpending", label: "Download Pending" },
    { value: "signed", label: "Signed" },
    { value: "signpending", label: "Sign Pending" },
  ];

  useEffect(() => {
    if (mode === "Filter") {
      setFormData({
        status: data?.status || "",
      });
    }
    if (data && mode === "edit") {
      setFormData({
        status: data?.status || "",
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
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: darkMode === "dark" ? "white" : "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Status <span style={{ color: "red" }}>*</span>
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
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
                  border: `1px solid rgba(231, 234, 243, .7)`,
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
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <em>Select Status</em>;
              }
              return statusOptions.find((option) => option.value === selected)
                ?.label;
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
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
