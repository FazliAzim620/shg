import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useSelector } from "react-redux";
import { CommonSelect } from "../job-component/CommonSelect";
import { getCountries, getStates } from "../../api_request";
import { updateClientAddress } from "../../feature/client-module/clientSlice";
import API from "../../API";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ClientBillingAddressDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  const { currentClient } = useSelector((state) => state.clientBasicInfo);

  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(
    currentClient?.addresses?.find((current) => current?.type === "billing")
  );

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "country_id",
      "state_id",
      "city",
      "address_line_1",
      "zip_code",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let url = `/api/edit-client`;
      setisLoading(true);
      const form = new FormData();
      form.append("id", formData?.id);
      form.append("data_type", "billing_address");
      form.append("country_id", formData?.country_id);
      form.append("state_id", formData?.state_id);
      form.append("city", formData?.city);
      form.append("address_line_1", formData?.address_line_1);
      form.append("address_line_2", formData?.address_line_2 || "");
      form.append("zip_code", formData?.zip_code);

      const response = await API.post(url, form);
      if (response?.data?.success) {
        dispatch(updateClientAddress(response?.data?.data));
        const url = currentClient?.name?.toLowerCase()?.replace(/ /g, "-");
        const clientUrl = `/${url}/details/${param.id}`;
        navigate(clientUrl);
        setFormData(response?.data?.data);
        setisLoading(false);
        setIsEditing(false);
      }
    } catch (error) {
      setisLoading(false);
      console.log(error);
    }
  };

  const handleCancel = () => {
    setFormData(
      currentClient?.addresses?.find((current) => current?.type === "billing")
    );
    setErrors({});
    setIsEditing(false);
  };

  const getStatesHandler = async (id) => {
    try {
      const resp = await getStates(id);
      if (resp?.data?.success) {
        setStates(resp?.data?.data);
        if (formData?.state) {
          setFormData((prev) => ({
            ...prev,
            state_name: resp?.data?.data?.find(
              (list) => list?.id === formData?.state
            ),
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country_id") {
      getStatesHandler(value);
      setFormData((prevData) => ({
        ...prevData,
        state_id: "",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getCountriesHandler = async () => {
    try {
      const resp = await getCountries();
      if (resp?.data?.success) {
        setCountries(resp?.data?.data);
        if (formData?.country) {
          setFormData((prev) => ({
            ...prev,
            country_name: resp?.data?.data?.find(
              (list) => list?.id === formData?.country
            ),
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (formData?.country) {
      getStatesHandler(formData?.country_id);
    }
    getCountriesHandler();
  }, []);

  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const filterStates = states?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const renderField = (label, name, value) => {
    return isEditing && permissions?.includes("update clients info") ? (
      name === "country_id" ? (
        <Box>
          <CommonSelect
            height={"2.6rem"}
            error={Boolean(errors[name])}
            options={filterCountries}
            name={"country_id"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={Number(formData?.country_id)}
            placeholder="Select Country"
            type="text"
          />
          {errors[name] && (
            <FormHelperText error>{errors[name]}</FormHelperText>
          )}
        </Box>
      ) : name === "state_id" ? (
        <Box>
          <CommonSelect
            height={"2.6rem"}
            error={Boolean(errors[name])}
            options={filterStates}
            name={"state_id"}
            handleChange={handleChange}
            fullWidth
            margin="normal"
            value={Number(formData?.state_id)}
            placeholder="Select State"
            type="text"
          />
          {errors[name] && (
            <FormHelperText error>{errors[name]}</FormHelperText>
          )}
        </Box>
      ) : (
        <Box>
          <TextField
            fullWidth
            name={name}
            value={value && value !== "null" ? value : "" || ""}
            onChange={handleChange}
            variant="outlined"
            placeholder={label}
            error={Boolean(errors[name])}
            sx={{
              borderRadius: "5px",
              border: errors[name] ? "1px solid red" : "",
              bgcolor: isLightMode ? "#F6F7Fa" : "#333",
              color: isLightMode ? "black" : "white",
              height: errors[name] ? "2.75rem" : "2.75rem",
              "& fieldset": { border: "none" },
              "& .MuiOutlinedInput-root.Mui-focused": {
                height: errors[name] ? "3.2rem" : "2.75rem",
                boxShadow:
                  "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                backgroundColor: isLightMode ? "white" : "#25282A",
              },
              input: {
                color: isLightMode ? "black" : "white",
              },
            }}
          />
          {errors[name] && (
            <FormHelperText error>{errors[name]}</FormHelperText>
          )}
        </Box>
      )
    ) : (
      <Typography
        variant="body1"
        sx={{ textAlign: "left", fontSize: "0.875rem" }}
      >
        {name === "country_id" || name === "state_id"
          ? value?.name
          : value && value !== "null"
          ? value
          : "" || "--"}
      </Typography>
    );
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, pb: isEditing ? 2 : 0.5 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "21px",
            color: "text.black",
          }}
        >
          Billing address
        </Typography>
        {!isEditing && permissions?.includes("update clients info") && (
          <Button
            onClick={handleEdit}
            variant="text"
            sx={{ px: 0, textTransform: "none", mx: 0, minWidth: "auto" }}
          >
            Edit
          </Button>
        )}
      </Box>
      <Divider sx={{ opacity: 0.6 }} />

      <Grid container spacing={3} sx={{ px: 3, pt: 2 }}>
        <Grid item xs={3}>
          <Typography
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Country <span style={{ color: "red" }}>*</span>{" "}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {renderField(
            "Country name",
            "country_id",
            isEditing ? formData.country_id : formData?.country
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            State <span style={{ color: "red" }}>*</span>{" "}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {renderField(
            "State",
            "state_id",
            isEditing ? formData.state_id : formData?.state
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            City <span style={{ color: "red" }}>*</span>{" "}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {renderField("City name", "city", formData?.city)}
        </Grid>

        <Grid item xs={3}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Address (Line 1) <span style={{ color: "red" }}>*</span>{" "}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {renderField(
            "Address line 1",
            "address_line_1",
            formData?.address_line_1
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Address (Line 2)
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {renderField(
            "Address line 2 (Optional)",
            "address_line_2",
            formData?.address_line_2
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.black",
              fontWeight: 400,
              fontSize: "0.85rem",
              pt: 0.2,
            }}
          >
            Zip code <span style={{ color: "red" }}>*</span>{" "}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {renderField("Zip code", "zip_code", formData?.zip_code)}
        </Grid>
      </Grid>
      {isEditing && permissions?.includes("update clients info") && (
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1} mr={3}>
          <Button
            onClick={handleCancel}
            sx={{
              mr: 2,
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "5px 16px",
              minWidth: 0,
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                color: "text.btn_blue",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{
              minWidth: "120px",
              textTransform: "capitalize",
              bgcolor: "background.btn_blue",
            }}
          >
            {isLoading ? (
              <CircularProgress size={18} sx={{ color: "inherit" }} />
            ) : (
              "Save changes"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ClientBillingAddressDetails;
