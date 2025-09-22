import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  Link,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FolderCopyOutlined,
  KeyboardBackspaceOutlined,
} from "@mui/icons-material";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import { getProviderClients } from "../../../api_request";
import MyJobs from "./MyJobs";
import { useSelector } from "react-redux";
import folder from "../../../assets/folder.svg";
import CommonFolder from "../../../components/CommonFolder";
import TimesheetSuccessPage from "../jobs/timesheet/TimesheetSuccessPage";
import ViewTimesheet from "../jobs/timesheet/ViewTimesheet";
const MyTimeSheets = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentJob } = useSelector((state) => state.currentJob);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialclient = parseInt(searchParams.get("client")) || 0;
  const submitted = searchParams.get("submitted");
  const review = searchParams.get("review");
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
    navigate(`/provider-my-timesheet?client=${client.id}`);
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
  if (review) {
    return <ViewTimesheet />;
  }
  if (submitted)
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
          <TimesheetSuccessPage />
        </Box>
      </Box>
    );

  return (
    <Box
      sx={{
        overflowX: "hidden",
        bgcolor: "background.page_bg",
        pt: 2,
        pl: 1,
        pb: 6,
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
          {breadcrumbs.map((item, index) => {
            if (index === breadcrumbs.length - 1) {
              return (
                <Typography
                  key={item.text}
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
                to={item.href}
                key={item.text}
                underline="hover"
                onClick={(e) => handleBreadcrumbClick(e, item)}
                sx={{
                  color: "text.or_color",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  "&:hover": { color: "text.link" },
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
          }}
        >
          {initialclient ? (
            <CustomTypographyBold
              color="text.black"
              weight={600}
              fontSize={" 1.3rem"}
            >
              My Jobs
            </CustomTypographyBold>
          ) : (
            <CustomTypographyBold
              color="text.black"
              weight={600}
              fontSize={" 1.3rem"}
            >
              My Timesheets
            </CustomTypographyBold>
          )}
          {breadcrumbs?.length > 1 && (
            <Button
              onClick={() => {
                setSearchParams({ client: 0 });
                setBreadcrumbs([
                  {
                    text: "My Timesheets",
                    href: "/provider-my-timesheet",
                  },
                ]);
              }}
              variant="contained"
              sx={{
                bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6 ",
                boxShadow: "none",
                color: "text.main",
                textTransform: "inherit",
                fontWeight: 400,
                mr: 3,
                "&:hover": {
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
            >
              <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
              Back to my timesheet
            </Button>
          )}
        </Box>
        {/* ------------------------------------------------------------ tab section */}
        {breadcrumbs?.length > 2 && (
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: value === 0 ? 500 : 400,
                    color: value === 0 && "text.main",
                  }}
                >
                  Reqular Timesheets
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    fontWeight: value === 1 ? 500 : 400,
                    color: value === 1 && "text.main",
                  }}
                >
                  On-Call Timesheets
                </Typography>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        )}
        <Divider sx={{ opacity: "0.3", mt: !selectedjobid && 3 }} />
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
            <MyJobs setItems={setBreadcrumbs} />
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default MyTimeSheets;
