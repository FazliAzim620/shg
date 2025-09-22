import React from "react";
import { Box, Typography, Paper, Grid, Link } from "@mui/material";
import { Flight, Hotel, DirectionsCar, Language } from "@mui/icons-material";
import { HeadingCommon } from "./HeadingCommon";

const PreferenceItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box sx={{ mr: 2, color: "text.secondary" }}>{icon}</Box>
    <Typography
      variant="body2"
      sx={{ flexBasis: "30%", color: "text.secondary" }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        color: " #1e2022",
        fontWeight: 600,
        marginBottom: ".75rem",
      }}
    >
      {value}
    </Typography>
  </Box>
);
const LanguageItem = ({ language, level }) => (
  <Box sx={{ display: "flex" }}>
    <Typography variant="body2" sx={{ mr: 1 }}>
      {language}
    </Typography>
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      — {level}
    </Typography>
  </Box>
);

const TravelPreferencesLanguagesLinks = () => {
  return (
    // <Box elevation={3} sx={{ maxWidth: 400, p: 3, borderRadius: 2 }}>
    <Box>
      <Box sx={{ mt: "80px" }}>
        <HeadingCommon title={"Travel preferences"} />
        <PreferenceItem
          icon={<Flight />}
          label="Airline"
          value="Lorem Airline /M class"
        />
        <PreferenceItem
          icon={<Hotel />}
          label="Hotel"
          value="Lorem Hotel, Single bed"
        />
        <PreferenceItem
          icon={<DirectionsCar />}
          label="Car"
          value="Lorem ipsum car rental"
        />
      </Box>

      <Box sx={{ mt: "80px" }}>
        <HeadingCommon title={"Languages"} />
        <LanguageItem language="English" level="Native" />
        <LanguageItem language="Deutsch" level="Fluent" />
        <LanguageItem language="French" level="Beginner" />
      </Box>

      <Box sx={{ mt: "80px" }}>
        <HeadingCommon title={"Links"} />
        <Link
          href="https://www.github.com/maria-w"
          target="_blank"
          rel="noopener"
          sx={{ display: "block", color: "primary.main" }}
        >
          www.github.com/maria-w
        </Link>
        <Link
          href="https://www.twitter.com/maria-w"
          target="_blank"
          rel="noopener"
          sx={{ display: "block", color: "primary.main" }}
        >
          www.twitter.com/maria-w
        </Link>
      </Box>
    </Box>
  );
};

export default TravelPreferencesLanguagesLinks;
