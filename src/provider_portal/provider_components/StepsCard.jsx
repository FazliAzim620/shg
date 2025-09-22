import {
  AccessTime,
  AirplanemodeActiveOutlined,
  AttachMoneyOutlined,
  CallOutlined,
  FactCheckOutlined,
  ReceiptOutlined,
  WorkHistoryOutlined,
} from "@mui/icons-material";
import { Card, CardContent, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PROVIDER_ROUTES } from "../../routes/Routes";
import { useSelector } from "react-redux";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
const StepsCard = () => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = parseInt(searchParams.get("step")) || 1;
  const [activeStep, setActiveStep] = useState(initialStep);
  const navigate = useNavigate();
  const navigateHandler = (path) => {
    navigate(path);
  };
  const tabChangeHandler = ({ index, path }) => {
    navigateHandler(path);
    setActiveStep(index);
    setSearchParams({ step: index });
  };
  useEffect(() => {
    // setActiveStep(3);
    // setSearchParams({ step: 3 });
  }, []);
  return (
    <Card
      sx={{
        mt: 2.5,
        position: "sticky",
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        borderRadius: ".6875rem  ",
      }}
    >
      <CardContent sx={{ px: 0 }}>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 1,
              path: `${PROVIDER_ROUTES.timeSheet}/ `,
            })
          }
          sx={{
            borderLeft:
              activeStep === 1 &&
              `3px solid ${darkMode === "dark" ? " #007BFF" : "#6d4a96"}`,
          }}
        >
          <AccessTime
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 1 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 1 &&
                `${darkMode === "dark" ? "white" : "#6d4a96"}`,
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 1 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 1 && `${darkMode === "dark" ? "white" : "#6d4a96"}`
            }
            lineHeight={1.5}
          >
            Timesheets
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 2,
              path: `${PROVIDER_ROUTES.timeSheet}/`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 2 &&
              `3px  solid ${darkMode === "dark" ? " #007BFF" : "#6d4a96"}`,
          }}
        >
          <WorkHistoryOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 2 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 2 &&
                `${darkMode === "dark" ? "white" : "#6d4a96"}`,
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 2 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 2 && `${darkMode === "dark" ? "white" : "#6d4a96"}`
            }
            lineHeight={1.5}
          >
            Scheduling
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 3,
              path: `${PROVIDER_ROUTES.jobScheduling}/`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 3 &&
              `3px  solid ${darkMode === "dark" ? " #007BFF" : "#6d4a96"}`,
          }}
        >
          <FactCheckOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 3 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 3 &&
                `${darkMode === "dark" ? "white" : "#6d4a96"}`,
              mr: 1,
            }}
          />

          <CustomTypographyBold
            weight={activeStep === 3 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 3 && `${darkMode === "dark" ? "white" : "#6d4a96"}`
            }
            lineHeight={1.5}
          >
            Assignment Letter
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 4,
              path: `${PROVIDER_ROUTES.timeSheet}/`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 4 &&
              `3px  solid ${darkMode === "dark" ? " #007BFF" : "#6d4a96"}`,
          }}
        >
          <AirplanemodeActiveOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 4 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 4 &&
                `${darkMode === "dark" ? "white" : "#6d4a96"}`,
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 4 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 4 && `${darkMode === "dark" ? "white" : "#6d4a96"}`
            }
            lineHeight={1.5}
          >
            Travel Itinerary
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 5,
              path: `${PROVIDER_ROUTES.timeSheet}/`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 5 &&
              `3px solid ${darkMode === "dark" ? " #007BFF" : "#6d4a96"}`,
          }}
        >
          <AttachMoneyOutlined
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 5 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 5 &&
                `${darkMode === "dark" ? "white" : "#6d4a96"}`,
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 5 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 5 && `${darkMode === "dark" ? "white" : "#6d4a96"}`
            }
            lineHeight={1.5}
          >
            Invoice & Payments
          </CustomTypographyBold>
        </MenuItem>
        <MenuItem
          onClick={() =>
            tabChangeHandler({
              index: 6,
              // path: `${PROVIDER_ROUTES.timeSheet}/`,
            })
          }
          sx={{
            borderLeft:
              activeStep === 6 &&
              `3px solid ${darkMode === "dark" ? " #007BFF" : "#6d4a96"}`,
          }}
        >
          <PersonOutlinedIcon
            sx={{
              fontSize: "1rem",
              fontWeight: activeStep === 6 ? { md: 600, xl: 700 } : 400,
              color:
                activeStep === 6 &&
                `${darkMode === "dark" ? "white" : "#6d4a96"}`,
              mr: 1,
            }}
          />
          <CustomTypographyBold
            weight={activeStep === 6 ? { md: 600, xl: 700 } : 400}
            fontSize={"0.875rem"}
            color={
              activeStep === 6 && `${darkMode === "dark" ? "white" : "#6d4a96"}`
            }
            lineHeight={1.5}
          >
            Client Contact
          </CustomTypographyBold>
        </MenuItem>
      </CardContent>
    </Card>
  );
};

export default StepsCard;
