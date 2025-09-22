import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../API";
import CardCommon from "../../../components/CardCommon";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import SelectWithStartIcon from "../../../components/common/SelectWithStartIcon";
import DividerWithStartText from "../../../components/common/DividerWithStartText";
import { optionsYesNoUnsure } from "../../../components/constants/data";
import RadioToggleButton from "../../../components/RadioToggleButton";
import { scrollToTop } from "../../../util";

const TravelPreferencesTab = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [isPossible, setIsPossible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert visibility

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    address_line_1: "",
  });
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  // ====================== travel Preferences Data func define ===============
  // State for form data
  const [res, setRes] = useState([]);
  const [formData, setFormData] = useState({
    airline_name: res?.airline_reward || "",
    airline_reward: "",
    flight_time: "",
    flying_shift: "",
    class_preference: "",
    preferred_car_rental: "",
    car_reward: "",
    taxi_receipts: "",
    toll_reimbursement: "",
    parking_reimbursement: "",
    preferred_hotel: "",
    hotel_reward: "",
    first_name: "",
    last_name: "",
    relationship: "",
    phone: "",
    email: "",
  });
  const getTravelPreferencesData = async () => {
    try {
      const resp = await API.get(`/api/get-user-preferences`);
      if (resp?.data?.success) {
        const travelData = resp?.data?.data;
        setRes(resp?.data?.data);
        setLoading(false);
        setFormData({
          airline_name: travelData?.airline_name,
          airline_reward: travelData?.airline_reward,
          flight_time: travelData?.flight_time,
          flying_shift: travelData?.flying_shift,
          class_preference: travelData?.class_preference,
          preferred_car_rental: travelData?.preferred_car_rental,
          car_reward: travelData?.car_reward,
          taxi_receipts: travelData?.taxi_receipts,
          toll_reimbursement: travelData?.toll_reimbursement,
          parking_reimbursement: travelData?.parking_reimbursement,
          preferred_hotel: travelData?.preferred_hotel,
          hotel_reward: travelData?.hotel_reward,
          first_name: travelData?.first_name,
          last_name: travelData?.last_name,
          relationship: travelData?.relationship,
          phone: travelData?.phone,
          email: travelData?.email,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // ====================== travel Preferences Data func call ===============
  useEffect(() => {
    getTravelPreferencesData();
  }, []);

  // Handle change for travel Preferences==============================
  const handleChange = (type) => (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [type]: type === "phone" ? event : event.target.value,
    }));
  };

  // Phone value and handle change for phone==============================

  const [phoneValue, setPhoneValue] = useState(
    ""
    // userData?.detail?.phone ? userData.detail.phone : ""
  );
  // Flight Time Preference Options
  const timeOptions = [
    { value: "No Preference", label: "No preference" },
    { value: "Morning", label: "Morning (e.g., 6 AM - 10 AM)" },
    { value: "Midday", label: "Midday (e.g., 10 AM - 2 PM)" },
    { value: "Afternoon", label: "Afternoon (e.g., 2 PM - 6 PM)" },
    { value: "Evening", label: "Evening (e.g., 6 PM - 10 PM)" },
    { value: "Night", label: "Night (e.g., 10 PM - 2 AM)" },
  ];

  // Flying Shifts Options
  const shiftOptions = [
    { value: "No Preference", label: "No preference" },
    { value: "Before Shift", label: "Before the Shift" },
    { value: "After Shift", label: "After the Shift" },
  ];
  const classOptions = [
    { value: "No Preference", label: "No preference" },
    { value: "Economy", label: "Economy" },
    { value: "Business", label: "Business" },
    { value: "First Class", label: "First Class" },
  ];
  // ===============================api call===============================
  const handleSaveTrevelPreferences = async (e) => {
    e.preventDefault();
    const handleTrevelPreferencesData = new FormData();
    Object.keys(formData).forEach((key) => {
      handleTrevelPreferencesData.append(key, formData[key]);
    });
    setIsLoading(true);
    try {
      const response = await API.post(
        "/api/save-user-preferences",
        handleTrevelPreferencesData
      );
      const data = response.data;
      getTravelPreferencesData();
      setApiResponseYes(true);
      setApiResponse(data);
      setIsLoading(false);
      scrollToTop();
      setShowAlert(true); // Show alert on success
      return data;
    } catch (error) {
      setIsLoading(false);
      console.log("err", error);
    }
  };

  return (
    <Box>
      <CardCommon
        //  btnText={"Edit"}
        cardTitle={"Travel Preferences"}
      >
        {showAlert &&
          apiResponseYes &&
          (apiResponse?.error ? (
            <Alert severity="error" onClose={() => setShowAlert(false)}>
              {apiResponse?.msg}
            </Alert>
          ) : (
            <Alert severity="success" onClose={() => setShowAlert(false)}>
              {apiResponse?.msg}
            </Alert>
          ))}

        <form onSubmit={handleSaveTrevelPreferences} style={{ margin: 20 }}>
          {/* ======================================================== 1- Airline ========================================================== */}
          <DividerWithStartText
            text="Airline"
            darkMode={darkMode}
            textCol={1}
            dividerCol={11}
          />
          {/* ============================ Preferred Airline ============================== */}
          <Grid container>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Preferred airline
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{ mb: { xs: 1, md: 0 } }}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name="airline_name"
                  placeholder="e.g., Travel Vouchers"
                  value={formData.airline_name}
                  onChange={handleChange("airline_name")}
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* ============================ Reward ============================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Reward
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{ mb: { xs: 1, md: 0 } }}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name="airline_reward"
                  placeholder="e.g., Travel Vouchers"
                  value={formData.airline_reward}
                  onChange={handleChange("airline_reward")}
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* =============================== Flight Time Preference ============================ */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Flight time Preference
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <SelectWithStartIcon
                  name="flight_time"
                  value={formData.flight_time}
                  onChange={handleChange("flight_time")}
                  options={timeOptions}
                  displayEmpty={true}
                  placeholder="No preference"
                  startIcon={AccessTimeIcon}
                />
              )}
            </Grid>
          </Grid>
          {/* =========Do you prefer flying in the day before or after your shifts?=========== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Do you prefer flying in the day before or after your
                shifts?&nbsp;
                <span style={{ color: "#8c98a4" }}>(Optional)</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <SelectWithStartIcon
                  name="flying_shift"
                  value={formData.flying_shift}
                  onChange={handleChange("flying_shift")}
                  options={shiftOptions}
                  displayEmpty={true}
                  placeholder="No preference"
                  startIcon={TuneOutlinedIcon}
                />
              )}
            </Grid>
          </Grid>
          {/* =============================== Class Preferences =========================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Class Preference
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <SelectWithStartIcon
                  name="class_preference"
                  value={formData.class_preference}
                  onChange={handleChange("class_preference")}
                  options={classOptions}
                  displayEmpty={true}
                  placeholder="No preference"
                  startIcon={StarBorderOutlinedIcon}
                />
              )}
            </Grid>
          </Grid>
          {/* ========================================================== 2- Car Rental ========================================================== */}
          <DividerWithStartText
            text="Car Rental"
            darkMode={darkMode}
            textCol={1.5}
            dividerCol={10.5}
          />
          {/* ============================ Preferred Car Rental ============================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Preferred Car Rental
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  error={
                    !formData.preferred_car_rental && error.preferred_car_rental
                      ? true
                      : false
                  }
                  name="preferred_car_rental"
                  placeholder="e.g., Luxury, Fullsize"
                  value={formData.preferred_car_rental}
                  onChange={handleChange("preferred_car_rental")}
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* ============================ Car Reward ============================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Rewards
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name={"car_rewardare you done with you"}
                  value={formData.car_reward}
                  onChange={handleChange("car_reward")}
                  placeholder="e.g., Free loyality points, Free upgrades"
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* ============================ Receipts and Reimbursements ============================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Will you have taxi, Uber, or Lyft receipts?
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <RadioToggleButton
                  error={
                    !formData.taxi_receipts && error.taxi_receipts
                      ? true
                      : false
                  }
                  options={optionsYesNoUnsure}
                  selectedValue={formData.taxi_receipts}
                  onValueChange={handleChange("taxi_receipts")}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Will you need toll reimbursement? (if approved by the client)
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <RadioToggleButton
                  error={
                    !formData.toll_reimbursement && error.toll_reimbursement
                      ? true
                      : false
                  }
                  options={optionsYesNoUnsure}
                  selectedValue={formData.toll_reimbursement}
                  onValueChange={handleChange("toll_reimbursement")}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Will you need parking reimbursement? (if approved by the client)
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <RadioToggleButton
                  error={
                    !formData.parking_reimbursement &&
                    error.parking_reimbursement
                      ? true
                      : false
                  }
                  options={optionsYesNoUnsure}
                  selectedValue={formData.parking_reimbursement}
                  onValueChange={handleChange("parking_reimbursement")}
                />
              )}
            </Grid>
          </Grid>
          {/* ========================================================== 3- Hotel================================================================== */}
          <DividerWithStartText
            text="Hotel"
            darkMode={darkMode}
            textCol={1}
            dividerCol={11}
          />
          {/* ============================ Preferred Hotel ============================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Preferred Hotel
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  value={formData.preferred_hotel}
                  onChange={handleChange("preferred_hotel")}
                  placeholder="e.g., Marriott"
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* ============================ Hotel Reward ============================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Rewards
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  value={formData.hotel_reward}
                  onChange={handleChange("hotel_reward")}
                  placeholder="e.g., Room discount, Free lunch etc"
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* ========================================================== 4- Emergency Contact================================================================== */}
          <DividerWithStartText
            text="Emergency Contact"
            darkMode={darkMode}
            textCol={2.5}
            dividerCol={9.5}
          />
          {/* =================================contact full Name============================ */}
          <Grid container sx={{ mb: 3 }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Full Name
              </Typography>
              <Tooltip
                arrow
                placement="top"
                title="Who should be contacted in case of emergency?"
              >
                <IconButton>
                  <HelpOutlineIcon
                    sx={{ fontSize: "18px", color: "text.secondary" }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mb: { xs: 1, md: 0 } }}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name={"first_name"}
                  placeholder="e.g., John "
                  value={formData.first_name}
                  onChange={handleChange("first_name")}
                  type="text"
                />
              )}
            </Grid>
            <Grid item xs={12} md={4} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name={"last_name"}
                  placeholder="e.g.,  Doe"
                  value={formData.last_name}
                  onChange={handleChange("last_name")}
                  type="text"
                />
              )}
            </Grid>
          </Grid>

          {/* ==============================Relationship====================================== */}
          <Grid container sx={{ mb: { xs: 1, md: 0 } }}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Relationship
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{ mb: { xs: 1, md: 0 } }}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  error={
                    !formData.relationship && error.relationship ? true : false
                  }
                  name="relationship"
                  placeholder="e.g., Uncle, Brother"
                  value={formData.relationship}
                  onChange={handleChange("relationship")}
                  type="text"
                />
              )}
            </Grid>
          </Grid>

          {/* ==============================phone====================================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Phone <span style={{ color: "#8c98a4" }}>(Required)</span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name="phone"
                  placeholder="+x(xxx)xxx-xx-xx"
                  value={formData?.phone}
                  onChange={handleChange("phone")}
                  type={"phone"}
                  isPhoneNumber={"phone"}
                />
              )}

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
          {/* ================================email========================== */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={4} sx={{}}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.black",
                  p: "10px 0px",
                  lineHeight: "1.2rem",
                  fontSize: "13px",
                }}
              >
                Email
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{}}>
              {loading ? (
                <Skeleton />
              ) : (
                <CommonInputField
                  name={"email"}
                  placeholder="e.g., mark@site.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  type="text"
                />
              )}
            </Grid>
          </Grid>
          {/* ==================================form cancel and save btn=================================== */}
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            {isLoading ? (
              <Button
                variant="contained"
                sx={{
                  marginTop: "1rem",
                  py: 1.3,
                  minWidth: "122px",
                }}
              >
                <CircularProgress size={23} sx={{ color: "white" }} />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  marginTop: "1rem",
                  py: 1,
                  textTransform: "none",
                }}
              >
                Save Changes
              </Button>
            )}
          </Box>
        </form>
      </CardCommon>
    </Box>
  );
};
export default TravelPreferencesTab;
