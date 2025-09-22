import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import underConstructionImage from "../assets/svg/design-system/docs-datatables.svg";
import Breadcrumb from "../components/BreadCrumb";
import { Add, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import CreateJobModal from "../components/job-component/CreateJobModal";
import NoPermissionCard from "../components/common/NoPermissionCard";

import {
  fetchJobsData,
  fetchMedicalSpecialities,
  fetchProviderRoles,
  fetchProvidersInfo,
  fetchStates,
} from "../thunkOperation/job_management/states";
import { useDispatch, useSelector } from "react-redux";
import JobTable from "../components/job-component/JobTable";
import { removeNewUser } from "../feature/jobSlice";
import { removeData } from "../feature/clientSlice";
import { resetFields } from "../feature/budgetPreferenceSlice";
import { resetClientConfirmationFields } from "../feature/clientConfirmationLetter";
import { resetSchedules } from "../feature/shiftSchedulesSlice";
import { selectOptions } from "../util";
import FilterDrawer from "./clients-module/FilterDrawer";
import ClearFilterDesign from "../components/common/filterChips/ClearFilterDesign";

const JobManagement = () => {
  const { jobsTableData, isLoading } = useSelector((state) => state.job);
  const { state } = useLocation();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const [providerInfo, setProviderInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterProviderRolesList, setfilterProviderRolesList] = useState([]);
  const [allSpecialitiesOptions, setAllSpecialitiesOptions] = useState([]);
  const [filters, setFilters] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Assignment Managementt" },
  ];
  // =======================get provider infromation=====================
  const getProviders = async () => {
    const response = await dispatch(fetchProvidersInfo());
    setProviderInfo(response?.payload);
  };

  useEffect(() => {
    getProviders();
  }, []);
  useEffect(() => {
    if (state?.from === "service provider") {
      setIsModalOpen(true);
    }
  }, [state]);
  const getJobData = (status = null) => {
    if (status) {
      setFilters([status]);
    }
    const per_page = localStorage.getItem("per_page");
    const param = {
      filter: true,
      perpage: per_page || 20,
      page: 1,
      // client_id: params.id,  0
      status: status?.jobStatus === undefined ? "" : status.jobStatus,
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
    getJobData();
    dispatch(resetClientConfirmationFields());
    dispatch(fetchStates());
    dispatch(removeData());
    dispatch(fetchProviderRoles());
    dispatch(fetchMedicalSpecialities());
    dispatch(resetFields());
    dispatch(resetSchedules());
  }, [dispatch]);
  useEffect(() => {
    dispatch(removeNewUser());
    localStorage.removeItem("order_job");
  }, []);
  const { newUserData } = useSelector((state) => state.job);

  const filterExistingProvider = providerInfo?.map((option) => ({
    value: option.id,
    // label: option.email,
    label: `${option.email} - (${option?.name})`,
  }));
  const filterProvider = providerInfo?.map((option) => ({
    value: option.id,
    // label: option.email,
    label: ` ${option?.name}`,
  }));

  const renderContent = () => {
    if (
      (!jobsTableData || jobsTableData?.data?.length === 0) &&
      !isLoading &&
      filters.length === 0 &&
      !searchTerm
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
            Empty in Assignment Management.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Create a new job and it will show up here.
          </Typography>
          {permissions?.includes("create assignment management info") ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
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
              Create new job
            </Button>
          ) : (
            ""
          )}
        </Box>
      );
    } else {
      return (
        <JobTable
          jobs={jobsTableData}
          isLoading={isLoading}
          toggleDrawer={toggleDrawer}
          countAppliedFilters={countAppliedFilters}
          handleRemove={handleRemove}
          filters={filters}
          filterProvider={filterProvider}
          allSpecialitiesOptions={allSpecialitiesOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearFilterHandler={clearFilterHandler}
          filterProviderRolesList={filterProviderRolesList}
        />
      );
    }
  };
  // ------------------------------------------------------------------------ filter

  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );

  useEffect(() => {
    setfilterProviderRolesList(selectOptions(providerRolesList));
    setAllSpecialitiesOptions(selectOptions(medicalSpecialities));
  }, []);
  const countAppliedFilters = () => {
    if (filters.length > 0) {
      return Object.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };

  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;

      // After updating the filters, call getJobData with the updated filters
      getJobData(updatedFilters?.[0]); // or updatedFilters based on your needs
      return updatedFilters;
    });
  };
  const clearFilterHandler = () => {
    setFilters([]);
    getJobData();
  };

  // ------------------------------------------------------------------------ filter end

  if (permissions?.includes("create job management info")) {
    return (
      <Box
        sx={{
          overflowX: "hidden",
          bgcolor: "background.page_bg",
        }}
      >
        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Breadcrumb
            isLoading={isLoading}
            items={breadcrumbItems}
            title={"Assignment Management"}
            jobs={jobsTableData}
            showJobButton={
              permissions?.includes("create job management info")
                ? jobsTableData?.data
                : ""
            }
            handleOpenModal={handleOpenModal}
          />

          <Box
            sx={{
              flexGrow: 1,
              py: 4,
              px: 2,
              m: "0 auto",
            }}
          >
            {renderContent()}
          </Box>
        </Box>
        <CreateJobModal
          providerInfo={providerInfo}
          filterExistingProvider={filterExistingProvider}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
        <FilterDrawer
          filterExistingProvider={filterProvider}
          filterProviderRolesList={filterProviderRolesList}
          allSpecialitiesOptions={allSpecialitiesOptions}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          filters={filters}
          toggleDrawer={toggleDrawer}
          setFilters={setFilters}
          getJobsHandler={getJobData}
          countAppliedFilters={countAppliedFilters}
          handleRemove={handleRemove}
        />
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default JobManagement;
