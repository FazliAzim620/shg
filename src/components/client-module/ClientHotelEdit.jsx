import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../CustomTypographyBold";
import { CommonSelect } from "../job-component/CommonSelect";
import InputWithText from "../inputs/InputWithText";
import { Add, Remove } from "@mui/icons-material";
import { CommonInputField } from "../job-component/CreateJobModal";

const ClientHotelEdit = ({ data, setData }) => {
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
            value={getFieldValue("hotel_cost_covered") === "Yes" ? "yes" : "no"}
            onChange={(e) =>
              changeHandler(
                "hotel_cost_covered",
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

      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={3} mt={1}>
          <CustomTypographyBold
            weight={400}
            textTransform={"inherit"}
            color={"text.black"}
            fontSize={"14px"}
          >
            Payment terms
          </CustomTypographyBold>
        </Grid>
      )}
      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={9}>
          <Box sx={{ width: "100%" }}>
            <RadioGroup
              row
              value={getFieldValue("hotel_reimbursed_prepaid")}
              onChange={(e) =>
                changeHandler("hotel_reimbursed_prepaid", e.target.value)
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
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ fontSize: ".875rem", lineHeight: 1.5 }}
                  >
                    Reimbursed Later
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

      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={3} mt={1}>
          <CustomTypographyBold
            weight={400}
            textTransform={"inherit"}
            color={"text.black"}
            fontSize={"14px"}
          >
            Preferred Hotel
          </CustomTypographyBold>
        </Grid>
      )}
      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={9}>
          <Box sx={{ width: "100%" }}>
            <RadioGroup
              row
              value={getFieldValue("preferred_hotel") === 1 ? "yes" : "no"}
              onChange={(e) =>
                changeHandler(
                  "preferred_hotel",
                  e.target.value === "yes" ? 1 : 0
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
      {getFieldValue("hotel_cost_covered") === "Yes" &&
        getFieldValue("preferred_hotel") === 1 && (
          <Grid item xs={3} mt={1}>
            <CustomTypographyBold
              weight={400}
              textTransform={"inherit"}
              color={"text.black"}
              fontSize={"14px"}
            >
              Specify hotel
            </CustomTypographyBold>
          </Grid>
        )}
      {getFieldValue("hotel_cost_covered") === "Yes" &&
        getFieldValue("preferred_hotel") === 1 && (
          <Grid item xs={9}>
            <Box sx={{ width: "100%" }}>
              <CommonInputField
                name="specify_hotel"
                placeholder="4 star"
                value={getFieldValue("specify_hotel") || ""}
                onChange={(e) => {
                  changeHandler("specify_hotel", e.target.value);
                }}
              />
            </Box>
          </Grid>
        )}

      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={3} mt={1}>
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
      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={9}>
          <Box sx={{ width: "100%", display: "flex", gap: 1 }}>
            <InputWithText
              text="Min limit $"
              value={getFieldValue("hotel_per_night_min_budget")}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value))
                  changeHandler("hotel_per_night_min_budget", value);
              }}
              placeholder="Min limit $"
            />
            <InputWithText
              text="Max limit $"
              value={getFieldValue("hotel_per_night_max_budget")}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value))
                  changeHandler("hotel_per_night_max_budget", value);
              }}
              placeholder="Max limit $"
            />
          </Box>
        </Grid>
      )}
      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={12} md={3} mt={1}>
          <CustomTypographyBold
            weight={400}
            textTransform={"inherit"}
            color={"text.black"}
            fontSize={"14px"}
          >
            Total Nights
          </CustomTypographyBold>
        </Grid>
      )}
      {getFieldValue("hotel_cost_covered") === "Yes" && (
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: darkMode == "light" ? "#F6F7FA" : "#333",
              p: 1,
              borderRadius: ".3125rem",
              height: "2.5rem",
            }}
          >
            <Input
              variant="standard"
              value={getFieldValue("total_nights") || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) changeHandler("total_nights", value);
              }}
              sx={{
                px: 1,
                "&:hover": {
                  bgcolor: "white",
                },
              }}
              disableUnderline={true}
            />
            <Box>
              <Button
                size="small"
                onClick={() =>
                  changeHandler(
                    "total_nights",
                    Math.max(0, getFieldValue("total_nights") - 1)
                  )
                }
                sx={{
                  bgcolor: darkMode == "light" ? "#fff" : "#333",
                  color: "text.primary",
                  borderRadius: "50%",
                  height: "30px",
                  mr: 1,
                  minWidth: "5px",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <Remove />
              </Button>

              <Button
                size="small"
                onClick={() =>
                  changeHandler(
                    "total_nights",
                    getFieldValue("total_nights") + 1
                  )
                }
                sx={{
                  bgcolor: darkMode == "light" ? "#fff" : "#333",
                  borderRadius: "50%",
                  color: "text.primary",
                  height: "30px",
                  minWidth: "5px",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                <Add />
              </Button>
            </Box>
          </Box>
        </Grid>
      )}
      {getFieldValue("hotel_cost_covered") === "Yes" && (
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
              Total budget:
            </CustomTypographyBold>
            <CustomTypographyBold
              weight={600}
              color={"text.black"}
              fontSize={"14px"}
            >
              $
              {getFieldValue("hotel_per_night_min_budget") *
                getFieldValue("total_nights")}{" "}
              - $
              {getFieldValue("hotel_per_night_max_budget") *
                getFieldValue("total_nights")}
            </CustomTypographyBold>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ClientHotelEdit;
