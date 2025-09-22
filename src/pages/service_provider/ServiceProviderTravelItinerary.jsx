import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getProviderClients,
  getProviderClientsAssignments,
} from "../../api_request";
import { downloadHandlerFile } from "../../util";
import CommonFolder from "../../components/CommonFolder";
import API from "../../API";
import ProviderItineraryClients from "../../provider_portal/provider_pages/travelItinerary/ProviderItineraryClients";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";

const ServiceProviderTravelItinerary = ({ provider_id }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClientId = parseInt(searchParams.get("client")) || 0;
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const resp = await getProviderClients(provider_id);
      if (resp?.data?.success) {
        setClients(resp.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs and attachments based on selected client
  const fetchJobsAndAssignments = async (clientId) => {
    setIsLoading(true);
    try {
      const [jobsResp, assignmentsResp] = await Promise.all([
        API.get(
          `api/get-provider-client-jobs/${clientId}?provider_id=${provider_id}`
        ),
        getProviderClientsAssignments(clientId, provider_id),
      ]);

      if (jobsResp?.data?.success) {
        setJobs(jobsResp.data.data);
      }

      if (assignmentsResp?.data?.success) {
        setAttachments(assignmentsResp.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [provider_id]);

  useEffect(() => {
    if (initialClientId) {
      fetchJobsAndAssignments(initialClientId);
      const selectedClient = clients.find(
        (client) => client.id === initialClientId
      );
      setSelectedClient(selectedClient);
    }
  }, [initialClientId, clients]);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSearchParams({ client: client?.id });
    fetchJobsAndAssignments(client?.id);
  };

  const handleDownload = async (file) => {
    try {
      await downloadHandlerFile(file);
    } catch (error) {
      console.error(error);
    }
  };
  const jobdetailHandler = (job) => {
    setSelectedJob(job);
  };
  const backHandler = () => {
    if (selectedJob) {
      setSelectedJob(null);
    } else {
      navigate(-1);
    }
  };
  return (
    <>
      {initialClientId !== 0 ? (
        <Grid
          mb={2}
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              fontSize: "20px",
              mx: 2,
              color: "text.black",
              fontWeight: 600,
            }}
          >
            {selectedJob ? "Travel Itinerary" : "Jobs"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={backHandler}
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
              boxShadow: "none",
              color: "text.btn_blue",
              textTransform: "inherit",
              py: 1,
              mr: 1,
              fontWeight: 400,
              "&:hover": {
                color: "#fff",
                boxShadow: "none",
                bgcolor: "background.btn_blue",
              },
            }}
          >
            <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
            {selectedJob ? "Back to jobs" : "Back to clients"}
          </Button>
        </Grid>
      ) : (
        <Typography
          sx={{
            fontSize: "21px",
            mb: 1,
            mx: 2,
            color: "text.black",
            fontWeight: 600,
          }}
        >
          Clients
        </Typography>
      )}
      <Grid container gap={2} px={1}>
        {isLoading ? (
          [1, 2, 3, 4, 4, 4, 4, 4].map((_, index) => (
            <Grid
              item
              xs={6}
              md={2.85}
              key={index}
              sx={{
                bgcolor: "background.paper",
                borderRadius: "10px",
                minHeight: "11.5rem",
                mt: 1,
                px: 2,
                boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .25)",
                },
              }}
            >
              <Skeleton width="100%" height="100%" />
            </Grid>
          ))
        ) : initialClientId === 0 ? (
          clients?.length === 0 ? (
            <NodataFoundCard title="No travel itinerary to show" />
          ) : (
            clients.map((client, index) => (
              <CommonFolder
                key={index}
                displayHandler={handleClientSelect}
                client={client}
                index={index}
              />
            ))
          )
        ) : selectedJob ? (
          <ProviderItineraryClients
            selectedJob={selectedJob}
            isLoading={isLoading}
            downloadHandler={handleDownload}
            attachment={attachments}
            selectedClient={selectedJob}
          />
        ) : jobs.length > 0 ? (
          jobs.map((job, index) => (
            <CommonFolder
              key={index}
              displayHandler={() => jobdetailHandler(job)}
              job={job}
              index={index}
            />
          ))
        ) : (
          <NodataFoundCard title="No jobs available for this client" />
        )}
      </Grid>
    </>
  );
};

export default ServiceProviderTravelItinerary;
