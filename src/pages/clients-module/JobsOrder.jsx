import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import businessIcon from "../../assets/business.svg";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Header from "../../components/Header";
import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
import SkeletonRow from "../../components/SkeletonRow";
import { useSelector, useDispatch } from "react-redux";
import JobTable from "../../components/job-component/JobTable";
import {
  fetchClientsInfo,
  fetchJobsData,
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchProvidersInfo,
} from "../../thunkOperation/job_management/states";
import TableHeader from "../../components/job-component/TableHeader";
import FilterDrawer from "./FilterDrawer";
import { selectOptions } from "../../util";
import { Close, KeyboardBackspaceOutlined } from "@mui/icons-material";
import ClearFilterDesign from "../../components/common/filterChips/ClearFilterDesign";
import NoPermissionCard from "../../components/common/NoPermissionCard";

const JobsOrder = () => {
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jobOrderSearch, setJobOrderSearch] = useState("");
  const darkMode = useSelector((state) => state.theme.mode);
  const { jobsTableData, isLoading } = useSelector((state) => state.job);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Job Orders");
  const [activeTab1, setActiveTab1] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [providerInfo, setProviderInfo] = useState([]);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);
  const [filters, setFilters] = useState([]);
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
  // =======================providers options====================

  const breadcrumbItems = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "Clients", href: "/clients" },
      {
        text: currentClient?.name,
        href: `/client/${currentClient?.name
          ?.toLowerCase()
          ?.replace(/ /g, "-")}/${params.id}`,
      },
      { text: activeTab },
    ],
    [currentClient, activeTab, params.id]
  );

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };

  // ---------------------------------------------------- filter end

  const handleTopTabChange = (newValue) => {
    setActiveTab1(newValue);
  };

  const getJobsHandler = (status = null) => {
    if (status) {
      setFilters([status]);
    }
    const per_page = localStorage.getItem("per_page");
    const param = {
      filter: true,
      perpage: per_page || 20,
      page: 1,
      client_id: params.id,
      status: status?.jobStatus || 3,
      provider_name: status?.provider_name || "",
      role: status?.role || "",
      speciality: status?.speciality || "",
      from_date: status?.from_date || "",
      end_date: status?.end_date || "",
      provider_min_rate: status?.min_rate || "",
      provider_max_rate: status?.max_rate || "",
      client_min_rate: status?.client_min_rate || "",
      client_max_rate: status?.client_max_rate || "",
      jobOrder: true,
    };
    dispatch(fetchJobsData(param));
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    getJobsHandler();
  }, [dispatch]);
  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;

      getJobsHandler(updatedFilters?.[0]);

      return updatedFilters;
    });
  };
  const clearFilterHandler = () => {
    setFilters([]);
    getJobsHandler();
  };
  if (permissions?.includes("read clients job order")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
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
          <Divider sx={{ opacity: 0.3 }} />
          <TableHeader
            isLoading={isLoading}
            jobs={jobsTableData}
            jobsOrder={true}
            filter={filters}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 4,
              mx: 1,
              gap: 2,
              mb: 2,
            }}
          >
            {isLoading ? (
              <Box sx={{ textAlign: "center", mx: "auto" }}>
                <SkeletonRow column={9} />
                <SkeletonRow column={9} />
                <SkeletonRow column={9} />
                <SkeletonRow column={9} />
              </Box>
            ) : (
              <JobTable
                jobs={jobsTableData}
                isLoading={isLoading}
                jobsOrder={true}
                jobOrderSearch={jobOrderSearch}
                setJobOrderSearch={setJobOrderSearch}
                toggleDrawer={toggleDrawer}
                countAppliedFilters={countAppliedFilters}
                handleRemove={handleRemove}
                filters={filters}
                filterProvider={filterExistingProvider}
                allSpecialitiesOptions={allSpecialitiesOptions}
                clearFilterHandler={clearFilterHandler}
                filterProviderRolesList={filterProviderRolesList}
              />
            )}
          </Box>
          <FilterDrawer
            filterExistingProvider={filterExistingProvider}
            filterProviderRolesList={filterProviderRolesList}
            allSpecialitiesOptions={allSpecialitiesOptions}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            filters={filters}
            toggleDrawer={toggleDrawer}
            setFilters={setFilters}
            getJobsHandler={getJobsHandler}
            countAppliedFilters={countAppliedFilters}
          />
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default JobsOrder;
