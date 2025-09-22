import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  styled,
  Chip,
} from "@mui/material";
import { Close, FilterAlt } from "@mui/icons-material";
import { useSelector } from "react-redux";

// Styled Components
const FilterContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(3),
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const DocumentFilterDrawer = ({
  open,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const [filters, setFilters] = useState({
    status: "",
    approval: "",
    expiry_start: "",
    expiry_end: "",
    ...initialFilters,
  });

  useEffect(() => {
    if (open) {
      setFilters({
        status: "",
        approval: "",
        expiry_start: "",
        expiry_end: "",
        ...initialFilters,
      });
    }
  }, [open, initialFilters]);

  const handleStatusChange = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? "" : status,
    }));
  };

  const handleApprovalChange = (approval) => {
    setFilters((prev) => ({
      ...prev,
      approval: prev.approval === approval ? "" : approval,
    }));
  };

  const handleDateChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      approval: "",
      expiry_start: "",
      expiry_end: "",
    });
  };

  const isFilterApplied = () => {
    return (
      filters.status !== "" ||
      filters.approval !== "" ||
      filters.expiry_start !== "" ||
      filters.expiry_end !== ""
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "400px" },
          maxWidth: "100%",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FilterAlt sx={{ mr: 1 }} />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.black",
              }}
            >
              Filter Documents
            </Typography>
          </Box>
          <IconButton sx={{ mr: -2 }} onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

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
          {/* Document Status */}
          <FilterSection>
            <Typography
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 500,
                mb: 2,
              }}
            >
              Document Status
            </Typography>
            <ChipContainer>
              <Chip
                label="Not Uploaded"
                onClick={() => handleStatusChange("notupload")}
                color={filters.status === "notupload" ? "primary" : "default"}
                variant={filters.status === "notupload" ? "filled" : "outlined"}
              />
              <Chip
                label="Uploaded"
                onClick={() => handleStatusChange("uploaded")}
                color={filters.status === "uploaded" ? "primary" : "default"}
                variant={filters.status === "uploaded" ? "filled" : "outlined"}
              />
              <Chip
                label="Expired"
                onClick={() => handleStatusChange("expired")}
                color={filters.status === "expired" ? "primary" : "default"}
                variant={filters.status === "expired" ? "filled" : "outlined"}
              />
            </ChipContainer>
          </FilterSection>

          {/* Approval Status */}
          <FilterSection>
            <Typography
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 500,
                mb: 2,
              }}
            >
              Approval Status
            </Typography>
            <ChipContainer>
              <Chip
                label="Pending"
                onClick={() => handleApprovalChange("0")}
                color={filters.approval === "0" ? "primary" : "default"}
                variant={filters.approval === "0" ? "filled" : "outlined"}
              />
              <Chip
                label="Approved"
                onClick={() => handleApprovalChange(1)}
                color={filters.approval === 1 ? "primary" : "default"}
                variant={filters.approval === 1 ? "filled" : "outlined"}
              />
              <Chip
                label="Rejected"
                onClick={() => handleApprovalChange(2)}
                color={filters.approval === 2 ? "primary" : "default"}
                variant={filters.approval === 2 ? "filled" : "outlined"}
              />
            </ChipContainer>
          </FilterSection>

          {/* Expiry Date Range */}
          <FilterSection>
            <Typography
              sx={{
                color: darkMode === "dark" ? "white" : "#1E2022",
                fontSize: "16px",
                fontWeight: 500,
                mb: 2,
              }}
            >
              Expiry Date Range
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                label="From"
                type="date"
                value={filters.expiry_start}
                onChange={(e) =>
                  handleDateChange("expiry_start", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                fullWidth
                label="To"
                type="date"
                value={filters.expiry_end}
                onChange={(e) => handleDateChange("expiry_end", e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
          </FilterSection>
        </Box>

        {/* Bottom Buttons */}
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
              justifyContent: "space-between",
              gap: 1,
              px: 2,
            }}
          >
            <Button
              sx={{
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                padding: "8px 16px",
                minWidth: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  color: "text.main",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
              onClick={handleClearFilters}
              disabled={!isFilterApplied()}
            >
              Clear All
            </Button>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                sx={{
                  textTransform: "capitalize",
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  border: "1px solid rgba(99, 99, 99, 0.2)",
                  padding: "8px 16px",
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
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
                sx={{ textTransform: "none", py: 1 }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DocumentFilterDrawer;
