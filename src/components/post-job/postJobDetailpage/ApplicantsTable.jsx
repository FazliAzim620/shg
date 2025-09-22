import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  ExpandMoreOutlined,
  Person,
  SaveAltOutlined,
} from "@mui/icons-material";
import { applicantsTableColumns } from "../../constants/data";
import MoreActionMenu from "../../common/MoreActionMenu";
import ApplicantFilters from "./ApplicantFilters";
import ViewApplicantDetails from "./ViewApplicantDetails";
import AvatarNameEmail from "../../common/AvatarNameEmail";
import CustomChip from "../../CustomChip";
import { createdDateToformatDate } from "../../../util";
import SkeletonRow from "../../SkeletonRow";
import { BpCheckbox } from "../../common/CustomizeCHeckbox";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
const ApplicantsTable = ({
  darkMode,
  applicants,
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [details, setDetails] = useState(null);
  const handleOpenDrawer = (id) => {
    setDrawerOpen(true);
  };
  const deleteModalClose = () => {
    setDeleteOpenModalWithId(false);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);
  // =======================options for the actions of more menu========================
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
      action: (id) => handleOpenDrawer(id),
    },
    {
      label: "Delete",
      action: (id) => setDeleteOpenModalWithId(id),
    },
  ];

  // =====================================export menu======================================
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickExpandMore = (event, id) => {
    setClickedId(id);
    setAnchorEl(event.currentTarget); // Set the anchor element to open the menu
  };
  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
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
  return isLoading ? (
    <Box sx={{ textAlign: "center", mx: "auto" }}>
      {/* <CircularProgress /> */}
      <SkeletonRow column={9} />
      <SkeletonRow column={9} />
      <SkeletonRow column={9} />
      <SkeletonRow column={9} />
    </Box>
  ) : (
    <Box>
      {/* ===========================================table==================================== */}
      <TableContainer className="thin_slider ">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                sx={{
                  borderTop: "2px solid #ECEFF6",
                  backgroundColor: "rgba(231, 234, 243, .4)",
                }}
              >
                <BpCheckbox />
              </TableCell>
              {applicantsTableColumns.map((header, index) => (
                <TableCell
                  sx={{
                    backgroundColor: "rgba(231, 234, 243, .4)",
                    fontSize: "11.9px",
                    borderTop: "2px solid #ECEFF6",
                    minWidth: index === 0 ? "115px" : "160px",
                  }}
                  key={index}
                >
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "11.9px", fontWeight: 500 }}
                    >
                      {header.label}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants?.length > 0 ? (
              applicants?.map((applicant, index) => (
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
                  key={index}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                >
                  <TableCell padding="checkbox">
                    <BpCheckbox />
                  </TableCell>
                  <TableCell>{applicant?.id}</TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenDrawer();
                      setDetails(applicant);
                    }}
                  >
                    <AvatarNameEmail
                      username={applicant?.name}
                      email={applicant?.email}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "capitalize",

                        color: darkMode == "dark" ? "#FFFFFF" : "#1E2022",
                        fontWeight: 500,
                      }}
                    >
                      {applicant?.qualification}
                    </Typography>
                  </TableCell>

                  <TableCell>{applicant?.location}</TableCell>
                  {/* <TableCell>$50</TableCell> */}
                  <TableCell>{applicant?.created_at?.split("T")[0]}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: darkMode === "dark" ? "#fff" : "#1E2022",
                    }}
                  >
                    {applicant?.experience}
                  </TableCell>

                  <TableCell>
                    {/* {/ ============================= status ======================== /} */}
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
                          ? "rgba(0, 201, 167, 0.1)"
                          : applicant?.status === "interviewed"
                          ? "rgba(255, 193, 7, 0.1)"
                          : applicant?.status === "contacted"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "#eedfe4"
                      }
                      chipText={
                        applicant?.status === "applied"
                          ? "Pending"
                          : applicant?.status
                      }
                      textTransform={"capitalize"}
                      weight={400}
                    />
                  </TableCell>

                  <TableCell>
                    <MoreActionMenu
                      more={true}
                      options={actions}
                      id={applicant?.id}
                      job={applicant}
                      setViewDetails={setDetails}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No applicants available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 30, 50]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.perPage}
        page={pagination.currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{
          disabled: pagination.currentPage === pagination.lastPage,
        }}
        backIconButtonProps={{
          disabled: pagination.currentPage === 1,
        }}
      />
      <ViewApplicantDetails
        open={drawerOpen}
        onClose={handleCloseDrawer}
        details={details}
        updateStatusHandler={updateStatusHandler}
      />
      {/* =========================status chip ========================= */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {dropdownOptions?.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.action();
              handleCloseMenu();
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
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
    </Box>
  );
};

export default ApplicantsTable;
