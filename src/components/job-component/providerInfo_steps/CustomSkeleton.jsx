import React from "react";
import { Box, Grid, Divider, Skeleton } from "@mui/material";
import CustomTypographyBold from "../../CustomTypographyBold";
import { useSelector } from "react-redux";

const CustomSkeleton = () => {
  const darkMode = useSelector((state) => state.theme.mode);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Grid item xs={6} md={0.8}>
          <CustomTypographyBold color={"text.primary"} fontSize={"14px"}>
            <Skeleton width="120px" height={20} sx={{ marginTop: "30px" }} />
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={6} md={11.2}>
          <Divider
            sx={{
              borderColor:
                darkMode === "dark"
                  ? "rgba(255, 255, 255, .7)"
                  : "rgba(231, 234, 243, 1)",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              borderRadius: ".3125rem",
              bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              borderRadius: ".3125rem",
              bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              borderRadius: ".3125rem",
              bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              borderRadius: ".3125rem",
              bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              borderRadius: ".3125rem",
              bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{
              borderRadius: ".3125rem",
              bgcolor: darkMode === "light" ? "#F7F9FC" : "#333",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomSkeleton;
