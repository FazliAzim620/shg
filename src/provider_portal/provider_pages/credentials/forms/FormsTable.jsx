import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Menu,
  MenuItem,
  TablePagination,
  useTheme,
  useMediaQuery,
  Avatar,
  styled,
  TextareaAutosize,
} from "@mui/material";
import { Add, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import CustomChip from "../../../../components/CustomChip";
import SkeletonRow from "../../../../components/SkeletonRow";
import ROUTES from "../../../../routes/Routes";
import API, { baseURLImage } from "../../../../API";
import NodataFoundCard from "../../../provider_components/NodataFoundCard";
import FormDrawer from "./FormDrawer";
import { DeleteConfirmModal as ConfirmRoleModal } from "../../../../components/handleConfirmDelete";
import { CommonInputField } from "../../../../components/job-component/CreateJobModal";
const StyledTextarea = styled(TextareaAutosize)(({ theme, isLightMode }) => ({
  width: "100%",
  border: "1px solid rgba(231, 234, 243, .6)",
  borderRadius: "4px", // optional: adjust for styling
  padding: "8px",
  resize: "vertical", // prevent resizing if desired
  outline: "none",
  height: "100",
  transition: "box-shadow 0.2s",
  backgroundColor: isLightMode ? "#f8fafd" : "#25282A",
  color: isLightMode ? "black" : "white",
  "&:focus": {
    boxShadow: " rgba(0, 0, 0, 0.09) 0px 3px 12px",
    backgroundColor: isLightMode ? "white" : "#25282A",
  },
}));

const FormsTable = ({
  openEditHandler,
  changeOccure,
  viewDetailsHandler,
  ipAddress,
  id,
  userId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.login);
  const darkMode = useSelector((state) => state.theme.mode);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));
  const { roles } = useSelector((state) => state.users);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [nweVersion, setNewVersion] = useState(null);
  const [notes, setNotes] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleActionsClick = (event, user) => {
    setActionsAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const [filterData, setFilterData] = useState(null);
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

  const getFormsHandler = async (data) => {
    let url = id
      ? `/api/get-prov-cred-form?for_provider_user_id=${
          userId ? userId : user?.user?.id
        }&page=${data.page || 1}&paginate=${1000}`
      : `/api/get-prov-cred-form?for_provider_user_id=${
          userId ? userId : user?.user?.id
        }&page=${data.page || 1}&paginate=${data.per_page}`;
    try {
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getForms = async (currentPage = 1, perPage = 10) => {
    setIsLoading(true);
    try {
      const data = { per_page: perPage, page: currentPage };
      const fetchedData = await getFormsHandler(data);
      if (fetchedData?.success) {
        if (location?.state?.role) {
          navigate(ROUTES?.userManagement, { state: { role: null } });
        }
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

  const handleDeleteDocument = async () => {
    setIsLoading(true);
    try {
      const response = await API.delete(
        `/api/admin/credentialing/delete-form-submission/${selectedUser?.submitted_forms?.[0]?.id}`
      );
      if (response.data.success) {
        await getForms(page + 1, rowsPerPage);
        Swal.fire({
          icon: "success",
          title: "Document Deleted",
          text: "The document has been successfully deleted.",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete document.",
      });
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleApproveDocument = async () => {
    setIsLoading(true);
    try {
      const response = await API.post(
        `api/admin/credentialing/update-form-submission-status`,
        {
          submission_id: selectedUser?.submitted_forms?.[0]?.id,
          admin_status: 1,
          admin_notes: notes,
        }
      );
      if (response.data.success) {
        await getForms(page + 1, rowsPerPage);
        Swal.fire({
          icon: "success",
          title: "Document Approved",
          text: "The document has been successfully approved.",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve document.",
      });
    } finally {
      setIsLoading(false);
      setApproveModalOpen(false);
    }
  };
  const handleRejectDocument = async () => {
    setIsLoading(true);
    try {
      const response = await API.post(
        `api/admin/credentialing/update-form-submission-status`,
        {
          submission_id: selectedUser?.submitted_forms?.[0]?.id,
          admin_status: 2,
          admin_notes: notes,
        }
      );
      if (response.data.success) {
        await getForms(page + 1, rowsPerPage);
        Swal.fire({
          icon: "success",
          title: "Document Rejected",
          text: "The document has been successfully rejected.",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject document.",
      });
    } finally {
      setIsLoading(false);
      setRejectModalOpen(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getForms(newPage + 1, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getForms(1, newRowsPerPage);
  };

  useEffect(() => {
    if (!location?.state?.role) {
      getForms(page + 1, rowsPerPage);
    }
  }, [page, rowsPerPage, filterData, changeOccure]);

  useEffect(() => {
    if (location?.state?.role) {
      getForms(1, rowsPerPage);
    }
  }, []);

  const handleOpenDrawer = (document) => {
    setSelectedDocument(document);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedDocument(null);
    setNewVersion(null);
  };

  const handleEditHandler = (document) => {
    setSelectedDocument(document);
    setDrawerOpen(true);
  };

  // Filter documents on frontend based on id
  const filteredDocuments =
    id !== null && id !== undefined
      ? documents.filter((doc) => doc.id === id)
      : documents;

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
          border: "1px solid rgba(222, 226, 230, 1)",
        }}
      >
        {isLoading ? (
          <Box sx={{ textAlign: "center", mx: "auto" }}>
            <SkeletonRow column={matches ? 12 : 9} />
            <SkeletonRow column={matches ? 12 : 9} />
            <SkeletonRow column={matches ? 12 : 9} />
            <SkeletonRow column={matches ? 12 : 9} />
          </Box>
        ) : filteredDocuments?.length === 0 &&
          countAppliedFilters(filterData) === undefined ? (
          <NodataFoundCard title={"No documents to display"} />
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
                    Document Name
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
                    Sent
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(231, 234, 243, .4)",
                      fontSize: "11.9px",
                      fontWeight: 500,
                    }}
                  >
                    Filled by
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
                {filteredDocuments?.map((document, index) =>
                  document?.submitted_forms?.length > 0 ? (
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
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
                        <CustomChip
                          dot
                          width={40}
                          dotColor={
                            document?.submitted_forms?.[
                              document?.submitted_forms?.length - 1
                            ]?.admin_status === 1
                              ? "rgba(0, 201, 167, 1)"
                              : document?.submitted_forms?.[
                                  document?.submitted_forms?.length - 1
                                ]?.admin_status === 2
                              ? "#DC3545"
                              : "rgba(255, 193, 7, 1)"
                          }
                          chipText={
                            document?.submitted_forms?.[
                              document?.submitted_forms?.length - 1
                            ]?.admin_status === 1
                              ? "Approved"
                              : document?.submitted_forms?.[
                                  document?.submitted_forms?.length - 1
                                ]?.admin_status === 2
                              ? "Rejected"
                              : "Pending"
                          }
                          color="rgba(103, 119, 136, 1)"
                          bgcolor={
                            document?.submitted_forms?.length > 0
                              ? "rgba(0, 201, 167, 0.1)"
                              : document?.submitted_forms?.[
                                  document?.submitted_forms?.length - 1
                                ]?.admin_status === 0
                              ? "rgba(237, 76, 120, 0.1)"
                              : "rgba(255, 193, 7, 0.1)"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {
                          document?.submitted_forms?.[
                            document?.submitted_forms?.length - 1
                          ]?.created_at?.split("T")[0]
                        }
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            size="small"
                            sx={{
                              width: 35,
                              height: 35,
                            }}
                          >
                            {document?.submitted_forms?.[
                              document?.submitted_forms?.length - 1
                            ]?.submitted_by_user?.name
                              ?.slice(0, 2)
                              .toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "text.black",
                            }}
                          >
                            {
                              document?.submitted_forms?.[
                                document?.submitted_forms?.length - 1
                              ]?.submitted_by_user?.name
                            }
                          </Typography>
                        </Box>
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
                    </TableRow>
                  ) : (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
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
                      <TableCell colSpan={4}>
                        <Button
                          onClick={() => {
                            setSelectedUser(null);
                            handleOpenDrawer(document);
                          }}
                          variant="text"
                          color="primary"
                          sx={{
                            textTransform: "none",
                            outline: "none",
                            p: "8px 16px",
                            fontWeight: 400,
                            fontSize: "1rem",
                            lineHeight: "150%",
                          }}
                        >
                          Add new{" "}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
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
              viewDetailsHandler(selectedUser);
            }}
          >
            View details
          </MenuItem>
          {selectedUser?.has_multiple_submissions ? (
            <MenuItem
              onClick={() => {
                handleOpenDrawer(selectedUser);
                handleActionsClose();
                setNewVersion(selectedUser?.id);
              }}
            >
              Upload new version
            </MenuItem>
          ) : (
            ""
          )}
          {!selectedUser?.has_multiple_submissions && (
            <MenuItem
              onClick={() => {
                handleActionsClose();
                handleEditHandler(selectedUser);
              }}
            >
              Edit
            </MenuItem>
          )}

          {!selectedUser?.has_multiple_submissions ? (
            <MenuItem
              onClick={() => {
                handleActionsClose();
                setDeleteModalOpen(true);
              }}
              sx={{ color: "red" }}
            >
              Delete
            </MenuItem>
          ) : (
            ""
          )}
          {!selectedUser?.has_multiple_submissions ? (
            <MenuItem
              onClick={() => {
                handleActionsClose();
                setApproveModalOpen(true);
              }}
            >
              Approve
            </MenuItem>
          ) : (
            ""
          )}
          {!selectedUser?.has_multiple_submissions ? (
            <MenuItem
              onClick={() => {
                handleActionsClose();
                setRejectModalOpen(true);
              }}
            >
              Reject
            </MenuItem>
          ) : (
            ""
          )}
        </Menu>
        <ConfirmRoleModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteDocument}
          isLoading={isLoading}
          title={"Delete Document"}
          action={"Delete"}
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
                Are you sure you want to delete this document?
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "21px" }}
              >
                Deleting this document will permanently remove it and all
                associated data. This action cannot be undone. Are you sure you
                want to proceed?
              </Typography>
            </Box>
          }
        />
        <ConfirmRoleModal
          isOpen={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={handleApproveDocument}
          isLoading={isLoading}
          title={"Approve Document"}
          action={"Approve"}
          bgcolor={"rgba(55, 125, 255)"}
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
                Are you sure you want to approve this document?
              </Typography>

              <CommonInputField
                name="status_notes"
                placeholder={`Provide a brief note or reason for approve the document...`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                error={!notes}
              />
            </Box>
          }
        />
        <ConfirmRoleModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={handleRejectDocument}
          isLoading={isLoading}
          title={"Reject Document"}
          action={"Reject"}
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
                Are you sure you want to reject this document?
              </Typography>

              <CommonInputField
                name="status_notes"
                placeholder={`Provide a brief note or reason for rejecting the document...`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                error={!notes}
              />
            </Box>
          }
        />
      </Paper>
      {selectedDocument?.json_structure ? (
        <FormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          jsonStructure={JSON.parse(selectedDocument?.json_structure)}
          documentName={selectedDocument?.name}
          selectedId={selectedDocument?.id}
          name={selectedDocument?.name}
          formId={
            selectedDocument?.submitted_forms?.[
              selectedDocument?.submitted_forms?.length - 1
            ]?.id
          }
          reloadData={getForms}
          ipAddress={ipAddress}
          userId={userId}
          selectedForm={
            nweVersion
              ? ""
              : selectedUser?.submitted_forms
              ? JSON.parse(
                  selectedUser?.submitted_forms?.[
                    selectedUser?.submitted_forms?.length - 1
                  ]?.json_structure
                )
              : ""
          }
        />
      ) : (
        ""
      )}
    </>
  );
};

export default FormsTable;
