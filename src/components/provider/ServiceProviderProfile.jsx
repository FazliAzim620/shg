import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CardHeader,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Person,
  Work,
  Home,
  Email,
  Phone,
  School,
  Badge,
  LocationOn,
  MoreVert,
  Add,
} from "@mui/icons-material";
import CustomTypographyBold from "../CustomTypographyBold";
import { useSelector } from "react-redux";
import ServiceProviderProfileCard from "./ServiceProviderProfileCard";
import ServiceProviderJobsTable from "./ServiceProviderJobsTable";
import ProviderSpecialities from "./ProviderSpecialities";

const ServiceProviderProfile = ({ setValue }) => {
  const [alignment, setAlignment] = React.useState("all");
  const darkMode = useSelector((state) => state.theme.mode);
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const tab = [
    { label: "All Priviledges", value: "all" },
    { label: "Valid", value: "valid" },
    { label: "Expired", value: "expired" },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <ProviderSpecialities />
        <ServiceProviderProfileCard setValue={setValue} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
            borderRadius: ".6875rem  ",
          }}
        >
          <CardHeader
            sx={{ px: 2, py: 2.5, pr: 3 }}
            title={
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <CustomTypographyBold color="text.black" fontSize={"1.1rem"}>
                  Locum privileged locations
                </CustomTypographyBold>
                {/* <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment"
                  sx={{
                    bgcolor: darkMode === "light" ? "#F8FAFD" : "#1E2022",
                  }}
                >
                  {tab?.map((item, index) => (
                    <ToggleButton
                      key={index}
                      value={item.value}
                      aria-label="left aligned"
                      sx={{
                        border: "none",
                        outline: "none",
                        height: "2.5rem",
                        color: "lightgray",
                        textTransform: "none",
                        fontSize: ".8125rem",

                        minWidth: "5rem",
                        "&.Mui-selected": {
                          my: 0.2,
                          color: "text.black",
                          fontWeight: 400,
                          boxShadow:
                            darkMode === "light" &&
                            "0 .1875rem .375rem 0 rgba(140, 152, 164, .25)",
                          bgcolor:
                            darkMode === "light"
                              ? "background.paper"
                              : "#25282A",
                          // transform: "scale(1.01)",
                        },
                        "&.Mui-selected:hover": {
                          bgcolor: darkMode === "light" ? "white" : "black",
                        },
                      }}
                    >
                      {item.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup> */}
              </Box>
            }
          />
          <Divider sx={{ opacity: 0.4 }} />
          <ServiceProviderJobsTable />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ServiceProviderProfile;
