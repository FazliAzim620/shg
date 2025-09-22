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
  Typography,
  Menu,
  MenuItem,
  Chip,
  TablePagination,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";

import {
  FilterList,
  SaveAltOutlined,
  ExpandMore,
  Close,
  Error,
} from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { useSelector } from "react-redux";
import AddEditDocument from "../documents/AddEditDocument";

import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";
import CustomChip from "../../../../components/CustomChip";
import SkeletonRow from "../../../../components/SkeletonRow";
import ROUTES from "../../../../routes/Routes";
import { DeleteConfirmModal as ConfirmStatusModal } from "../../../../components/handleConfirmDelete";
import API from "../../../../API";
import Loading from "../../../../components/common/Loading";
import { editRefFormData } from "../../../../feature/form-builder/referenceFormSlice";
import NodataFoundCard from "../../../provider_components/NodataFoundCard";

const FormsTable = ({
  changeOccure,
  confirmDelete,
  viewDetailsHandler,
  openEditHandler,
  updateStatus,
  trigger,
  id,
  addHandler,
  userId,
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
  const { user } = useSelector((state) => state.login);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [minimumSubmitRef, setMinimumSubmitRef] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  const handleActionsClick = (event, doc) => {
    setActionsAnchorEl(event.currentTarget);
    setSelectedDocument(doc);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  // =========---------------------------------------------------------------------------- Filter function
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterData, setFilterData] = useState(null);

  const countAppliedFilters = (filters) => {
    if (filters) {
      let count = 0;

      Object?.values(filters)?.forEach((value) => {
        if (Array.isArray(value)) {
          count += value?.filter((item) => item !== "").length;
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

  // =========---------------------------------------------------------------------------- Export function
  const [documentTypes, setDocumentTypes] = useState(null);

  // =========---------------------------------------------------------------------------- Export function end

  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedDocuments((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedDocuments((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  const getReferenceForms = async (data) => {
    let url = id
      ? `/api/get-prov-cred-prof-ref?for_provider_user_id=${
          userId ? userId : user?.user?.id
        }&page=${data.page || 1}&paginate=${1000}`
      : `/api/get-prov-cred-prof-ref?for_provider_user_id=${
          userId ? userId : user?.user?.id
        }&page=${data.page || 1}&paginate=${data.per_page}`;

    try {
      const response = await API.get(url);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // Filter documents based on the id prop
  const filteredDocuments =
    id !== null && id !== undefined
      ? documents?.filter((doc) => doc.id === id)
      : documents;

  const getDocuments = async (currentPage = 1, perPage = 10) => {
    setIsLoading(true);

    try {
      const data = {
        page: currentPage,
        per_page: perPage,
      };

      const fetchedData = await getReferenceForms(data);
      // Update pagination state
      if (fetchedData?.data?.success) {
        setMinimumSubmitRef(fetchedData?.data?.min_profess_ref_to_submit);
        if (location?.state?.role) {
          navigate(ROUTES?.userManagement, { state: { role: null } });
        }
        setIsLoading(false);
        setDocuments(fetchedData?.data?.data?.data);
        setPagination((prevPagination) => ({
          ...prevPagination,
          currentPage: fetchedData?.data?.data?.current_page,
          total: fetchedData?.data?.data?.total,
          lastPage: fetchedData?.data?.data?.last_page,
        }));
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
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

  const getDocumentTypesHandler = async () => {
    try {
      const resp = await API.get(`/api/get-cred-doctypes`);
      if (resp?.data?.success) {
        setDocumentTypes(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocumentTypesHandler();
  }, []);

  useEffect(() => {
    if (!location?.state?.role) {
      getDocuments(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage, filterData, changeOccure, trigger]);

  const confirmDuplicate = async () => {
    try {
      const resp = await API.get(
        `/api/duplicate-cred-profess-ref-form/${selectedDocument?.id}`
      );
      if (resp?.data?.success) {
        setIsDuplicate(!isDuplicate);
        getDocuments(page + 1, rowsPerPage);
        Swal.fire({
          title: "Success!",
          text: resp?.data?.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
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
    }
  }, []);

  const [clickedId, setClickedId] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);

  const handleCloseMenu = (e) => {
    e.stopPropagation();
    setAnchorEl1(null);
  };

  const statusHandler = async (status) => {
    try {
      setIsStatusLoading(true);
      const resp = await API.post(`/api/update-cred-profess-ref-form-status`, {
        id: clickedId,
        is_active: status,
      });
      if (resp?.data?.success) {
        setIsStatusLoading(false);
        getDocuments(page + 1, rowsPerPage);
        Swal.fire({
          title: "Success!",
          text: resp?.data?.msg,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setIsStatusLoading(false);
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

  const dropdownOptions = [
    {
      label: "Active",
      action: () => statusHandler(1),
    },
    {
      label: "In active",
      action: () => statusHandler("0"),
    },
  ];

  const editHandler = () => {
    const formData = {
      id: selectedDocument?.id,
      name: selectedDocument?.name,
      roles: selectedDocument?.provider_roles?.map(
        (item) => item?.provider_role_id
      ),
    };
    handleActionsClose();
    dispatch(editRefFormData(formData));
    navigate(`${ROUTES.referenceForm}`, {
      state: {
        editData: selectedDocument?.json_structure,
      },
    });
  };

  const closeModal = () => {
    setIsDuplicate(false);
  };
  return !isLoading &&
    filteredDocuments?.length === 0 &&
    countAppliedFilters(filterData) === undefined ? (
    <NodataFoundCard title={"No documents to display"} />
  ) : (
    <>
      <Alert severity="info" sx={{ mb: 3 }} icon={<Error fontSize="inherit" />}>
        {userId ? (
          `No of minimum ${minimumSubmitRef} reference submission required. You can submit references on behalf of this provider.`
        ) : (
          <>
            You have to submit minimum <b>{minimumSubmitRef} references</b> for
            the admin.
          </>
        )}
      </Alert>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          border: "1px solid rgba(222, 226, 230, 1)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            onClick={() => addHandler(filteredDocuments?.[0])}
            sx={{ textTransform: "capitalize" }}
          >
            Submit New Reference
          </Button>
        </Box>
        <ConfirmStatusModal
          isOpen={isDuplicate}
          onClose={closeModal}
          onConfirm={confirmDuplicate}
          isLoading={isLoading}
          title={"Duplicate"}
          action={"Duplicate"}
          bodyText={
            <Typography variant="body2">
              Are you sure you want to duplicate this document form? This action
              will create a copy of the form with all its current details.
              Please ensure that this action is correct before proceeding.
            </Typography>
          }
        />

        <Loading open={isStatusLoading} />

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
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    {userId ? "Referee" : "References"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Approved by
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Status
                  </TableCell>

                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Submission Date
                  </TableCell>
                  {userId && (
                    <TableCell
                      sx={{
                        backgroundColor: "rgba(231, 234, 243, .4)",
                        fontSize: "11.9px",
                        fontWeight: 500,
                      }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments?.[0]?.submitted_forms?.map(
                  (document, index) => (
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
                      <TableCell>
                        {userId ? (
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            >
                              {document?.submitted_by_user?.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {document?.submitted_by_user?.email}
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                onClick={() => {
                                  document.submitted_forms
                                    ? ""
                                    : viewDetailsHandler(
                                        document,
                                        filteredDocuments?.[0]
                                      );
                                }}
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
                                {filteredDocuments?.[0].name?.length > 25
                                  ? `${filteredDocuments?.[0].name?.slice(
                                      0,
                                      25
                                    )}...`
                                  : filteredDocuments?.[0].name}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </TableCell>

                      <TableCell>
                        {userId ? (
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            {/* Avatar */}
                            <Avatar
                              alt={document?.admin_status_by_user?.name}
                              src={document?.admin_status_by_user?.avatarUrl}
                            >
                              {document?.admin_status_by_user?.name?.[0]}
                            </Avatar>

                            {/* Name and Email */}
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  textTransform: "capitalize",
                                }}
                              >
                                {document?.admin_status_by_user?.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {document?.admin_status_by_user?.email}
                              </Typography>
                            </Box>
                          </Stack>
                        ) : (
                          "--"
                        )}
                      </TableCell>

                      <TableCell>
                        <CustomChip
                          dot
                          id={document?.id}
                          width={60}
                          dotColor={
                            document?.length === 0
                              ? "rgba(237, 76, 120, 1)"
                              : document?.admin_status === 1
                              ? "rgba(0, 201, 167, 1)"
                              : document?.admin_status == "0"
                              ? "rgba(255, 193, 7, 1)"
                              : document?.admin_status === 2
                              ? "rgba(237, 76, 120, 1)"
                              : "rgba(237, 76, 120, 1)"
                          }
                          chipText={
                            document?.length === 0
                              ? "Not submitted"
                              : document?.admin_status === 1
                              ? "Approved"
                              : document?.admin_status === 0
                              ? "Pending"
                              : document?.admin_status === 2
                              ? "Rejected"
                              : "Not submitted"
                          }
                          color="rgba(103, 119, 136, 1)"
                          bgcolor={
                            document?.length === 0
                              ? "rgba(237, 76, 120, 0.1)"
                              : document?.admin_status === 1
                              ? "rgba(0, 201, 167, 0.1)"
                              : document?.admin_status === 0
                              ? "rgba(255, 193, 7, 0.1)"
                              : document?.admin_status === 2
                              ? "rgba(237, 76, 120, 0.1)"
                              : "rgba(237, 76, 120, 0.1)"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {
                          new Date(document?.updated_at)
                            .toISOString()
                            .split("T")[0]
                        }
                        {/* <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {document?.provider_roles?.length > 0 ? (
                            <>
                              {document?.provider_roles
                                ?.slice(0, 2)
                                .map((role, index) => (
                                  <Chip
                                    key={index}
                                    label={role?.provider_role?.name || "--"}
                                    size="small"
                                    sx={{
                                      backgroundColor:
                                        "rgba(55, 125, 255, 0.1)",
                                      borderRadius: "4px",
                                      color: "rgba(103, 119, 136, 1)",
                                      textTransform: "capitalize",
                                    }}
                                  />
                                ))}
                              {document?.provider_roles?.length > 2 && (
                                <Tooltip
                                  arrow
                                  placement="top"
                                  title={
                                    <Box sx={{ textAlign: "start" }}>
                                      <ul
                                        style={{
                                          textAlign: "start",
                                          paddingLeft: "10px",
                                        }}
                                      >
                                        {document?.provider_roles
                                          ?.slice(2)
                                          .map((role, index) => (
                                            <li key={index}>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  fontSize: "0.75rem",
                                                  fontWeight: 400,
                                                  color: "#ffffff",
                                                }}
                                              >
                                                {role?.provider_role?.name}
                                              </Typography>
                                            </li>
                                          ))}
                                      </ul>
                                    </Box>
                                  }
                                >
                                  <Chip
                                    key="count"
                                    label={`+${
                                      document?.provider_roles?.length - 2
                                    }`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "rgba(222, 226, 230, 1)",
                                      borderRadius: "4px",
                                      color: "rgba(30, 32, 34, 1)",
                                      textTransform: "capitalize",
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </>
                          ) : (
                            "--"
                          )}
                        </Box> */}
                      </TableCell>
                      {userId && (
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
                                boxShadow:
                                  "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                              },
                            }}
                            onClick={(e) => handleActionsClick(e, document)}
                          >
                            More
                            <ExpandMore sx={{ fontSize: "14px" }} />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {id ? (
          ""
        ) : (
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={pagination.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        <Menu
          anchorEl={anchorEl1}
          open={Boolean(anchorEl1)}
          onClose={handleCloseMenu}
        >
          {dropdownOptions.map((action, index) => (
            <MenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                action.action();
                handleCloseMenu(e);
              }}
            >
              {action.label}
            </MenuItem>
          ))}
        </Menu>
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
              viewDetailsHandler(selectedDocument, filteredDocuments?.[0]);
            }}
          >
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActionsClose();
              updateStatus(selectedDocument, 1);
            }}
          >
            Approve
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActionsClose();
              updateStatus(selectedDocument, 2);
            }}
          >
            Reject
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleActionsClose();
              openEditHandler(selectedDocument, filteredDocuments?.[0]);
            }}
          >
            Edit
          </MenuItem>
          {selectedDocument?.admin_status === 0 && (
            <MenuItem
              onClick={() => {
                handleActionsClose();
                confirmDelete(selectedDocument);
              }}
              sx={{ color: "red" }}
            >
              Delete
            </MenuItem>
          )}
        </Menu>
      </Paper>
    </>
  );
};

export default FormsTable;
