import React, { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  Link,
  Chip,
  Button,
  Divider,
  Paper,
} from "@mui/material";
import {
  Link as RouterLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Circle,
  KeyboardBackspaceOutlined,
  SaveAlt,
  Send,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import { PROVIDER_ROUTES } from "../../../../routes/Routes";
import TimesheetTable from "../../../provider_components/TimesheetTable";
import PdfButton from "../../../provider_components/PdfButton";
import API from "../../../../API";
import { useDispatch } from "react-redux";
import TimeSummaryModal from "./TimeSummaryModal";
const ProviderTimeSheetDetail = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWeek = parseInt(searchParams.get("week"));
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.mode);
  const { week, allWeeks, currentJob, submitted } = useSelector(
    (state) => state.currentJob
  );
  const filterWeek = allWeeks?.find((cw) => cw?.id === initialWeek);
  const isMyTimesheet = sessionStorage.getItem("mytimesheet");
  const items = [
    {
      text: isMyTimesheet ? "My Timesheets" : "My jobs",
      href: isMyTimesheet ? "/provider-my-timesheet" : "/",
    },
    {
      text: `${currentJob?.client_name}`,
      href: isMyTimesheet
        ? `/provider-my-timesheet?client=${currentJob?.client_id}&job=${currentJob?.id}`
        : `${PROVIDER_ROUTES.timeSheet}/${currentJob?.id}`,
    },
    { text: `Timesheet No# ${week?.id || filterWeek?.id}` },
  ];

  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <Box
        sx={{
          minHeight: "100vh",
          overflowX: "hidden",
          width: { sm: "100%", xl: "78%" },
          m: "0 auto",
        }}
      >
        {/* ------------------------------------------------------------ tab section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minHeight: "71px", p: "1rem 0.5rem", mb: 2 }}>
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
            <Box sx={{ mt: 1.2, display: "flex", alignItems: "center" }}>
              <CustomTypographyBold
                color="text.black"
                weight={600}
                fontSize={" 1.3rem"}
              >
                Timesheet #{week?.id || filterWeek?.id}
              </CustomTypographyBold>
              <Chip
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "background.success",
                        // bgcolor: "background.success",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Circle sx={{ fontSize: 12 }} /> In progress
                    </Typography>
                  </Box>
                }
                size="small"
                sx={{
                  ml: 0.5,
                  bgcolor: "rgba(0, 201, 167, .1)",
                  color: "#666",
                  py: "0.5rem",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6 ",
              boxShadow: "none",
              color: "text.main",
              textTransform: "inherit",
              mr: 3,
              "&:hover": {
                color: "#fff",
                boxShadow: "none",
              },
            }}
          >
            <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1.5rem" }} />
            Back to my jobs
          </Button>
        </Box>
        <Divider sx={{ opacity: 0.3 }} />
        {/* ------------------------------------------------------------ tab section end */}
        <Grid container spacing={2.5} sx={{ pr: 1.5, mt: 2 }}>
          <Grid
            item
            xs={12}
            md={9.4}
            xl={9.8}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TimesheetTable />
          </Grid>
          <Grid item xs={12} md={2.5} ml={1} xl={2.1}>
            <TimesheetActions />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProviderTimeSheetDetail;
const TimesheetActions = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWeek = parseInt(searchParams.get("week"));
  const { allWeeks, submitted } = useSelector((state) => state.currentJob);
  const cw = allWeeks?.find((week) => week?.id === initialWeek);

  const timesheetSummaryHandler = async () => {
    setOpen(true);
  };

  return (
    <Box sx={{ bgcolor: "transparent", boxShadow: "none" }}>
      <TimeSummaryModal
        open={open}
        handleClose={() => setOpen(false)}
        weekData={cw}
      />
      <Button
        onClick={timesheetSummaryHandler}
        disabled={
          (cw?.status !== null || initialWeek === submitted) &&
          cw?.status !== "resubmission_required"
        }
        variant="contained"
        fullWidth
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
          textTransform: "none",
          boxShadow: "none",
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: 1.5,
          borderRadius: "5px",
          p: ".6125rem 1rem;",
          "&:hover": {
            boxShadow: "0 2px 7px rgba(55, 125, 255, .35)",
          },
        }}
      >
        <Send sx={{ rotate: "-30deg", fontSize: "1rem", mt: -0.4, mr: 0.5 }} />{" "}
        Send timesheet
      </Button>
      <PdfButton>
        <Button
          fullWidth
          size="small"
          variant="text"
          sx={{
            textTransform: "capitalize",
            color: "text.or_color",
            fontSize: "0.8125rem",
            fontWeight: 400,
            border: "1px solid rgba(99, 99, 99, 0.1)",
            p: ".5125rem 1rem;",
            minWidth: 0,
            borderRadius: "5px",
            my: 1,
            bgcolor: "background.paper",
            "&:hover": {
              boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",
              bgcolor: "background.paper",
              transform: "scale(1.01)",
              color: "text.main",
            },
            "&:focus": {
              outline: "none",
            },
          }}
          onClick={() =>
            detailHandler(
              `${PROVIDER_ROUTES.timeSheetDetail}/${currentJob?.id}`
            )
          }
        >
          <SaveAlt sx={{ fontSize: "1rem", color: "text.or_color" }} /> Download
        </Button>
      </PdfButton>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mt: 1,
        }}
      >
        <PdfButton>
          <Button
            fullWidth
            size="small"
            variant="text"
            sx={{
              textTransform: "capitalize",
              color: "text.or_color",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.1)",
              p: ".5125rem 1rem;",
              minWidth: 0,
              borderRadius: "5px",

              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",
                bgcolor: "background.paper",
                transform: "scale(1.01)",
                color: "text.main",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Preview
          </Button>
        </PdfButton>
        <PdfButton>
          <Button
            fullWidth
            size="small"
            variant="text"
            sx={{
              textTransform: "capitalize",
              color: "text.or_color",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.1)",
              p: ".5125rem 1rem;",
              minWidth: 0,
              borderRadius: "5px",
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "0 3px 6px -2px rgba(140, 152, 164, .25)",
                bgcolor: "background.paper",
                transform: "scale(1.01)",
                color: "text.main",
              },
              "&:focus": {
                outline: "none",
              },
            }}
            onClick={() =>
              detailHandler(
                `${PROVIDER_ROUTES.timeSheetDetail}/${currentJob?.id}`
              )
            }
          >
            Save
          </Button>
        </PdfButton>
      </Box>
    </Box>
  );
};
