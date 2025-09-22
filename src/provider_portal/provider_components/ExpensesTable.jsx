import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import {
  Close,
  Description,
  Download,
  EditOutlined,
  Image,
  PictureAsPdf,
} from "@mui/icons-material";
import { downloadHandlerFile } from "../../util";
import NodataFoundCard from "./NodataFoundCard";
const ExpensesTable = ({ expenses, removeExpenses, editHandler, view }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const NoBorderTableCell = styled(TableCell)(({ theme }) => ({
    border: "none", // Remove the border
    padding: theme.spacing(2),
    color: darkMode == "light" ? "#71869d" : "text.or_color",
    fontWeight: 400,
  }));
  // Function to get file extension
  const getFileIcon = (file) => {
    if (!file) return <Description sx={{ fontSize: "1.25rem" }} />;

    const fileExtension = file?.name?.split(".").pop().toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return <PictureAsPdf sx={{ fontSize: "1.25rem" }} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image sx={{ fontSize: "1.25rem" }} />;
      default:
        return <Description sx={{ fontSize: "1.25rem" }} />;
    }
  };

  const downloadHandler = (fileName) => {
    downloadHandlerFile(fileName);
  };
  console.log("expenses", expenses);
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}>
          <TableRow>
            <TableCell
              sx={{
                p: 1,
                color: darkMode == "light" ? "#71869d" : "white",
                fontWeight: 500,
              }}
            >
              Expense category
            </TableCell>
            {/* <TableCell
              sx={{
                p: 1,
                color: darkMode == "light" ? "#71869d" : "white",
                fontWeight: 500,
              }}
            >
              Budget
            </TableCell> */}
            <TableCell
              sx={{
                p: 1,
                color: darkMode == "light" ? "#71869d" : "white",
                fontWeight: 500,
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                p: 1,
                color: darkMode == "light" ? "#71869d" : "white",
                fontWeight: 500,
              }}
            >
              Receipt
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses?.length === 0 ? (
            <TableRow sx={{}}>
              <TableCell colSpan={6}>
                <NodataFoundCard title={"No attachments uploaded"} />
              </TableCell>
            </TableRow>
          ) : (
            expenses?.map((expense, index) => (
              <TableRow key={index}>
                <NoBorderTableCell sx={{ color: "text.gray" }}>
                  {expense?.category}
                </NoBorderTableCell>

                <NoBorderTableCell>
                  ${parseFloat(expense.amount).toFixed(2)}
                </NoBorderTableCell>
                <NoBorderTableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent: "start",
                    mt: "0.51rem",
                  }}
                >
                  {expense?.file
                    ? getFileIcon(expense?.file)
                    : expense?.file_name
                    ? getFileIcon(expense?.file_name)
                    : ""}{" "}
                  {expense?.file?.name || expense?.file_name}
                </NoBorderTableCell>
                <NoBorderTableCell>
                  <ToggleButtonGroup
                    color="primary"
                    aria-label="Platform"
                    sx={{
                      width: "100%",
                    }}
                  >
                    {expense?.id && (
                      <CustomButton
                        label={
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "text.or_color",
                              "&:hover": {
                                color: "text.btn_theme",
                              },
                            }}
                          >
                            <Download sx={{ fontSize: "1.2rem", mr: 0.3 }} />
                          </Typography>
                        }
                        mr={"0rem"}
                        onClick={() => {
                          downloadHandler(expense?.file_name);
                        }}
                      />
                    )}
                    {!view && (
                      <CustomButton
                        label={
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "text.or_color",
                              "&:hover": {
                                color: "text.btn_theme",
                              },
                            }}
                          >
                            <EditOutlined
                              sx={{ fontSize: "1.2rem", mr: 0.3 }}
                            />
                            Edit
                          </Typography>
                        }
                        mr={"0rem"}
                        onClick={() => {
                          editHandler(expense);
                        }}
                      />
                    )}
                    {!view && (
                      <CustomButton
                        padding="7px 1rem"
                        label={
                          <Typography
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "text.or_color",
                              "&:hover": {
                                color: "text.btn_theme",
                              },
                            }}
                          >
                            <Close sx={{ fontSize: "1.2rem", mr: 0.3 }} />
                            Remove
                          </Typography>
                        }
                        onClick={() => {
                          removeExpenses(index);
                        }}
                      />
                    )}
                  </ToggleButtonGroup>
                </NoBorderTableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpensesTable;
