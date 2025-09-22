import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Divider,
  Input,
} from "@mui/material";
import { Add, AttachMoneyOutlined, Remove } from "@mui/icons-material";
import { updateSection } from "../../../../feature/budgetPreferenceSlice";
import CustomTypographyBold from "../../../CustomTypographyBold";
import { CommonSelect } from "../../CommonSelect";

import InputWithText from "../../../inputs/InputWithText";
import { CommonInputField } from "../../CreateJobModal";

const CarRentalSection = ({ isEdit }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const carRental = useSelector((state) => state.budgetPreferences.carRental);

  const handleChange = (field, value) => {
    dispatch(updateSection({ section: "carRental", field, value }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Grid item xs={6} md={1.2}>
          <CustomTypographyBold
            //color={"text.primary"}
            //fontSize={"14px"}
            color={darkMode == "dark" ? "#6D747B" : "#71869D"}
            fontSize={"15.78px"}
            textTransform={"none"}
          >
            Car rental:
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={6} md={10.8}>
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
            Will the cost of car rentals be covered?
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            row
            value={carRental.covered ? "yes" : "no"}
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
              control={<Radio size="small" />}
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
        {carRental.covered && (
          <>
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                Will the provider use their own car or rent a car?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={carRental.ownCar ? "own" : "rent"}
                onChange={(e) =>
                  isEdit ? handleChange("ownCar", e.target.value === "own") : ""
                }
              >
                <FormControlLabel
                  value="own"
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
                      Own Car
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
                  value="rent"
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
                      Rent a car
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
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                Are there any preferred car rental companies?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={carRental.preferredCompanies ? "yes" : "no"}
                onChange={(e) =>
                  isEdit
                    ? handleChange(
                        "preferredCompanies",
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
            {carRental.preferredCompanies && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTypographyBold
                    weight={400}
                    textTransform={"inherit"}
                    color={"text.black"}
                    fontSize={"14px"}
                  >
                    If yes, please specify
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CommonInputField
                    disabled={!isEdit}
                    value={carRental.specificCompanies}
                    placeholder="e.g., Ubar"
                    onChange={(e) =>
                      handleChange("specificCompanies", e.target.value)
                    }
                    type="text"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                Are there any limits on rental car classes?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={carRental.rentalCarClasses ? "yes" : "no"}
                onChange={(e) =>
                  isEdit
                    ? handleChange("rentalCarClasses", e.target.value === "yes")
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
            {carRental.rentalCarClasses && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTypographyBold
                    weight={400}
                    textTransform={"inherit"}
                    color={"text.black"}
                    fontSize={"14px"}
                  >
                    If yes, please specify
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CommonInputField
                    disabled={!isEdit}
                    value={carRental.specificCarRentClasses}
                    placeholder=" specify"
                    onChange={(e) =>
                      handleChange("specificCarRentClasses", e.target.value)
                    }
                    type="text"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                Car rental budget per day
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputWithText
                    text="Min limit $"
                    value={carRental?.budgetPerDay?.min || 0}
                    onChange={(e) => {
                      if (e.target.value >= 0 && isEdit) {
                        handleChange("budgetPerDay", {
                          ...carRental.budgetPerDay,
                          min: Number(e.target.value),
                        });
                      }
                    }}
                    name={"budgetPerDay"}
                    placeholder="Min limit $"
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputWithText
                    text="Max limit $"
                    value={carRental.budgetPerDay.max || 0}
                    onChange={(e) => {
                      if (e.target.value >= 0 && isEdit) {
                        handleChange("budgetPerDay", {
                          ...carRental.budgetPerDay,
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
      </Grid>
    </Box>
  );
};

export default CarRentalSection;
