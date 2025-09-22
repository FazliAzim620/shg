import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  TablePagination,
  Checkbox,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  Search,
  FilterList,
  SaveAltOutlined,
  ExpandMore,
  Person,
  Close,
} from "@mui/icons-material";
import ExportAlert from "../../../components/common/ExportAlert";
import ExportDrawer from "../../../components/common/ExportDrawer";
import ClearFilterDesign from "../../../components/common/filterChips/ClearFilterDesign";
import { BpCheckbox } from "../../../components/common/CustomizeCHeckbox";
import { fetchUsers } from "../../../thunkOperation/userManagementModulethunk/getUsersThunk";
import { useDispatch } from "react-redux";
import CustomChip from "../../../components/CustomChip";
import SkeletonRow from "../../../components/SkeletonRow";
import { SearchIcon } from "../../../components/post-job/PostedJobsIcons";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../../routes/Routes";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../../components/handleConfirmDelete";
import Swal from "sweetalert2";
import API from "../../../API";
import {
  downloadHandlerFile,
  formatOnlyDate,
  selectOptions,
} from "../../../util";
import { useSelector } from "react-redux";
import FilterProvider from "../FilterProvider";
import AddEditDocument from "../documents/AddEditDocument";
import { getOrganizationsDocuments } from "../../../api_request";
import OrganizationDocFilter from "./OrganizationDocFilter";
import NodataFoundCard from "../../../provider_portal/provider_components/NodataFoundCard";

const DocumentsTable = ({
  openEditHandler,
  confirmStatus,
  changeOccure,
  confirmDelete,
  viewDetailsHandler,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const darkMode = useSelector((state) => state.theme.mode);
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));
  const { roles } = useSelector((state) => state.users);

  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleActionsClick = (event, user) => {
    setActionsAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  // =========---------------------------------------------------------------------------- Filter function
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterData, setFilterData] = useState(null);
  //   const [selectedUser, setSelectedFilterUser] = useState(null);
  const openFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const countAppliedFilters = (filters) => {
    if (filters) {
      let count = 0;

      Object.values(filters).forEach((value) => {
        if (Array.isArray(value)) {
          count += value.filter((item) => item !== "").length;
        } else if (value !== "" && value !== null && value !== undefined) {
          count++;
        }
      });

      return count;
    }
  };

  const clearFilterHandler = () => {
    setFilterData(null);
  };
  const handleRemove = (key) => {
    setFilterData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[key]; // Remove the key from the data
      return updatedData;
    });
  };
  const handleRemoveRole = (roleToRemove) => {
    setFilterData((prevData) => {
      const updatedRoles = prevData.roles.filter(
        (role) => role !== roleToRemove
      ); // Remove the specific role
      return { ...prevData, roles: updatedRoles };
    });
  };
  // =========---------------------------------------------------------------------------- Filter function
  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "name" },
    { name: "role " },
    { name: "specialties" },
    { name: "hourly_rate" },
    { name: "accounts_status" },
    { name: "recruiter" },
    { name: "jobs" },
    { name: "created_at" },
  ]);

  const handleExportClick = () => {
    setExportDrawerOpen(true);
  };
  const [isExportLoading, setIsExportLoading] = useState(() => {
    return localStorage.getItem("exportLoading") === "serviceProvider";
  });
  const [openSyncAlert, setOpenSyncAlert] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const handleExport = async (selectedColumns, fileType) => {
    const requestData = {
      search: searchTerm || "",
      client_id: params.id || "",
      status: filters?.[0]?.jobStatus || "",
      provider_name: filters?.[0]?.provider_name || "",
      role: filters?.[0]?.role || "",
      speciality: filters?.[0]?.speciality || "",
      from_date: filters?.[0]?.from_date || "",
      end_date: filters?.[0]?.end_date || "",
      max_rate: filters?.[0]?.max_rate || "",
      min_rate: filters?.[0]?.min_rate || "",
      jobOrder: true,
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
      const resp = await API.post(`/api/providers-export`, bodyData);
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

  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedDocuments((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedDocuments((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(documents.map((user) => user.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const isIndeterminate =
    selectedDocuments?.length > 0 &&
    selectedDocuments.length < documents.length;
  const isAllSelected = selectedDocuments?.length === documents?.length;
  const [filterApplied, setFilterApplied] = useState(false);

  const getDocuments = async (
    currentPage = 1,
    perPage = 10,
    roleName = null
  ) => {
    setIsLoading(true);
    try {
      const data = {
        name: filterData?.document_name || "",
        type: filterApplied ? "filter" : "" || "",
        purpose: filterData?.purpose || "",
        provider_role_ids: filterData?.roles?.join(",") || "",
        page: filterApplied ? 1 : currentPage,
        per_page: perPage,
        search: searchTerm || "",
      };

      const fetchedData = await getOrganizationsDocuments(data);
      // Update pagination state
      if (fetchedData?.success) {
        if (location?.state?.role) {
          navigate(ROUTES?.userManagement, { state: { role: null } });
        }
        // setFilterApplied(false);
        setIsLoading(false);
        setDocuments(fetchedData?.data?.data);
        setPagination((prevPagination) => ({
          ...prevPagination,
          currentPage: fetchedData?.data?.current_page,
          total: fetchedData?.data?.total,
          lastPage: fetchedData?.data?.last_page,
        }));
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getDocuments(newPage + 1, rowsPerPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getDocuments(1, newRowsPerPage);
  };
  useEffect(() => {
    if (!location?.state?.role) {
      getDocuments(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage, filterData, changeOccure]);
  // const viewDetailsHandler = (user, edit) => {
  //   navigate(`${ROUTES.userDetails}/${user?.id}`, {
  //     state: {
  //       currentUser: user,
  //       edit: edit || false,
  //     },
  //   });
  // };
  const syncHandler = async () => {
    setSyncLoading(true);
    try {
      const resp = await API.get(
        `/api/sync-user-permissions?id=${selectedUser?.id}`
      );
      if (resp?.data?.success) {
        setSyncLoading(false);
        setOpenSyncAlert(false);
        Swal.fire({
          title: "Success!",
          text: resp?.data?.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        setSyncLoading(false);

        setOpenSyncAlert(false);
        Swal.fire({
          title: "Error!",
          text: "There was an issue sync role permissions. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setOpenSyncAlert(false);
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  // --------------------------------------------------------- check from role module

  useEffect(() => {
    if (location?.state?.role) {
      const role = roles?.roles.find((r) => r.name === location?.state?.role);
      getDocuments(1, rowsPerPage, role?.name);
      setFilterData({
        firstName: "",
        lastName: "",
        email: "",
        roles: [role?.id] || [],
        status: "active",
      });
      setFilterApplied(true);
    }
  }, []);
  const downloadHandler = (selected) => {
    if (selected?.file_path) {
      downloadHandlerFile(selected?.file_path);
    }
  };
  return !isLoading &&
    documents?.length === 0 &&
    countAppliedFilters(filterData) === undefined ? (
    <NodataFoundCard title={"No documents to display"} />
  ) : (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
        border: "1px solid rgba(222, 226, 230, 1)",
      }}
    >
      <ConfirmStatusModal
        isOpen={openSyncAlert}
        onClose={() => {
          setOpenSyncAlert(false);
          setSyncLoading(false);
        }}
        onConfirm={syncHandler}
        isLoading={syncLoading}
        title={"Sync permissions"}
        action={"Sync"}
        bodyText={
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "21px",
                pb: "1rem",
                color: "rgba(52, 58, 64, 1)",
              }}
            >
              Are you sure you want to sync role permissions?
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
            >
              Syncing roles will remove all current permissions of this user and
              assign permissions based on their assigned roles. Are you sure you
              want to proceed?
            </Typography>
          </Box>
        }
      />
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
          placeholder="Search documents by name"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getDocuments(pagination?.currentPage, pagination?.perPage);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                onClick={() =>
                  getDocuments(pagination?.currentPage, pagination?.perPage)
                }
              >
                <SearchIcon sx={{ cursor: "pointer" }} />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          sx={{
            borderBottom: "0.9px solid rgba(231, 234, 243, 0.7)",
            "& .MuiInputBase-input::placeholder": {
              fontSize: "12.64px",
              lineHeight: "15.3px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
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
            onClick={openFilterDrawer}
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontSize: ".8125rem",
              fontWeight: 400,
              borderColor: "rgba(231, 234, 243, .7)",
              "&:hover": {
                borderColor: "rgba(231, 234, 243, .7)",
              },
            }}
          >
            {countAppliedFilters(filterData) > 0 ? (
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
                  {countAppliedFilters(filterData)}
                </Box>
              </>
            ) : (
              "Filter"
            )}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          px: 2,
          alignItems: "center",
        }}
      >
        {/* Displaying user data */}
        {filterData
          ? Object.entries(filterData)?.map(([key, value]) => {
              if (value && value !== "" && value.length > 0) {
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
                    {key === "roles" && value?.length > 0 ? (
                      value?.map((role, index) => {
                        return (
                          <Button
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 0.5,
                              color: "#1E1022",
                              fontWeight: 500,
                              fontSize: "14px",
                              textTransform: "capitalize",
                              mb: 1,
                              border: "1px solid #DEE2E6",
                              bgcolor: "white",
                              borderRadius: "4px",
                              padding: "4px 8px",
                            }}
                          >
                            <Typography sx={{ flexGrow: 1 }}>
                              {key.replace("_", " ")}&nbsp;:&nbsp;
                              {roles?.roles.find((r) => r.id === role)?.name}
                            </Typography>
                            <Close
                              onClick={() => handleRemoveRole(role)}
                              sx={{ cursor: "pointer", fontSize: "1rem" }}
                            />
                          </Button>
                        );
                      })
                    ) : (
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
                          mb: 1, // Margin between buttons
                          border: "1px solid #DEE2E6",
                          bgcolor: "white",
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        {key.replace("_", " ")}&nbsp;:&nbsp;
                        {key === "status"
                          ? value.charAt(0).toUpperCase() + value.slice(1) // Capitalize status
                          : value}
                        <Close
                          onClick={() => handleRemove(key)} // Assuming `handleRemove` works here
                          sx={{ cursor: "pointer", fontSize: "1rem" }}
                        />
                      </Typography>
                    )}
                  </Box>
                );
              }
              return null;
            })
          : ""}
        {countAppliedFilters(filterData) ? (
          <ClearFilterDesign mb={1} clearFilters={clearFilterHandler} />
        ) : (
          ""
        )}
      </Box>

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
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
          <SkeletonRow column={matches ? 12 : 9} />
        </Box>
      ) : (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{ backgroundColor: "rgba(231, 234, 243, .4)" }}
                >
                  <BpCheckbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Document Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Purpose
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Last Updated{" "}
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    fontWeight: 500,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents?.map((document, index) => (
                <TableRow
                  key={index}
                  hover
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
                >
                  <TableCell padding="checkbox">
                    <BpCheckbox
                      checked={selectedDocuments.includes(document.id)}
                      onChange={(event) =>
                        handleCheckboxChange(event, document.id)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          onClick={() => viewDetailsHandler(document)}
                          variant="button"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                            color: "text.black",
                            "&:hover": {
                              color: "text.link",
                              cursor: "pointer",
                            },
                          }}
                        >
                          {document.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {/* <Chip label={document.status} size="small" /> */}
                    <CustomChip
                      dot
                      width={40}
                      dotColor={
                        document?.purpose === "signature"
                          ? "rgba(255, 193, 7, 1)"
                          : "rgba(0, 201, 167, 1)"
                      }
                      chipText={
                        document?.purpose === "signature"
                          ? "Signature required"
                          : "Download only "
                      }
                      color="rgba(103, 119, 136, 1)"
                      bgcolor={
                        document?.purpose === "signature"
                          ? "rgba(255, 193, 7, 0.1)"
                          : document?.purpose === "download"
                          ? "rgba(0, 201, 167, 0.1)"
                          : document?.status === "pending"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        // onClick={() => viewDetailsHandler(document)}
                        variant="button"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 400,
                          fontSize: "12.64px",
                          color: "text.or_color",
                        }}
                      >
                        {document?.description?.length > 20
                          ? `${document?.description?.slice(0, 20)}...`
                          : document?.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {document?.updated_at
                      ? formatOnlyDate(document?.updated_at)
                      : ""}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        color: "text.secondary",
                        borderColor: "#EEF0F7",
                        "&:hover": {
                          color: "text.btn_blue",
                          borderColor: "#EEF0F7",
                          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        },
                      }}
                      onClick={(e) => handleActionsClick(e, document)}
                    >
                      More
                      <ExpandMore sx={{ fontSize: "14px" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={pagination.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleActionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleActionsClose();
            openEditHandler(selectedUser);
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleActionsClose();
            openEditHandler(selectedUser);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleActionsClose();
            downloadHandler(selectedUser);
          }}
        >
          Download
        </MenuItem>

        {permissions?.includes("update user management user") && (
          <MenuItem
            onClick={() => {
              handleActionsClose();
              confirmDelete(selectedUser);
            }}
            sx={{ color: "error.main" }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
      <OrganizationDocFilter
        open={filterDrawerOpen}
        data={filterData}
        mode={"Filter"}
        rolesList={selectOptions(
          roles?.roles?.filter((item) => item?.name !== "provider")
        )}
        onClose={() => setFilterDrawerOpen(false)}
        onSave={(data) => {
          setFilterData(data);
          setFilterApplied(true);
          setPage(0);
          // getDocuments();
        }}
        countAppliedFilters={countAppliedFilters}
        clearFilter={clearFilterHandler}
      />
      <ExportDrawer
        open={exportDrawerOpen}
        onClose={() => setExportDrawerOpen(false)}
        columns={columns}
        onExport={handleExport}
        title="Export Providers  "
      />
    </Paper>
  );
};

export default DocumentsTable;
