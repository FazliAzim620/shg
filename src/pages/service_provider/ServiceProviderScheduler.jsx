// ServiceProviderScheduler.jsx
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchShiftSchedules } from "../../thunkOperation/job_management/providerInfoStep";
import MyCalendar from "../../provider_portal/provider_components/schedular/schedularTab1/MyCalendar";
import { fetchProviderSchedules } from "../../thunkOperation/job_management/scheduleThunk";
const ServiceProviderScheduler = ({ provider_id }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  // ============= getting scheduler data from store ===============
  const { schedules, loading, error } = useSelector(
    (state) => state.providerSchedules
  );
  useEffect(() => {
    dispatch(fetchProviderSchedules({ provider_id }));
    localStorage.setItem("provider_id", provider_id);
  }, []);

  // =============================================================
  const params = useParams();
  useEffect(() => {
    dispatch(fetchShiftSchedules(params?.id));
  }, [params?.id]);
  return (
    <>
      <Box>
        <MyCalendar schedularData={schedules?.data} darkMode={darkMode} />
      </Box>
    </>
  );
};

export default ServiceProviderScheduler;
