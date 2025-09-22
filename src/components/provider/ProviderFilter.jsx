import React, { useEffect, useState } from "react";
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
  Input,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import { CommonSelect } from "../../components/job-component/CommonSelect";
import { CommonInputField } from "../../components/job-component/CreateJobModal";
import { InputFilters } from "../../pages/schedules/Filter";

const ProviderFilter = ({
  allSpecialitiesOptions,
  filterProviderRolesList,
  filterExistingProvider,
  setIsDrawerOpen,
  isDrawerOpen,
  getServiceProvider,
  setFilters,
  countAppliedFilters,
  // -----------------------------------

  // toggleDrawer,
  // getServiceProvider,

  // -----------------------------------
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  const [filterStates, setFilterStates] = useState({
    provider_name: "",
    role: "",
    speciality: "",
    jobStatus: "",
    from_date: "",
    end_date: "",
    min_rate: "",
    max_rate: "",
    client_min_rate: "",
    client_max_rate: "",
  });
  const clearFilter = () => {
    getServiceProvider();
    setIsDrawerOpen(false);
    setFilters([]);
    setFilterStates({
      provider_name: "",
      role: "",
      speciality: "",
      jobStatus: "",
      from_date: "",
      end_date: "",
      min_rate: "",
      max_rate: "",
      client_min_rate: "",
      client_max_rate: "",
    });
  };
  const handleChangeFilters = (event) => {
    const { name, value } = event.target;

    setFilterStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (!countAppliedFilters()) {
      setFilterStates({
        provider_name: "",
        role: "",
        speciality: "",
        jobStatus: "",
        from_date: "",
        end_date: "",
        min_rate: "",
        max_rate: "",
      });
    }
  };
  useEffect(() => {
    if (!countAppliedFilters()) {
      setFilterStates({
        provider_name: "",
        role: "",
        speciality: "",
        jobStatus: "",
        from_date: "",
        end_date: "",
        min_rate: "",
        max_rate: "",
      });
    }
  }, [isDrawerOpen]);
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
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
          Filter providers
        </CustomTypographyBold>
        <IconButton sx={{ mr: -2 }}>
          <Close onClick={closeDrawer} />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 4,
          pb: 11,
          flexGrow: 1,
          overflowY: "auto",
          height: "calc(100vh - 150px)",
        }}
      >
        {/* =====================provider name============= */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Provider name
        </Typography>

        <CommonSelect
          height={"38px"}
          name="provider_name"
          value={filterStates.provider_name}
          handleChange={handleChangeFilters}
          placeholder="Select providers  "
          options={filterExistingProvider}
        />

        {/* =====================role============ */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Role
        </Typography>
        <CommonSelect
          height={"38px"}
          name="role"
          value={filterStates.role}
          handleChange={handleChangeFilters}
          placeholder="Select role"
          options={filterProviderRolesList}
        />

        {/* =====================speciality============= */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Speciality
        </Typography>
        <CommonSelect
          height={"38px"}
          name="speciality"
          value={filterStates.speciality}
          handleChange={handleChangeFilters}
          placeholder="Select speciality  "
          options={allSpecialitiesOptions}
        />

        {/* ======================== Rate range =================== */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          {" "}
          Provider Rate range
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CommonInputField
            height={"38px"}
            name={"min_rate"}
            placeholder={"Min"}
            type="number"
            value={filterStates.min_rate}
            onChange={handleChangeFilters}
          />
          <Typography
            variant="body2"
            sx={{ color: "text.black", fontWeight: "500" }}
          >
            to
          </Typography>
          <CommonInputField
            height={"38px"}
            name={"max_rate"}
            type="number"
            placeholder={"Max"}
            value={filterStates.max_rate}
            onChange={handleChangeFilters}
          />
        </Box>
      </Box>
      {/* Drawer Footer (Always sticks to the bottom) */}
      <Box
        sx={{
          p: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
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
              onClick={clearFilter}
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
              setIsDrawerOpen(false);
              getServiceProvider(filterStates); // Pass filters to fetch timesheets
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

export default ProviderFilter;
