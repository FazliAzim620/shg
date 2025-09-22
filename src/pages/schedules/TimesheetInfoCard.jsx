import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  Link,
  IconButton,
  CardHeader,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  ChevronRight as ChevronRightIcon,
  AlternateEmailOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { format } from "date-fns";

const TimesheetInfoCard = ({ data, job }) => {
  return (
    <Card
      sx={{
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        borderRadius: ".6875rem  ",
      }}
    >
      <CardHeader
        sx={{ px: 2, py: 2, pr: 3 }}
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <CustomTypographyBold color="text.black" fontSize={"1.1rem"}>
              Timesheet info
            </CustomTypographyBold>
          </Box>
        }
      />
      <Divider sx={{ opacity: 0.5, mb: 2 }} />
      <CardContent>
        <CustomTypographyBold color="text.black" fontSize={"0.875rem"}>
          Provider
        </CustomTypographyBold>
        <Box display="flex" alignItems="center" my={1}>
          <Avatar alt="Jeanie Landes" src="/path-to-image.jpg" />
          <Box ml={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "0.8rem", fontWeight: 400 }}
            >
              {data?.job?.name}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ ml: "auto" }}>
            <ChevronRightIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <AlternateEmailOutlined
            fontSize="small"
            sx={{
              mr: 1,
              color: "text.secondary",
              fontSize: "0.8rem",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {data?.job?.email}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <PhoneIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary", fontSize: "0.8rem" }}
          />
          <Typography variant="body2" color="text.secondary">
            {data?.job?.phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, opacity: 0.5 }} />
        <CustomTypographyBold color="text.black" fontSize={"0.875rem"}>
          Client
        </CustomTypographyBold>

        <Box display="flex" alignItems="center" my={1}>
          <BusinessIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary", fontSize: "0.8rem" }}
          />
          <CustomTypographyBold fontSize={"0.875rem"} weight={500}>
            {data?.job?.client_name}
          </CustomTypographyBold>

          {/* <IconButton size="small" sx={{ ml: "auto" }}>
            <ChevronRightIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton> */}
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <AlternateEmailOutlined
            fontSize="small"
            sx={{
              mr: 1,
              color: "text.secondary",
              fontSize: "0.8rem",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {data?.job?.client_email}
          </Typography>
        </Box>
        <Divider sx={{ my: 2, opacity: 0.5 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <CustomTypographyBold color="text.black" fontSize={"0.875rem"}>
            Job Confirmation
          </CustomTypographyBold>
          <CustomTypographyBold color="text.btn_blue" fontSize={"0.875rem"}>
            #{data?.job?.id}
          </CustomTypographyBold>
        </Box>
        <Box display="flex" alignItems="center">
          <WorkOutlineOutlined
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary", fontSize: "0.9rem" }}
          />
          <Typography variant="body2" color="text.secondary">
            {job?.speciality?.name || "--"}
          </Typography>
        </Box>
        <Divider sx={{ my: 2, opacity: 0.5 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomTypographyBold color="text.black" fontSize={"0.875rem"}>
            Timesheet date range
          </CustomTypographyBold>
        </Box>
        <Box display="flex" alignItems="center" pt={1.5}>
          <EventIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary", fontSize: "0.9rem" }}
          />
          <Typography variant="body2" color="text.secondary">
            {data?.start_date
              ? format(new Date(data?.start_date), "dd/MM/yyyy")
              : "--"}
            &nbsp;- &nbsp;
            {data?.end_date
              ? format(new Date(data?.end_date), "dd/MM/yyyy")
              : "--"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimesheetInfoCard;
