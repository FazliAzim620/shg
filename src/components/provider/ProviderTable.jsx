import {
  Box,
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
  Button,
  MenuItem,
  Menu,
  Card,
  CardHeader,
  IconButton,
  Divider,
  CardContent,
  FormGroup,
  FormControlLabel,
  CardActions,
  Typography,
  Select,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import {
  fetchJobsData,
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchProvidersInfo,
} from "../../thunkOperation/job_management/states";
import {
  CheckCircleOutline,
  Circle,
  Close,
  DeleteOutline,
  DeleteOutlineOutlined,
  ExpandMore,
  ExpandMoreOutlined,
  FilterList,
  MoreVert,
  NavigateBefore,
  NavigateNext,
  Person,
  PictureAsPdfOutlined,
  ReportGmailerrorred,
  RequestPageOutlined,
  SaveAltOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import CustomTypographyBold from "../CustomTypographyBold";
import { CommonSelect } from "../job-component/CommonSelect";
import CreateJobModal from "../job-component/CreateJobModal";
import API, { baseURLImage } from "../../API";
import pdficon from "../../assets/pdf-icon.svg";
import csvIcon from "../../assets/csv.svg";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../../routes/Routes";
import { providerDetails } from "../../feature/service_provider/serviceProvider";
import SkeletonRow from "../SkeletonRow";
import CustomChip from "../CustomChip";
import { setField, updateCertificate } from "../../feature/jobSlice";
import ProviderFilter from "./ProviderFilter";
import { formatTo12Hour, selectOptions } from "../../util";
import { useSelector } from "react-redux";
import { DeleteConfirmModal } from "../handleConfirmDelete";
import { set } from "date-fns";
import AppliedFilterDesign from "../common/filterChips/AppliedFilterDesign";
import ClearFilterDesign from "../common/filterChips/ClearFilterDesign";
import RoleAndSpecialities from "../common/RoleAndSpecialities";
import { SearchIcon } from "../../components/post-job/PostedJobsIcons";

import { BpCheckbox } from "../../components/common/CustomizeCHeckbox";
import AlertMessage from "../../feature/alert-message/AlertMessage";
import ExportDrawer from "../common/ExportDrawer";
import ExportAlert from "../common/ExportAlert";
import { checkGetReadyExport } from "../../api_request";
const ProviderTable = ({
  setAddProvider,
  getProviders,
  getProviderCountsHandlder,
  setPagination,
  pagination,
  darkMode,
  providersData,
  setRowsPerPage,
  rowsPerPage,
  isLoading,
  searchKeywordHandler,
  permissions,
  value,
  typeFilter,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { location } = useSelector((state) => state.alert);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const isActionsMenuOpen = Boolean(actionsAnchorEl);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredProivders, setFilteredProivders] = useState(providersData);
  const [providerDetail, setProviderDetail] = useState();
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [editProvider, setEditProvider] = useState(null);
  const [page, setPage] = useState(providersData?.per_page || 0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [jobCount, setJobCount] = useState(null);
  const [providerInfo, setProviderInfo] = useState([]);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdateLoader, setStatusUpdateLoader] = useState(false);
  const [statusConfirmModalOpen, setStatusConfirmModalOpen] = useState(false);
  const deleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);

  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
  const handleChangePage = (event, newPage) => {
    // newPage is 0-indexed, so add 1 to get the actual page number
    const nextPage = newPage + 1;

    if (nextPage !== pagination.currentPage) {
      const param = {
        perpage: pagination.perPage,
        page: nextPage,
        status: 3,
      };
      // dispatch(fetchJobsData(param));
      const obj = {
        rowsPerPage:
          sessionStorage.getItem("per_page") > 0
            ? sessionStorage.getItem("per_page")
            : pagination?.per_page || 20,
        currentPage: nextPage,
        tab: value === 1 ? "unscheduled" : "scheduled",
        days: typeFilter,
      };
      getProviders(obj);
    }
  };
  // ----------- dropdown number of row per page
  const handleChangeRowsPerPage = (event) => {
    sessionStorage.setItem("per_page", event.target.value);
    localStorage.setItem("per_page", event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPagination((prev) => ({
      ...prev,
      perPage: parseInt(event.target.value, 10),
    }));
  };
  const [filters, setFilters] = useState([]);
  // =======================get providers=====================
  const getAllProviders = async () => {
    const response = await dispatch(fetchProvidersInfo());
    setProviderInfo(response?.payload);
  };

  useEffect(() => {
    getProviders();
    getAllProviders();
    dispatch(fetchMedicalSpecialities());
    dispatch(fetchProviderRoles());
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setAllSpecialitiesOptions(selectOptions(medicalSpecialities));
  }, []);

  // =======================providers options====================
  const filterExistingProvider = providerInfo?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  // =======================toggle drawer====================
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };
  const getServiceProvider = (status = null) => {
    if (status) {
      setFilters([status]);
    }

    const per_page = localStorage.getItem("per_page");
    const param = {
      filter: true,
      perpage: per_page || 10,
      page: 1,
      client_id: params.id || "",
      status: status?.jobStatus || 3,
      provider_name: status?.provider_name || "",
      role: status?.role || "",
      speciality: status?.speciality || "",
      from_date: status?.from_date || "",
      end_date: status?.end_date || "",
      min_rate: status?.min_rate || "",
      max_rate: status?.max_rate || "",
      jobOrder: true,
      tab: value === 1 ? "unscheduled" : "scheduled",
      days: typeFilter,
    };
    getProviders(null, param);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    getServiceProvider();
  }, [dispatch]);
  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };

  // ====================handleSearchChange=================
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ====================handle select all checkboxes=================
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProviders(providersData?.data?.map((provider) => provider.id));
    } else {
      setSelectedProviders([]);
    }
  };
  //------------------------------------- Handlers for Export Menu

  //------------------------------------- Handlers for Export Menu end
  //------------------------------------- Handlers for filter Menu
  const handleFilterClick = (event) => {
    setIsDrawerOpen(true);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  //------------------------------------- Handlers for filter Menu end
  //------------------------------------- Handlers for Actions Menu
  const handleActionsClick = (event, id, providerDetail) => {
    setActionsAnchorEl(event.currentTarget);
    setProviderDetail(providerDetail);
    setEditProvider(providerDetail);
    setDeleteId(id);
    setJobCount(providerDetail?.jobs_count);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };
  //------------------------------------- Handlers for Actions Menu end
  const handleSelectProvider = (event, providerId) => {
    const selectedIndex = selectedProviders.indexOf(providerId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProviders, providerId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProviders.slice(1));
    } else if (selectedIndex === selectedProviders.length - 1) {
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
    setSelectedProviders([]);
  };
  const detailsHandler = (provider) => {
    dispatch(providerDetails(provider));
    navigate(`${ROUTES.serviceProviderDetails}${provider?.id}`);
  };
  const accountStatusConfirm = () => {
    setStatusConfirmModalOpen(true);
  };
  const statusModalClose = () => {
    setStatusConfirmModalOpen(false);
  };
  const accountStatusHandler = async (data) => {
    setStatusUpdateLoader(true);
    try {
      const payload = {
        provider_id: providerDetail?.id,
      };

      // Only include status if user exists
      if (providerDetail?.user) {
        payload.user_id = providerDetail.user.id;
        payload.status = providerDetail?.user?.status ? "0" : 1;
      }

      const resp = await API.post(`/api/provider/add-user`, payload);
      if (resp?.data?.success) {
        setStatusUpdateLoader(false);
        statusModalClose();
        handleActionsClose();
        getProviders();
      }
    } catch (error) {
      console.log(error);
      setStatusUpdateLoader(false);
    }
  };
  const paginationHandler = (action) => {
    if (
      action === "next" &&
      pagination?.currentPage != pagination?.lastPage &&
      pagination?.currentPage < pagination?.lastPage
    ) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
      const obj = {
        rowsPerPage:
          sessionStorage.getItem("per_page") > 0
            ? sessionStorage.getItem("per_page")
            : providersData?.per_page || 15,
        currentPage: pagination.currentPage + 1,
        tab: value === 1 ? "unscheduled" : "scheduled",
        days: typeFilter,
      };
      getProviders(obj);
    }
    if (action === "prev" && pagination?.currentPage !== 1) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
      const obj = {
        rowsPerPage:
          sessionStorage.getItem("per_page") > 0
            ? sessionStorage.getItem("per_page")
            : providersData?.per_page || 15,
        currentPage: pagination.currentPage - 1,
      };
      getProviders(obj);
    }
  };
  // ----------------------------------------------------------------------------------- edit provider
  const editHandler = () => {
    const activeLicenseIds = editProvider?.license_states
      ?.filter((state) => state.provider_license_status === "Active")
      ?.map((state) => state.provider_license_state_id);
    const pendingLicenseIds = editProvider?.license_states
      ?.filter((state) => state.provider_license_status === "Pending")
      ?.map((state) => state.provider_license_state_id);
    const nonActiveLicenseIds = editProvider?.license_states
      ?.filter((state) => state.provider_license_status === "Non-active")
      ?.map((state) => state.provider_license_state_id);

    handleActionsClose();
    setAddProvider(true);
    dispatch(setField({ field: "id", value: editProvider?.id }));
    dispatch(
      setField({
        field: "overtimeHourlyRate",
        value: editProvider?.overtimeHourlyRate,
      })
    );
    dispatch(
      setField({
        field: "recruiter_id",
        value: editProvider?.recruiter_id,
      })
    );
    dispatch(
      setField({
        field: "provider_specialities",
        // value: editProvider?.specialities?.map((item) => item?.id),
        value: editProvider?.specialities?.map((val) => val?.speciality_id),
      })
    );
    dispatch(
      setField({ field: "providerFullName", value: editProvider?.name })
    );
    dispatch(setField({ field: "email", value: editProvider?.email }));
    dispatch(setField({ field: "phone", value: editProvider?.phone }));
    dispatch(
      setField({ field: "providerRole", value: editProvider?.provider_role_id })
    );
    dispatch(
      setField({
        field: "provider_sub_role",
        value: editProvider?.allied_health_clinician_type,
      })
    );

    dispatch(
      updateCertificate({
        field: "IMLC",
        value: editProvider?.has_imlc == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "BC",
        value: editProvider?.board_certified == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "BE",
        value: editProvider?.board_eligible == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "BCE",
        value: editProvider?.board_certified_expired == 1 ? true : false,
      })
    );
    dispatch(
      updateCertificate({
        field: "NA",
        value:
          editProvider?.not_applicable_board_certification_and_eligibility == 1
            ? true
            : false,
      })
    );
    dispatch(
      setField({
        field: "stateLicense",
        value: activeLicenseIds,
      })
    );
    dispatch(
      setField({
        field: "pendingStateLicense",
        value: pendingLicenseIds,
      })
    );
    dispatch(
      setField({
        field: "nonActiveStateLicense",
        value: nonActiveLicenseIds,
      })
    );
    dispatch(
      setField({
        field: "regularHourlyRate",
        value: editProvider?.regular_hourly_rate,
      })
    );
    dispatch(
      setField({
        field: "holidayHourlyRate",
        value: editProvider?.holiday_hourly_rate,
      })
    );
    dispatch(
      setField({
        field: "overtimeHourlyRate",
        value: editProvider?.overtime_hourly_rate,
      })
    );
  };
  const providersTableData = providersData?.data;

  const deleteHandler = async (e) => {
    setDeleteLoader(true);
    try {
      const resp = await API.delete(`api/delete-provider/${deleteId}`);
      if (resp?.data?.success) {
        deleteModalClose(e);
        setDeleteLoader(false);
        getProviderCountsHandlder();
        // getAllProviders();
        getProviders();
      }
    } catch (error) {
      setDeleteLoader(false);
      console.log(error);
    }
  };
  // ---------------------------------------------- edit provider end

  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;

      // After updating the filters, call getJobData with the updated filters
      getServiceProvider(updatedFilters?.[0]); // or updatedFilters based on your needs

      return updatedFilters;
    });
  };
  const clearFilterHandler = () => {
    setFilters([]);
    getServiceProvider();
  };
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
  function getTwoStateNames(states) {
    const priority = ["Active", "Pending", "Non-active"];
    const result = [];

    for (const status of priority) {
      const filtered = states?.filter(
        (s) => s.provider_license_status === status
      );
      if (filtered?.length > 0) {
        for (const item of filtered) {
          result.push(item.state.name);
        }
      }
    }

    return result;
  }
  // Usage
  const selectedStates = getTwoStateNames(
    providersTableData?.[0]?.license_states
  );
  const assignJobHandler = (provider) => {
    navigate(ROUTES.jobManagement, {
      state: { from: "service provider", provider },
    });
    console.log("provider", provider);
  };
  // =========---------------------------------------------------------------------------- Export function  end
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
        {/*============== serch,filter and export ================ */}
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
            placeholder="Search Providers"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchKeywordHandler(e?.target?.value);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              borderBottom: "0.9px solid  ",
              borderColor:
                darkMode === "dark"
                  ? "rgba(255, 255, 255, .7)"
                  : "rgba(231, 234, 243, 0.7)",
              "& .MuiInputBase-input::placeholder": {
                color: "black",
                fontSize: "12.64px",
                lineHeight: "15.3px",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* {selectedProviders?.length > 0 && (
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
            )} */}
            {permissions?.includes("export service providers info") ? (
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
            ) : (
              ""
            )}

            {/* ---------------------------------------------------- filter dropdown */}
            {permissions?.includes("read service providers info") ? (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
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
                onClick={handleFilterClick}
              >
                {countAppliedFilters() > 0 ? (
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
                      {countAppliedFilters()}
                    </Box>
                  </>
                ) : (
                  "Filter"
                )}
              </Button>
            ) : (
              ""
            )}
            <Menu
              anchorEl={filterAnchorEl}
              open={isFilterMenuOpen}
              onClose={handleFilterClose}
            >
              <Card
                sx={{
                  boxShadow: "none",
                  position: "relative",
                  // display: "flex",
                  // flexDirection: "column",
                  // justifyContent: "space-between",
                }}
              >
                <CardHeader
                  sx={{
                    p: 0,
                    pl: 2,
                    pr: 0.5,
                    // pb: 2,
                    borderBottom: "1px solid lightgray",
                  }}
                  title={
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <CustomTypographyBold color="text.black">
                          Filter providers
                        </CustomTypographyBold>
                        <IconButton onClick={handleFilterClose}>
                          <Close />
                        </IconButton>
                      </Box>
                    </>
                  }
                />
                <CardContent sx={{}}>
                  <Box>
                    <CustomTypographyBold
                      color="rgba(103, 119, 136)"
                      fontSize={"0.71094rem"}
                    >
                      CONTRACT STATUS
                    </CustomTypographyBold>
                    <Box>
                      <FormGroup
                        row
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                          mr: 4,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <BpCheckbox size="small" className="checkbox" />
                          }
                          label={
                            <CustomTypographyBold fontSize={"0.71094rem"}>
                              All
                            </CustomTypographyBold>
                          }
                        />
                        <FormControlLabel
                          control={
                            <BpCheckbox size="small" className="checkbox" />
                          }
                          label={
                            <CustomTypographyBold fontSize={"0.71094rem"}>
                              Pending
                            </CustomTypographyBold>
                          }
                        />
                      </FormGroup>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <CustomTypographyBold
                        color="rgba(103, 119, 136)"
                        fontSize={"0.71094rem"}
                      >
                        ROLE
                      </CustomTypographyBold>
                      <CustomTypographyBold
                        color="rgba(103, 119, 136)"
                        fontSize={"0.71094rem"}
                      >
                        PRIVILEGE STATUS
                      </CustomTypographyBold>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Box sx={{ minWidth: "9rem" }}>
                        <CommonSelect
                          // value={jobData?.providerRole}

                          // handleChange={handleChange}
                          name={"providerRole"}
                          placeholder={"Role"}
                          options={[{ label: "db", value: "dab" }]}
                          height={"2rem"}
                        />
                      </Box>
                      <Box sx={{ minWidth: "9rem" }}>
                        <CommonSelect
                          // value={jobData?.providerRole}
                          // handleChange={handleChange}
                          name={"providerRole"}
                          placeholder={"Any status"}
                          options={[{ label: "Any status", value: "any" }]}
                          height={"2rem"}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions
                  sx={{ position: "absolute", bottom: 3, width: "100%" }}
                >
                  <Button
                    variant="contained"
                    sx={{ width: "100%", textTransform: "none" }}
                  >
                    Apply
                  </Button>
                </CardActions>
              </Card>
            </Menu>
            {/* ---------------------------------------------------- filter dropdown end */}
          </Box>
        </Box>
        <Box sx={{ px: 2 }}>
          {isExportLoading && (
            <ExportAlert severity={"info"} message={exportMessage} />
          )}
          {isExportSuccess && (
            <ExportAlert severity={"success"} message={exportMessage} />
          )}
        </Box>
        {/*=================== appleid chips ================ */}
        {/* {location === "provider" ? <AlertMessage /> : ""} */}

        {filters.map((filter, filterIndex) => (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexWrap: "wrap",
              px: 2,
              alignItems: "center",
            }}
            key={filterIndex}
          >
            {Object.entries(filter).map(([key, value]) => {
              if (value && value !== "") {
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
                    <Button
                      sx={{
                        py: 0.5,
                        mb: 1,
                        border: "1px solid #DEE2E6",
                        bgcolor: "white",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
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
                        }}
                      >
                        {key.replace("_", " ")}{" "}
                        {/* {key === "provider_name"
                          ? "Provider name"
                          : key === "min_rate"
                          ? "min rate  "
                          : key === "max_rate"
                          ? "Max rate"
                          : key} */}
                        &nbsp;:&nbsp;
                        {key === "provider_name"
                          ? filterExistingProvider?.find(
                              (item) => item.value == value
                            )?.label
                          : key === "speciality"
                          ? allSpecialitiesOptions?.find(
                              (spc) => spc.value == value
                            )?.label
                          : key === "start_time"
                          ? formatTo12Hour(value)
                          : key === "end_time"
                          ? formatTo12Hour(value)
                          : key === "role"
                          ? filterProviderRolesList?.find(
                              (role) => role.value == value
                            )?.label
                          : value}
                        <Close
                          onClick={() => handleRemove(filterIndex, key)}
                          sx={{ cursor: "pointer", fontSize: "1rem" }}
                        />
                      </Typography>
                    </Button>
                  </Box>
                );
              }
              return null;
            })}
            {countAppliedFilters() ? (
              <ClearFilterDesign mb={1} clearFilters={clearFilterHandler} />
            ) : (
              ""
            )}
          </Box>
        ))}
        {/* ========================table=================== */}
        {isLoading ? (
          <Box sx={{ textAlign: "center", mx: "auto" }}>
            {/* <CircularProgress /> */}
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
            <SkeletonRow column={9} />
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
                      className={`${
                        selectedProviders?.length == 0 && "checkbox"
                      }`}
                      indeterminate={
                        selectedProviders?.length > 0 &&
                        selectedProviders?.length < providersData?.length
                      }
                      checked={
                        providersData?.data?.length > 0 &&
                        selectedProviders?.length ===
                          providersData?.data?.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Provider No.
                  </TableCell> */}
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
                    Role & Specialties
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    State Licenses
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Account Status
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Recruiter
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Jobs
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Contract completion
                  </TableCell> */}
                  <TableCell
                    sx={{
                      minWidth: "160px",
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providersTableData?.length > 0
                  ? providersTableData
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
                          selected={
                            selectedProviders.indexOf(provider.id) !== -1
                          }
                        >
                          <TableCell
                            padding="checkbox"
                            onClick={(event) =>
                              handleSelectProvider(event, provider.id)
                            }
                          >
                            <BpCheckbox
                              className={`${
                                selectedProviders.indexOf(provider.id) == -1 &&
                                "checkbox"
                              }`}
                              checked={
                                selectedProviders.indexOf(provider.id) !== -1
                              }
                              onChange={(event) =>
                                handleSelectProvider(event, provider.id)
                              }
                            />
                          </TableCell>

                          <TableCell
                            sx={{ cursor: "pointer" }}
                            onClick={() => detailsHandler(provider)}

                            // onClick={() => viewDetail(provider.id)}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {!provider?.user?.detail?.photo ? (
                                <Avatar
                                  sx={{
                                    width: "3rem",
                                    height: "3rem",
                                    background: "background.paper",
                                    mr: 1.5,
                                  }}
                                >
                                  <Person />
                                </Avatar>
                              ) : (
                                <Box
                                  component={"img"}
                                  src={`${baseURLImage}/${provider?.user?.detail?.photo}`}
                                  sx={{
                                    width: "3rem",
                                    height: "3rem",
                                    objectFit: "contain",
                                    borderRadius: "50%",
                                    mr: 1.5,
                                  }}
                                />
                              )}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0,
                                }}
                              >
                                <Typography
                                  variant="button"
                                  sx={{
                                    textTransform: "capitalize",
                                    "&:hover": {
                                      color: "text.link",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    },
                                    color:
                                      darkMode == "dark"
                                        ? "#FFFFFF"
                                        : "#1E2022",
                                    fontWeight: "600",
                                  }}
                                >
                                  {provider?.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  mt={-0.7}
                                  sx={{
                                    textTransform: "none",
                                  }}
                                >
                                  {provider?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <RoleAndSpecialities
                              role={provider?.role?.name}
                              specialities={provider?.specialities}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {selectedStates
                                ?.slice(0, 2)
                                ?.map((stateName, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: "inline-block",
                                      padding: "0.2rem 0.6rem",
                                      color: "#1e2022",
                                      bgcolor: "rgba(19, 33, 68, .1)",
                                      fontSize: "0.75rem",
                                      fontWeight: 500,
                                      borderRadius: "14px",
                                      cursor: "pointer",
                                      textAlign: "center",
                                    }}
                                  >
                                    {stateName}
                                  </Box>
                                ))}
                              {selectedStates?.length > 2 ? (
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    padding: "0.2rem 0.6rem",
                                    color: "#1e2022",
                                    bgcolor: "rgba(19, 33, 68, .1)",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    borderRadius: "14px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }}
                                >
                                  +{selectedStates.length - 2}
                                </Box>
                              ) : (
                                ""
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: "text.or_color",
                                pl: 1,
                              }}
                            >
                              {provider?.user?.status ? "Active" : "In active"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "text.black",
                                pl: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.black",
                                  pl: 1,
                                  textTransform: "capitalize",
                                }}
                              >
                                {provider?.recruiter?.name || "--"}
                                {/* rec */}
                              </Typography>
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "text.black",
                                pl: 1,
                              }}
                            >
                              {provider?.jobs_count}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {value === 0 ? (
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  ml: 1,
                                  textTransform: "capitalize",
                                  color: "text.secondary",
                                  bgcolor:
                                    darkMode === "dark"
                                      ? "background.paper"
                                      : "white",
                                  borderColor: "#EEF0F7",
                                  "&:hover": {
                                    color: "text.btn_blue",
                                    bgcolor:
                                      darkMode === "dark"
                                        ? "background.paper"
                                        : "white",
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
                                onClick={(e) => {
                                  handleActionsClick(e, provider?.id, provider);
                                }}
                              >
                                More&nbsp;
                                <ExpandMore
                                  sx={{
                                    fontSize: "14px",
                                    "&:hover": {
                                      color: "text.btn_blue",
                                    },
                                  }}
                                />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => assignJobHandler(provider)}
                                sx={{
                                  ml: 1,
                                  textTransform: "capitalize",
                                  color: "text.secondary",
                                  bgcolor:
                                    darkMode === "dark"
                                      ? "background.paper"
                                      : "white",
                                  borderColor: "#EEF0F7",
                                  "&:hover": {
                                    color: "text.btn_blue",
                                    bgcolor:
                                      darkMode === "dark"
                                        ? "background.paper"
                                        : "white",
                                    borderColor: "#EEF0F7",
                                    boxShadow:
                                      "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                  },
                                }}
                              >
                                Assign job
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  : ""}
                <Menu
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{ maxWidth: "180px" }}
                  anchorEl={actionsAnchorEl}
                  open={isActionsMenuOpen}
                  onClose={handleActionsClose}
                >
                  <MenuItem
                    onClick={() => detailsHandler(providerDetail)}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    View
                  </MenuItem>
                  {providerDetail?.user?.status ? (
                    ""
                  ) : (
                    <MenuItem
                      onClick={() => accountStatusConfirm(providerDetail)}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      Activate account
                    </MenuItem>
                  )}
                  {providerDetail?.user?.status ? (
                    <MenuItem
                      onClick={() => accountStatusConfirm(providerDetail)}
                      sx={{ fontSize: "0.875rem" }}
                    >
                      Deactivate account
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  {permissions?.includes("update service providers info") ? (
                    <MenuItem
                      onClick={editHandler}
                      sx={{ minWidth: "200px", fontSize: "0.875rem" }}
                    >
                      Edit
                    </MenuItem>
                  ) : (
                    ""
                  )}
                  <Divider />
                  {permissions?.includes("delete service providers info") ? (
                    <MenuItem
                      onClick={() => {
                        handleActionsClose();
                        setDeleteModalOpen(true);
                      }}
                      sx={{ color: "red", fontSize: "0.875rem" }}
                    >
                      Delete
                    </MenuItem>
                  ) : (
                    ""
                  )}
                </Menu>
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[20, 30, 50]}
              component="div"
              count={pagination.total}
              rowsPerPage={pagination.perPage}
              page={pagination.currentPage - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{
                disabled: pagination.currentPage === pagination.lastPage,
              }}
              backIconButtonProps={{
                disabled: pagination.currentPage === 1,
              }}
            />
          </TableContainer>
        )}
      </Paper>
      <ProviderFilter
        filterExistingProvider={filterExistingProvider}
        filterProviderRolesList={filterProviderRolesList}
        allSpecialitiesOptions={allSpecialitiesOptions}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        filters={filters}
        toggleDrawer={toggleDrawer}
        setFilters={setFilters}
        getServiceProvider={getServiceProvider}
        countAppliedFilters={countAppliedFilters}
      />
      <ExportDrawer
        open={exportDrawerOpen}
        onClose={() => setExportDrawerOpen(false)}
        columns={columns}
        onExport={handleExport}
        title="Export Providers  "
      />
      {/* ============== Delete Modal ================== */}
      <DeleteConfirmModal
        jobCount={jobCount ? true : false}
        isOpen={deleteModalOpen}
        onClose={deleteModalClose}
        onConfirm={deleteHandler}
        deleteLoader={deleteLoader}
        itemName={"File"}
        title={"Delete"}
        action={"Delete"}
        cantDelBodyText={
          <Typography variant="body2">
            This provider is bound with jobs so can not be deleted!
          </Typography>
        }
        bodyText={
          <Typography variant="body2">
            Are you sure you want to delete this provider? Because once <br />
            deleted then it cannot be undone.
          </Typography>
        }
      />
      {/* ============== Delete Modal ================== */}
      <DeleteConfirmModal
        isOpen={statusConfirmModalOpen}
        onClose={statusModalClose}
        onConfirm={accountStatusHandler}
        isLoading={statusUpdateLoader}
        itemName={"Provider"}
        title={providerDetail?.user?.status ? "Deactivate" : "Activate"}
        action={providerDetail?.user?.status ? "Deactivate" : "Activate"}
        cantDelBodyText={null}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to{" "}
            {providerDetail?.user ? "deactivate" : "activate"} this provider?
            <br />
            This action can be reverted later.
          </Typography>
        }
      />
    </>
  );
};

export default ProviderTable;
