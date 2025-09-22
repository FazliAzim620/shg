import React from "react";
import CustomChip from "../../../../components/CustomChip";
import { Box } from "@mui/material";
import { HeadingCommon } from "./HeadingCommon";
const Provider_Specialities = ({ medicalSpecialities }) => {
  return (
    <Box sx={{ mt: "80px" }}>
      <HeadingCommon title={"Medical specialities"} />
      <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        {medicalSpecialities.map((specialty) => (
          <CustomChip
            key={specialty.id}
            py={"0.5rem"}
            px={"1rem"}
            chipText={specialty.name}
            color={"#1e2022 !important"}
            bgcolor={"rgba(19, 33, 68, .1) !important"}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Provider_Specialities;
