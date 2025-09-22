import React from "react";
import ProviderSettingsSideNavAndContent from "../../provider_components/settings/ProviderSettingsSideNavAndContent";
import { Box, Button, Divider, Tab, Typography } from "@mui/material";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
import PersonIcon from "@mui/icons-material/Person";
import { PROVIDER_ROUTES } from "../../../routes/Routes";
import { useNavigate } from "react-router-dom";
const ProviderSettings = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.page_bg", pb: 5 }}>
        <Box
          sx={{
            width: { sm: "100%", xl: "78%" },
            mx: "auto",
            minHeight: "71px",
            p: "2rem 0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <CustomTypographyBold
            color="text.black"
            weight={600}
            fontSize={" 1.41094rem"}
          >
            Settings
          </CustomTypographyBold>
          <Button
            startIcon={<PersonIcon />}
            variant="contained"
            color="primary"
            onClick={() => navigate(PROVIDER_ROUTES?.providerProfile)}
            sx={{
              mt: 2,
              textTransform: "capitalize",
              border: "1px solid #6d4a96",
              fontSize: "0.8125rem",
              backgroundColor: "#6d4a96",

              "&:hover": {
                color: "#fff",
                backgroundColor: "#6d4a96",
                fontSize: "0.8125rem",
                border: "1px solid #2c64cc",
                boxShadow: "0 4px 11px rgba(55, 125, 255, .35)",
                transition:
                  "boxShadow 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
              },
              py: 1.2,
            }}
          >
            My profile
          </Button>
        </Box>
        <Box
          sx={{
            mx: "auto",
            mt: 0.5,
            width: { sm: "100%", xl: "78%" },
          }}
        >
          <Divider sx={{ opacity: "0.3", mb: 5 }} />
          <ProviderSettingsSideNavAndContent />
        </Box>
      </Box>
    </>
  );
};
export default ProviderSettings;
