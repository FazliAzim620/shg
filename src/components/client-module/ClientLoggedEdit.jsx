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
import InputWithText from "../inputs/InputWithText";
import { CommonInputField } from "../job-component/CreateJobModal";

const ClientLoggedEdit = ({ data, setData }) => {
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
              getFieldValue("personal_car_logged_miles_cost") === "Yes"
                ? "yes"
                : "no"
            }
            onChange={(e) =>
              changeHandler(
                "personal_car_logged_miles_cost",
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
      {getFieldValue("personal_car_logged_miles_cost") === "Yes" && (
        <Grid item xs={3}>
          <CustomTypographyBold
            weight={400}
            textTransform={"inherit"}
            color={"text.black"}
            fontSize={"14px"}
          >
            Is there a mileage reimbursement rate?
          </CustomTypographyBold>
        </Grid>
      )}
      {getFieldValue("personal_car_logged_miles_cost") === "Yes" && (
        <Grid item xs={9}>
          <Box sx={{ width: "100%" }}>
            <RadioGroup
              row
              value={
                getFieldValue("mileage_reimbursement_rate") === "Yes"
                  ? "yes"
                  : "no"
              }
              onChange={(e) =>
                changeHandler(
                  "mileage_reimbursement_rate",
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
      )}

      {getFieldValue("personal_car_logged_miles_cost") === "Yes" && (
        <Grid item xs={3}>
          <CustomTypographyBold
            weight={400}
            textTransform={"inherit"}
            color={"text.black"}
            fontSize={"14px"}
          >
            Budget limit
          </CustomTypographyBold>
        </Grid>
      )}
      {getFieldValue("personal_car_logged_miles_cost") === "Yes" && (
        <Grid item xs={9}>
          <Box sx={{ width: "100%", display: "flex", gap: 1 }}>
            <CommonInputField
              name="mileage_reimbursement_rate_budget"
              placeholder="$"
              value={getFieldValue("mileage_reimbursement_rate_budget")}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value))
                  changeHandler("mileage_reimbursement_rate_budget", value);
              }}
            />
            {/* <InputWithText
              text="Min limit $"
              value={getFieldValue("mileage_reimbursement_rate_min_budget")}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value))
                  changeHandler("mileage_reimbursement_rate_min_budget", value);
              }}
              placeholder="Min limit $"
            />
            <InputWithText
              text="Max limit $"
              value={getFieldValue("mileage_reimbursement_rate_max_budget")}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value))
                  changeHandler("mileage_reimbursement_rate_max_budget", value);
              }}
              placeholder="Max limit $"
            /> */}
          </Box>
        </Grid>
      )}
      {getFieldValue("personal_car_logged_miles_cost") === "Yes" && (
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "right" }}>
          <Grid
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomTypographyBold
              weight={400}
              color={"text.black"}
              fontSize={"14px"}
            >
              Logged budget :
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={600}
              color={"text.black"}
              fontSize={"14px"}
            >
              ${getFieldValue("mileage_reimbursement_rate_budget")}
            </CustomTypographyBold>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ClientLoggedEdit;
