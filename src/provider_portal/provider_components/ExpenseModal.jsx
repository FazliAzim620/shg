import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  ToggleButtonGroup,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import { InfoOutlined, KeyboardBackspace } from "@mui/icons-material";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { CommonInputField } from "../../components/job-component/CreateJobModal";

const ExpenseModal = ({
  open,
  onClose,
  onSubmit,
  removeExpenses,
  editData,
}) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentJobBudgetPreference } = useSelector(
    (state) => state.currentJob
  );

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Map preference keys to expense categories
  const preferenceToCategory = {
    hotel_cost_covered: "Hotel",
    car_cost_covered: "Car",
    gas_cost_covered: "Gas",
    tolls_cost_covered: "Toll",
    parking_cost_covered: "Parking",
    airfare_cost_covered: "Airfare",
  };

  // Filter and create initial expenses based on covered costs
  const createInitialExpenses = () => {
    return Object.entries(currentJobBudgetPreference)
      .filter(([key, value]) => value === 1) // Only include expenses that are covered (value === 1)
      .map(([key]) => ({
        id: null,
        tempId: null,
        category: preferenceToCategory[key],
        file: null,
        budget: "",
        amount: "",
        error: false,
      }));
  };

  const [expenses, setExpenses] = useState([]);
  const [fileNameError, setFileNameError] = useState(null);

  useEffect(() => {
    if (editData) {
      // Update the expenses state with editData for the matching category
      const initialExpenses = createInitialExpenses();
      const updatedExpenses = initialExpenses.map((expense) => {
        if (editData.category === expense.category) {
          return {
            ...expense,
            id: editData?.id,
            tempId: editData?.tempId,
            amount: editData.amount,
            file: editData.file_name,
          };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
    } else {
      setExpenses(createInitialExpenses());
    }
  }, [open, editData, currentJobBudgetPreference]);

  const handleFileChange = (index, file) => {
    const newExpenses = [...expenses];
    newExpenses[index].file = file;
    newExpenses[index].error = false;
    setExpenses(newExpenses);
  };

  const handleAmountChange = (index, value) => {
    const newExpenses = [...expenses];
    newExpenses[index].amount = value;
    newExpenses[index].error = false;
    setExpenses(newExpenses);
  };

  const calculateTotal = () => {
    return expenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const validateFields = () => {
    const newExpenses = [...expenses];
    let valid = true;
    newExpenses.forEach((expense, index) => {
      if (expense.file && !expense.amount) {
        newExpenses[index].error = true;
        valid = false;
      }
    });
    setExpenses(newExpenses);
    return valid;
  };

  const handleSubmit = () => {
    const maxFileNameLength = 40;
    const fileNameError = expenses.some((expense) => {
      const fileName = expense?.file?.name;
      return fileName && fileName.length > maxFileNameLength;
    });

    if (fileNameError) {
      setFileNameError(
        "File name is too long. Please ensure the file name is less than 40 characters."
      );
      return;
    }
    if (validateFields()) {
      onSubmit(expenses);
      onClose();
      setExpenses(createInitialExpenses());
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          display: "flex",
          flexDirection: "column",
          minHeight: "400px",
          maxHeight: { xs: "90vh", xl: "60vh" },
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "background.paper",
            p: 2,
            borderBottom: "1px solid rgba(231, 234, 243, .4)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <CustomTypographyBold
                weight={600}
                fontSize={"0.75rem"}
                color={"text.black"}
              >
                {editData ? "Edit expense" : "Add expense"}
              </CustomTypographyBold>
              <CustomTypographyBold
                weight={400}
                fontSize={"0.75rem"}
                color={"text.or_color"}
              >
                {format(new Date(), "MM/dd/yy")}
              </CustomTypographyBold>
            </Box>
            <Button
              onClick={() => {
                onClose();
                setExpenses(createInitialExpenses());
              }}
              size="small"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              <KeyboardBackspace sx={{ fontSize: " 1rem", mr: 0.5 }} />
              Back
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            px: 2,
            maxHeight: "calc(100% - 200px)",
          }}
        >
          {expenses?.length > 0 ? (
            <Grid
              container
              sx={{ backgroundColor: "rgba(231, 234, 243, .4)", mb: 1, py: 1 }}
            >
              <Grid item xs={3} sx={{ p: 1 }}>
                <CustomTypographyBold weight={400} color={"text.black"}>
                  EXPENSE CATEGORY
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={5} sx={{ p: 1 }}>
                <CustomTypographyBold weight={400} color={"text.black"}>
                  RECEIPT ATTACHMENT
                </CustomTypographyBold>
              </Grid>
              <Grid item xs={2} sx={{ p: 1 }}>
                <CustomTypographyBold weight={400} color={"text.black"}>
                  AMOUNT
                </CustomTypographyBold>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {expenses?.length > 0 ? (
            expenses?.map((expense, index) => (
              <Paper key={expense.category} elevation={0} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>{expense.category}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <ToggleButtonGroup
                        color="primary"
                        aria-label="Platform"
                        sx={{
                          width: "100%",
                          border: ".0625rem solid rgba(231, 234, 243, .7)",
                        }}
                      >
                        <Button
                          component="label"
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            color: "text.primary",
                            fontSize: "0.8125rem",
                            fontWeight: 400,
                            border: "none",
                            padding: "5px 6px",
                            minWidth: 0,
                            bgcolor: "background.paper",
                            "&:hover": {
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                              color: "text.btn_blue",
                              transform: "scale(1.01)",
                              border: "none",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          Choose File
                          <VisuallyHiddenInput
                            type="file"
                            onChange={(e) =>
                              handleFileChange(index, e.target.files[0])
                            }
                          />
                        </Button>
                        <Button
                          component="label"
                          variant="outlined"
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            color: "text.primary",
                            fontSize: "0.8125rem",
                            fontWeight: 400,
                            border: "none",
                            borderLeft: "1px solid rgba(99, 99, 99, 0.2)",
                            padding: "5px 6px",
                            minWidth: 0,
                            width: "70%",
                            display: "flex",
                            justifyContent: "start",
                            bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
                            "&:hover": {
                              boxShadow:
                                "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                              color: "text.btn_blue",
                              transform: "scale(1.01)",
                              border: "none",
                            },
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        >
                          {expense.file?.name
                            ? expense.file.name?.length < 30
                              ? expense.file.name
                              : `${expense.file.name?.slice(0, 30)}...`
                            : "No file chosen"}
                          <VisuallyHiddenInput
                            type="file"
                            onChange={(e) =>
                              handleFileChange(index, e.target.files[0])
                            }
                          />
                        </Button>
                      </ToggleButtonGroup>
                    </Box>
                    {expense?.file?.name?.length > 40 && (
                      <Typography
                        variant="caption"
                        sx={{ color: "red", pl: 3 }}
                      >
                        File name is too long. maximum 30 characters are
                        allowed.
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <CommonInputField
                      placeholder="Amount"
                      fullWidth
                      size="small"
                      value={expense.amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          handleAmountChange(index, e.target.value);
                        }
                      }}
                      type="number"
                      error={expense.error}
                      helperText={
                        expense.error
                          ? "Amount is required when a file is uploaded."
                          : ""
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Card
              sx={{
                mt: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "center",
                    gap: "12px",
                  }}
                >
                  <InfoOutlined color="action" />
                  <Typography variant="h6" gutterBottom>
                    No Budget Preferences Set
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" color="text.secondary">
                    This job does not have any expense categories or budget
                    preferences defined. Please contact the client to set up
                    expense categories before adding expenses.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Footer */}
        {expenses?.length > 0 ? (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              left: 0,
              right: "2rem",
              zIndex: 1,
              backgroundColor: "background.paper",
              borderTop: "1px solid rgba(231, 234, 243, .4)",
              p: 2,
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                gap: 2,
              }}
            >
              <Typography variant="subtitle1">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
              <Box>
                <Button
                  onClick={() => {
                    onClose();
                    setExpenses(createInitialExpenses());
                  }}
                  sx={{
                    textTransform: "capitalize",
                    color: "text.primary",
                    fontSize: "0.8125rem",
                    fontWeight: 400,
                    mr: 1,
                    border: "1px solid rgba(99, 99, 99, 0.2)",
                    padding: "8px 16px",
                    minWidth: 0,
                    bgcolor: "background.paper",
                    "&:hover": {
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      color: "text.btn_blue",
                      transform: "scale(1.01)",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ textTransform: "none", maxWidth: "80px" }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </Modal>
  );
};

export default ExpenseModal;
