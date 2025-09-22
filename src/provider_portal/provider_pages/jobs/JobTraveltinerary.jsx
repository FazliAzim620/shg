import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Flight,
  DirectionsCar,
  MoreVert,
  SaveAltOutlined,
  LocalPrintshopOutlined,
  LocalHotelOutlined,
} from "@mui/icons-material";
import Airline from "./Airline";
import { downloadHandlerFile } from "../../../util";
import { useSelector } from "react-redux";
import Carrental from "./Carrental";
import Hotel from "./Hotel";

const JobTravelItinerary = () => {
  const { createdItinerary } = useSelector((state) => state.travel);
  const { bookings, status } = useSelector((state) => state.hotel);
  const { carBookings } = useSelector((state) => state.carRental);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadHandler = () => {
    if (selectedTab == 0) {
      downloadHandlerFile(createdItinerary?.attachment);
    }
    if (selectedTab == 1) {
      if (bookings?.[0]?.attachment) {
        downloadHandlerFile(bookings?.[0]?.attachment);
      }
    }
    if (selectedTab == 2) {
      if (carBookings?.[0]?.attachment) {
        downloadHandlerFile(carBookings?.[0]?.attachment);
      }
    }

    handleClose();
  };

  return (
    <>
      <Card
        sx={{
          minHeight: "240px",
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
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="travel itinerary tabs"
                sx={{
                  minHeight: "unset",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                  },
                  "& .MuiTab-root": {
                    minHeight: "unset",
                    padding: "0.5rem",
                    textTransform: "none",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .Mui-selected": {
                    color: "primary.main",
                  },
                }}
              >
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      <Flight sx={{ marginRight: 1 }} /> Airline
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      <LocalHotelOutlined sx={{ marginRight: 1 }} /> Hotel &
                      Stays
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "0.75rem",
                      }}
                    >
                      <DirectionsCar sx={{ marginRight: 1 }} /> Car Renting
                    </Box>
                  }
                />
              </Tabs>
              {/* <IconButton
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreVert sx={{ fontSize: "1rem", color: "text.or_color" }} />
              </IconButton> */}

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={downloadHandler}>
                  <SaveAltOutlined
                    sx={{ fontSize: "1rem", color: "text.or_color" }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.75rem", color: "text.black", pl: 1 }}
                  >
                    Download
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <LocalPrintshopOutlined
                    sx={{ fontSize: "1rem", color: "text.or_color" }}
                  />{" "}
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.75rem", color: "text.black", pl: 1 }}
                  >
                    Print
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          }
        />
        <CardContent sx={{ p: 2, mt: 0.5 }}>
          {selectedTab === 0 && <Airline />}
          {selectedTab === 1 && <Hotel />}
          {selectedTab === 2 && <Carrental />}
        </CardContent>
      </Card>
    </>
  );
};

export default JobTravelItinerary;
