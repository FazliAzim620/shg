import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import API from "../../../API";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Job_clientContact = () => {
  const { currentJob } = useSelector((state) => state.currentJob);
  const params = useParams();
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getJobContact = async () => {
    try {
      const resp = await API.get(`/api/get-job-contacts/${params.id}`);
      if (resp?.data?.success) {
        setIsLoading(false);
        setContact(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobContact();
  }, []);
  const billingAddress = contact?.find((item) => item.type === "billing");
  const siteAddress = contact?.find((item) => item.type === "site");

  // Use site address if available, otherwise fallback to billing address
  const displayAddress = billingAddress?.site_same_as_billing
    ? billingAddress
    : siteAddress;
  return (
    <>
      <Card
        sx={{
          minHeight: "230px",
          mt: 2.7,

          mb: 2,
          borderRadius: ".75rem",
          backgroundColor: "text.paper",
          boxShadow: "none",
        }}
      >
        <CardHeader
          sx={{
            pb: 0.5,
            borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
          }}
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  lineHeight: 2,
                  color: "text.black",
                }}
              >
                Client Contacts
              </Typography>
            </Box>
          }
        />

        <CardContent sx={{ p: 2, mt: 0.5 }}>
          <Grid container spacing={2} pb={1}>
            <Grid item xs={2}>
              <Typography variant="body2">
                <strong>Client Name:</strong>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                textAlign={"left"}
                sx={{ textTransform: "capitalize" }}
              >
                {isLoading ? <Skeleton /> : currentJob?.client_name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} pb={1}>
            <Grid item xs={2}>
              <Typography variant="body2">
                <strong>Country:</strong>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                textAlign={"left"}
                sx={{ textTransform: "capitalize" }}
              >
                {isLoading ? <Skeleton /> : displayAddress?.country?.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} pb={1}>
            <Grid item xs={2}>
              <Typography variant="body2">
                <strong>State:</strong>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                textAlign={"left"}
                sx={{ textTransform: "capitalize" }}
              >
                {isLoading ? <Skeleton /> : displayAddress?.state?.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} pb={1}>
            <Grid item xs={2}>
              <Typography variant="body2">
                <strong>City:</strong>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                textAlign={"left"}
                sx={{ textTransform: "capitalize" }}
              >
                {isLoading ? <Skeleton /> : displayAddress?.city || "--"}
              </Typography>
            </Grid>
          </Grid>
          {displayAddress?.zip_code && (
            <Grid container spacing={2} pb={1}>
              <Grid item xs={2}>
                <Typography variant="body2">
                  <strong>Zip code:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="body2"
                  textAlign={"left"}
                  sx={{ textTransform: "capitalize" }}
                >
                  {isLoading ? <Skeleton /> : displayAddress?.zip_code || "--"}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} pb={1}>
            <Grid item xs={2}>
              <Typography variant="body2">
                <strong>Phone:</strong>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                textAlign={"left"}
                sx={{ textTransform: "capitalize" }}
              >
                {isLoading ? <Skeleton /> : displayAddress?.phone || "--"}
              </Typography>
            </Grid>
          </Grid>
          {displayAddress?.address_line_1 && (
            <Grid container spacing={2} pb={1}>
              <Grid item xs={2}>
                <Typography variant="body2">
                  <strong>Address line 1:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="body2"
                  textAlign={"left"}
                  sx={{ textTransform: "capitalize" }}
                >
                  {isLoading ? <Skeleton /> : displayAddress?.address_line_1}
                </Typography>
              </Grid>
            </Grid>
          )}
          {displayAddress?.address_line_2 && (
            <Grid container spacing={2} pb={1}>
              <Grid item xs={2}>
                <Typography variant="body2">
                  <strong>Address line 2:</strong>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="body2"
                  textAlign={"left"}
                  sx={{ textTransform: "capitalize" }}
                >
                  {isLoading ? <Skeleton /> : displayAddress?.address_line_2}
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Job_clientContact;
