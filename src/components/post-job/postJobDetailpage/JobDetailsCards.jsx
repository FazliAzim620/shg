import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../CustomTypographyBold";
import { flxCntrSx } from "../../constants/data";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const JobDetailsCards = ({ applicants, isLoading }) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const data = [
    {
      id: 1,
      title: "Total Applications",
      count: applicants?.length,
      Icon: (
        <Box
          sx={{
            ...flxCntrSx,
            minHeight: "42px",
            minWidth: "42px",
            bgcolor: "#ebf2ff",
            borderRadius: "50%",
          }}
        >
          <PersonOutlineOutlinedIcon sx={{ color: "#377dff" }} />
        </Box>
      ),
    },
    {
      id: 2,
      title: "Shortlisted",
      count: applicants?.filter(
        (applicant) => applicant.status === "shortlisted"
      )?.length,
      Icon: (
        <Box
          sx={{
            ...flxCntrSx,
            minHeight: "42px",
            minWidth: "42px",
            bgcolor: "#e5faf6",
            borderRadius: "50%",
          }}
        >
          <PersonOutlineOutlinedIcon sx={{ color: "#00c9a7" }} />
        </Box>
      ),
    },
    {
      id: 3,
      title: "Pending review",
      count: applicants?.filter((applicant) => applicant.status === "applied")
        ?.length,
      Icon: (
        <Box
          sx={{
            ...flxCntrSx,
            minHeight: "42px",
            minWidth: "42px",
            bgcolor: "#FFF9E6",
            borderRadius: "50%",
          }}
        >
          <PersonOutlineOutlinedIcon sx={{ color: "#FFC107" }} />
        </Box>
      ),
    },
  ];

  return (
    <Grid
      container
      // spacing={2}
      sx={{
        my: 5,
        justifyContent: { xs: "left", md: "space-between" },
        gap: { xs: 2, md: 0 },
      }}
    >
      {applicants?.length > 0
        ? data?.map((item, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={5.8}
              md={3.8}
              sx={{
                maxHeight: "109px",
                // maxWidth: "412px",
                width: "100%",
                bgcolor: "background.paper",
                alignContent: "center",
                justifyContent: "center",
                p: "24px",
                borderRadius: ".75rem",
                border:
                  darkMode === "light" &&
                  ".0625rem solid rgba(231, 234, 243, .7)",
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
                    {isLoading ? (
                      <Skeleton width={30} height={30} />
                    ) : (
                      item?.count
                    )}
                  </CustomTypographyBold>
                  {item.Icon}
                </Box>
              </Box>
            </Grid>
          ))
        : ""}
    </Grid>
  );
};

export default JobDetailsCards;
