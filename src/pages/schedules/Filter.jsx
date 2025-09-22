import React, { useState, useEffect } from "react";
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
import API from "../../API";

export const InputFilters = ({
  postjob,
  placeholder,
  name,
  value,
  onChange,
  type,
  mt,
  textColor,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const mode = useSelector((state) => state.theme.mode);
  return (
    <Input
      placeholder={placeholder}
      variant="standard"
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      sx={{
        mt,
        color: mode === "dark" ? "#fff" : textColor,
        border: "1px solid rgba(231, 234, 243, .7)",
        width: "100%",
        p: ".6125rem 1rem",
        borderRadius: ".3125rem",
        bgcolor: mode === "dark" ? "#333" : "#f6f7fa",
        "&:hover": {
          bgcolor: mode === "dark" ? "#333" : "#fff",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        },
        "& .MuiInputBase-input::placeholder": {
          color: "rgba(108, 117, 125, 1)",
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
          lineHeight: "21px",
          fontWeight: 400,
        },
      }}
      disableUnderline={true}
      inputProps={{
        ...(postjob && type === "date" && { min: today }), // Set min date if type is date
      }}
      onFocus={(e) => {
        if (type === "date" || type === "time") {
          e.target.showPicker();
        }
      }}
    />
  );
};
const Filter = ({
  shiftTab,
  clientOptions,
  allSpecialitiesOptions,
  filterProviderRolesList,
  filterExistingProvider,
  setIsDrawerOpen,
  isDrawerOpen,
  getTimesheets,
  setFilters,
  countAppliedFilters,
  setRecruitersData,
  recruitersData,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  const [filterStates, setFilterStates] = useState({
    provider_name: "",
    role: "",
    speciality: "",
    recruiter: "",
    client: "",
    from_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
  });
  const clearFilter = () => {
    getTimesheets();
    setFilters([]);
    setIsDrawerOpen(false);
    setFilterStates({
      provider_name: "",
      role: "",
      speciality: "",
      recruiter: "",
      client: "",
      from_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
    });
  };
  const handleChangeFilters = (event) => {
    const { name, value } = event.target;
    setFilterStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // input field same style=================
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (!countAppliedFilters()) {
      setFilterStates({
        provider_name: "",
        role: "",
        speciality: "",
        recruiter: "",
        client: "",
        from_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
      });
    }
  };
  useEffect(() => {
    if (!countAppliedFilters()) {
      setFilterStates({
        provider_name: "",
        role: "",
        speciality: "",
        recruiter: "",
        client: "",
        from_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
      });
    }
  }, [isDrawerOpen]);
  const getRecruiter = async (role) => {
    try {
      const resp = await API.get(`/api/get-users?role=${role}`);
      if (resp?.data?.success) {
        setRecruitersData(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRecruiter("recruiter");
  }, []);
  const RecOptions = recruitersData?.map((opt) => ({
    label: opt?.name,
    value: opt?.id,
  }));

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
          Filter shifts
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
        {/* ===================== provider name============= */}
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
          placeholder="Select providers"
          options={filterExistingProvider}
        />
        {/* ================== role ============ */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Provider Role
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
          Recruiter
        </Typography>
        <CommonSelect
          height={"38px"}
          name="recruiter"
          value={filterStates.recruiter}
          handleChange={handleChangeFilters}
          placeholder="Select recruiter  "
          options={RecOptions}
        />
        {/* =====================client============ */}
        {!shiftTab && (
          <>
            <Typography
              pt={"24px"}
              pb={"8px"}
              sx={{
                color: "#1E2022",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              Client
            </Typography>
            <CommonSelect
              height={"38px"}
              name="client"
              value={filterStates.client}
              handleChange={handleChangeFilters}
              placeholder="Select client"
              options={clientOptions}
            />
          </>
        )}

        {/* ========================date range=================== */}
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
          name={"from_date"}
          type="date"
          value={filterStates.from_date}
          onChange={handleChangeFilters}
          textColor={filterStates.from_date ? "black" : "gray"}
        />
        <InputFilters
          mt={"24px"}
          name={"end_date"}
          type="date"
          value={filterStates.end_date}
          onChange={handleChangeFilters}
          textColor={filterStates.end_date ? "black" : "gray"}
        />

        {/* ========================Shift time range=================== */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Shift time range
        </Typography>
        <InputFilters
          name={"start_time"}
          type="time"
          value={filterStates.start_time}
          onChange={handleChangeFilters}
          textColor={filterStates.start_time ? "black" : "gray"}
        />
        <InputFilters
          mt={"24px"}
          name={"end_time"}
          type="time"
          value={filterStates.end_time}
          onChange={handleChangeFilters}
          textColor={filterStates.end_time ? "black" : "gray"}
        />
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
          {countAppliedFilters && countAppliedFilters() ? (
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
              getTimesheets(filterStates); // Pass filters to fetch timesheets
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
