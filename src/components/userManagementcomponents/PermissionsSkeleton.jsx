import React from "react";
import { Box, Grid, Skeleton, Paper } from "@mui/material";

const PermissionsSkeleton = () => {
  return (
    <Grid container spacing={2} mt={2}>
      {/* Sidebar Skeleton */}
      <Grid item xs={4}>
        <Paper elevation={2} sx={{ borderRadius: "12px" }}>
          {Array.from(new Array(10)).map((item, index) => (
            <Skeleton
              height={40}
              width="90%"
              sx={{ marginBottom: 1, ml: 2 }}
              key={index}
            />
          ))}
        </Paper>
      </Grid>

      {/* Main Content Skeleton */}
      <Grid item xs={8}>
        <Paper elevation={2} sx={{ borderRadius: "12px" }}>
          <Box sx={{ p: 2 }}>
            <Skeleton height={60} width="70%" sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PermissionsSkeleton;
