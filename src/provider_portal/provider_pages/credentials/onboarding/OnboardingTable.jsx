import React, { useEffect, useState } from "react";
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
  Typography,
  Menu,
  MenuItem,
  Chip,
  TablePagination,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";

import {
  FilterList,
  SaveAltOutlined,
  ExpandMore,
  Close,
} from "@mui/icons-material";
import ExportAlert from "../../../../components/common/ExportAlert";

import ExportDrawer from "../../../../components/common/ExportDrawer";
import ClearFilterDesign from "../../../../components/common/filterChips/ClearFilterDesign";
import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";
import { useDispatch } from "react-redux";
import CustomChip from "../../../../components/CustomChip";
import SkeletonRow from "../../../../components/SkeletonRow";
import { SearchIcon } from "../../../../components/post-job/PostedJobsIcons";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../../../routes/Routes";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../../../components/handleConfirmDelete";
import Swal from "sweetalert2";
import API from "../../../../API";
import { useSelector } from "react-redux";
import {
  getFormsDocument,
  getOnboardingDocument,
  getReferenceForms,
} from "../../../../api_request";
import Loading from "../../../../components/common/Loading";

import NodataFoundCard from "../../../../provider_portal/provider_components/NodataFoundCard";
import { editPackage } from "../../../../feature/onboarding/packageSlice";
import AddEditDocument from "../documents/AddEditDocument";

const OnboardingTable = ({
  changeOccure,
  confirmDelete,
  viewDetailsHandler,
  trigger,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const darkMode = useSelector((state) => state.theme.mode);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));
  const { roles } = useSelector((state) => state.users);

  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
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
    setSelectedDocument(user);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  // =========---------------------------------------------------------------------------- Filter function
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterData, setFilterData] = useState(null);
  //   const [selectedDocument, setSelectedFilterUser] = useState(null);
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

  const [exportMessage, setExportMessage] = useState(null);
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const [documentTypes, setDocumentTypes] = useState(null);
  const handleExport = async (selectedColumns, fileType) => {
    const requestData = {
      search: searchTerm || "",
      client_id: params.id || "",
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

  // Handle "Select All" checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(documents.map((document) => document.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const isIndeterminate =
    selectedDocuments?.length > 0 &&
    selectedDocuments.length < documents.length;
  const isAllSelected = selectedDocuments?.length === documents?.length;
  const [filterApplied, setFilterApplied] = useState(false);
  const getDocuments = async (
    currentPage = 1,
    perPage = 10,
    roleName = null
  ) => {
    setIsLoading(true);
    try {
      const data = {
        name: filterData?.document_name || "",
        type: filterApplied ? "filter" : "" || "",
        provider_role_ids: filterData?.roles?.join(","),
        page: filterApplied ? 1 : currentPage,
        per_page: perPage,
        search: searchTerm || "",
      };

      const fetchedData = await getOnboardingDocument(data);
      // Update pagination state
      if (fetchedData?.success) {
        if (location?.state?.role) {
          navigate(ROUTES?.userManagement, { state: { role: null } });
        }
        setFilterApplied(false);
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

  const getDocumentTypesHandler = async () => {
    try {
      const resp = await API.get(`/api/get-cred-doctypes`);
      if (resp?.data?.success) {
        setDocumentTypes(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDocumentTypesHandler();
  }, []);
  useEffect(() => {
    if (!location?.state?.role) {
      getDocuments(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage, filterData, changeOccure, trigger]);

  const duplicatendler = async () => {
    handleActionsClose();
    setIsDuplicate(!isDuplicate);
  };
  const confirmDuplicate = async () => {
    try {
      setIsLoading(true);
      const resp = await API.get(
        `/api/duplicate-cred-package/${selectedDocument?.id}`
      );
      if (resp?.data?.success) {
        setIsDuplicate(!isDuplicate);
        setIsLoading(false);
        getDocuments(page + 1, rowsPerPage);
        Swal.fire({
          title: "Success!",
          text: resp?.data?.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  // --------------------------------------------------------- check from role module

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
  // --------------------------------------------------------- check from role module end

  const [clickedId, setClickedId] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [preview, setPreview] = useState(null);
  const handleClickExpandMore = (event, id) => {
    event.stopPropagation();
    setClickedId(id);
    setAnchorEl1(event.currentTarget);
  };

  const handleCloseMenu = (e) => {
    e.stopPropagation();
    setAnchorEl1(null);
  };
  const statusHandler = async (status) => {
    try {
      setIsStatusLoading(true);
      const resp = await API.post(`/api/update-cred-form-status`, {
        id: clickedId,
        is_active: status,
      });
      if (resp?.data?.success) {
        setIsStatusLoading(false);
        getDocuments(page + 1, rowsPerPage);
        Swal.fire({
          title: "Success!",
          text: resp?.data?.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setIsStatusLoading(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });

      // Swal.fire({
      //   title: "Success!",
      //   text: resp?.data?.msg,
      //   icon: "success",
      //   confirmButtonText: "OK",
      // });
    }
  };
  const dropdownOptions = [
    {
      label: "Active",
      action: () => statusHandler(1),
    },
    {
      label: "In active",
      action: () => statusHandler("0"),
    },
  ];

  const editHandler = () => {
    dispatch(editPackage(selectedDocument));

    navigate(ROUTES.createnewpackage, {
      state: {
        from: "onboarding",
        active: "Onboarding",
        btn: "onboarding",
      },
    });
  };
  const closeModal = () => {
    setIsDuplicate(false);
  };
  const viewHandler = () => {
    setPreview(selectedDocument?.json_structure);
    handleActionsClose();
  };
  return !isLoading &&
    documents?.length === 0 &&
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
      <ConfirmStatusModal
        isOpen={isDuplicate}
        onClose={closeModal}
        onConfirm={confirmDuplicate}
        isLoading={isLoading}
        title={"Duplicate"}
        action={"Duplicate"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to duplicate this document form? This action
            will create a copy of the form with all its current details. Please
            ensure that this action is correct before proceeding.
          </Typography>
        }
      />
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
          placeholder="Search onboarding packages"
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
                              mb: 1, // Margin between buttons
                              border: "1px solid #DEE2E6",
                              bgcolor: "white",
                              borderRadius: "4px",
                              padding: "4px 8px",
                            }}
                          >
                            <Typography sx={{ flexGrow: 1 }}>
                              {key.replace("_", " ")}&nbsp;:&nbsp;
                              {roles?.roles.find((r) => r.id === role)?.name}
                            </Typography>
                            <Close
                              onClick={() => handleRemoveRole(role)} // Assuming `handleRemoveRole` works here
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
                        {key.replace("_", " ")}&nbsp;:&nbsp;
                        {key === "status"
                          ? value.charAt(0).toUpperCase() + value.slice(1)
                          : value}
                        <Close
                          onClick={() => handleRemove(key)} // Assuming `handleRemove` works here
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
      <Loading open={isStatusLoading} />
      {isLoading ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 1000 }}>
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
                  Package Name
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Assigned Roles
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Steps
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Completion rate{" "}
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
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents?.map((document, index) => (
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
                          {document.name?.length > 25
                            ? `${document.name?.slice(0, 25)}...`
                            : document.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {document?.provider_roles?.length > 0 ? (
                        <>
                          {document?.provider_roles
                            ?.slice(0, 2)
                            .map((role, index) => (
                              <Chip
                                key={index}
                                label={role?.provider_role?.name || "--"}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(55, 125, 255, 0.1)",
                                  borderRadius: "4px",
                                  color: "rgba(103, 119, 136, 1)",
                                  textTransform: "capitalize",
                                }}
                              />
                            ))}

                          {document?.provider_roles?.length > 2 && (
                            <Tooltip
                              arrow
                              placement="top"
                              title={
                                <Box sx={{ textAlign: "start" }}>
                                  <ul
                                    style={{
                                      textAlign: "start",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    {document?.provider_roles
                                      ?.slice(2)
                                      .map((role, index) => (
                                        <li key={index}>
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontSize: "0.75rem",
                                              fontWeight: 400,
                                              color: "#ffffff",
                                            }}
                                          >
                                            {role?.provider_role?.name}
                                          </Typography>
                                        </li>
                                      ))}
                                  </ul>
                                </Box>
                              }
                            >
                              <Chip
                                key="count"
                                label={`+${
                                  document?.provider_roles?.length - 2
                                }`}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(222, 226, 230, 1)",
                                  borderRadius: "4px",
                                  color: "rgba(30, 32, 34, 1)",
                                  textTransform: "capitalize",
                                }}
                              />
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        "--"
                      )}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ minWidth: "120px" }}>
                    {" "}
                    {document?.items_count || "--"}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          onClick={() => viewDetailsHandler(document)}
                          variant="button"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 400,
                            fontSize: "12.64px",
                            color: "text.or_color",
                          }}
                        >
                          {document?.completion_rate || "--"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: "160px" }}>
                    <CustomChip
                      dot
                      id={document?.id}
                      dropdown={true}
                      handleClickExpandMore={handleClickExpandMore}
                      width={60}
                      dotColor={
                        document.is_active
                          ? "rgba(0, 201, 167, 1)"
                          : document?.is_active === "pending"
                          ? "rgba(255, 193, 7, 1)"
                          : "rgba(237, 76, 120, 1)"
                      }
                      chipText={document.is_active ? "Active" : "In active"}
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        document.is_active
                          ? "rgba(0, 201, 167, 0.1)"
                          : document?.is_active === "pending"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(237, 76, 120, 0.1)"
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
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={pagination.total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Menu
        anchorEl={anchorEl1}
        open={Boolean(anchorEl1)}
        onClose={handleCloseMenu}
      >
        {dropdownOptions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.action();
              handleCloseMenu(e);
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleActionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={viewHandler}>View</MenuItem>
        <MenuItem onClick={editHandler}>Edit</MenuItem>
        <MenuItem onClick={duplicatendler}>Duplicate</MenuItem>

        {permissions?.includes("update user management user") && (
          <MenuItem
            onClick={() => {
              handleActionsClose();
              confirmDelete(selectedDocument);
            }}
            sx={{ color: "error.main" }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
      <AddEditDocument
        open={filterDrawerOpen}
        data={filterData}
        mode={"Filter"}
        location="reference"
        documentTypes={documentTypes}
        onClose={() => setFilterDrawerOpen(false)}
        onSave={(data) => {
          setFilterData({
            roles: data?.roles,
            document_name: data?.document_name,
          });
          setFilterApplied(true);
          setPage(0);
          // getDocuments();
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

export default OnboardingTable;
