import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Checkbox,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import { fetchJobsData } from "../../thunkOperation/job_management/states";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDropDown, ArrowDropUp, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/Routes";
import SkeletonRow from "../SkeletonRow";
import { postedJobsTableColumns } from "../constants/data";
import MoreActionMenu from "../common/MoreActionMenu";
import { fetchPostedJobsData } from "../../thunkOperation/postJob/postJobThunk";
import PostedJobFilterChips from "./PostedJobFilterChips";
import {
  deleteJob,
  editSelectedJob,
  fetchClientStates,
  resetField,
  setSelectedCountry,
  setSelectedState,
  setViewJob,
  updateJobStatus,
  updateNewUserDataField,
} from "../../feature/post-job/PostJobSlice";
import { BpCheckbox } from "../common/CustomizeCHeckbox";
import API from "../../API";

// import { DeleteConfirmModal as CloseConfirmModal } from "../../handleConfirmDelete";
import { DeleteConfirmModal as CloseConfirmModal } from "../../components/handleConfirmDelete";
import { DeleteConfirmModal as DeleteJobConfirmModal } from "../../components/handleConfirmDelete";
import PostJobModal from "./PostJobModal";
import { setAlert } from "../../feature/alert-message/alertSlice";
import AlertMessage from "../../feature/alert-message/AlertMessage";
const headerStyle = {
  backgroundColor: "rgba(231, 234, 243, .4)",
  fontSize: "11.9px",
};
const PostedJobsTable = ({
  postJobsTableData,
  isLoading,
  ///////for  chips
  filters,
  handleRemove,
  filterProvider,
  filterClientList,
  allSpecialitiesOptions,
  clearFilterHandler,
  filterProviderRolesList,
  countAppliedFilters,
  filterCountries,
  permissions,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { countries } = useSelector((state) => state.postJob);
  const { message, type, isOpen, location } = useSelector(
    (state) => state.alert
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const [filteredJobs, setFilteredJobs] = useState(postJobsTableData?.data);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSort, setActiveSort] = useState({ column: "", sort: "" });
  const [viewDetails, setViewDetails] = useState([]);
  const [closeModalOpenWithId, setCloseModalOpenWithId] = useState(null);
  const [deleteModalOpenWithId, setDeleteModalOpenWithId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const closeModalhandler = () => {
    setCloseModalOpenWithId(null);
    setDeleteModalOpenWithId(null);
    setUpdateLoading(false);
  };
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  });

  useEffect(() => {
    const filtered = postJobsTableData?.data?.filter(
      (job) =>
        job?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        job?.id?.toString()?.includes(searchTerm)
    );
    setFilteredJobs(filtered);
    setPagination({
      currentPage: postJobsTableData?.current_page,
      lastPage: postJobsTableData?.last_page,
      perPage: postJobsTableData?.per_page,
      total: postJobsTableData?.total,
    });
  }, [postJobsTableData]);
  const handleChangePage = (event, newPage) => {
    const nextPage = newPage + 1;
    if (nextPage !== pagination.currentPage) {
      const param = {
        perpage: pagination.perPage,
        page: nextPage,
        ...(filters?.[0] ? { ...filters[0] } : {}),
      };
      dispatch(fetchPostedJobsData(param));
    }
  };
  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem("per_page", event.target.value);

    const param = {
      perpage: parseInt(event.target.value, 10),
      page: 1,
      ...(filters?.[0] ? { ...filters[0] } : {}),
    };

    dispatch(fetchPostedJobsData(param));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedJobs(filteredJobs?.map((job) => job.id));
    } else {
      setSelectedJobs([]);
    }
  };
  const handleSelectJob = (event, jobId) => {
    const selectedIndex = selectedJobs?.indexOf(jobId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedJobs, jobId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedJobs?.slice(1));
    } else if (selectedIndex === selectedJobs?.length - 1) {
      newSelected = newSelected.concat(selectedJobs?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedJobs?.slice(0, selectedIndex),
        selectedJobs?.slice(selectedIndex + 1)
      );
    }
    setSelectedJobs(newSelected);
  };

  const handleDelete = () => {
    setSelectedJobs([]);
  };
  const viewDetail = (selectedJob) => {
    navigate(`${ROUTES.postJobDetail}${selectedJob?.id}`, {
      state: selectedJob,
    });
    dispatch(setViewJob(selectedJob));
  };
  const sortingBy = (columnName, sortType) => {
    const param = {
      perpage: pagination.perPage,
      page: 1,
      sort_column_name: columnName,
      sort_type: sortType,
    };

    dispatch(fetchPostedJobsData(param));
  };

  // =============================== progress bar =============================
  const progressBar = (completed, color) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        pt: 1,
        borderRadius: "10px",
        width: "100%",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          width: "50%",
          fontSize: "14px",
          color: completed === 4 ? color : "",
        }}
      >
        {completed === 4 ? "4 of 4 steps" : `${completed} of 4 steps`}
      </Typography>
      <Box sx={{ width: "50%", display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            bgcolor: completed === 4 ? color : "rgba(189, 197, 209, 1)",
            width: `${(completed / 4) * 100}%`,
            height: "5px",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
            ...(completed === 4 && {
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }),
          }}
        />

        {completed < 4 && (
          <Box
            sx={{
              bgcolor: "#d3d3d3",
              width: `${((4 - completed) / 4) * 100}%`,
              height: "5px",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          />
        )}
      </Box>
    </Box>
  );

  const sortRender = (columnName) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        // pt: -0.51,
      }}
    >
      <ArrowDropUp
        onClick={() => {
          sortingBy(columnName, "desc");
          setActiveSort({ column: columnName, sort: "desc" });
        }}
        sx={{
          fontSize: "16px",
          mb: -1,
          color:
            activeSort?.column === columnName && activeSort?.sort === "desc"
              ? "black"
              : "#DDE1EE",
          cursor: "pointer",
        }}
      />
      <ArrowDropDown
        onClick={() => {
          sortingBy(columnName, "asc");
          setActiveSort({ column: columnName, sort: "asc" });
        }}
        sx={{
          fontSize: "16px",
          color:
            activeSort?.column === columnName && activeSort?.sort === "asc"
              ? "black"
              : "#DDE1EE",
          cursor: "pointer",
        }}
      />
    </Box>
  );
  // ----------------------------------------------------------- close jobs handler
  const closeJobHandler = async (archive) => {
    setUpdateLoading(true);
    try {
      const resp = await API.post(
        `/api/update-posted-job-status/${
          archive === "archive" ? deleteModalOpenWithId : closeModalOpenWithId
        }`,
        {
          status: archive,
        }
      );
      if (resp?.data?.success) {
        setUpdateLoading(false);
        setCloseModalOpenWithId(false);
        if (archive === "archive") {
          dispatch(deleteJob(deleteModalOpenWithId));
        } else {
          dispatch(
            updateJobStatus({
              jobId: closeModalOpenWithId,
              newStatus: "closed",
            })
          );
        }
        dispatch(
          setAlert({
            message: archive
              ? "Your job status change successfully"
              : "Your job closed successfully ",
            type: "success",
            location: "postedJob",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteArchiveHandler = async () => {
    setUpdateLoading(true);
    try {
      let resp;
      if (actionType === "Delete") {
        resp = await API.delete(
          `/api/delete-posted-job/${deleteModalOpenWithId}`
        );
      } else {
        closeJobHandler("archive");
        // resp = await API.post(
        //   `/api/update-posted-job-status/${deleteModalOpenWithId}`,{status:'archive'}
        // );
      }
      if (resp?.data?.success) {
        setUpdateLoading(false);
        setDeleteModalOpenWithId(null);

        dispatch(
          setAlert({
            message: resp?.data?.msg,
            type: "success",
            location: "postedJob",
          })
        );
        dispatch(deleteJob(deleteModalOpenWithId));
      } else {
        setUpdateLoading(false);
        setDeleteModalOpenWithId(null);
        dispatch(
          setAlert({
            message: resp?.data?.msg,
            type: "success",
            location: "postedJob",
          })
        );
      }
    } catch (error) {
      setUpdateLoading(false);

      console.log(error);
    }
  };
  // ------------------------------------------------------------------ edit handler
  const editHandler = () => {
    dispatch(editSelectedJob(viewDetails));
    const selectedCountry = countries.find(
      (country) => country.id === viewDetails?.facility_country_id
    );

    dispatch(setSelectedCountry(selectedCountry));
    dispatch(setSelectedState(viewDetails?.facility_state_id));
    dispatch(fetchClientStates(viewDetails?.facility_country_id));
    setIsEditOpen(!isEditOpen);
  };
  const handleClose = () => {
    setIsEditOpen(false);
    dispatch(resetField());
    sessionStorage.removeItem("jobModal");
    sessionStorage.removeItem("currentTabIndex");
  };
  // ========================more menu actions========================
  const actions = [
    {
      label: "View details",
      action: () => viewDetail(viewDetails),
    },
    {
      label: "Preview job",
      action: () =>
        window.open(
          "https://projects.tangiblethemes.com/Shglocums/browse-jobs/job-details/" +
            viewDetails?.id,
          "_blank"
        ),
    },
    {
      label: "Edit job",
      action: () => editHandler(),
    },
    {
      label: "Close job",
      action: () => setCloseModalOpenWithId(viewDetails?.id),
    },

    {
      label: "Delete",
      action: () => {
        setActionType("Delete");
        setDeleteModalOpenWithId(viewDetails?.id);
      },
    },
    {
      label: "Archive",
      action: () => {
        setActionType("Archive");
        setDeleteModalOpenWithId(viewDetails?.id);
      },
    },
  ];
  return (
    <>
      <PostJobModal
        open={isEditOpen}
        handleClose={handleClose}
        editLocation="table"
      />
      <CloseConfirmModal
        closeJob={true}
        isOpen={closeModalOpenWithId}
        onClose={closeModalhandler}
        onConfirm={() => closeJobHandler("closed")}
        isLoading={updateLoading}
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
      <DeleteJobConfirmModal
        closeJob={true}
        isOpen={deleteModalOpenWithId}
        onClose={closeModalhandler}
        onConfirm={deleteArchiveHandler}
        isLoading={updateLoading}
        itemName={"File"}
        title={`${actionType} this job?`}
        action={`${actionType} job`}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to {actionType} this job? Once {actionType},
            no further applications will be accepted.
          </Typography>
        }
      />
      {isLoading ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <SkeletonRow column={9} />
          <SkeletonRow column={9} />
          <SkeletonRow column={9} />
          <SkeletonRow column={9} />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer className="thin_slider">
            {location === "postedJob" ? <AlertMessage /> : ""}

            <PostedJobFilterChips
              filters={filters}
              filterProvider={filterProvider}
              filterClientList={filterClientList}
              handleRemove={handleRemove}
              countAppliedFilters={countAppliedFilters}
              clearFilterHandler={clearFilterHandler}
              allSpecialitiesOptions={allSpecialitiesOptions}
              filterProviderRolesList={filterProviderRolesList}
              filterCountries={filterCountries}
            />
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      ...headerStyle,
                      maxWidth: "50px",
                      borderTop: "2px solid #ECEFF6",
                    }}
                  >
                    <BpCheckbox
                      indeterminate={
                        selectedJobs?.length > 0 &&
                        selectedJobs?.length < filteredJobs?.length
                      }
                      checked={
                        filteredJobs?.length > 0 &&
                        selectedJobs?.length === filteredJobs?.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {postedJobsTableColumns?.map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        ...headerStyle,
                        minWidth: index === 0 ? "100px" : "150px",
                        borderTop: "2px solid #ECEFF6",
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "11.9px", fontWeight: 500 }}
                        >
                          {header.label}
                        </Typography>
                        {header.sortable && sortRender(header.field)}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {postJobsTableData?.data?.length > 0 ? (
                  postJobsTableData?.data?.map((job, index) => {
                    const eHours = parseInt(
                      job?.shift_end_time?.split(":")[0],
                      10
                    );
                    const eMinutes = job?.shift_end_time?.split(":")[1];
                    const ePeriod = eHours >= 12 ? "PM" : "AM";
                    const eFormattedHours = eHours % 12 || 12;

                    const sHours = parseInt(
                      job?.shift_start_time?.split(":")[0],
                      10
                    );
                    const sMinutes = job?.shift_start_time?.split(":")[1];
                    const sPeriod = sHours >= 12 ? "PM" : "AM";
                    const sFormattedHours = sHours % 12 || 12;
                    const hasDeletePermission =
                      permissions.includes("delete jobs info");
                    const hasUpdatePermission =
                      permissions.includes("update jobs info");
                    const hasClosePermission =
                      permissions.includes("update jobs info");
                    const hasArchivePermission =
                      permissions.includes("update jobs info");
                    const filteredActions =
                      job.status === "closed"
                        ? actions.filter(
                            (action) =>
                              action.label !== "Edit job" &&
                              action.label !== "Close job"
                          )
                        : job?.applicants_count > 0
                        ? actions.filter((action) => action.label !== "Delete")
                        : actions;

                    const actionsItems = filteredActions.filter((action) => {
                      if (action.label === "Delete" && hasDeletePermission)
                        return true;
                      if (action.label === "Edit job" && hasUpdatePermission)
                        return true;
                      if (action.label === "Close job" && hasClosePermission)
                        return true;
                      if (action.label === "Archive" && hasArchivePermission)
                        return true;
                      if (
                        action.label !== "Delete" &&
                        action.label !== "Edit job" &&
                        action.label !== "Close job" &&
                        action.label !== "Archive"
                      ) {
                        // Always show actions that are not restricted
                        return true;
                      }
                      return false;
                    });
                    return (
                      <TableRow
                        sx={{
                          backgroundColor:
                            darkMode === "dark"
                              ? "background.paper"
                              : index % 2 === 0
                              ? "#FFFFFF"
                              : "rgba(248, 250, 253, 1)",
                          "&:hover": {
                            backgroundColor: "none",
                          },
                        }}
                        key={job.id}
                        hover
                        role="checkbox"
                        aria-checked={selectedJobs?.indexOf(job.id) !== -1}
                        tabIndex={-1}
                        selected={selectedJobs?.indexOf(job.id) !== -1}
                      >
                        <TableCell
                          padding="checkbox"
                          onClick={(event) => handleSelectJob(event, job.id)}
                        >
                          <BpCheckbox
                            checked={selectedJobs?.indexOf(job.id) !== -1}
                            onChange={(event) => handleSelectJob(event, job.id)}
                          />
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            viewDetail(job);
                          }}
                          sx={{
                            "&:hover": {
                              color: "text.link",
                              fontWeight: 600,
                              cursor: "pointer",
                            },
                            color:
                              darkMode === "dark" ? "#FFFFFF" : "text.main",
                            fontWeight: 600,
                          }}
                        >
                          {job?.id}
                        </TableCell>
                        <TableCell
                          onClick={() => viewDetail(job)}
                          sx={{
                            "&:hover": {
                              color: "text.link",
                              fontWeight: 600,
                              cursor: "pointer",
                            },
                            color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                            fontWeight: "600",
                            minWidth: "200px",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: "3rem",
                                height: "3rem",
                                background: "background.paper",
                                mr: 1.5,
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: ".875rem ",
                                  fontWeight: 600,
                                  lineHeight: 1.2,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  textTransform: "capitalize",
                                }}
                              >
                                {/* {job?.client?.name || "--"} */}
                                {job?.client_name || "--"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: ".8125rem ",
                                  fontWeight: 400,
                                  textTransform: "lowercase",
                                  color:
                                    darkMode == "dark"
                                      ? "#FFFFFF"
                                      : "rgba(103, 119, 136)",
                                }}
                              >
                                {job.client?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{textTransform:'capitalize'}}>{job.title}</TableCell>
                        {/* <TableCell>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".875rem ",
                                fontWeight: 600,
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textTransform: "capitalize",
                                color: "text.black",
                              }}
                            >
                              {job?.speciality?.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: ".8125rem ",
                                fontWeight: 400,
                                textTransform: "capitalize",
                                color:
                                  darkMode == "dark"
                                    ? "#FFFFFF"
                                    : "rgba(103, 119, 136)",
                              }}
                            >
                              {Array.isArray(job?.provider_roles)
                                ? job.provider_roles.map((r) => r.name).join(", ")
                                : job?.provider_roles?.name || job?.provider_roles || "--"}
                            </Typography>
                          </Box>
                        </TableCell> */}
                        <TableCell>
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    {/* Speciality Name */}
    <Typography
      variant="caption"
      sx={{
        fontSize: ".875rem",
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textTransform: "capitalize",
        color: "text.black",
      }}
    >
      {job?.speciality?.name}
    </Typography>

    {/* Provider Roles */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
      {Array.isArray(job?.provider_roles) ? (
        <>
          {/* Show first 2 roles */}
          {job.provider_roles.slice(0, 2).map((r, index) => (
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
              {index === 0 && job.provider_roles.length > 1 ? ", " : ""}
            </Typography>
          ))}

          {/* Show "+N" badge with tooltip if more than 2 roles */}
          {job.provider_roles.length > 2 && (
            <Tooltip
              title={job.provider_roles
                .slice(2)
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
                +{job.provider_roles.length - 2}
              </Box>
            </Tooltip>
          )}
        </>
      ) : (
        // Fallback for non-array role
        <Typography
          variant="caption"
          sx={{
            fontSize: ".8125rem",
            fontWeight: 400,
            textTransform: "capitalize",
            color: darkMode === "dark" ? "#FFFFFF" : "rgba(103, 119, 136)",
          }}
        >
          {job?.provider_roles?.name || job?.provider_roles || "--"}
        </Typography>
      )}
    </Box>
  </Box>
</TableCell>
                        <TableCell
                          sx={{ width: "120px", textTransform: "capitalize" }}
                        >
                          {
                            countries?.find(
                              (contr) => contr?.id === job?.facility_country_id
                            )?.name
                          }
                          {job?.facility_state?.name && ","}
                          {job?.facility_state?.name}
                          {job?.facility_city && ","} {job?.facility_city}
                        </TableCell>
                        {/* <TableCell>{job?.last_date_to_apply}</TableCell> */}
                        <TableCell>
                          {job?.shift_start_time ? (
                            <>
                              {sFormattedHours}:{sMinutes} {sPeriod}
                            </>
                          ) : (
                            "--"
                          )}
                        </TableCell>
                        <TableCell>
                          {job?.shift_end_time ? (
                            <>
                              {eFormattedHours}:{eMinutes} {ePeriod}
                            </>
                          ) : (
                            "--"
                          )}
                        </TableCell>

                        <TableCell>{job?.applicants_count}</TableCell>
                        <TableCell sx={{ minWidth: "150px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                bgcolor:
                                  job?.status === "closed"
                                    ? "rgba(220, 53, 69, 1)"
                                    : job?.status == null
                                    ? "rgba(0, 201, 167, 1)"
                                    : job?.status === "draft"
                                    ? "rgba(255, 193, 7, 1)"
                                    : "#377dff",
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "21px",
                                textTransform: "capitalize",
                                color:
                                  darkMode === "dark"
                                    ? "#FFFFFF"
                                    : "rgba(103, 119, 136, 1)",
                              }}
                            >
                              {job?.status || "Active"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            minWidth: "200px",
                          }}
                        >
                          {progressBar(
                            job?.shift_start_date && job?.shift_end_date
                              ? 4
                              : 3,
                            job?.status === "closed"
                              ? "rgba(0, 201, 167, 1)"
                              : job?.status == null
                              ? "rgba(0, 201, 167, 1)"
                              : job?.status === "draft"
                              ? "rgba(255, 193, 7, 1)"
                              : "#377dff"
                          )}
                        </TableCell>
                        <TableCell>
                          <MoreActionMenu
                            options={actionsItems}
                            more={true}
                            setViewDetails={setViewDetails}
                            job={job}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No jobs available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <TablePagination
        rowsPerPageOptions={[20, 30, 50]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.perPage}
        page={pagination.currentPage - 1} // TablePagination uses 0-indexed pages
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{
          disabled: pagination.currentPage === pagination.lastPage,
        }}
        backIconButtonProps={{
          disabled: pagination.currentPage === 1,
        }}
      />
    </>
  );
};
export default PostedJobsTable;
