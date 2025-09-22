import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { clearAlert } from "./alertSlice"; // Adjust import as needed

const SessionExpireAlert = () => {
  const dispatch = useDispatch();
  const { message, type, isOpen, location, isSessionExpired } = useSelector(
    (state) => state.alert
  );

  useEffect(() => {
    if (isOpen && message) {
      Swal.fire({
        title: type === "success" ? "Success 😊" : "Oops 😓",
        text: message,
        icon: type,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        dispatch(clearAlert());

        if (isSessionExpired && location) {
          window.location.href = location;
        }
      });
    }
  }, [isOpen, message, type, dispatch, location, isSessionExpired]);

  return null;
};

export default SessionExpireAlert;
