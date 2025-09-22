import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Skeleton,
} from "@mui/material";
import { HeadingCommon } from "../../../provider_portal/provider_components/settings/profile/HeadingCommon";
import { Close, SaveAltOutlined } from "@mui/icons-material";
import AvatarNameEmail from "../../common/AvatarNameEmail";
import Attachments from "./Attachments";
import JobApplicationActivity from "./JobApplicationActivity";
import DividerWithStartText from "../../common/DividerWithStartText";
import API from "../../../API";
import CustomChip from "../../CustomChip";
import { useSelector } from "react-redux";
const ViewApplicantDetails = ({
  open,
  onClose,
  details,
  updateStatusHandler,
}) => {
  const [logData, setLogData] = useState([]);
  const mode = useSelector((state) => state.theme.mode);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const getApplicantDetails = async () => {
    setIsDataLoading(true);
    try {
      const resp = await API.get(`/api/applicant/${details?.id}/activity-log`);
      if (resp?.data?.success) {
        setLogData(resp?.data?.data);
        setIsDataLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsDataLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      getApplicantDetails();
    }
  }, [open]);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          display: "flex",
          flexDirection: "column",
          minWidth: "1024px",
          maxWidth: "1024px",
          height: "100%",
          backgroundColor: mode === "dark" ? "#1e2022" : "paper",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: mode === "dark" ? "#1e2022" : "#fff",
          borderBottom: `1px solid ${
            mode === "dark" ? "rgba(252, 252, 252, 0.5)" : "rgba(0, 0, 0, 0.1)"
          }`,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.14844rem",

            fontWeight: 600,
            lineHeight: 1.2,
            color: mode === "dark" ? "#fff" : "#1e2022",
            textTransform: "inherit",
            display: "flex",
            gap: "1rem",
          }}
        >
          Applicant profile & activity log
          <CustomChip
            dot={true}
            dropdown={true}
            dotColor={
              details?.status === "shortlisted"
                ? "#00c9a7"
                : details?.status === "applied"
                ? "rgba(255, 193, 7, 1)"
                : details?.status === "rejected"
                ? "rgba(237, 76, 120, 1)"
                : details?.status === "hired"
                ? "#00c9a7"
                : details?.status === "interviewed"
                ? "rgba(255, 193, 7, 1)"
                : details?.status === "contacted"
                ? "rgba(255, 193, 7, 1)"
                : "rgba(255, 193, 7, 1)"
            }
            color={mode == "dark" ? "#fff" : "rgba(103, 119, 136, 1)"}
            bgcolor={
              details?.status === "shortlisted"
                ? "rgba(0, 201, 167, 0.1)"
                : details?.status === "applied"
                ? "rgba(255, 193, 7, 0.1)"
                : details?.status === "rejected"
                ? "rgba(237, 76, 120, 0.1)"
                : details?.status === "hired"
                ? "#00c9a7"
                : details?.status === "interviewed"
                ? "rgba(255, 193, 7, 0.1)"
                : details?.status === "contacted"
                ? "rgba(255, 193, 7, 0.1)"
                : "#eedfe4"
            }
            chipText={
              details?.status === "applied" ? "Pending" : details?.status
            }
            textTransform={"capitalize"}
            weight={400}
          />
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      {/*============================= activity and applicant flex ======================== */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          bgcolor: mode === "dark" ? "#1e2022" : "paper",
        }}
      >
        <Box
          sx={{
            width: "50%",
            mt: 2,
            px: "24px",
            borderRight: `1px solid ${
              mode === "dark" ? "rgba(252, 252, 252, 0.2)" : "dee2e6"
            }`,
          }}
        >
          <HeadingCommon fontSize={"18px"} title={"Activity log"} />
          {isDataLoading ? (
            <Box>
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: "30%" }}
              />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", height: "2rem" }}
              />
            </Box>
          ) : (
            <JobApplicationActivity logData={logData} />
          )}
        </Box>
        <Box
          sx={{
            pt: 2,
            px: 3,
            flexGrow: 1,
            overflowY: "auto",
            width: "50%",
          }}
        >
          <HeadingCommon fontSize={"18px"} title={"Profile"} />
          {/* ===============applicant and contact button==================== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <AvatarNameEmail username={details?.name} email={details?.email} />
            <Button
              sx={{
                bgcolor: "background.paper",
                color: mode === "dark" ? "#fff" : "#6C757D",
                border: "1px solid #D3D6DA",
                boxShadow: "none",
                textTransform: "none",
                "&:hover": {
                  color: "#6C757D",
                  bgcolor: "background.paper",
                  border: "1px solid #D3D6DA",
                  boxShadow: "0 4px 11px #D3D6DA",
                  transition:
                    "boxShadow 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                },
              }}
              variant="contained"
              onClick={() =>
                (window.location.href = `mailto:${details?.email}`)
              }
            >
              Contact
            </Button>
          </Box>
          {[
            { label: "Location", value: details?.location },
            { label: "Apply date", value: details?.created_at?.split("T")[0] },
            { label: "Experience", value: details?.experience },
            { label: "Phone", value: details?.phone_number },
            // { label: "Hourly rate", value: "$100" },
            {
              label: "Qualification",
              value: details?.qualification,
              chip: true,
            },
          ]?.map((curr, ind) => (
            <Box
              key={ind}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3.2,
                m: 1.2,
              }}
            >
              <Typography
                sx={{
                  color: mode === "dark" ? "#fff" : "#667085",
                  fontWeight: 400,
                  fontSize: "14px",
                  minWidth: "120px",
                }}
              >
                {curr?.label}:{" "}
              </Typography>
              {curr?.chip ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Box
                      sx={{
                        px: 1, // Adjusting padding to make it look more like a pill
                        height: "25px", // You can adjust this height for the pill’s size
                        color: "#377DFF",
                        fontWeight: 500,
                        bgcolor: mode === "dark" ? "#1e2022" : "#E4EBFA",
                        borderRadius: { xs: "10px", xl: "40px" }, // Ensure it's large enough to create a rounded pill shape
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        textTransform={"capitalize"}
                      >
                        {curr?.value}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography
                  sx={{
                    color: mode === "dark" ? "#fff" : "#344054",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {curr.value || "--"}
                </Typography>
              )}
            </Box>
          ))}
          {/* =============== cover letter ==================== */}
          {details?.cover_letter ? (
            <Box>
              <DividerWithStartText
                text="Cover letter"
                my={"20px"}
                color={mode === "dark" ? "#fff" : "#1e2022"}
                fontSize={"16px"}
                // darkMode={darkMode}
                textCol={4}
                dividerCol={8}
              />
              <Typography
                sx={{
                  color: "#495057",
                  textAlign: "left",
                  fontSize: "16px",
                  mb: 3,
                }}
              >
                {details?.cover_letter || "--"}
              </Typography>{" "}
            </Box>
          ) : null}
          {/* =============== attachment==================== */}
          <DividerWithStartText
            my={"20px"}
            text="Attachment"
            color={mode === "dark" ? "#fff" : "#1e2022"}
            fontSize={"16px"}
            // darkMode={darkMode}
            textCol={2.9}
            dividerCol={9.1}
          />
          <Attachments
            applicantAttachment={details?.resume}
            mode={mode === "dark"}
          />
        </Box>
      </Box>
      {/* Footer */}
      <Box
        sx={{
          mt: 2,
          py: 2,
          px: 3,
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          backgroundColor: mode === "dark" ? "#1e2022" : "white",
          borderTop: `1px solid ${
            mode === "dark" ? "rgba(252, 252, 252, 0.5)" : "rgba(0, 0, 0, 0.1)"
          }`,
          textAlign: "left",
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ textTransform: "none", px: 4, mr: 1 }}
        >
          Close
        </Button>

        {/* <Button
          variant="contained"
          color="error"
          // onClick={onClose}
          sx={{ textTransform: "none", px: 4, mr: 1 }}
          onClick={() => {
            updateStatusHandler("rejected", details?.id);
          }}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            updateStatusHandler("shortlisted", details?.id);
          }}
          sx={{ textTransform: "none", px: 4 }}
        >
          Shortlist
        </Button> */}
      </Box>
    </Drawer>
  );
};

export default ViewApplicantDetails;
