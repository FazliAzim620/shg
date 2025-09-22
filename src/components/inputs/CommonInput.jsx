import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getLocation } from "../../api_request";
const CommonInput = ({
  value,
  name,
  type = "text",
  onChange,
  placeholder,
  InputProps,
  isPhoneNumber = false,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";
  const [country, setCountry] = useState(null);
  useEffect(() => {
    getLocation()
      .then((data) => {
        setCountry(data.countryCode);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      {isPhoneNumber ? (
        <PhoneInput
          international
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          defaultCountry={country}
          className={`phone-input ${isLightMode ? "" : "dark"}`}
        />
      ) : (
        <TextField
          fullWidth
          variant="outlined"
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className="custom_input"
          InputProps={InputProps}
          sx={{
            borderRadius: "5px",
            bgcolor: isLightMode ? "#F6F7Fa" : "#333",
            color: isLightMode ? "black" : "white",
            border: ".0625rem solid rgba(231, 234, 243, .7)",
            "& fieldset": { border: "none" },
            "& .MuiOutlinedInput-root.Mui-focused": {
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
              backgroundColor: isLightMode ? "white" : "#25282A",
              boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            },
            "&:focus .MuiOutlinedInput-root": {
              backgroundColor: isLightMode ? "white" : "#25282A",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
            },
            input: {
              color: isLightMode ? "black" : "white",
            },
          }}
        />
      )}
    </>
  );
};

export default CommonInput;
