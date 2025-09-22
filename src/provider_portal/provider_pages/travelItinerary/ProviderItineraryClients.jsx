import { Box, Grid, Skeleton } from "@mui/material";
import { Download, SaveAltOutlined } from "@mui/icons-material";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import ProviderItineraryContent from "./ProviderItineraryContent";
const ProviderItineraryClients = ({
  selectedJob,
  isLoading,
  downloadHandler,
  attachment,
  selectedClient,
}) => {
  return (
    <>
      {isLoading ? (
        [1, 2].map((item, index) => (
          <Grid
            item
            xs={6}
            md={2.85}
            key={index}
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              minHeight: "14rem",
              mt: 1,
              px: 2,
              minWidth: "300px",
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
        <ProviderItineraryContent
          selectedJob={selectedJob}
          selectedClient={selectedClient}
        />
      )}
    </>
  );
};

export default ProviderItineraryClients;
