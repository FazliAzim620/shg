import {
  Box,
  Button,
  Divider,
  Pagination,
  Stack,
  CircularProgress,
  TextField,
  InputAdornment,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import NoClientPage from "./NoClientPage";
import ClientRegistrationModal from "./ClientRegistrationModal";
import { useSelector, useDispatch } from "react-redux";
import { Add, SaveAltOutlined, Search } from "@mui/icons-material";
import ClientCard from "../../components/client-module/ClientCard";
import { fetchClientsInfo } from "../../thunkOperation/job_management/states";
import CardSkeleton from "../../provider_portal/provider_components/CardSkeleton";
import { SearchIcon } from "../../components/post-job/PostedJobsIcons";
import AlertMessage from "../../feature/alert-message/AlertMessage";
import API from "../../API";
import { checkGetReadyExport } from "../../api_request";
import ExportDrawer from "../../components/common/ExportDrawer";
import ExportAlert from "../../components/common/ExportAlert";
import NoPermissionCard from "../../components/common/NoPermissionCard";

const ClientListPage = () => {
  const dispatch = useDispatch();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const { clientsTableData, status, error } = useSelector(
    (state) => state.clientBasicInfo
  );

  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
    total: 0,
  });

  const [isOpen, setIsOpen] = useState(false);
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Clients" }];

  const addNewClientHandler = () => {
    setIsOpen(!isOpen);
    sessionStorage.setItem("clientModal", !isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.removeItem("clientModal");
    sessionStorage.removeItem("currentTabIndex");
  };

  const handlePageChange = async (event, newPage) => {
    setLoading(true);
    await getClients(newPage);
    setLoading(false);
  };

  const getClients = async (page = 1, clear) => {
    setLoading(true);
    try {
      const response = await dispatch(
        fetchClientsInfo({
          perpage: paginationData.perPage,
          page: page,
          search: clear ? "" : searchQuery || "",
        })
      ).unwrap();
      // Check if response has the expected structure
      if (response?.data) {
        setLoading(false);
        setPaginationData({
          currentPage: response.current_page,
          totalPages: response.last_page,
          perPage: response.per_page,
          total: response.total,
        });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    getClients(1);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(sessionStorage.getItem("clientModal"));
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    const query = event.target.value;

    setSearchQuery(query);
  };

  const handleSearch = () => {
    setLoading(true);
    getClients(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  // =========---------------------------------------------------------------------------- Export function
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [columns, setColumns] = useState([
    { name: "client_name" },
    { name: "phone" },
    { name: "email" },
    { name: "primary_contact" },
    { name: "primary_contact_role" },
    { name: "country" },
    { name: "state" },
    { name: "city" },
    { name: "zip_code" },
    { name: "created_at" },
  ]);

  const handleExportClick = () => {
    setExportDrawerOpen(true);
  };
  const [isExportLoading, setIsExportLoading] = useState(() => {
    return localStorage.getItem("exportLoading") === "postedJob";
  });
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  const handleExport = async (selectedColumns, fileType) => {
    const bodyData = {
      filetype: fileType,
      columns: selectedColumns?.join(","),
      search: searchQuery || "",
    };
    try {
      setIsExportLoading(true);
      setExportMessage(
        "Generating your export file. This may take a few moments."
      );
      const resp = await API.post(`/api/posted-jobs-export`, bodyData);
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
  if (permissions?.includes("read clients info")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <ClientRegistrationModal open={isOpen} handleClose={handleClose} />
        <ExportDrawer
          open={exportDrawerOpen}
          onClose={() => setExportDrawerOpen(false)}
          columns={columns}
          onExport={handleExport}
          title="Export Clients"
        />
        {location === "client" ? <AlertMessage /> : ""}

        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Breadcrumb items={breadcrumbItems} title={"clients"}>
            <Box>
              {permissions?.includes("create clients info") ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addNewClientHandler}
                  sx={{
                    textTransform: "initial",
                    bgcolor: "background.btn_blue",
                    boxShadow: "none",
                    py: 1,
                    px: 2,
                    mr: 1.1,
                    fontWeight: 400,
                  }}
                >
                  <Add
                    sx={{ fontWeight: 400, fontSize: "16px", mr: "0.5rem" }}
                  />
                  Add new
                </Button>
              ) : (
                ""
              )}
              {permissions?.includes("export clients info") ? (
                <Button
                  variant="outlined"
                  startIcon={<SaveAltOutlined />}
                  sx={{
                    textTransform: "capitalize",
                    color: "text.primary",
                    fontSize: " .8125rem",
                    bgcolor: "background.paper",
                    fontWeight: 400,
                    py: 1,
                    borderColor: "rgba(231, 234, 243, 1)",
                    "&:hover": {
                      borderColor: "rgba(231, 234, 243, 1)",
                    },
                  }}
                  onClick={handleExportClick}
                >
                  Export
                </Button>
              ) : (
                ""
              )}
            </Box>
          </Breadcrumb>
          <Divider sx={{ pt: 2, opacity: 0.3 }} />
          <Box
            sx={{
              flexGrow: 1,
              py: 4,
              px: 2,
              m: "0 auto",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                px: 2,
                py: 1,
                borderRadius: "10px",
                mr: { xl: 2 },
                maxWidth: 1440,
              }}
            >
              <TextField
                variant="standard"
                size="small"
                placeholder="Search client by name,email,location"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        onClick={handleSearch}
                        sx={{ cursor: "pointer", ml: 0.5 }}
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
                sx={{
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    color: "text.black",
                    fontSize: "12.64px",
                    lineHeight: "15.3px",
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                  },
                }}
              />
            </Box>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 2,
                  py: 4,
                }}
              >
                <CardSkeleton
                  timesheet={true}
                  style={{
                    maxWidth: 1440,
                    boxShadow: " 0px 6px 12px 0px #8C98A413",
                    px: 1.2,
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                />
                <CardSkeleton
                  timesheet={true}
                  style={{
                    maxWidth: 1440,
                    boxShadow: " 0px 6px 12px 0px #8C98A413",
                    px: 1.2,
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                />
                <CardSkeleton
                  timesheet={true}
                  style={{
                    maxWidth: 1440,
                    boxShadow: " 0px 6px 12px 0px #8C98A413",
                    px: 1.2,
                    borderRadius: "12px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                />
              </Box>
            ) : clientsTableData?.length > 0 ? (
              <Box>
                {isExportLoading && (
                  <ExportAlert severity={"info"} message={exportMessage} />
                )}
                {isExportSuccess && (
                  <ExportAlert severity={"success"} message={exportMessage} />
                )}
                {clientsTableData?.map((data, index) => (
                  <ClientCard
                    client={data}
                    key={data?.id || index}
                    index={index}
                  />
                ))}

                {/* Pagination Controls */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={paginationData.totalPages}
                    page={paginationData.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    disabled={loading}
                  />

                  {/* Pagination Info */}
                  <Box sx={{ typography: "body2", color: "text.secondary" }}>
                    Showing{" "}
                    {(paginationData.currentPage - 1) * paginationData.perPage +
                      1}{" "}
                    to{" "}
                    {Math.min(
                      paginationData.currentPage * paginationData.perPage,
                      paginationData.total
                    )}{" "}
                    of {paginationData.total} entries
                  </Box>
                </Box>
              </Box>
            ) : searchQuery ? (
              <Box align="center" pt={2}>
                <Typography variant="body2" py={2}>
                  No data found
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSearchQuery("");
                    getClients(1, "clear");
                  }}
                  size="small"
                  sx={{
                    textTransform: "initial",
                    bgcolor: "background.btn_blue",
                    boxShadow: "none",
                    py: 1,
                    px: 2,
                    mr: 1.1,
                    fontWeight: 400,
                  }}
                >
                  Clear Search
                </Button>
              </Box>
            ) : (
              <NoClientPage onClick={addNewClientHandler} />
            )}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ClientListPage;
