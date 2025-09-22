import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import CustomTypographyBold from "../CustomTypographyBold";
import { useSelector, useDispatch } from "react-redux";
import { updateBudgetPreferences } from "../../feature/post-job/PostJobSlice";
import {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
} from "../Images";
const BudgetPreferencesTab = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  const { airfare, hotel, car, mileage, gas, parking, overbudget, tolls } =
    useSelector((state) => state.postJob);

  const handleChange = (field, value) => {
    dispatch(updateBudgetPreferences({ field, value }));
  };

  const budgetFields = [
    {
      icon: icon8,
      title: "Airfare",
      question: "Will the cost of airfare be covered?",
      field: "airfare",
      value: airfare,
    },
    {
      icon: icon1,
      title: "Hotel",
      question: "Does this client offer hotel accommodation?",
      field: "hotel",
      value: hotel,
    },
    {
      icon: icon2,
      title: "Car",
      question: "Does this client provide car rental?",
      field: "car",
      value: car,
    },
    {
      icon: icon3,
      title: "Logged miles",
      question:
        "Does this client cover mileage reimbursement for personal vehicle use?",
      field: "mileage",
      value: mileage,
    },
    //-----------------

    {
      icon: icon7,
      title: "Tolls",
      question: "Does this client cover toll expenses?",
      field: "tolls",
      value: tolls,
    },

    {
      icon: icon4,
      title: "Gas",
      field: "gas",
      message: "Does this client cover gas or fuel expenses?",
      value: gas,
    },
    {
      icon: icon5,
      title: "Parking fee",
      message: "Does this client cover parking fee expenses?",
      field: "parking",
      value: parking,
    },
    {
      icon: icon6,
      title: "Over Budget Travel",
      message: "Will clients approve overbudget travel costs?",
      field: "overbudget",
      value: overbudget,
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {budgetFields.map(({ icon, title, question, field, value }) => (
        <Section
          key={field}
          icon={icon}
          field={field}
          darkMode={darkMode}
          title={title}
          question={question}
          value={value}
          //   onChange={(newValue) => handleChange(field, newValue)}
          onChange={handleChange}
        />
      ))}
    </Box>
  );
};

const Section = ({
  icon,
  title,
  question,
  value,
  onChange,
  field,
  darkMode,
}) => (
  <Box sx={{ mt: 4 }}>
    <Grid container sx={{ display: "flex", alignItems: "center" }}>
      <Grid item xs={6} md={3} sx={{ display: "flex", alignItems: "center" }}>
        <Box component={"img"} src={icon} alt="icon" />
        <CustomTypographyBold
          color={darkMode === "dark" ? "#6D747B" : "#71869D"}
          fontSize={"15.78px"}
        >
          {title}:
        </CustomTypographyBold>
      </Grid>
      <Grid item xs={6} md={9}>
        <Divider
          sx={{
            borderColor:
              darkMode === "dark"
                ? "rgba(255, 255, 255, .7)"
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
          {question}
        </CustomTypographyBold>
      </Grid>
      <Grid item xs={12} md={6}>
        <RadioGroup
          row
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
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
    </Grid>
  </Box>
);

const StyledRadio = ({ darkMode }) => (
  <Radio
    size="small"
    sx={{
      color: darkMode === "dark" ? "rgba(255, 255, 255, 0.7)" : "#71869D",
      "&.Mui-checked": { color: "#377dff" },
    }}
  />
);

const StyledLabel = ({ text }) => (
  <Typography variant="body2" sx={{ fontSize: ".875rem", lineHeight: 1.5 }}>
    {text}
  </Typography>
);

const styledFormControlLabel = (darkMode) => ({
  bgcolor: darkMode === "light" ? "#F6F7FA" : "#333",
  width: "32%",
  m: 0,
  borderRadius: ".3125rem",
  minHeight: "44px",
});

export default BudgetPreferencesTab;
