import React, { useState, useEffect } from "react";
import CardCommon from "../../../components/CardCommon";
import emailIcon from "../../assets/illustrations/email.svg";
import webIcon from "../../assets/illustrations/oc-globe.svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import AppIcon from "../../assets/illustrations/oc-phone.svg";
import {
  Button,
  IconButton,
  CircularProgress,
  Box,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Paper,
} from "@mui/material";

import Alert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import API from "../../../API";
import { IosCommonSwitch } from "../../../components/common/IosCommonSwitch";

const NotificationsTab = () => {
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const darkMode = useSelector((state) => state.theme.mode);
  // ==========================================
  const [frequency, setFrequency] = useState("Always");
  const [summaryDay, setSummaryDay] = useState("Weekdays");
  const [summaryTime, setSummaryTime] = useState("at 9 AM");
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Implement your submit logic here
    // For now, let's simulate an API call
    setTimeout(() => {
      setApiResponseYes(true);
      setApiResponse({ msg: "Settings updated successfully" });
      setIsLoading(false);
      setShowAlert(true);
    }, 1000);
  };

  return (
    <CardCommon cardTitle={"Notification preferences"} minHeight={230}>
      {showAlert &&
        apiResponseYes &&
        (apiResponse?.error ? (
          <Alert severity="error" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ) : (
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ))}
      <Box
        sx={{
          bgcolor: "#DCDEE3",
          p: "12px",
        }}
      >
        <Typography textAlign={"center"} fontSize="0.875rem" lineHeight={1.43}>
          We need permission from your browser to show notifications.&nbsp;
          <span style={{ fontWeight: "600" }}>Request permission</span>
        </Typography>
      </Box>
      {/* Notification Settings Panel */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#F8FAFD",
                borderBottom: "2.6px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell>TYPE</TableCell>
              <TableCell align="center">
                <img width={24.5} src={emailIcon} alt="emailicon" />
                <Typography variant="caption" display="block">
                  EMAIL
                </Typography>
              </TableCell>
              <TableCell align="center">
                <img width={24.5} src={webIcon} alt="webIcon" />
                <Typography variant="caption" display="block">
                  BROWSER
                </Typography>
              </TableCell>
              <TableCell align="center">
                <img width={24.5} src={AppIcon} alt="AppIcon" />
                <Typography variant="caption" display="block">
                  APP
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{
                borderBottom: "1px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                Upcoming shift reminder
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                borderBottom: "1px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                Credential expiry warning
                <Typography variant="caption" color="text.secondary">
                  <Tooltip
                    arrow
                    placement="top"
                    title="Get important notifications about you or activity you've missed"
                  >
                    <IconButton>
                      <HelpOutlineIcon
                        sx={{ fontSize: "14px", color: "text.secondary" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                borderBottom: "1px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                Shift Change Notification
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                borderBottom: "1px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                Expense reimbursement status
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                borderBottom: "1px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                Contract renewal alert
                <Typography variant="caption" color="text.secondary">
                  <Tooltip
                    arrow
                    placement="top"
                    title="Email me when a new device connected"
                  >
                    <IconButton>
                      <HelpOutlineIcon
                        sx={{ fontSize: "14px", color: "text.secondary" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
              <TableCell
                align="center"
                sx={{ py: 0.5, border: "none", color: "text.secondary" }}
              >
                <FormControlLabel control={<IosCommonSwitch sx={{ m: 1 }} />} />
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                borderBottom: "1px solid rgba(231, 234, 243, .7)",
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ border: "none", color: "#677788", py: 0.5 }}
              >
                <Box sx={{ mt: 5, mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontSize: "14px" }}
                  >
                    When should we send you notifications?
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      displayEmpty
                      sx={{
                        "& .MuiSelect-select": { py: 1.5 },
                        color: "#677788",
                        fontSize: "14px",
                        border: "1px solid rgba(231, 234, 243, .7)",
                        borderRadius: "4px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    >
                      <MenuItem value="Always">Always</MenuItem>
                      <MenuItem value="Hourly">Hourly</MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </TableCell>
              <TableCell sx={{ border: "none", py: 0.5 }} colSpan={3}>
                <Box sx={{ mt: 5, mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: "14px", mb: 1, color: "#677788" }}
                  >
                    Send me a daily summary ("Daily Digest") of task activity.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        value={summaryDay}
                        onChange={(e) => setSummaryDay(e.target.value)}
                        displayEmpty
                        sx={{
                          "& .MuiSelect-select": { py: 1.5 },
                          color: "#677788",
                          fontSize: "14px",
                          border: "1px solid rgba(231, 234, 243, .7)",
                          borderRadius: "4px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        <MenuItem value="Weekdays">Weekdays</MenuItem>
                        <MenuItem value="Everyday">Everyday</MenuItem>
                        <MenuItem value="Mon-Wed-Fri">Mon-Wed-Fri</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        value={summaryTime}
                        onChange={(e) => setSummaryTime(e.target.value)}
                        displayEmpty
                        sx={{
                          border: "1px solid rgba(231, 234, 243, .7)",
                          borderRadius: "4px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": { py: 1.5 },
                          "&:hover": {
                            border: "1px solid rgba(231, 234, 243, .7)",
                          },
                          "& .MuiSelect-focus": {
                            py: 1.5,
                            border: "1px solid rgba(231, 234, 243, .7)",
                          },
                          color: "#677788",
                          fontSize: "14px",
                        }}
                      >
                        <MenuItem value="at 9 AM">at 9 AM</MenuItem>
                        <MenuItem value="at 12 PM">at 12 PM</MenuItem>
                        <MenuItem value="at 5 PM">at 5 PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "14px", m: 2 }}
      >
        In order to cut back on noise, email notifications are grouped together
        and only sent when you're idle or offline.
      </Typography>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        {isLoading ? (
          <Button
            variant="contained"
            sx={{
              marginTop: "1rem",
              py: 1.3,
              bgcolor: "background.btn_blue",
              "&:hover": { bgcolor: "background.btn_blue" },
            }}
          >
            <CircularProgress size={23} sx={{ color: "white" }} />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              marginTop: "1rem",
              marginRight: "0.7rem",
              py: 1,
              textTransform: "none",
            }}
          >
            Save Changes
          </Button>
        )}
      </Box>
    </CardCommon>
  );
};

export default NotificationsTab;
