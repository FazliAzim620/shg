// ServiceProviderTimesheets.jsx
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { getProviderClients } from "../../api_request";
import MyJobs from "../../provider_portal/provider_pages/myTimeSheets/MyJobs";
import { useSelector } from "react-redux";
import CommonFolder from "../../components/CommonFolder";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
const ServiceProviderTimesheets = ({ provider_id }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentJob } = useSelector((state) => state.currentJob);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialclient = parseInt(searchParams.get("client")) || 0;
  const selectedjobid = parseInt(searchParams.get("job"));
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      const resp = await getProviderClients(provider_id);
      if (resp?.data?.success) {
        setClients(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    updateBreadcrumbs();
  }, [initialclient, selectedjobid]);

  const updateBreadcrumbs = () => {
    let newBreadcrumbs = [
      { text: "My Timesheets", href: "/provider-my-timesheet" },
    ];

    if (initialclient) {
      const client = clients.find((c) => c.id === initialclient);
      newBreadcrumbs.push({
        text: client ? client.name : currentJob?.client_name,
        href: `/provider-my-timesheet?client=${initialclient}`,
      });

      if (selectedjobid) {
        newBreadcrumbs.push({
          text: `Job ${selectedjobid}`,
          href: `/provider-my-timesheet?client=${initialclient}&job=${selectedjobid}`,
        });
      }
    }
    setBreadcrumbs(newBreadcrumbs);
  };

  const displayHandler = async (client) => {
    navigate(`/service-provider-details/${provider_id}/6?client=${client.id}`);
  };

  const handleBreadcrumbClick = (event, item) => {
    event.preventDefault();
    navigate(item.href);
  };
  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg", pl: 1 }}>
      {initialclient !== 0 ? (
        <Grid
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
            {selectedjobid ? "" : "Jobs"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
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
            {selectedjobid ? "Back to jobs" : "Back to clients"}
          </Button>
        </Grid>
      ) : (
        <Typography
          sx={{
            fontSize: "20px",
            mx: 2,
            color: "text.black",
            fontWeight: 600,
          }}
        >
          Clients
        </Typography>
      )}
      <Grid
        container
        // spacing={2}
        mt={4}
        justifyContent="start"
        gap={2}
        px={1}
      >
        {/* --------------------------------------------------------------------------- clients */}
        {initialclient == 0 ? (
          isLoading ? (
            [1, 2, 3, 4, 4, 4, 4, 4].map((item, index) => (
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
                    bgcolor: "background.paper",
                  },
                }}
              >
                <Skeleton
                  width="100%"
                  height={"100%"}
                  // sx={{ marginTop: "30px" }}
                />
              </Grid>
            ))
          ) : clients?.length === 0 ? (
            <NodataFoundCard title="No Timesheets To Show" />
          ) : (
            clients?.map((client, index) => {
              return (
                <CommonFolder
                  key={index}
                  displayHandler={displayHandler}
                  client={client}
                  index={index}
                />
              );
            })
          )
        ) : (
          <MyJobs setItems={setBreadcrumbs} serviceProvider={provider_id} />
        )}
      </Grid>
    </Box>
  );
};

export default ServiceProviderTimesheets;
