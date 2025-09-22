import { Box } from "@mui/material";
import React from "react";
import AirfareSection from "../job-component/providerInfo_steps/budgetPreferenceComponent/AirfareSection";
import HotelSection from "../job-component/providerInfo_steps/budgetPreferenceComponent/HotelSection";
import CarRentalSection from "../job-component/providerInfo_steps/budgetPreferenceComponent/CarRentalSection";
import LoggedMiles from "../job-component/providerInfo_steps/budgetPreferenceComponent/LoggedMiles";
import Tolls from "../job-component/providerInfo_steps/budgetPreferenceComponent/Tolls";
import Gas from "../job-component/providerInfo_steps/budgetPreferenceComponent/Gas";
import Parking from "../job-component/providerInfo_steps/budgetPreferenceComponent/Parking";
import OverBudget from "../job-component/providerInfo_steps/budgetPreferenceComponent/OverBudget";

const BudgetPreferences = () => {
  const sections = [
    "Airfare",
    "Hotel",
    "Car rental",
    "Logged miles",
    "Tolls",
    "Gas",
    "Parking",
    "Over Budget Travel",
  ];
  const renderSection = (section) => {
    switch (section) {
      case "Airfare":
        return <AirfareSection isEdit={true} hideRoundtrips={true} />;
      case "Hotel":
        return <HotelSection isEdit={true} hideTotalNights={true} />;
      case "Car rental":
        return <CarRentalSection isEdit={true} hideTotalRentalDays={true} />;
      case "Logged miles":
        return <LoggedMiles isEdit={true} />;
      case "Tolls":
        return <Tolls isEdit={true} hideTotalDays={true} />;
      case "Gas":
        return <Gas isEdit={true} />;
      case "Parking":
        return <Parking isEdit={true} />;
      case "Over Budget Travel":
        return <OverBudget isEdit={true} />;
      // Add other sections as needed
      default:
        return null;
    }
  };
  return (
    <Box sx={{}}>
      {sections.map((section, index) => renderSection(section))}
    </Box>
  );
};

export default BudgetPreferences;
