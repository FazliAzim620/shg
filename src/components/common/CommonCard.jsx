import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import React from "react";
import CustomBadge from "../CustomBadge";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../CustomTypographyBold";
import { Add } from "@mui/icons-material";

const CommonCard = ({
  status,
  onClick,
  title,
  heading,
  bodyText,
  btnText,
  btnwidth,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  return (
    <Card
      sx={{
        borderRadius: ".75rem",
        backgroundColor: "text.paper",
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        height: "294px",
        p: 1,
        mb: 4,
      }}
    >
      <CardHeader
        sx={{
          pb: 0.5,
          borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
        }}
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 1.2,
                color: "text.black",
              }}
            >
              {title}
              <CustomBadge
                color={status ? "rgba(0, 201, 167)" : "rgba(55, 125, 255)"}
                bgcolor={
                  status ? "rgba(0, 201, 167, .1)" : "rgba(55, 125, 255, .1)"
                }
                text={status ? "Completed" : "In progress"}
                width="90px"
                ml={6}
              />
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
            border: "2px dashed rgba(231, 234, 243, .7)",
            borderRadius: 2,
            // px: "3rem",
            textAlign: "center",
            bgcolor: darkMode === "dark" ? "background.paper" : "#f8fafd",
            transition: "background-color 0.3s",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "194px",
            mt: 1,
          }}
        >
          <CustomTypographyBold color="text.black">
            {heading}
          </CustomTypographyBold>
          <CustomTypographyBold
            color="text.primary"
            weight={400}
            textTransform={"inherit"}
          >
            {bodyText}
          </CustomTypographyBold>
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
              width: btnwidth ? btnwidth : " 180px",
            }}
            startIcon={<Add sx={{ width: 12 }} />}
          >
            {btnText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CommonCard;
