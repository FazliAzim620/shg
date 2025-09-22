import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  MenuItem,
  Menu,
  Divider,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  ArrowDownward,
  ExpandMore,
  SaveAltOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import CustomBadge from "../../components/CustomBadge";
import CustomChip from "../../components/CustomChip";
import PrintIcon from "@mui/icons-material/Print";
import TableViewIcon from "@mui/icons-material/TableView";
import ArchiveIcon from "@mui/icons-material/Archive";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";
const ProviderPaymentTable = ({ paymentData }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProivders, setFilteredProivders] = useState(paymentData);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [page, setPage] = useState(paymentData?.per_page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(paymentData?.per_page || 15);
  useEffect(() => {
    const filtered = paymentData?.data?.filter(
      (prov) =>
        prov.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        prov.id.toString().includes(searchTerm)
    );
    setFilteredProivders(filtered);
    setPage(0);
  }, [searchTerm, paymentData]);

  // ====================handle change page=================
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(fetchProvidersInfo(newPage));
  };

  // ====================handleChangeRowsPerPage=================
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(fetchProvidersInfo(parseInt(event.target.value, 10)));
  };

  // ====================handle select all checkboxes=================
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProviders(filteredProivders?.map((provider) => provider.id));
    } else {
      setSelectedProviders([]);
    }
  };

  const handleSelectProvider = (event, providerId) => {
    const selectedIndex = selectedProviders.indexOf(providerId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProviders, providerId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProviders.slice(1));
    } else if (selectedIndex === selectedProviders?.length - 1) {
      newSelected = newSelected.concat(selectedProviders.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedProviders.slice(0, selectedIndex),
        selectedProviders.slice(selectedIndex + 1)
      );
    }

    setSelectedProviders(newSelected);
  };

  const handleDelete = () => {
    // Implement delete functionality here
  };
  // ====================handleSearchChange=================
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 120,
      color: "rgb(55, 65, 81)",
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[300],
      }),
    },
  }));
  // ======================drop down export menu=========================
  const [anchorElExport, setAnchorElExport] = useState(null);
  const openExport = Boolean(anchorElExport);
  const handleClickExport = (event) => {
    setAnchorElExport(event.currentTarget);
  };
  const handleCloseExport = () => {
    setAnchorElExport(null);
  };

  // ======================drop down menu=========================
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          variant="standard"
          size="small"
          placeholder="Search Payment"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          sx={{
            borderBottom: "1px solid",
            borderColor:
              darkMode === "dark"
                ? "rgba(255, 255, 255, .7)"
                : "rgba(231, 234, 243, .7)",
          }}
        />

        {selectedProviders?.length > 0 && (
          <>
            <Button
              variant="outlined"
              startIcon={<SaveAltOutlined />}
              size="small"
              sx={{
                ml: 1,
                textTransform: "capitalize",
                color: "text.secondary",

                borderColor: "#EEF0F7",
                "&:hover": {
                  color: "#4F3870",
                  borderColor: "#EEF0F7",
                  bgcolor: "white",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                },
              }}
              onClick={handleClickExport}
              aria-controls={
                openExport ? "demo-customized-menu-export" : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              Export{"  "}&nbsp;
              <ExpandMore
                sx={{
                  "&:hover": {
                    color: "text.btn_blue",
                  },
                }}
              />
            </Button>
            <StyledMenu
              id="demo-customized-menu-export"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorElExport}
              open={openExport}
              onClose={handleCloseExport}
            >
              <MenuItem onClick={handleCloseExport} disableRipple>
                <PrintIcon />
                Print
              </MenuItem>
              <MenuItem onClick={handleCloseExport} disableRipple>
                <TableViewIcon />
                Excel
              </MenuItem>
              {/* <Divider sx={{ my: 0.5 }} /> */}
              <MenuItem onClick={handleCloseExport} disableRipple>
                <ArchiveIcon />
                .CSV
              </MenuItem>
              <MenuItem onClick={handleCloseExport} disableRipple>
                <PictureAsPdfIcon />
                PDF
              </MenuItem>
            </StyledMenu>
          </>
        )}
      </Box>
      {/* ========================table=================== */}
      {isLoading ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                  }}
                >
                  <BpCheckbox
                    indeterminate={
                      selectedProviders?.length > 0 &&
                      selectedProviders?.length < filteredProivders?.length
                    }
                    checked={
                      filteredProivders?.length > 0 &&
                      selectedProviders?.length === filteredProivders?.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Invoice
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Client
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Payment status
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Submission Status
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Total Amount
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#F8FAFD",
                    fontWeight: 400,
                    fontSize: "11.9px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProivders?.length > 0
                ? filteredProivders
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((provider) => (
                      <TableRow
                        key={provider.id}
                        hover
                        role="checkbox"
                        aria-checked={
                          selectedProviders.indexOf(provider.id) !== -1
                        }
                        tabIndex={-1}
                        selected={selectedProviders.indexOf(provider.id) !== -1}
                      >
                        <TableCell
                          sx={{ borderBottom: "none" }}
                          padding="checkbox"
                          onClick={(event) =>
                            handleSelectProvider(event, provider.id)
                          }
                        >
                          <BpCheckbox
                            checked={
                              selectedProviders.indexOf(provider.id) !== -1
                            }
                            onChange={(event) =>
                              handleSelectProvider(event, provider.id)
                            }
                          />
                        </TableCell>
                        <TableCell
                          onClick={() => viewDetail(provider.id)}
                          sx={{
                            borderBottom: "none",
                            "&:hover": {
                              fontWeight: 600,
                              cursor: "pointer",
                            },
                            color:
                              darkMode == "dark" ? "primary.main" : "text.main",
                          }}
                        >
                          #{provider.invoice}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "none",
                            color: "text.secondary",
                          }}
                        >
                          {provider.date}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "none",
                            color: "text.secondary",
                          }}
                        >
                          {provider.client}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "none" }}>
                          <CustomChip
                            dot={true}
                            width={100}
                            chipText={provider.paymentStatus}
                            color={
                              provider.paymentStatus === "Paid"
                                ? "rgba(0, 201, 167)" // Text color for "Paid" status
                                : "#F5CA99"
                            }
                            bgcolor={
                              provider.paymentStatus === "Paid"
                                ? "#DCF1F1" // Background color for "Paid" status
                                : "#F5F2F0"
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "none",
                            color: "text.secondary",
                          }}
                        >
                          <CustomChip
                            dot={true}
                            width={157}
                            chipText={provider.submissionStatus}
                            color={
                              provider.submissionStatus === "Approved by client"
                                ? "#09A5BE" // Text color for "Paid" status
                                : "#132144"
                            }
                            bgcolor={
                              provider.submissionStatus === "Approved by client"
                                ? "#DDEFF4" // Background color for "Paid" status
                                : "#DEE1E8"
                            }
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "none",
                            color: "text.secondary",
                          }}
                        >
                          ${provider.totalAmount}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "none",
                            color: "text.secondary",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              ml: 1,
                              textTransform: "capitalize",
                              color: "text.secondary",
                              bgcolor: "white",
                              borderColor: "#EEF0F7",
                              "&:hover": {
                                color: "#4F3870",
                                bgcolor: "white",

                                borderColor: "#EEF0F7",
                                boxShadow:
                                  "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                              },
                            }}
                            aria-controls={
                              open ? "demo-customized-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                          >
                            <SaveAltOutlined sx={{ fontSize: "14px" }} />
                            {"  "}&nbsp;&nbsp;Download{"  "}&nbsp;
                            <ExpandMore
                              sx={{
                                fontSize: "14px",
                                "&:hover": {
                                  color: "text.btn_blue",
                                },
                              }}
                            />
                          </Button>
                          <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                              "aria-labelledby": "demo-customized-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                          >
                            {/* <MenuItem onClick={handleClose} disableRipple>
                              <VisibilityOutlined />
                              View Invoice
                            </MenuItem> */}
                            {/* <Divider sx={{ my: 0.5 }} /> */}
                            {/* <Typography>Download Options</Typography> */}
                            <MenuItem onClick={handleClose} disableRipple>
                              <TableViewIcon />
                              Excel
                            </MenuItem>
                            <MenuItem onClick={handleClose} disableRipple>
                              <PictureAsPdfIcon />
                              PDF
                            </MenuItem>
                            <MenuItem onClick={handleClose} disableRipple>
                              <ArchiveIcon />
                              .CSV
                            </MenuItem>

                            <MenuItem onClick={handleClose} disableRipple>
                              <PrintIcon />
                              Print
                            </MenuItem>
                          </StyledMenu>
                        </TableCell>
                      </TableRow>
                    ))
                : ""}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* ========================pagination=================== */}
      <TablePagination
        rowsPerPageOptions={[10, 15, 25, 50]}
        component="div"
        count={paymentData?.total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProviderPaymentTable;
