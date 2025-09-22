import { Grid, Box, Typography } from "@mui/material";
import React from "react";
import { check, crossIcon } from "../../Images";
import CustomTypographyBold from "../../CustomTypographyBold";

const BudgetPreferences_postJob = ({ budgetData }) => {
  const budgetCard = (data, ind) => {
    return (
      <Grid
        item
        key={ind}
        bgcolor={"background.paper"}
        xs={5.85}
        sx={{
          boxShadow: "rgba(140, 152, 164, 0.08) 0px 2px 8px 0px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: "12px",
          justifyContent: "space-between",
          minHeight: "98px",
          p: "24px",

          mb:
            ind == budgetData?.length - 1 || ind == budgetData?.length - 2
              ? null
              : 4,
          border: "1px solid rgba(231, 234, 243, 0.7)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "#377DFF1A",
              borderRadius: "50%",
              width: 50,
              height: 50,
            }}
          >
            <Box component={"img"} src={data?.icon} alt="icon" />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "text.black",
              }}
            >
              {data?.title}
            </Typography>
            <CustomTypographyBold
              weight={400}
              color={"text.primary"}
              fontSize={"0.875rem"}
              textTransform={"none"}
            >
              {data?.message}
            </CustomTypographyBold>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box
            component={"img"}
            src={Number(data?.value) ? check : crossIcon}
            alt="icon"
          />
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "text.black",
            }}
          >
            {Number(data?.value) ? "Yes" : "No"}
          </Typography>
        </Box>
      </Grid>
    );
  };
  return (
    <>
      <Grid
        mx={"auto"}
        alignItems={"center"}
        justifyContent={"space-between"}
        container
      >
        {budgetData?.map((data, index) => {
          return budgetCard(data, index);
        })}
      </Grid>
    </>
  );
};

export default BudgetPreferences_postJob;
