import React from "react";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";
const Filter = ({
  hideClient,
  isDrawerOpen,
  toggleDrawer,
  filters,
  handleCheckboxChange,
  clearFilter,
  clearAllFilters,
  getTimesheets,
  clients,
  handleFilterChange,
  countAppliedFilters,
  setIsDrawerOpen,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      sx={{ "& .MuiDrawer-paper": { minWidth: "400px" } }}
    >
      <Box
        sx={{
          pt: "24px",
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomTypographyBold
          weight={600}
          fontSize={"1rem"}
          textTransform={"none"}
          color={"text.black"}
        >
          Filter timesheets
        </CustomTypographyBold>
        <IconButton sx={{ mr: -2 }} onClick={() => setIsDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 4,
          flexGrow: 1,
          overflowY: "auto",
          height: "calc(100vh - 150px)",
        }}
      >
        {!hideClient && (
          <CustomTypographyBold
            fontSize={"0.75rem"}
            textTransform={"capitalize"}
            color="text.black"
          >
            Client
          </CustomTypographyBold>
        )}
        {!hideClient && (
          <Box sx={{ my: 2 }}>
            <Select
              fullWidth
              size="small"
              value={filters.client}
              onChange={(e) => handleFilterChange("client", e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    border: "none",
                  },
                },
              }}
              sx={{
                bgcolor: isLightMode ? "#F7F9FC" : "#333",

                border: "1px solid rgba(100, 100, 111, 0.2)",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 3px 9px 0px",
                },
              }}
            >
              {clients?.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {!hideClient && <Divider sx={{ my: 3, opacity: 0.5 }} />}
        <CustomTypographyBold
          fontSize={"0.75rem"}
          textTransform={"capitalize"}
          color="text.black"
        >
          Action required
        </CustomTypographyBold>
        <FormGroup>
          {[
            "All",
            "Pending review by SHG",
            "Re-submission required",
            "Awaiting client approval",
            "Correction required",
            "Create invoice",
          ].map((action, index) => (
            <FormControlLabel
              key={action}
              control={
                <BpCheckbox
                  sx={{ mt: index !== 0 && -1 }}
                  size="small"
                  className={`${
                    !filters.actionRequired.includes(action) && "checkbox"
                  }`}
                  checked={filters.actionRequired.includes(action)}
                  onChange={() =>
                    handleCheckboxChange("actionRequired", action)
                  }
                />
              }
              label={
                <CustomTypographyBold
                  fontSize={"0.75rem"}
                  weight={500}
                  textTransform={"none"}
                  color="text.primary"
                  mt={index !== 0 && -1}
                >
                  {action}
                </CustomTypographyBold>
              }
            />
          ))}
        </FormGroup>
        <Button
          color="primary"
          startIcon={<Close sx={{ width: 12 }} />}
          sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          onClick={() => clearFilter("actionRequired")}
        >
          Clear
        </Button>

        <Divider sx={{ my: 3, opacity: 0.5 }} />

        <CustomTypographyBold
          fontSize={"0.75rem"}
          textTransform={"capitalize"}
          color="text.black"
        >
          Invoice Status
        </CustomTypographyBold>
        <FormGroup>
          {["All", "Invoiced", "Not Yet Invoiced", "N/A"].map(
            (status, index) => (
              <FormControlLabel
                key={status}
                control={
                  <BpCheckbox
                    size="small"
                    className={`${
                      !filters.invoiceStatus.includes(status) && "checkbox"
                    }`}
                    checked={filters.invoiceStatus.includes(status)}
                    onChange={() =>
                      handleCheckboxChange("invoiceStatus", status)
                    }
                  />
                }
                label={
                  <CustomTypographyBold
                    fontSize={"0.75rem"}
                    weight={500}
                    textTransform={"none"}
                    color="text.primary"
                    mt={index !== 0 && -1}
                  >
                    {status}
                  </CustomTypographyBold>
                }
              />
            )
          )}
        </FormGroup>
        <Button
          color="primary"
          startIcon={<Close sx={{ width: 12 }} />}
          sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          onClick={() => clearFilter("invoiceStatus")}
        >
          Clear
        </Button>

        <Divider sx={{ my: 3, opacity: 0.5 }} />

        <CustomTypographyBold
          fontSize={"0.75rem"}
          textTransform={"capitalize"}
          color="text.black"
        >
          Timesheet Status
        </CustomTypographyBold>
        <RadioGroup
          value={filters.timesheetStatus}
          onChange={(e) =>
            handleFilterChange("timesheetStatus", e.target.value)
          }
          size="small"
        >
          {[
            { value: "", label: "All" },
            { value: "send", label: "Submitted" },
            { value: "unsubmitted", label: "Unsubmitted" },
            { value: "rejected", label: "Rejected" },
            { value: "approved", label: "Approved" },
          ].map((status, index) => (
            <FormControlLabel
              key={status.value}
              value={status.value}
              control={
                <Radio size="small" sx={{ color: "rgb(238, 235, 235) " }} />
              }
              label={
                <CustomTypographyBold
                  fontSize={"0.75rem"}
                  weight={500}
                  textTransform={"none"}
                  color="text.primary"
                  mt={index !== 0 && -1}
                >
                  {status.label}
                </CustomTypographyBold>
              }
            />
          ))}
        </RadioGroup>
        <Button
          color="primary"
          startIcon={<Close sx={{ width: 12 }} />}
          sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          onClick={() => clearFilter("timesheetStatus")}
        >
          Clear
        </Button>

        <Divider sx={{ my: 3, opacity: 0.5 }} />

        <CustomTypographyBold
          fontSize={"0.75rem"}
          textTransform={"capitalize"}
          color="text.black"
        >
          Client approval
        </CustomTypographyBold>
        <RadioGroup
          value={filters.clientApproval}
          onChange={(e) => handleFilterChange("clientApproval", e.target.value)}
        >
          {[
            { value: "", label: "All" },
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ].map((status, index) => (
            <FormControlLabel
              key={status.value}
              value={status.value}
              control={
                <Radio size="small" sx={{ color: "rgb(238, 235, 235) " }} />
              }
              label={
                <CustomTypographyBold
                  fontSize={"0.75rem"}
                  weight={500}
                  textTransform={"none"}
                  color="text.primary"
                  mt={index !== 0 && -1}
                >
                  {status.label}
                </CustomTypographyBold>
              }
            />
          ))}
        </RadioGroup>
        <Button
          color="primary"
          startIcon={<i className="bi-x" />}
          sx={{ mt: 1 }}
          onClick={() => clearFilter("clientApproval")}
        >
          Clear
        </Button>
      </Box>
      {/* Drawer Footer (Always sticks to the bottom) */}
      <Box
        sx={{
          p: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ccc", // Optional: add border to separate footer
          backgroundColor: "#fff", // Ensure the footer background doesn't overlap content
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
          {countAppliedFilters() ? (
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
              onClick={() => clearAllFilters()}
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
            onClick={() => {
              getTimesheets(filters); // Pass filters to fetch timesheets
            }}
            sx={{ textTransform: "none", py: 1 }}
          >
            Show results
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Filter;
