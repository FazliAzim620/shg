import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import { PROVIDER_ROUTES } from "../../../routes/Routes";

import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { FolderOutlined, KeyboardBackspaceOutlined } from "@mui/icons-material";
import {
  getProviderClients,
  getProviderClientsAssignments,
} from "../../../api_request";
import ProviderItineraryClients from "./ProviderItineraryClients";
import { useSelector } from "react-redux";
import { downloadHandlerFile } from "../../../util";
import CommonFolder from "../../../components/CommonFolder";
const TravelItinerary = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialclient = parseInt(searchParams.get("client")) || 0;
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([
    { text: "Travel Itinerary", href: "/provider-travel-Itinerary" },
  ]);
  const getClients = async () => {
    try {
      setIsLoading(true);
      const resp = await getProviderClients();
      if (resp?.data?.success) {
        setClients(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const displayHandler = async (client) => {
    localStorage.setItem("current_client", JSON.stringify(client));
    setSelectedClient(client);
    setItems([
      { text: "Travel Itinerary", href: "/provider-travel-Itinerary" },
      { text: client?.name },
    ]);

    try {
      setSearchParams({ client: client?.id });
      const resp = await getProviderClientsAssignments(client?.id);
      if (resp?.data?.success) {
        setAttachments(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const downloadHandler = async (file) => {
    try {
      const resp = await downloadHandlerFile(file);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getClients();
    const curClient = localStorage.getItem("current_client");
    if (curClient) {
      displayHandler(JSON.parse(curClient));
    }
  }, []);

  return (
    <Box
      sx={{
        overflowX: "hidden",
        bgcolor: "background.page_bg",
        pt: 2,
        pl: 1,
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
        <Breadcrumbs aria-label="breadcrumb">
          {items.map((item, index) => {
            if (index === items.length - 1) {
              return (
                <Typography
                  key={item.text}
                  // color="text.primary"
                  sx={{
                    color: "text.black",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    pt: 0.2,
                  }}
                >
                  {item.text}
                </Typography>
              );
            }
            return (
              <Link
                component={RouterLink}
                onClick={() =>
                  setItems([
                    {
                      text: "Travel Itinerary",
                      href: "/provider-travel-Itinerary",
                    },
                  ])
                }
                to={item.href}
                key={item.text}
                underline="hover"
                sx={{
                  color: "text.or_color",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  "&:hover": {
                    color: "text.link",
                  },
                }}
              >
                {item.text}
              </Link>
            );
          })}
        </Breadcrumbs>
        <Box
          sx={{
            mt: 1.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: "2rem",
          }}
        >
          <CustomTypographyBold
            color="text.black"
            weight={600}
            fontSize={" 1.3rem"}
          >
            Travel Itinerary
          </CustomTypographyBold>
          {items?.length > 1 && (
            <Button
              onClick={() => {
                setSearchParams({ client: 0 });
                setItems([
                  {
                    text: "Travel Itinerary",
                    href: "/provider-travel-Itinerary",
                  },
                ]);
              }}
              variant="contained"
              sx={{
                bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6 ",
                boxShadow: "none",
                color: "text.main",
                textTransform: "inherit",
                mr: 3,
                fontWeight: 300,
                "&:hover": {
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
            >
              <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
              Back to travel itinerary
            </Button>
          )}
        </Box>
        {/* ------------------------------------------------------------ tab section */}

        <Divider sx={{ opacity: "0.3" }} />
        {/* ------------------------------------------------------------ tab section end */}
        <Typography
          sx={{
            my: 1.5,
            mx: 2,
            fontWeight: 600,
          }}
        >
          {initialclient == 0 && "Clients"}
        </Typography>
        <Grid
          container
          // justifyContent={
          //   clients?.length > 2 && clients?.length < 4
          //     ? "space-between"
          //     : "start"
          justifyContent={"start"}
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
            <ProviderItineraryClients
              isLoading={isLoading}
              downloadHandler={downloadHandler}
              attachment={attachments}
              selectedClient={selectedClient}
            />
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default TravelItinerary;
