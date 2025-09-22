import React, { useState } from "react";
import { Box } from "@mui/material";
import DefaultRoles from "./defaultRoles/DefaultRoles";
import CustomRoles from "./customRoles/CustomRoles";
import { useSelector } from "react-redux";

const UserRole_main = () => {
  const mode = useSelector((state) => state.theme.mode);
  const darkMode = mode === "dark";
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box sx={{ mx: 2 }}>
      <DefaultRoles
        darkMode={darkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <CustomRoles
        darkMode={darkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Box>
  );
};
export default UserRole_main;
