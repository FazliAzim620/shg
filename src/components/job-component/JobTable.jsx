import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  Box,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  Typography,
  CircularProgress,
  Tooltip,
  Avatar,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { fetchJobsData } from "../../thunkOperation/job_management/states";
import { useDispatch, useSelector } from "react-redux";
import {
  ExpandMoreOutlined,
  FilterListOutlined,
  SaveAltOutlined,
  DeleteOutline,
  ArrowDropDown,
  ArrowDropUp,
  Add,
  AddCircleOutline,
  FilterList,
  Person,
  Close,
} from "@mui/icons-material";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../../routes/Routes";
import { addNewUser } from "../../feature/jobSlice";
import { format } from "date-fns";
import SkeletonRow from "../SkeletonRow";
import ClearFilterDesign from "../common/filterChips/ClearFilterDesign";
import ChipsSection from "./ChipsSection";
import { SearchIcon } from "../post-job/PostedJobsIcons";

import { BpCheckbox } from "../common/CustomizeCHeckbox";
import AlertMessage from "../../feature/alert-message/AlertMessage";
import ExportDrawer from "../common/ExportDrawer";
import ExportAlert from "../common/ExportAlert";
import API from "../../API";
import { checkGetReadyExport } from "../../api_request";

const JobTable = ({
  jobs,
  isLoading,
  countAppliedFilters,
  toggleDrawer,
  jobsOrder,
  filter,
  jobOrderSearch,
  setJobOrderSearch,
  ///////for  chips
  filters,
  handleRemove,
  filterProvider,
  allSpecialitiesOptions,
  clearFilterHandler,
  filterProviderRolesList,
  searchTerm,
  setSearchTerm,
}) => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const { location } = useSelector((state) => state.alert);

  const { newUserData, jobsTableData } = useSelector((state) => state.job);
  // State for Export Menu
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const isExportMenuOpen = Boolean(exportAnchorEl);
  const [activeSort, setActiveSort] = useState({ column: "", sort: "" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });
  // State for Filter Menu

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  useEffect(() => {
    let searchKey = jobsOrder ? jobOrderSearch : searchTerm;
    const filtered = jobs?.data?.filter(
      (job) =>
        job?.name?.toLowerCase()?.includes(searchKey?.toLowerCase()) ||
        job?.id?.toString()?.includes(searchKey)
    );
    setFilteredJobs(filtered);
    setPagination({
      currentPage: jobs.current_page || 1,
      lastPage: jobs.last_page || 1,
      perPage: jobs.per_page || 20,
      total: jobs.total || 0,
    });
    // setPage(jobs?.current_page - 1);
  }, [jobs]);
  const handleChangePage = (event, newPage) => {
    // newPage is 0-indexed, so add 1 to get the actual page number
    const nextPage = newPage + 1;

    if (nextPage !== pagination.currentPage) {
      let param;
      const status = filters?.[0] ? filters?.[0] : {};
      if (filters?.length > 0) {
        param = {
          perpage: parseInt(event.target.value, 10),
          page: 1,
          status: status?.jobStatus === undefined ? "" : status.jobStatus,
          provider_name: status?.provider_name || "",
          role: status?.role || "",
          speciality: status?.speciality || "",
          from_date: status?.from_date || "",
          end_date: status?.end_date || "",
          jobOrder: true,
          provider_min_rate: status?.min_rate || "",
          provider_max_rate: status?.max_rate || "",
          client_min_rate: status?.client_min_rate || "",
          client_max_rate: status?.client_max_rate || "",
        };
      } else {
        param = {
          perpage: pagination.perPage,
          page: nextPage,
          status: "",
        };
      }
      if (jobsOrder && params.id) {
        param.client_id = params.id;
      }
      dispatch(fetchJobsData(param));
    }
  };
  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem("per_page", event.target.value);
    let param;
    const status = filters?.[0] ? filters?.[0] : {};
    if (filters?.length > 0) {
      param = {
        perpage: parseInt(event.target.value, 10),
        page: 1,
        status: status?.jobStatus === undefined ? "" : status.jobStatus,
        provider_name: status?.provider_name || "",
        role: status?.role || "",
        speciality: status?.speciality || "",
        from_date: status?.from_date || "",
        end_date: status?.end_date || "",
        jobOrder: true,
        provider_min_rate: status?.min_rate || "",
        provider_max_rate: status?.max_rate || "",
        client_min_rate: status?.client_min_rate || "",
        client_max_rate: status?.client_max_rate || "",
      };
    } else {
      param = {
        perpage: parseInt(event.target.value, 10),
        page: pagination?.currentPage,
        status: "",
      };
    }
    if (jobsOrder && params.id) {
      param.client_id = params.id;
    }
    dispatch(fetchJobsData(param));
  };

  const handleSearchChange = (event) => {
    if (jobsOrder) {
      setJobOrderSearch(event.target.value);
    }
    setSearchTerm(event.target.value);
  };
  const searchHandler = (clear) => {
    const param = {
      perpage: pagination.perPage,
      page: 1,
      status: "",
      search: clear ? "" : jobsOrder ? jobOrderSearch : searchTerm,
    };
    if (jobsOrder && params.id) {
      param.client_id = params.id;
    }

    dispatch(fetchJobsData(param));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedJobs(filteredJobs.map((job) => job.id));
    } else {
      setSelectedJobs([]);
    }
  };
  const handleSelectJob = (event, jobId) => {
    const selectedIndex = selectedJobs.indexOf(jobId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedJobs, jobId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedJobs.slice(1));
    } else if (selectedIndex === selectedJobs.length - 1) {
      newSelected = newSelected.concat(selectedJobs.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedJobs.slice(0, selectedIndex),
        selectedJobs.slice(selectedIndex + 1)
      );
    }
    setSelectedJobs(newSelected);
  };

  const handleDelete = () => {
    setSelectedJobs([]);
  };
  const viewDetail = (id) => {
    if (jobsOrder) {
      localStorage.setItem("order_job", window.location.pathname);
    }
    navigate(`${ROUTES.providerInfo}${id}`);
    const currentUser = jobsTableData?.data?.find(
      (user) => user.id === parseInt(id)
    );
    dispatch(addNewUser(currentUser));
  };
  const addHandler = ({ id, step }) => {
    if (jobsOrder) {
      localStorage.setItem("order_job", window.location.pathname);
    }
    navigate(`${ROUTES.providerInfo}${id}?step=${step}`);
    const currentUser = jobsTableData?.data?.find(
      (user) => user.id === parseInt(id)
    );
    dispatch(addNewUser(currentUser));
  };
  const sortingBy = (columnName, sortType) => {
    const param = {
      perpage: pagination.perPage,
      page: 1,
      sort_column_name: columnName,
      sort_type: sortType,
      status: "",
    };
    if (jobsOrder && params.id) {
      param.client_id = params.id;
    }
    dispatch(fetchJobsData(param));
  };

  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "job_no" },
    { name: "provider" },
    { name: "provider_rate" },
    { name: "role " },
    { name: "speciality" },
    { name: "client" },
    { name: "client_rate" },
    { name: "setup_completion" },
    { name: "project_start_date" },
    { name: "project_end_date" },
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
      status:
        filters?.[0]?.jobStatus === 0
          ? 0
          : filters?.[0]?.jobStatus === 1
          ? 1
          : "" || "",
      provider_id: filters?.[0]?.provider_name || "",
      role: filters?.[0]?.role || "",
      speciality: filters?.[0]?.speciality || "",
      end_date: filters?.[0]?.end_date || "",
      from_date: filters?.[0]?.from_date || "",
      provider_min_rate: filters?.[0]?.min_rate || "",
      provider_max_rate: filters?.[0]?.max_rate || "",
      client_min_rate: filters?.[0]?.client_min_rate || "",
      client_max_rate: filters?.[0]?.client_max_rate || "",
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
      const resp = await API.post(`/api/jobs-export`, bodyData);
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
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));

  // =========---------------------------------------------------------------------------- Export function  end
  const progressBar = (completed) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        pt: 1,
        borderRadius: "10px",
        width: "100%",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          width: "50%",
          fontSize: "14px",
          color: completed > 6 ? "#00c9a7" : "",
        }}
      >
        {completed > 6 ? "7 of 7 steps" : `${completed} of 7 steps`}
      </Typography>
      <Box sx={{ width: "50%", display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            bgcolor: "#377dff",
            width: `${((7 - completed) / 7) * 100}%`,
            height: "5px",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        />
        <Box
          sx={{
            bgcolor: "#00c9a7",
            width: `${(completed / 7) * 100}%`,
            height: "5px",
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        />
      </Box>
    </Box>
  );
  const sortRender = (columnName) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        // pt: -0.51,
      }}
    >
      <ArrowDropUp
        onClick={() => {
          sortingBy(columnName, "desc");
          setActiveSort({ column: columnName, sort: "desc" });
        }}
        sx={{
          fontSize: "16px",
          mb: -1,
          color:
            activeSort?.column === columnName && activeSort?.sort === "desc"
              ? "black"
              : "#DDE1EE",
          cursor: "pointer",
        }}
      />
      <ArrowDropDown
        onClick={() => {
          sortingBy(columnName, "asc");
          setActiveSort({ column: columnName, sort: "asc" });
        }}
        sx={{
          fontSize: "16px",
          color:
            activeSort?.column === columnName && activeSort?.sort === "asc"
              ? "black"
              : "#DDE1EE",
          cursor: "pointer",
        }}
      />
    </Box>
  );
  const clearHandler = () => {
    searchHandler("clear");
    if (jobsOrder) {
      setJobOrderSearch("");
    }
    setSearchTerm("");
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
          placeholder="Search jobs  "
          value={jobsOrder ? jobOrderSearch : searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && searchHandler()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" onClick={searchHandler}>
                <SearchIcon sx={{ cursor: "pointer" }} />
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
            "& .MuiInputBase-input::placeholder": {
              color: darkMode === "dark" ? "rgba(255, 255, 255, .7)" : "black",
              fontSize: "12.64px",
              lineHeight: "15.3px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {permissions?.includes("delete job management info")
            ? selectedJobs.length > 0 && (
                <>
                  <Typography variant="body2">
                    {selectedJobs.length} Selected
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteOutline />}
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
                </>
              )
            : ""}
          {permissions?.includes("create job management info") ? (
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

          {permissions?.includes("read job management info") ? (
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
                ml: 3,
              }}
              onClick={() => {
                toggleDrawer(true);
              }}
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
      {/* //-=-======----------------------------------------- */}

      <ExportDrawer
        open={exportDrawerOpen}
        onClose={() => setExportDrawerOpen(false)}
        columns={columns}
        onExport={handleExport}
        title="Export Client Jobs"
      />
      {/* //======================------------------------- */}
      <ChipsSection
        filters={filters}
        filterProvider={filterProvider}
        handleRemove={handleRemove}
        countAppliedFilters={countAppliedFilters}
        clearFilterHandler={clearFilterHandler}
        allSpecialitiesOptions={allSpecialitiesOptions}
        filterProviderRolesList={filterProviderRolesList}
      />
      {location === "postedJob" ? <AlertMessage /> : ""}

      {isLoading ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          {/* <CircularProgress /> */}
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer className="thin_slider">
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
                        selectedJobs?.length > 0 &&
                        selectedJobs?.length < filteredJobs?.length
                      }
                      checked={
                        filteredJobs?.length > 0 &&
                        selectedJobs?.length === filteredJobs?.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        varint="body2"
                        sx={{ fontSize: "11.9px", fontWeight: 500 }}
                      >
                        JOB NO
                      </Typography>

                      {sortRender("job_id")}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        varint="body2"
                        sx={{ fontSize: "11.9px", fontWeight: 500 }}
                      >
                        PROVIDER
                      </Typography>
                      {sortRender("provider_name")}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      minWidth: "150px",
                    }}
                  >
                    PROVIDER RATE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      minWidth: "150px",
                      textTransform: "uppercase",
                    }}
                  >
                    Role & Speciality
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        varint="body2"
                        sx={{ fontSize: "11.9px", fontWeight: 500 }}
                      >
                        CLIENT
                      </Typography>
                      {sortRender("client_name")}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    CLIENT RATE
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
              SITE NAME
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    SETUP STATUS
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    SETUP COMPLETION
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                    }}
                  >
                    PROJECT DATES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs?.length > 0 ? (
                  filteredJobs?.map((job) => (
                    <TableRow
                      key={job.id}
                      hover
                      role="checkbox"
                      aria-checked={selectedJobs.indexOf(job.id) !== -1}
                      tabIndex={-1}
                      selected={selectedJobs.indexOf(job.id) !== -1}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(event) => handleSelectJob(event, job.id)}
                      >
                        <BpCheckbox
                          className={`${
                            selectedJobs.indexOf(job.id) == -1 && "checkbox"
                          }`}
                          checked={selectedJobs.indexOf(job.id) !== -1}
                          onChange={(event) => handleSelectJob(event, job.id)}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => viewDetail(job.id)}
                        sx={{
                          "&:hover": {
                            color: "text.link",
                            fontWeight: 600,
                            cursor: "pointer",
                          },
                          color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                          fontWeight: "600",
                          maxWidth: "200px",
                          minWidth: "100px",
                        }}
                      >
                        {job?.id}
                      </TableCell>
                      <TableCell
                        onClick={() => viewDetail(job.id)}
                        sx={{
                          "&:hover": {
                            color: "text.link",
                            fontWeight: 600,
                            cursor: "pointer",
                          },
                          color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                          fontWeight: "600",
                          minWidth: "200px",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".875rem ",
                                fontWeight: 600,
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textTransform: "capitalize",
                              }}
                            >
                              {job.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".8125rem ",
                                fontWeight: 400,
                                color:
                                  darkMode == "dark"
                                    ? "#FFFFFF"
                                    : "rgba(103, 119, 136)",
                              }}
                            >
                              {job.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>$ {job.p_regular_hourly_rate}/hr</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Tooltip
                            arrow
                            placement="top"
                            title={
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: "200px",
                                  fontSize: "0.75rem",
                                  fontWeight: 400,
                                  color: "#ffffff",
                                }}
                              >
                                {job?.role?.name}
                              </Typography>
                            }
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".875rem ",
                                fontWeight: 600,
                                lineHeight: 1.2,
                                color:
                                  darkMode == "dark" ? "#FFFFFF" : "text.black",
                              }}
                            >
                              {job?.role?.name?.length < 20
                                ? job?.role?.name
                                : `${job?.role?.name?.slice(0, 20)}...`}
                            </Typography>
                          </Tooltip>
                          <Tooltip
                            arrow
                            placement="top"
                            title={
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: "200px",
                                  fontSize: "0.75rem",
                                  fontWeight: 400,
                                  color: "#ffffff",
                                }}
                              >
                                {job?.speciality?.name}
                              </Typography>
                            }
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".8125rem ",
                                fontWeight: 400,
                                color:
                                  darkMode == "dark"
                                    ? "#FFFFFF"
                                    : "rgba(103, 119, 136)",
                              }}
                            >
                              {job?.speciality?.name?.length < 20
                                ? job?.speciality?.name
                                : `${job?.speciality?.name?.slice(0, 20)}...`}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                          fontWeight: "600",
                          maxWidth: "200px",
                          minWidth: "200px",
                        }}
                      >
                        {job.client_id ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".875rem ",
                                fontWeight: 600,
                                lineHeight: 1.2,
                                textTransform: "capitalize",
                              }}
                            >
                              {job?.client_name}
                            </Typography>
                            {job?.addresses?.[0]?.city ||
                            job?.addresses?.[0]?.address_line_1 ? (
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: ".8125rem ",
                                  fontWeight: 400,
                                  color:
                                    darkMode == "dark"
                                      ? "#FFFFFF"
                                      : "rgba(103, 119, 136)",
                                }}
                              >
                                {job?.addresses?.[0]?.city}
                                {job?.addresses?.[0]?.address_line_1 && "/"}
                                {job?.addresses?.[0]?.address_line_1
                                  ? job?.addresses?.[0]?.address_line_1
                                      ?.length < 20
                                    ? job?.addresses?.[0]?.address_line_1
                                    : `${job?.addresses?.[0]?.address_line_1?.slice(
                                        0,
                                        20
                                      )}...`
                                  : ""}
                              </Typography>
                            ) : (
                              "--"
                            )}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              justifyContent: "start",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".8125rem ",
                                fontWeight: 400,
                                pl: 1,
                              }}
                            >
                              No client
                            </Typography>
                            <Button
                              onClick={() =>
                                addHandler({ id: job.id, step: 1 })
                              }
                              variant="text"
                              startIcon={<AddCircleOutline />}
                              sx={{
                                textTransform: "initial",
                                py: 0,
                                fontWeight: 600,
                                fontSize: " .875rem",
                                lineHeight: 1.2,
                                color: darkMode === "dark" && "#007BFF",
                              }}
                            >
                              Add client
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          // color: darkMode == "dark" ? "#FFFFFF" : "",
                          // fontSize: "11.9px",
                          minWidth: "200px",
                        }}
                      >
                        {job?.c_regular_hourly_rate && "$ "}
                        {job?.c_regular_hourly_rate || (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              justifyContent: "start",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".8125rem ",
                                fontWeight: 400,
                                pl: 1,
                              }}
                            >
                              No rate
                            </Typography>
                            <Button
                              onClick={() =>
                                addHandler({ id: job.id, step: 1 })
                              }
                              variant="text"
                              startIcon={<AddCircleOutline />}
                              sx={{
                                textTransform: "initial",
                                py: 0,
                                fontWeight: 600,
                                fontSize: " .875rem",
                                lineHeight: 1.2,
                                color: darkMode === "dark" && "#007BFF",
                              }}
                            >
                              Add client rate
                            </Button>
                          </Box>
                        )}
                        {job?.c_regular_hourly_rate && "/hr"}
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: "200px",
                        }}
                      >
                        {job?.addresses?.length > 0 ? (
                          (() => {
                            let selectedAddress = null;
                            if (job.site_same_as_billing === 1) {
                              selectedAddress = job.addresses.find(
                                (address) => address.type === "billing"
                              );
                            } else {
                              selectedAddress = job.addresses.find(
                                (address) => address.type === "site"
                              );
                            }
                            if (selectedAddress) {
                              return (
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: ".875rem",
                                      fontWeight: 600,
                                      lineHeight: 1.2,
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {selectedAddress.city || "--"}
                                  </Typography>
                                  <Tooltip
                                    arrow
                                    placement="top"
                                    title={
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          maxWidth: "200px",
                                          fontSize: "0.75rem",
                                          fontWeight: 400,
                                          color: "#ffffff",
                                        }}
                                      >
                                        {selectedAddress.address_line_1 || "--"}
                                      </Typography>
                                    }
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: ".8125rem",
                                        fontWeight: 400,
                                        color:
                                          darkMode === "dark"
                                            ? "#FFFFFF"
                                            : "rgba(103, 119, 136)",
                                      }}
                                    >
                                      {selectedAddress.address_line_1
                                        ? selectedAddress.address_line_1.length < 20
                                          ? selectedAddress.address_line_1
                                          : `${selectedAddress.address_line_1.slice(0, 20)}...`
                                        : "--"}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                              );
                            } else {
                              return "--";
                            }
                          })()
                        ) : (
                          "--"
                        )}
                      </TableCell>
                      <TableCell sx={{ minWidth: "150px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              bgcolor:
                                job?.step_completed > 6 ? "#00c9a7" : "#377dff",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                            }}
                          />
                          {job?.step_completed > 6
                            ? "Completed"
                            : "In progress"}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: "200px",
                        }}
                      >
                        {progressBar(job?.step_completed)}
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: "300px",
                        }}
                      >
                        {job?.project_start_date && job?.project_end_date ? (
                          <Box>
                            {format(
                              new Date(
                                job?.project_start_date
                              ).toLocaleDateString(),
                              "dd MMM yyyy"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(
                                job?.project_end_date
                              ).toLocaleDateString(),
                              "dd MMM yyyy"
                            )}
                          </Box>
                        ) : (
                          "--"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow sx={{}}>
                    <TableCell colSpan={10}>
                      <NodataFoundCard
                        title={"No Jobs found"}
                        actionText={
                          searchTerm || jobOrderSearch
                            ? "Clear search"
                            : countAppliedFilters()
                            ? "Clear filters"
                            : ""
                        }
                        action={clearHandler}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <TablePagination
        rowsPerPageOptions={[20, 30, 50]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.perPage}
        page={pagination.currentPage - 1} // TablePagination uses 0-indexed pages
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{
          disabled: pagination.currentPage === pagination.lastPage,
        }}
        backIconButtonProps={{
          disabled: pagination.currentPage === 1,
        }}
      />
    </Paper>
  );
};

export default JobTable;
