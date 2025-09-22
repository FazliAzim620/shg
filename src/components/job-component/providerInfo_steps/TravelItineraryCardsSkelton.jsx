import { Box, Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const TravelItineraryCardsSkelton = () => {
  const darkMode = useSelector((state) => state.theme.mode);

  return (
    <>
      <Card
        sx={{
          borderRadius: ".75rem",
          backgroundColor: "text.paper",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
          height: "294px",
          p: 1,
          mb: 4,
        }}
      >
        <CardHeader
          sx={{
            pb: 0.5,
            borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
          }}
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                gap: 1,
              }}
            >
              <Skeleton width="100px" />
              <Skeleton width=" 85px" />
            </Box>
          }
        />
        <CardContent>
          <Box
            sx={{
              border: "2px dashed rgba(231, 234, 243, .7)",
              borderRadius: 2,
              // px: "3rem",
              textAlign: "center",
              bgcolor: darkMode === "dark" ? "background.paper" : "#f8fafd",
              transition: "background-color 0.3s",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
              alignItems: "center",
              height: "194px",
              mt: 1,
            }}
          >
            <Skeleton width=" 180px" />
            <Skeleton width=" 280px" />
            <Skeleton width=" 180px" height={"60px"} />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TravelItineraryCardsSkelton;
