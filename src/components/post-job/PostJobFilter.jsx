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
import { fetchPostedJobsData } from "../../thunkOperation/postJob/postJobThunk";
import { useDispatch } from "react-redux";
const PostJobFilter = ({
  filterMedicalSpecialities,
  filterProviderRolesList,
  filterCountries,
  filterClientList,
  setIsDrawerOpen,
  isDrawerOpen,
  setFilters,
  countAppliedFilters,
  filterStates,
  setFilterStates,
  // -----------------------------------

  // toggleDrawer,

  // -----------------------------------
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const isLightMode = mode === "light";

  const clearFilter = () => {
    const per_page = localStorage.getItem("per_page");
    const param = {
      perpage: per_page || 20,
      page: 1,
      status: "",
    };
    dispatch(fetchPostedJobsData(param));
    setFilterStates({
      provider_name: "",
      location: "",
      role: "",
      client: "",
      speciality: "",
      status: "",
      from_date: "",
      end_date: "",
      shift_time: "",
      end_time: "",
    });
    setFilters([]);
    closeDrawer();
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
        location: "",
        role: "",
        client: "",
        speciality: "",
        status: "",
        from_date: "",
        end_date: "",
        shift_time: "",
        end_time: "",
      });
    }
  };
  useEffect(() => {
    if (!countAppliedFilters()) {
      setFilterStates({
        provider_name: "",
        location: "",
        role: "",
        client: "",
        speciality: "",
        status: "",
        from_date: "",
        end_date: "",
        shift_time: "",
        end_time: "",
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
          Filter jobs
        </CustomTypographyBold>
        <IconButton onClick={closeDrawer} sx={{ mr: -2 }}>
          <Close />
        </IconButton>
      </Box>

      <Box
        className="thin_slider"
        sx={{
          px: 4,
          pb: 11,
          flexGrow: 1,
          overflowY: "auto",
          height: "calc(100vh - 150px)",
        }}
      >
        {/* =====================Location ============= */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Location
        </Typography>
        <CommonSelect
          height={"38px"}
          name="location"
          value={filterStates.location}
          handleChange={handleChangeFilters}
          placeholder="Select location"
          options={filterCountries}
        />
        {/* ===================== Job Status  ============= */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Job status
        </Typography>
        <CommonSelect
          height={"38px"}
          name="status"
          value={filterStates.status}
          handleChange={handleChangeFilters}
          placeholder="All  "
          options={[
            // {
            //   value: "all",
            //   label: "All",
            // },
            {
              value: "active",
              label: "Active jobs",
            },
            {
              value: "inactive",
              label: "Inactive jobs",
            },
            {
              value: "draft",
              label: "Draft jobs",
            },
            {
              value: "closed",
              label: "Closed jobs",
            },
            {
              value: "archive",
              label: "Archive",
            },
          ]}
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
          Provider role
        </Typography>
        <CommonSelect
          height={"38px"}
          name="role"
          value={filterStates.role}
          handleChange={handleChangeFilters}
          placeholder="Select role"
          options={filterProviderRolesList}
        />

        {/* ===================== speciality ============= */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Provider speciality
        </Typography>
        <CommonSelect
          height={"38px"}
          name="speciality"
          value={filterStates.speciality}
          handleChange={handleChangeFilters}
          placeholder="Select speciality  "
          options={filterMedicalSpecialities}
        />

        {/* ======================== Client =================== */}
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
          placeholder="Select client  "
          options={filterClientList}
        />

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
          Due date range
        </Typography>

        <InputFilters
          height={"38px"}
          name={"from_date"}
          type="date"
          value={filterStates.from_date}
          onChange={handleChangeFilters}
          textColor={filterStates.from_date ? "black" : "gray"}
        />
        <InputFilters
          height={"38px"}
          mt={"24px"}
          name={"end_date"}
          type="date"
          value={filterStates.end_date}
          onChange={handleChangeFilters}
          textColor={filterStates.end_date ? "black" : "gray"}
        />
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
          height={"38px"}
          name={"shift_time"}
          type="time"
          value={filterStates.shift_time}
          onChange={handleChangeFilters}
          textColor={filterStates.shift_time ? "black" : "gray"}
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
              dispatch(fetchPostedJobsData(filterStates));
              setFilters([filterStates]);
              setIsDrawerOpen(false);
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

export default PostJobFilter;
