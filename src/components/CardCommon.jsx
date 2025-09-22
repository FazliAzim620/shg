import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Switch,
  Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";
const CardCommon = ({
  children,
  cardTitle,
  btnText,
  toggle,
  toggleValue,
  handleClickToggle,
  handleEditClick,
  loader,
  getToggleDataLoader,
  mt,
  minHeight,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  return (
    <Card
      sx={{
        boxShadow: "none",
        borderRadius: ".6875rem  ",
        minHeight: minHeight || "397px",
        mt: mt || 0,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontSize: ".98438rem",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "text.black",
            }}
          >
            {cardTitle}
          </Typography>
          {/* <Box sx={{}}> */}

          {toggle ? (
            getToggleDataLoader ? (
              <Skeleton height={40} width={60} />
            ) : (
              <Switch
                checked={toggleValue ? toggleValue : false}
                disabled={loader ? true : false}
                onClick={handleClickToggle}
              />
            )
          ) : (
            <Button
              onClick={handleEditClick}
              variant="outlined"
              color="primary"
              sx={{
                justifyContent: "flex-end",
                textTransform: "capitalize",
                color: "text.link",
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                lineHeight: 1.2,
                p: 0,
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "background.paper",
                  border: "none",
                },
                "&:focus": {
                  bgcolor: "background.paper",
                  outline: "none",
                },
              }}
            >
              {btnText}
            </Button>
          )}

          {/* </Box> */}
        </Box>
        <Divider
          sx={{
            borderColor:
              darkMode == "dark"
                ? "rgba(255, 255, 255, .7"
                : "rgba(231, 234, 243, 01)",
          }}
        />
        <Box
          sx={{
            pt: 2,
            px: 2,
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardCommon;
