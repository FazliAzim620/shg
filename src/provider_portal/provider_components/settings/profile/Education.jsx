import React from "react";
import { Box, Typography, Avatar, Divider } from "@mui/material";
import { Google, Work } from "@mui/icons-material";
import { HeadingCommon } from "./HeadingCommon";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
const Education = () => {
  const experiences = [
    {
      title: "Master of Science - MS",
      company: "Northwestern State University",
      location: "London",
      period: "January 2014 to November 2014",
      description:
        "Work in Google is one of the beautiful experiences I can do in my entire life. There are a lot of interesting things to learn and managers respect your time and your personality.",
      icon: <Google />,
    },
    {
      title: "Bachelor of science nursing, Registered Nursing/Registered Nurse",
      company: "Northwestern State University",
      location: "London",
      period: "December 2013 to January 2014",
      description: "My first steps...",
      icon: <Work />,
    },
  ];

  return (
    <Box>
      <HeadingCommon title={"Education"} />
      {experiences.map((exp, index) => (
        <>
          <Box
            key={index}
            sx={{
              // borderLeft: ".125rem solid rgba(231, 234, 243, .7)",
              mt: 3,
              display: "flex",
              alignItems: "flex-start",
              pl: 4,
            }}
          >
            {/* Avatar with conditional background color */}
            <Avatar
              sx={{
                color: "#132144",
                bgcolor: "#DADCE3",
                mr: 2,
                zIndex: 1, // Ensure avatar is above the line
              }}
            >
              <WorkspacePremiumOutlinedIcon />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  marginTop: 0,
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "#1e2022",
                }}
              >
                {exp.title}
              </Typography>
              <Typography
                sx={{
                  marginTop: 0,
                  marginBottom: "0.5rem",
                  mt: 1.5,
                  lineHeight: 1.2,
                  color: "#1e2022",
                }}
              >
                {exp.company} - {exp.location}
              </Typography>
            </Box>
          </Box>
          <Box
            key={index}
            sx={{
              borderLeft: ".13rem solid #DADCE3",
              ml: 6.5,
              pl: 4,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                {exp.period}
              </Typography>
            </Box>
          </Box>
        </>
      ))}
    </Box>
  );
};

export default Education;
