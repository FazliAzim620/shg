import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Grid,
  LinearProgress,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Flight,
  DirectionsCar,
  CalendarToday,
  MoreVert,
  AccessTime,
  WorkHistoryOutlined,
  ReceiptOutlined,
  FactCheckOutlined,
  AirplanemodeActiveOutlined,
  AttachMoneyOutlined,
  CallOutlined,
} from "@mui/icons-material";
import logo from "../assets/logos/logo-short.svg";
import logo_white from "../assets/logos-light/logo.svg";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useNavigate } from "react-router-dom";
import { PROVIDER_ROUTES } from "../../routes/Routes";
import { useDispatch } from "react-redux";
import { setCurrentJob } from "../../feature/providerPortal/currentJobSlice";
import { useSelector } from "react-redux";

const ProviderJobCard = ({ data }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const navigateHandler = (path) => {
    navigate(path);
    dispatch(setCurrentJob(data));
  };

  const DropdwonMenu = () => (
    <Menu
      sx={{
        mx: "auto",
      }}
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=1`);
        }}
      >
        <AccessTime sx={{ color: "text.or_color", fontSize: "1rem", mr: 1 }} />{" "}
        <CustomTypographyBold
          weight={400}
          fontSize={"0.875rem"}
          color={"text.black"}
          lineHeight={1.5}
        >
          Timesheets
        </CustomTypographyBold>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=2`);
        }}
      >
        <WorkHistoryOutlined
          sx={{ color: "text.or_color", fontSize: "1rem", mr: 1 }}
        />{" "}
        <CustomTypographyBold
          weight={400}
          fontSize={"0.875rem"}
          color={"text.black"}
          lineHeight={1.5}
        >
          Scheduling
        </CustomTypographyBold>
      </MenuItem>

      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=3`);
        }}
      >
        <FactCheckOutlined
          sx={{ color: "text.or_color", fontSize: "1rem", mr: 1 }}
        />

        <CustomTypographyBold
          weight={400}
          fontSize={"0.875rem"}
          color={"text.black"}
          lineHeight={1.5}
        >
          Assignment Letter
        </CustomTypographyBold>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=4`);
        }}
      >
        <AirplanemodeActiveOutlined
          sx={{ color: "text.or_color", fontSize: "1rem", mr: 1 }}
        />
        <CustomTypographyBold
          weight={400}
          fontSize={"0.875rem"}
          color={"text.black"}
          lineHeight={1.5}
        >
          Travel Itinerary
        </CustomTypographyBold>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=5`);
        }}
      >
        <ReceiptOutlined
          sx={{ color: "text.or_color", fontSize: "1rem", mr: 1 }}
        />

        <CustomTypographyBold
          weight={400}
          fontSize={"0.875rem"}
          color={"text.black"}
          lineHeight={1.5}
        >
          Invoices & Payments
        </CustomTypographyBold>
      </MenuItem>

      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=6`);
        }}
      >
        <CallOutlined
          sx={{ color: "text.or_color", fontSize: "1rem", mr: 1 }}
        />
        <CustomTypographyBold
          weight={400}
          fontSize={"0.875rem"}
          color={"text.black"}
          lineHeight={1.5}
        >
          Contacts
        </CustomTypographyBold>
      </MenuItem>
    </Menu>
  );

  const calculateProgress = (projectStartDate, projectEndDate) => {
    const start = new Date(projectStartDate);
    const end = new Date(projectEndDate);
    const today = new Date();
    // Total duration in milliseconds
    const totalDuration = end.getTime() - start.getTime();
    // Time elapsed since start in milliseconds
    const timeElapsed = today.getTime() - start.getTime();
    let percentage = (timeElapsed / totalDuration) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    return percentage;
  };
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        navigateHandler(`${PROVIDER_ROUTES.timeSheet}/${data?.id}`);
      }}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderRadius: ".75rem",
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        cursor: "pointer",
      }}
    >
      <Grid container>
        <Grid xs={1}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: 30, mx: 1 }}
          />
        </Grid>
        <Grid xs={11}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center">
              <Chip
                label={
                  data?.step_completed > 6 ? "Completed" : "Setup In progress"
                }
                size="small"
                sx={{
                  fontWeight: 600,
                  mr: 2,
                  bgcolor:
                    darkMode === "light" ? "#EBF2FF" : "background.black",
                  color: "text.main",
                  py: "1.1rem",
                  borderRadius: 1,
                }}
              />

              <CustomTypographyBold
                weight={400}
                fontSize={"0.875rem"}
                color={"text.or_color"}
                lineHeight={1.5}
              >
                Privilege status:
              </CustomTypographyBold>
              <Chip
                label="Valid"
                sx={{
                  bgcolor: "background.success",
                  color: "white",
                  borderRadius: 1,
                  ml: 1,
                  minHeight: "1rem",
                  height: "1.2rem",
                  fontSize: "0.75rem",
                  pb: -0.2,
                }}
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomTypographyBold
                weight={300}
                fontSize={"0.875rem"}
                color={"text.or_color"}
              >
                Hourly rate: ${data?.p_regular_hourly_rate}
              </CustomTypographyBold>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                ml={1}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateHandler(
                    `${PROVIDER_ROUTES.timeSheet}/${data?.id}?step=4`
                  );
                }}
              >
                {data?.itinerary?.plane_ticket && (
                  <Flight
                    fontSize="small"
                    sx={{
                      color: "#09A5BE",
                      fontSize: "1rem",
                      mr: 1,
                      opacity: 0.7,
                    }}
                  />
                )}
                {data?.itinerary?.car_rental && (
                  <DirectionsCar
                    fontSize="small"
                    sx={{
                      color: "#09A5BE",
                      fontSize: "1rem",
                      mr: 1,
                      opacity: 0.7,
                    }}
                  />
                )}
                {data?.itinerary?.hotel && (
                  <CalendarToday
                    fontSize="small"
                    sx={{
                      color: "#09A5BE",
                      fontSize: "1rem",
                      mr: 1,
                      opacity: 0.7,
                    }}
                  />
                )}
              </Stack>
              <IconButton
                size="small"
                sx={{ color: "text.or_color", fontSize: "1rem", ml: 4 }}
                onClick={handleClick}
              >
                <MoreVert fontSize="small" sx={{ fontSize: "1rem" }} />
              </IconButton>
              <DropdwonMenu />
            </Box>
          </Box>
          <CustomTypographyBold
            weight={600}
            fontSize={"1rem"}
            color={"text.black"}
          >
            {data?.client_name}
          </CustomTypographyBold>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              mb: 2,
              mt: 1,
            }}
          >
            <Typography variant="body2" gutterBottom>
              Specialties:
            </Typography>
            <Chip
              label={data?.speciality?.name}
              size="small"
              sx={{
                ml: 1,
                bgcolor: "rgba(113, 134, 157, .2)",
                borderRadius: 1,
                color: "text.black",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <CustomTypographyBold
              weight={400}
              fontSize={"0.75rem"}
              color={"text.or_color"}
            >
              Project start date:
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={500}
              fontSize={"0.751rem"}
              color={"text.black"}
            >
              {data?.project_start_date}
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={400}
              fontSize={"0.75rem"}
              color={"text.or_color"}
            >
              Privileges Valid:
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={500}
              fontSize={"0.751rem"}
              color={"text.black"}
            >
              {data?.privilege_start_date} - {data?.privilege_end_date}
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={400}
              fontSize={"0.875rem"}
              color={"text.or_color"}
            >
              Contract duration:
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={500}
              fontSize={"0.751rem"}
              color={"text.black"}
            >
              {data?.contract_duration}
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={400}
              fontSize={"0.875rem"}
              color={"text.or_color"}
            >
              Location:
            </CustomTypographyBold>
            {data?.addresses?.[0]?.country?.name ? (
              <CustomTypographyBold
                weight={500}
                fontSize={"0.751rem"}
                color={"text.black"}
              >
                {data?.addresses?.[0]?.country?.name}/{" "}
                {data?.addresses?.[0]?.state?.name}/{data?.addresses?.[0]?.city}
              </CustomTypographyBold>
            ) : (
              "--"
            )}
          </Box>
          <Box mt={2} mb={0.5}>
            <LinearProgress
              variant="determinate"
              value={calculateProgress(
                data?.project_start_date,
                data?.project_end_date
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProviderJobCard;
