import {
  Box,
  Button,
  InputAdornment,
  Paper,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import React, { useEffect, useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { fetchClientsInfo } from "../../thunkOperation/job_management/states";
import { useDispatch } from "react-redux";

const ClientTable = ({ darkMode, clientsData, isLoading }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(clientsData?.per_page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(clientsData?.per_page || 15);
  const [filteredClients, setFilteredClients] = useState(clientsData);
  const [selectedClient, setSelectedClient] = useState([]);

  useEffect(() => {
    const filtered = clientsData?.data?.filter(
      (client) =>
        client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toString().includes(searchTerm)
    );
    setFilteredClients(filtered);
    setPage(0);
  }, [searchTerm, clientsData]);
  const [showDelBtn, setShowDelBtn] = useState(false);

  // ====================handleSearchChange=================
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // ====================handleChangeRowsPerPage=================
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(fetchClientsInfo(parseInt(event.target.value, 10)));
  };

  // ====================handle chnge page=================
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(fetchClientsInfo(newPage));
  };

  // ====================handle select all checkboxes=================
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedClient(filteredClients?.map((client) => client.id));
    } else {
      setSelectedClient([]);
    }
  };

  const handleSelectClient = (event, client_id) => {
    const selectedIndex = selectedClient.indexOf(client_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedClient, client_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedClient.slice(1));
    } else if (selectedIndex === selectedClient.length - 1) {
      newSelected = newSelected.concat(selectedClient.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedClient.slice(0, selectedIndex),
        selectedClient.slice(selectedIndex + 1)
      );
    }

    setSelectedClient(newSelected);
  };

  const handleDelete = () => {
    // Implement delete functionality here
    setSelectedClient([]);
  };
  return (
    <>
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
            placeholder="Search Clients"
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
              borderBottom: "1px solid ",
              borderColor:
                darkMode === "dark"
                  ? "rgba(255, 255, 255, .7)"
                  : "rgba(231, 234, 243, .7)",
            }}
          />
          {selectedClient?.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<DeleteOutline />}
              size="small"
              sx={{
                ml: 1,
                textTransform: "capitalize",
                color: "error.main",
                borderColor: "error.main",
                "&:hover": {
                  borderColor: "error.main",
                  backgroundColor: "error.light",
                  color: "white",
                },
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
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
                    <Checkbox
                      indeterminate={
                        selectedClient?.length > 0 &&
                        selectedClient?.length < filteredClients?.length
                      }
                      checked={
                        filteredClients?.length > 0 &&
                        selectedClient?.length === filteredClients?.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Client No.
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Contact #
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Regularly Hourly Rate
                  </TableCell>{" "}
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Holiday Hourly Rate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients?.length > 0
                  ? filteredClients
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      ?.map((client) => (
                        <TableRow
                          key={client.id}
                          hover
                          role="checkbox"
                          aria-checked={
                            selectedClient.indexOf(client.id) !== -1
                          }
                          tabIndex={-1}
                          selected={selectedClient.indexOf(client.id) !== -1}
                        >
                          <TableCell
                            padding="checkbox"
                            onClick={(event) =>
                              handleSelectClient(event, client.id)
                            }
                          >
                            <Checkbox
                              checked={selectedClient.indexOf(client.id) !== -1}
                              onChange={(event) =>
                                handleSelectClient(event, client.id)
                              }
                            />
                          </TableCell>
                          <TableCell
                            onClick={() => viewDetail(client.id)}
                            sx={{
                              "&:hover": {
                                color: "text.link",
                                fontWeight: 600,
                                cursor: "pointer",
                              },
                              color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                              fontWeight: "600",
                            }}
                          >
                            {client.id}
                          </TableCell>
                          <TableCell
                            onClick={() => viewDetail(client.id)}
                            sx={{
                              "&:hover": {
                                color: "text.link",
                                fontWeight: 600,
                                cursor: "pointer",
                              },
                              color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                              fontWeight: "600",
                            }}
                          >
                            {client.name}
                          </TableCell>
                          <TableCell>{client?.email}</TableCell>
                          <TableCell>{client?.phone}</TableCell>
                          <TableCell>
                            ${client.regular_hourly_rate}/hr
                          </TableCell>
                          <TableCell>
                            ${client.holiday_hourly_rate}/hr
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
          rowsPerPageOptions={[15, 25, 50]}
          component="div"
          count={clientsData?.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default ClientTable;
