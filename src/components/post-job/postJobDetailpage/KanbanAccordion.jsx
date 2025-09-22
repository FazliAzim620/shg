import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const KanbanAccordion = ({
  jobDetail,
  heading,
  expanded,
  children,
  handleCardToggle,
  id,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  return (
    <Box mt={0}>
      <Accordion
        sx={{
          boxShadow: "none",
          border: jobDetail
            ? mode === "dark"
              ? "black"
              : "1px solid #D3D6DA"
            : "none",

          p: 0,
        }}
        expanded={expanded}
      >
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
            expandIcon={
              <ExpandMoreIcon
                onClick={() => {
                  if (handleCardToggle) {
                    handleCardToggle(id);
                  }
                }}
              />
            }
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Box
              sx={{
                width: "250px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {heading}
            </Box>
          </AccordionSummary>
        </Box>

        <AccordionDetails sx={{ p: 0, px: "20px" }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default KanbanAccordion;
