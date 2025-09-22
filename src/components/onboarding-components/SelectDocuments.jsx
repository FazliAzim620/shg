import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Paper,
  Divider,
  TableContainer,
  TextField,
  InputAdornment,
  TablePagination,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
  setSelectedTab,
  toggleDocument,
  setTabData,
  setMinReferences,
} from "../../feature/onboarding/packageSlice";
import { CommonInputField } from "../job-component/CreateJobModal";
import API from "../../API";

const SelectDocuments = ({ docData, getTabProgressInfo }) => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.package.selectedTab);
  const minReferences = useSelector((state) => state.package.minReferences);

  const selectedDocuments = useSelector(
    (state) => state.package.selectedDocuments
  );
  const tabData = useSelector(
    (state) =>
      state.package.tabData || {
        documents: [],
        organizationDocs: [],
        referenceForms: [],
        forms: [],
        professionalRegistration: [],
        backgroundChecks: [],
      }
  );

  const [searchTerm, setSearchTerm] = useState("");
  // const [minReferences, setMinReferences] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredData, setFilteredData] = useState([]);

  const packageInfo = useSelector((state) => state.package.packageInfo);
  useEffect(() => {
    const data = tabData[selectedTab] || [];
    if (searchTerm.trim() === "") {
      setFilteredData(data);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = data.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" && value.toLowerCase().includes(term)
        )
      );
      setFilteredData(filtered);
    }
    setPage(0);
  }, [tabData, selectedTab, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getTabs = () => {
    const tabDefinitions = [
      { label: "Documents", value: "documents" },
      { label: "Organization's documents", value: "organizationDocs" },
      { label: "Reference forms", value: "referenceForms" },
      { label: "Forms", value: "forms" },
      { label: "Professional registration", value: "professionalRegistration" },
      { label: "Background checks", value: "backgroundChecks" },
    ];

    return tabDefinitions
      .map((tab) => {
        const tabItems = tabData?.[tab.value] || [];

        // Create a Set of "id|class" for unique matching
        const selectedSet = new Set();

        selectedDocuments.forEach((d) => {
          const exists = tabItems.some(
            (td) => td?.id === d?.id && td?.class === d?.class
          );

          if (exists) {
            selectedSet.add(`${d.id}|${d.class}`);
          }
        });

        const count = `${selectedSet.size}/${tabItems.length}`;

        return {
          ...tab,
          count,
        };
      })
      .filter((tab) => tab.count !== "0/0");
  };

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTab(newValue));
    setSearchTerm("");

    setPage(0);
  };

  const handleToggle = (doc) => {
    // Pass object with both id and class
    dispatch(toggleDocument({ id: doc.id, name: doc.name, class: doc.class }));
  };

  const isSelected = (doc) => {
    return selectedDocuments.some(
      (d) => d.id === doc.id && d.class === doc.class
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Debounce API call for minReferences
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (minReferences !== "" && /^[0-9]*$/.test(minReferences)) {
        try {
          const obj = {
            pkg_id: packageInfo?.id,
            min_profess_ref_to_submit: +minReferences,
          };
          const resp = await API.post(
            `/api/update-cred-onb-min-profess-ref-to-submit`,
            obj
          );
        } catch (error) {
          console.log(error);
        }
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [minReferences]);

  const handleMinReferencesChange = (event) => {
    const value = event.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      dispatch(setMinReferences(value));
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTableColumns = () => {
    switch (selectedTab) {
      case "documents":
        return (
          <TableRow sx={{ bgcolor: "rgba(231, 234, 243, .4)" }}>
            <TableCell>NAME</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>REQUIRED</TableCell>
            <TableCell>STATUS</TableCell>
          </TableRow>
        );
      case "organizationDocs":
        return (
          <TableRow sx={{ bgcolor: "rgba(231, 234, 243, .4)" }}>
            <TableCell>NAME</TableCell>
            <TableCell>PURPOSE</TableCell>
            <TableCell>UPLOADED</TableCell>
            <TableCell>LAST UPDATED</TableCell>
          </TableRow>
        );
      case "referenceForms":
      case "forms":
        return (
          <TableRow sx={{ bgcolor: "rgba(231, 234, 243, .4)" }}>
            <TableCell>NAME</TableCell>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>CREATED</TableCell>
            <TableCell>LAST UPDATED</TableCell>
          </TableRow>
        );
      default:
        return (
          <TableRow sx={{ bgcolor: "rgba(231, 234, 243, .4)" }}>
            <TableCell>NAME</TableCell>
            <TableCell>DETAILS</TableCell>
          </TableRow>
        );
    }
  };

  const renderTableRows = () => {
    if (filteredData.length === 0) {
      return (
        <TableRow sx={{ bgcolor: "rgba(231, 234, 243, .4)" }}>
          <TableCell colSpan={4} align="center">
            {searchTerm ? "No matching records found" : "No data available"}
          </TableCell>
        </TableRow>
      );
    }

    const paginatedData = filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return paginatedData.map((doc, index) => {
      switch (selectedTab) {
        case "documents":
          return (
            <TableRow
              key={`${doc.id}-${doc.class}-${index}`}
              sx={{ bgcolor: index % 2 === 1 ? "rgba(231, 234, 243, .4)" : "" }}
            >
              <TableCell>
                <Checkbox
                  checked={isSelected(doc)}
                  onChange={() => handleToggle(doc)}
                />
                {doc.name}
              </TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell>{doc.required}</TableCell>
              <TableCell>{doc.isActive}</TableCell>
            </TableRow>
          );
        case "organizationDocs":
          return (
            <TableRow
              key={`${doc.id}-${doc.class}-${index}`}
              sx={{ bgcolor: index % 2 === 1 ? "rgba(231, 234, 243, .4)" : "" }}
            >
              <TableCell>
                <Checkbox
                  checked={isSelected(doc)}
                  onChange={() => handleToggle(doc)}
                />
                {doc.name}
              </TableCell>
              <TableCell>{doc.purpose}</TableCell>
              <TableCell>{doc.uploaded}</TableCell>
              <TableCell>{doc.lastUpdated}</TableCell>
            </TableRow>
          );
        case "referenceForms":
          return (
            <TableRow
              key={`${doc.id}-${doc.class}-${index}`}
              sx={{ bgcolor: index % 2 === 1 ? "rgba(231, 234, 243, .4)" : "" }}
            >
              <TableCell>
                <Checkbox
                  checked={isSelected(doc)}
                  onChange={() => handleToggle(doc)}
                />
                {doc.name}
              </TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell>{doc.created}</TableCell>
              <TableCell>{doc.lastUpdated}</TableCell>
            </TableRow>
          );
        case "forms":
          return (
            <TableRow
              key={`${doc.id}-${doc.class}-${index}`}
              sx={{ bgcolor: index % 2 === 1 ? "rgba(231, 234, 243, .4)" : "" }}
            >
              <TableCell>
                <Checkbox
                  checked={isSelected(doc)}
                  onChange={() => handleToggle(doc)}
                />
                {doc.name}
              </TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell>{doc.created}</TableCell>
              <TableCell>{doc.lastUpdated}</TableCell>
            </TableRow>
          );
        default:
          return (
            <TableRow
              key={`${doc.id}-${doc.class}-${index}`}
              sx={{ bgcolor: index % 2 === 1 ? "rgba(231, 234, 243, .4)" : "" }}
            >
              <TableCell>
                <Checkbox
                  checked={isSelected(doc)}
                  onChange={() => handleToggle(doc)}
                />
                {doc.name}
              </TableCell>
              <TableCell>{doc.details || "-"}</TableCell>
            </TableRow>
          );
      }
    });
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        overflow: "auto",
        bgcolor: "background.paper",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "text.black",
          fontWeight: 600,
          fontSize: "20px",
          p: "24px",
        }}
      >
        Select required documents & forms
      </Typography>
      <Divider sx={{ opacity: 0.5, py: "12px" }} />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, p: "24px" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {getTabs().map((tab) => (
            <Tab
              key={tab.value}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">{tab.label}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      bgcolor: "rgba(222, 226, 230, 1)",
                      color: "rgba(30, 32, 34, 1)",
                      borderRadius: "4px",
                      px: 1,
                    }}
                  >
                    {tab.count}
                  </Typography>
                </Box>
              }
              value={tab.value}
              sx={{
                textTransform: "none",
                minHeight: "48px",
                py: 1,
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          p: "24px",
          borderRadius: "none",
          boxShadow: "none",
        }}
      >
        <Box sx={{ mb: 2 }}>
          {selectedTab === "referenceForms" && (
            <>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "text.black",
                  pb: "8px",
                }}
              >
                Minimum number of references
              </Typography>

              <CommonInputField
                name="minimumReference"
                placeholder="Minimum reference forms required"
                value={minReferences || ""}
                onChange={handleMinReferencesChange}
                type="number"
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgba(108, 117, 125, 1)",
                  pt: "4px",
                }}
              >
                Specify the least number of reference forms required from the
                provider. Leaving this blank implies no minimum.
              </Typography>
            </>
          )}
        </Box>
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <TextField
            variant="standard"
            size="small"
            placeholder={`Search ${selectedTab}...`}
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
              borderBottom: "0.9px solid",
              borderColor: "rgba(231, 234, 243, 0.7)",
              "& .MuiInputBase-input::placeholder": {
                color: "black",
                fontSize: "12.64px",
                lineHeight: "15.3px",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
              },
              flex: 1,
            }}
          />
        </Box>

        <TableContainer
          sx={{
            border: "1px solid rgba(222, 226, 230, 1)",
            borderRadius: "12px",
          }}
        >
          <Table>
            <TableHead>{renderTableColumns()}</TableHead>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 1,
            mr: 2,
            color: "text.secondary",
          }}
        >
          {getTabProgressInfo()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SelectDocuments;
