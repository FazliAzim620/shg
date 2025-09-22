import React, { useEffect, useState } from "react";
import CardCommon from "../../../components/CardCommon";
import { Box, Skeleton, Typography } from "@mui/material";
import API from "../../../API";
const TwoStepVerificationTab = () => {
  const [toggleOn, setToggleOn] = useState(0);
  /* ========================= handle get 2FA API ========================= */
  const [isLoading, setIsLoading] = useState(true);
  const getTwoFAData = async () => {
    try {
      const resp = await API.get("/api/get-user-two-step-authentication");
      if (resp?.data?.success) {
        setIsLoading(false);
        setToggleOn(resp?.data?.data?.two_step_authentication);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTwoFAData();
  }, []);
  const [loader, setLoader] = useState(false);

  /* ========================= handle save 2FA API ========================= */
  const handleClickToggle = async () => {
    setLoader(true);
    const fromData = {
      two_step_authentication: toggleOn === 1 ? 0 : 1,
    };
    try {
      const response = await API.post(
        "/api/user-two-step-authentication",
        fromData
      );
      const data = response.data;
      setToggleOn(toggleOn === 1 ? 0 : 1);
      setLoader(false);
      return data;
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <>
      <CardCommon
        getToggleDataLoader={isLoading}
        minHeight={"236px"}
        loader={loader}
        toggleValue={toggleOn === 1 ? true : false}
        toggle={true}
        handleClickToggle={handleClickToggle}
        cardTitle={"Two Step Verification"}
      >
        <Box
          sx={{
            marginTop: 3,
            mx: 3,
          }}
        >
          {isLoading ? (
            <>
              <Skeleton width={"100%"} height={"30px"} />
              <Skeleton width={"90%"} height={"30px"} />
            </>
          ) : (
            <Typography sx={{ color: "text.secondary" }} variant="body">
              {toggleOn === 1
                ? "Enable OTP Authentication: When this option is turned on, you'll receive a one-time password (OTP) via email each time you log in. This adds an extra layer of security to your account. If you prefer to log in with just your email and password, keep this toggle off."
                : "Turn on to add extra security: Enabling this will require you to enter a one-time password (OTP) sent to your email during login. This helps protect your account with an additional layer of verification"}{" "}
            </Typography>
          )}
        </Box>
      </CardCommon>
    </>
  );
};

export default TwoStepVerificationTab;
