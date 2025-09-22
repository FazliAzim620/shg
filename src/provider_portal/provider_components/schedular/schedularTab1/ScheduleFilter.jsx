import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import CustomTypographyBold from "../../../../components/CustomTypographyBold";
import { CommonSelect } from "../../../../components/job-component/CommonSelect";
import { fetchProviderSchedules } from "../../../../thunkOperation/job_management/scheduleThunk";
import { InputFilters } from "../../../../pages/schedules/Filter";
import { useLocation, useParams } from "react-router-dom";
const ScheduleFilter = ({
  clientOptions,
  setIsDrawerOpen,
  isDrawerOpen,
  setFilters,
  countAppliedFilters,
  filterStates,
  setFilterStates,
  client_id,
  setLoading,
}) => {
  const mode = useSelector((state) => state.theme.mode);
  const currentLocation = useLocation();

  const dispatch = useDispatch();
  const isLightMode = mode === "light";
  const params = useParams();
  const clearFilter = () => {
    const id = localStorage.getItem("provider_id");
    const per_page = localStorage.getItem("per_page");
    dispatch(fetchProviderSchedules({ provider_id: id }));
    setIsDrawerOpen(false);
    setFilters([]);
    setFilterStates({
      client: "",
      from_date: "",
      to_date: "",
    });
  };
  const handleChangeFilters = (event) => {
    const { name, value } = event.target;

    setFilterStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const closeDrawer = (status = null) => {
    setIsDrawerOpen(false);
    if (countAppliedFilters() === undefined && status === null) {
      setFilterStates({
        client: "",
        from_date: "",
        to_date: "",
      });
    }
  };
  const handleApplyFilters = () => {
    // const clientIdsString = selectedClients.join(",");
    setLoading(true);

    const id = localStorage.getItem("provider_id");
    if (client_id && id) {
      dispatch(
        fetchProviderSchedules({
          provider_id: id,
          client_id: filterStates?.client,
          from_date: filterStates?.from_date,
          to_date: filterStates?.to_date,
        })
      ).finally(() => {
        setLoading(false);
      });
    } else {
      dispatch(
        fetchProviderSchedules({
          client_id: filterStates?.client ? filterStates?.client : params.id,
          from_date: filterStates?.from_date,
          to_date: filterStates?.to_date,
        })
      ).finally(() => {
        setLoading(false);
      });
    }
    closeDrawer("apply");
  };
  useEffect(() => {
    if (countAppliedFilters() === undefined) {
      setFilterStates({
        client: "",
        from_date: "",
        to_date: "",
      });
    }
  }, [isDrawerOpen]);
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      sx={{ "& .MuiDrawer-paper": { minWidth: "400px", maxWidth: "400px" } }}
    >
      <Box
        sx={{
          pt: "24px",
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomTypographyBold
          weight={600}
          fontSize={"1rem"}
          textTransform={"none"}
          color={"text.black"}
        >
          Filter shifts
        </CustomTypographyBold>
        <IconButton onClick={() => closeDrawer(null)} sx={{ mr: -2 }}>
          <Close />
        </IconButton>
      </Box>

      <Box
        className="thin_slider"
        sx={{
          px: 4,
          pb: 11,
          flexGrow: 1,
          overflowY: "auto",
          height: "calc(100vh - 150px)",
        }}
      >
        {/* ===================== Clients ============= */}
        {(!client_id ||
          currentLocation.pathname.includes("service-provider-details")) && (
          <Typography
            pt={"24px"}
            pb={"8px"}
            sx={{
              color: "#1E2022",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Client
          </Typography>
        )}
        {(!client_id ||
          currentLocation.pathname.includes("service-provider-details")) && (
          <CommonSelect
            height={"38px"}
            name="client"
            value={filterStates.client}
            handleChange={handleChangeFilters}
            placeholder="Select client  "
            options={clientOptions}
          />
        )}
        {/* ========================date range=================== */}
        {/* <Typography
          pt={"24px"}
          pb={"8px"}
          sx={{
            color: "#1E2022",
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          Date range
        </Typography>

        <InputFilters
          height={"38px"}
          name={"from_date"}
          type="date"
          value={filterStates.from_date}
          onChange={handleChangeFilters}
          textColor={filterStates.from_date ? "black" : "gray"}
        />
        <InputFilters
          height={"38px"}
          mt={"24px"}
          name={"to_date"}
          type="date"
          value={filterStates.to_date}
          onChange={handleChangeFilters}
          textColor={filterStates.to_date ? "black" : "gray"}
        /> */}
      </Box>
      {/* Drawer Footer (Always sticks to the bottom) */}
      <Box
        sx={{
          p: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            px: 2,
          }}
        >
          {countAppliedFilters() ? (
            <Button
              sx={{
                mr: 2,
                textTransform: "capitalize",
                color: "text.primary",
                fontSize: "0.8125rem",
                fontWeight: 400,
                border: "1px solid rgba(99, 99, 99, 0.2)",
                padding: "5px 16px",
                minWidth: 0,
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  color: "text.main",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
              fullWidth
              onClick={clearFilter}
            >
              Clear all filters
            </Button>
          ) : (
            ""
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              closeDrawer("apply");
              handleApplyFilters();
              setFilters([filterStates]);
            }}
            sx={{ textTransform: "none", py: 1 }}
          >
            Show results
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ScheduleFilter;
