import {
  Box,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Breadcrumbs,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import underConstructionImage from "../../assets/svg/design-system/docs-datatables.svg";
import {
  Add,
  Close,
  Download,
  ExpandMoreOutlined,
  FilterList,
  Visibility,
  SaveAltOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobTable from "../../components/job-component/JobTable";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import PostJobModal from "../../components/post-job/PostJobModal";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchStates,
} from "../../thunkOperation/job_management/states";
import PostedJobsTable from "../../components/post-job/PostedJobsTable";
import {
  fetchCountries,
  resetField,
} from "../../feature/post-job/PostJobSlice";
import CustomToggleButtonGroup from "../../components/button/CustomToggleButtonGroup";
import JobsKanbanView from "../../components/post-job/JobsKanbanView";
import PostJobTableCards from "../../components/post-job/PostJobTableCards";
import DrawerFilter from "../../components/common/DrawerFilters";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SkeletonRow from "../../components/SkeletonRow";
import { fetchPostedJobsData } from "../../thunkOperation/postJob/postJobThunk";
import PostJobFilter from "../../components/post-job/PostJobFilter";
import {
  checkGetReadyExport,
  getClients,
  getCountries,
} from "../../api_request";
import { selectOptions } from "../../util";
import ClearFilterDesign from "../../components/common/filterChips/ClearFilterDesign";
import { SearchIcon } from "../../components/post-job/PostedJobsIcons";
import API, { baseURLImage } from "../../API";
import ExportDrawer from "../../components/common/ExportDrawer";
import ExportAlert from "../../components/common/ExportAlert";
import NoPermissionCard from "../../components/common/NoPermissionCard";
const JobsModule = () => {
  const {
    postJobsTableData,
    medicalSpecialities,
    providerRolesList,
    isLoading,
  } = useSelector((state) => state.postJob);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const [filters, setFilters] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [filterMedicalSpecialities, setfilterMedicalSpecialities] = useState(
    []
  );
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [providerInfo, setProviderInfo] = useState([]);
  const [jobsCount, setJobsCount] = useState([]);
  const [filterStates, setFilterStates] = useState({
    provider_name: "",
    location: "",
    role: "",
    client: "",
    speciality: "",
    status: "all",
    from_date: "",
    end_date: "",
    shift_time: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });
  const handleSearchChange = (event) => {
    setIsSearching(true);
    setSearchTerm(event.target.value);
  };
  const searchHandler = () => {
    const param = {
      perpage: pagination.perPage,
      page: 1,
      search: searchTerm,
    };
    dispatch(fetchPostedJobsData(param));
    if (searchTerm?.length > 0) {
      setIsSearching(false);
    }
  };
  const [view, setView] = useState("table");
  const [value, setValue] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const handleToggleClick = (e) => {
    // Toggle between 'table' and 'kanban' views
    setView(e === "table_view" ? "table" : "kanban");
  };
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const addNewJobHandler = () => {
    setIsOpen(!isOpen);
    sessionStorage.setItem("jobModal", !isOpen);
  };
  const handleClose = () => {
    setIsOpen(false);
    dispatch(resetField());
    sessionStorage.removeItem("jobModal");
    sessionStorage.removeItem("currentTabIndex");
  };
  const getStatus = (value) => {
    switch (value) {
      case 0:
        return "all";
      case 1:
        return "active";
      case 2:
        return "inactive";
      case 3:
        return "draft";
      case 4:
        return "closed";

      default:
        return "all";
    }
  };
  const getPostedJobsHandler = async (filterData = null, isClear = false) => {
    setDataLoading(true);
    const per_page = localStorage.getItem("per_page");
    const param = {
      perpage: per_page || 20,
      page: 1,
      status: getStatus(value) || "",
      ...(!isClear && filterData == null && filters?.[0]
        ? { ...filters[0] }
        : {}),
    };

    const resp = await dispatch(
      fetchPostedJobsData(filterData ? filterData : param)
    );
    if (resp?.payload?.data) {
      setDataLoading(false);
    }
  };
  const getJobsCounthandler = async () => {
    try {
      const resp = await API.get("/api/posted-job-widgets");
      if (resp?.data?.success) {
        setJobsCount(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobsCounthandler();
  }, [postJobsTableData?.data]);
  useEffect(() => {
    getPostedJobsHandler();
    dispatch(fetchMedicalSpecialities());
    dispatch(fetchProviderRoles());
    dispatch(fetchStates());
  }, [dispatch, value]);

  const { newUserData } = useSelector((state) => state.job);
  const filterExistingProvider = providerInfo?.map((option) => ({
    value: option.id,
    // label: option.email,
    label: `${option.email} - (${option?.name})`,
  }));

  // const tabLabels = ["All ", "Active jobs", "inactive jobs", "Draft jobs"];
  const tabsData = [
    { key: "All", value: 0 },
    { key: "Active", value: 1 },
    { key: "Inactive", value: 2 },
    { key: "Draft", value: 3 },
    { key: "Closed", value: 4 },
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDataLoading(true);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  // ------------------------------------------------------------- countries
  const getCountriesHandler = async () => {
    try {
      const resp = await getCountries();
      if (resp?.data?.success) {
        setCountries(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getClientsHandler = async () => {
    try {
      const resp = await getClients();
      if (resp?.data?.success) {
        setClients(resp?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const filterCountries = countries?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  // ------------------------------------------------------------- countries end
  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  useEffect(() => {
    if (!countAppliedFilters()) {
      getCountriesHandler();
      dispatch(fetchCountries());
      getClientsHandler();
      setIsOpen(sessionStorage.getItem("jobModal"));
      setfilterProviderRolesList(selectOptions(providerRolesList));
      setfilterMedicalSpecialities(selectOptions(medicalSpecialities));
    }
  }, []);
  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;
      // After updating the filters, call getJobData with the updated filters
      getPostedJobsHandler(updatedFilters?.[0]);

      return updatedFilters;
    });
  };
  const clearFilterHandler = () => {
    setFilters([]);
    getPostedJobsHandler(null, true);
  };
  const renderContent = () => {
    if (
      (!postJobsTableData || postJobsTableData?.data?.length === 0) &&
      !searchTerm &&
      !countAppliedFilters() &&
      !isSearching &&
      value === 0 &&
      !dataLoading
    ) {
      return (
        <Box sx={{ textAlign: "center", mt: 4.5 }}>
          <img
            src={underConstructionImage}
            alt="Under construction"
            style={{
              maxWidth: "15rem",
              marginBottom: "20px",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: "text.black",
              fontSize: "1.41094rem",
              fontWeight: 600,
            }}
            gutterBottom
          >
            Start Managing Your Jobs
          </Typography>
          <Typography variant="body2" gutterBottom>
            Create your first job to see it listed here. Click the button below
            to get started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={addNewJobHandler}
            sx={{
              mt: 2,
              textTransform: "initial",
              bgcolor: "background.btn_blue",
              boxShadow: "none",
              py: 1,
              px: 2,
              fontWeight: 400,
            }}
          >
            <Add sx={{ fontWeight: 400, fontSize: "16px", mr: "0.5rem" }} />
            Post a new job
          </Button>
        </Box>
      );
    } else {
      return (
        <>
          {/* ======================top widgets=========================== */}
          <PostJobTableCards jobsCount={jobsCount} />
          {/* ==================tabs and toglle view butns================= */}
          <Box
            sx={{
              my: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                // width: { md: "90%", xl: "90%" },
                width: "100%",

                // borderBottom: "1px solid #DEE2E6",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="payment tabs"
              >
                {tabsData.map((item, index) => (
                  <Tab
                    key={index}
                    label={
                      <Typography
                        variant="h6"
                        sx={{
                          textTransform: "capitalize",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: value === index ? "text.btn_theme" : "inherit",
                        }}
                      >
                        {item.key}
                      </Typography>
                    }
                    {...a11yProps(index)}
                  />
                ))}
              </Tabs>
            </Box>

            {/* <CustomToggleButtonGroup
              buttonTab={buttonTab}
              alignment={alignment}
              handleAlignment={handleAlignment}
              handleToggleClick={handleToggleClick}
              darkMode={darkMode}
            /> */}
          </Box>

          {/* =========================table or kanban view=============== */}
          {isExportLoading && (
            <ExportAlert severity={"info"} message={exportMessage} />
          )}
          {isExportSuccess && (
            <ExportAlert severity={"success"} message={exportMessage} />
          )}
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "10px",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
            }}
          >
            {/* ============= search bar and filter button ================== */}
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
                placeholder="Search jobs"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && searchHandler()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        onClick={() => searchHandler()}
                        sx={{ cursor: "pointer" }}
                      />
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
                    color: "rgba(140, 152, 164, 1)",
                    fontSize: "12.64px",
                    lineHeight: "15.3px",
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {permissions?.includes("export jobs applicants") ? (
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
                  onClick={() => toggleDrawer(true)}
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
                <PostJobFilter
                  filterExistingProvider={filterExistingProvider}
                  filterCountries={filterCountries}
                  filterProviderRolesList={filterProviderRolesList}
                  filterMedicalSpecialities={filterMedicalSpecialities}
                  filterClientList={selectOptions(clients)}
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                  filters={filters}
                  toggleDrawer={toggleDrawer}
                  setFilters={setFilters}
                  countAppliedFilters={countAppliedFilters}
                  filterStates={filterStates}
                  setFilterStates={setFilterStates}
                />
              </Box>
            </Box>

            {/* ======conditionaly render table or kanban view on button click===== */}
            {view === "table" ? (
              <PostedJobsTable
                searchTerm={searchTerm}
                postJobsTableData={postJobsTableData}
                // ------------------------
                filters={filters}
                filterProvider={filterExistingProvider}
                filterClientList={selectOptions(clients)}
                handleRemove={handleRemove}
                countAppliedFilters={countAppliedFilters}
                clearFilterHandler={clearFilterHandler}
                allSpecialitiesOptions={filterMedicalSpecialities}
                filterProviderRolesList={filterProviderRolesList}
                filterCountries={filterCountries}
                permissions={permissions}
              />
            ) : (
              <JobsKanbanView
                searchTerm={searchTerm}
                postJobsTableData={postJobsTableData}
              />
            )}
          </Paper>
        </>
      );
    }
  };
  // =========================================================
  const darkMode = useSelector((state) => state.theme.mode);

  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "job_id" },
    { name: "client_name" },
    { name: "job_title" },
    { name: "description" },
    { name: "role_name" },
    { name: "speciality_name" },
    { name: "country" },
    { name: "state" },
    { name: "city" },
    { name: "due_date" },
    { name: "shift_start_time" },
    { name: "shift_end_time" },
    { name: "applications_count" },
    { name: "job_status" },
    { name: "created_at" },
  ]);

  const handleExportClick = () => {
    setExportDrawerOpen(true);
  };
  const [isExportLoading, setIsExportLoading] = useState(() => {
    return localStorage.getItem("exportLoading") === "postedJob";
  });
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  const handleExport = async (selectedColumns, fileType) => {
    const requestData = {
      search: searchTerm || "",
      provider_id: filters?.[0]?.provider_name || "",
      status: filters?.[0]?.status || "",
      role: filters?.[0]?.role || "",
      speciality: filters?.[0]?.speciality || "",
      from_date: filters?.[0]?.from_date || "",
      end_date: filters?.[0]?.end_date || "",
      client: filters?.[0]?.client === undefined ? "" : filters?.[0]?.client,
      shift_from_time: filters?.[0]?.shift_time || "",
      shift_end_time: filters?.[0]?.end_time || "",
      location:
        filters?.[0]?.location === undefined ? "" : filters?.[0]?.location,
      sort_column_name:
        !filters?.[0]?.sort_column_name ||
        filters?.[0]?.sort_column_name === undefined
          ? ""
          : filters?.[0]?.sort_column_name,
      sort_type:
        !filters?.[0]?.sort_type || filters?.[0]?.sort_type === undefined
          ? ""
          : filters?.[0]?.sort_type,
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
      const resp = await API.post(`/api/posted-jobs-export`, bodyData);
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
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Jobs" }];
  if (permissions?.includes("read jobs info")) {
    return (
      <Box
        sx={{
          overflowX: "hidden",
          bgcolor: "background.page_bg",
        }}
      >
        <Header />
        {/* {permissions?.includes("read") ? ( */}
        {true ? (
          <Box
            sx={{
              minHeight: "100vh",
              overflowX: "hidden",
              m: "0 auto",
              width: { sm: "100%", xl: "78%" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                pr: 2,
              }}
            >
              <Breadcrumb items={breadcrumbItems} title={"Jobs"} />
              {/* {postJobsTableData?.data?.length > 0 && ( */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {permissions?.includes("create jobs info") ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addNewJobHandler}
                    sx={{
                      mt: 2,
                      textTransform: "initial",
                      bgcolor: "background.btn_blue",
                      boxShadow: "none",
                      py: 1,
                      px: 2,
                      fontWeight: 400,
                    }}
                  >
                    <Add
                      sx={{ fontWeight: 400, fontSize: "16px", mr: "0.5rem" }}
                    />
                    Post job
                  </Button>
                ) : (
                  ""
                )}

                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
                    textTransform: "capitalize",
                    color: "text.primary",
                    fontSize: " .8125rem",
                    bgcolor: "background.paper",
                    fontWeight: 400,
                    py: 1,
                    borderColor: "rgba(231, 234, 243, 1)",
                    "&:hover": {
                      borderColor: "rgba(231, 234, 243, 1)",
                    },
                  }}
                  onClick={() => {
                    window.open(
                      "https://projects.tangiblethemes.com/Shglocums/browse-jobs",

                      "_blank"
                    );
                  }}
                  startIcon={<Visibility />}
                >
                  Preveiw jobs
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                py: 4,
                px: 2,
              }}
            >
              {dataLoading ? (
                <Box sx={{ textAlign: "center", mx: "auto" }}>
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                </Box>
              ) : (
                renderContent()
              )}
            </Box>
          </Box>
        ) : (
          ""
        )}
        {/*  ---------------------Open model for new */}
        <PostJobModal open={isOpen} handleClose={handleClose} />
        <ExportDrawer
          open={exportDrawerOpen}
          onClose={() => setExportDrawerOpen(false)}
          columns={columns}
          onExport={handleExport}
          title="Export Posted Jobs"
        />
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default JobsModule;
