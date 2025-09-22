import { Box, Grid, Typography, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import {
  ActiveUserIcon,
  DraftUserIcon,
  InActiveUserIcon,
  UserIcon,
} from "./Icons";
import API from "../../API";

const UserCardSkeleton = () => (
  <Box
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
);

const UserCards = ({ propsData }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [usersCount, setUsersCount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const data = propsData
    ? propsData
    : [
        {
          id: 1,
          title: "Total users",
          count: usersCount?.total_users || 0,
          Icon: <UserIcon />,
        },
        {
          id: 2,
          title: "Active users",
          count: usersCount?.active_users || 0,
          Icon: <ActiveUserIcon />,
        },
        {
          id: 3,
          title: "Inactive users  ",
          count: usersCount?.inactive_users || 0,
          Icon: <InActiveUserIcon sx={{ color: "background.btn_blue" }} />,
        },
      ];

  const getUserWidgetCount = async () => {
    setIsLoading(true);
    try {
      const resp = await API.get(`/api/get-users-widgets`);
      if (resp?.data?.success) {
        setUsersCount(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserWidgetCount();
  }, []);

  return (
    <Grid
      container
      spacing={3}
      sx={{
        mb: 4,
      }}
    >
      {data?.map((item, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          md={propsData?.length > 0 ? 3 : 4}
        >
          {isLoading ? (
            <UserCardSkeleton />
          ) : (
            <Box
              sx={{
                textAlign: "left",
                bgcolor: "background.paper",
                py: 1.5,
                px: 2.2,
                borderRadius: ".75rem",
                border:
                  darkMode === "light" &&
                  ".0625rem solid rgba(231, 234, 243, .7)",
                boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
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
                  {propsData
                    ? ""
                    : index !== 0 && (
                        <Typography
                          variant="caption"
                          pl={1}
                          sx={{ color: "text.or_color", fontWeight: 400 }}
                        >
                          Users
                        </Typography>
                      )}
                </CustomTypographyBold>
                {item.Icon}
              </Box>
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default UserCards;
