import { Box, Grid, Skeleton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../CustomTypographyBold";
import { green, pink, blue, yellow } from "../Images";
import { DraftUserIcon } from "../../pages/users/Icons";

const LeadsTableCards = ({ leadsCount }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const data = [
    {
      id: 1,
      title: "Provider leads",
      count: leadsCount?.total_jobs,
      Icon: <DraftUserIcon color={"rgba(73, 80, 87, 1)"} />,
    },
    {
      id: 2,
      title: "new leads",
      count: leadsCount?.active_jobs,
      Icon: <DraftUserIcon color={"rgba(55, 125, 255, 1)"} />,
    },
    {
      id: 3,
      title: "assigned leads",
      count: leadsCount?.inactive_jobs,
      Icon: <DraftUserIcon color={"rgba(255, 193, 7, 1)"} />,
    },
    {
      id: 3,
      title: "converted leads",
      count: leadsCount?.closed_jobs,
      Icon: <DraftUserIcon color={"rgba(0, 201, 167, 1)"} />,
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
            md={2.84}
            sx={{
              bgcolor: "background.paper",
              px: 2,
              py: 1.3,
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
                color={darkMode == "light" ? "text.or_color" : "white"}
                fontSize={"0.71rem"}
              >
                {item?.title}
              </CustomTypographyBold>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CustomTypographyBold
                  color={darkMode == "light" ? "black" : "white"}
                  fontSize={"2rem"}
                  weight={600}
                >
                  {" "}
                  {leadsCount ? (
                    item?.count
                  ) : (
                    <Skeleton height={29} width={40} />
                  )}
                </CustomTypographyBold>
                {/* <img src={item.Icon} alt={item.Icon} /> */}
                {item.Icon}
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LeadsTableCards;
