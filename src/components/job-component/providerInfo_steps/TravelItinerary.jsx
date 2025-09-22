import React, { useEffect, useState } from "react";
import TravelItineraryModal from "./TravelItineraryModal";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  editItinerary,
  getBookingItinerary,
  resetTravelFields,
} from "../../../feature/travelSlice";
import CommonCard from "../../common/CommonCard";
import { useSelector } from "react-redux";
import AirlineTicketDetail from "./AirlineTicketDetail";
import AddHotelBookingModal from "./AddHotelBookingModal";
import HotelBookingDetail from "./HotelBookingDetail";
import CarRentalModal from "./CarRentalModal";
import CarBookingDetail from "./CarBookingDetail";
import { getItineraryData } from "../../../thunkOperation/job_management/providerInfoStep";
import { useParams } from "react-router-dom";
import { getBookingHotels } from "../../../feature/hotelBookingSlice";
import { getBookingCars } from "../../../feature/carRentalBooking";
import TravelItineraryCardsSkelton from "./TravelItineraryCardsSkelton";
import NoPermissionCard from "../../common/NoPermissionCard";
const TravelItinerary = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const params = useParams();
  const { createdItinerary } = useSelector((state) => state.travel);
  const [openAirlineModal, setOpenAirlineModal] = useState(false);
  const [openHotelModal, setOpenHotelModal] = useState(false);
  const [openCarModal, setOpenCarModal] = useState(false);
  const { bookings } = useSelector((state) => state.hotel);
  const { carBookings, status } = useSelector((state) => state.carRental);
  const [hotelEditData, setHotelEditData] = useState([]);
  const [carRentEditData, setcarRentEditData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const handleOpenAirlineModal = () => {
    setOpenAirlineModal(true);
    dispatch(resetTravelFields());
  };
  const handleOpenHotelModal = () => {
    setOpenHotelModal(true);
  };
  const handleOpenCarModal = () => {
    setOpenCarModal(true);
  };
  const handleClose = () => {
    setOpenAirlineModal(false);
    setOpenCarModal(false);
    setOpenHotelModal(false);
  };
  const editHandler = () => {
    setOpenAirlineModal(true);
    dispatch(editItinerary(createdItinerary));
  };
  const editHotelBookingHandler = () => {
    setOpenHotelModal(true);
    setHotelEditData(bookings?.[0]);
    // dispatch(editIHotelBooking(bookings?.[0]));
  };
  const editCarBookingHandler = () => {
    setOpenCarModal(true);
    setcarRentEditData(carBookings?.[0]);
    // dispatch(editIHotelBooking(bookings?.[0]));
  };
  const getItineraryDataHandler = async () => {
    const result = await dispatch(getItineraryData(params.id)).unwrap();
    setLoading(false);
    dispatch(getBookingItinerary(result?.[0]?.plane_ticket));
    dispatch(getBookingHotels([result?.[0]?.hotel]));
    dispatch(getBookingCars([result?.[0]?.car_rental]));
  };
  useEffect(() => {
    getItineraryDataHandler();
  }, [params]);
  if (permissions?.includes("read job management travel itinerary airline")) {
    return (
      <div>
        {loading ? (
          <TravelItineraryCardsSkelton />
        ) : createdItinerary ? (
          permissions?.includes(
            "read job management travel itinerary airline"
          ) && (
            <AirlineTicketDetail
              isDeleted={isDeleted}
              setIsDeleted={setIsDeleted}
              loading={loading}
              data={createdItinerary}
              editHandler={editHandler}
              isEdit={permissions?.includes(
                "update job management travel itinerary airline"
              )}
            />
          )
        ) : (
          permissions?.includes(
            "create job management travel itinerary airline"
          ) && (
            <CommonCard
              onClick={handleOpenAirlineModal}
              title="Airline ticket"
              heading="Empty in airline ticket"
              bodyText="Add a airline ticket and it will show up here."
              btnText="Add airline ticket"
              status={false}
            />
          )
        )}
        {loading ? (
          <TravelItineraryCardsSkelton />
        ) : bookings?.length > 0 &&
          bookings?.[0] !== undefined &&
          bookings?.[0] !== null ? (
          permissions?.includes(
            "read job management travel itinerary hotel"
          ) && (
            <HotelBookingDetail
              data={bookings?.[0]}
              status={true}
              editHandler={editHotelBookingHandler}
              isEdit={permissions?.includes(
                "update job management travel itinerary hotel"
              )}
            />
          )
        ) : (
          permissions?.includes(
            "create job management travel itinerary hotel"
          ) && (
            <CommonCard
              onClick={handleOpenHotelModal}
              title="Hotel"
              heading="Empty in hotel booking"
              bodyText="Add a hotel booking and it will show up here."
              btnText="Add hotel booking"
              status={false}
            />
          )
        )}
        {loading ? (
          <TravelItineraryCardsSkelton />
        ) : carBookings?.length > 0 &&
          carBookings?.[0] !== undefined &&
          carBookings?.[0] !== null ? (
          permissions?.includes("read job management travel itinerary car") && (
            <CarBookingDetail
              data={carBookings?.[0]}
              status={true}
              editHandler={editCarBookingHandler}
              isEdit={permissions?.includes(
                "update job management travel itinerary car"
              )}
            />
          )
        ) : (
          permissions?.includes(
            "create job management travel itinerary car"
          ) && (
            <CommonCard
              onClick={handleOpenCarModal}
              title="Car"
              heading="Empty in car rental"
              bodyText="Add a car rental and it will show up here."
              btnText="Add car rental"
              status={false}
              btnwidth="150px"
            />
          )
        )}
        {permissions?.includes(
          "create job management travel itinerary airline"
        ) && (
          <TravelItineraryModal
            open={openAirlineModal}
            handleClose={handleClose}
            setIsDeleted={setIsDeleted}
          />
        )}
        {permissions?.includes(
          "create job management travel itinerary hotel"
        ) && (
          <AddHotelBookingModal
            open={openHotelModal}
            onClose={handleClose}
            editData={hotelEditData}
          />
        )}
        {permissions?.includes(
          "create job management travel itinerary car"
        ) && (
          <CarRentalModal
            open={openCarModal}
            onClose={handleClose}
            editData={carRentEditData}
            status={status}
          />
        )}
      </div>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default TravelItinerary;
