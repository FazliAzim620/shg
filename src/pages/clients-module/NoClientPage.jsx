import { Box, Button, Typography } from "@mui/material";
import React from "react";

// import not_found from "../assets/not_found.svg";
import clientIcon from "../../assets/no_clients.svg";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { Add } from "@mui/icons-material";
const NoClientPage = ({ onClick }) => {
  return (
    <Box
      sx={{
        overflowX: "hidden",
        bgcolor: "background.page_bg",
      }}
    >
      <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
        <Box
          component={"img"}
          src={clientIcon}
          sx={{ maxWidth: "8rem", mb: "31px" }}
          alt="not found "
        />
        <CustomTypographyBold
          fontSize={"1.41rem"}
          color="text.black"
          textTransform={"none"}
        >
          No clients added yet
        </CustomTypographyBold>
        <Typography
          fontSize={"0.875rem"}
          color="text.or_color"
          mt="0.7rem"
          mb="1rem"
        >
          It looks like you haven’t added any clients.
        </Typography>
        <Button
          onClick={onClick}
          variant="contained"
          component="label"
          sx={{
            textTransform: "inherit",
            boxShadow: "none",
            // p: ".0 1rem",
            mb: 1,
            fontWeight: 400,
            fontSize: "0.875rem",
            p: "0.6125rem 1rem",
            width: " 180px",
          }}
          startIcon={<Add sx={{ width: 12 }} />}
        >
          Add new client
          {/* {btnText} */}
        </Button>
      </Box>
    </Box>
  );
};

export default NoClientPage;
