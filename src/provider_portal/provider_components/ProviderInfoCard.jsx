import React from "react";
import {
  PersonOutline,
  WorkOutlineOutlined,
  HomeOutlined,
  AlternateEmailOutlined,
  LocalPhoneOutlined,
  BookmarkAddedOutlined,
  PlaceOutlined,
  Edit,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
} from "@mui/material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const ProviderInfoCard = () => {
  const { loadingData, userData } = useSelector((state) => state.userInfo);

  return (
    <Card
      sx={{
        position: "sticky",
        top: 0,
        ml: 1,
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        borderRadius: ".6875rem  ",
      }}
    >
      <CardHeader
        sx={{ px: 2, py: 1.6 }}
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <CustomTypographyBold>My info</CustomTypographyBold>

            <Link
              to="/provider-settings"
              underline="none"
              style={{
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#6d4a96",
              }}
            >
              Edit
            </Link>
          </Box>
        }
      />
      <Divider />
      <CardContent sx={{}}>
        <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          ABOUT
        </CustomTypographyBold>
        <Box display="flex" alignItems="center" mb={1} mt={2}>
          <PersonOutline
            sx={{ mr: 1, color: "text.or_color", fontSize: "1rem" }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            Dr. {userData?.name}
          </CustomTypographyBold>
        </Box>
        <Box display="flex" alignItems="center" my={2}>
          <WorkOutlineOutlined
            sx={{ mr: 1, color: "text.or_color", fontSize: "1rem" }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            {userData?.provider_detail?.speciality?.name}
          </CustomTypographyBold>
        </Box>
        {/* <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          HOME ADDRESS
        </CustomTypographyBold> */}
        {/* <Box display="flex" alignItems="flex-start" my={2}>
          <HomeOutlined
            sx={{
              mr: 1,
              mt: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />

          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={2}
          >
            45 Roker Terrace, Latheronwheel KW5 8NW, London, UK
          </CustomTypographyBold>
        </Box> */}
        <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          CONTACTS
        </CustomTypographyBold>
        <Box display="flex" alignItems="center" mb={1} mt={2}>
          <AlternateEmailOutlined
            sx={{
              mr: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
            textTransform="lowercase"
          >
            {userData?.email}
          </CustomTypographyBold>
        </Box>
        <Box display="flex" alignItems="center" mb={3}>
          <LocalPhoneOutlined
            sx={{
              mr: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            {userData?.provider_detail?.phone}
          </CustomTypographyBold>
        </Box>
        <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          BOARD CERTIFICATIONS/ELIGIBILITY
        </CustomTypographyBold>
        <Box display="flex" alignItems="center" mb={1} mt={2}>
          <BookmarkAddedOutlined
            sx={{
              mr: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            {userData?.provider_detail?.board_certified == 1 &&
              " Board certified (BC)"}
          </CustomTypographyBold>
        </Box>
        <Box display="flex" alignItems="center" mb={1} mt={2}>
          <BookmarkAddedOutlined
            sx={{
              mr: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            {userData?.provider_detail?.board_eligible == 1 &&
              " Board eligible (BE)"}
          </CustomTypographyBold>
        </Box>
        <Box display="flex" alignItems="center">
          <PlaceOutlined
            sx={{
              mr: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={1.5}
          >
            {userData?.provider_detail?.license_state?.name}
          </CustomTypographyBold>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProviderInfoCard;
