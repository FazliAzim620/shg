import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  IconButton,
  Divider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useSelector } from "react-redux";
// import API from "../api"; // Assuming API is configured for your project

const EventHistoryIndex = ({ selectedUser, userId }) => {
  const darkMode = useSelector((state) => state.theme.mode);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // const fetchEvents = async () => {
    //   try {
    //     const resp = await API.get(
    //       `/api/sync-user-permissions?id=${selectedUser?.id}&page=${
    //         page + 1
    //       }&limit=${rowsPerPage}`
    //     );
    //     setEvents(resp.data.events || []);
    //     setTotalCount(resp.data.totalCount || 0);
    //   } catch (error) {
    //     console.error("Error fetching events:", error);
    //   }
    // };

    // if (selectedUser?.id) {
    //   fetchEvents();
    // }

    // Using dummy data instead of API
    const dummyEvents = [
      {
        date: "16/02/2025 11:00 AM",
        name: "John Doe Director",
        event: "A vulputate at convall...",
        type: "Staff member appr...",
        details: "Recipients mail john...",
      },
      {
        date: "16/02/2025 11:00 AM",
        name: "John Doe SHG director",
        event: "integer interdum nun...",
        type: "Staff member appr...",
        details: "integer interdum nun...",
      },
      {
        date: "16/02/2025 11:00 AM",
        name: "System",
        event: "A vulputate at convall...",
        type: "Sign in",
        details: "Recipients mail john...",
      },
      {
        date: "16/02/2025 11:00 AM",
        name: "System",
        event: "integer interdum nun...",
        type: "Reference reminder",
        details: "Recipients mail john...",
      },
      {
        date: "16/02/2025 11:00 AM",
        name: "System",
        event: "A vulputate at convall...",
        type: "Sign in",
        details: "Recipients mail john...",
      },
    ];
    setEvents(dummyEvents);
    setTotalCount(dummyEvents.length);
  }, [page, rowsPerPage]); // Removed selectedUser dependency since we're using dummy data

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pt: "24px",
          px: "24px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
        >
          Events history
        </Typography>
        <IconButton>
          <FilterListIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Filter
          </Typography>
        </IconButton>
      </Box>
      <Divider />

      <TableContainer component={Paper} sx={{ mt: 2, px: "24px", pt: 1 }}>
        <Table sx={{ minWidth: 650 }} aria-label="event history table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "rgba(231, 234, 243, .4)",
                  fontSize: "11.9px",
                  fontWeight: 500,
                }}
              >
                Date
              </TableCell>{" "}
              <TableCell
                sx={{
                  backgroundColor: "rgba(231, 234, 243, .4)",
                  fontSize: "11.9px",
                  fontWeight: 500,
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "rgba(231, 234, 243, .4)",
                  fontSize: "11.9px",
                  fontWeight: 500,
                }}
              >
                Event
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "rgba(231, 234, 243, .4)",
                  fontSize: "11.9px",
                  fontWeight: 500,
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "rgba(231, 234, 243, .4)",
                  fontSize: "11.9px",
                  fontWeight: 500,
                }}
              >
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event, index) => (
                <TableRow
                  key={index}
                  hover
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
                >
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{event.details}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          `Showing: ${from} - ${to} of ${count}`
        }
      />
    </Box>
  );
};

export default EventHistoryIndex;
