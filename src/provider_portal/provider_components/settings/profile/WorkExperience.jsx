import React from "react";
import { Box, Typography, Avatar, Divider } from "@mui/material";
import { Google, Work } from "@mui/icons-material";
import { HeadingCommon } from "./HeadingCommon";

const WorkExperience = () => {
  const experiences = [
    {
      title: "Family Nurse Practitioner",
      company: "Google",
      location: "London",
      period: "January 2014 to November 2014",
      description:
        "Work in Google is one of the beautiful experiences I can do in my entire life. There are a lot of interesting things to learn and managers respect your time and your personality.",
      icon: <Google />,
    },
    {
      title: "Internship",
      company: "Htmlstream under Pixeel Ltd.",
      location: "London",
      period: "December 2013 to January 2014",
      description: "My first steps...",
      icon: <Work />,
    },
    {
      title: "Internship",
      company: "Htmlstream under Pixeel Ltd.",
      location: "London",
      period: "December 2013 to January 2014",
      description: "My first steps...",
      icon: <Work />,
    },
  ];

  return (
    <>
      <Box sx={{ my: "80px" }}>
        <HeadingCommon title={"Work Experience"} />

        {experiences.map((exp, index) => (
          <>
            <Box
              key={index}
              sx={{
                // borderLeft: ".125rem solid rgba(231, 234, 243, .7)",

                display: "flex",
                alignItems: "flex-start",
                pl: 4,
              }}
            >
              {/* Avatar with conditional background color */}
              <Avatar
                sx={{
                  bgcolor: index === 0 ? "#4285F4" : "#757575",
                  mr: 2,
                  zIndex: 1, // Ensure avatar is above the line
                }}
              >
                {exp.icon}
              </Avatar>

              {/* Content */}
              <Box>
                <Typography variant="h6">{exp.title}</Typography>
                <Typography color="text.secondary">
                  {exp.company} - {exp.location}
                </Typography>
              </Box>
            </Box>
            <Box
              key={index}
              sx={{
                borderLeft: ".13rem solid #DADCE3",
                ml: 6.5,
                mb: 1,
                pl: 4,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {exp.period}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {exp.description}
                </Typography>
              </Box>
            </Box>
          </>
        ))}
      </Box>
    </>
  );
};

export default WorkExperience;
