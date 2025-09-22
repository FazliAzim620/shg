import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/BreadCrumb";
import Header from "../../components/Header";
import SchedulesTable from "./SchedulesTable";
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
  styled,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import {
  SaveAltOutlined,
  ExpandMoreOutlined,
  SearchOutlined,
  Close,
  KeyboardArrowDown,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import API from "../../API";
import SkeletonRow from "../../components/SkeletonRow";
import Filter from "./Filter";
import { useDispatch } from "react-redux";
import { removeCurrentClient } from "../../feature/client-module/clientSlice";
import {
  fetchClientsInfo,
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchProvidersInfo,
} from "../../thunkOperation/job_management/states";
import { formatTo12Hour, selectOptions } from "../../util";
import ClearFilterDesign from "../../components/common/filterChips/ClearFilterDesign";
import { flxCntrSx } from "../../components/constants/data";
import { SearchIcon } from "../../components/post-job/PostedJobsIcons";
import ExportAlert from "../../components/common/ExportAlert";
import ExportDrawer from "../../components/common/ExportDrawer";
import { checkGetReadyExport } from "../../api_request";
import NoPermissionCard from "../../components/common/NoPermissionCard";
import { Calendar } from "react-big-calendar";
import localizer from "../../components/common/calendarLocalizer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { addDays, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, addWeeks, endOfMonth as endOfMonthFn } from "date-fns";
const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    height: "3px",
  },
  // Remove the bottom border of the Tabs component
  "& .MuiTabs-flexContainer": {
    borderBottom: "none",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: "auto",
  padding: "0px 16px",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));
const CalendarToolbar = (toolbar) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2, px: 2 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Button onClick={() => toolbar.onNavigate("PREV")} sx={{ minWidth: 0,color: "text.primary", }}> <ChevronLeft /> </Button>
        <Box>
          <Typography fontWeight={600} fontSize="1rem">
            {toolbar.label}
          </Typography>
        </Box>
        <Button onClick={() => toolbar.onNavigate("NEXT")} sx={{ minWidth: 0 ,color: "text.primary",}}> <ChevronRight /> </Button>
      </Box>
      <Button
        endIcon={<KeyboardArrowDown />}
        onClick={handleClick}
        sx={{ textTransform: "capitalize", color: "text.primary", fontSize: "0.8125rem", fontWeight: 400, border: "1px solid rgba(99, 99, 99, 0.2)", padding: "5px 16px", minWidth: 0, bgcolor: "background.paper", '&:hover': { boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", bgcolor: "background.paper", color: "text.main", transform: "scale(1.01)" }, '&:focus': { outline: "none" } }}
      >
        {toolbar.view === "agenda" ? "List" : toolbar.view.charAt(0).toUpperCase() + toolbar.view.slice(1)}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {["month", "week", "day", "agenda"].map((view) => (
          <MenuItem
            key={view}
            onClick={() => { toolbar.onView(view); handleClose(); }}
            sx={{ minWidth: "120px", bgcolor: toolbar.view === view && "rgba(196,200,203,0.3)" }}
          >
            {view === "agenda" ? "List" : view.charAt(0).toUpperCase() + view.slice(1)}
            {toolbar.view === view && (
              <Box component="span" sx={{ ml: 1, fontWeight: 700 }}>&#10003;</Box>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const Schedules = () => {
  const dispatch = useDispatch();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Shifts" }];

  const [typeFilter, setTypeFilter] = useState("this_week");
  const darkMode = useSelector((state) => state.theme.mode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [timesheets, setTimesheets] = useState(null);
  const [clients, setClients] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [allFiltersClear, setAllFiltersClear] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [providerInfo, setProviderInfo] = useState([]);
  const [clientInfo, setClientInfo] = useState([]);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);
  const [recruitersData, setRecruitersData] = useState([]);
  const [page, setPage] = useState(0);
  const [alignment, setAlignment] = useState("this_week");
  const [filters, setFilters] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  // ==================== get client information =================
  const getClients = async () => {
    const response = await dispatch(fetchClientsInfo());
    setIsLoading(false);
    setClientInfo(response?.payload);
  };
  // ======================= get providers =====================
  const getProviders = async () => {
    const response = await dispatch(fetchProvidersInfo());
    setProviderInfo(response?.payload);
  };
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );

  useEffect(() => {
    getClients();
    getProviders();
    dispatch(fetchMedicalSpecialities());
    dispatch(fetchProviderRoles());
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setAllSpecialitiesOptions(selectOptions(medicalSpecialities));
  }, []);
  // =======================providers options====================
  const filterExistingProvider = providerInfo?.map((option) => ({
    value: option.id,
    label: option.name,
    // label: `${option.email} - (${option?.name})`,
  }));
  // =======================client options====================
  const clientOptions = clientInfo?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

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
    { name: "shift_id" },
    { name: "provider_name" },
    { name: "client_name" },
    { name: "role " },
    { name: "speciality" },
    { name: "date" },
    { name: "start_time" },
    { name: "end_time" },
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
      search: searchKeyword || "",
      client: filters?.[0]?.client || "",
      status: filters?.[0]?.jobStatus || "",
      provider_name: filters?.[0]?.provider_name || "",
      role: filters?.[0]?.role || "",
      speciality: filters?.[0]?.speciality || "",
      end_date: filters?.[0]?.end_date || "",
      from_date: filters?.[0]?.from_date || "",
      start_time: filters?.[0]?.start_time || "",
      end_time: filters?.[0]?.end_time || "",

      type: typeFilter,
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
      const resp = await API.post(`/api/shifts-export`, bodyData);
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

  const getTimesheets = async (filterStatus = null, isClear = false) => {
    let status;
    if (filterStatus) {
      setFilters([filterStatus]);
      status = filterStatus;
    }
    if (isClear) {
      status = null;
    }
    if (!isClear && filterStatus == null) {
      status = filters?.[0];
    }
    setIsLoading(true);

    // Calculate date ranges for new and existing filters
    let from_date = status?.from_date || "";
    let end_date = status?.end_date || "";
    const today = new Date();
    if (!from_date && !end_date) {
      switch (typeFilter) {
        case "this_week": {
          from_date = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
          end_date = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
          break;
        }
        case "last_week": {
          const lastWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7);
          const lastWeekEnd = addDays(endOfWeek(today, { weekStartsOn: 1 }), -7);
          from_date = format(lastWeekStart, "yyyy-MM-dd");
          end_date = format(lastWeekEnd, "yyyy-MM-dd");
          break;
        }
        case "15_days": {
          from_date = format(addDays(today, -15), "yyyy-MM-dd");
          end_date = format(today, "yyyy-MM-dd");
          break;
        }
        case "last_month": {
          const lastMonth = addMonths(today, -1);
          from_date = format(startOfMonth(lastMonth), "yyyy-MM-dd");
          end_date = format(endOfMonth(lastMonth), "yyyy-MM-dd");
          break;
        }
        case "3_months": {
          from_date = format(addMonths(today, -3), "yyyy-MM-dd");
          end_date = format(today, "yyyy-MM-dd");
          break;
        }
        case "next_week": {
          const nextWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), 7);
          const nextWeekEnd = addDays(endOfWeek(today, { weekStartsOn: 1 }), 7);
          from_date = format(nextWeekStart, "yyyy-MM-dd");
          end_date = format(nextWeekEnd, "yyyy-MM-dd");
          break;
        }
        case "upcoming_month": {
          const nextMonth = addMonths(today, 1);
          from_date = format(startOfMonth(nextMonth), "yyyy-MM-dd");
          end_date = format(endOfMonth(nextMonth), "yyyy-MM-dd");
          break;
        }
        case "upcoming_3_months": {
          const nextMonth = addMonths(today, 1);
          const threeMonthsLater = addMonths(today, 3);
          from_date = format(startOfMonth(nextMonth), "yyyy-MM-dd");
          end_date = format(endOfMonthFn(threeMonthsLater), "yyyy-MM-dd");
          break;
        }
        case "all":
        default:
          from_date = "";
          end_date = "";
      }
    }
    try {
      const params = {
        page: searchKeyword ? (page + 1 > 1 ? page + 1 : 1) : page + 1,
        search: searchKeyword,
        type: typeFilter,
        paginate: rowsPerPage,
        provider_name: status?.provider_name,
        client: status?.client ? +status?.client : "",
        role: status?.role,
        recruiter_id: status?.recruiter,
        speciality: status?.speciality,
        from_date,
        end_date,
        start_time: status?.start_time,
        end_time: status?.end_time,
      };
      const resp = await API.get("/api/get-schedules", { params });
      if (resp?.data?.success) {
        setTimesheets(resp?.data?.data);
        setAllFiltersClear(false);
        setIsLoading(false);
        setClients(resp?.data?.clients);
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTimesheets();
    dispatch(removeCurrentClient());
  }, [page, rowsPerPage, typeFilter]);
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const buttonTab = [
    { label: "This week", value: "this_week" },
    { label: "Last week", value: "last_week" },
    { label: "Last 15 days", value: "15_days" },
    { label: "Last month", value: "last_month" },
    { label: "Last 3 months", value: "3_months" },
    { label: "Next week", value: "next_week" },
    { label: "Upcoming Month", value: "upcoming_month" },
    { label: "Upcoming 3 Months", value: "upcoming_3_months" },
    { label: "All times", value: "all" },
  ];

  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  const handleFilterBtnsClick = (btnValue) => {
    setTypeFilter(btnValue);
    handleClearFilters();
    // getTimesheets(   );
  };
  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;
      getTimesheets(updatedFilters?.[0]);
      return updatedFilters;
    });
  };
  const handleClearFilters = () => {
    setFilters([]);
    getTimesheets(null, true);
    setSearchKeyword("");
  };
  if (permissions?.includes("read schedules info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />

        <ExportDrawer
          open={exportDrawerOpen}
          onClose={() => setExportDrawerOpen(false)}
          columns={columns}
          onExport={handleExport}
          title="Export Client Jobs"
        />
        {/* //======================------------------------- */}
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Breadcrumb items={breadcrumbItems} title={"Shifts"}>
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
                  onClick={() => {
                    handleFilterBtnsClick(item?.value);
                  }}
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <StyledTabs
          value={viewMode}
          onChange={(e, v) => setViewMode(v)}
              
          variant="scrollable"
          aria-label="scrollable tabs"
          scrollButtons={false}
        >
             <StyledTab label="List view" value="list" sx={{ minHeight: 0, height: 36 }} />
                <StyledTab label="Calendar view" value="calendar" sx={{ minHeight: 0, height: 36 }} />
        </StyledTabs>
            
            </Box>
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
                  placeholder="Search provider or client"
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
                    borderBottom: "1px solid",
                    borderColor:
                      darkMode === "dark"
                        ? "rgba(255, 255, 255, .7)"
                        : "rgba(231, 234, 243, .7)",

                    "& .MuiInputBase-input::placeholder": {
                      color:
                        darkMode === "dark"
                          ? "rgba(255, 255, 255, .5)"
                          : "rgb(0, 0, 0)",
                      fontSize: "12.64px",
                      lineHeight: "15.3px",
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                    },
                  }}
                />
                <Box>
                  {permissions?.includes("export schedules info") ? (
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

                  {permissions?.includes("read schedules info") ? (
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
                          Clear Filters{" "}
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

              {/* ==================================filter chips============================== */}
              {filters?.length > 0 && (
                <Box
                  sx={{
                    flexGrow: 1,
                    mt: 3,
                    px: 2,
                  }}
                >
                  {filters.map((filter, filterIndex) => (
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        flexWrap: "wrap",
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
                                    ...flxCntrSx,
                                    gap: 0.5,
                                    color: "#1E2022",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {key.replace("_", " ")}
                                  &nbsp;:&nbsp;
                                  {key === "provider_name"
                                    ? filterExistingProvider?.find(
                                        (item) => item.value == value
                                      )?.label
                                    : key === "recruiter"
                                    ? recruitersData?.find(
                                        (spc) => spc.id == value
                                      )?.name
                                    : key === "client"
                                    ? clientOptions?.find(
                                        (item) => item.value == value
                                      )?.label
                                    : key === "jobStatus"
                                    ? value == 1
                                      ? "Complete"
                                      : value == 3
                                      ? "All"
                                      : "In progress"
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
                                    onClick={() =>
                                      handleRemove(filterIndex, key)
                                    }
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
                        <ClearFilterDesign
                          mb={1}
                          clearFilters={handleClearFilters}
                        />
                      ) : (
                        ""
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              {/* ===================================== table ============================ */}
              {viewMode === "list" ? (
                isLoading ? (
                  <Box sx={{ textAlign: "center", mx: "auto" }}>
                    <SkeletonRow column={9} />
                    <SkeletonRow column={9} />
                    <SkeletonRow column={9} />
                    <SkeletonRow column={9} />
                  </Box>
                ) : (
                  <SchedulesTable
                    timesheets={timesheets}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    darkMode={darkMode}
                  />
                )
              ) : (
                <Box sx={{ p: 2 }}>
                  <Calendar
                    localizer={localizer}
                    events={
                      (timesheets && Array.isArray(timesheets.data) ? timesheets.data : []).map((item) => ({
                        id: item.id,
                        title: `${item.provider_name || ""} (${item.start_time || ""} - ${item.end_time || ""})`,
                        start: new Date(`${item.date}T${item.start_time}`),
                        end: new Date(`${item.date}T${item.end_time}`),
                        allDay: false,
                        details: item,
                      }))
                    }
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    onSelectEvent={(event) => {
                      setCalendarEvent(event.details);
                      setCalendarDialogOpen(true);
                    }}
                    components={{ toolbar: CalendarToolbar }}
                    eventPropGetter={() => ({ style: { marginTop: 18 } })}
                  />
                  <Dialog open={calendarDialogOpen} onClose={() => setCalendarDialogOpen(false)}>
                    <DialogTitle>Shift Details</DialogTitle>
                    <DialogContent>
                      {calendarEvent && (
                        <Box sx={{ minWidth: 350, p: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Shift ID: <span style={{ fontWeight: 400 }}>{calendarEvent.id || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Provider Name: <span style={{ fontWeight: 400 }}>{calendarEvent.job?.name || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Recruiter: <span style={{ fontWeight: 400 }}>{calendarEvent.job?.provider?.recruiter?.name || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Role: <span style={{ fontWeight: 400 }}>{calendarEvent.job?.role?.name || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Speciality: <span style={{ fontWeight: 400 }}>{calendarEvent.job?.speciality?.name || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Client Name: <span style={{ fontWeight: 400 }}>{calendarEvent.job?.client_name || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Date: <span style={{ fontWeight: 400 }}>{calendarEvent.date || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Start Time: <span style={{ fontWeight: 400 }}>{calendarEvent.start_time || "--"}</span>
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            End Time: <span style={{ fontWeight: 400 }}>{calendarEvent.end_time || "--"}</span>
                          </Typography>
                        </Box>
                      )}
                    </DialogContent>
                  </Dialog>
                </Box>
              )}
            </Box>

            <Filter
              filterExistingProvider={filterExistingProvider}
              filterProviderRolesList={filterProviderRolesList}
              allSpecialitiesOptions={allSpecialitiesOptions}
              clientOptions={clientOptions}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              filters={filters}
              toggleDrawer={toggleDrawer}
              getTimesheets={getTimesheets}
              setFilters={setFilters}
              countAppliedFilters={countAppliedFilters}
              recruitersData={recruitersData}
              setRecruitersData={setRecruitersData}
            />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default Schedules;
