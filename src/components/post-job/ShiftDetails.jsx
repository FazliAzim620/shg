import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShiftDetails } from "../../feature/post-job/PostJobSlice";
import { Box, Grid, Typography, styled } from "@mui/material";
import { CommonInputField } from "../job-component/CreateJobModal";
import { InputFilters } from "../../pages/schedules/Filter";
const ErrorMessage = styled(Typography)({
  color: "red",
  fontSize: "0.65rem",
  marginTop: "0.25rem",
});
const ShiftDetails = ({ errors, setErrors }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const StyledTypography = styled(Typography)({
    color: darkMode === "dark" ? " #F8F9FA" : "black",
    marginTop: "0.5rem",
    fontWeight: 400,
    fontSize: "0.875rem",
  });
  const { startDate, endDate, shiftDays, startTime, endTime } = useSelector(
    (state) => state.postJob
  );
  const safeShiftDays = Array.isArray(shiftDays) ? shiftDays : [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors({ ...errors, [name]: "" });

    if (name === "shiftDays") {
      const updatedShiftDays = checked
        ? [...safeShiftDays, value] // Add day to shiftDays
        : safeShiftDays.filter((day) => day !== value); // Remove day from shiftDays

      dispatch(setShiftDetails({ shiftDays: updatedShiftDays }));
    } else {
      dispatch(
        setShiftDetails({
          [name]: type === "checkbox" ? checked : value,
        })
      );
    }
  };
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3.5}>
          <Grid item xs={3} sx={{}}>
            <StyledTypography>Start Date</StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <InputFilters
              postjob={true}
              type={"date"}
              placeholder="Select start date"
              name="startDate"
              value={startDate}
              onChange={handleChange}
              textColor={startDate ? "black" : "gray"}
            />
            {errors?.startDate && (
              <ErrorMessage>{errors.startDate}</ErrorMessage>
            )}
          </Grid>

          <Grid item xs={3} sx={{}}>
            <StyledTypography>End Date</StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <InputFilters
              postjob={true}
              type={"date"}
              placeholder="Select end date"
              name="endDate"
              value={endDate}
              onChange={handleChange}
              textColor={endDate ? "black" : "gray"}
            />
            {errors?.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
          </Grid>

          <Grid item xs={3} sx={{}}>
            <StyledTypography>Shift Days</StyledTypography>
          </Grid>
          <Grid item xs={9}>
            <Grid container>
              <Grid
                xs={12}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]?.map(
                  (day) => (
                    <Box
                      key={day}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="shiftDays"
                        value={day}
                        checked={safeShiftDays?.includes(day)}
                        onChange={handleChange}
                      />
                      <label
                        style={{
                          fontSize: "14px",
                          color: darkMode === "dark" ? "#fff" : "black",
                        }}
                      >
                        {day}
                      </label>
                    </Box>
                  )
                )}
              </Grid>
              <Grid xs={12}>
                {errors?.shiftDays && (
                  <ErrorMessage>{errors.shiftDays}</ErrorMessage>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3} sx={{}}>
            <StyledTypography>Start Time</StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              type={"time"}
              placeholder="Select start time"
              name="startTime"
              value={startTime}
              onChange={handleChange}
            />
            {errors?.startTime && (
              <ErrorMessage>{errors.startTime}</ErrorMessage>
            )}
          </Grid>

          <Grid item xs={3} sx={{}}>
            <StyledTypography>
              End Time
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
            </StyledTypography>
          </Grid>
          <Grid item xs={9} sx={{}}>
            <CommonInputField
              type={"time"}
              placeholder="Select end time"
              name="endTime"
              value={endTime}
              onChange={handleChange}
            />
            {errors?.endTime && <ErrorMessage>{errors.endTime}</ErrorMessage>}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ShiftDetails;
