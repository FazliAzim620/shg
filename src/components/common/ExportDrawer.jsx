import React, { useState } from "react";
import {
  Drawer,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Close,
  FileDownloadOutlined,
  SaveAltOutlined,
} from "@mui/icons-material";
import { BpCheckbox } from "./CustomizeCHeckbox";
import CustomTypographyBold from "../CustomTypographyBold";
import { CommonSelect } from "../job-component/CommonSelect";

const ExportDrawer = ({ open, onClose, columns, onExport, title }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  //  columns.map((col) => col.name)
  const [fileType, setFileType] = useState("");
  const [showError, setShowError] = useState(false);

  const handleColumnSelect = (colName) => {
    setSelectedColumns((prev) =>
      prev.includes(colName)
        ? prev.filter((name) => name !== colName)
        : [...prev, colName]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(
      selectedColumns.length === columns.length
        ? []
        : columns.map((col) => col.name)
    );
  };

  const handleFileTypeChange = (event) => {
    setShowError(false);
    setFileType(event.target.value);
  };

  const handleExport = () => {
    if (!fileType) {
      setShowError(true);
      return;
    }
    if (selectedColumns.length === 0) {
      setShowError(true);
      return;
    }
    onExport(selectedColumns, fileType);
    closeHanlder();
  };
  const closeHanlder = () => {
    onClose();
    setShowError(false);
    setSelectedColumns([]);
    setFileType("");
  };
  return (
    <Drawer anchor="right" open={open} onClose={closeHanlder}>
      <Box
        width={400}
        sx={{
          py: "24px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: "0px 24px 24px 24px",
          }}
        >
          <CustomTypographyBold
            weight={600}
            fontSize={"1rem"}
            textTransform={"none"}
            color={"text.black"}
          >
            {title}
          </CustomTypographyBold>
          <IconButton onClick={closeHanlder} sx={{ p: 0 }}>
            <Close />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: "24px",
          }}
        >
          <CustomTypographyBold
            weight={500}
            fontSize={"1rem"}
            textTransform={"none"}
            color={"text.black"}
          >
            Columns
          </CustomTypographyBold>
          <Button
            onClick={handleSelectAll}
            variant="text"
            sx={{ textTransform: "none" }}
          >
            {selectedColumns.length === columns.length
              ? DeselectIcon
              : SelectIcon}
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                lineHeight: "21px",
                color: "rgba(55, 125, 255, 1)",
                pl: 0.5,
              }}
            >
              {selectedColumns.length === columns.length
                ? "Deselect all"
                : "Select all"}
            </Typography>
          </Button>
        </Box>

        <FormGroup sx={{ flex: 1, px: "24px" }}>
          {columns.map((col) => (
            <FormControlLabel
              key={col.name}
              control={
                <BpCheckbox
                  checked={selectedColumns.includes(col.name)}
                  onChange={() => handleColumnSelect(col.name)}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                    textTransform: "capitalize",
                  }}
                >
                  {col.name?.replace(/_/g, " ")}
                </Typography>
              }
              sx={{
                py: "0.875rem",
                height: "24px",
              }}
            />
          ))}
          <Box mt={"24px"}>
            <CustomTypographyBold
              weight={400}
              fontSize={"1rem"}
              textTransform={"none"}
              color={"text.black"}
              mb={"8px"}
            >
              File Type: <span style={{ color: "red" }}>*</span>
            </CustomTypographyBold>
            <CommonSelect
              height={"38px"}
              name="role"
              value={fileType}
              handleChange={handleFileTypeChange}
              placeholder="Select export file type"
              options={[
                { value: "csv", label: "CSV" },
                // { value: "xlsx", label: "Excel" },
              ]}
            />
            {showError && selectedColumns.length === 0 ? (
              <Typography variant="caption" sx={{ color: "red" }}>
                Please select at least one column
              </Typography>
            ) : showError && !fileType ? (
              <Typography variant="caption" sx={{ color: "red" }}>
                Select Export Type
              </Typography>
            ) : null}
          </Box>
        </FormGroup>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #ccc",
            py: 2,
            px: "24px",
          }}
        >
          <Button
            sx={{
              mr: 2,
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: "0.8125rem",
              fontWeight: 400,
              border: "1px solid rgba(99, 99, 99, 0.2)",
              padding: "5px 16px",
              minWidth: 0,
              bgcolor: "background.paper",
              "&:hover": {
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                color: "text.main",
                transform: "scale(1.01)",
              },
              "&:focus": {
                outline: "none",
              },
            }}
            onClick={closeHanlder}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveAltOutlined sx={{ width: "18px" }} />}
            onClick={handleExport}
            sx={{
              textTransform: "none",
              backgroundColor: "#007BFF",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ExportDrawer;
const DeselectIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 0.750122C10.6989 0.750122 10.8897 0.82914 11.0303 0.969792C11.171 1.11044 11.25 1.30121 11.25 1.50012V10.5001C11.25 10.699 11.171 10.8898 11.0303 11.0305C10.8897 11.1711 10.6989 11.2501 10.5 11.2501H1.5C1.30109 11.2501 1.11032 11.1711 0.96967 11.0305C0.829018 10.8898 0.75 10.699 0.75 10.5001V1.50012C0.75 1.30121 0.829018 1.11044 0.96967 0.969792C1.11032 0.82914 1.30109 0.750122 1.5 0.750122H10.5ZM1.5 0.00012207C1.10218 0.00012207 0.720644 0.158157 0.43934 0.439462C0.158035 0.720766 0 1.1023 0 1.50012V10.5001C0 10.8979 0.158035 11.2795 0.43934 11.5608C0.720644 11.8421 1.10218 12.0001 1.5 12.0001H10.5C10.8978 12.0001 11.2794 11.8421 11.5607 11.5608C11.842 11.2795 12 10.8979 12 10.5001V1.50012C12 1.1023 11.842 0.720766 11.5607 0.439462C11.2794 0.158157 10.8978 0.00012207 10.5 0.00012207H1.5Z"
      fill="#377DFF"
    />
    <path d="M3 6H9" stroke="#377DFF" />
  </svg>
);
const SelectIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 0.750122C10.6989 0.750122 10.8897 0.82914 11.0303 0.969792C11.171 1.11044 11.25 1.30121 11.25 1.50012V10.5001C11.25 10.699 11.171 10.8898 11.0303 11.0305C10.8897 11.1711 10.6989 11.2501 10.5 11.2501H1.5C1.30109 11.2501 1.11032 11.1711 0.96967 11.0305C0.829018 10.8898 0.75 10.699 0.75 10.5001V1.50012C0.75 1.30121 0.829018 1.11044 0.96967 0.969792C1.11032 0.82914 1.30109 0.750122 1.5 0.750122H10.5ZM1.5 0.00012207C1.10218 0.00012207 0.720644 0.158157 0.43934 0.439462C0.158035 0.720766 0 1.1023 0 1.50012V10.5001C0 10.8979 0.158035 11.2795 0.43934 11.5608C0.720644 11.8421 1.10218 12.0001 1.5 12.0001H10.5C10.8978 12.0001 11.2794 11.8421 11.5607 11.5608C11.842 11.2795 12 10.8979 12 10.5001V1.50012C12 1.1023 11.842 0.720766 11.5607 0.439462C11.2794 0.158157 10.8978 0.00012207 10.5 0.00012207H1.5Z"
      fill="#377DFF"
    />
    <path
      d="M8.2275 3.72762C8.33246 3.62358 8.47416 3.56502 8.62195 3.56461C8.76974 3.5642 8.91176 3.62198 9.01729 3.72544C9.12283 3.82891 9.1834 3.96975 9.18592 4.11752C9.18844 4.26529 9.1327 4.40812 9.03075 4.51512L6.03675 8.25762C5.98529 8.31305 5.92319 8.35752 5.85415 8.3884C5.78511 8.41927 5.71055 8.4359 5.63494 8.4373C5.55932 8.4387 5.4842 8.42484 5.41407 8.39655C5.34393 8.36825 5.28022 8.3261 5.22675 8.27262L3.243 6.28812C3.18773 6.23663 3.14341 6.17453 3.11266 6.10553C3.08192 6.03653 3.06539 5.96204 3.06406 5.88651C3.06272 5.81099 3.07662 5.73596 3.10491 5.66592C3.1332 5.59588 3.17531 5.53226 3.22872 5.47884C3.28214 5.42543 3.34576 5.38332 3.4158 5.35503C3.48584 5.32674 3.56086 5.31285 3.63639 5.31418C3.71192 5.31551 3.7864 5.33204 3.8554 5.36279C3.9244 5.39353 3.9865 5.43786 4.038 5.49312L5.6085 7.06287L8.21325 3.74412C8.2179 3.73831 8.22216 3.7328 8.2275 3.72762Z"
      fill="#377DFF"
    />
  </svg>
);
