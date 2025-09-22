// JobBasic.js
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { CommonInputField } from "../job-component/CreateJobModal";
import { CommonSelect } from "../job-component/CommonSelect";
import {
  setField,
  updateBoardCertification,
} from "../../feature/post-job/PostJobSlice";
import {
  Box,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import RichTextEditor from "../RichTextEditor";
import { selectOptions } from "../../util";
import { InputFilters } from "../../pages/schedules/Filter";
import API from "../../API";
import { CommonCreateableSelect } from "../job-component/CommonCreateableSelect";
import MultipleSelectCheckmarks from "../common/MultipleSelectCheckmarks";

const ErrorMessage = styled(Typography)({
  color: "red",
  fontSize: "0.65rem",
  marginTop: "0.25rem",
});
const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px", // optional: adjust for styling
  padding: "10px",
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

const JobBasic = ({ errors, setErrors }) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const StyledTypography = styled(Typography)({
    color: darkMode === "dark" ? " #F8F9FA" : "black",
    marginTop: "0.5rem",
    fontWeight: 400,
    fontSize: "0.875rem",
  });
  const StyledSelect = styled(Select)({
    // backgroundColor: "#F8F9FA",
    bgcolor: darkMode === "dark" ? " #333" : "#F8F9FA",
    border: "none",
    outline: "none",
  });
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  const dispatch = useDispatch();
  const {
    jobTitle,
    jobDescription,
    openPositions,
    providerRoleIds,
    allied_health_clinician_type,
    specialty,
    medicalSpecialities,
    providerRolesList,
    boardCertification,
    stateLicense,
    regularHourlyRate,
    holidayHourlyRate,
    experienceRequired,
    lastDateToApply,
    statesList,
    payRateType,
    holidayRateType,
  } = useSelector((state) => state.postJob);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [providerSubRoles, setProviderSubRoles] = useState([]);
  const [filterMedicalSpecialities, setfilterMedicalSpecialities] = useState(
    []
  );
  const [stateOptions, setstateOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors({ ...errors, [name]: "" });
    if (name === "boardCertification") {
      dispatch(updateBoardCertification({ field: value, value: checked }));
    } else {
      dispatch(setField({ field: name, value }));
    }
  };
  const handleEditorChange = (name, content) => {
    dispatch(setField({ field: name, value: content }));
  };
  useEffect(() => {
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setfilterMedicalSpecialities(selectOptions(medicalSpecialities));
    setstateOptions(selectOptions(statesList));
  }, [providerRolesList, medicalSpecialities, statesList]);
  useEffect(() => {
    // Find the id for 'Allied Health Clinician' in providerRolesList
    const alliedRole = providerRolesList?.find(
      (role) => role.name === "Allied Health Clinician"
    );
    if (
      alliedRole &&
      Array.isArray(providerRoleIds) &&
      providerRoleIds.includes(alliedRole.id)
    ) {
      getProviderSubRoles(alliedRole.id);
    } else {
      setProviderSubRoles([]);
    }
  }, [providerRoleIds, providerRolesList]);

  // Update getProviderSubRoles to accept an id
  const getProviderSubRoles = async (roleId) => {
    try {
      const resp = await API.get(
        `/api/get-provider-subroles?role_id=${roleId}`
      );
      if (resp?.data?.success) {
        setProviderSubRoles(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCustomInput = (newOption) => {
    dispatch(setField({ field: "allied_health_clinician_type", newOption }));
  };
  const subroleOptions = providerSubRoles.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  const handleProviderRolesChange = (name, value) => {
    setErrors({ ...errors, providerRoleIds: "" });
    dispatch(setField({ field: "providerRoleIds", value }));
  };
  const handlePayRateTypeChange = (e) => {
    dispatch(setField({ field: "payRateType", value: e.target.value }));
  };
  const handleHolidayRateTypeChange = (e) => {
    dispatch(setField({ field: "holidayRateType", value: e.target.value }));
  };
  // For conditional rendering of subrole field
  const alliedRole = providerRolesList?.find(
    (role) => role.name === "Allied Health Clinician"
  );
  const showSubRole =
    alliedRole &&
    Array.isArray(providerRoleIds) &&
    providerRoleIds.includes(alliedRole.id);
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3.5}>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Job title <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
          {allied_health_clinician_type}
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonInputField
            name="jobTitle"
            placeholder="Enter job title"
            value={jobTitle}
            onChange={handleChange}
          />
          {errors?.jobTitle && <ErrorMessage>{errors.jobTitle}</ErrorMessage>}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>Description</StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <RichTextEditor
            name="jobDescription"
            value={jobDescription}
            onChange={(content) =>
              handleEditorChange("jobDescription", content)
            }
          />
          {/* <StyledTextarea
            minRows={5}
            name="jobDescription"
            placeholder="Enter job description here..."
            value={jobDescription}
            onChange={handleChange}
            isLightMode={isLightMode}
            sx={{ mt: 1, fontFamily: "Inter, sans-serif", px: 2 }}
          /> */}

          {errors?.jobDescription && (
            <ErrorMessage>{errors.jobDescription}</ErrorMessage>
          )}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Provider Roles <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <MultipleSelectCheckmarks
            name="providerRoleIds"
            options={filterProviderRolesList}
            value={providerRoleIds}
            onChange={handleProviderRolesChange}
            error={!!errors?.providerRoleIds}
            width={"100%"}
          />
          {errors?.providerRoleIds && (
            <ErrorMessage>{errors.providerRoleIds}</ErrorMessage>
          )}
        </Grid>
        {showSubRole ? (
          <>
            <Grid item xs={3} sx={{}}>
              <StyledTypography>
                Provider Sub Role <span style={{ color: "red" }}>*</span>{" "}
              </StyledTypography>
            </Grid>
            <Grid item xs={9}>
              <CommonCreateableSelect
                name="allied_health_clinician_type"
                options={subroleOptions}
                value={allied_health_clinician_type}
                handleChange={handleChange}
                placeholder="Select or enter allied health clinician type"
                handleCustomInput={handleCustomInput}
              />
              {errors?.allied_health_clinician_type && (
                <div
                  style={{
                    color: "#d32f2f",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.allied_health_clinician_type}
                </div>
              )}
            </Grid>
          </>
        ) : (
          ""
        )}

        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Specialty <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonSelect
            name="specialty"
            options={filterMedicalSpecialities}
            value={+specialty}
            handleChange={handleChange}
            placeholder="Select specialty"
          />
          {errors?.specialty && <ErrorMessage>{errors.specialty}</ErrorMessage>}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Board certification/eligibility{" "}
            <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "left",
            gap: 1,
          }}
        >
          <label
            style={{
              fontSize: "14px",
              marginLeft: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="checkbox"
              name="boardCertification"
              value="BC"
              checked={boardCertification.BC}
              onChange={handleChange}
            />
            Board Certified (BC)
          </label>
          <label
            style={{
              fontSize: "14px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="checkbox"
              name="boardCertification"
              value="BE"
              checked={boardCertification.BE}
              onChange={handleChange}
            />
            Board Eligible (BE)
          </label>
          <label
            style={{
              fontSize: "14px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="checkbox"
              name="boardCertification"
              value="NA"
              checked={boardCertification.NA}
              onChange={handleChange}
            />
            N/A
          </label>
          {errors?.boardCertification && (
            <ErrorMessage>{errors.boardCertification}</ErrorMessage>
          )}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>
            State licenses <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonSelect
            name="stateLicense"
            options={stateOptions}
            value={+stateLicense}
            handleChange={handleChange}
            placeholder="Select state license"
          />
          {errors?.stateLicense && (
            <ErrorMessage>{errors.stateLicense}</ErrorMessage>
          )}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>Pay Rate</StyledTypography>  
        </Grid>
        <Grid item xs={9} sx={{ display: "flex", alignItems: "center" }}>
          <CommonInputField
            name="regularHourlyRate"
            placeholder="e.g., 50"
            value={regularHourlyRate}
            onChange={handleChange}
            type="number"
          />
          <StyledSelect
            displayEmpty
            size="small"
            name="role"
            value={payRateType}
            onChange={(e) =>
              // handlePhoneChange(index, "type", e.target.value)
              dispatch(
                setField({ field: "payRateType", value: e.target.value })
              )
            }
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography variant="caption" sx={{ color: "text.or_color" }}>
                    Select
                  </Typography>
                );
              }
              return selected;
            }}
            input={
              <OutlinedInput
                sx={{
                  height: "2.6rem",
                  "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                    {
                      padding: 0,
                    },

                  fontSize: "0.875rem",

                  border: `none`,
                  "&.Mui-focused": {
                    backgroundColor: darkMode === "dark" ? "#333" : "#fff",
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
            sx={{
              minWidth: "120px",
              backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
              color: darkMode === "dark" ? "#F6F7FA" : "text.black",
              border:
                darkMode === "dark"
                  ? `1.5px solid rgba(231, 234, 243, .7)`
                  : "none",
            }}
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </StyledSelect>

          {/* <select value={payRateType} onChange={handlePayRateTypeChange} style={{ height: "2.6rem", borderRadius: 4, bgcolor:'#F7F9FC', border: "1px solid rgba(231, 234, 243, .7)"}}>
            <option value="">Select type</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select> */}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>Holiday Rate</StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{ display: "flex", alignItems: "center" }}>
          <CommonInputField
            name="holidayHourlyRate"
            placeholder="e.g., 60"
            value={holidayHourlyRate}
            onChange={handleChange}
            type="number"
          />
          <StyledSelect
            displayEmpty
            size="small"
            name="role"
            value={holidayRateType}
            onChange={(e) =>
              // handlePhoneChange(index, "type", e.target.value)
              dispatch(
                setField({ field: "holidayRateType", value: e.target.value })
              )
            }
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography variant="caption" sx={{ color: "text.or_color" }}>
                    Select
                  </Typography>
                );
              }
              return selected;
            }}
            input={
              <OutlinedInput
                sx={{
                  height: "2.6rem",
                  "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                    {
                      padding: 0,
                    },

                  fontSize: "0.875rem",

                  border: `none`,
                  "&.Mui-focused": {
                    backgroundColor: darkMode === "dark" ? "#333" : "#fff",
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
            sx={{
              minWidth: "120px",
              backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
              color: darkMode === "dark" ? "#F6F7FA" : "text.black",
              border:
                darkMode === "dark"
                  ? `1.5px solid rgba(231, 234, 243, .7)`
                  : "none",
            }}
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
          </StyledSelect>

          {/* <select value={holidayRateType} onChange={handleHolidayRateTypeChange} style={{ height: "2.6rem", borderRadius: 4,bgcolor:'#F7F9FC', border: "1px solid rgba(231, 234, 243, .7)" }}>
            <option value="">Select type</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select> */}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>Experience required</StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonInputField
            name="experienceRequired"
            placeholder="Enter experience"
            value={experienceRequired}
            onChange={handleChange}
          />
          {errors?.experienceRequired && (
            <ErrorMessage>{errors.experienceRequired}</ErrorMessage>
          )}
        </Grid>
        <Grid item xs={3} sx={{}}>
          <StyledTypography>Open positions</StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
          <CommonInputField
            type="number"
            name="openPositions"
            placeholder="e.g,1,3"
            value={openPositions}
            onChange={handleChange}
          />
        </Grid>
        {/* <Grid item xs={3} sx={{}}>
          <StyledTypography>
            Last date to apply <span style={{ color: "red" }}>*</span>{" "}
          </StyledTypography>
        </Grid>
        <Grid item xs={9} sx={{}}>
         
          <InputFilters
            postjob={true}
            type={"date"}
            name="lastDateToApply"
            placeholder="Select date"
            value={lastDateToApply}
            onChange={handleChange}
            textColor={lastDateToApply ? "black" : "gray"}
          />
          {errors?.lastDateToApply && (
            <ErrorMessage>{errors?.lastDateToApply}</ErrorMessage>
          )}
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default JobBasic;
