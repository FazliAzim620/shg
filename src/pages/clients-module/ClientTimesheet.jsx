import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  Link,
  Divider,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Menu,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Comment,
  Delete,
  ExpandMoreOutlined,
  FilterList,
  KeyboardBackspaceOutlined,
  SaveAltOutlined,
  SearchOutlined,
  Share,
} from "@mui/icons-material";
import Header from "../../components/Header";

import { Link as RouterLink } from "react-router-dom";
import businessIcon from "../../assets/business.svg";
import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
import ActionMenu from "../../components/client-module/ActionMenu";
import TimesheetsTable from "../time-sheet/TimesheetsTable";
import Filter from "../time-sheet/Filter";
import API from "../../API";
import SkeletonRow from "../../components/SkeletonRow";
import { SearchIcon } from "../../components/post-job/PostedJobsIcons";
import ExportDrawer from "../../components/common/ExportDrawer";
import { checkGetReadyExport } from "../../api_request";
import ExportAlert from "../../components/common/ExportAlert";
import NoPermissionCard from "../../components/common/NoPermissionCard";
const ClientTimesheet = () => {
  const navigate = useNavigate();
  const param = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Timesheet");
  const [activeTab1, setActiveTab1] = useState(5);
  const [timesheets, setTimesheets] = useState(null);
  //   -----------------------------------------------------------------------
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
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
  const [filters, setFilters] = useState({
    client: "",
    actionRequired: [],
    invoiceStatus: [],
    timesheetStatus: "",
    clientApproval: "",
  });

  const handlePageChange = (event, newPage) => {
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPagination((prev) => ({
      ...prev,
      perPage: parseInt(event.target.value, 10),
    }));
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
      client: param.id || "",
      actionRequired: filters.actionRequired.join(","),
      invoiceStatus: filters.invoiceStatus.join(","),
      timesheetStatus: filters.timesheetStatus,
      clientApproval: filters.clientApproval,
      data_type: "client_timesheet",
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

  // =========---------------------------------------------------------------------------- Export function  end

  const getTimesheets = async (status, next = false) => {
    setIsLoading(true);
    try {
      const params = {
        page: searchKeyword ? 1 : next ? next : pagination?.currentPage,
        paginate: rowsPerPage,
        client: param.id,
        actionRequired: filters.actionRequired.join(","),
        invoiceStatus: filters.invoiceStatus.join(","),
        timesheetStatus: !next && status ? status : filters.timesheetStatus,
        clientApproval: filters.clientApproval,
        search: searchKeyword,
        data_type: "client_timesheet",
      };

      const resp = await API.get("/api/get-timesheets", { params });
      setTimesheets(resp?.data?.data);
      setIsLoading(false);
      setClients(resp?.data?.clients);
      setIsDrawerOpen(false);
      setPage(resp?.data?.data?.current_page);
      setPagination({
        currentPage: resp?.data?.data?.current_page,
        lastPage: resp?.data?.data?.last_page,
        perPage: resp?.data?.data?.per_page,
        total: resp?.data?.data?.total,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  useEffect(() => {
    getTimesheets();
  }, [rowsPerPage, allFiltersClear]);

  const countAppliedFilters = () => {
    return Object?.values(filters)?.reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length;
      }
      return count + (filter ? 1 : 0);
    }, 0);
  };

  const breadcrumbItems = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "Clients", href: "/clients" },
      {
        text: currentClient?.name,
        href: `/client/${currentClient?.name
          ?.toLowerCase()
          ?.replace(/ /g, "-")}/${param.id}`,
      },
      { text: activeTab },
    ],
    [currentClient, activeTab, param.id]
  );

  const handleTopTabChange = (newValue) => {
    setActiveTab1(newValue);
  };
  if (permissions?.includes("read clients timesheets")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <ExportDrawer
          open={exportDrawerOpen}
          onClose={() => setExportDrawerOpen(false)}
          columns={columns}
          onExport={handleExport}
          title="Export Client Timesheets"
        />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
            mb: 2,
          }}
        >
          <Box pt={6} px={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src={businessIcon}
                  alt="logo"
                  sx={{ width: "3rem" }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "21px",
                      color: "text.black",
                    }}
                  >
                    {currentClient?.name}
                  </Typography>
                  <Breadcrumbs aria-label="breadcrumb">
                    {breadcrumbItems.map((item, index) =>
                      index === breadcrumbItems.length - 1 ? (
                        <Typography
                          key={item.text}
                          sx={{
                            color: "text.black",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            pt: 0.2,
                          }}
                        >
                          {item.text}
                        </Typography>
                      ) : (
                        <Link
                          component={RouterLink}
                          to={item.href}
                          key={item.text}
                          underline="hover"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            "&:hover": { color: "text.link" },
                          }}
                        >
                          {item.text}
                        </Link>
                      )
                    )}
                  </Breadcrumbs>
                </Box>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/clients")}
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
                    boxShadow: "none",
                    color: "text.btn_blue",
                    textTransform: "inherit",
                    // mr: 3,
                    py: 1,
                    fontWeight: 400,
                    "&:hover": {
                      color: "#fff",
                      boxShadow: "none",
                      bgcolor: "background.btn_blue",
                    },
                  }}
                >
                  <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                  Back to clients
                </Button>
                {/* <ActionMenu
                  menuItems={menuItems}
                  background={darkMode === "dark" ? "background.paper" : "#fff"}
                  padding={1.2}
                /> */}
              </Box>
            </Box>
          </Box>

          <ScrollableTabBar
            activeTab={activeTab1}
            onTabChange={handleTopTabChange}
          />
          <Divider sx={{ opacity: 0.3 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 4,
              mx: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 5,
                color: "text.black",
              }}
            >
              Timesheet{" "}
            </Typography>
            <Box
              display="flex"
              borderRadius={"10px 10px 0 0"}
              justifyContent="space-between"
              alignItems="center"
              px={2}
              pt={2}
              sx={{ bgcolor: "background.paper" }}
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
                      darkMode === "dark" ? "rgba(255, 255, 255, .7)" : "black",
                    fontSize: "12.64px",
                    lineHeight: "15.3px",
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                  },
                }}
              />
              <Box>
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
              </Box>
            </Box>
            <Box sx={{ bgcolor: "background.paper", px: 2 }}>
              {isExportLoading && (
                <ExportAlert severity={"info"} message={exportMessage} />
              )}
              {isExportSuccess && (
                <ExportAlert severity={"success"} message={exportMessage} />
              )}
            </Box>
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
            <Filter
              hideClient={true}
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

export default ClientTimesheet;
