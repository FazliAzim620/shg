import { Box, Divider, Modal, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import UserInfoCard from "./UserInfoCard";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";

const ClientTeams = ({ data, setEditData, setOpenModal, deleteMember }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "83.33%",
        gap: 2,
        pb: 2,
        overflowX: "hidden",
      }}
    >
      {data?.length > 0 ? (
        data?.map((client, index) => {
          return (
            <UserInfoCard
              data={client}
              key={index}
              setEditData={setEditData}
              setOpenModal={setOpenModal}
              deleteMember={deleteMember}
            />
          );
        })
      ) : (
        <NodataFoundCard title="No Team Members To Show" />
      )}
    </Box>
  );
};

export default ClientTeams;
