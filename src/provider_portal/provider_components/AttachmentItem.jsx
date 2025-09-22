import { Close, Download } from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { baseURLImage } from "../../API";

const AttachmentItem = ({ title, file, onRemove }) => {
  const fileName = file.name || file?.file_name;
  const handleDownload = () => {
    // alert(fileName);
    const url = `${baseURLImage}api/download-file/${fileName}`;
    window.open(url, "_blank");
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 1, position: "relative", display: "flex", alignItems: "center" }}
    >
      <Tooltip title={fileName} arrow placement="top">
        <Typography
          variant="body2"
          sx={{
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexGrow: 1, // Allow the text to grow
            mr: 1, // Add some margin to the right
          }}
        >
          {fileName}
        </Typography>
      </Tooltip>
      {title && (
        <>
          <IconButton size="small" onClick={handleDownload} sx={{ mr: 1 }}>
            <Download fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onRemove(file)}>
            <Close fontSize="small" />
          </IconButton>
        </>
      )}
    </Paper>
  );
};
export default AttachmentItem;
export const renderFileSection = (title, files, confirmDeleteAttachment) => {
  return (
    <Box sx={{ mb: 3 }}>
      {title !== "Receipts" && (
        <Box sx={{ pb: 1 }}>
          <CustomTypographyBold fontSize={"1rem"}>{title}</CustomTypographyBold>
        </Box>
      )}
      {files.length > 0 ? (
        <Grid
          container
          spacing={2}
          sx={{
            flexWrap: title === "Receipts" && "nowrap",
          }}
        >
          {files.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AttachmentItem
                title={title}
                file={file}
                onRemove={() => confirmDeleteAttachment(file)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <CustomTypographyBold color="text.secondary" weight={400}>
          No {title.toLowerCase()} uploaded.
        </CustomTypographyBold>
      )}
    </Box>
  );
};
export const renderSkeleton = () => (
  <Box width={"100%"}>
    {/* Skeleton for title */}
    <Skeleton variant="text" width={150} height={40} sx={{ mb: 2 }} />

    {/* Skeleton for the upload button */}
    <Skeleton variant="rectangular" width={150} height={40} sx={{ mb: 2 }} />

    {/* Skeleton grid to represent file cards */}
    <Grid container spacing={2}>
      {Array.from(new Array(3)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" width="100%" height={30} />
        </Grid>
      ))}
    </Grid>
  </Box>
);
