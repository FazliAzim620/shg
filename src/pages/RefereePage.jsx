import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import API from "../API";
import logo from "../assets/logos/logo.svg";
import loginbackground from "../../public/backgroundImage.png";
import { Box, Container, Grid, Typography } from "@mui/material";
import Footer from "../components/Footer";
const RefereePage = () => {
  const [surveyJson, setSurveyJson] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const params = useParams();
  const [ipAddress, setIpAddress] = useState("");

  const getIpAddress = async () => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data?.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  };

  const fetchData = async () => {
    const token = params.token;

    if (!token) {
      setError("No token found in URL");
      return;
    }

    try {
      const response = await API.get(
        `api/get-peer-ref-refree-details?encrypted_token=${token}`
      );
      if (response?.data?.success) {
        const rawJson = response?.data?.data?.peer_ref_form?.json_structure;
        const parsedJson = rawJson ? JSON.parse(rawJson) : null;
        setSurveyJson(parsedJson);
      } else {
        setError("Failed to fetch form data");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred while fetching data"
      );
    }
  };

  useEffect(() => {
    getIpAddress();
    fetchData();
  }, []);

  const handleSurveyComplete = async (survey) => {
    setIsSubmitting(true); // Show loading state
    const token = params.token;
    const formData = survey.data;
    try {
      const response = await API.post("api/refree-complete-reference", {
        encrypted_token: token,
        form_submit_json: JSON.stringify(formData),
        ip: ipAddress,
      });

      if (response?.data?.success) {
        setIsSubmitted(true);
      } else {
        setError("Failed to submit form");
        setIsSubmitting(false); // Reset submitting state on failure
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred while submitting the form"
      );
      setIsSubmitting(false); // Reset submitting state on error
    }
  };

  if (error)
    return (
      <Box
        style={{
          // backgroundImage: `URL(${backgroundImage})`,
          backgroundImage: `URL(${loginbackground})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "text.primary",
            minHeight: "100vh",
            pt: 6,
            pb: 2,
          }}
        >
          Error: {error}
        </Container>
      </Box>
    );
  if (!surveyJson)
    return (
      <Box
        style={{
          // backgroundImage: `URL(${backgroundImage})`,
          backgroundImage: `URL(${loginbackground})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "text.primary",
            minHeight: "100vh",
            pt: 6,
            pb: 2,
          }}
        >
          Loading...
        </Container>
      </Box>
    );
  if (isSubmitted)
    return (
      <Box
        style={{
          // backgroundImage: `URL(${backgroundImage})`,
          backgroundImage: `URL(${loginbackground})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "text.primary",
            minHeight: "100vh",
            pt: 6,
            pb: 2,
          }}
        >
          Thank you! Your response has been submitted.
        </Container>
      </Box>
    );

  const survey = new Survey.Model(surveyJson);
  survey.onComplete.add(handleSurveyComplete);
  survey.completeText = isSubmitting ? "Submitting..." : "Submit"; // Update button text
  survey.showCompletedPage = false;

  return (
    <>
      <Box
        style={{
          // backgroundImage: `URL(${backgroundImage})`,
          backgroundImage: `URL(${loginbackground})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
          minHeight: "50vh",
          position: "relative",
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "text.primary",
            minHeight: "90vh",
            pt: 6,
            pb: 2,
          }}
        >
          <Box sx={{ mb: "2rem" }}>
            <img
              src={logo}
              alt="Image Description"
              style={{
                width: "8rem",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              mx: "auto",
              maxWidth: "800px",
              textAlign: "center",
              color: "black",
              pb: 2,
            }}
          >
            Please complete the reference form below. We appreciate your
            time—your honest input plays a vital role in our provider
            credentialing and onboarding process.
          </Typography>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: "800px",
            }}
          >
            <Survey.Survey model={survey} />
            {isSubmitting && (
              <Box>Submitting your response, please wait...</Box>
            )}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default RefereePage;
