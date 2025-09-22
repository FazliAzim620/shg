import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";

const WidgetCardSkeleton = ({ total_cards, array_length }) => {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        mb: 4,
      }}
    >
      {Array.from(new Array(array_length))?.map((item, index) => {
        return (
          <Grid key={index} item xs={12} sm={6} md={total_cards}>
            <Box
              key={index}
              sx={{
                textAlign: "left",
                bgcolor: "background.paper",
                py: 1.5,
                px: 2.2,
                borderRadius: ".75rem",
                height: "100%",
              }}
            >
              <Skeleton width={100} height={20} />
              <Box
                sx={{
                  mt: 2,
                  pb: 0.61,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Skeleton width={80} height={45} />
                </Box>
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default WidgetCardSkeleton;
