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
  School,
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
const ServiceProviderProfileCard = ({ setValue }) => {
  const providerDetails = useSelector(
    (state) => state.providerDetails?.provider
  );
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
        sx={{ pl: 2, pr: 0, py: 2 }}
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <CustomTypographyBold color="text.black">
              Profile
            </CustomTypographyBold>
            {/* <Button
              onClick={() => setValue(8)}
              size="small"
              color="primary"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Edit
            </Button> */}
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
            {providerDetails?.name}
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
            {providerDetails?.speciality?.name}
          </CustomTypographyBold>
        </Box>
        <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          HOME ADDRESS
        </CustomTypographyBold>
        <Box display="flex" alignItems="flex-start" mt={2} mb={1}>
          <HomeOutlined
            sx={{
              mr: 1,
              mt: 1,
              color: "text.or_color",
              fontSize: "1rem",
            }}
          />

          {providerDetails?.user ? (
            <CustomTypographyBold
              weight={400}
              fontSize={"0.875rem"}
              color={"text.black"}
              lineHeight={2}
            >
              {providerDetails?.user &&
              providerDetails?.user?.detail?.address_line_1
                ? providerDetails?.user?.detail?.address_line_1
                : providerDetails?.user?.detail?.address_line_2}
              ,{providerDetails?.user && providerDetails?.user?.detail?.city},
              {providerDetails?.user &&
                providerDetails?.user?.detail?.state?.name}
            </CustomTypographyBold>
          ) : (
            <CustomTypographyBold
              weight={400}
              fontSize={"0.875rem"}
              color={"text.black"}
              lineHeight={2}
            >
              --
            </CustomTypographyBold>
          )}
        </Box>
        <Box sx={{ ml: 3, mb: 2 }}>
          <CustomTypographyBold
            weight={400}
            fontSize={"0.875rem"}
            color={"text.black"}
            lineHeight={2}
          >
            {providerDetails?.user
              ? providerDetails?.user?.detail?.country?.name
              : "--"}
          </CustomTypographyBold>
        </Box>
        <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          CONTACTS
        </CustomTypographyBold>
        <Box display="flex" alignItems="center" mb={2} mt={2}>
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
            textTransform={"none"}
          >
            {providerDetails?.email}
          </CustomTypographyBold>
        </Box>
        <CustomTypographyBold
          weight={400}
          fontSize={"0.7rem"}
          color={"text.or_color"}
          lineHeight={1.5}
        >
          EDUCATION
        </CustomTypographyBold>
        <Box display="flex" alignItems="center" mb={2} mt={2}>
          <School
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
            textTransform={"none"}
          >
            --
          </CustomTypographyBold>
        </Box>
        {/* <Box display="flex" alignItems="center" mb={3}>
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
            {providerDetails?.phone}
          </CustomTypographyBold>
        </Box> */}
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
            {(providerDetails?.board_certified == 1 &&
              " Board certified (BC)") ||
              "--"}
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
            {(providerDetails?.board_eligible == 1 && " Board eligible (BE)") ||
              "--"}
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
            {providerDetails?.license_state?.name || "--"}
          </CustomTypographyBold>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderProfileCard;
