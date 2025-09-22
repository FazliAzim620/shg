import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";
import API from "../../../../API";

const Overview = ({ setActiveTab, userId }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.login);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert compliance_requirements percentage string to a number
  const progress = complianceData?.compliance_requirements
    ? parseInt(complianceData.compliance_requirements.replace("%", ""))
    : 0;

  const handleOnboardingClick = () => {
    setActiveTab("Onboarding");
  };

  const handleFormClick = (deficiency, category) => {
    switch (category) {
      case "documents":
        setActiveTab("Documents");
        break;
      case "organization_documents":
        setActiveTab("Organization's Documents");
        break;
      case "references":
        setActiveTab("Reference Forms");
        break;
      case "forms":
        setActiveTab("Forms");
        break;
      case "professional_registration":
        setActiveTab("Documents"); // Adjust based on where this is handled
        break;
      case "background_check":
        setActiveTab("Documents"); // Adjust based on where this is handled
        break;
      default:
        setActiveTab("Documents");
        console.warn("Unknown category:", category);
        break;
    }
  };

  const Icons = () => (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 8.5C1 10.3565 1.7375 12.137 3.05025 13.4497C4.36301 14.7625 6.14348 15.5 8 15.5C9.85652 15.5 11.637 14.7625 12.9497 13.4497C14.2625 12.137 15 10.3565 15 8.5C15 6.64348 14.2625 4.86301 12.9497 3.55025C11.637 2.2375 9.85652 1.5 8 1.5C6.14348 1.5 4.36301 2.2375 3.05025 3.55025C1.7375 4.86301 1 6.64348 1 8.5ZM16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5ZM5.854 11.303C5.76025 11.3969 5.63304 11.4497 5.50035 11.4498C5.36767 11.4499 5.24039 11.3973 5.1465 11.3035C5.05261 11.2097 4.99982 11.0825 4.99972 10.9499C4.99963 10.8172 5.05225 10.6899 5.146 10.596L9.243 6.5H6.475C6.34239 6.5 6.21521 6.44732 6.12145 6.35355C6.02768 6.25979 5.975 6.13261 5.975 6C5.975 5.86739 6.02768 5.74021 6.12145 5.64645C6.21521 5.55268 6.34239 5.5 6.475 5.5H10.45C10.5826 5.5 10.7098 5.55268 10.8036 5.64645C10.8973 5.74021 10.95 5.86739 10.95 6V9.975C10.95 10.1076 10.8973 10.2348 10.8036 10.3286C10.7098 10.4223 10.5826 10.475 10.45 10.475C10.3174 10.475 10.1902 10.4223 10.0964 10.3286C10.0027 10.2348 9.95 10.1076 9.95 9.975V7.207L5.854 11.303Z"
        fill="#6D4A96"
      />
    </svg>
  );

  const getOverviewHandler = async () => {
    try {
      const resp = await API.get(
        `/api/admin/credentialing/get-provider-compliance/${
          userId ? userId : user?.user?.user?.id
        }`
      );
      if (resp?.data?.success) {
        setComplianceData(resp?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOverviewHandler();
  }, []);

  // Combine deficiencies from all categories
  const deficienciesList = complianceData
    ? Object.entries(complianceData.detailed_data)
        .filter(([key]) =>
          [
            "documents",
            "organization_documents",
            "references",
            "forms",
            "professional_registration",
            "background_check",
          ].includes(key)
        )
        .flatMap(([category, data]) =>
          data.deficiencies.map((deficiency) => ({
            ...deficiency,
            category,
          }))
        )
    : [];

  return (
    <Box sx={{ mx: "auto", bgcolor: "#F0F2F5" }}>
      {/* Onboarding Progress Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "8px",
          border: "1px solid rgba(231, 234, 243, 0.7)",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: "20px", mb: "10px" }}
        >
          Onboarding
        </Typography>

        {loading ? (
          <>
            <Skeleton
              variant="rectangular"
              height={10}
              sx={{ borderRadius: 5, mb: 2 }}
            />
            <Skeleton variant="rounded" width={160} height={36} />
          </>
        ) : (
          <>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                borderRadius: 5,
                mb: 2,
                "& .MuiLinearProgress-bar": { backgroundColor: "#6750A4" },
                backgroundColor: "#E6E0E9",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: userId ? "right" : "space-between",
                alignItems: "center",
              }}
            >
              {userId ? null : (
                <Button
                  variant="contained"
                  onClick={handleOnboardingClick}
                  endIcon={<Icons />}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#F7F2FA",
                    boxShadow: "none",
                    color: "#6750A4",
                    "&:hover": {
                      boxShadow: "none",
                      bgcolor: "#E6E0E9",
                    },
                  }}
                >
                  Complete onboarding
                </Button>
              )}
              <Typography variant="body2" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {/* Remaining Submissions Section */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: "8px",
          border: "1px solid rgba(231, 234, 243, 0.7)",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: "20px", mb: "10px" }}
        >
          Remaining submissions
        </Typography>

        <List sx={{ width: "100%" }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Card
                key={idx}
                sx={{
                  mb: 2,
                  borderRadius: "8px",
                  p: 2,
                  border: "1px solid rgba(228, 231, 236, 1)",
                  boxShadow: "none",
                }}
              >
                <Skeleton variant="text" height={24} width="60%" />
                <Skeleton variant="text" height={20} width="40%" />
              </Card>
            ))
          ) : deficienciesList.length > 0 ? (
            deficienciesList.map((item, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: "8px",
                  p: 0,
                  border: "1px solid rgba(228, 231, 236, 1)",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  boxShadow: "none",
                }}
                onClick={() => handleFormClick(item, item.category)}
              >
                <CardContent sx={{ px: 2, "&:last-child": { py: 1 } }}>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {/* Your SVG icon here or remove if unnecessary */}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "text.black",
                          }}
                        >
                          {item?.name ||
                            item?.form_name ||
                            "Unnamed Deficiency"}
                        </Typography>
                      }
                      secondary={
                        item?.updated_at ? (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "rgba(103, 119, 136, 1)",
                            }}
                          >
                            Updated{" "}
                            {new Date(item?.updated_at).toLocaleDateString()}
                          </Typography>
                        ) : null
                      }
                    />
                  </ListItem>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No remaining submissions.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Overview;
