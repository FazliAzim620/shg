import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import CustomTypographyBold from "./CustomTypographyBold";
// import folder from "../../../assets/folder.svg";
import folder from "../assets/folder.svg";
import { flxCntrSx } from "./constants/data";
import CustomChip from "./CustomChip";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
const CommonFolder = ({ displayHandler, client, index, job }) => {
  return (
    <>
      <Grid
        onClick={() => displayHandler(job ? job : client)}
        item
        xs={6}
        md={2.85}
        key={index}
        sx={{
          bgcolor: "background.paper",
          borderRadius: "10px",
          minHeight: "11.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 4,
          pb: 2,
          flexDirection: "column",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .25)",
            bgcolor: "background.paper",
          },
        }}
      >
        {job ? (
          <AssignmentOutlinedIcon sx={{ fontSize: "60px", color: "#949ea8" }} />
        ) : (
          <DomainOutlinedIcon sx={{ fontSize: "60px", color: "#949ea8" }} />
        )}
        {/* <img src={folder} width={"90px"} /> */}

        <Box sx={{ ...flxCntrSx, flexDirection: "column" }}>
          {job ? (
            <>
              <CustomTypographyBold color={"#1E2022"}>
                Job # {job && job?.id}
              </CustomTypographyBold>
              {/* <Typography fontSize="11px">
                {job?.speciality?.name}
              </Typography>{" "} */}
              <Typography color={"#1E2022"} mt={"13px"} fontSize="9px">
                <span style={{ fontWeight: "600" }}>Job start date: </span>
                {job?.project_start_date}
              </Typography>
              <Typography color={"#1E2022"} fontSize="9px">
                <span style={{ fontWeight: "600" }}>Job end date: </span>
                {job?.project_end_date}
              </Typography>
            </>
          ) : (
            <>
              <CustomTypographyBold color={"#1E2022"}>
                {client?.name}
              </CustomTypographyBold>
              <Typography color={"#1E2022"} fontSize="11px">
                ({client?.email}){" "}
              </Typography>
              <CustomChip
                mt={1}
                color={"black"}
                bgcolor={"#e7e8ec"}
                chipText={`Jobs: ${client?.jobs_count}`}
              />
            </>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default CommonFolder;
