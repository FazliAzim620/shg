import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { Download, SaveAltOutlined } from "@mui/icons-material";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import { createdDateToformatDate } from "../../../util";
import CustomTypographyBold from "../../../components/CustomTypographyBold";
const ProviderAssignments = ({ downloadHandler, attachment }) => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          bgcolor: "background.paper",
          minWidth: "15rem",
          minHeight: "15rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 1,
          borderRadius: "10px",
        }}
      >
        <Box
          component="img"
          src={pdfIcon}
          alt="PDF"
          sx={{ width: "6rem", objectFit: "contain" }}
        />
        <SaveAltOutlined
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            fontSize: 30,
            color: "white",
            backgroundColor: "primary.main",
            borderRadius: ".3125rem",
            padding: "8px",
            cursor: "pointer",
          }}
          onClick={() => downloadHandler(attachment?.file_name)}
        />
        <Box pt={1}>
          <CustomTypographyBold
            textAlign={"center"}
            fontSize={"0.75rem"}
            color={"text.or_color"}
            weight={300}
          >
            {createdDateToformatDate(attachment?.created_at)}
          </CustomTypographyBold>
          <CustomTypographyBold textAlign={"center"}>
            {attachment?.file_name}
          </CustomTypographyBold>
        </Box>
      </Box>
    </>
  );
};

export default ProviderAssignments;
