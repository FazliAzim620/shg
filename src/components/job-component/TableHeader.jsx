import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  Badge,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ShowChart } from "@mui/icons-material";
import { fetchJobsData } from "../../thunkOperation/job_management/states";
import API from "../../API";
import { useParams } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const TableHeader = ({ jobs, isLoading, jobsOrder, filter }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const [value, setValue] = useState(0);
  const [jobscount, setJobsCount] = useState({
    pending_jobs: 0,
    completed_jobs: 0,
  });
  const handleChangeRowsPerPage = (status) => {
    const per_page = localStorage.getItem("per_page");
    const param = {
      perpage: per_page ? per_page : 10,
      page: 1,
      status: status,
    };
    if (jobsOrder && params.id) {
      param.client_id = params.id;
    }
    dispatch(fetchJobsData(param));
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        {
          handleChangeRowsPerPage("");
        }
        break;
      case 1:
        {
          handleChangeRowsPerPage(1);
        }
        break;
      case 2: {
        handleChangeRowsPerPage(0);
      }
    }
  };
  const filterHandler = () => {
    // dispatch(fetchJobsData(10));
  };
  const getJobCount = async () => {
    try {
      let resp;
      if (jobsOrder && params.id) {
        resp = await API.get(`/api/get-jobs-count?client_id=${params.id}`);
      } else {
        resp = await API.get(`/api/get-jobs-count`);
      }
      if (resp?.data?.success) {
        setJobsCount({
          pending_jobs: resp?.data?.pending_jobs,
          completed_jobs: resp?.data?.completed_jobs,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobCount();
  }, []);
  const totalSteps = 7;
  const completedPercentage = (jobscount?.completed_jobs / jobs?.total) * 100;
  const remainingPercentage = (jobscount?.pending_jobs / jobs?.total) * 100;
  return (
    <Box sx={{ width: "99%", m: "0 auto", mt: 1.8 }}>
      {!jobsOrder && (
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: 600,
                    color:
                      value !== 0 && darkMode == "dark"
                        ? "rgba(255, 255, 255, .7)"
                        : "text.primary",
                  }}
                >
                  All
                </Typography>
                {/* <Typography
                sx={{
                  color:
                    darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#1E2033",
                  fontSize: "10.5px",
                  fontWeight: "500",
                  padding: "3px 8px",
                  backgroundColor: "rgba(19, 33, 68, .1)",
                  borderRadius: "5px",
                }}
              >
                {jobs?.total}
              </Typography> */}
              </Box>
            }
            {...a11yProps(0)}
            sx={{ pb: 2.25 }}
          />
          <Tab
            label={
              <Typography
                variant="h6"
                sx={{
                  textTransform: "capitalize",
                  fontSize: "14px",
                  fontWeight: 600,
                  color:
                    value !== 1 && darkMode == "dark"
                      ? "rgba(255, 255, 255, .7)"
                      : "text.primary",
                }}
              >
                Complete
              </Typography>
            }
            {...a11yProps(1)}
            sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: 400,
              color: darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#132144",
              pb: 2.25,
            }}
          />
          <Tab
            label={
              <Typography
                variant="h6"
                sx={{
                  textTransform: "capitalize",
                  fontSize: "14px",
                  fontWeight: 600,
                  color:
                    value !== 2 && darkMode == "dark"
                      ? "rgba(255, 255, 255, .7)"
                      : "text.primary",
                }}
              >
                In progress
              </Typography>
            }
            {...a11yProps(2)}
            sx={{
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: 400,
              // color: "text.primary",
              color: darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#132144",
              pb: 2.25,
            }}
          />
        </Tabs>
      )}
      {!jobsOrder && (
        <Divider
          sx={{
            borderColor:
              darkMode == "dark"
                ? "rgba(255, 255, 255,.7"
                : "rgba(231, 234, 243, 01)",
          }}
        />
      )}

      <Grid
        container
        sx={{
          mt: 4,
          bgcolor: "background.paper",
          p: "21px",
          borderRadius: "0.75rem",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
        }}
      >
        <Grid
          item
          xs={12}
          md={2.7}
          sx={{ display: "flex", alignItems: "center", gap: 3 }}
        >
          {isLoading ? (
            <CircularProgress size="30px" />
          ) : (
            <Typography
              variant="h3"
              sx={{ fontWeight: 600, color: "text.black" }}
            >
              {jobscount?.completed_jobs + jobscount?.pending_jobs}
              {/* {jobs?.total} */}
            </Typography>
          )}

          <Box
            sx={{
              ml: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              //   justifyContent: "center",
              //   bgcolor: "red",
            }}
          >
            <Typography variant="body2">Total jobs</Typography>
            {/* <IconButton sx={{ ml: 2.2, mt: 0.3 }}>
              <Badge
                badgeContent={
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      textAlign: "center",
                      p: "0.25rem ",
                    }}
                  >
                    <ShowChart sx={{ fontSize: "0.65rem" }} /> 100 late in due
                  </Typography>
                }
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "rgba(237, 76, 120, .1)",
                    color: "rgba(237, 76, 120)",
                    width: "97px",
                  },
                }}
              ></Badge>
            </IconButton> */}
          </Box>
        </Grid>
        <Grid xs={12} md={9.3}>
          {value == 0 && (filter?.length === 0 || filter === undefined) && (
            <Box sx={{ pt: 1.2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <div
                    style={{
                      backgroundColor: "#377dff",
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      marginRight: ".4375rem",
                    }}
                  ></div>{" "}
                  In progress ({jobscount?.pending_jobs})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <div
                    style={{
                      backgroundColor: "#00c9a7",
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      marginRight: ".4375rem",
                    }}
                  ></div>{" "}
                  Completed ({jobscount?.completed_jobs})
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pt: 1,
                  borderRadius: "10px",
                }}
              >
                {(value === 0 || value == 2) && (
                  <Box
                    sx={{
                      bgcolor: "#377dff",
                      width: `${value === 0 ? remainingPercentage : 100}%`,
                      height: "8px",
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                  />
                )}

                {(value === 0 || value == 1) && (
                  <Box
                    sx={{
                      bgcolor: "#00c9a7",
                      width: `${value === 0 ? completedPercentage : 100}%`,
                      height: "8px",
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableHeader;
