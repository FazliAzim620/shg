import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  Link,
  Divider,
  MenuItem,
  TextField,
  Menu,
  InputAdornment,
  Paper,
  IconButton,
} from "@mui/material";

import pdficon from "../../../assets/pdf-icon.svg";
import csvIcon from "../../../assets/csv.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Close,
  ExpandMoreOutlined,
  FilterList,
  KeyboardBackspaceOutlined,
  SaveAltOutlined,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import businessIcon from "../../../assets/business.svg";
import ScrollableTabBar from "../../../components/client-module/ScrollableTabBar";
import SkeletonRow from "../../../components/SkeletonRow";
import Header from "../../../components/Header";
import API from "../../../API";
import ClientsProviderTable from "./ClientsProviderTable";
import SearchIcon from "@mui/icons-material/Search";
import ClientProviderFilters from "./ClientProviderFilters";
import { selectOptions } from "../../../util";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
} from "../../../thunkOperation/job_management/states";
import { useDispatch } from "react-redux";
import ClearFilterDesign from "../../../components/common/filterChips/ClearFilterDesign";
import ExportDrawer from "../../../components/common/ExportDrawer";
import { checkGetReadyExport } from "../../../api_request";
import ExportAlert from "../../../components/common/ExportAlert";
import NoPermissionCard from "../../../components/common/NoPermissionCard";

const ProvidersTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [clientsProvidersData, setClientsProvidersData] = useState(null);
  const [activeTab, setActiveTab] = useState("Providers");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const isExportMenuOpen = Boolean(exportAnchorEl);
  const [activeTab1, setActiveTab1] = useState(3);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [rowsPerPage, setRowsPerPage] = useState(
    sessionStorage.getItem("per_page") > 0
      ? sessionStorage.getItem("per_page")
      : clientsProvidersData?.per_page || 20
  );
  //   -----------------------------------------------------------------------

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allFiltersClear, setAllFiltersClear] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getClientsProvider = async (status = null) => {
    setIsLoading(true);
    if (status) {
      setFilters([status]);
    }
    try {
      const params = {
        paginate: status?.rowsPerPage || rowsPerPage,
        page: searchTerm ? 1 : status?.currentPage || pagination.currentPage,
        search: searchTerm,
        provider_name: status?.provider_name,
        role: status?.role,
        speciality: status?.speciality,
        department: status?.department,
        // credentialing_issues: status?.credentialing_issues,
      };

      const url = `/api/get-client-providers/${param.id}`;
      const resp = await API.get(url, { params });

      if (resp?.data?.success) {
        setClientsProvidersData(resp?.data?.data?.data);
        setPagination({
          currentPage: resp?.data?.data?.current_page,
          lastPage: resp?.data?.data?.last_page,
          total: resp?.data?.data?.total,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [clientProviders, setClientProviders] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
  const getClientProvidersList = async () => {
    try {
      const resp = await API.get(`/api/get-client-providers-list/${param.id}`);

      if (resp?.data?.success) {
        setClientProviders(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getClientProvidersList();
    getClientsProvider();
    dispatch(fetchMedicalSpecialities());
    dispatch(fetchProviderRoles());
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setAllSpecialitiesOptions(selectOptions(medicalSpecialities));
  }, [page, rowsPerPage, allFiltersClear]);

  // =======================providers options====================
  const filterExistingProvider = clientProviders?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  // ============================================================
  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  //   -----------------------------------------------------------------------

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
  //------------------------------------- Handlers for filter Menu

  const handleFilterClick = (event) => {
    setIsDrawerOpen(true);
  };

  // ============================search export filter==================

  // ====================handleSearchChange=================
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ====================handle select all checkboxes=================
  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;
      getClientsProvider(updatedFilters?.[0]);
      return updatedFilters;
    });
  };
  const handleClearFilters = () => {
    setFilters([]);
    getClientsProvider();
  };
  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "full_name" },
    { name: "role " },
    { name: "speciality" },
    { name: "facility_location" },
    { name: "department" },
    { name: "credentialing_issues" },
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
      provider_name: filters?.[0]?.provider_name || "",
      speciality: filters?.[0]?.speciality || "",
      role: filters?.[0]?.role || "",
      department: filters?.[0]?.department,
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
      const resp = await API.post(
        `/api/client-providers-export/${param.id}`,
        bodyData
      );
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

  if (permissions?.includes("read clients providers")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <ExportDrawer
          open={exportDrawerOpen}
          onClose={() => setExportDrawerOpen(false)}
          columns={columns}
          onExport={handleExport}
          title="Export Client Providers"
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
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 1.2,
                color: "text.black",
              }}
            >
              Providers
            </Typography>
            <Paper
              sx={{
                mb: 5,
                width: "100%",
                overflow: "hidden",
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
              }}
            >
              {" "}
              {/*============== serch,filter and export ================ */}
              {/* {clientsProvidersData?.length > 0 && (
            )}{" "} */}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={() => getClientsProvider(null)}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getClientsProvider(null);
                    }
                  }}
                  sx={{
                    borderBottom: "1px solid ",
                    borderColor:
                      darkMode === "dark"
                        ? "rgba(255, 255, 255, .7)"
                        : "rgba(231, 234, 243, .7)",
                  }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  {/* ---------------------------------------------------- filter dropdown */}
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

                  {/* ---------------------------------------------------- filter dropdown end */}
                </Box>
              </Box>
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
                              {key.replace("_", " ")} &nbsp;:&nbsp;
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
                    <ClearFilterDesign
                      mb={1}
                      clearFilters={handleClearFilters}
                    />
                  ) : (
                    ""
                  )}
                </Box>
              ))}
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
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                  <SkeletonRow column={9} />
                </Box>
              ) : (
                <ClientsProviderTable
                  searchTerm={searchKeyword}
                  providersData={clientsProvidersData}
                  getProviders={getClientsProvider}
                  pagination={pagination}
                  setPagination={setPagination}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  darkMode={darkMode}
                  isLoading={isLoading}
                  filters={filters}
                />
                // <ClientsProviderTable
                //   searchTerm={searchKeyword}
                //   providersData={clientsProvidersData}
                //   getProviders={getClientsProvider}
                //   pagination={pagination}
                //   setPagination={setPagination}
                //   rowsPerPage={rowsPerPage}
                //   setRowsPerPage={setRowsPerPage}
                //   darkMode={darkMode}
                //   isLoading={isLoading}
                //   filters={filters}
                // />
              )}
            </Paper>
            <ClientProviderFilters
              isDrawerOpen={isDrawerOpen}
              setFilters={setFilters}
              setIsDrawerOpen={setIsDrawerOpen}
              filterExistingProvider={filterExistingProvider}
              filterProviderRolesList={filterProviderRolesList}
              allSpecialitiesOptions={allSpecialitiesOptions}
              countAppliedFilters={countAppliedFilters}
              getClientsProvider={getClientsProvider}
            />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ProvidersTab;
