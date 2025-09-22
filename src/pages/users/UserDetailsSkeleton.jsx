import { Box, Skeleton, Typography } from "@mui/material";

const UserDetailsSkeleton = () => {
  return (
    <Box
      sx={{
        padding: 2,
        bgcolor: "background.paper",
        width: "98%",
        mx: "auto",
        borderRadius: "12px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="text" width="150px" height="25px" />
        <Skeleton variant="circle" width={40} height={40} />

        <Skeleton variant="text" width="200px" height="15px" />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ width: "50%" }}>
            Email:
          </Typography>
          <Skeleton variant="text" width="100px" height="15px" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ width: "50%" }}>
            Role:
          </Typography>
          <Skeleton variant="text" width="100px" height="15px" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ width: "50%" }}>
            Last Updated:
          </Typography>
          <Skeleton variant="text" width="100px" height="15px" />
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetailsSkeleton;
