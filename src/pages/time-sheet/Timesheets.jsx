import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import TimesheetsTable from "./TimesheetsTable";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Menu,
  MenuItem,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import {
  SaveAltOutlined,
  ExpandMoreOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import API from "../../API";
import SkeletonRow from "../../components/SkeletonRow";
import Filter from "./Filter";
import { useDispatch } from "react-redux";
import { removeCurrentClient } from "../../feature/client-module/clientSlice";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
} from "../../thunkOperation/job_management/states";
import { SearchIcon } from "../../components/post-job/PostedJobsIcons";
import ExportAlert from "../../components/common/ExportAlert";
import ExportDrawer from "../../components/common/ExportDrawer";
import { checkGetReadyExport } from "../../api_request";
import NoPermissionCard from "../../components/common/NoPermissionCard";

const Timesheets = () => {
  const dispatch = useDispatch();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Timesheets" }];
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const darkMode = useSelector((state) => state.theme.mode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [timesheets, setTimesheets] = useState(null);
  const [clients, setClients] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(
    sessionStorage.getItem("per_page") > 0
      ? sessionStorage.getItem("per_page")
      : 20
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allFiltersClear, setAllFiltersClear] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });
  const [alignment, setAlignment] = useState("all_times");
  const [filters, setFilters] = useState({
    client: "",
    actionRequired: [],
    invoiceStatus: [],
    timesheetStatus: "",
    clientApproval: "",
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleCheckboxChange = (filterName, value) => {
    setFilters((prev) => {
      const filterValues = prev[filterName];
      if (filterValues.includes(value)) {
        return {
          ...prev,
          [filterName]: filterValues.filter((v) => v !== value),
        };
      } else {
        return { ...prev, [filterName]: [...filterValues, value] };
      }
    });
  };

  const clearFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]:
        filterName === "actionRequired" || filterName === "invoiceStatus"
          ? []
          : "",
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      client: "",
      actionRequired: [],
      invoiceStatus: [],
      timesheetStatus: "",
      clientApproval: "",
    });
    setAllFiltersClear(!allFiltersClear);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "timesheet_no" },
    { name: "provider_name" },
    { name: "client_name" },
    { name: "timesheet_date_range" },
    { name: "weekly_totals" },
    { name: "timesheet_status" },
    { name: "action_required" },
    { name: "client_approval_status" },
    { name: "invoice_status" },
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
      // date_range: date_range ? date_range : "all_times",

      search: searchKeyword || "",
      client: filters.client || "",
      actionRequired: filters.actionRequired.join(","),
      invoiceStatus: filters.invoiceStatus.join(","),
      timesheetStatus: filters.timesheetStatus,
      clientApproval: filters.clientApproval,
      data_type: "admin_timesheet",
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
      const resp = await API.post(`/api/timesheets-export`, bodyData);
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

  // ------------------------------------------------------------------------------------ Export Function End
  const getTimesheets = async (status, next = false, date_range = null) => {
    setIsLoading(true);
    if (searchKeyword) {
      setPage(0);
    }
    try {
      const params = {
        // page: searchKeyword ? 1 : next ? next : pagination.currentPage,
        page: next ? next : pagination.currentPage,
        paginate: rowsPerPage,
        client: filters.client,
        date_range: date_range ? date_range : "all_times",
        actionRequired: filters.actionRequired.join(","),
        invoiceStatus: filters.invoiceStatus.join(","),
        timesheetStatus: !next && status ? status : filters.timesheetStatus,
        clientApproval: filters.clientApproval,
        search: searchKeyword,
        data_type: "admin_timesheet",
      };

      const resp = await API.get("/api/get-timesheets", { params });
      if (resp?.data?.success) {
        setTimesheets(resp?.data?.data);
        setIsLoading(false);
        setClients(resp?.data?.clients);
        setIsDrawerOpen(false);
        setPagination({
          currentPage: resp?.data?.data?.current_page,
          lastPage: resp?.data?.data?.last_page,
          perPage: resp?.data?.data?.per_page,
          total: resp?.data?.data?.total,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // clearAllFilters();

    switch (newValue) {
      case 0:
        getTimesheets("all", null, alignment);
        break;
      case 1:
        getTimesheets("submitted_by_provider", null, alignment);
        break;
      // case 2:
      //   getTimesheets("unsubmitted", null, alignment);
      //   break;
      case 2:
        getTimesheets("pending", null, alignment);
        break;
      case 3:
        getTimesheets("approved", null, alignment);
        break;
      case 4:
        getTimesheets("rejected", null, alignment);
        break;
      case 5:
        getTimesheets("Invoiced", null, alignment);
        break;
      case 6:
        getTimesheets("paid", null, alignment);
        break;
    }
    // handleFilterChange("timesheetStatus", e.target.value);
  };
  useEffect(() => {
    getTimesheets();
    dispatch(fetchMedicalSpecialities());
    dispatch(fetchProviderRoles());
    dispatch(removeCurrentClient());
  }, [allFiltersClear]);

  const handlePageChange = (event, newPage) => {
    // setPage(newPage);
    const nextPage = newPage + 1;
    if (nextPage !== pagination.currentPage) {
      setPagination((prev) => {
        getTimesheets("prev", nextPage);
        return {
          ...prev,
          currentPage: newPage + 1,
        };
      });
    }
  };
  const handleRowsPerPageChange = (event) => {
    sessionStorage.setItem("per_page", event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPagination((prev) => {
      getTimesheets();
      return {
        ...prev,
        perPage: parseInt(event.target.value, 10),
      };
    });
  };
  const handleAlignment = (event, newAlignment) => {
    switch (tabValue) {
      case 0:
        getTimesheets("all", null, newAlignment);
        break;
      case 1:
        getTimesheets("submitted_by_provider", null, newAlignment);
        break;
      case 2:
        getTimesheets("unsubmitted", null, newAlignment);
        break;
      case 3:
        getTimesheets("pending", null, newAlignment);
        break;
      case 4:
        getTimesheets("approved", null, newAlignment);
        break;
      case 5:
        getTimesheets("rejected", null, newAlignment);
        break;
      case 6:
        getTimesheets("Invoiced", null, newAlignment);
        break;
      case 7:
        getTimesheets("paid", null, newAlignment);
        break;
    }

    setAlignment(newAlignment);
  };
  const buttonTab = [
    { label: "This week", value: "this_week" },
    { label: "Last week", value: "last_week" },
    { label: "Last 15 days", value: "last_15_days" },
    { label: "Last month", value: "last_month" },
    { label: "Last 3 months", value: "last_3_months" },
    { label: "All times", value: "all_times" },
  ];
  const tabs = [
    { label: `All`, value: "all" },
    { label: "Submitted", value: "submitted" },
    // { label: "Unsubmitted", value: "un_submitted" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    // { label: "Invoiced", value: "invoiced" },
    // { label: "Paid", value: "paid" },
  ];
  const countAppliedFilters = () => {
    return Object?.values(filters)?.reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length;
      }
      return count + (filter ? 1 : 0);
    }, 0);
  };
  if (permissions?.includes("read timesheets info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />

        <ExportDrawer
          open={exportDrawerOpen}
          onClose={() => setExportDrawerOpen(false)}
          columns={columns}
          onExport={handleExport}
          title="Export timesheets"
        />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Breadcrumb items={breadcrumbItems} title={"Timesheets"}>
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
              sx={{
                bgcolor: darkMode === "light" ? "#F8FAFD" : "#1E2022",
              }}
            >
              {buttonTab?.map((item, index) => (
                <ToggleButton
                  key={index}
                  value={item.value}
                  aria-label="left aligned"
                  sx={{
                    border: "none",
                    outline: "none",
                    height: "2.6rem",
                    color: "text.or_color",
                    textTransform: "none",
                    fontSize: ".875rem",
                    fontWeight: 400,
                    "&:hover": {
                      color: "text.btn_blue",
                    },
                    minWidth: "5rem",
                    "&.Mui-selected": {
                      my: 0.2,
                      color: "text.black",
                      fontWeight: 400,
                      boxShadow:
                        darkMode === "light" &&
                        "0 .1875rem .375rem 0 rgba(140, 152, 164, .25)",
                      bgcolor:
                        darkMode === "light" ? "background.paper" : "#25282A",
                      // transform: "scale(1.01)",
                    },
                    "&.Mui-selected ": {
                      height: "2.3rem",
                      mt: 0.3,
                      borderRadius: "7px",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: darkMode === "light" ? "white" : "black",
                    },
                  }}
                >
                  {item.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Breadcrumb>

          <Box pb={3} pt={1} px={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Timesheet Tabs"
            >
              {tabs.map((tab, index) => {
                return (
                  <Tab
                    key={index}
                    sx={{
                      textTransform: "none",
                      color: "text.black",
                    }}
                    label={
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: tabValue === index ? 500 : 400 }}
                      >
                        {tab.label}
                        {index === 0 && (
                          <Typography
                            variant="button"
                            sx={{
                              bgcolor: "#DADCE3",
                              color: "text.black",
                              py: "2px",
                              px: "5px",
                              ml: 1,
                              borderRadius: "5px",
                            }}
                          >
                            {timesheets?.total ?? 0}
                          </Typography>
                        )}
                      </Typography>
                    }
                  />
                );
              })}
            </Tabs>
            <Divider sx={{ opacity: 0.3 }} />
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: "10px",
              }}
              mt={7}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                pt={2}
                sx={{ borderRadius: "10px" }}
              >
                <TextField
                  variant="standard"
                  size="small"
                  placeholder="Search timesheet"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getTimesheets();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          onClick={() => getTimesheets()}
                          sx={{ cursor: "pointer" }}
                        />
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
                      color:
                        darkMode === "dark"
                          ? "rgba(255, 255, 255, .7)"
                          : "black",
                      fontSize: "12.64px",
                      lineHeight: "15.3px",
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                    },
                  }}
                />

                <Box>
                  {permissions?.includes("export timesheets info") && (
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
                  )}
                  {permissions?.includes("read timesheets info") && (
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
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
                      onClick={toggleDrawer(true)}
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
              {isLoading ? (
                <Box sx={{ textAlign: "center", mx: "auto" }}>
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                </Box>
              ) : (
                <TimesheetsTable
                  timesheets={timesheets}
                  // page={page}
                  // rowsPerPage={rowsPerPage}
                  count={pagination.total}
                  rowsPerPage={pagination.perPage}
                  page={pagination.currentPage - 1}
                  handlePageChange={handlePageChange}
                  handleRowsPerPageChange={handleRowsPerPageChange}
                  darkMode={darkMode}
                />
              )}
            </Box>

            <Filter
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              filters={filters}
              handleCheckboxChange={handleCheckboxChange}
              clearFilter={clearFilter}
              clearAllFilters={clearAllFilters}
              getTimesheets={getTimesheets}
              clients={clients}
              handleFilterChange={handleFilterChange}
              countAppliedFilters={countAppliedFilters}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default Timesheets;
