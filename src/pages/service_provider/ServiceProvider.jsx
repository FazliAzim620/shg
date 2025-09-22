import {
  Box,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProviderTable from "../../components/provider/ProviderTable";
import { useEffect, useState } from "react";
import {
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchProvidersInfo,
  fetchStates,
} from "../../thunkOperation/job_management/states";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { PersonAddAlt1 } from "@mui/icons-material";
import ProviderTabelCards from "../../components/provider/ProviderTabelCards";
import CreateJobModal from "../../components/job-component/CreateJobModal";
import API from "../../API";
import WidgetCardSkeleton from "../../components/common/WidgetCardSkeleton";
import NoPermissionCard from "../../components/common/NoPermissionCard";

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const ServiceProvider = () => {
  const [providerInfo, setProviderInfo] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [addProvider, setAddProvider] = useState(false);
  const darkMode = useSelector((state) => state.theme.mode);
  const [providersCount, setProvidersCount] = useState(null);
  const [typeFilter, setTypeFilter] = useState(30);
  const [alignment, setAlignment] = useState(30);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });
  const [rowsPerPage, setRowsPerPage] = useState(
    sessionStorage.getItem("per_page") > 0
      ? sessionStorage.getItem("per_page")
      : providerInfo?.per_page || 20
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const searchKeywordHandler = (searchWord) => {
    setSearchKeyword(searchWord);
  };

  // =======================get provider information===================
  const getProviders = async (data, filterData = null) => {
    setIsLoading(true);
    const obj = {
      rowsPerPage: rowsPerPage,
      currentPage: searchKeyword ? 1 : pagination.currentPage,
      search: searchKeyword,
      tab: value === 1 ? "unscheduled" : "scheduled",
      days: typeFilter,
    };
    const response = await dispatch(
      fetchProvidersInfo(data ? data : filterData ? filterData : obj)
    );
    if (response) {
      setIsLoading(false);
      setPagination({
        currentPage: response?.payload?.current_page,
        lastPage: response?.payload?.last_page,
        perPage: response?.payload?.per_page,
        total: response?.payload?.total,
      });
    }
    setProviderInfo(response?.payload);
  };
  const getProviderCountsHandlder = async () => {
    try {
      const resp = await API.get("/api/providers-widgets");
      if (resp?.data?.success) {
        setProvidersCount(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProviderCountsHandlder();
    dispatch(fetchProviderRoles());
    dispatch(fetchMedicalSpecialities());
    dispatch(fetchStates());
    getProviders();
  }, [rowsPerPage, searchKeyword, value, typeFilter]);
  const handleCloseModal = () => {
    setAddProvider(null);
  };
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Service Provider" },
  ];

  const handleFilterBtnsClick = (btnValue) => {
    setTypeFilter(btnValue);
    // handleClearFilters();
    // getTimesheets(   );
  };
  const buttonTab = [
    { label: "30 days", value: 30 },
    { label: "60 days", value: 60 },
    { label: "90 days", value: 90 },
  ];
  if (permissions?.includes("read service providers info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <CreateJobModal
          open={addProvider}
          onClose={handleCloseModal}
          from={"service_provider"}
          getTableProviders={getProviders}
          getProviderCountsHandlder={getProviderCountsHandlder}
        />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
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
            <Breadcrumb items={breadcrumbItems} title={"Service Provider"} />
            {value === 1 ? (
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
            ) : (
              ""
            )}
            {permissions?.includes("create service providers info") &&
            value === 0 ? (
              <Button
                onClick={() => setAddProvider(true)}
                variant="contained"
                startIcon={<PersonAddAlt1 />}
                sx={{ textTransform: "none", bgcolor: "background.btn_blue" }}
              >
                Add provider
              </Button>
            ) : (
              ""
            )}
          </Box>
          <Box sx={{ mt: 4 }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "14px",
                        fontWeight: 600,
                        color:
                          value !== 0 && darkMode == "dark"
                            ? "rgba(255, 255, 255, .7)"
                            : "text.primary",
                      }}
                    >
                      All providers
                    </Typography>
                  </Box>
                }
                {...a11yProps(0)}
                sx={{ pb: 2.25 }}
              />
              <Tab
                label={
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                      fontWeight: 600,
                      color:
                        value !== 1 && darkMode == "dark"
                          ? "rgba(255, 255, 255, .7)"
                          : "text.primary",
                    }}
                  >
                    Unscheduled providers{" "}
                  </Typography>
                }
                {...a11yProps(1)}
                sx={{
                  textTransform: "capitalize",
                  fontSize: "14px",
                  fontWeight: 400,
                  color:
                    darkMode == "dark" ? "rgba(255, 255, 255, .7)" : "#132144",
                  pb: 2.25,
                }}
              />
            </Tabs>
            <Divider sx={{ opacity: 0.5 }} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              pb: 4,
              px: 2,
              //   width: { sm: "100%", md: "70%", xl: "55%" },
              m: "0 auto",
            }}
          >
            <Box sx={{ textAlign: "center", mt: 4.5 }}>
              {value === 1 ? (
                ""
              ) : isLoading ? (
                <WidgetCardSkeleton total_cards={3} array_length={4} />
              ) : (
                <ProviderTabelCards providersCount={providersCount} />
              )}

              <ProviderTable
                setAddProvider={setAddProvider}
                getProviders={getProviders}
                getProviderCountsHandlder={getProviderCountsHandlder}
                providersData={providerInfo}
                pagination={pagination}
                setPagination={setPagination}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                darkMode={darkMode}
                isLoading={isLoading}
                searchKeywordHandler={searchKeywordHandler}
                permissions={permissions}
                value={value}
                typeFilter={typeFilter}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ServiceProvider;
