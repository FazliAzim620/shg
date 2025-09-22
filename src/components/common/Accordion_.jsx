import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";

const Accordion_ = ({ jobDetail, kanbanCard, heading, children }) => {
  return (
    <Box mt={0}>
      <Accordion
        sx={{
          boxShadow: "none",
          border: jobDetail ? "1px solid #D3D6DA" : "none",

          p: 0,
        }}
      >
        {kanbanCard ? (
          <Box display={"flex"} alignItems={"center"}>
            <Box
              sx={{
                height: "50px",
                width: "3px",
                bgcolor: "#3D8BFD",
                borderRadius: "9999px",
                mb: 1,
              }}
            />
            <AccordionSummary
              sx={{
                py: "0px",
                // borderLeft: kanbanCard ? "3px solid #3D8BFD !important" : "none",
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {heading}
            </AccordionSummary>
          </Box>
        ) : (
          <AccordionSummary
            sx={{
              p: "0px",
            }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {heading}
          </AccordionSummary>
        )}
        <AccordionDetails sx={{ p: 0, px: kanbanCard ? "20px" : 0 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Accordion_;
