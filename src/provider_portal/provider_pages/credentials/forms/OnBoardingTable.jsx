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
import UploadDocument from "./UploadDocument";
import OnboardingView from "./OnboardingView";

const OnBoardingTable = ({
  openEditHandler,
  changeOccure,
  viewDetailsHandler,
  ipAddress,
  id,
  setOnBoardingAdd,
  onboardingAdd,
  userId,
  name,
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
  const [selectedForm, setSelectedForm] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

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
      const data = { per_page: perPage };
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
    setOnBoardingAdd(false);
  };

  const handleEditHandler = (document) => {
    setSelectedDocument(document);
    setDrawerOpen(true);
  };
  const viewHandler = (data) => {
    setOpenViewModal(true);
  };
  // Filter documents on frontend based on id
  const filteredDocuments =
    id !== null && id !== undefined
      ? documents.filter((doc) => doc.id === id)
      : documents;
  //   console.log("documents-------------------", documents);
  //   console.log("filteredDocuments-------------------", filteredDocuments);
  const data = id ? filteredDocuments?.[0]?.submitted_forms : filteredDocuments;
  useEffect(() => {
    if (onboardingAdd) {
      setDrawerOpen(true);
      setSelectedDocument(filteredDocuments?.[0]);
    }
  }, [onboardingAdd]);

  return (
    <>
      <OnboardingView
        open={openViewModal}
        mode={"edit"}
        data={selectedUser}
        selectedForm={selectedForm}
        onClose={() => {
          setIsLoading(false);
          setOpenViewModal(false);
        }}
      />
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
                  {name == "Languages" ? (
                    ""
                  ) : (
                    <TableCell
                      sx={{
                        backgroundColor: "rgba(231, 234, 243, .4)",
                        fontSize: "11.9px",
                        fontWeight: 500,
                      }}
                    >
                      Status
                    </TableCell>
                  )}
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
                {data?.map((document, index) =>
                  document?.submitted_forms?.length > 0 || id ? (
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
                              onClick={() =>
                                // viewDetailsHandler(filteredDocuments?.[0])
                                {
                                  setSelectedForm(document);
                                  viewHandler(filteredDocuments?.[0]);
                                }
                              }
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
                              {filteredDocuments?.[0]?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      {name == "Languages" ? (
                        ""
                      ) : (
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
                      )}
                      <TableCell>
                        {document?.created_at?.split("T")[0]}
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
                            {document?.submitted_by_user?.name
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
                            {document?.submitted_by_user?.name}
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
                          onClick={(e) => {
                            handleActionsClick(e, filteredDocuments?.[0]);
                            setSelectedForm(document);
                          }}
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
                              onClick={() =>
                                viewDetailsHandler(filteredDocuments?.[0])
                              }
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
                              {filteredDocuments?.[0]?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell colSpan={4}>
                        <Button
                          onClick={() => {
                            setSelectedUser(null);
                            handleOpenDrawer(filteredDocuments?.[0]);
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
                count={filteredDocuments.length} // Use filtered documents length for pagination
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
              //   viewDetailsHandler(selectedUser);
              viewHandler();
            }}
          >
            View details
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleActionsClose();
              handleEditHandler(selectedUser);
            }}
          >
            Edit
          </MenuItem>
        </Menu>
      </Paper>
      {selectedDocument?.json_structure ? (
        <FormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          jsonStructure={JSON.parse(selectedDocument?.json_structure)}
          documentName={selectedDocument?.name}
          selectedId={selectedDocument?.id}
          formId={
            selectedDocument?.submitted_forms?.[
              selectedDocument?.submitted_forms?.length - 1
            ]?.id
          }
          reloadData={getForms}
          ipAddress={ipAddress}
          //   selectedForm={
          //     nweVersion
          //       ? ""
          //       : selectedUser?.submitted_forms
          //       ? JSON.parse(
          //           selectedUser?.submitted_forms?.[
          //             selectedUser?.submitted_forms?.length - 1
          //           ]?.json_structure
          //         )
          //       : ""
          //   }
          selectedForm={
            onboardingAdd ? "" : JSON.parse(selectedForm?.json_structure)
          }
        />
      ) : (
        ""
      )}
    </>
  );
};

export default OnBoardingTable;
