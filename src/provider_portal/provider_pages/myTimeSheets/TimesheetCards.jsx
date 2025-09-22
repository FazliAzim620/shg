import React, { useEffect, useState } from "react";
import TimesheetCard from "../../provider_components/TimesheetCard";
import { Box, Button, Grid } from "@mui/material";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import NodataFoundCard from "../../provider_components/NodataFoundCard";
import { getProviderWeeks } from "../../../api_request";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  setAllWeeksHandler,
  setJobWeeks,
} from "../../../feature/providerPortal/currentJobSlice";
import { useDispatch } from "react-redux";
import TimesheetStatusCards from "../../provider_components/TimesheetStatusCards";
import CardSkeleton from "../../provider_components/CardSkeleton";
import TimesheetsTable from "../../../pages/time-sheet/TimesheetsTable";
import TableforServiceProvider from "./TableforServiceProvider";

const TimesheetCards = ({ serviceProvider }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobid = parseInt(searchParams.get("job"));
  const [isLoading, setIsLoading] = useState(true);
  const [weeks, setWeeks] = useState([]);
  const [allWeeks, setAllWeeks] = useState([]);
  const isCurrentWeek = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return today >= start && today <= end;
  };
  const getWeeks = async () => {
    setIsLoading(true);
    try {
      const resp = await getProviderWeeks(jobid);
      if (resp?.data?.success) {
        const currentWeek = resp?.data?.data?.filter((week) =>
          isCurrentWeek(week.start_date, week.end_date)
        );
        setWeeks(currentWeek?.[0]);
        dispatch(setJobWeeks(currentWeek?.[0]));
        setAllWeeks(resp?.data?.data);
        dispatch(setAllWeeksHandler(resp?.data?.data));
        setIsLoading(false);
      }
      if (resp === undefined) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getWeeks();
  }, []);
  return (
    <Grid container mx={"auto"}>
      {isLoading ? (
        <Grid item sx={{ width: "90%", mx: "auto" }}>
          <CardSkeleton />
        </Grid>
      ) : serviceProvider ? (
        <TableforServiceProvider timesheets={allWeeks} />
      ) : (
        <TimesheetStatusCards
          weeks={allWeeks}
          from="top"
          serviceProvider={serviceProvider}
        />
      )}
    </Grid>
  );
};

export default TimesheetCards;
