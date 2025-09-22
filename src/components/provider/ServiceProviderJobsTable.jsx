import React, { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Checkbox,
  Tooltip,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import CustomTypographyBold from "../CustomTypographyBold";

import CustomChip from "../CustomChip";
import { getProviderJobs } from "../../api_request";
import { isAfter } from "date-fns";
import SkeletonRow from "../SkeletonRow";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";

const ServiceProviderJobsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filterJobs, setFilterJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const darkMode = useSelector((state) => state.theme.mode);
  const providerDetails = useSelector(
    (state) => state.providerDetails?.provider
  );
  const isLightMode = darkMode == "light";
  const [selectedClient, setSelectedClient] = useState([]);
  // ====================handle select all checkboxes=================
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedClient(jobs?.map((client) => client.id));
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
  const getProviderJobsHandler = async () => {
    try {
      const resp = await getProviderJobs(providerDetails?.id);
      if (resp?.data?.success) {
        setJobs(resp?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProviderJobsHandler();
  }, []);
  useEffect(() => {
    if (!jobs) return; // Ensure jobs is defined
    const filtered = jobs.filter(
      (client) =>
        client?.client_name
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase()) ||
        client.id.toString().includes(searchTerm)
    );
    setFilterJobs(filtered);
  }, [searchTerm, jobs]);
  const data = filterJobs?.filter((job) => job?.client_id);

  return (
    <Box sx={{ py: 3 }}>
      {data?.length > 0 && (
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          placeholder="Search priviledges"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{
            borderRadius: "5px",
            mb: 2,
            mx: 3,
            width: "95%",
            bgcolor: isLightMode ? "#F6F7Fa" : "#333",
            color: isLightMode ? "black" : "white",
            border: ".0625rem solid rgba(231, 234, 243, .7)",
            "& fieldset": { border: "none" },
            "& .MuiOutlinedInput-root.Mui-focused": {
              backgroundColor: isLightMode ? "white" : "#25282A",
              boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            },
            "&:focus .MuiOutlinedInput-root": {
              backgroundColor: isLightMode ? "white" : "#25282A",
              boxShadow:
                " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
            },
            input: {
              color: isLightMode ? "black" : "white",
            },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : data?.length > 0 ? (
          <Table>
            <TableHead sx={{ bgcolor: isLightMode ? "#F6F7Fa" : "#333" }}>
              <TableRow>
                {/* <TableCell
                  padding="checkbox"
                  sx={{ border: "none", fontWeight: 400 }}
                >
                  <Checkbox
                    className={`${selectedClient?.length == 0 && "checkbox"}`}
                    indeterminate={
                      selectedClient?.length > 0 &&
                      selectedClient?.length < DataTransferItemList?.length
                    }
                    checked={
                      filterJobs?.length > 0 &&
                      selectedClient?.length === filterJobs?.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell sx={{ border: "none", fontWeight: 400 }}>
                  CLIENT
                </TableCell>
                <TableCell sx={{ border: "none", fontWeight: 400 }}>
                  ROLE & SPECIALTY
                </TableCell>
                <TableCell sx={{ border: "none", fontWeight: 400 }}>
                  PRIVILEGE STATUS
                </TableCell>
                <TableCell sx={{ border: "none", fontWeight: 400 }}>
                  EXPIRY DATE {filterJobs?.[0]?.client_name}
                </TableCell>
                <TableCell sx={{ border: "none", fontWeight: 400 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ px: 3 }}>
              {filterJobs
                ?.filter((job) => job?.client_id)
                ?.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ border: "none" }}
                      >
                        <Typography
                          color="primary"
                          textTransform={"capitalize"}
                        >
                          {row.client_name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        <CustomTypographyBold
                          weight={600}
                          fontSize={"0.875rem"}
                          color={"text.black"}
                          lineHeight={1.5}
                        >
                          {row?.role || "--"}
                        </CustomTypographyBold>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                          }}
                        >
                          <CustomTypographyBold
                            weight={400}
                            fontSize={"0.75rem"}
                            color={"text.form_input"}
                            lineHeight={1.5}
                          >
                            {row?.speciality?.name || "--"}
                          </CustomTypographyBold>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        <CustomChip
                          dot={true}
                          width={40}
                          chipText={
                            isAfter(
                              new Date(row.privilege_end_date),
                              new Date()
                            )
                              ? "Valid"
                              : "Expired"
                          }
                          color={
                            isAfter(
                              new Date(row.privilege_end_date),
                              new Date()
                            )
                              ? "rgba(0, 201, 167)"
                              : "rgba( 237, 76, 120)"
                          }
                          bgcolor={
                            isAfter(
                              new Date(row.privilege_end_date),
                              new Date()
                            )
                              ? "rgba(0, 201, 167,0.1)"
                              : "rgba( 237, 76, 120,0.1)"
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ border: "none" }}>
                        {row?.privilege_end_date}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        ) : (
          <NodataFoundCard />
        )}
      </TableContainer>
    </Box>
  );
};

export default ServiceProviderJobsTable;
