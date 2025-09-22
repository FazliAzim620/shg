import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  Link,
  Divider,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Menu,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Comment,
  Delete,
  ExpandMoreOutlined,
  FilterList,
  KeyboardBackspaceOutlined,
  SaveAltOutlined,
  SearchOutlined,
  Share,
} from "@mui/icons-material";
// import Header from "../../components/Header";
// import { Link as RouterLink } from "react-router-dom";
// import businessIcon from "../../assets/business.svg";
// import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
// import ActionMenu from "../../components/client-module/ActionMenu";
import TimesheetsTable from "../../../../pages/time-sheet/TimesheetsTable";
import API from "../../../../API";
import SkeletonRow from "../../../../components/SkeletonRow";
import Filter from "../../../../pages/time-sheet/Filter";
import CardCommon from "../../../../components/CardCommon";
import { SearchIcon } from "../../../../components/post-job/PostedJobsIcons";
const TimesheetTableView = ({ data, specificJob }) => {
  console.log("all weeks time sheet table data", data);

  const navigate = useNavigate();
  const param = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Timesheet");
  const [activeTab1, setActiveTab1] = useState(5);
  const [timesheets, setTimesheets] = useState(null);
  //   -----------------------------------------------------------------------
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [allFiltersClear, setAllFiltersClear] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    client: "",
    actionRequired: [],
    invoiceStatus: [],
    timesheetStatus: "",
    clientApproval: "",
  });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };
  const handleCheckboxChange = (filterName, value) => {
    setFilters((prev) => {
      const filterValues = prev[filterName];
      if (filterValues.includes(value)) {
        return {
          ...prev,
          [filterName]: filterValues.filter((v) => v !== value),
        };
      } else {
        return { ...prev, [filterName]: [...filterValues, value] };
      }
    });
  };
  const clearFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]:
        filterName === "actionRequired" || filterName === "invoiceStatus"
          ? []
          : "",
    }));
  };
  const clearAllFilters = () => {
    setFilters({
      client: "",
      actionRequired: [],
      invoiceStatus: [],
      timesheetStatus: "",
      clientApproval: "",
    });
    setAllFiltersClear(!allFiltersClear);
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportOptionClick = (option) => {
    // Add logic to export based on the selected option
    handleMenuClose();
  };

  const getTimesheets = async (status) => {
    try {
      const params = {
        page: searchKeyword ? 1 : page + 1,
        paginate: rowsPerPage,
        client: param.id,
        actionRequired: filters.actionRequired.join(","),
        invoiceStatus: filters.invoiceStatus.join(","),
        timesheetStatus: status ? status : filters.timesheetStatus,
        clientApproval: filters.clientApproval,
        search: searchKeyword,
        data_type: "client_timesheet",
      };

      const resp = await API.get("/api/get-timesheets", { params });
      setTimesheets(resp?.data?.data);
      setIsLoading(false);
      setClients(resp?.data?.clients);
      setIsDrawerOpen(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  useEffect(() => {
    getTimesheets();
  }, [page, rowsPerPage, allFiltersClear]);

  const countAppliedFilters = () => {
    return Object?.values(filters)?.reduce((count, filter) => {
      if (Array.isArray(filter)) {
        return count + filter.length;
      }
      return count + (filter ? 1 : 0);
    }, 0);
  };
  //   -----------------------------------------------------------------------
  const menuItems = useMemo(
    () => [
      {
        label: "Action 1",
        icon: <Share fontSize="small" />,
        action: () => console.log("Action 1 clicked"),
      },
      {
        label: "Action 2",
        icon: <Comment fontSize="small" />,
        action: () => console.log("Action 2 clicked"),
      },
      {
        label: "Delete",
        icon: <Delete fontSize="small" />,
        action: () => console.log("Delete clicked"),
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        my: 3,
        bgcolor: "white",
        boxShadow: "none",
        borderRadius: ".6875rem  ",
      }}
    >
      <Box
        display="flex"
        borderRadius={"10px 10px 0 0"}
        justifyContent="space-between"
        alignItems="center"
        px={2}
        pt={2}
        sx={{ bgcolor: "background.paper" }}
      >
        <TextField
          variant="standard"
          size="small"
          placeholder="Search timesheet"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getTimesheets();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  onClick={() => getTimesheets()}
                  sx={{ cursor: "pointer" }}
                />
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
            "& .MuiInputBase-input::placeholder": {
              color: darkMode === "dark" ? "rgba(255, 255, 255, .7)" : "black",
              fontSize: "12.64px",
              lineHeight: "15.3px",
              fontWeight: 400,
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
        <Box>
          <Button
            variant="outlined"
            startIcon={<SaveAltOutlined />}
            endIcon={<ExpandMoreOutlined />}
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

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleExportOptionClick("PDF")}>
              Export as PDF
            </MenuItem>
            <MenuItem onClick={() => handleExportOptionClick("Excel")}>
              Export as Excel
            </MenuItem>
            <MenuItem onClick={() => handleExportOptionClick("CSV")}>
              Export as CSV
            </MenuItem>
          </Menu>
          {!specificJob && (
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
              onClick={toggleDrawer(true)}
            >
              {countAppliedFilters() > 0 ? (
                <>
                  Clear Filters{" "}
                  <Box
                    sx={{
                      bgcolor: "rgba(231, 234, 243, .7)",
                      px: 1,
                      color: "text.black",
                      borderRadius: "50%",
                    }}
                  >
                    {countAppliedFilters()}
                  </Box>
                </>
              ) : (
                "Filter"
              )}
            </Button>
          )}
        </Box>
      </Box>
      {isLoading ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <SkeletonRow column={9} />
          <SkeletonRow column={9} />
          <SkeletonRow column={9} />
          <SkeletonRow column={9} />
        </Box>
      ) : (
        <TimesheetsTable
          providerSide={true}
          timesheets={data}
          page={page}
          rowsPerPage={rowsPerPage}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          darkMode={darkMode}
        />
      )}
      <Filter
        hideClient={true}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        filters={filters}
        handleCheckboxChange={handleCheckboxChange}
        clearFilter={clearFilter}
        clearAllFilters={clearAllFilters}
        getTimesheets={getTimesheets}
        clients={clients}
        handleFilterChange={handleFilterChange}
        countAppliedFilters={countAppliedFilters}
      />
    </Box>
  );
};

export default TimesheetTableView;
