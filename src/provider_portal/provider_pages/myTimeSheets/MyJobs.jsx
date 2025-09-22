import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Skeleton } from "@mui/material";
import API from "../../../API";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import { useSearchParams, useNavigate } from "react-router-dom";
import TimesheetCards from "./TimesheetCards";
import { getProviderJobs } from "../../../api_request";
import { setCurrentJob } from "../../../feature/providerPortal/currentJobSlice";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import CommonFolder from "../../../components/CommonFolder";

const MyJobs = ({ serviceProvider }) => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialclient = parseInt(searchParams.get("client"));
  const jobid = parseInt(searchParams.get("job"));
  const navigate = useNavigate();
  const getClients = async () => {
    try {
      const resp = await API.get(
        serviceProvider
          ? `api/get-provider-client-jobs/${initialclient}?provider_id=${serviceProvider}`
          : `api/get-provider-client-jobs/${initialclient}`
      );
      if (resp?.data?.success) {
        setJobs(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getClients();
  }, [initialclient]);

  const jobDetailHandler = async (job) => {
    const resp = await getProviderJobs(job.id);
    // dispatch(setCurrentJob(resp?.data?.data));
    sessionStorage.setItem("mytimesheet", 6);
    dispatch(setCurrentJob(job));
    if (serviceProvider) {
      navigate(
        `/service-provider-details/${serviceProvider}/6?client=${initialclient}&job=${job.id}`
      );
    } else {
      navigate(`/provider-my-timesheet?client=${initialclient}&job=${job.id}`);
    }
  };

  return (
    <Box mx={isLoading && "auto"} sx={{ width: "100%" }}>
      {isLoading ? (
        <Grid container mx="auto" width="100%">
          {[1, 2, 3, 4].map((item, index) => (
            <Grid
              item
              xs={6}
              md={2.55}
              key={index}
              sx={{
                bgcolor: "background.paper",
                borderRadius: "10px",
                minHeight: "5rem",
                minWidth: "15rem",
                mt: 1,
                px: 2,
                mx: 1,
                boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .25)",
                  bgcolor: "background.paper",
                },
              }}
            >
              <Skeleton width="100%" height="100%" sx={{ minWidth: "5rem" }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container mx="auto" width="100%" sx={{ display: "flex", gap: 1 }}>
          {!jobid
            ? jobs?.map((item, index) => (
                <CommonFolder
                  displayHandler={jobDetailHandler}
                  job={item}
                  index={index}
                />
              ))
            : ""}
          {jobid ? <TimesheetCards serviceProvider={serviceProvider} /> : ""}
        </Grid>
      )}
    </Box>
  );
};

export default MyJobs;
