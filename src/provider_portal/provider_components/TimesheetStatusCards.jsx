import { Box, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useState } from "react";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import Carousel from "../../components/Carousel";
import { useSelector } from "react-redux";

const TimesheetStatusCards = ({ from, serviceProvider }) => {
  const { allWeeks } = useSelector((state) => state.currentJob);
  const darkMode = useSelector((state) => state.theme.mode);
  const [alignment, setAlignment] = useState("this_week");

  const buttonTab = [
    { label: "This week", value: "this_week" },
    { label: "Last week", value: "last_week" },
    { label: "Last 15 days", value: "15_days" },
    { label: "This month", value: "this_month" },
    { label: "Last month", value: "last_month" },
  ];

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const filteredWeeks = (status) =>
    allWeeks?.filter((item) => item?.timesheet_status === status) || [];
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container xs={from ? 10 : 12} mx="auto" py={2}>
          <CustomTypographyBold weight={500}>
            Rejected by admin (
            {
              allWeeks?.filter(
                (item) => item?.timesheet_status === "rejected_by_admin"
              ).length
            }
            )
          </CustomTypographyBold>
        </Grid>
        <Carousel
          allWeeks={allWeeks?.filter(
            (item) => item?.timesheet_status === "rejected_by_admin"
          )}
          from={from}
          serviceProvider={serviceProvider}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container xs={from ? 10 : 12} mx="auto" py={2}>
          <CustomTypographyBold weight={500}>
            Not Submitted by provider (
            {allWeeks?.filter((item) => item?.status === null)?.length})
          </CustomTypographyBold>
        </Grid>
        <Carousel
          allWeeks={allWeeks?.filter((item) => item?.status === null) || []}
          from={from}
          serviceProvider={serviceProvider}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container xs={from ? 10 : 12} mx="auto" py={2}>
          <CustomTypographyBold weight={500}>
            Submitted by provider (
            {
              allWeeks?.filter(
                (item) =>
                  item?.status === "submitted_by_provider" &&
                  item?.timesheet_status !== "approved_by_client" &&
                  item?.timesheet_status !== "approved_by_admin" &&
                  item?.timesheet_status !== "rejected_by_client" &&
                  item?.timesheet_status !== "rejected_by_admin"
              )?.length
            }
            )
          </CustomTypographyBold>
        </Grid>
        <Carousel
          allWeeks={
            allWeeks?.filter(
              (item) =>
                item?.status === "submitted_by_provider" &&
                item?.timesheet_status !== "approved_by_client" &&
                item?.timesheet_status !== "approved_by_admin" &&
                item?.timesheet_status !== "rejected_by_client" &&
                item?.timesheet_status !== "rejected_by_admin"
              // item?.status === "submitted_by_provider" &&
              // item?.timesheet_status !== "approved_by_client"
            ) || []
          }
          from={from}
          serviceProvider={serviceProvider}
        />
      </Grid>

      <Grid item xs={12}>
        <Box py={2}>
          <Grid container xs={from ? 10 : 12} mx="auto" py={2}>
            <CustomTypographyBold weight={500}>
              Awaiting Client Approval (
              {
                allWeeks?.filter(
                  (item) =>
                    item?.timesheet_status === "approved_by_admin" ||
                    item?.timesheet_status === "rejected_by_client"
                )?.length
              }
              )
            </CustomTypographyBold>
          </Grid>
          <Carousel
            allWeeks={allWeeks?.filter(
              (item) =>
                item?.timesheet_status === "approved_by_admin" ||
                item?.timesheet_status === "rejected_by_client"
            )}
            from={from}
            serviceProvider={serviceProvider}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box container xs={from ? 10 : 12} mx="auto" py={2}>
          <Grid container xs={from ? 10 : 12} mx="auto" py={2}>
            <CustomTypographyBold weight={500}>
              Approved by client (
              {
                allWeeks?.filter(
                  (item) =>
                    item?.client_status === "approved_by_client" &&
                    item?.timesheet_status === "approved_by_client"
                )?.length
              }
              )
            </CustomTypographyBold>
          </Grid>
          <Carousel
            allWeeks={
              allWeeks?.filter(
                (item) =>
                  item?.client_status === "approved_by_client" &&
                  item?.timesheet_status === "approved_by_client"
              ) || []
            }
            from={from}
            serviceProvider={serviceProvider}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TimesheetStatusCards;
