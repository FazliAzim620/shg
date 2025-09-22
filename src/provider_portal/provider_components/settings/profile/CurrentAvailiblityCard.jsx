import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { HeadingCommon } from "./HeadingCommon";

const availabilityData = [
  {
    day: "Saturday",
    time: "12:00 - 03:00 PM",
    date: "24 May, 2020 - 24 May, 2021",
  },
  {
    day: "Sunday",
    time: "04:30 - 04:50 PM",
    date: "24 May, 2020 - 24 May, 2021",
  },
  {
    day: "Friday",
    time: "12:00 - 03:00 PM",
    date: "24 May, 2020 - 24 May, 2021",
  },
  {
    day: "Monday",
    time: "02:00 - 03:00 PM",
    date: "24 May, 2020 - 24 May, 2021",
  },
];

const CurrentAvailiblityCard = () => {
  return (
    <Box
      elevation={3}
      sx={{
        mt: "80px",
        minWidth: 443,
        height: 496.43,
        p: 2,
        backgroundColor: "#fff",
        backgroundClip: "border-box",
        border: "0.0625rem solid rgba(231, 234, 243, 0.7)",
        borderRadius: "0.75rem",
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        position: "sticky",
        top: 80,
      }}
    >
      <Box>
        <HeadingCommon title={"Current availability"} />
      </Box>

      <Box sx={{ p: 0 }}>
        {availabilityData.map((item, index) => (
          <Box
            sx={{
              borderBottom:
                index !== availabilityData?.length - 1 && "1px solid #E7EAF3",
            }}
          >
            <Box
              key={index}
              sx={{
                px: 2,
                my: 2,
                borderLeft: ".125rem solid #00C9A7",
              }}
            >
              <Typography fontSize="21px"> {item.time}</Typography>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "14px",
                  "&:hover": {
                    color: "text.main",
                  },
                }}
              >
                {item.day}
              </Typography>
              <Typography sx={{ mb: 2, fontSize: "12.25px" }}>
                {item.date}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CurrentAvailiblityCard;
