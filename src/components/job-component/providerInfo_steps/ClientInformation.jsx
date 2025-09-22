import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Divider,
  CardContent,
  CardHeader,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  resetClientId,
  resetField,
  updateField,
} from "../../../feature/clientSlice";
import {
  clientInfoForm,
  fetchCountries,
  fetchJobDetail,
  fetchSiteStates,
  fetchStates,
} from "../../../thunkOperation/job_management/providerInfoStep";
import { CommonInputField } from "../CreateJobModal";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import {
  AttachMoneyOutlined,
  Close,
  SaveAltOutlined,
} from "@mui/icons-material";
import { CommonSelect } from "../CommonSelect";
import AddressForm from "./AddressForm";
import ClientInformationSectionDetail from "./ClientInformationDetail";
import { useParams } from "react-router-dom";
import CustomBadge from "../../CustomBadge";
import CustomSkeleton from "./CustomSkeleton";
import { fetchClientsInfo } from "../../../thunkOperation/job_management/states";
import { checkEmailExists, scrollToTop } from "../../../util";
import { updateNewUserDataField } from "../../../feature/jobSlice";
import { BpCheckbox } from "../../common/CustomizeCHeckbox";
import { calculateMonthsBetweenDates } from "../../../api_request";
const sections = [
  { id: "basicInfo", title: "Basic Information" },
  { id: "billingAddress", title: "Billing Address" },
  { id: "siteAddress", title: "Site Address" },
  { id: "hourlyRate", title: "Rate" },
  { id: "jobDuration", title: "Job Duration" },
  { id: "privilegeDates", title: "Privilege Dates" },
  { id: "contractDuration", title: "Contract Duration" },
];

const ClientInformation = () => {
  const [clientInfo, setClientInfo] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCurrentData, setSelectedCurrentData] = useState([]);
  const [requiredFields, setRequiredFields] = useState([]);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  // ==================== get client infromation =================
  const getClients = async () => {
    const response = await dispatch(fetchClientsInfo());
    setClientInfo(response?.payload);
  };
  useEffect(() => {
    getClients();
    dispatch(fetchCountries());
    dispatch(updateField({ field: "job_id", value: newUserData?.id }));
    // dispatch(fetchJobDetail(newUserData?.id));
    if (params.id !== newUserData?.id) {
      dispatch(resetClientId());
    }
  }, []);
  const darkMode = useSelector((state) => state.theme.mode);
  const { countries, states, isLoading, status, newClientData, siteStates } =
    useSelector((state) => state.client);

  // ===================================existingClientsOptoins=====================================
  const existingClientsOptoins = clientInfo?.map((option) => ({
    value: option.id,
    label: option.email,
  }));

  const { newUserData } = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const params = useParams();
  const formData = useSelector((state) => state.client);
  const [isEdit, setIsEdit] = useState(
    newClientData?.client_id && newClientData?.client_id !== null ? false : true
  );

  const [error, setError] = useState({
    name: "",
    addNew: "",
    email: "",
    regularRate: "",
    holidayRate: "",
    startDate: "",
    endDate: "",
    contract_duration_start_date: "",
    contract_duration_end_date: "",
    privilege_start_date: "",
    privilege_end_date: "",
  });
  const [isPossible, setIsPossible] = useState(true);
  const handleSitePhoneNumber = (value) => {
    if (value && !isPossiblePhoneNumber(value)) {
      setIsPossible(false);
    } else {
      setIsPossible(true);
    }
    dispatch(updateField({ field: "sitePhone", value: value }));
  };
  const handlePhoneNumber = (value) => {
    if (value && !isPossiblePhoneNumber(value)) {
      setIsPossible(false);
    } else {
      setIsPossible(true);
    }
    dispatch(updateField({ field: "phone", value: value }));
  };
  const handleChange = (e) => {
    setRequiredFields(requiredFields?.filter((item) => item !== e.target.name));
    const { name, value } = e.target;
    console.log("name", name);
    if (name === "existingClient") {
      const currentClient = clientInfo?.filter(
        (client) => client?.id === value
      );
      // setSelectedCurrentData(currentClient?.[0]);
      handleSelect(currentClient?.[0]);
    }

    if (name === "email") {
      // value;
      // setShowDropDown(true);
      const filtered = clientInfo?.filter((provider) =>
        provider?.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
    // ==================== errors being cleared on typing input ===============
    if (name === "clientName") {
      setError((prevError) => ({ ...prevError, name: "", addNew: "" }));
    }
    if (name === "email") {
      setError((prevError) => ({ ...prevError, email: "" }));
    }
    if (name === "regularRate") {
      setError((prevError) => ({ ...prevError, regularRate: "" }));
    }
    if (name === "holidayRate") {
      setError((prevError) => ({ ...prevError, holidayRate: "" }));
    }
    if (name === "startDate") {
      setError((prevError) => ({ ...prevError, startDate: "" }));
    }
    if (name === "endDate") {
      setError((prevError) => ({ ...prevError, endDate: "" }));
    }

    if (name === "contract_duration_start_date") {
      setError((prevError) => ({
        ...prevError,
        contract_duration_start_date: "",
        contract_duration_end_date: "",
      }));
    }

    if (name === "contract_duration_end_date") {
      setError((prevError) => ({
        ...prevError,
        contract_duration_end_date: "",
        contract_duration_start_date: "",
      }));
    }
    if (name === "privilege_start_date") {
      setError((prevError) => ({ ...prevError, privilege_start_date: "" }));
    }
    if (name === "privilege_end_date") {
      setError((prevError) => ({ ...prevError, privilege_end_date: "" }));
    }

    // ==================== errors being cleared on typing input  for address ===============
    if (name === "billingAddress") {
      if (value) {
        dispatch(fetchStates(value));
      } else {
        dispatch(updateField({ field: "states", value: [] }));
        dispatch(updateField({ field: "billingState", value: "" }));
      }
    }
    if (name === "siteAddress") {
      if (value) {
        dispatch(fetchSiteStates(value));
      } else {
        dispatch(updateField({ field: "siteStates", value: [] }));
        dispatch(updateField({ field: "siteState", value: "" }));
      }
    }
    // Handle contract dates when project start and end date are provided
    if (name === "startDate" || name === "endDate") {
      const updatedErrors = { ...error };

      // Assuming projectStartDate and projectEndDate are linked

      updatedErrors.contract_duration_start_date = "";
      updatedErrors.contract_duration_end_date = "";
      dispatch(
        updateField({ field: "contract_duration_start_date", value: 1 })
      );
      dispatch(
        updateField({
          field: "contract_duration_end_date",
          value: calculateMonthsBetweenDates(formData.startDate, value),
        })
      );

      setError(updatedErrors);
    }

    dispatch(updateField({ field: name, value: value }));
  };
  const resetFieldHandler = () => {
    setIsEdit(false);
    // dispatch(resetField());
    setError({
      addNew: "",
      name: "",
      email: "",
      regularRate: "",
      holidayRate: "",
      startDate: null,
      endDate: null,
      contract_duration_start_date: "",
      contract_duration_end_date: "",
      privilege_start_date: null,
      privilege_end_date: null,
    });
  };
  const handleSubmit = async (e) => {
    setShowDropDown(false);
    let hasError = false;
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate Name
    if (!formData.clientName) {
      setError((prevError) => ({
        ...prevError,
        name: "Client is required! Please atleast select from existing or add new.",
      }));
      hasError = true;
      scrollToTop();
    } else if (formData.clientName.length < 3) {
      setError((prevError) => ({
        ...prevError,
        addNew: "Name should be at least 3 characters!",
      }));
      hasError = true;
      scrollToTop();
    } else {
      setError((prevError) => ({ ...prevError, name: "" }));
    }
    // Validate email

    if (!formData.email.trim()) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required!",
      }));
      hasError = true;
      scrollToTop();
    } else if (!emailRegex.test(formData?.email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter valid Email!",
      }));
      hasError = true;
      scrollToTop();
    } else if (!formData?.client_id && !formData?.id) {
      if (checkEmailExists(formData?.email, clientInfo)) {
        setError((prevError) => ({
          ...prevError,
          email: "This email already exists!",
        }));
        hasError = true;
        scrollToTop();
      }
    } else {
      setError((prevError) => ({ ...prevError, email: "" }));
    }

    // Validate regular rate
    if (!formData.regularRate) {
      setError((prevError) => ({
        ...prevError,
        regularRate: "Regular rate is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, regularRate: "" }));
    }
    //  Validate Holiday rate
    if (!formData.holidayRate) {
      setError((prevError) => ({
        ...prevError,
        holidayRate: "Holiday rate is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, holidayRate: "" }));
    }

    let newErrors = {};
    // Check for required fields
    if (!formData.hotelName) {
      newErrors.hotelName = "Hotel name is required!";
      if (!requiredFields.includes("hotelName")) {
        requiredFields.push("hotelName");
      }
    }
    if (!formData.billingAddress) {
      if (!requiredFields.includes("billingAddress")) {
        requiredFields.push("billingAddress");
      }
    }
    if (!formData?.billingAddress1) {
      if (!requiredFields.includes("billingAddress1")) {
        requiredFields.push("billingAddress1");
      }
    }
    if (!formData?.billingCity) {
      if (!requiredFields.includes("billingCity")) {
        requiredFields.push("billingCity");
      }
      newErrors.city = "City is required!";
    }
    if (!formData?.billingState) {
      if (!requiredFields.includes("billingState")) {
        requiredFields.push("billingState");
      }
      newErrors.billingState = "State is required!";
    }

    if (!formData?.billingZipCode) {
      if (!requiredFields.includes("billingZipCode")) {
        requiredFields.push("billingZipCode");
      }
      newErrors.zipCode = "Zip code is required!";
    }
    //  Validate start date
    if (!formData.startDate) {
      setError((prevError) => ({
        ...prevError,
        startDate: "Start date is required!",
      }));
      hasError = true;
    } else if (formData.startDate >= formData.endDate) {
      setError((prevError) => ({
        ...prevError,
        startDate: "Start date must be smaller than end!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, startDate: "" }));
    }
    //  Validate start date
    if (!formData.endDate) {
      setError((prevError) => ({
        ...prevError,
        endDate: "End date is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, endDate: "" }));
    }

    //  Validate privilege - start
    if (!formData.privilege_start_date) {
      setError((prevError) => ({
        ...prevError,
        privilege_start_date: "Privilege start date is required!",
      }));
      hasError = true;
    } else if (formData.privilege_start_date >= formData.privilege_end_date) {
      setError((prevError) => ({
        ...prevError,
        privilege_start_date:
          "Privilege start date must be smaller than end date!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({
        ...prevError,
        privilege_start_date: "",
      }));
    }
    //  Validate contract duration - end
    if (!formData.privilege_end_date) {
      setError((prevError) => ({
        ...prevError,
        privilege_end_date: "Privilege end date is required!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({
        ...prevError,
        privilege_end_date: "",
      }));
    }

    //  Validate contract duration - start
    if (!formData.contract_duration_start_date) {
      setError((prevError) => ({
        ...prevError,
        contract_duration_start_date: "Start range is required!",
      }));
      hasError = true;
    } else if (Number(formData.contract_duration_start_date <= 0)) {
      setError((prevError) => ({
        ...prevError,
        contract_duration_start_date: "Must be a positive number!",
      }));
      hasError = true;
    } else if (
      Number(formData.contract_duration_start_date) >
      Number(formData.contract_duration_end_date)
    ) {
      setError((prevError) => ({
        ...prevError,
        contract_duration_start_date: "Must be smaller than end range!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({
        ...prevError,
        contract_duration_start_date: "",
      }));
    }
    //  Validate contract duration - end
    if (!formData.contract_duration_end_date) {
      setError((prevError) => ({
        ...prevError,
        contract_duration_end_date: "End range is required!",
      }));
      hasError = true;
    } else if (formData.contract_duration_end_date <= 0) {
      setError((prevError) => ({
        ...prevError,
        contract_duration_end_date: "Must be a positive number!",
      }));
      hasError = true;
    } else if (
      Number(formData.contract_duration_end_date) <
      Number(formData.contract_duration_start_date)
    ) {
      setError((prevError) => ({
        ...prevError,
        contract_duration_end_date: "Must be greater than start range!",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({
        ...prevError,
        contract_duration_end_date: "",
      }));
    }

    if (!hasError) {
      const resultAction = await dispatch(clientInfoForm(formData));
      if (clientInfoForm.fulfilled.match(resultAction)) {
        setIsEdit(false);

        const newUserId = resultAction.payload.data.id;
        dispatch(updateNewUserDataField({ field: "client_count", value: 1 }));
        // navigate(`/job-management/provider-information/${newUserId}`);
      }
    }
  };
  const handleCheckboxChange = (e) => {
    dispatch(updateField({ field: "sameAsBilling", value: e.target.checked }));
  };

  const closeEditHandler = () => {
    setIsEdit(false);
    setError({
      addNew: "",
      name: "",
      email: "",
      regularRate: "",
      holidayRate: "",
      startDate: "",
      endDate: "",
      contract_duration_start_date: "",
      contract_duration_end_date: "",
      privilege_start_date: null,
      privilege_end_date: null,
    });
  };

  const clearSelectExisitngClient = () => {
    dispatch(resetField());
    setError({
      addNew: "",
      name: "",
      email: "",
      regularRate: "",
      holidayRate: "",
      startDate: "",
      endDate: "",
      contract_duration_start_date: "",
      contract_duration_end_date: "",
      privilege_start_date: null,
      privilege_end_date: null,
    });
  };

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchJobDetail(params?.id));
    dispatch(updateField({ field: "job_id", value: params?.id }));
    setIsEdit(newClientData?.client_id ? false : true);
    // dispatch(fetchJobDetail(newUserData?.id));
    if (params.id !== newUserData?.id) {
      dispatch(resetClientId());
    }
  }, []);
  const filterState = states?.map((option) => ({
    value: option.id,
    label: option.abbrevation?`${option.name} (${option.abbrevation})`:option.name,
  }));
  const filterSiteState = siteStates?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  const editHandler = () => {
    setIsEdit(!isEdit);
    // const dispatch = useDispatch();
    // const newClientData = useSelector(state => state.client.newClientData);

    if (newClientData) {
      // Update main client info
      dispatch(
        updateField({ field: "client_id", value: newClientData.client_id })
      );
      dispatch(
        updateField({ field: "clientName", value: newClientData.client_name })
      );
      dispatch(
        updateField({ field: "email", value: newClientData.client_email })
      );
      dispatch(
        updateField({ field: "phone", value: newClientData.client_phone })
      );
      dispatch(
        updateField({
          field: "regularRate",
          value: newClientData.c_regular_hourly_rate,
        })
      );
      dispatch(
        updateField({
          field: "holidayRate",
          value: newClientData.c_holiday_hourly_rate,
        })
      );
      dispatch(
        updateField({
          field: "overTimeRate",
          value: newClientData.c_overtime_hourly_rate,
        })
      );

      // Update billing address
      const billingAddress = newClientData.addresses?.find(
        (addr) => addr.type === "billing"
      );
      if (billingAddress) {
        if (billingAddress?.country_id) {
          dispatch(fetchStates(billingAddress?.country_id));
        }
        dispatch(
          updateField({
            field: "billingAddressId",
            value: billingAddress.id || "",
          })
        );

        dispatch(
          updateField({
            field: "sameAsBilling",
            value: billingAddress.site_same_as_billing === 1,
          })
        );
        dispatch(
          updateField({ field: "billingCity", value: billingAddress.city })
        );
        dispatch(
          updateField({
            field: "billingAddress",
            value: billingAddress.country_id,
          })
        );
        dispatch(
          updateField({
            field: "billingState",
            value: billingAddress.state_id,
          })
        );
        dispatch(
          updateField({
            field: "billingAddress1",
            value: billingAddress.address_line_1,
          })
        );
        dispatch(
          updateField({
            field: "billingAddress2",
            value: billingAddress.address_line_2,
          })
        );
        dispatch(
          updateField({
            field: "billingZipCode",
            value: billingAddress.zip_code,
          })
        );
        dispatch(
          updateField({ field: "billingState", value: billingAddress.state_id })
        );
      }

      // Update site address
      const siteAddress = newClientData.addresses?.find(
        (addr) => addr.type === "site"
      );
      if (siteAddress) {
        if (!siteAddress?.site_same_as_billing) {
          dispatch(
            updateField({
              field: "siteAddressId",
              value: siteAddress.id,
            })
          );
          dispatch(updateField({ field: "siteCity", value: siteAddress.city }));
          dispatch(updateField({ field: "siteName", value: siteAddress.name }));
          dispatch(
            updateField({
              field: "siteAddress",
              value: siteAddress.country_id,
            })
          );
          if (siteAddress?.country_id) {
            dispatch(fetchSiteStates(siteAddress?.country_id));
          }
          dispatch(
            updateField({
              field: "siteState",
              value: siteAddress.state_id,
            })
          );
          dispatch(
            updateField({
              field: "siteAddress1",
              value: siteAddress.address_line_1,
            })
          );
          dispatch(
            updateField({
              field: "siteAddress2",
              value: siteAddress.address_line_2,
            })
          );
          dispatch(
            updateField({ field: "siteZipCode", value: siteAddress.zip_code })
          );
          dispatch(
            updateField({
              field: "privilege_start_date",
              value: newClientData?.privilege_start_date,
            })
          );
          dispatch(
            updateField({
              field: "privilege_end_date",
              value: newClientData?.privilege_end_date,
            })
          );
          // =======================job duration=====================
          dispatch(
            updateField({
              field: "startDate",
              value: newClientData?.project_start_date,
            })
          );
          dispatch(
            updateField({
              field: "endDate",
              value: newClientData?.project_end_date,
            })
          );
          // =======================contract duration=====================
          dispatch(
            updateField({
              field: "contract_duration_start_date",
              value: newClientData?.contract_duration?.match(/(\d+)-(\d+)/)[1],
            })
          );
          dispatch(
            updateField({
              field: "contract_duration_end_date",
              value: newClientData?.contract_duration?.match(/(\d+)-(\d+)/)[2],
            })
          );
        }
      }
    }
  };
  // ========================= onClick select mail function  ==========================
  const handleSelect = (curr) => {
    setError({
      addNew: "",
      name: "",
      email: "",
      regularRate: "",
      holidayRate: "",
      startDate: "",
      endDate: "",
      contract_duration_start_date: "",
      contract_duration_end_date: "",
      privilege_start_date: "",
      privilege_end_date: "",
    });
    setSelectedCurrentData(curr);
    setShowDropDown(false);
    dispatch(updateField({ field: "id", value: curr?.id }));

    // dispatch(updateField({ field: "client_id", value: curr.id }));
    dispatch(updateField({ field: "clientName", value: curr.name }));
    dispatch(updateField({ field: "email", value: curr.email }));
    dispatch(updateField({ field: "phone", value: curr.phone }));
    dispatch(
      updateField({ field: "regularRate", value: curr.regular_hourly_rate })
    );
    dispatch(
      updateField({ field: "holidayRate", value: curr.holiday_hourly_rate })
    );
    dispatch(updateField({ field: "overTimeRate", value: " " }));
    dispatch(updateField({ field: "startDate", value: "" }));
    dispatch(updateField({ field: "endDate", value: "" }));
    dispatch(updateField({ field: "privilege_start_date", value: "" }));
    dispatch(updateField({ field: "privilege_end_date", value: "" }));
    dispatch(updateField({ field: "startDate", value: "" }));
    dispatch(updateField({ field: "endDate", value: "" }));
    dispatch(updateField({ field: "contract_duration_start_date", value: "" }));
    dispatch(updateField({ field: "contract_duration_end_date", value: "" }));

    // Update billing address
    const billingAddress = curr?.addresses?.find(
      (addr) => addr.type === "billing"
    );
    if (billingAddress) {
      if (billingAddress?.country_id) {
        dispatch(fetchStates(billingAddress?.country_id));
      }
      dispatch(
        updateField({
          field: "billingAddressId",
          value: billingAddress.id || "",
        })
      );

      dispatch(
        updateField({
          field: "sameAsBilling",
          value: billingAddress.site_same_as_billing === 1,
        })
      );
      dispatch(
        updateField({ field: "billingCity", value: billingAddress.city })
      );
      dispatch(
        updateField({
          field: "billingAddress",
          value: billingAddress.country_id,
        })
      );
      dispatch(
        updateField({
          field: "billingAddress1",
          value: billingAddress.address_line_1,
        })
      );
      dispatch(
        updateField({
          field: "billingAddress2",
          value: billingAddress.address_line_2,
        })
      );
      dispatch(
        updateField({
          field: "billingZipCode",
          value: billingAddress.zip_code,
        })
      );
      dispatch(
        updateField({ field: "billingState", value: billingAddress.state_id })
      );
      dispatch(
        updateField({
          field: "sameAsBilling",
          value: billingAddress.site_same_as_billing,
        })
      );
    }

    // Update site address if not same as billing address
    billingAddress?.site_same_as_billing;
    const siteAddress = curr.addresses?.find((addr) => addr.type === "site");
    if (siteAddress) {
      if (!siteAddress?.site_same_as_billing) {
        dispatch(
          updateField({
            field: "siteAddressId",
            value: siteAddress.id,
          })
        );
        dispatch(updateField({ field: "siteCity", value: siteAddress.city }));
        dispatch(updateField({ field: "siteName", value: siteAddress.name }));
        dispatch(
          updateField({
            field: "siteAddress",
            value: siteAddress.country_id,
          })
        );

        if (siteAddress?.country_id) {
          dispatch(fetchSiteStates(siteAddress?.country_id));
        }

        dispatch(
          updateField({
            field: "siteState",
            value: siteAddress.state_id,
          })
        );
        dispatch(
          updateField({
            field: "siteAddress1",
            value: siteAddress.address_line_1,
          })
        );
        dispatch(
          updateField({
            field: "siteAddress2",
            value: siteAddress.address_line_2,
          })
        );
        dispatch(
          updateField({ field: "siteZipCode", value: siteAddress.zip_code })
        );
      }
    }
  };
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "basicInfo":
        return (
          <Box sx={{ pb: 3 }}>
            {/* ============================== Existing or add new ======================== */}
            {newClientData?.client_id ? (
              <Grid container spacing={2} mt={1} mb={3}>
                <Grid item xs={12} md={3} sx={{}}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Client name{" "}
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <CommonInputField
                    name="clientName"
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    value={formData.clientName}
                    placeholder="e.g., John Doe"
                    type="text"
                    error={!formData.clientName && error.name ? true : false}
                  />
                  {error.name && (
                    <Typography variant="caption" color="error">
                      {error.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid container mb={4} spacing={2}>
                <Grid item xs={12} md={3} sx={{}}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.black",
                      p: "10px 12px",
                      lineHeight: "1.2rem",
                      fontSize: "14px",
                    }}
                  >
                    Select Client{" "}
                    <span style={{ fontWeight: 600, color: "red" }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} sx={{}}>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <CommonSelect
                      width={"270px"}
                      name="existingClient"
                      value={formData.existingClient}
                      handleChange={handleChange}
                      handleClear={clearSelectExisitngClient}
                      placeholder="Select from existing"
                      options={existingClientsOptoins}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        py: "10px",
                        px: "25px",
                        lineHeight: "1.2rem",
                        fontSize: "14px",
                      }}
                    >
                      or
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                      }}
                    >
                      <CommonInputField
                        name={"clientName"}
                        placeholder="Add new"
                        value={formData.clientName}
                        onChange={handleChange}
                        error={
                          formData.clientName && error.addNew ? true : false
                        }
                      />
                      <Typography variant="caption" color="error">
                        {error.addNew}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" color="error">
                    {error.name}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {/* ============================= email========================== */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Email <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>

              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  error={!formData.email && error.email ? true : false}
                  fullWidth
                  placeholder="e.g., example@gmail.com"
                  type="text"
                  name="email"
                  label="Email"
                  onChange={handleChange}
                  margin="normal"
                  value={formData.email}
                />
                {error.email && (
                  <Typography variant="caption" color="error">
                    {error.email}
                  </Typography>
                )}
                {/* {showDropDown && filteredData?.length > 0 && (
                  <Box
                    sx={{
                      maxHeight: "150px",
                      overflowY: "scroll",
                      p: 1,
                      backgroundColor: "white",
                      boxShadow:
                        "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                    }}
                  >
                    {filteredData?.map((curr, index) => (
                      <Box
                        key={index}
                        onClick={() => handleSelect(curr)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "10px",
                          cursor: "pointer",
                          "&:hover": {
                            color: "text.btn_blue",
                          },
                        }}
                      >
                        <Typography mb={1} fontSize={11}>
                          {curr?.email} -&nbsp;
                        </Typography>
                        <Typography mb={1} fontSize={11} fontWeight={600}>
                          {curr?.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )} */}
              </Grid>
            </Grid>

            {/* =============================phone========================== */}
            <Grid
              container
              spacing={2}
              mt={1}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Phone <span style={{ color: "#8c98a4" }}>(Optional)</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  name="phone"
                  placeholder="+x(xxx)xxx-xx-xx"
                  onChange={handlePhoneNumber}
                  type={"phone"}
                  isPhoneNumber={"phone"}
                  fullWidth
                  margin="normal"
                  value={formData.phone}
                />
                {!isPossible && (
                  <Typography
                    sx={{ color: "text.error", mb: "1.5rem" }}
                    variant="caption"
                  >
                    Invalid phone number!
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      case "billingAddress":
        return (
          <AddressForm
            client={true}
            // requiredFields={requiredFields}
            formData={formData}
            handleChange={handleChange}
            filterCountries={filterCountries}
            filterState={filterState}
          />
        );
      case "siteAddress":
        return (
          <Box sx={{ pt: 2, pb: 3 }}>
            <FormControlLabel
              sx={{ pb: 1 }}
              control={
                <BpCheckbox
                  className={`${!formData.sameAsBilling && "checkbox"}`}
                  size="small"
                  checked={formData.sameAsBilling}
                  onChange={handleCheckboxChange}
                  name="sameAsBilling"
                />
              }
              label={
                <Typography variant="caption">
                  Same as billing address
                </Typography>
              }
            />

            {!formData.sameAsBilling && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3} sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 12px",
                        lineHeight: "1.2rem",
                        fontSize: "14px",
                      }}
                    >
                      Site name
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9} sx={{}}>
                    <CommonInputField
                      name="siteName"
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      value={formData.siteName}
                      placeholder="e.g, Capital Regional Medical Center"
                      type="text"
                    />
                  </Grid>
                </Grid>
                <AddressForm
                  formData={formData}
                  handleChange={handleChange}
                  filterCountries={filterCountries}
                  filterState={filterSiteState}
                  siteAddress="siteAddress"
                />
                <Grid
                  container
                  spacing={2}
                  mt={1}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Grid item xs={12} md={3} sx={{}}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.black",
                        p: "10px 12px",
                        lineHeight: "1.2rem",
                        fontSize: "14px",
                      }}
                    >
                      Phone <span style={{ color: "#8c98a4" }}>(Optional)</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9} sx={{}}>
                    <CommonInputField
                      name="sitePhone"
                      placeholder="+x(xxx)xxx-xx-xx"
                      onChange={handleSitePhoneNumber}
                      type={"phone"}
                      isPhoneNumber={"phone"}
                      fullWidth
                      margin="normal"
                      value={formData.sitePhone}
                    />
                    {!isPossible && (
                      <Typography
                        sx={{ color: "text.error", mb: "1.5rem" }}
                        variant="caption"
                      >
                        Invalid phone number!
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        );
      case "hourlyRate":
        return (
          <Box pb={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Regular rate ({formData.regularRateType === 'daily' ? 'per day' : 'per hour'})
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <CommonInputField
                  error={
                    !formData.regularRate && error.regularRate ? true : false
                  }
                  name="regularRate"
                  placeholder="e.g., 50"
                  value={formData.regularRate}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: <AttachMoneyOutlined />,
                    endAdornment: formData.regularRateType === 'daily' ? '/day' : '/hr',
                  }}
                />
                <Select
                  name="regularRateType"
                  value={formData.regularRateType || 'hourly'}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    minWidth: "120px",
                    ml: 1,
                    backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                    color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                    border:
                      darkMode === "dark"
                        ? `1.5px solid rgba(231, 234, 243, .7)`
                        : "none",
                  }}
                  input={
                    <OutlinedInput
                      sx={{
                        height: "2.6rem",
                        "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                          {
                            padding: 0,
                          },
                        fontSize: "0.875rem",
                        border: `none`,
                        "&.Mui-focused": {
                          backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            border: `1.5px solid rgba(231, 234, 243, .7)`,
                          },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  }
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </Select>
                {error.regularRate && (
                  <Typography variant="caption" color="error">
                    {error.regularRate}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Holiday rate ({formData.holidayRateType === 'daily' ? 'per day' : 'per hour'}){" "}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <CommonInputField
                  error={
                    !formData.holidayRate && error.holidayRate ? true : false
                  }
                  name="holidayRate"
                  placeholder="e.g., 50"
                  type="number"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  value={formData.holidayRate}
                  InputProps={{
                    startAdornment: <AttachMoneyOutlined />,
                    endAdornment: formData.holidayRateType === 'daily' ? '/day' : '/hr',
                  }}
                />
                <Select
                  name="holidayRateType"
                  value={formData.holidayRateType || 'hourly'}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    minWidth: "120px",
                    ml: 1,
                    backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                    color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                    border:
                      darkMode === "dark"
                        ? `1.5px solid rgba(231, 234, 243, .7)`
                        : "none",
                  }}
                  input={
                    <OutlinedInput
                      sx={{
                        height: "2.6rem",
                        "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                          {
                            padding: 0,
                          },
                        fontSize: "0.875rem",
                        border: `none`,
                        "&.Mui-focused": {
                          backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            border: `1.5px solid rgba(231, 234, 243, .7)`,
                          },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  }
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </Select>
                {error.holidayRate && (
                  <Typography variant="caption" color="error">
                    {error.holidayRate}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Overtime rate ({formData.overTimeRateType === 'daily' ? 'per day' : 'per hour'})
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <CommonInputField
                  name="overTimeRate"
                  placeholder="e.g., 50"
                  type="number"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  value={formData.overTimeRate}
                  InputProps={{
                    startAdornment: <AttachMoneyOutlined />,
                    endAdornment: formData.overTimeRateType === 'daily' ? '/day' : '/hr',
                  }}
                />
                <Select
                  name="overTimeRateType"
                  value={formData.overTimeRateType || 'hourly'}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    minWidth: "120px",
                    ml: 1,
                    backgroundColor: darkMode === "dark" ? "#333" : "#F6F7FA",
                    color: darkMode === "dark" ? "#F6F7FA" : "text.black",
                    border:
                      darkMode === "dark"
                        ? `1.5px solid rgba(231, 234, 243, .7)`
                        : "none",
                  }}
                  input={
                    <OutlinedInput
                      sx={{
                        height: "2.6rem",
                        "&.css-10l5tdt-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                          {
                            padding: 0,
                          },
                        fontSize: "0.875rem",
                        border: `none`,
                        "&.Mui-focused": {
                          backgroundColor: darkMode === "dark" ? "#333" : "#fff",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        },
                        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            border: `1.5px solid rgba(231, 234, 243, .7)`,
                          },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  }
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        );
      // ============================job duration==========================
      case "jobDuration":
        return (
          <Box pb={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Start Date
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  error={!formData.startDate && error.startDate ? true : false}
                  name="startDate"
                  placeholder="Job will be starting from"
                  value={formData.startDate}
                  onChange={handleChange}
                  type="date"
                  // InputProps={{
                  //   startAdornment: <AttachMoneyOutlined />,
                  //   endAdornment: "/hr",
                  // }}
                />
                {!formData.startDate && error.startDate && (
                  <Typography variant="caption" color="error">
                    {error.startDate}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  End Date{" "}
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  error={!formData.endDate && error.endDate ? true : false}
                  name="endDate"
                  placeholder="Job will be continued till"
                  type="date"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  value={formData.endDate}
                />
                {!formData.endDate && error.endDate && (
                  <Typography variant="caption" color="error">
                    {error.endDate}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        );

      // ============================privilege dates==========================
      case "privilegeDates":
        return (
          <Box pb={5}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  From
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  error={
                    !formData.privilege_start_date && error.privilege_start_date
                      ? true
                      : false
                  }
                  name="privilege_start_date"
                  placeholder="Job will be starting from"
                  value={formData.privilege_start_date}
                  onChange={handleChange}
                  type="date"
                  // InputProps={{
                  //   startAdornment: <AttachMoneyOutlined />,
                  //   endAdornment: "/hr",
                  // }}
                />
                {error.privilege_start_date && (
                  <Typography variant="caption" color="error">
                    {error.privilege_start_date}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  To
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <CommonInputField
                  error={
                    !formData.privilege_end_date && error.privilege_end_date
                      ? true
                      : false
                  }
                  name="privilege_end_date"
                  placeholder="Job will be continued till"
                  type="date"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  value={formData?.privilege_end_date}
                />
                {error.privilege_end_date && (
                  <Typography variant="caption" color="error">
                    {error.privilege_end_date}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        );

      // ============================contract duration==========================
      case "contractDuration":
        return (
          <Box sx={{ display: "flex" }}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  Range{" "}
                  <span style={{ color: "#8c98a4" }}>
                    (e.g., 1 to 2 months)
                  </span>
                  <span style={{ fontWeight: 600, color: "red" }}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <Box
                  sx={{
                    width: "100%",

                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* ======================start range===================== */}
                  <Box
                    sx={{
                      height: "100px",
                      width: "100%",
                    }}
                  >
                    <CommonInputField
                      value={formData?.contract_duration_start_date}
                      onChange={handleChange}
                      name={"contract_duration_start_date"}
                      placeholder={"e.g., 1 "}
                      error={
                        !formData.contract_duration_start_date &&
                        error.contract_duration_start_date
                          ? true
                          : false
                      }
                      type="number"
                      margin="normal"
                    />
                    {error.contract_duration_start_date && (
                      <Typography variant="caption" color="error">
                        {error.contract_duration_start_date}
                      </Typography>
                    )}
                  </Box>
                  <Typography mb={7} mx={1.5}>
                    to
                  </Typography>
                  {/* ======================end range===================== */}
                  <Box
                    sx={{
                      height: "100px",
                      width: "100%",
                    }}
                  >
                    <CommonInputField
                      value={formData?.contract_duration_end_date}
                      onChange={handleChange}
                      name={"contract_duration_end_date"}
                      placeholder={"e.g., 2"}
                      error={
                        !formData.contract_duration_end_date &&
                        error.contract_duration_end_date
                          ? true
                          : false
                      }
                      type="number"
                      margin="normal"
                    />
                    {error.contract_duration_end_date && (
                      <Typography variant="caption" color="error">
                        {error.contract_duration_end_date}
                      </Typography>
                    )}
                  </Box>
                  <Typography mb={7} mx={1}>
                    months
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} sx={{}}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.black",
                    p: "10px 12px",
                    lineHeight: "1.2rem",
                    fontSize: "14px",
                  }}
                >
                  to
                </Typography>
              </Grid>
              <Grid item xs={12} md={9} sx={{}}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CommonInputField
                    value={formData?.contract_duration_end_date}
                    handleChange={handleChange}
                    name={"contract_duration_end_date"}
                    placeholder={"Ending Range"}
                    error={
                      !formData.contract_duration_end_date &&
                      error.contract_duration_end_date
                        ? true
                        : false
                    }
                    type="number"
                    margin="normal"
                  />
                  <Typography ml={0.5}>months</Typography>
                </Box>
                {error.contract_duration_end_date && (
                  <Typography variant="caption" color="error">
                    {error.contract_duration_end_date}
                  </Typography>
                )}
              </Grid>
            </Grid> */}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        // p: 2,
        // border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "text.paper",
        boxShadow: "none",
      }}
    >
      <CardHeader
        sx={{ pb: 0.5 }}
        title={
          <Box
            sx={{
              // pb: 1,
              // pr: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            {" "}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // marginTop: "-3px",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "text.black",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  marginRight: "10px",
                  paddingRight: "10px",
                  // p: "1rem 1rem 0.75rem 1rem",
                }}
              >
                Client Information
                <CustomBadge
                  ml={5}
                  color={
                    newClientData?.client_id
                      ? "rgba(0, 201, 167)"
                      : "rgba(55, 125, 255)"
                  }
                  bgcolor={
                    false ? "rgba(0, 201, 167, .1)" : "rgba(55, 125, 255, .1)"
                  }
                  text={newClientData?.client_id ? "Completed" : "In progress"}
                  width={"92px"}
                />
              </Typography>
            </Box>
            {isEdit ? (
              <Button
                onClick={closeEditHandler}
                sx={{
                  textAlign: "end",
                  justifyContent: "flex-end",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    boxShadow: "none",
                  },
                }}
              >
                <Close />
              </Button>
            ) : permissions?.includes("create job management info") ? (
              <Button
                onClick={editHandler}
                variant="text"
                color="primary"
                sx={{
                  justifyContent: "flex-end",
                  textTransform: "capitalize",
                  color: "text.link",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  border: "none",
                  minWidth: 64,
                  mt: -1,
                  bgcolor: "background.paper",
                  outline: "none",
                  "&:hover": {
                    outline: "none",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                Edit
              </Button>
            ) : (
              ""
            )}
          </Box>
        }
      />
      <Divider
        sx={{
          borderColor:
            darkMode == "dark"
              ? "rgba(255, 255, 255, .7"
              : "rgba(231, 234, 243, 01)",
        }}
      />

      <CardContent sx={{ p: 2 }}>
        {isEdit ? (
          <form onSubmit={handleSubmit}>
            {sections.map((section) => (
              <Box key={section.id}>
                <Grid
                  container
                  sx={{ display: "flex", alignItems: "center", my: 1.5 }}
                >
                  <Grid item xs={6} md={2.5}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.98rem",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        // color: "text.black",
                        // p: "1rem 1rem 0.75rem 1rem",
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={9.5}>
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
                {renderSection(section.id)}
              </Box>
            ))}
            {permissions?.includes("create job management info") ? (
              <Box sx={{ textAlign: "end", pt: 3 }}>
                <Button
                  onClick={resetFieldHandler}
                  sx={{
                    mr: 1,
                    textTransform: "capitalize",
                    color: "text.primary",
                    fontSize: "0.8125rem",
                    fontWeight: 400,
                    border: "1px solid rgba(99, 99, 99, 0.2)",
                    padding: "8px 16px",
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
                {isLoading ? (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ py: 1, px: 3.5 }}
                  >
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveAltOutlined />}
                    sx={{ boxShadow: "none", textTransform: "capitalize" }}
                  >
                    Save
                  </Button>
                )}
              </Box>
            ) : (
              ""
            )}
          </form>
        ) : status === "idle" ? (
          <CustomSkeleton />
        ) : (
          sections.map((section) => (
            <Box key={section.id}>
              <Grid
                container
                sx={{ display: "flex", alignItems: "center", my: 1.5 }}
              >
                <Grid item xs={6} md={2.5}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.98rem",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      // color: "text.black",
                      // p: "1rem 1rem 0.75rem 1rem",
                    }}
                  >
                    {section.title}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={9.5}>
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
              <ClientInformationSectionDetail
                sectionId={section.id}
                formData={newClientData}
                countries={countries}
              />
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ClientInformation;
