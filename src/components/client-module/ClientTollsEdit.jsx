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

const ClientTollsEdit = ({ data, setData }) => {
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
          {" "}
          Cost covered?
        </CustomTypographyBold>
      </Grid>
      <Grid item xs={9}>
        <Box sx={{ width: "100%" }}>
          <RadioGroup
            row
            value={getFieldValue("tolls_cost_covered") === "Yes" ? "yes" : "no"}
            onChange={(e) => {
              changeHandler(
                "tolls_cost_covered",
                e.target.value === "yes" ? "Yes" : "No"
              );
              if (e.target.value !== "yes") {
                changeHandler("toll_per_day_min_budget", 0);
              }
            }}
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
      {getFieldValue("tolls_cost_covered") === "Yes" ? (
        <>
          <Grid item xs={3}>
            <CustomTypographyBold
              weight={400}
              textTransform={"inherit"}
              color={"text.black"}
              fontSize={"14px"}
            >
              Budget for tolls
            </CustomTypographyBold>
          </Grid>
          <Grid item xs={9}>
            <CommonInputField
              name="specify_hotel"
              placeholder="$"
              value={getFieldValue("toll_per_day_min_budget")}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value))
                  changeHandler("toll_per_day_min_budget", value);
              }}
            />
          </Grid>
        </>
      ) : (
        ""
      )}
      {/* <Grid item xs={9}>
        <Box sx={{ width: "100%", display: "flex", gap: 1 }}>
          <InputWithText
            text="Min limit $"
            value={getFieldValue("toll_per_day_min_budget")}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value))
                changeHandler("toll_per_day_min_budget", value);
            }}
            placeholder="Min limit $"
          />
          <InputWithText
            text="Max limit $"
            value={getFieldValue("toll_per_day_max_budget")}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value))
                changeHandler("toll_per_day_max_budget", value);
            }}
            placeholder="Max limit $"
          />
        </Box>
      </Grid> */}

      {/* <Grid item xs={12} md={3}>
        <CustomTypographyBold
          weight={400}
          textTransform={"inherit"}
          color={"text.black"}
          fontSize={"14px"}
        >
          total days
        </CustomTypographyBold>
      </Grid>
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
            value={getFieldValue("total_toll_days") || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) changeHandler("total_toll_days", value);
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
                  "total_toll_days",
                  Math.max(0, getFieldValue("total_toll_days") - 1)
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
                  "total_toll_days",
                  getFieldValue("total_toll_days") + 1
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
      </Grid> */}
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
            Total tolls budget:
          </CustomTypographyBold>
          <CustomTypographyBold
            weight={600}
            color={"text.black"}
            fontSize={"14px"}
          >
            ${Number(getFieldValue("toll_per_day_min_budget"))}
          </CustomTypographyBold>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ClientTollsEdit;
