import React from "react";
import { Skeleton, Box, Stack, Container } from "@mui/material";

const OnboardingFormSkeleton = () => {
  return (
    <Box
      sx={{ backgroundColor: "#fafafa", padding: "32px 0", minHeight: "100vh" }}
    >
      {/* Container with maxWidth */}
      <Container
        sx={{
          //   maxWidth: "1200px",
          width: { md: "1200px" },
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Title Skeleton */}
        <Box sx={{ marginBottom: "32px" }}>
          <Skeleton width="200px" height="32px" />
        </Box>

        <Stack direction="row" spacing={3}>
          {/* Left Sidebar Skeleton */}
          <Box sx={{ flexShrink: 0 }}>
            <Stack direction="column" spacing={2}>
              {[...Array(6)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Checkbox skeleton */}
                    <Skeleton
                      variant="circular"
                      width={20}
                      height={20}
                      sx={{ marginRight: "12px" }}
                    />
                    {/* Section title skeleton */}
                    <Box sx={{ flex: 1 }}>
                      <Skeleton
                        width={
                          index === 0
                            ? "140px"
                            : index === 1
                            ? "160px"
                            : index === 2
                            ? "200px"
                            : index === 3
                            ? "100px"
                            : index === 4
                            ? "150px"
                            : "180px"
                        }
                        height="16px"
                      />
                    </Box>
                    {/* Plus icon skeleton */}
                    <Skeleton
                      width="16px"
                      height="16px"
                      sx={{ marginLeft: "8px" }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Main Content Area Skeleton */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
              }}
            >
              {/* Header with title and chevron */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <Skeleton width="180px" height="24px" />
                <Skeleton width="20px" height="20px" />
              </Box>

              {/* Name section header */}
              <Box sx={{ marginBottom: "16px" }}>
                <Skeleton width="48px" height="16px" />
              </Box>

              <Stack direction="column" spacing={3}>
                {/* Prior name field */}
                <Box>
                  <Box sx={{ marginBottom: "8px" }}>
                    <Skeleton width="100px" height="14px" />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    height="40px"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                    }}
                  />
                </Box>

                {/* First name field */}
                <Box>
                  <Box sx={{ marginBottom: "8px" }}>
                    <Skeleton width="80px" height="14px" />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    height="40px"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                    }}
                  />
                </Box>

                {/* Additional skeleton fields */}
                <Box>
                  <Box sx={{ marginBottom: "8px" }}>
                    <Skeleton width="120px" height="14px" />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    height="40px"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                    }}
                  />
                </Box>

                <Box>
                  <Box sx={{ marginBottom: "8px" }}>
                    <Skeleton width="140px" height="14px" />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    height="40px"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              </Stack>

              {/* Additional content skeleton */}
              <Box
                sx={{
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <Skeleton width="100%" height="16px" />
                <Skeleton width="75%" height="16px" />
                <Skeleton width="85%" height="16px" />
              </Box>

              {/* Button skeleton */}
              <Box sx={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={36}
                  sx={{
                    backgroundColor: "#1976d2",
                    borderRadius: "4px",
                    opacity: 0.3,
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={36}
                  sx={{ backgroundColor: "#e0e0e0", borderRadius: "4px" }}
                />
              </Box>
            </Box>
          </Box>
        </Stack>

        {/* Progress indicator skeleton */}
        <Box
          sx={{ marginTop: "32px", display: "flex", justifyContent: "center" }}
        >
          <Stack direction="row" spacing={1}>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} variant="circular" width={8} height={8} />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

// Example usage component
const OnboardingFormWithSkeleton = ({ isLoading = true }) => {
  return isLoading ? (
    <OnboardingFormSkeleton />
  ) : (
    <div>Form content goes here</div>
  );
};

export default OnboardingFormWithSkeleton;
