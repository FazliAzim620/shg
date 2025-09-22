import { Close } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ClearFilterDesign from "../common/filterChips/ClearFilterDesign";

const ChipsSection = ({
  filters,
  filterProvider,
  handleRemove,
  countAppliedFilters,
  clearFilterHandler,
  allSpecialitiesOptions,
  filterProviderRolesList,
}) => {
  return (
    <Box sx={{ px: 2 }}>
      {" "}
      {filters.map((filter, filterIndex) => (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexWrap: "wrap",

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
                      {key === "provider_name"
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
                        : key}
                      &nbsp;:&nbsp;
                      {key === "provider_name"
                        ? filterProvider?.find((item) => item.value == value)
                            ?.label
                        : key === "jobStatus"
                        ? value == 1
                          ? "Complete"
                          : value == 3
                          ? "All"
                          : "In progress"
                        : key === "speciality"
                        ? allSpecialitiesOptions?.find(
                            (spc) => spc.value == value
                          )?.label
                        : key === "role"
                        ? filterProviderRolesList?.find(
                            (role) => role.value == value
                          )?.label
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

export default ChipsSection;
