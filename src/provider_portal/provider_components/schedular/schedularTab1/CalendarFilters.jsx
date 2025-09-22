import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  ListItem,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { fetchProviderSchedules } from "../../../../thunkOperation/job_management/scheduleThunk";
import ScheduleFilter from "./ScheduleFilter";
import { BpCheckbox } from "../../../../components/common/CustomizeCHeckbox";

const CalendarFilters = ({
  myCalendars,
  close,
  setLoading,
  setSelectedClients,
  selectedClients,
  provider_id,
  client_id,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoadingLocal] = useState(false); // Local loading state
  const handleChange = (clientId) => {
    setSelectedClients((prevSelected) => {
      const newSelected = prevSelected.includes(clientId)
        ? prevSelected.filter((id) => id !== clientId) // Remove if unchecked
        : [...prevSelected, clientId]; // Add if checked
      return newSelected;
    });
  };

  // Apply filters button functionality
  const handleApplyFilters = () => {
    const clientIdsString = selectedClients.join(",");
    setLoading(true);
    setLoadingLocal(true);
    const id = localStorage.getItem("provider_id");
    if (client_id && id) {
      dispatch(
        fetchProviderSchedules({ provider_id: id, client_id: clientIdsString })
      ).finally(() => {
        setLoading(false);
        setLoadingLocal(false);
      });
    } else {
      dispatch(fetchProviderSchedules({ client_id: clientIdsString })).finally(
        () => {
          setLoading(false);
          setLoadingLocal(false);
        }
      );
    }
    close();
  };

  // Clear all functionality
  const handleClearAll = () => {
    const id = localStorage.getItem("provider_id");
    setSelectedClients([]);
    if (client_id && id) {
      dispatch(fetchProviderSchedules({ provider_id: id }));
    } else {
      dispatch(fetchProviderSchedules({}));
    }
    close();
  };

  return (
    <>
      {myCalendars?.length === 0 ? (
        <Box sx={{ p: 1.5, minWidth: "220px", position: "relative" }}>
          <Typography>No Data found, filters are not applicable</Typography>
        </Box>
      ) : myCalendars?.length === 1 ? (
        <Box sx={{ p: 1.5, minWidth: "220px", position: "relative" }}>
          <Typography>
            Only one clients whose data is being presented already no applicable
            filters.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: 1,
            width: "280px",
            position: "relative",
          }}
        >
          {/* Close icon at the top-right corner */}
          <IconButton
            onClick={() => close(selectedClients)} // Close and pass selected clients to persist
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>

          <Typography
            sx={{
              color: "#8c98a4",
              fontSize: ".71094rem",
              marginBottom: ".25rem",
            }}
          >
            MY CLIENTS
          </Typography>

          {myCalendars?.map((calendar, index) => (
            <ListItem key={index} sx={{}}>
              <FormControlLabel
                control={
                  <BpCheckbox
                    size="small"
                    className={`${
                      !selectedClients.includes(calendar.id) && "checkbox"
                    }`}
                    checked={selectedClients.includes(calendar.id)}
                    onChange={() => handleChange(calendar.id)}
                    sx={{
                      pl: 3,
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "#677788", fontSize: "14px" }}>
                    {calendar.name}
                  </Typography>
                }
              />
            </ListItem>
          ))}

          {/* Buttons for Apply Filters and Clear All */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              justifyContent:
                selectedClients?.length > 0 ? "space-between" : "end",
            }}
          >
            {selectedClients?.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handleClearAll}
                sx={{ textTransform: "capitalize" }}
              >
                Clear All
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              disabled={loading}
              sx={{ textTransform: "capitalize" }}
            >
              {loading ? <CircularProgress size={24} /> : "Apply Filters"}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CalendarFilters;
