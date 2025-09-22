import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Box,
  Divider,
  Grid,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon, Close } from "@mui/icons-material";
import { CommonInputField } from "../../components/job-component/CreateJobModal";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import API from "../../API";
import ExpenseModal from "./ExpenseModal";
import ExpensesTable from "./ExpensesTable";
import { getCurrentJobBudgetPreferences } from "../../api_request";
import { setCurrentJobBudgetPreference } from "../../feature/providerPortal/currentJobSlice";
import NodataFoundCard from "./NodataFoundCard";

const TimeExpensesModal = ({ open, onClose, shift, onSave, edit, view }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWeek = parseInt(searchParams.get("week"));
  const [timesheetLines, setTimesheetLines] = useState([
    {
      id: "",
      start_time: "",
      end_time: "",
      regular_hours: "",
      overtime_hours: "",
      totalHours: "",
    },
  ]);
  const [fileNameError, setFileNameError] = useState(null);
  const [overtimeEntries, setOvertimeEntries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [overTimeErrors, setOverTimeErrors] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { week, allWeeks, currentJob } = useSelector(
    (state) => state.currentJob
  );
  // Expense modal state
  const [currentExpense, setCurrentExpense] = useState({
    description: "",
    amount: "",
    file: null,
  });
  const cw = allWeeks?.find((cw) => cw?.id === initialWeek);
  const [errors, setErrors] = useState([{}]);

  const validateTimesheet = () => {
    const newErrors = {};

    timesheetLines.forEach((line, index) => {
      const lineErrors = {};

      // Check each field

      if (!line.start_time) {
        lineErrors.start_time = "Start time is required";
      }

      if (!line.end_time) {
        lineErrors.end_time = "End time is required";
      }

      // If there are errors for this line, add them to the main errors object
      if (Object.keys(lineErrors).length > 0) {
        newErrors[index] = lineErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (edit) {
      setExpenses(edit?.timesheet_detail_attachments);
      // Format times to match the dropdown format (HH:00)
      const formatTime = (time) => {
        const hour = time.split(":")[0];
        return `${hour}:00`;
      };
      setTimesheetLines([
        {
          id: edit?.id,
          // start_time: formatTime(edit.start_time),
          start_time: edit.start_time,
          // end_time: formatTime(edit.end_time),
          end_time: edit.end_time,
          overtime_hours: edit.overtime_hours,
          timesheet_id: edit?.timesheet_id,
          totalHours: edit?.total_hours,

          regular_hours: parseFloat(edit.regular_hours),
        },
      ]);

      // Set overtime if it exists
      if (edit.overtime_hours && parseFloat(edit.overtime_hours) > 0) {
        setOvertimeEntries([
          {
            id: 1,
            start_time: formatTime(edit.end_time),
            end_time: "", // You might want to calculate this based on overtime_hours

            regular_hours: parseFloat(edit.overtime_hours),
            status: "overtime",
          },
        ]);
      }
    }
  }, [edit, open]);

  const handleAddTimesheetLine = () => {
    const newLine = {
      id: "",
      start_time: "",
      end_time: "",
      regular_hours: "",
      overtime_hours: "",
      totalHours: "",
    };
    setTimesheetLines([...timesheetLines, newLine]);
  };
  const removeExpenses = (index) => {
    const expenseToRemove = expenses[index];
    if (expenseToRemove?.id) {
      // Update deletedIds to only contain the id
      setDeletedIds((prevDeletedIds) => [
        ...prevDeletedIds,
        expenseToRemove.id,
      ]);
    }
    setExpenses((prevExpenses) => prevExpenses.filter((_, i) => i !== index));
  };

  const editHandler = (data) => {
    setFileNameError(null);
    setEditExpense(data);
    setExpenseModalOpen(!expenseModalOpen);
  };
  const removeTimesheetLine = (index) => {
    setFileNameError(null);
    setTimesheetLines((prevTimesheetLines) =>
      prevTimesheetLines.filter((_, i) => i !== index)
    );
  };
  const handleAddOvertime = () => {
    const newOvertime = {
      id: overtimeEntries.length + 1,
      start_time: "",
      end_time: "",

      regular_hours: 0,
      status: "overtime",
    };
    setOvertimeEntries([...overtimeEntries, newOvertime]);
  };
  const handleTimeChange = (id, field, value, type = "regular") => {
    setOverTimeErrors(null);
    //remove error
    if (errors[id]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[id][field];

      // Remove line entry if no more errors
      if (Object.keys(newErrors[id]).length === 0) {
        delete newErrors[id];
      }

      setErrors(newErrors);
    }
    const updateArray =
      type === "regular" ? setTimesheetLines : setOvertimeEntries;
    const array = type === "regular" ? timesheetLines : overtimeEntries;

    updateArray(
      array.map((item, index) => {
        if (index === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.week_id = allWeeks ? cw?.id : week?.id;
          updatedItem.job_id = allWeeks ? cw?.job_id : week?.job_id;

          // Handle overtime changes
          if (field === "overtime_hours") {
            // If overtime is being cleared
            if (!value) {
              // Restore original regular hours based on start and end time
              if (updatedItem.start_time && updatedItem.end_time) {
                const start = updatedItem.start_time.split(":");
                const end = updatedItem.end_time.split(":");

                // Convert start and end time to minutes
                const startMinutes =
                  parseInt(start[0]) * 60 + parseInt(start[1]);
                const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);

                // Calculate difference in minutes
                let diffMinutes = endMinutes - startMinutes;

                // Handle overnight shifts
                if (diffMinutes < 0) diffMinutes += 24 * 60;

                // Convert back to hours and minutes
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;

                // Update regular hours to original calculation
                updatedItem.regular_hours = `${hours}:${
                  minutes < 10 ? "0" + minutes : minutes
                }`;
                updatedItem.overtime_hours = "";
                updatedItem.totalHours = updatedItem.regular_hours;

                return updatedItem;
              }
            }

            // Handle non-empty overtime input

            let inputValue = value.replace(/[^\d:]/g, "");
            if (inputValue.length >= 3 && inputValue[2] !== ":") {
              inputValue = `${inputValue.slice(0, 2)}:${inputValue.slice(2)}`;
            }

            // Ensure it doesn't exceed the format "H:MM"
            if (inputValue.length > 5) {
              inputValue = inputValue.slice(0, 5);
            }

            const overtime = inputValue?.split(":");
            const overtimeMinutes =
              overtime?.length > 1
                ? parseInt(overtime[0]) * 60 + parseInt(overtime[1])
                : parseInt(overtime[0]) * 60;

            // Get original total minutes from start/end time
            const start = updatedItem.start_time.split(":");
            const end = updatedItem.end_time.split(":");
            const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
            const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
            let totalMinutes = endMinutes - startMinutes;
            if (totalMinutes < 0) totalMinutes += 24 * 60;

            // Validate overtime doesn't exceed total time
            if (overtimeMinutes > totalMinutes) {
              setOverTimeErrors("Overtime cannot exceed total working hours.");
              // alert("Overtime cannot exceed total working hours.");
              return item;
            }
            if (!value.trim()) {
              setOverTimeErrors("Overtime cannot be null.");
              // alert("Overtime cannot exceed total working hours.");
              return item;
            }

            // If overtime is valid, proceed with updates
            updatedItem.overtime_hours = inputValue;

            // Calculate new regular hours by subtracting overtime
            const regularMinutes = totalMinutes - overtimeMinutes;
            const regularHours = Math.floor(regularMinutes / 60);
            const regularMinutesRemainder = regularMinutes % 60;

            updatedItem.regular_hours = `${regularHours}:${
              regularMinutesRemainder < 10
                ? "0" + regularMinutesRemainder
                : regularMinutesRemainder
            }`;

            // Keep total hours as the sum of original time period
            const totalHours = Math.floor(totalMinutes / 60);
            const totalMinutesRemainder = totalMinutes % 60;

            updatedItem.totalHours = `${totalHours}:${
              totalMinutesRemainder < 10
                ? "0" + totalMinutesRemainder
                : totalMinutesRemainder
            }`;
          }

          // Handle start/end time changes
          if (field === "start_time" || field === "end_time") {
            if (updatedItem.start_time && updatedItem.end_time) {
              const start = updatedItem.start_time.split(":");
              const end = updatedItem.end_time.split(":");

              const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
              const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);

              let diffMinutes = endMinutes - startMinutes;
              if (diffMinutes < 0) diffMinutes += 24 * 60;

              const hours = Math.floor(diffMinutes / 60);
              const minutes = diffMinutes % 60;

              updatedItem.regular_hours = `${hours}:${
                minutes < 10 ? "0" + minutes : minutes
              }`;
              updatedItem.overtime_hours = "";
              // Reset overtime when changing start/end times
              if (updatedItem.overtime_hours) {
                const overtime = updatedItem.overtime_hours.split(":");
                const overtimeMinutes =
                  parseInt(overtime[0]) * 60 + parseInt(overtime[1]);

                // Ensure overtime is still valid with new times
                if (overtimeMinutes > diffMinutes) {
                  alert(
                    "Overtime has been reset as it exceeded new time period."
                  );
                  updatedItem.overtime_hours = "";
                }
              }

              // Calculate total hours
              const totalMinutes = diffMinutes;
              const totalHours = Math.floor(totalMinutes / 60);
              const totalMinutesRemainder = totalMinutes % 60;

              updatedItem.totalHours = `${totalHours}:${
                totalMinutesRemainder < 10
                  ? "0" + totalMinutesRemainder
                  : totalMinutesRemainder
              }`;
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };
  const jobBudgetPreferencesHandler = async (id) => {
    try {
      const resp = await getCurrentJobBudgetPreferences(id);

      if (resp?.data?.success) {
        dispatch(setCurrentJobBudgetPreference(resp?.data?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddExpense = () => {
    jobBudgetPreferencesHandler(params.id);
    setEditExpense(null);
    setFileNameError(null);
    setExpenseModalOpen(!expenseModalOpen);
  };
  const handleExpenseSubmit = (data) => {
    // Filter items that have either a file or an id/tempId
    const filterData = data?.filter(
      (item) => item.file || item.id || item.tempId
    );

    setExpenses((prevExpenses) => {
      // Create a copy of previous expenses
      const updatedExpenses = [...prevExpenses];

      // Keep track of new items to be added
      const newItems = [];

      filterData.forEach((item) => {
        // Check if item exists with either id or tempId
        const existingIndex = updatedExpenses.findIndex((expense) => {
          return (
            (item.id && expense.id === item.id) || // Check if 'id' matches
            (!item.id && expense.tempId === item.tempId) // Check if 'tempId' matches
          );
        });

        if (existingIndex !== -1) {
          if (
            item.file === null ||
            (item.file === undefined &&
              updatedExpenses[existingIndex].tempId === item.tempId)
          ) {
            // Only update the amount if file is null and tempId matches
            updatedExpenses[existingIndex] = {
              ...updatedExpenses[existingIndex],
              amount: item.amount,
            };
          } else {
            // Update the entire item otherwise
            updatedExpenses[existingIndex] = {
              ...updatedExpenses[existingIndex],
              ...item,
            };
          }
        } else {
          // Add as new item if no match is found
          const newItem = {
            ...item,
            tempId:
              item.tempId ||
              `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate tempId for new items
          };
          newItems.push(newItem);
        }
      });

      // Add all new items at once, and keep the updated items as well
      return [...updatedExpenses, ...newItems];
    });

    setEditExpense(null);
  };

  const closeHandler = () => {
    setErrors([{}]);
    setFileNameError(null);
    setDeletedIds([]);
    setIsLoading(false);
    setExpenses([]);
    onClose();
    setOverTimeErrors(null);
    setTimesheetLines([
      {
        id: "",
        start_time: "",
        end_time: "",
        regular_hours: "",
        overtime_hours: "",
        totalHours: "",
      },
    ]);
  };
  const handleSave = async () => {
    const maxFileNameLength = 40;
    const fileNameError = expenses.some((expense) => {
      const fileName = expense?.file?.name;
      return fileName && fileName.length > maxFileNameLength;
    });

    if (fileNameError) {
      setFileNameError(
        "File name is too long. Please ensure the file name is less than 40 characters."
      );
      return; // Exit the function to prevent form submission
    }
    // ---------------------------------------------------------------------------------------------------- try {
    const timesheetFormData = new FormData();
    if (!validateTimesheet()) {
      return;
    }
    timesheetFormData.append(
      `deleted_attachments`,
      deletedIds?.length > 0 ? deletedIds?.join(",") : null
    );
    // Filter shifts to include only those with id as null
    const filteredShifts = timesheetLines.filter(
      (data) => !data?.id || data?.id == edit?.id
    );
    filteredShifts.forEach((data, index) => {
      timesheetFormData.append(
        `timesheetDetail[${index}][job_timesheet_detail_id]`,
        data?.id || " "
      );
      timesheetFormData.append(
        `timesheetDetail[${index}][job_id]`,
        data.job_id || allWeeks ? cw?.job_id : week?.job_id
      );
      timesheetFormData.append(
        `timesheetDetail[${index}][week_id]`,
        data.week_id || allWeeks ? cw?.id : week?.id
      );
      timesheetFormData.append(`timesheetDetail[${index}][date]`, shift?.date);
      timesheetFormData.append(
        `timesheetDetail[${index}][start_time]`,
        data.start_time
      );
      timesheetFormData.append(
        `timesheetDetail[${index}][end_time]`,
        data.end_time
      );
      timesheetFormData.append(
        `timesheetDetail[${index}][regular_hours]`,
        data.regular_hours
      );
      timesheetFormData.append(
        `timesheetDetail[${index}][overtime_hours]`,
        data.overtime_hours
      );
      timesheetFormData.append(
        `timesheetDetail[${index}][total_hours]`,
        data.totalHours
      );
      expenses
        ?.filter((expense) => expense?.file || expense?.id)
        ?.forEach((expense, index) => {
          timesheetFormData.append(
            `expenses[${index}][attachment_id]`,
            expense?.id || null
          );
          timesheetFormData.append(
            `expenses[${index}][category]`,
            expense?.category
          );
          timesheetFormData.append(
            `expenses[${index}][file]`,
            expense?.tempId ? expense?.file : null || null
          );
          // timesheetFormData.append(
          //   `expenses[${index}][budget]`,
          //   expense?.budget || null
          // );
          timesheetFormData.append(
            `expenses[${index}][amount]`,
            expense?.amount || 0
          );
        });
    });
    try {
      if (filteredShifts.length > 0) {
        setIsLoading(true);
        const resp = await API.post(
          "/api/add-job-timesheet-detail",
          timesheetFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (resp?.data?.success) {
          setIsLoading(false);
          closeHandler();
          setExpenses([]);
          onSave(timesheetLines);
        } else {
          setIsLoading(false);
          console.log("resp===============--------", resp);
        }
      } else {
        console.log("No items with null id to send.");
        setShowAlert(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
    // ----------------------------------------------------------------------------------------------------
  };

  return (
    <>
      <Modal open={open} onClose={closeHandler}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", md: "1140px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <Box>
              <CustomTypographyBold
                weight={600}
                fontSize="0.75rem"
                color="text.black"
              >
                {view
                  ? "View time and expenses"
                  : edit
                  ? "Edit time and expenses"
                  : "Add time and expenses"}
              </CustomTypographyBold>
              <CustomTypographyBold
                weight={400}
                fontSize="0.75rem"
                color="text.or_color"
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CustomTypographyBold>
            </Box>
            <IconButton onClick={closeHandler} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              px: 3,
              py: 2,
              overflowY: "auto",
              maxHeight: "calc(90vh - 110px)",
            }}
          >
            <Box>
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Grid item xs={12} md={2}>
                  <CustomTypographyBold color="text.or_color">
                    Regular hours
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={10}>
                  <Divider sx={{ opacity: 0.5 }} />
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <CustomTypographyBold
                    fontSize={"0.875rem"}
                    weight={400}
                    lineHeight={1}
                  >
                    Start time
                  </CustomTypographyBold>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <CustomTypographyBold
                    fontSize={"0.875rem"}
                    weight={400}
                    lineHeight={1}
                  >
                    End time
                  </CustomTypographyBold>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <CustomTypographyBold
                    fontSize={"0.875rem"}
                    weight={400}
                    lineHeight={1}
                  >
                    Regular hours
                  </CustomTypographyBold>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <CustomTypographyBold
                    fontSize={"0.875rem"}
                    weight={400}
                    lineHeight={1}
                  >
                    Over time hours
                  </CustomTypographyBold>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <CustomTypographyBold
                    fontSize={"0.875rem"}
                    weight={400}
                    lineHeight={1}
                  >
                    Total hours
                  </CustomTypographyBold>
                </Box>
              </Box>
              {timesheetLines.map((line, index) => {
                const eHours = parseInt(line.end_time.split(":")[0], 10);
                const eMinutes = line.end_time.split(":")[1];
                const ePeriod = eHours >= 12 ? "PM" : "AM";
                const eFormattedHours = eHours % 12 || 12;

                const sHours = parseInt(line.start_time.split(":")[0], 10);
                const sMinutes = line.start_time.split(":")[1];
                const sPeriod = sHours >= 12 ? "PM" : "AM";
                const sFormattedHours = sHours % 12 || 12;
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {view ? (
                      <Box
                        sx={{
                          bgcolor: darkMode === "light" ? "#F6F7Fa" : "#333",
                          height: "2.5rem",
                          width: "80%",
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          px: 2.5,
                          borderRadius: "5px",
                          border:
                            darkMode === "light"
                              ? "0.063rem solid rgba(0, 0, 0, 0.06)"
                              : "0.63rem solid red",
                        }}
                      >
                        {/* {line.start_time.split(":")?.[0]}:
                        {line.start_time.split(":")?.[1]} */}
                        {sFormattedHours}:{sMinutes} {sPeriod}
                      </Box>
                    ) : (
                      <CommonInputField
                        placeholder="Start time"
                        type="time"
                        name="start_time"
                        label="Start time"
                        value={line.start_time}
                        disabled={view}
                        error={errors[index]?.start_time}
                        helperText={errors[index]?.start_time}
                        onChange={(e) =>
                          handleTimeChange(index, "start_time", e.target.value)
                        }
                      />
                    )}

                    {view ? (
                      <Box
                        sx={{
                          bgcolor: darkMode === "light" ? "#F6F7Fa" : "#333",
                          height: "2.5rem",
                          width: "80%",
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          px: 2.5,
                          borderRadius: "5px",
                          border:
                            darkMode === "light"
                              ? "0.063rem solid rgba(0, 0, 0, 0.06)"
                              : "0.63rem solid red",
                        }}
                      >
                        {eFormattedHours}:{eMinutes} {ePeriod}
                        {/* {line.end_time.split(":")?.[0]}:
                        {line.end_time.split(":")?.[1]} */}
                      </Box>
                    ) : (
                      <CommonInputField
                        placeholder="Start time"
                        type="time"
                        name="end_time"
                        label="Start time"
                        value={line.end_time}
                        disabled={view}
                        error={errors[index]?.end_time}
                        helperText={errors[index]?.end_time}
                        onChange={(e) =>
                          handleTimeChange(index, "end_time", e.target.value)
                        }
                      />
                    )}
                    <Box
                      sx={{
                        bgcolor: darkMode === "light" ? "#F6F7Fa" : "#333",
                        height: "2.5rem",
                        width: "80%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        px: 2.5,
                        borderRadius: "5px",
                        border:
                          darkMode === "light"
                            ? "0.063rem solid rgba(0, 0, 0, 0.06)"
                            : "0.63rem solid red",
                      }}
                    >
                      {line.regular_hours}
                    </Box>
                    {view ? (
                      <Box
                        sx={{
                          bgcolor: darkMode === "light" ? "#F6F7Fa" : "#333",
                          height: "2.5rem",
                          width: "80%",
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          px: 2.5,
                          borderRadius: "5px",
                          border:
                            darkMode === "light"
                              ? "0.063rem solid rgba(0, 0, 0, 0.06)"
                              : "0.63rem solid red",
                        }}
                      >
                        {line.overtime_hours}
                      </Box>
                    ) : (
                      <CommonInputField
                        label="Total overTime hours"
                        value={line.overtime_hours}
                        placeholder={"e.g, 4"}
                        type="text"
                        disabled={view}
                        error={overTimeErrors}
                        helperText={overTimeErrors}
                        onChange={(e) =>
                          handleTimeChange(
                            index,
                            "overtime_hours",
                            e.target.value
                          )
                        }
                      />
                    )}
                    <Box
                      sx={{
                        bgcolor: darkMode === "light" ? "#F6F7Fa" : "#333",
                        height: "2.5rem",
                        width: "80%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        px: 2.5,
                        borderRadius: "5px",
                        border: "0.063rem solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {line.totalHours}
                    </Box>
                    {timesheetLines?.length > 1 && (
                      <IconButton
                        onClick={() => removeTimesheetLine(index)}
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
              {/* <Button
                startIcon={<AddIcon sx={{ width: "1rem", ml: 2 }} />}
                onClick={handleAddTimesheetLine}
                sx={{ textTransform: "none", fontWeight: 500, mt: 3 }}
              >
                Add another timesheet line
              </Button> */}
            </Box>

            {/* Expenses Section */}
            <Box>
              {expenses?.length > 0 ? (
                <Grid container sx={{ my: 2 }}>
                  <Grid item xs={12} md={1.5}>
                    <CustomTypographyBold color="text.or_color">
                      Expenses
                    </CustomTypographyBold>
                  </Grid>
                  <Grid item xs={12} md={10.5}>
                    <Divider sx={{ opacity: 0.5 }} />
                  </Grid>
                </Grid>
              ) : view ? (
                <>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Grid item xs={12} md={2}>
                      <CustomTypographyBold color="text.or_color">
                        Expenses
                      </CustomTypographyBold>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Divider sx={{ opacity: 0.5 }} />
                    </Grid>
                  </Grid>
                  <NodataFoundCard title={"No expenses added"} />
                </>
              ) : (
                ""
              )}
              {/* 
              {expenses?.filter(
                (expense) => expense?.file || expense?.id || expense?.temId
              ).length > 0 && ( */}

              {expenses?.length > 0 && (
                <ExpensesTable
                  expenses={expenses}
                  removeExpenses={removeExpenses}
                  editHandler={editHandler}
                  view={view}
                />
              )}
              {!view && (
                <Button
                  startIcon={<AddIcon sx={{ width: "1rem" }} />}
                  onClick={handleAddExpense}
                  sx={{ textTransform: "none", fontWeight: 500, mt: 2 }}
                >
                  Add expense
                </Button>
              )}
            </Box>
          </Box>
          {fileNameError && (
            <Typography variant="caption" sx={{ color: "red", pl: 3 }}>
              {fileNameError}
            </Typography>
          )}
          {/* Footer */}
          {!view && (
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 1,
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "flex-end",
                px: 3,
                py: 2,
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
              }}
            >
              <Button
                onClick={closeHandler}
                sx={{
                  textTransform: "capitalize",
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  border: "1px solid rgba(99, 99, 99, 0.2)",
                  padding: "8px 16px",
                  mr: 1,
                  bgcolor: "background.paper",
                  "&:hover": {
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    color: "#6d4a96",
                    transform: "scale(1.01)",
                  },
                }}
              >
                Cancel
              </Button>
              {isLoading ? (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    width: "8rem",
                  }}
                >
                  <CircularProgress size={18} sx={{ color: "white" }} />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ textTransform: "none" }}
                >
                  Save
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Expense Modal */}
      <ExpenseModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(!expenseModalOpen)}
        onSubmit={handleExpenseSubmit}
        editData={editExpense}
      />
    </>
  );
};

export default TimeExpensesModal;
