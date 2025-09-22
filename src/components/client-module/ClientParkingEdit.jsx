import {
  Box,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../CustomTypographyBold";

const ClientParkingEdit = ({ data, setData }) => {
  const darkMode = useSelector((state) => state.theme.mode);

  const changeHandler = (name, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.name === name ? { ...item, value: value } : item
      )
    );
  };

  const getFieldValue = (name) => {
    const field = data?.find((item) => item.name === name);

    return field ? field.value : "";
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={3} sx={{ mt: 1 }}>
        <CustomTypographyBold
          weight={400}
          textTransform={"inherit"}
          color={"text.black"}
          fontSize={"14px"}
        >
          Cost covered?
        </CustomTypographyBold>
      </Grid>
      <Grid item xs={9}>
        <Box sx={{ width: "100%" }}>
          <RadioGroup
            row
            value={
              getFieldValue("parking_cost_covered") === "Yes" ? "yes" : "no"
            }
            onChange={(e) =>
              changeHandler(
                "parking_cost_covered",
                e.target.value === "yes" ? "Yes" : "No"
              )
            }
          >
            <FormControlLabel
              value="yes"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: " rgba(231, 234, 243, .7)",
                    backgroundColor: "#FFFFFF",
                    padding: "0px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                    marginRight: "10px",
                    "&.Mui-checked": {
                      color: "#377dff",
                      outline: "none",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ fontSize: ".875rem", lineHeight: 1.5 }}
                >
                  Yes
                </Typography>
              }
              sx={{
                bgcolor: darkMode === "light" ? "#F6F7FA" : "#333",
                width: "49%",
                m: "0px 3px 0px 0px",
                borderRadius: ".3125rem",
                minHeight: "44px",
              }}
            />
            <FormControlLabel
              value="no"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: " rgba(231, 234, 243, .7)",
                    backgroundColor: "#FFFFFF",
                    padding: "0px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                    marginRight: "10px",
                    "&.Mui-checked": {
                      color: "#377dff",
                      outline: "none",
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ fontSize: ".875rem", lineHeight: 1.5 }}
                >
                  No
                </Typography>
              }
              sx={{
                bgcolor: darkMode === "light" ? "#F6F7FA" : "#333",
                width: "50%",
                m: 0,
                borderRadius: ".3125rem",
              }}
            />
          </RadioGroup>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ClientParkingEdit;
