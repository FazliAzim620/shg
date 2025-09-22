// CreateRoleButton.jsx
import React from "react";
import { Button } from "@mui/material";
import AddCardIcon from "@mui/icons-material/AddCard";

const CreateRoleButton = ({ rolesLength, onClick, btnText, startIcon }) => {
  const buttonStyles =
    rolesLength === 0
      ? {
          border: "1.5px solid transparent",
          borderColor: "rgba(231, 234, 243, 0.7)",
          backgroundColor: "#fff",
          padding: "0.75rem 2rem",
          fontSize: "0.875rem",
          textTransform: "none",
          ":hover": {
            backgroundColor: "#fff",
            borderRadius: "0.3125rem",
            borderColor: "rgba(231, 234, 243, 0.7)",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          },
        }
      : {
          border: "1.5px solid transparent",
          // padding: "0.7rem 1.1rem",
          py: "8px",
          px: "16px",
          fontSize: "0.875rem",
          textTransform: "none",
          ":hover": {
            color: "#fff",
            borderRadius: "0.3125rem",
            borderColor: "rgba(231, 234, 243, 0.7)",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          },
        };

  return (
    <Button
      variant={rolesLength === 0 ? "text" : "contained"}
      sx={buttonStyles}
      startIcon={startIcon || <AddCardIcon />}
      onClick={onClick}
    >
      {btnText || "Create new role"}
    </Button>
  );
};

export default CreateRoleButton;
