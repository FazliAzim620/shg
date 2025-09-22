import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  TablePagination,
  Checkbox,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  Search,
  FilterList,
  SaveAltOutlined,
  ExpandMore,
  Person,
  Close,
} from "@mui/icons-material";
import ExportDrawer from "../../../../components/common/ExportDrawer";
import ClearFilterDesign from "../../../../components/common/filterChips/ClearFilterDesign";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  downloadHandlerFile,
  formatOnlyDate,
  selectOptions,
} from "../../../../util";
import { useSelector } from "react-redux";

import OrganizationDocFilter from "./OrganizationDocFilter";

import ExportAlert from "../../../../components/common/ExportAlert";
import CustomChip from "../../../../components/CustomChip";
import SkeletonRow from "../../../../components/SkeletonRow";
import { SearchIcon } from "../../../../components/post-job/PostedJobsIcons";
import ROUTES from "../../../../routes/Routes";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../../../components/handleConfirmDelete";
import API, { baseURLImage } from "../../../../API";
import NodataFoundCard from "../../../provider_components/NodataFoundCard";
import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";

const DocumentsTable = ({
  openEditHandler,
  confirmStatus,
  changeOccure,
  confirmDelete,
  viewDetailsHandler,
  ipAddress,
  id,
  userId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));
  const { roles } = useSelector((state) => state.users);

  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleActionsClick = (event, user) => {
    setActionsAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  // =========---------------------------------------------------------------------------- Filter function
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const openFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const countAppliedFilters = (filters) => {
    if (filters) {
      let count = 0;

      Object.values(filters).forEach((value) => {
        if (Array.isArray(value)) {
          count += value.filter((item) => item !== "").length;
        } else if (value !== "" && value !== null && value !== undefined) {
          count++;
        }
      });

      return count;
    }
  };

  const getOrganizationsDocuments = async (data) => {
    let url;
    if (data?.page && data?.type == "filter") {
      url = `/api/get-prov-cred-org-docs?for_provider_user_id=${
        userId ? userId : user?.user?.id
      }&page=${data.page || 1}&paginate=${data.per_page}&search=${
        data?.search
      }&status=${data?.status || ""} `;
    } else {
      url = `/api/get-prov-cred-org-docs?for_provider_user_id=${
        userId ? userId : user?.user?.id
      }&page=${data.page || 1}&paginate=${data.per_page}&search=${
        data?.search
      } `;
    }

    try {
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const clearFilterHandler = () => {
    setFilterData(null);
  };

  const handleRemove = (key) => {
    setFilterData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[key]; // Remove the key from the data
      return updatedData;
    });
  };

  const handleRemoveRole = (roleToRemove) => {
    setFilterData((prevData) => {
      const updatedRoles = prevData.roles.filter(
        (role) => role !== roleToRemove
      ); // Remove the specific role
      return { ...prevData, roles: updatedRoles };
    });
  };
  // =========---------------------------------------------------------------------------- Filter function
  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "name" },
    { name: "role " },
    { name: "specialties" },
    { name: "hourly_rate" },
    { name: "accounts_status" },
    { name: "recruiter" },
    { name: "jobs" },
    { name: "created_at" },
  ]);

  const handleExportClick = () => {
    setExportDrawerOpen(true);
  };

  const [isExportLoading, setIsExportLoading] = useState(() => {
    return localStorage.getItem("exportLoading") === "serviceProvider";
  });
  const [openSyncAlert, setOpenSyncAlert] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const handleExport = async (selectedColumns, fileType) => {
    const requestData = {
      search: searchTerm || "",
      client_id: id || "",
      status: filters?.[0]?.jobStatus || "",
      provider_name: filters?.[0]?.provider_name || "",
      role: filters?.[0]?.role || "",
      speciality: filters?.[0]?.speciality || "",
      from_date: filters?.[0]?.from_date || "",
      end_date: filters?.[0]?.end_date || "",
      max_rate: filters?.[0]?.max_rate || "",
      min_rate: filters?.[0]?.min_rate || "",
      jobOrder: true,
    };
    const bodyData = {
      filetype: fileType,
      columns: selectedColumns?.join(","),
      ...requestData,
    };
    try {
      setIsExportLoading(true);
      setExportMessage(
        "Generating your export file. This may take a few moments."
      );
      const resp = await API.post(`/api/providers-export`, bodyData);
      if (resp?.data?.success) {
        const statusResp = await checkGetReadyExport(
          resp?.data?.data?.export_status_id
        );
        setExportMessage(resp?.data?.msg);

        if (statusResp?.data?.success) {
          setExportMessage(statusResp?.data?.msg);
          setIsExportLoading(false);
          setIsExportSuccess(true);
          setTimeout(() => {
            setIsExportSuccess(false);
          }, 5000);
        }
      } else {
        setIsExportLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsExportLoading(false);
    }
  };

  // =========---------------------------------------------------------------------------- Export function  end

  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedDocuments((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedDocuments((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };
  // Filter documents based on the id prop
  const filteredDocuments =
    id !== null && id !== undefined
      ? documents.filter((doc) => doc.id === id)
      : documents;

  // Handle "Select All" checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(filteredDocuments.map((user) => user.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const isIndeterminate =
    selectedDocuments?.length > 0 &&
    selectedDocuments.length < filteredDocuments.length;
  const isAllSelected = selectedDocuments?.length === filteredDocuments?.length;
  const [filterApplied, setFilterApplied] = useState(false);

  const getDocuments = async (
    currentPage = 1,
    perPage = 10,
    roleName = null
  ) => {
    setIsLoading(true);
    try {
      const data = {
        status: filterData?.status || "",
        page: filterApplied ? 1 : currentPage,
        per_page: perPage,
        search: searchTerm || "",
        type: filterData?.status ? "filter" : "",
      };

      const fetchedData = await getOrganizationsDocuments(data);
      // Update pagination state
      if (fetchedData?.success) {
        if (location?.state?.role) {
          navigate(ROUTES?.userManagement, { state: { role: null } });
        }
        setIsLoading(false);
        setDocuments(fetchedData?.data?.data);
        setPagination((prevPagination) => ({
          ...prevPagination,
          currentPage: fetchedData?.data?.current_page,
          total: fetchedData?.data?.total,
          lastPage: fetchedData?.data?.last_page,
        }));
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getDocuments(newPage + 1, rowsPerPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getDocuments(1, newRowsPerPage);
  };

  useEffect(() => {
    if (!location?.state?.role) {
      getDocuments(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage, filterData, changeOccure]);

  useEffect(() => {
    if (location?.state?.role) {
      const role = roles?.roles.find((r) => r.name === location?.state?.role);
      getDocuments(1, rowsPerPage, role?.name);
      setFilterData({
        firstName: "",
        lastName: "",
        email: "",
        roles: [role?.id] || [],
        status: "active",
      });
      setFilterApplied(true);
    }
  }, []);

  const downloadHandler = async (selected) => {
    // Parse and log JSON structure if it exists
    let surveyData = null;
    if (selected?.json_structure) {
      try {
        surveyData = JSON.parse(selected.json_structure);
        console.log("json ", surveyData);
      } catch (error) {
        console.error("Error parsing json_structure:", error);
      }
    }

    // Generate and download PDF for SurveyJS form
    if (surveyData) {
      try {
        const doc = new jsPDF();
        let yOffset = 10;

        // Add document title
        doc.setFontSize(16);

        yOffset += 10;

        // Process pages and questions
        const pages = surveyData.pages || [];
        pages.forEach((page, pageIndex) => {
          // Add page title
          const pageTitle = page.title || page.name || `Page ${pageIndex + 1}`;
          doc.setFontSize(14);
          doc.text(`${pageTitle}`, 10, yOffset);
          yOffset += 10;

          // Process questions (elements)
          const elements = page.elements || [];
          elements.forEach((element, qIndex) => {
            const questionTitle =
              element.title || element.name || "Untitled Question";
            const questionType = element.type || "Unknown";
            const inputType = element.inputType || "";
            const isRequired = element.isRequired ? " (Required)" : "";

            // Add question title and type
            doc.setFontSize(12);
            doc.text(`${qIndex + 1}. ${questionTitle}  `, 15, yOffset);
            yOffset += 7;

            // Draw input field based on question type
            if (questionType === "text") {
              // Text input box
              const prefix =
                inputType === "email"
                  ? "Email: "
                  : inputType === "tel"
                  ? "Tel: "
                  : inputType === "range"
                  ? "Range: "
                  : "";
              doc.setFontSize(10);
              doc.text(prefix, 20, yOffset + 7);
              doc.rect(20 + (prefix ? 20 : 0), yOffset, 100, 10); // Adjust x for prefix
              // Add response if available
              if (surveyData.data && surveyData.data[element.name]) {
                doc.text(
                  `${surveyData.data[element.name]}`,
                  22 + (prefix ? 20 : 0),
                  yOffset + 7
                );
              }
              yOffset += 15;
            } else if (questionType === "signaturepad") {
              // Signature pad box
              doc.setFontSize(10);
              doc.text("Signature:", 20, yOffset + 7);
              doc.rect(20, yOffset + 10, 100, 30); // Larger box for signature
              // Add response (e.g., image data) if available
              if (surveyData.data && surveyData.data[element.name]) {
                doc.text("(Signature Data)", 22, yOffset + 25); // Placeholder for signature
              }
              yOffset += 45;
            } else if (questionType === "rating") {
              // Rating: stars or numbers
              const isStars = element.rateType === "stars";
              doc.setFontSize(10);
              if (isStars) {
                doc.text(`Rating: ★★★★★`, 20, yOffset + 7);
              } else {
                doc.text("Rating: 1 2 3 4 5", 20, yOffset + 7); // Numeric scale
              }
              // Add response if available
              if (surveyData.data && surveyData.data[element.name]) {
                doc.text(
                  `Selected: ${surveyData.data[element.name]}`,
                  20,
                  yOffset + 14
                );
              }
              yOffset += isStars ? 15 : 20;
            } else if (questionType === "file") {
              // File input box
              doc.setFontSize(10);
              doc.text("File:", 20, yOffset + 7);
              doc.rect(20, yOffset, 100, 10);
              doc.text("Choose File", 22, yOffset + 7);
              // Add response (e.g., file name) if available
              if (surveyData.data && surveyData.data[element.name]) {
                doc.text(
                  `Uploaded: ${surveyData.data[element.name]}`,
                  20,
                  yOffset + 14
                );
              }
              yOffset += 20;
            } else if (questionType === "dropdown") {
              // Dropdown: list choices
              doc.setFontSize(10);
              doc.text("Dropdown:", 20, yOffset + 7);
              const choices = element.choices || [];
              choices.forEach((choice, cIndex) => {
                doc.text(`- ${choice}`, 25, yOffset + 14 + cIndex * 7);
              });
              // Draw a box with an arrow to mimic dropdown
              doc.rect(20, yOffset, 100, 10);
              doc.text("▼", 110, yOffset + 7); // Arrow
              // Add response if available
              if (surveyData.data && surveyData.data[element.name]) {
                doc.text(
                  `Selected: ${surveyData.data[element.name]}`,
                  20,
                  yOffset + 14 + choices.length * 7
                );
              }
              yOffset += 20 + choices.length * 7;
            }

            // Prevent page overflow
            if (yOffset > 270) {
              doc.addPage();
              yOffset = 10;
              // Re-add page title on new page
              doc.setFontSize(14);
              doc.text(`${pageTitle}`, 10, yOffset);
              yOffset += 10;
            }
          });

          yOffset += 5; // Space between pages
        });

        // Download the PDF
        doc.save(`survey_form_${selected?.id || "form"}.pdf`);
      } catch (error) {
        console.log(error);
      }
    }

    // Handle file download and update API
    if (selected?.file_path) {
      const url = `${baseURLImage}api/download-any/uploads/credentialing/organization/${selected?.file_path}`;
      try {
        // Initiate file download
        window.open(url, "_blank");

        // Prepare FormData for update API
        const formdata = new FormData();
        formdata.append(
          "for_provider_user_id",
          userId ? userId : user?.user?.id
        );
        formdata.append("class", selected.class);
        formdata.append("id", selected?.id);
        formdata.append("ip", ipAddress);

        // Call update API after download initiation
        const resp = await API.post(
          "api/update-prov-cred-org-doc-download",
          formdata
        );
        console.log("Update API response:", resp.data);
      } catch (error) {
        console.error("Error in update API or download:", error);
      }
    }
  };

  return !isLoading &&
    filteredDocuments?.length === 0 &&
    countAppliedFilters(filterData) === undefined ? (
    <NodataFoundCard title={"No documents to display"} />
  ) : (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
        border: "1px solid rgba(222, 226, 230, 1)",
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
          placeholder="Search documents by name"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getDocuments(pagination?.currentPage, pagination?.perPage);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                onClick={() =>
                  getDocuments(pagination?.currentPage, pagination?.perPage)
                }
              >
                <SearchIcon sx={{ cursor: "pointer" }} />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          sx={{
            borderBottom: "0.9px solid rgba(231, 234, 243, 0.7)",
            "& .MuiInputBase-input::placeholder": {
              fontSize: "12.64px",
              lineHeight: "15.3px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SaveAltOutlined />}
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: " .8125rem",
              fontWeight: 400,
              borderColor: "rgba(231, 234, 243, .7)",
              "&:hover": {
                borderColor: "rgba(231, 234, 243, .7)",
              },
            }}
            onClick={handleExportClick}
          >
            Export
          </Button>

          <Button
            onClick={openFilterDrawer}
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: ".8125rem",
              fontWeight: 400,
              borderColor: "rgba(231, 234, 243, .7)",
              "&:hover": {
                borderColor: "rgba(231, 234, 243, .7)",
              },
            }}
          >
            {countAppliedFilters(filterData) > 0 ? (
              <>
                Clear Filters
                <Box
                  sx={{
                    bgcolor: "rgba(231, 234, 243, .7)",
                    px: 1,
                    color: "text.black",
                    borderRadius: "50%",
                  }}
                >
                  {countAppliedFilters(filterData)}
                </Box>
              </>
            ) : (
              "Filter"
            )}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          px: 2,
          alignItems: "center",
        }}
      >
        {/* Displaying user data */}
        {filterData
          ? Object.entries(filterData)?.map(([key, value]) => {
              if (value && value !== "" && value.length > 0) {
                return (
                  <Box
                    key={key}
                    sx={{
                      pr: 1,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    {key === "roles" && value?.length > 0 ? (
                      value?.map((role, index) => {
                        return (
                          <Button
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 0.5,
                              color: "#1E1022",
                              fontWeight: 500,
                              fontSize: "14px",
                              textTransform: "capitalize",
                              mb: 1,
                              border: "1px solid #DEE2E6",
                              bgcolor: "white",
                              borderRadius: "4px",
                              padding: "4px 8px",
                            }}
                          >
                            <Typography sx={{ flexGrow: 1 }}>
                              {key.replace("_", " ")} : 
                              {roles?.roles.find((r) => r.id === role)?.name}
                            </Typography>
                            <Close
                              onClick={() => handleRemoveRole(role)}
                              sx={{ cursor: "pointer", fontSize: "1rem" }}
                            />
                          </Button>
                        );
                      })
                    ) : (
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#1E2022",
                          fontWeight: 500,
                          fontSize: "14px",
                          textTransform: "capitalize",
                          mb: 1,
                          border: "1px solid #DEE2E6",
                          bgcolor: "white",
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        {key.replace("_", " ")} : 
                        {key === "status"
                          ? value.charAt(0).toUpperCase() + value.slice(1)
                          : value}
                        <Close
                          onClick={() => handleRemove(key)}
                          sx={{ cursor: "pointer", fontSize: "1rem" }}
                        />
                      </Typography>
                    )}
                  </Box>
                );
              }
              return null;
            })
          : ""}
        {countAppliedFilters(filterData) ? (
          <ClearFilterDesign mb={1} clearFilters={clearFilterHandler} />
        ) : (
          ""
        )}
      </Box>

      <Box sx={{ px: 2 }}>
        {isExportLoading && (
          <ExportAlert severity={"info"} message={exportMessage} />
        )}
        {isExportSuccess && (
          <ExportAlert severity={"success"} message={exportMessage} />
        )}
      </Box>
      {isLoading ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
        </Box>
      ) : (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}
                >
                  <BpCheckbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Document Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Purpose
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments?.map((document, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor:
                      darkMode === "dark"
                        ? "background.paper"
                        : index % 2 === 0
                        ? "#FFFFFF"
                        : "rgba(248, 250, 253, 1)",
                    "&:hover": {
                      backgroundColor: "none",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <BpCheckbox
                      checked={selectedDocuments.includes(document.id)}
                      onChange={(event) =>
                        handleCheckboxChange(event, document.id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          onClick={() => viewDetailsHandler(document)}
                          variant="button"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                            color: "text.black",
                            "&:hover": {
                              color: "text.link",
                              cursor: "pointer",
                            },
                          }}
                        >
                          {document.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <CustomChip
                      dot
                      width={40}
                      dotColor={
                        document?.purpose === "signature"
                          ? "rgba(255, 193, 7, 1)"
                          : "rgba(0, 201, 167, 1)"
                      }
                      chipText={
                        document?.purpose === "signature"
                          ? "Signature required"
                          : "Download only"
                      }
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        document?.purpose === "signature"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(0, 201, 167, 0.1)"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <CustomChip
                      dot
                      width={40}
                      dotColor={
                        document?.submitted_docs?.length > 0
                          ? "rgba(0, 201, 167, 1)" // Green for completed
                          : "rgba(255, 193, 7, 1)" // Yellow for pending
                      }
                      chipText={
                        document?.purpose === "signature"
                          ? document?.submitted_docs?.length > 0
                            ? "Signed"
                            : "Signature pending"
                          : document?.submitted_docs?.length > 0
                          ? "Downloaded"
                          : "Download pending"
                      }
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        document?.submitted_docs?.length > 0
                          ? "rgba(0, 201, 167, 0.1)" // Light green background
                          : "rgba(255, 193, 7, 0.1)" // Light yellow background
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        color: "text.secondary",
                        borderColor: "#EEF0F7",
                        "&:hover": {
                          color: "text.btn_blue",
                          borderColor: "#EEF0F7",
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        },
                      }}
                      onClick={(e) => handleActionsClick(e, document)}
                    >
                      More
                      <ExpandMore sx={{ fontSize: "14px" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {id ? (
            ""
          ) : (
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={pagination.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </TableContainer>
      )}
      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleActionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleActionsClose();
            openEditHandler(selectedUser);
          }}
        >
          View
        </MenuItem>

        {selectedUser?.purpose === "download" ? (
          <MenuItem
            onClick={() => {
              handleActionsClose();
              downloadHandler(selectedUser);
            }}
          >
            Download
          </MenuItem>
        ) : (
          ""
        )}

        {/* {permissions?.includes("update user management user") && (
          <MenuItem
            onClick={() => {
              handleActionsClose();
              confirmDelete(selectedUser);
            }}
            sx={{ color: "error.main" }}
          >
            Delete
          </MenuItem>
        )} */}
      </Menu>
      <OrganizationDocFilter
        open={filterDrawerOpen}
        data={filterData}
        mode={"Filter"}
        onClose={() => setFilterDrawerOpen(false)}
        onSave={(data) => {
          setFilterData(data);
          setFilterApplied(true);
          setPage(0);
        }}
        countAppliedFilters={countAppliedFilters}
        clearFilter={clearFilterHandler}
      />
      <ExportDrawer
        open={exportDrawerOpen}
        onClose={() => setExportDrawerOpen(false)}
        columns={columns}
        onExport={handleExport}
        title="Export Providers  "
      />
    </Paper>
  );
};

export default DocumentsTable;
