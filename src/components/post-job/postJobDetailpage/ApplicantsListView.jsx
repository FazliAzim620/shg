import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Pagination,
  PaginationItem,
  styled,
} from "@mui/material";
import CustomChip from "../../CustomChip";
import { HeadingCommon } from "../../../provider_portal/provider_components/settings/profile/HeadingCommon";
import MoreActionMenu from "../../common/MoreActionMenu";
import SearchIcon from "@mui/icons-material/Search";
import {
  ExpandMoreOutlined,
  Person,
  SaveAltOutlined,
} from "@mui/icons-material";
import DrawerFilters from "../../common/DrawerFilters";
import ApplicantFilters from "./ApplicantFilters";
import AvatarNameEmail from "../../common/AvatarNameEmail";
import ViewApplicantDetails from "./ViewApplicantDetails";
import { applicants } from "../../constants/data";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
const ApplicantsListView = ({
  data,
  darkMode,
  pagination,
  handleChangeRowsPerPage,
  handleChangePage,
  isLoading,
  updateStatusHandler,
  deleteOpenModalWithId,
  setDeleteOpenModalWithId,
  deleteLoader,
  setDeleteLoader,
  deleteApplicantHandler,
}) => {
  const [clickedId, setClickedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  // =====================================export menu======================================
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickExpandMore = (event, id) => {
    event.stopPropagation();
    setClickedId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const dropdownOptions = [
    {
      label: "Contacted",
      action: () => updateStatusHandler("contacted", clickedId),
    },
    {
      label: "Shortlisted",
      action: () => updateStatusHandler("shortlisted", clickedId),
    },
    {
      label: "Interviewed",
      action: () => updateStatusHandler("interviewed", clickedId),
    },
    {
      label: "Hired",
      action: () => updateStatusHandler("hired", clickedId),
    },
    {
      label: "Rejected",
      action: () => updateStatusHandler("rejected", clickedId),
    },
  ];
  const actions = [
    {
      label: "Shortlist",
      action: (id) => updateStatusHandler("shortlisted", id),
    },
    {
      label: "Reject",
      action: (id) => updateStatusHandler("rejected", id),
    },
    {
      label: "Contact",
      action: (id) => updateStatusHandler("contacted", id),
    },
    {
      label: "View Detail",
      action: handleOpenDrawer,
    },
    {
      label: "Delete",
      action: (id) => setDeleteOpenModalWithId(id),
    },
  ];
  // ====================pagination==================
  const [page, setPage] = useState(1);
  const totalPages = 18;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    handleChangePage(event, newPage - 1);
  };
  // ==================== pagination style ==================
  const CustomPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
      color: theme.palette.primary.main,
      "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      "&.Mui-disabled": {
        color: theme.palette.grey[400],
      },
      "&.MuiPaginationItem-previousNext": {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: "50%",
        width: 32,
        height: 32,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
  }));
  const [paginationAnchorEl, setPaginationAnchorEl] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const paginationOptions = [20, 30, 50];

  const handlePaginationClick = (event) => {
    setPaginationAnchorEl(event.currentTarget);
  };

  const handleClosePaginationMenu = (option) => {
    setPaginationAnchorEl(null);
    if (!option.type) {
      setItemsPerPage(option);
      handleChangeRowsPerPage(option);
    }
  };
  const deleteModalClose = () => {
    setDeleteOpenModalWithId(false);
  };

  return (
    <Box px={2}>
      <DeleteConfirmModal
        closeJob={true}
        isOpen={deleteOpenModalWithId}
        onClose={deleteModalClose}
        onConfirm={deleteApplicantHandler}
        isLoading={deleteLoader}
        itemName={"Applicant"}
        title={"Delete Applicant"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to Delete this job?
          </Typography>
        }
      />
      {/* / ============================listview cards==================== / */}
      {data?.map((applicant, ind) => (
        <Card
          key={ind}
          onClick={() => {
            handleOpenDrawer();
            setDetails(applicant);
          }}
          sx={{
            maxWidth: 1440,
            boxShadow: " 0px 6px 12px 5px #8C98A413",
            border: "1px solid #DEE2E6",
            my: 2,
            py: 1,
            px: 1.2,
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          <CardContent>
            {/* =============applicant detail and ellipses space between==========  */}
            <Box
              onClick={() => setDetails(applicant)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <AvatarNameEmail
                username={applicant?.name}
                email={applicant?.email}
              />
              <MoreActionMenu
                stopPropagation={true}
                options={actions}
                id={applicant?.id}
                darkMode="light"
                setViewDetails={setDetails}
                job={applicant}
              />
            </Box>

            {/* ===============applicant qualification and experience for the job=============  */}
            <Box sx={{ my: 1, display: "flex", alignItems: "center", gap: 2 }}>
              {[
                { label: "Qualification ", value: applicant?.qualification },
                { label: "Location", value: applicant?.location },
                {
                  label: "Apply date",
                  value: applicant?.created_at?.split("T")[0],
                },
                { label: "Experience", value: applicant?.experience },
              ].map((detail, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderLeft: index > 0 ? "1.5px solid #DEE2E6" : "none",
                    height: "29px",
                    pl: index > 0 ? "5px" : 0,
                  }}
                >
                  <Typography sx={{ textTransform: "none", fontSize: "14px" }}>
                    {detail.label}:&nbsp;
                  </Typography>
                  <HeadingCommon
                    mb="0px"
                    fontSize="14px"
                    title={detail.value}
                    transform={"capitalize"}
                  />
                </Box>
              ))}
            </Box>
            {/* {/ ============================ status ======================== /} */}

            <CustomChip
              id={applicant?.id}
              handleClickExpandMore={handleClickExpandMore}
              mt={1}
              dot={true}
              dropdown={true}
              dotColor={
                applicant?.status === "shortlisted"
                  ? "#00c9a7"
                  : applicant?.status === "applied"
                  ? "rgba(255, 193, 7, 1)"
                  : applicant?.status === "rejected"
                  ? "rgba(237, 76, 120, 1)"
                  : applicant?.status === "hired"
                  ? "#00c9a7"
                  : applicant?.status === "interviewed"
                  ? "rgba(255, 193, 7, 1)"
                  : applicant?.status === "contacted"
                  ? "rgba(255, 193, 7, 1)"
                  : "rgba(255, 193, 7, 1)"
              }
              color={
                darkMode === "dark" ? "#fff" : "rgba(103, 119, 136, 1)"
                // applicant?.status === "shortlisted"
                //   ? "#00c9a7"
                //   : applicant?.status === "applied"
                //   ? "#677788"
                //   : applicant?.status === "rejected"
                //   ? "#677788"
                //   : applicant?.status === "hired"
                //   ? "#fff"
                //   : applicant?.status === "interviewed"
                //   ? "#fff"
                //   : applicant?.status === "contacted"
                //   ? "#677788"
                //   : "#DC3545"
              }
              bgcolor={
                applicant?.status === "shortlisted"
                  ? "rgba(0, 201, 167, 0.1)"
                  : applicant?.status === "applied"
                  ? "rgba(255, 193, 7, 0.1)"
                  : applicant?.status === "rejected"
                  ? "rgba(237, 76, 120, 0.1)"
                  : applicant?.status === "hired"
                  ? "#00c9a7"
                  : applicant?.status === "interviewed"
                  ? "rgba(255, 193, 7, 0.1)"
                  : applicant?.status === "contacted"
                  ? "rgba(255, 193, 7, 0.1)"
                  : "#eedfe4"
              }
              chipText={
                applicant?.status === "applied" ? "Pending" : applicant?.status
              }
              textTransform={"capitalize"}
              weight={400}
            />
          </CardContent>
        </Card>
      ))}
      {/* / ==========================listview pagination================= / */}
      <Box
        sx={{
          maxWidth: 1440,
          boxShadow: " 0px 6px 12px 5px #8C98A413",
          border: "1px solid #DEE2E6",
          my: 3,
          py: "16px",
          px: "24px",
          borderRadius: "12px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: darkMode === "dark" ? "#fff" : "#1E2022",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {(pagination.currentPage - 1) * pagination.perPage + 1}-
          {Math.min(
            pagination.currentPage * pagination.perPage,
            pagination.total
          )}{" "}
          of {`${pagination.total < 10 ? "0" : ""}${pagination.total}`} items
        </Typography>

        <Pagination
          count={pagination.lastPage}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                height: "28px",
                width: "28px",
                borderRadius: "4px",
                "&.Mui-selected": {
                  fontSize: "14px",
                  backgroundColor: "#EBF2FF",
                  color: "#377DFF",
                },
                ...(item.type === "first" ||
                item.type === "last" ||
                item.type === "previous" ||
                item.type === "next"
                  ? {
                      height: "28px",
                      width: "28px",
                      backgroundColor: "#377DFF",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#285BB5",
                      },
                    }
                  : {}),
              }}
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              height: "28px",
              bgcolor: "#377DFF",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pl: "9px",
              pr: "4.5px",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              {itemsPerPage}
              <ExpandMoreOutlined onClick={handlePaginationClick} />
            </Typography>
          </Box>
          <Typography
            sx={{
              color: darkMode === "dark" ? "#fff" : "#1E2022",
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            Items per page
          </Typography>
        </Box>
        {/* Menu component */}
        <Menu
          anchorEl={paginationAnchorEl}
          open={Boolean(paginationAnchorEl)}
          onClose={handleClosePaginationMenu}
        >
          {paginationOptions.map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                // action.action();
                handleClosePaginationMenu(action);
              }}
            >
              {action}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      {/* / ================open applicant detail drawr================= / */}
      <ViewApplicantDetails
        open={drawerOpen}
        onClose={handleCloseDrawer}
        details={details}
      />
      {/* / ==============================export Menu========================= / */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {dropdownOptions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.action();
              handleCloseMenu();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ApplicantsListView;
