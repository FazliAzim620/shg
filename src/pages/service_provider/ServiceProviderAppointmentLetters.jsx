import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getProviderClients,
  getProviderClientsAssignments,
} from "../../api_request";
import { useSelector } from "react-redux";
import { downloadHandlerFile } from "../../util";
import CommonFolder from "../../components/CommonFolder";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProviderAssignments from "../../provider_portal/provider_pages/assignmentLetters/ProviderAssignments";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";

const ServiceProviderAppointmentLetters = ({ provider_id }) => {
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.mode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClientId = parseInt(searchParams.get("client")) || 0;
  const [clients, setClients] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(initialClientId);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);

  const getClients = async () => {
    try {
      const resp = await getProviderClients(provider_id);
      if (resp?.data?.success) {
        setClients(resp?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const displayHandler = async (client) => {
    setSelectedClientId(client?.id);
    setIsLoadingAttachments(true);
    try {
      const resp = await getProviderClientsAssignments(client?.id, provider_id);
      if (resp?.data?.success) {
        setAttachments(resp?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAttachments(false);
    }
  };

  const downloadHandler = async (file) => {
    try {
      await downloadHandlerFile(file);
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return [1, 2, 3, 4].map((_, index) => (
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
          }}
        >
          <Skeleton width="100%" height={"100%"} />
        </Grid>
      ));
    }

    if (clients.length === 0) {
      return <NodataFoundCard title="No Appointments Letter To Show" />;
    }

    if (selectedClientId === 0) {
      return clients.map((client, index) => (
        <CommonFolder
          key={index}
          displayHandler={displayHandler}
          client={client}
          index={index}
        />
      ));
    }

    if (isLoadingAttachments) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Skeleton width="80%" height={200} />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: attachments.length >= 2 ? "start" : "space-between",
          gap: 2,
          flexWrap: "wrap",
          width: attachments?.length == 0 ? "100%" : "100%",
        }}
      >
        {attachments?.length > 0 ? (
          attachments?.map((attachment, index) => (
            <Box>
              <ProviderAssignments
                isLoading={isLoadingAttachments}
                downloadHandler={downloadHandler}
                attachment={attachment}
                key={index}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ width: "100%" }}>
            <NodataFoundCard title="No Attachments To Show" />
          </Box>
        )}
      </Box>
    );
  };
  const backHandler = () => {
    setSelectedClientId(0);
  };
  return (
    <>
      <Typography
        sx={{
          fontSize: "23px",
          mx: 2,
          color: "text.black",
          fontWeight: 600,
        }}
      >
        {selectedClientId !== 0 ? "" : "Clients"}
      </Typography>
      <Grid container gap={2} px={1}>
        {selectedClientId !== 0 && (
          <Grid item xs={12} sx={{ textAlign: "right" }}>
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
              {/* {selectedJob ? "Back to jobs" : "Back to client"} */}
              back to clients
            </Button>
          </Grid>
        )}
        {renderContent()}
      </Grid>
    </>
  );
};

export default ServiceProviderAppointmentLetters;
