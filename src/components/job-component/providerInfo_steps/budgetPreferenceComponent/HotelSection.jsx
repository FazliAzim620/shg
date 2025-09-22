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

const HotelSection = ({ isEdit }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const hotel = useSelector((state) => state.budgetPreferences.hotel);

  const handleChange = (field, value) => {
    dispatch(updateSection({ section: "hotel", field, value }));
  };
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Grid item xs={6} md={1.2}>
          <CustomTypographyBold
            //color={"text.primary"}

            color={darkMode == "dark" ? "#6D747B" : "#71869D"}
            fontSize={"15.78px"}
            textTransform={"none"}
          >
            Hotel:
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
            Will the cost of hotel accommodations be covered?
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            row
            value={hotel.covered ? "yes" : "no"}
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
              }}
            />
          </RadioGroup>
        </Grid>
        {hotel.covered && (
          <>
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                If yes, will the hotel booking be prepaid or reimbursed later?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={hotel.reimbursementType}
                onChange={(e) =>
                  isEdit
                    ? handleChange("reimbursementType", e.target.value)
                    : ""
                }
              >
                <FormControlLabel
                  value="reimbursed_later"
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
                      Reimburse later
                    </Typography>
                  }
                  sx={{
                    bgcolor: darkMode == "light" ? "#F7F9FC" : "#333",
                    width: "49%",
                    m: "0px 3px 0px 0px",
                    borderRadius: ".3125rem",
                    minHeight: "44px",
                  }}
                />
                <FormControlLabel
                  value="prepaid"
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
                      Prepaid
                    </Typography>
                  }
                  sx={{
                    bgcolor: darkMode == "light" ? "#F6F7FA" : "#333",
                    width: "50%",
                    m: 0,
                    borderRadius: ".3125rem",
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
                Are there preferred hotels or booking platforms?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={hotel.preferredHotels ? "yes" : "no"}
                onChange={(e) =>
                  isEdit
                    ? handleChange("preferredHotels", e.target.value === "yes")
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
                  }}
                />
              </RadioGroup>
            </Grid>
            {hotel.preferredHotels && (
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
                    value={hotel.specificHotel}
                    placeholder="e.g., Five star"
                    onChange={(e) =>
                      handleChange("specificHotel", e.target.value)
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
                Lodging budget limit per night
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputWithText
                    text="Min limit $"
                    value={hotel?.budgetPerNight?.min || 0}
                    onChange={(e) => {
                      if (e.target.value >= 0 && isEdit) {
                        handleChange("budgetPerNight", {
                          ...hotel.budgetPerNight,
                          min: Number(e.target.value),
                        });
                      }
                    }}
                    name={"budgetPerNight"}
                    placeholder="Min limit $"
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputWithText
                    text="Max limit $"
                    value={hotel.budgetPerNight.max || 0}
                    onChange={(e) => {
                      if (e.target.value >= 0 && isEdit) {
                        handleChange("budgetPerNight", {
                          ...hotel.budgetPerNight,
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
            {hotel.covered && (
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
                      Total hotel budget:
                    </CustomTypographyBold>
                    <CustomTypographyBold
                      weight={600}
                      color={"text.black"}
                      fontSize={"14px"}
                    >
                      ${hotel.budgetPerNight.min * hotel.totalNights} - $
                      {hotel.budgetPerNight.max * hotel.totalNights}
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

export default HotelSection;
