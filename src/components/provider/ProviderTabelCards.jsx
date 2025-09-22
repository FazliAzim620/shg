import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import CustomTypographyBold from "../CustomTypographyBold";
import {
  Check,
  GroupRemoveOutlined,
  PendingActions,
  PeopleOutlineOutlined,
  Security,
  Verified,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const ProviderTabelCards = ({ providersCount }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const data = [
    {
      id: 1,
      title: "Total providers",
      count: providersCount?.total_providers || 0,
      Icon: "p4.png",
    },
    {
      id: 2,
      title: "Available",
      count: providersCount?.available_providers || 0,
      Icon: "p3.png",
    },
    {
      id: 3,
      title: "verified Credentials",
      count: providersCount?.verified_credentials_providers || 0,
      Icon: "p1.png",
    },
    {
      id: 4,
      title: "InActive  ",
      count: providersCount?.inactive_providers || 0,
      Icon: "p2.png",
    },
  ];
  return (
    <Grid container sx={{ display: "flex", mb: 4, gap: { md: 2.7, xl: 3.2 } }}>
      {data?.map((item, index) => {
        return (
          <Grid
            key={index}
            item
            xs={12}
            sm={5.8}
            md={2.82}
            sx={{
              bgcolor: "background.paper",
              p: 2.2,
              borderRadius: ".75rem",
              border:
                darkMode == "light" && ".0625rem solid rgba(231, 234, 243, .7)",
              boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
            }}
          >
            <Box
              sx={{
                textAlign: "left",
              }}
            >
              <CustomTypographyBold
                textTransform={"uppercase"}
                color="text.or_color"
                fontSize={"0.71rem"}
              >
                {item?.title}
              </CustomTypographyBold>

              <Box
                sx={{
                  mt: 2,
                  pb: 0.61,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CustomTypographyBold
                  color={"text.black"}
                  fontSize={"2rem"}
                  weight={600}
                >
                  {item?.count}
                  {index !== 0 && (
                    <Typography
                      variant="caption"
                      pl={1}
                      sx={{ color: "text.or_color", fontWeight: 400 }}
                    >
                      Providers
                    </Typography>
                  )}
                </CustomTypographyBold>
                {/* {item.Icon} */}
                <img src={item.Icon} alt={item?.count} />
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ProviderTabelCards;
