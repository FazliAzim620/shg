import { Box } from "@mui/material";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import default styles
import { useSelector } from "react-redux";

const RichTextEditor = ({ value, onChange }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  return (
    <Box sx={{ mb: 6 }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Enter job description here..."
        className={darkMode === "dark" ? "dark" : ``}
        style={{ height: "200px" }}
      />
    </Box>
  );
};

export default RichTextEditor;
