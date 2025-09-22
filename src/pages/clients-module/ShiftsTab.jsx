import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import businessIcon from "../../assets/business.svg";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import {
  Close,
  Comment,
  Delete,
  ExpandMoreOutlined,
  KeyboardBackspaceOutlined,
  SaveAltOutlined,
  SearchOutlined,
  Share,
} from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";

import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
import SkeletonRow from "../../components/SkeletonRow";
import { useSelector } from "react-redux";
import API from "../../API";
import JobTable from "../../components/job-component/JobTable";
import { useDispatch } from "react-redux";
import {
  fetchJobsData,
  fetchProvidersInfo,
} from "../../thunkOperation/job_management/states";
import TableHeader from "../../components/job-component/TableHeader";

import Schedules from "../schedules/Schedules";
import SchedulesTable from "../schedules/SchedulesTable";
import Filter from "../schedules/Filter";
import { formatTo12Hour, selectOptions } from "../../util";
import { flxCntrSx } from "../../components/constants/data";
import ClearFilterDesign from "../../components/common/filterChips/ClearFilterDesign";
import { checkGetReadyExport } from "../../api_request";
import ExportDrawer from "../../components/common/ExportDrawer";
import ExportAlert from "../../components/common/ExportAlert";
import NoPermissionCard from "../../components/common/NoPermissionCard";
const ShiftsTab = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clearallBtn, setClearallBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timesheets, setTimesheets] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Shifts");
  const [activeTab1, setActiveTab1] = useState(2);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [providerInfo, setProviderInfo] = useState([]);
  const [clientInfo, setClientInfo] = useState([]);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [typeFilter, setTypeFilter] = useState("all_times");

  const [page, setPage] = useState(0);
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

  // ------------------------------------------------------------------- filter
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allFiltersClear, setAllFiltersClear] = useState(false);
  const [filters, setFilters] = useState();
  const [recruitersData, setRecruitersData] = useState([]);
  const countAppliedFilters = () => {
    if (filters?.length > 0) {
      return Object?.values(filters?.[0])?.filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
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

  // =======================get providers=====================
  const getProviders = async () => {
    const response = await dispatch(fetchProvidersInfo());
    setProviderInfo(response?.payload);
  };
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );

  useEffect(() => {
    getProviders();
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setAllSpecialitiesOptions(selectOptions(medicalSpecialities));
  }, []);
  // =======================providers options====================
  const filterExistingProvider = providerInfo?.map((option) => ({
    value: option.id,
    label: option.name,
    // label: `${option.email} - (${option?.name})`,
  }));
  // =======================providers options====================
  const clientOptions = clientInfo?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  // ------------------------------------------------------------------- filter end
  const handleTopTabChange = (newValue) => {
    setActiveTab1(newValue);
  };
  const getTimesheets = async (status) => {
    if (status) {
      setFilters([status]);
    }
    setIsLoading(true);
    // if (searchKeyword) {
    //   setPage(1);
    // }
    try {
      const params = {
        client: param.id,
        page: searchKeyword ? (page + 1 > 1 ? page + 1 : 1) : page + 1,
        search: searchKeyword,
        type: typeFilter,
        paginate: rowsPerPage,
        provider_name: status?.provider_name,
        recruiter_id: status?.recruiter,
        role: status?.role,
        speciality: status?.speciality,
        from_date: status?.from_date,
        end_date: status?.end_date,
        start_time: status?.start_time,
        end_time: status?.end_time,
      };

      const resp = await API.get("/api/get-schedules", { params });
      if (resp?.data?.success) {
        setTimesheets(resp?.data?.data);
        setIsLoading(false);
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTimesheets();
  }, [page, rowsPerPage, allFiltersClear, typeFilter]);
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
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
    getTimesheets();
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
      client: param.id || "",
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
  if (permissions?.includes("read clients shift")) {
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
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
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
                  onClick={() => navigate(`/clients`)}
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
                    boxShadow: "none",
                    color: "text.btn_blue",
                    textTransform: "inherit",
                    mr: 3,
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
              </Box>
            </Box>
          </Box>
          <ScrollableTabBar
            activeTab={activeTab1}
            onTabChange={handleTopTabChange}
          />
          <Box mx={1} mb={4}>
            <Divider sx={{ opacity: 0.3 }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 5,
                color: "text.black",
              }}
            >
              Shifts
            </Typography>
            {!isLoading && (
              <Box
                bgcolor={"background.paper"}
                borderRadius={"10px 10px 0 0"}
                display="flex"
                flexDirection={"column"}
                px={2}
              >
                <Box
                  bgcolor={"background.paper"}
                  borderRadius={"10px 10px 0 0"}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  px={2}
                  pt={2}
                >
                  <TextField
                    variant="standard"
                    placeholder="Search provider"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        getTimesheets();
                        setPage(0);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <SearchOutlined
                          fontSize="small"
                          sx={{
                            mr: 1,
                            color:
                              darkMode === "dark"
                                ? "rgba(255, 255, 255, .7)"
                                : "rgba(000, 000, 00, .2)",
                          }}
                        />
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
                        fontSize: "14px",

                        color:
                          darkMode === "dark"
                            ? "rgba(255, 255, 255, .5)"
                            : "rgba(0, 0, 0, .4)",
                        opacity: 1,
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
                      {countAppliedFilters() ? (
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
                  </Box>
                </Box>
                <Box sx={{ px: 2, m: 0, bgcolor: "background.paper" }}>
                  {isExportLoading && (
                    <ExportAlert severity={"info"} message={exportMessage} />
                  )}
                  {isExportSuccess && (
                    <ExportAlert severity={"success"} message={exportMessage} />
                  )}
                </Box>
              </Box>
            )}

            {/* ==================================filter chips============================== */}
            {filters?.length > 0 && (
              <Box
                sx={{
                  bgcolor: "white",
                  flexGrow: 1,
                  pt: 2.5,
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
                                mb: 1,
                                py: 0.5,
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
                                {key.replaceAll("_", " ")}
                                &nbsp;:&nbsp;
                                {key === "provider_name"
                                  ? filterExistingProvider?.find(
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
                                  : key === "recruiter"
                                  ? recruitersData?.find(
                                      (spc) => spc.id == value
                                    )?.name
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
            {isLoading ? (
              <Box sx={{ textAlign: "center", mx: "auto" }}>
                <SkeletonRow column={9} />
                <SkeletonRow column={9} />
                <SkeletonRow column={9} />
                <SkeletonRow column={9} />
              </Box>
            ) : (
              <SchedulesTable
                shiftTab={true}
                timesheets={timesheets}
                page={page}
                rowsPerPage={rowsPerPage}
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                darkMode={darkMode}
              />
            )}
            <Filter
              shiftTab={true}
              filterExistingProvider={filterExistingProvider}
              filterProviderRolesList={filterProviderRolesList}
              allSpecialitiesOptions={allSpecialitiesOptions}
              clientOptions={clientOptions}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              filters={filters}
              toggleDrawer={toggleDrawer}
              getTimesheets={getTimesheets}
              countAppliedFilters={countAppliedFilters}
              setFilters={setFilters}
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

export default ShiftsTab;
