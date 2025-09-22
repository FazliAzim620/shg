import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Skeleton,
  Chip,
} from "@mui/material";

const CardSkeleton = ({ timesheet, style }) => {
  return (
    <Card sx={style}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} container justifyContent="space-between">
            <Skeleton variant="rectangular" width={120} height={30} />
            <Skeleton variant="rectangular" width={50} height={20} />
          </Grid>

          <Grid item xs={12}>
            <Skeleton variant="rectangular" width={160} height={30} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" width={220} height={20} />
          </Grid>
          <Grid item xs={12} container spacing={1}>
            <Grid item>
              <Skeleton variant="text" width={150} height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant="text" width={90} height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant="text" width={100} height={20} />
            </Grid>
          </Grid>
          {timesheet && (
            <>
              <Box
                sx={{ width: "100%", display: "flex", justifyContent: "end" }}
              >
                <Skeleton variant="rectangular" width="30%" height={15} />
              </Box>
            </>
          )}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={10} />
          </Grid>
          {timesheet && (
            <>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" width="30%" height={15} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" width="30%" height={15} />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
