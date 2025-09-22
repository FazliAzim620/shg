import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import { useDispatch, useSelector } from "react-redux";
import SchecdularCalendar from "../../provider_components/schedular/schedularTab1/SchecdularCalendar";
import MyAvailiblity from "../../provider_components/schedular/availiblityTab2/MyAvailiblity";
import MyCalendar from "../../provider_components/schedular/schedularTab1/MyCalendar";
import MyAvailiblityTab from "../../provider_components/schedular/availiblityTab2/MyAvailiblityTab";
import { fetchProviderSchedules } from "../../../thunkOperation/job_management/scheduleThunk";

const Scheduling = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const darkMode = useSelector((state) => state.theme.mode);
  const tabLabels = ["My Schedular", "My Availiblity"];

  // ============= getting scheduler data from store ===============
  const { schedules } = useSelector((state) => state.providerSchedules);

  // ======================handle tab chneg=======================================
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == 0) {
      const data = dispatch(fetchProviderSchedules({}));
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProviderSchedules({}));
  }, [dispatch]);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  return (
    <>
      <Box
        sx={{
          overflowX: "hidden",
          bgcolor: "background.page_bg",
          pb: 5,
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Box
            sx={{
              minHeight: "71px",
              p: "2rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <CustomTypographyBold
              color="text.black"
              weight={600}
              fontSize={"1.41094rem"}
            >
              Scheduling
            </CustomTypographyBold>
          </Box>

          <Tabs
            sx={{ mx: "5px" }}
            value={value}
            onChange={handleChange}
            aria-label="schedular-tabs"
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={label}
                label={
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: value === index ? "text.main" : "inherit",
                      pt: "20px",
                    }}
                  >
                    {label}
                  </Typography>
                }
                {...a11yProps(index)}
              />
            ))}
          </Tabs>

          <Divider sx={{ opacity: "0.3", mx: "5px" }} />
          <Box
            sx={{
              mt: 4,
              mx: "5px",
            }}
          >
            {value === 0 ? (
              <MyCalendar
                schedularData={schedules?.data || []}
                darkMode={darkMode}
              />
            ) : (
              <MyAvailiblityTab darkMode={darkMode} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Scheduling;
