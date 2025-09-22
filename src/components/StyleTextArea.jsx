import { TextareaAutosize, styled } from "@mui/material";

export const StyledTextarea = styled(TextareaAutosize)(
  ({ theme, isLightMode }) => ({
    width: "100%",
    border: "1px solid rgba(231, 234, 243, .6)",
    borderRadius: "4px", // optional: adjust for styling
    padding: "8px",
    resize: "vertical", // prevent resizing if desired
    outline: "none",
    fontFamily: "Inter, sans-serif",
    height: "100",
    transition: "box-shadow 0.2s",
    backgroundColor: isLightMode ? "#f8fafd" : "#25282A",
    color: isLightMode ? "black" : "white",
    "&:focus": {
      boxShadow: " rgba(0, 0, 0, 0.09) 0px 3px 12px",
      backgroundColor: isLightMode ? "white" : "#25282A",
    },
  })
);
