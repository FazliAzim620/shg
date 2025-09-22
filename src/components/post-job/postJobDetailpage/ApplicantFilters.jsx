import React, { useEffect, useState } from "react";
import DrawerFilters from "../../common/DrawerFilters";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { CommonSelect } from "../../job-component/CommonSelect";
import { InputFilters } from "../../../pages/schedules/Filter";
import CustomTypographyBold from "../../CustomTypographyBold";
import { Close } from "@mui/icons-material";

const ApplicantFilters = ({
  countAppliedFilters,
  applicants,
  isDrawerOpen,
  clearFilterHandler,
  // closeDrawer,
  getApplicants,
  setFilters,
  setIsDrawerOpen,
}) => {
  // =======================applicant options====================
  const applicantOptions = applicants?.map((option) => ({
    value: option.id,
    // label: `${option.email} - (${option?.name}`,
    label: option?.name,
  }));
  // =======================applicant options====================
  const locationOptions = applicants?.map((option) => ({
    value: option.applicantid,
    label: option.location,
  }));
  const [filterStates, setFilterStates] = useState({
    name: "",
    status: "",
    experience: "",
    setupStatus: "",
    location: "",
    apply_date: "",
    apply_from_date: "",
    apply_end_date: "",
  });
  const clearFilter = () => {
    setFilters([]);
    clearFilterHandler();
    setIsDrawerOpen(false);
    setFilterStates({
      name: "",
      status: "",
      experience: "",
      setupStatus: "",
      location: "",
      apply_date: "",
      apply_from_date: "",
      apply_end_date: "",
    });
  };
  const handleChangeFilters = (event) => {
    const { name, value } = event.target;
    setFilterStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // input field same style =================
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (!countAppliedFilters()) {
      setFilterStates({
        name: "",
        status: "",
        experience: "",
        hourly_rate: "",
        setupStatus: "",
        location: "",
        apply_date: "",
        apply_from_date: "",
        apply_end_date: "",
      });
    }
  };
  useEffect(() => {
    if (!countAppliedFilters()) {
      setFilterStates({
        name: "",
        status: "",
        experience: "",
        hourly_rate: "",
        setupStatus: "",
        location: "",
        apply_date: "",
        apply_from_date: "",
        apply_end_date: "",
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
          px: "24px",
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
          Filter Applicants
        </CustomTypographyBold>
        <IconButton sx={{ mr: -2 }}>
          <Close onClick={closeDrawer} />
        </IconButton>
      </Box>
      {/* <Divider sx={{ opacity: 0.5 }} /> */}
      <Box
        className="thin_slider"
        sx={{
          px: "24px",
          pb: 11,
          flexGrow: 1,
          overflowY: "auto",
          height: "calc(100vh - 150px)",
        }}
      >
        {/* =====================provider name ============= */}
        <Typography
          pt={"12px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Applicant name
        </Typography>

        <InputFilters
          // height={"38px"}
          // name="name"
          // value={filterStates.name}
          // handleChange={handleChangeFilters}
          // placeholder="Select provider name  "
          // options={applicantOptions}
          placeholder={"Enter applicant name"}
          height={"38px"}
          name={"name"}
          type="text"
          value={filterStates.name}
          onChange={handleChangeFilters}
        />
        {/* ====================Experience============ */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Experience
        </Typography>

        <InputFilters
          placeholder={"Enter experience (years)"}
          height={"38px"}
          name={"experience"}
          type="number"
          value={filterStates.experience}
          onChange={handleChangeFilters}
        />
        {/* ===================== status  ============= */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Status
        </Typography>
        <CommonSelect
          height={"38px"}
          name="status"
          value={filterStates.status}
          handleChange={handleChangeFilters}
          placeholder="Applied  "
          options={[
            {
              value: "applied",
              label: "Applied",
            },
            {
              value: "contacted",
              label: "Contacted",
            },
            {
              value: "shortlisted",
              label: "Shortlisted",
            },
            {
              value: "interviewed",
              label: "Interviewed",
            },
            {
              value: "hired",
              label: "Hired",
            },
            {
              value: "rejected",
              label: "Rejected",
            },
          ]}
        />
        {/* ====================hourly rate============ */}
        {/* <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Hourly rate
        </Typography>

        <InputFilters
          placeholder={"$50 - $1000"}
          height={"38px"}
          name={"hourly_rate"}
          type="number"
          value={filterStates.hourly_rate}
          onChange={handleChangeFilters}
        /> */}

        {/* ======================== location =================== */}
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
        <InputFilters
          placeholder={"Enter location"}
          height={"38px"}
          name={"location"}
          value={filterStates.location}
          onChange={handleChangeFilters}
        />

        {/* ======================== apply from date =================== */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Apply from date
        </Typography>

        <InputFilters
          height={"38px"}
          name={"apply_from_date"}
          type="date"
          value={filterStates.apply_from_date}
          onChange={handleChangeFilters}
          textColor={filterStates.apply_from_date ? "black" : "gray"}
        />
        {/* ======================== apply end date =================== */}
        <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Apply to date
        </Typography>

        <InputFilters
          height={"38px"}
          name={"apply_end_date"}
          type="date"
          value={filterStates.apply_end_date}
          onChange={handleChangeFilters}
          textColor={filterStates.apply_end_date ? "black" : "gray"}
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
          px: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
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
              getApplicants(filterStates);
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

export default ApplicantFilters;
