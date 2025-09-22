import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Divider,
} from "@mui/material";
import { updateSection } from "../../../../feature/budgetPreferenceSlice";
import CustomTypographyBold from "../../../CustomTypographyBold";

import InputWithText from "../../../inputs/InputWithText";

const LoggedMiles = ({ isEdit }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const { loggedMiles } = useSelector((state) => state.budgetPreferences);

  const handleChange = (field, value) => {
    if (field === "reimbursementRate" && !value) {
      dispatch(
        updateSection({
          section: "loggedMiles",
          field: "ratePerMile",
          value: { min: 0, max: 0 },
        })
      );
    }
    dispatch(updateSection({ section: "loggedMiles", field, value }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Grid item xs={6} md={2}>
          <CustomTypographyBold
            // color={"text.primary"}
            color={darkMode == "dark" ? "#6D747B" : "#71869D"}
            fontSize={"15.78px"}
            textTransform={"none"}
          >
            Logged miles:
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={6} md={10}>
          <Divider
            sx={{
              borderColor:
                darkMode == "dark"
                  ? "rgba(255, 255, 255, .7"
                  : "rgba(231, 234, 243, 01)",
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={"1.5rem"}
        sx={{ display: "flex", alignItems: "center", pt: 2 }}
      >
        <Grid item xs={12} md={6}>
          <CustomTypographyBold
            weight={400}
            textTransform={"inherit"}
            color={"text.black"}
            fontSize={"14px"}
          >
            Will the cost of logged miles when using a personal vehicle be
            covered?
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            row
            value={loggedMiles.covered ? "yes" : "no"}
            onChange={(e) =>
              isEdit ? handleChange("covered", e.target.value === "yes") : ""
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
                    "&.MuiRadio-root": {},
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
                bgcolor: darkMode == "light" ? "#F6F7FA" : "#333",
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
                    "&.MuiRadio-root": {},
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
                bgcolor: darkMode == "light" ? "#F6F7FA" : "#333",
                width: "50%",
                m: 0,
                borderRadius: ".3125rem",
                minHeight: "44px",
              }}
            />
          </RadioGroup>
        </Grid>
        {loggedMiles.covered && (
          <>
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                Is there a mileage reimbursement rate?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={loggedMiles.reimbursementRate ? "yes" : "no"}
                onChange={(e) =>
                  isEdit
                    ? handleChange(
                        "reimbursementRate",
                        e.target.value === "yes"
                      )
                    : ""
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
                        "&.MuiRadio-root": {},
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
                    bgcolor: darkMode == "light" ? "#F6F7FA" : "#333",
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
                        "&.MuiRadio-root": {},
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
                    bgcolor: darkMode == "light" ? "#F6F7FA" : "#333",
                    width: "50%",
                    m: 0,
                    borderRadius: ".3125rem",
                    minHeight: "44px",
                  }}
                />
              </RadioGroup>
            </Grid>
            {loggedMiles.reimbursementRate && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTypographyBold
                    weight={400}
                    textTransform={"inherit"}
                    color={"text.black"}
                    fontSize={"14px"}
                  >
                    If yes, please specify the rate per mile
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <InputWithText
                        text="Min limit $"
                        value={loggedMiles?.ratePerMile?.min || 0}
                        onChange={(e) => {
                          if (e.target.value >= 0 && isEdit) {
                            handleChange("ratePerMile", {
                              ...loggedMiles.ratePerMile,
                              min: Number(e.target.value),
                            });
                          }
                        }}
                        name={"ratePerMile"}
                        placeholder="Min limit $"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputWithText
                        text="Max limit $"
                        value={loggedMiles.ratePerMile.max || 0}
                        onChange={(e) => {
                          if (e.target.value >= 0 && isEdit) {
                            handleChange("ratePerMile", {
                              ...loggedMiles.ratePerMile,
                              max: Number(e.target.value),
                            });
                          }
                        }}
                        name={"regularHourlyRate"}
                        placeholder="Max limit $"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {loggedMiles.reimbursementRate && (
              <>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "right" }}
                >
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
                      Logged budget per mile:
                    </CustomTypographyBold>
                    <CustomTypographyBold
                      weight={600}
                      color={"text.black"}
                      fontSize={"14px"}
                    >
                      ${loggedMiles.ratePerMile.min || 0} - $
                      {loggedMiles.ratePerMile.max || 0}
                    </CustomTypographyBold>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default LoggedMiles;
