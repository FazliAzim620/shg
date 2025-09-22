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
import { CommonInputField } from "../../CreateJobModal";
import InputWithText from "../../../inputs/InputWithText";

const AirfareSection = ({ isEdit }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const { airfare } = useSelector((state) => state.budgetPreferences);

  const handleChange = (field, value) => {
    dispatch(updateSection({ section: "airfare", field, value }));
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
            Airfare:
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
            Will the cost of airfare be covered?
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            row
            value={airfare.covered ? "yes" : "no"}
            onChange={(e) =>
              isEdit ? handleChange("covered", e.target.value === "yes") : ""
            }
          >
            <FormControlLabel
              value="yes"
              control={
                <Radio
                  size="small"
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
        {airfare?.covered && (
          <>
            <Grid item xs={12} md={6}>
              <CustomTypographyBold
                weight={400}
                textTransform={"inherit"}
                color={"text.black"}
                fontSize={"14px"}
              >
                If yes, will the airfare be reimbursed or prepaid?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={airfare.reimbursementType}
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
                    bgcolor: darkMode == "light" ? "#F6F7FA" : "#333",
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
                Are there any specific airlines or booking classes that must be
                used?
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup
                row
                value={airfare.specificAirlines ? "yes" : "no"}
                onChange={(e) =>
                  isEdit
                    ? handleChange("specificAirlines", e.target.value === "yes")
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
            {airfare.specificAirlines && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTypographyBold
                    weight={400}
                    textTransform={"inherit"}
                    color={"text.black"}
                    fontSize={"14px"}
                  >
                    If yes, please select the preferred airlines or booking
                    classes
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CommonSelect
                    name="medicalSpecialty"
                    value={airfare.preferredClass || ""}
                    handleChange={(e) =>
                      handleChange("preferredClass", e.target.value)
                    }
                    placeholder="Select a Class"
                    options={[
                      { value: "economy", label: "Economy" },
                      { value: "business", label: "Business" },
                      { value: "first_class", label: "First Class" },
                    ]}
                    // height={"2.5"}
                    disabled={!isEdit}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTypographyBold
                    weight={400}
                    textTransform={"inherit"}
                    color={"text.black"}
                    fontSize={"14px"}
                  >
                    Airline Name
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CommonInputField
                    value={airfare.airline}
                    onChange={(e) => {
                      if (e.target.value && isEdit) {
                        handleChange("airline", e.target.value);
                      }
                    }}
                    name={"regularHourlyRate"}
                    placeholder="e.g Qatar Airways"
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
                Roundtrip airfare budget
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputWithText
                    text="Min limit $"
                    value={airfare.roundtripBudget.min || 0}
                    onChange={(e) => {
                      if (e.target.value >= 0 && isEdit) {
                        handleChange("roundtripBudget", {
                          ...airfare.roundtripBudget,
                          min: Number(e.target.value),
                        });
                      }
                    }}
                    name={"regularHourlyRate"}
                    placeholder="Min limit $"
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputWithText
                    text="Max limit $"
                    value={airfare.roundtripBudget.max || 0}
                    onChange={(e) => {
                      if (e.target.value >= 0 && isEdit) {
                        handleChange("roundtripBudget", {
                          ...airfare.roundtripBudget,
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
            {airfare.covered && (
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
                      Total airfare budget:
                    </CustomTypographyBold>
                    <CustomTypographyBold
                      weight={600}
                      color={"text.black"}
                      fontSize={"14px"}
                    >
                      ${airfare.roundtripBudget.min} - $
                      {airfare.roundtripBudget.max}
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

export default AirfareSection;
