import { Close } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ClearFilterDesign from "../common/filterChips/ClearFilterDesign";

const PostedJobFilterChips = ({
  filters,
  filterProvider,
  handleRemove,
  countAppliedFilters,
  clearFilterHandler,
  allSpecialitiesOptions,
  filterProviderRolesList,
  filterCountries,
  filterClientList,
}) => {
  const convertToAMPM = (time) => {
    const [hour, minute] = time.split(":");
    let hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    hourInt = hourInt % 12;
    hourInt = hourInt ? hourInt : 12;
    return `${hourInt}:${minute} ${ampm}`;
  };
  return (
    <Box>
      {" "}
      {filters.map((filter, filterIndex) => (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexWrap: "wrap",
            pl: 2,
            alignItems: "center",
          }}
          key={filterIndex}
        >
          {Object?.entries(filter)?.map(([key, value]) => {
            if (value !== "") {
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
                  <Button
                    sx={{
                      py: 0.5,
                      mb: 1,
                      border: "1px solid #DEE2E6",
                      bgcolor: "white",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
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
                      }}
                    >
                      {key.replace("_", " ")}{" "}
                      {/* {key === "provider_name"
                        ? "Provider name"
                        : key === "from_date"
                        ? "From date"
                        : key === "end_date"
                        ? "End date"
                        : key === "client_min_rate"
                        ? "Client min rate"
                        : key === "client_max_rate"
                        ? "Client max rate"
                        : key === "max_rate"
                        ? "Provider max rate"
                        : key === "min_rate"
                        ? "Provider min rate"
                        : key === "end_time"
                        ? "Shift end time"
                        : key === "shift_time"
                        ? "Shift start time"
                        : key} */}
                      &nbsp;:&nbsp;
                      {key === "provider_name"
                        ? filterProvider?.find((item) => item.value == value)
                            ?.label
                        : key === "client"
                        ? filterClientList?.find((item) => item.value == value)
                            ?.label
                        : // : key === "status"
                        // ? value == 1
                        //   ? "Active jobs"
                        //   : value == 2
                        //   ? "Active jobs"
                        //   : value == 3
                        //   ? "Drop jobs"
                        //   : "All"
                        key === "speciality"
                        ? allSpecialitiesOptions?.find(
                            (spc) => spc.value == value
                          )?.label
                        : key === "role"
                        ? filterProviderRolesList?.find(
                            (role) => role.value == value
                          )?.label
                        : key === "location"
                        ? filterCountries?.find(
                            (country) => country.value == value
                          )?.label
                        : key === "shift_time" || key === "end_time"
                        ? convertToAMPM(value)
                        : value}
                      <Close
                        onClick={() => handleRemove(filterIndex, key)}
                        sx={{ cursor: "pointer", fontSize: "1rem", ml: 1 }}
                      />
                    </Typography>
                  </Button>
                </Box>
              );
            }
            return null;
          })}
          {countAppliedFilters() ? (
            <ClearFilterDesign mb={1} clearFilters={clearFilterHandler} />
          ) : (
            ""
          )}
        </Box>
      ))}
    </Box>
  );
};

export default PostedJobFilterChips;
