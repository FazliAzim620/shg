import React, { useState } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import DefaultRoles from "../../components/userManagementcomponents/defaultRoles/DefaultRoles";
import CustomRoles from "../../components/userManagementcomponents/customRoles/CustomRoles";

const Roles_Permissions = () => {
  const mode = useSelector((state) => state.theme.mode);
  const darkMode = mode === "dark";
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box sx={{ mx: 2, mt: 1 }}>
      <DefaultRoles
        darkMode={darkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        from="user"
      />
      <CustomRoles
        darkMode={darkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        from="user"
      />
    </Box>
  );
};
export default Roles_Permissions;
