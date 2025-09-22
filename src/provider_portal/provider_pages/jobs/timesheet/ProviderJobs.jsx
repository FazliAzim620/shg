import {
  Box,
  Button,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchUserInfo } from "../../../../thunkOperation/auth/loginUserInfo";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import ProviderInfoCard from "../../../provider_components/ProviderInfoCard";
import ProviderJobCard from "../../../provider_components/ProviderJobCard";
import { getProviderJobs } from "../../../../api_request";
import CardSkeleton from "../../../provider_components/CardSkeleton";
import OpenedJobs from "./OpenedJobs";
import not_found from "../../../assets/not_found.svg";
const ProviderJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);

  const { jobStatus } = useSelector((state) => state.currentJob);
  const [value, setValue] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    newValue == 0
      ? getJobs(user?.user?.user_id, "0")
      : getJobs(user?.user?.user_id, 1);
  };
  const getJobs = async (id, value) => {
    setIsLoading(true);
    try {
      const resp = await getProviderJobs(id, value);
      if (resp?.data?.success) {
        setJobs(resp?.data?.data);
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
    getJobs(user?.user?.user_id, 0);
    dispatch(fetchUserInfo());
    sessionStorage.removeItem("mytimesheet");
  }, [dispatch]);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        {/* -------------------------------------------- tab section */}
        <Box sx={{ minHeight: "71px", p: "2rem 0.5rem" }}>
          <CustomTypographyBold
            color="text.black"
            weight={600}
            fontSize={" 1.41094rem"}
          >
            My Jobs
          </CustomTypographyBold>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: value === 0 ? 600 : 400,
                    color: value === 0 ? "text.main" : "text.or_color",
                    pt: "20px",
                  }}
                >
                  Active Jobs
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: value === 1 ? 600 : 400,
                    color: value === 1 ? "text.main" : "text.or_color",
                    pt: "20px",
                  }}
                >
                  Completed jobs
                </Typography>
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <Divider sx={{ opacity: "0.3" }} />
        </Box>
        {/* ------------------------------------------------------------ tab section end */}
        {jobStatus === "my_jobs" ? (
          <Grid container spacing={2} sx={{ pr: 1.5 }}>
            <Grid item xs={12} md={3}>
              <ProviderInfoCard />
            </Grid>
            <Grid
              item
              xs={12}
              md={9}
              sx={{
                display: "flex",
                justifyContent: jobs?.length > 2 ? "center" : "start",
                flexDirection: "column",
                gap: 2,
                mb: 2,
              }}
            >
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : jobs?.length > 0 ? (
                jobs
                  ?.filter((job) => job?.client_id)
                  ?.map((job, index) => {
                    return <ProviderJobCard key={index} data={job} />;
                  })
              ) : (
                <Box
                sx={{
                  textAlign: "center",
                  py: 5,
                  px: 2,
                  color: "text.secondary",
                }}
              >
                <img
                  src={not_found} 
                  alt="No jobs"
                  style={{ maxWidth: "250px", marginBottom: "20px" }}
                />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  No jobs found
                </Typography>
                <Typography variant="body2">
                  You don’t have any {value === 0 ? "active" : "completed"} jobs at the moment.
                </Typography>
              </Box>
              
              )}
            </Grid>
          </Grid>
        ) : (
          <OpenedJobs />
        )}
      </Box>
    </Box>
  );
};

export default ProviderJobs;
