import React, { useState } from "react";
import { Box, MobileStepper, Button, Grid, IconButton } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TimesheetCard from "../provider_portal/provider_components/TimesheetCard";
import NodataFoundCard from "../provider_portal/provider_components/NodataFoundCard";

const Carousel = ({
  allWeeks,
  from,
  getCurrentWeek = () => {},
  serviceProvider,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState("next");
  const maxSteps = allWeeks?.length;
  const visibleDots = Math.min(maxSteps, 10); // Limit the number of dots to a maximum of 10

  const handleNext = () => {
    setDirection("next");
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setDirection("prev");
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {allWeeks?.length > 0 ? (
        <>
          <TransitionGroup>
            <CSSTransition
              key={activeStep}
              timeout={300}
              classNames={direction}
            >
              <Grid
                container
                xs={from ? 10 : 12}
                mx="auto"
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "10px",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  minHeight: 44,
                }}
              >
                <Grid
                  item
                  xs={12}
                  mx="auto"
                  onClick={() => getCurrentWeek(allWeeks[activeStep])}
                >
                  <TimesheetCard
                    allWeeks={allWeeks}
                    currentWeek={allWeeks[activeStep]}
                    serviceProvider={serviceProvider}
                  />
                </Grid>
                <IconButton
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    position: "absolute",
                    left: "0%",
                    top: "57%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "57%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              </Grid>
            </CSSTransition>
          </TransitionGroup>
          <Box sx={{ pt: 50 }} /> {/* Spacer to maintain layout */}
          <Grid container xs={from ? 10 : 12} mx="auto">
            <MobileStepper
              steps={visibleDots} // Limit the number of dots to 10
              position="static"
              activeStep={activeStep}
              sx={{ flexGrow: 1, justifyContent: "center" }}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Grid>
        </>
      ) : (
        <Grid container xs={from ? 10 : 12} mx="auto">
          <NodataFoundCard />
        </Grid>
      )}
    </Box>
  );
};

export default Carousel;
