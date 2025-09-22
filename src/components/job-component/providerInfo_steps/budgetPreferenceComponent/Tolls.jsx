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

const Tolls = ({ isEdit }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const { tolls } = useSelector((state) => state.budgetPreferences);

  const handleChange = (field, value) => {
    if (field === "reimbursementRate" && !value) {
      dispatch(
        updateSection({
          section: "tolls",
          field: "ratePerMile",
          value: { min: 0, max: 0 },
        })
      );
    }
    dispatch(updateSection({ section: "tolls", field, value }));
  };
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Grid item xs={6} md={1.2}>
          <CustomTypographyBold
            //color={"text.primary"}
            color={darkMode == "dark" ? "#6D747B" : "#71869D"}
            fontSize={"15.78px"}
          >
            tolls:
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
            Will the cost of tolls be covered?
          </CustomTypographyBold>
        </Grid>
        <Grid item xs={12} md={6}>
          <RadioGroup
            row
            value={tolls.covered ? "yes" : "no"}
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
        {tolls.covered && (
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
                value={tolls.reimbursementRate ? "yes" : "no"}
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

            {tolls.reimbursementRate && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTypographyBold
                    weight={400}
                    textTransform={"inherit"}
                    color={"text.black"}
                    fontSize={"14px"}
                  >
                    Toll budget per day
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <InputWithText
                        disabled={!isEdit}
                        text="Min limit $"
                        value={tolls?.ratePerMile?.min || 0}
                        onChange={(e) => {
                          if (e.target.value >= 0 && isEdit) {
                            handleChange("ratePerMile", {
                              ...tolls.ratePerMile,
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
                        disabled={!isEdit}
                        text="Max limit $"
                        value={tolls.ratePerMile.max || 0}
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            handleChange("ratePerMile", {
                              ...tolls.ratePerMile,
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
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Tolls;
