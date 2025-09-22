import {
  Accordion,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSelector } from "react-redux";
import Header from "../../Header";
import Breadcrumb from "../../BreadCrumb";
import ROUTES from "../../../routes/Routes";
import JobDetailsCards from "./JobDetailsCards";
import { HeadingCommon } from "../../../provider_portal/provider_components/settings/profile/HeadingCommon";
import CustomChip from "../../CustomChip";
import ApplicantsTable from "./ApplicantsTable";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ApplicantsListView from "./ApplicantsListView";
import { DeleteConfirmModal as CloseConfirmModal } from "../../handleConfirmDelete";
import { useDispatch } from "react-redux";
// import { applicants } from "../../constants/data";
import BudgetPreferences_postJob from "./BudgetPreferences_postJob";
import {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
} from "../../Images";
import Accordion_ from "../../common/Accordion_";
import CustomToggleButtonGroup from "../../button/CustomToggleButtonGroup";
import ApplicantsKanbanView from "./ApplicantsKanbanView";
import {
  ExpandMoreOutlined,
  SaveAltOutlined,
  FilterList,
  Close,
  Delete,
  Edit,
  RemoveRedEye,
  Download,
} from "@mui/icons-material";
import ApplicantFilters from "./ApplicantFilters";
import { capitalizeFirstLetter } from "../../../util";
import API from "../../../API";
import ClearFilterDesign from "../../common/filterChips/ClearFilterDesign";
import { DeleteConfirmModal as ConfirmModal } from "../../handleConfirmDelete";
import {
  editSelectedJob,
  fetchClientStates,
  resetField,
  setSelectedCountry,
  setSelectedState,
  updateNewUserDataField,
} from "../../../feature/post-job/PostJobSlice";
import PostJobModal from "../PostJobModal";
import { setAlert } from "../../../feature/alert-message/alertSlice";
import AlertMessage from "../../../feature/alert-message/AlertMessage";
import ActionMenu from "../../client-module/ActionMenu";
import ExportDrawer from "../../common/ExportDrawer";
import ExportAlert from "../../common/ExportAlert";
import { checkGetReadyExport } from "../../../api_request";

const PostJobDetail_main = () => {
  const param = useParams();
  const loc = useLocation();
  const selectedJob = loc?.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { countries, newUserData } = useSelector((state) => state.postJob);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { location } = useSelector((state) => state.alert);

  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const deleteModalClose = () => {
    setCloseModalOpen(false);
  };
  const closeJobHandler = async () => {
    setUpdateLoading(true);
    try {
      const resp = await API.post(`/api/update-posted-job-status/${param.id}`, {
        status: "closed",
      });
      if (resp?.data?.success) {
        setUpdateLoading(false);
        setCloseModalOpen(false);
        dispatch(
          setAlert({
            message: "Your job closed successfully ",
            type: "success",
            location: "postedJob",
          })
        );
        dispatch(
          updateNewUserDataField({
            field: "status",
            value: "closed",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const darkMode = useSelector((state) => state?.theme.mode);
  const { airfare, hotel, car, mileage, gas, parking, overbudget, tolls } =
    useSelector((state) => state.postJob);
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Jobs", href: `${ROUTES.jobs}` },
    { text: selectedJob?.id },
  ];
  console.log("selectedJob",selectedJob)
  const budgetData = [
    {
      icon: icon8,
      title: "Airfare",
      message: "Is airfare covered by this client?",
      value: selectedJob?.airfare_covered,
    },
    {
      icon: icon1,
      title: "Hotel",
      message: "Does this client offer hotel accommodation?",
      value: selectedJob?.hotel_accommodation_covered,
    },

    {
      icon: icon2,
      title: "Car",
      message: "Does this client provide car rental?",
      value: selectedJob?.car_rental_covered,
    },
    {
      icon: icon7,
      title: "Tolls",
      message: "Does this client cover toll expenses?",
      value: selectedJob?.toll_expense_covered,
    },
    {
      icon: icon3,
      title: "Logged miles",
      message: "Does the client cover mileage reimbursement?",
      value: selectedJob?.logged_miles_covered,
    },
    {
      icon: icon4,
      title: "Gas",
      message: "Does this client cover gas or fuel expenses?",
      value: selectedJob?.gas_expense_covered,
    },
    {
      icon: icon5,
      title: "Parking fee",
      message: "Does this client cover parking fee expenses?",
      value: selectedJob?.parking_fee_covered,
    },
    {
      icon: icon6,
      title: "Over Budget Travel",
      message: "Will clients approve overbudget travel costs?",
      value: selectedJob?.overbudget_travel_covered,
    },
  ];
  const headerColumns = [
    // { heading: "Role", content: selectedJob?.role?.name },
    // { heading: "Role", content: selectedJob?.provider_roles?.map((r) => r.name).join(", ") },
    {
      heading: "Role",
      content: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
          {Array.isArray(selectedJob?.provider_roles) &&
            selectedJob.provider_roles.slice(0, 1).map((r, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  fontSize: ".8125rem",
                  fontWeight: 400,
                  textTransform: "capitalize",
                  color: darkMode === "dark" ? "#FFFFFF" : "rgba(103, 119, 136)",
                }}
              >
                {r.name}
                {index === 0 && selectedJob.provider_roles.length > 1 ? ", " : ""}
              </Typography>
            ))}
    
          {Array.isArray(selectedJob?.provider_roles) &&
            selectedJob.provider_roles.length > 1 && (
              <Tooltip
                title={selectedJob.provider_roles
                  .slice(1)
                  .map((r) => r.name)
                  .join(", ")}
                arrow
              >
                <Box
                  sx={{
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    borderRadius: "12px",
                    px: 1,
                    fontSize: ".75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  +{selectedJob.provider_roles.length - 1}
                </Box>
              </Tooltip>
            )}
        </Box>
      ),
    }
,    
    { heading: "Speciality", content: selectedJob?.speciality?.name },
    {
      heading: "Salary",
      content: `$${selectedJob?.regular_hourly_rate}` || "--",
    },
    {
      heading: "Posted on",
      content: selectedJob?.created_at?.split("T")[0] || "--",
    },
    { heading: "Due date", content: selectedJob?.last_date_to_apply || "--" },
    {
      heading: "Job status",
      // content:
      //   selectedJob?.shift_start_date && selectedJob?.shift_end_date
      //     ? "Completed"
      //     : "In progress",
      content: newUserData?.status,
      chip: true,
    },
  ];
  // ============================toglebutton=============================
  const [alignment, setAlignment] = useState("table_view");
  const buttonTab = [
    { label: "Table view", value: "table_view" },
    { label: "List view", value: "list_view" },
    { label: "Kanban view", value: "kanban" },
  ];
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const [deleteOpenModalWithId, setDeleteOpenModalWithId] = useState(null);
  // const [deleteLoader, setDeleteLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("table_view");
  const [isLoading, setIsLoading] = useState(false);
  const handleToggleClick = (e) => {
    // Toggle between 'table' and 'kanban' views
    setView(
      e === "table_view"
        ? "table_view"
        : e === "list_view"
        ? "list"
        : e === "kanban"
        ? "kanban"
        : "table_view"
    );
    localStorage.setItem(
      "view_list",
      e === "table_view"
        ? "table_view"
        : e === "list_view"
        ? "list"
        : e === "kanban"
        ? "kanban"
        : "table_view"
    );
  };
  // ==========================================================
  const handleViewOnGoogleMaps = () => {
    const googleMapsUrl = "https://www.google.com/maps?q=place";
    window.open(googleMapsUrl, "_blank");
  };

  // ============================search export filters=============================
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // State for Export Menu
  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "applicant_id" },
    { name: "applicant_name" },
    { name: "applicant_email" },
    { name: "qualification" },
    { name: "location" },
    { name: "apply_date" },
    { name: "experience" },
    { name: "status" },
  ]);

  const handleExportClick = () => {
    setExportDrawerOpen(true);
  };
  const [isExportLoading, setIsExportLoading] = useState(() => {
    return localStorage.getItem("exportLoading") === "applicant";
  });
  const [exportMessage, setExportMessage] = useState(null);
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const handleExport = async (selectedColumns, fileType) => {
    const requestData = {
      search: searchTerm || "",
      status: filters?.[0]?.status || "",
      location: filters?.[0]?.location ? filters?.[0]?.location : "",
      experience: filters?.[0]?.experience ? filters?.[0]?.experience : "",
      name: filters?.[0]?.name ? filters?.[0]?.name : "",
      apply_from_date: filters?.[0]?.apply_from_date || "",
      apply_end_date: filters?.[0]?.apply_end_date || "",
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
        `/api/posted-job-applicants-export/${param.id}`,
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

  //now filters drawer open and close
  const [filters, setFilters] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };
  const getApplicantsHandler = async (filterStatus = null, isClear = false) => {
    setIsLoading(true);
    let status;

    if (
      filterStatus &&
      !filterStatus?.perpage &&
      !filterStatus?.page &&
      !searchTerm
    ) {
      setFilters([filterStatus]);
      status = filterStatus;
    }
    if (isClear) {
      status = null;
    }
    if (!isClear && filterStatus == null) {
      status = filters?.[0];
    }
    const paramsData = {
      perpage: status?.perpage
        ? status.perpage
        : filterStatus?.perpage
        ? filterStatus?.perpage
        : 20,
      page: status?.page
        ? status?.page
        : filterStatus?.page
        ? filterStatus?.page
        : 1,
      status: status?.status ? status?.status : "",
      location: status?.location ? status?.location : "",
      experience: status?.experience ? status?.experience : "",
      name: status?.name ? status?.name : "",
      search: searchTerm ? searchTerm : status?.search ? status?.search : "",
      apply_from_date: status?.apply_from_date ? status?.apply_from_date : "",
      apply_end_date: status?.apply_end_date ? status?.apply_end_date : "",
    };
    try {
      const resp = await API.get(
        `/api/get-job-applicants/${param.id}?paginate=${paramsData?.perpage}&page=${paramsData?.page}&status=${paramsData.status}&search=${paramsData.search}&name=${paramsData?.name}&location=${paramsData?.location}&experience=${paramsData?.experience}&apply_from_date=${paramsData?.apply_from_date}&apply_end_date=${paramsData?.apply_end_date}`
      );
      if (resp?.data?.success) {
        setIsLoading(false);
        setApplicants(resp?.data?.data?.data);
        setPagination({
          currentPage: resp?.data?.data?.current_page,
          lastPage: resp?.data?.data?.last_page,
          perPage: resp?.data?.data?.per_page,
          total: resp?.data?.data?.total,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const handleRemove = (filterIndex, key) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      const updatedFilter = { ...updatedFilters[filterIndex] };
      delete updatedFilter[key];
      updatedFilters[filterIndex] = updatedFilter;
      // After updating the filters, call getJobData with the updated filters
      getApplicantsHandler(updatedFilters?.[0]); // or updatedFilters based on your needs

      return updatedFilters;
    });
  };
  const clearFilterHandler = () => {
    setFilters([]);
    getApplicantsHandler(null, true);
  };
  // ----------------------------------------------------- --------------------------------------Pagination
  const handleChangePage = (event, newPage) => {
    const nextPage = newPage + 1;

    if (nextPage !== pagination.currentPage) {
      const param = {
        perpage: pagination.perPage,
        page: nextPage,
        ...(filters?.[0] ? { ...filters[0] } : {}),
      };
      getApplicantsHandler(param);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    const value = event?.target?.value ? event?.target?.value : event;
    localStorage.setItem("per_page", value);

    const param = {
      perpage: parseInt(value, 10),
      page: 1,
      ...(filters?.[0] ? { ...filters[0] } : {}),
    };

    getApplicantsHandler(param);
  };

  // ----------------------------------------------------- Pagination end
  useEffect(() => {
    let localview = localStorage.getItem("view_list");
    setAlignment(
      localview === "table_view"
        ? "table_view"
        : localview === "list"
        ? "list_view"
        : localview === "kanban"
        ? "kanban"
        : "table_view"
    );
    if (localview) {
      setView(localview || "table_view");
    }
    getApplicantsHandler();
  }, []);
  const countAppliedFilters = () => {
    if (filters?.length > 0) {
      return Object?.values(filters?.[0]).filter(
        (value) => value !== "" && value !== null && value !== undefined
      ).length;
    }
  };
  const updateStatusHandler = async (status, id) => {
    setShowConfirmation(true);
    setUpdateStatus(status);
    setUpdateId(id);
  };
  const updateStatusHandlerConfirm = async (status, id) => {
    setUpdateLoading(true);
    try {
      const resp = await API.post(`/api/update-applicant-status/${id}`, {
        status,
      });
      if (resp?.data?.success) {
        setUpdateStatus(null);
        setUpdateId(null);
        setShowConfirmation(false);
        setUpdateLoading(false);
        getApplicantsHandler();
      }
    } catch (error) {
      setUpdateLoading(false);
      console.log(error);
    }
  };
  const searchHandler = () => {
    const param = {
      perpage: pagination.perPage,
      page: 1,
      search: searchTerm,
    };
    if (searchTerm) {
      getApplicantsHandler(param);
    } else {
      getApplicantsHandler();
    }
  };
  const editHandler = () => {
    dispatch(editSelectedJob(selectedJob));

    const selectedCountry = countries.find(
      (country) => country.id === +selectedJob?.facility_country_id
    );

    dispatch(setSelectedCountry(selectedCountry));
    dispatch(setSelectedState(selectedJob?.facility_state_id));
    dispatch(fetchClientStates(selectedJob?.facility_country_id));
    setIsOpen(!isOpen);
  };
  const handleClose = () => {
    setIsOpen(false);
    dispatch(resetField());
    sessionStorage.removeItem("jobModal");
    sessionStorage.removeItem("currentTabIndex");
  };
  const deleteApplicantHandler = async () => {
    setDeleteLoader(true);
    try {
      const resp = await API.delete(
        `/api/delete-applicant/${deleteOpenModalWithId}`
      );
      if (resp?.data?.success) {
        setApplicants((prevItems) =>
          prevItems.filter((item) => item.id !== deleteOpenModalWithId)
        );
        setDeleteLoader(false);
        setDeleteOpenModalWithId(false);
        dispatch(
          setAlert({
            message: "Your applicant delete successfully ",
            type: "success",
            location: "postedJob",
          })
        );
      }
    } catch (error) {
      setDeleteLoader(false);
      console.log(error);
    }
  };
  const menuItems = [
    permissions.includes("update jobs info") && {
      label: (
        <Typography
          sx={{
            boxShadow: "none",
            color: "background.btn_blue",
            "&:hover": {
              boxShadow: "none",
              color: "background.btn_blue",
            },
          }}
        >
          Edit job
        </Typography>
      ),
      icon: <Edit fontSize="small" sx={{ color: "background.btn_blue" }} />,
      action: () => {
        editHandler();
      },
    },
    permissions.includes("update jobs info") && {
      label: (
        <Typography
          sx={{
            boxShadow: "none",
            color: "#DC3531",
            textTransform: "inherit",
            mr: 3,
            py: 1,
            fontWeight: 400,
            "&:hover": {
              boxShadow: "none",
              color: "#DC3545",
            },
          }}
        >
          Close job
        </Typography>
      ),
      icon: <Delete fontSize="small" sx={{ color: " #DC3531 " }} />,
      action: () => {
        setCloseModalOpen(true);
      },
    },
    {
      label: (
        <Typography
          sx={{
            boxShadow: "none",
            color: "text.main",
            textTransform: "inherit",
            mr: 3,
            py: 1,
            fontWeight: 400,
            "&:hover": {
              boxShadow: "none",
              color: "text.main",
            },
          }}
        >
          Preview job
        </Typography>
      ),
      icon: (
        <RemoveRedEye fontSize="small" sx={{ color: "background.btn_blue" }} />
      ),
      action: () => {
        window.open(
          `https://projects.tangiblethemes.com/Shglocums/browse-jobs/job-details/${selectedJob?.id}`,
          "_blank"
        );
      },
    },
  ].filter(Boolean);
  // -==============================box style================================
  const AccordionParentBoxstyling = {
    mt: 4,
    p: "24px",
    bgcolor: darkMode === "dark" ? "#303335" : "white",
    border: "1px solid #DEE2E6",
    borderRadius: "12px",
  };

  // -=======================================================================
  return (
    <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
      <PostJobModal open={isOpen} handleClose={handleClose} />
      <ExportDrawer
        open={exportDrawerOpen}
        onClose={() => setExportDrawerOpen(false)}
        columns={columns}
        onExport={handleExport}
        title="Export Posted Jobs"
      />
      <ConfirmModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => updateStatusHandlerConfirm(updateStatus, updateId)}
        isLoading={updateLoading}
        title={"Confirm Status Change"}
        action={"Yes, Change Status"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to change the applicant's status?
          </Typography>
        }
        bgcolor={"#00c9a7"}
      />
      <Header />
      {location === "postedJob" ? <AlertMessage /> : ""}

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
            flexGrow: 1,
            pb: 4,
            px: 2,
            m: "0 auto",
          }}
        >
          <Box sx={{ textAlign: "center", mt: 4.5 }}>
            {/* ============================ close and edit button ======================= */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <DomainOutlinedIcon sx={{ fontSize: "60px" }} />
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize={"22.6px"}
                    color={"text.black"}
                  >
                    {` ${selectedJob?.title}${
                      selectedJob?.client_name
                        ? ` for ${selectedJob.client_name}`
                        : ""
                    }`}
                  </Typography>
                  <Breadcrumb jobDetail={true} items={breadcrumbItems} />
                </Box>
              </Box>

              {newUserData?.status !== "closed" && (
                <Box display="flex" alignItems="center" flexWrap={"wrap"}>
                  <ActionMenu
                    menuItems={menuItems}
                    client={selectedJob}
                    background={
                      darkMode === "dark" ? "background.paper" : "white"
                    }
                    padding={1}
                  />
                </Box>
              )}
            </Box>
            {/* ===============================job details=============================== */}
            <Grid container mb={5} ml={0.1} mt={3} spacing={2}>
              {headerColumns.map((column, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={1.7}
                  key={index}
                  sx={{ textAlign: "left" }}
                >
                  <Typography sx={{ textTransform: "none", fontSize: "13px" }}>
                    {column.heading}
                  </Typography>
                  {column.chip ? (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                          bgcolor: "rgba(19, 33, 68, 0.1)",
                          p: "4px 7px ",
                          borderRadius: "5px",
                          gap: "8px",
                          width: { xs: "50%", xl: "40%" },
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor:
                              column?.content === "closed"
                                ? "rgba(220, 53, 69, 1)"
                                : column?.content == null || "Active"
                                ? "rgba(0, 201, 167, 1)"
                                : column?.content === "draft"
                                ? "rgba(255, 193, 7, 1)"
                                : "#377dff",
                            width: "8px",
                            height: "8px",
                            borderRadius: "4px",
                          }}
                        ></Box>{" "}
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            color:
                              darkMode === "dark"
                                ? "#fff"
                                : "rgba(30, 32, 34, 1)",
                            lineHeight: "12.71px",
                          }}
                        >
                          {column?.content || "Active"}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <HeadingCommon
                      mb={"0.5rem"}
                      fontSize={"14px"}
                      title={column.heading==="Role"?column.content:capitalizeFirstLetter(column.content)}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
            {/* ========================== JD =================*/}
            <Box sx={AccordionParentBoxstyling}>
              <Accordion_
                heading={
                  <HeadingCommon
                    mb={"0px"}
                    fontSize="20px"
                    textAlign={"left"}
                    title={"Job description"}
                  />
                }
                children={
                  <Box>
                    {selectedJob?.description !== "null" &&
                    selectedJob?.description !== "<p>null</p>" ? (
                      <Typography
                        sx={{
                          textAlign: "left",
                          mb: 4,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedJob?.description,
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          textAlign: "left",
                          mb: 4,
                        }}
                      >
                        --
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Box>

            {/* ====================location=======================*/}
            <Box sx={AccordionParentBoxstyling}>
              <Accordion_
                heading={
                  <HeadingCommon
                    mb={"0px"}
                    fontSize="20px"
                    textAlign={"left"}
                    title={"Location"}
                  />
                }
                children={
                  <Typography
                    sx={{
                      textAlign: "left",
                      mt: "0px",
                      textTransform: "capitalize",
                    }}
                  >
                    {}
                    {
                      countries?.find(
                        (contr) =>
                          contr?.id === Number(selectedJob?.facility_country_id)
                      )?.name
                    }{" "}
                    {selectedJob?.facility_state?.name && ","}
                    {selectedJob?.facility_state?.name || "--"}
                    {selectedJob?.facility_city && ","}{" "}
                    {selectedJob?.facility_city}
                    {/* <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={handleViewOnGoogleMaps}
                    >
                      &nbsp;View on Google Maps
                    </span> */}
                  </Typography>
                }
              />
            </Box>

            {/* ========================== job perks ==================================*/}
            <Box sx={AccordionParentBoxstyling}>
              <Accordion_
                heading={
                  <HeadingCommon
                    mb={"0px"}
                    fontSize="20px"
                    textAlign={"left"}
                    title={"Budget preferences"}
                  />
                }
                children={<BudgetPreferences_postJob budgetData={budgetData} />}
              />
            </Box>

            {/* ====================================cards=============================== */}
            {permissions?.includes("read jobs applicants") ? (
              <JobDetailsCards applicants={applicants} isLoading={isLoading} />
            ) : (
              ""
            )}
            {/* ==========================Applicants table or listview =================*/}
            {/* <ApplicantsTableOrListView /> */}
            {permissions?.includes("read jobs applicants") ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box>
                  <HeadingCommon mb={"0px"} title={"Applicants"} />
                </Box>
                <CustomToggleButtonGroup
                  buttonTab={buttonTab}
                  alignment={alignment}
                  handleAlignment={handleAlignment}
                  handleToggleClick={handleToggleClick}
                  darkMode={darkMode}
                />
              </Box>
            ) : (
              ""
            )}
            {isExportLoading && <ExportAlert severity={"info"} />}
            {isExportSuccess && <ExportAlert severity={"success"} />}
          </Box>
          {/* ================ Conditionaly Render Table or Kanban View on Button Click  */}

          {permissions?.includes("read jobs applicants") ? (
            <Paper
              sx={{
                overflow: "hidden",
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
              }}
            >
              {/* =================== Search Bar & Filter Button ================== */}
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
                  placeholder="Search applicants"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === "Enter" && searchHandler()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={() => searchHandler()}>
                          <SearchIcon sx={{ cursor: "pointer" }} />
                        </IconButton>
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
                  {permissions?.includes("read jobs applicants") ? (
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
                      {countAppliedFilters()
                        ? `${countAppliedFilters()} Clear Filter`
                        : "Filter"}
                    </Button>
                  ) : (
                    ""
                  )}
                  <ApplicantFilters
                    applicants={applicants}
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    setFilters={setFilters}
                    clearFilterHandler={clearFilterHandler}
                    getApplicants={(status) => {
                      getApplicantsHandler(status);

                      setFilters([status]);
                    }}
                    // filterProviderRolesList={filterProviderRolesList}
                    // allSpecialitiesOptions={allSpecialitiesOptions}
                    countAppliedFilters={countAppliedFilters}
                  />
                </Box>
              </Box>
              {filters.map((filter, filterIndex) => (
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    // gap: "16px",
                    alignItems: "center",
                  }}
                  key={filterIndex}
                >
                  {Object.entries(filter).map(([key, value]) => {
                    if (value !== "" && key !== "perpage" && key !== "page") {
                      return (
                        <Box
                          key={key}
                          sx={{
                            pl: "1rem",

                            display: "flex",
                            flexWrap: "wrap",
                            // gap: "16px",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            sx={{
                              py: 0.5,
                              border: "1px solid #DEE2E6",
                              bgcolor: "white",
                              borderRadius: "4px",
                              display: "flex",
                              justifyContent: "space-between",
                              px: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                gap: 0.5,
                                color: "#1E2022",
                                fontWeight: 500,
                                fontSize: "14px",
                                textTransform: "capitalize",
                              }}
                            >
                              {key === "apply_end_date"
                                ? "Apply to date"
                                : key === "apply_from_date"
                                ? "Apply From date"
                                : key?.replace("_", " ")}
                              : {value}
                            </Typography>
                            <Close
                              onClick={() => handleRemove(filterIndex, key)}
                              sx={{
                                cursor: "pointer",
                                fontSize: "1.5rem",
                                color: "#1E2022",
                                pl: "3px",
                              }}
                            />
                          </Button>
                        </Box>
                      );
                    }
                    return null;
                  })}
                  {countAppliedFilters() ? (
                    <ClearFilterDesign clearFilters={clearFilterHandler} />
                  ) : (
                    ""
                  )}
                </Box>
              ))}
              {view === "table_view" ? (
                <ApplicantsTable
                  applicants={applicants}
                  darkMode={darkMode}
                  pagination={pagination}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  isLoading={isLoading}
                  updateStatusHandler={updateStatusHandler}
                  deleteOpenModalWithId={deleteOpenModalWithId}
                  setDeleteOpenModalWithId={setDeleteOpenModalWithId}
                  deleteLoader={deleteLoader}
                  setDeleteLoader={setDeleteLoader}
                  deleteApplicantHandler={deleteApplicantHandler}
                />
              ) : view === "list" ? (
                <ApplicantsListView
                  data={applicants}
                  darkMode={darkMode}
                  pagination={pagination}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  isLoading={isLoading}
                  updateStatusHandler={updateStatusHandler}
                  deleteOpenModalWithId={deleteOpenModalWithId}
                  setDeleteOpenModalWithId={setDeleteOpenModalWithId}
                  deleteLoader={deleteLoader}
                  setDeleteLoader={setDeleteLoader}
                  deleteApplicantHandler={deleteApplicantHandler}
                />
              ) : (
                <ApplicantsKanbanView
                  data={applicants}
                  darkMode={darkMode}
                  pagination={pagination}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  isLoading={isLoading}
                  updateStatusHandler={(status, id, conf) =>
                    conf
                      ? updateStatusHandler(status, id)
                      : updateStatusHandlerConfirm(status, id)
                  }
                  deleteOpenModalWithId={deleteOpenModalWithId}
                  setDeleteOpenModalWithId={setDeleteOpenModalWithId}
                  deleteLoader={deleteLoader}
                  setDeleteLoader={setDeleteLoader}
                  deleteApplicantHandler={deleteApplicantHandler}
                />
              )}
            </Paper>
          ) : (
            ""
          )}
        </Box>
      </Box>
      {/* =========================== close job confirm modal============================= */}
      <CloseConfirmModal
        closeJob={true}
        isOpen={closeModalOpen}
        onClose={deleteModalClose}
        onConfirm={closeJobHandler}
        isLoading={updateLoading}
        deleteLoader={deleteLoader}
        itemName={"File"}
        title={"Close this job?"}
        action={"Close job"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to close this job? Once closed, no further
            applications will be accepted.
          </Typography>
        }
      />
    </Box>
  );
};

export default PostJobDetail_main;
