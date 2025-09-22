import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { CommonInputField } from "../job-component/CreateJobModal";
import ClientAirfareEdit from "./ClientAirfareEdit";
import API from "../../API";
import { useParams } from "react-router-dom";
import ClientHotelEdit from "./ClientHotelEdit";
import ClientCarEdit from "./ClientCarEdit";
import ClientLoggedEdit from "./ClientLoggedEdit";
import ClientGasEdit from "./ClientGasEdit";
import ClientParkingEdit from "./ClientParkingEdit";
import ClientTollsEdit from "./ClientTollsEdit";
import CustomButton from "../CustomButton";

const BudgetPreferencesEditModal = ({
  open,
  onClose,
  category,
  getClientBudgetPreferencesHandler,
}) => {
  const param = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [airfareData, setAirfareData] = useState({});
  const [hotelData, setHotelData] = useState({});
  const [carData, setCarData] = useState({});
  const [loggedData, setLoggedData] = useState({});
  const [tollsData, setTollsData] = useState({});
  const [gasData, setGasData] = useState({});
  const [parking, setParking] = useState({});
  console.log("category?.fields", category?.fields);
  useEffect(() => {
    if (category?.title === "Airfare") {
      setAirfareData(category?.fields);
    }
    if (category?.title === "Hotel") {
      setHotelData(category?.fields);
    }
    if (category?.title === "Car") {
      setCarData(category?.fields);
    }
    if (category?.title === "Logged miles") {
      setLoggedData(category?.fields);
    }
    if (category?.title === "Tolls") {
      setTollsData(category?.fields);
    }
    if (category?.title === "Gas") {
      setGasData(category?.fields);
    }
    if (category?.title === "Parking") {
      setParking(category?.fields);
    }
  }, [open]);

  const airfareSubmitHandler = async () => {
    setIsLoading(true);
    console.log("airfareData ", airfareData);
    console.log(
      'airfareData?.find((item) => item.name === "airline")',
      airfareData?.find((item) => item.name === "airline")
    );
    const obj = {
      client_id: param.id,
      data_type: "airfare",
      airfare_cost_covered:
        airfareData?.find((item) => item.name === "airfare_cost_covered")
          ?.value !== "No"
          ? 1
          : 0,
      airfare_reimbursed_prepaid:
        airfareData?.find((item) => item.name === "airfare_cost_covered")
          ?.value !== "No"
          ? airfareData?.find(
              (item) => item.name === "airfare_reimbursed_prepaid"
            )?.value
          : 0,

      booking_class:
        airfareData?.find((item) => item.name === "booking_class")?.value ===
        "No"
          ? 0
          : 1,
      preferred_booking_class: airfareData?.find(
        (item) => item.name === "preferred_booking_class"
      )?.value,
      airline:
        airfareData?.find((item) => item.name === "booking_class")?.value ===
        "No"
          ? ""
          : airfareData?.find((item) => item.name === "airline")?.value,
      number_of_roundtrips: airfareData?.find(
        (item) => item.name === "number_of_roundtrips"
      )?.value,
      roundtrip_airfare_min_budget: airfareData?.find(
        (item) => item.name === "airfare_min_budget"
      )?.value,
      roundtrip_airfare_max_budget: airfareData?.find(
        (item) => item.name === "airfare_max_budget"
      )?.value,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const hotelSubmitHandler = async () => {
    setIsLoading(true);
    const obj = {
      client_id: param.id,
      data_type: "hotel",
      hotel_cost_covered:
        hotelData?.find((item) => item.name === "hotel_cost_covered")?.value !==
        "No"
          ? 1
          : 0,
      hotel_reimbursed_prepaid: hotelData?.find(
        (item) => item.name === "hotel_reimbursed_prepaid"
      )?.value,

      specify_hotel: hotelData?.find((item) => item.name === "specify_hotel")
        ?.value,
      preferred_hotel: hotelData?.find(
        (item) => item.name === "preferred_hotel"
      )?.value,
      hotel_per_night_min_budget: hotelData?.find(
        (item) => item.name === "hotel_per_night_min_budget"
      )?.value,
      hotel_per_night_max_budget: hotelData?.find(
        (item) => item.name === "hotel_per_night_max_budget"
      )?.value,
      total_nights: hotelData?.find((item) => item.name === "total_nights")
        ?.value,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const carSubmitHandler = async () => {
    setIsLoading(true);
    const obj = {
      client_id: param.id,
      data_type: "car",
      car_cost_covered:
        carData?.find((item) => item.name === "car_cost_covered")?.value !==
        "No",
      car_own_rental: carData?.find((item) => item.name === "car_own_rental")
        ?.value,

      preferred_rental_car_company: carData?.find(
        (item) => item.name === "preferred_rental_car_company"
      )?.value,
      specify_rental_car_company: carData?.find(
        (item) => item.name === "specify_rental_car_company"
      )?.value,
      limit_on_rental_car_class: carData?.find(
        (item) => item.name === "limit_on_rental_car_class"
      )?.value,
      specify_limit_rental_car_class: carData?.find(
        (item) => item.name === "specify_limit_rental_car_class"
      )?.value,
      rental_car_per_day_min_budget: carData?.find(
        (item) => item.name === "rental_car_per_day_min_budget"
      )?.value,
      rental_car_per_day_max_budget: carData?.find(
        (item) => item.name === "rental_car_per_day_max_budget"
      )?.value,
      total_rental_days: carData?.find(
        (item) => item.name === "total_rental_days"
      )?.value,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const loggedSubmitHandler = async () => {
    setIsLoading(true);
    const obj = {
      client_id: param.id,
      data_type: "logged_miles",
      personal_car_logged_miles_cost:
        loggedData?.find(
          (item) => item.name === "personal_car_logged_miles_cost"
        )?.value == "No"
          ? 0
          : 1,
      mileage_reimbursement_rate:
        loggedData?.find((item) => item.name === "mileage_reimbursement_rate")
          ?.value == "No"
          ? 0
          : 1,

      mileage_reimbursement_rate_budget:
        loggedData?.find(
          (item) => item.name === "personal_car_logged_miles_cost"
        )?.value == "Yes"
          ? loggedData?.find(
              (item) => item.name === "mileage_reimbursement_rate_budget"
            )?.value
          : 0,
      // mileage_reimbursement_rate_max_budget:
      //   loggedData?.find(
      //     (item) => item.name === "personal_car_logged_miles_cost"
      //   )?.value == "Yes"
      //     ? loggedData?.find(
      //         (item) => item.name === "mileage_reimbursement_rate_max_budget"
      //       )?.value
      //     : 0,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const tollsSubmitHandler = async () => {
    setIsLoading(true);
    const obj = {
      client_id: param.id,
      data_type: "tolls",
      tolls_cost_covered:
        tollsData?.find((item) => item.name === "tolls_cost_covered")?.value ==
        "No"
          ? 0
          : 1,
      toll_per_day_budget: tollsData?.find(
        (item) => item.name === "toll_per_day_min_budget"
      )?.value,
      // toll_per_day_min_budget: tollsData?.find(
      //   (item) => item.name === "toll_per_day_min_budget"
      // )?.value,
      // toll_per_day_max_budget: tollsData?.find(
      //   (item) => item.name === "toll_per_day_max_budget"
      // )?.value,
      // total_toll_days: tollsData?.find(
      //   (item) => item.name === "total_toll_days"
      // )?.value,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const gasSubmitHandler = async () => {
    setIsLoading(true);
    const obj = {
      client_id: param.id,
      data_type: "gas",
      gas_cost_covered:
        gasData?.find((item) => item.name === "gas_cost_covered")?.value == "No"
          ? 0
          : 1,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const parkingSubmitHandler = async () => {
    setIsLoading(true);
    const obj = {
      client_id: param.id,
      data_type: "parking",
      parking_cost_covered:
        parking?.find((item) => item.name === "parking_cost_covered")?.value ==
        "No"
          ? 0
          : 1,
    };
    try {
      const resp = await API.post(
        `/api/edit-client-budget-preference/${param.id}`,
        obj
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setAirfareData(null);
        getClientBudgetPreferencesHandler();
        onClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const handleSubmit = () => {
    if (airfareData) {
      airfareSubmitHandler();
    }
    switch (category?.title) {
      case "Airfare":
        return airfareSubmitHandler();
        break;
      case "Hotel":
        return hotelSubmitHandler();
        break;
      case "Car":
        return carSubmitHandler();
        break;
      case "Logged miles":
        return loggedSubmitHandler();
        break;
      case "Tolls":
        return tollsSubmitHandler();
      case "Gas":
        return gasSubmitHandler();
      case "Parking":
        return parkingSubmitHandler();
      default:
        return;
    }
  };
  const onCloseHandlere = () => {
    onClose();
    setAirfareData(null);
  };
  return (
    <Modal
      open={open}
      onClose={onCloseHandlere}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", md: category?.title === "Car" ? 900 : 850 }, // You can adjust this width
          overflowY: "auto",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.98rem",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "text.black",
            }}
          >
            Edit {category.title} Preferences
          </Typography>

          <IconButton onClick={onCloseHandlere} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 2 }}>
          {category?.title === "Airfare" && (
            <ClientAirfareEdit data={airfareData} setData={setAirfareData} />
          )}
          {category?.title === "Hotel" && (
            <ClientHotelEdit data={hotelData} setData={setHotelData} />
          )}
          {category?.title === "Car" && (
            <ClientCarEdit data={carData} setData={setCarData} />
          )}
          {category?.title === "Logged miles" && (
            <ClientLoggedEdit data={loggedData} setData={setLoggedData} />
          )}
          {category?.title === "Tolls" && (
            <ClientTollsEdit data={tollsData} setData={setTollsData} />
          )}
          {category?.title === "Gas" && (
            <ClientGasEdit data={gasData} setData={setGasData} />
          )}
          {category?.title === "Parking" && (
            <ClientParkingEdit data={parking} setData={setParking} />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <CustomButton label="Cancel" onClick={onCloseHandlere} />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              textTransform: "none",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={18} sx={{ color: "inherit" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BudgetPreferencesEditModal;
