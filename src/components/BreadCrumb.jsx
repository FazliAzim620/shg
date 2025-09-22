import React from "react";
import { Box, Breadcrumbs, Button, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TableHeader from "./job-component/TableHeader";
import { Add } from "@mui/icons-material";

function Breadcrumb({
  showJobButton,
  handleOpenModal,
  items,
  title,
  jobs,
  children,
  id,
  mt,
  isLoading,
  jobDetail,
  setValue,
}) {
  return (
    <Box sx={{ mt: jobDetail ? "" : "3.2rem", px: jobDetail ? "" : 1.5 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => {
          if (index === items.length - 1) {
            return (
              <Typography
                key={item.text}
                // color="text.primary"
                sx={{
                  color: "text.black",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  pt: 0.2,
                }}
              >
                {item.text}
              </Typography>
            );
          }
          return (
            <Link
              component={RouterLink}
              to={item.href}
              key={item.text}
              onClick={() => (setValue ? setValue(0) : "")}
              underline="hover"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                fontSize: "0.85rem",
                "&:hover": {
                  color: "text.link",
                },
              }}
            >
              {item.text}
            </Link>
          );
        })}
      </Breadcrumbs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: mt,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            pt: 0.5,
            color: "text.black",
            fontSize: "1.41rem",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {title}
          {id ? `#${id}` : ""}
        </Typography>
        {showJobButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{
              // mt: 2,
              textTransform: "initial",
              bgcolor: "background.btn_blue",
              boxShadow: "none",
              // py: 1,
              px: 2,
              mr: 1.1,
              fontWeight: 400,
            }}
          >
            <Add sx={{ fontWeight: 400, fontSize: "16px", mr: "0.5rem" }} />
            New job
          </Button>
        )}
        {children && children}
      </Box>
      {jobs?.data?.length > 0 && (
        <TableHeader isLoading={isLoading} jobs={jobs} />
      )}
    </Box>
  );
}

export default Breadcrumb;
