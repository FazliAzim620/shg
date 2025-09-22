import React, { forwardRef } from "react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import logo_white from "../assets/logos/logo-short.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PdfPerforma = forwardRef((props, ref) => {
  const { week, currentJob } = useSelector((state) => state.currentJob);

  const bg = "#E8F0FE";
  const boxTextStyle = {
    padding: "5px 20px",
    border: "1.5px solid black",
    backgroundColor: bg,
  };
  const calculateTotalHours = (regular, overtime) => {
    return (parseFloat(regular) + parseFloat(overtime)).toFixed(2);
  };

  const calculateDailyTotals = (details) => {
    return details.reduce(
      (totals, detail) => {
        totals.regular += parseFloat(detail.regular_hours);
        totals.overtime += parseFloat(detail.overtime_hours);
        return totals;
      },
      { regular: 0, overtime: 0 }
    );
  };

  const calculateWeeklyTotals = () => {
    return week?.timesheets?.reduce(
      (totals, day) => {
        const dailyTotals = calculateDailyTotals(day.timesheet_details);
        totals.regular += dailyTotals.regular;
        totals.overtime += dailyTotals.overtime;
        return totals;
      },
      { regular: 0, overtime: 0 }
    );
  };

  const weeklyTotals = calculateWeeklyTotals();

  return (
    <Box
      ref={ref}
      sx={{
        padding: "30px",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          border: "3px solid black",
        }}
      >
        {/* =======================img and timesheet====================== */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* ===================img================ */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo_white}
                alt="Image Description"
                style={{
                  height: "50px",
                }}
              />
              <Divider sx={{ mx: "1rem" }} orientation="vertical" flexItem />
              <Typography variant="h5">
                <span style={{ fontWeight: 900 }}>SHG</span> HEALTHCARE
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 3, ml: 10, fontSize: "13px" }}
            >
              600 N Pine Island Road
              <br />
              Suite 340
              <br />
              Plantation, FL 33317
              <br />
              (F): (954)998-2022
            </Typography>
          </Box>
          {/* ===================provider timesheet================ */}
          <Box>
            <Typography sx={{ pt: 2, fontWeight: 600 }} variant="h5">
              PROVIDER TIMESHEET
            </Typography>
            <Typography sx={{ mt: 3, fontWeight: 600 }} variant="h6">
              WEEK OF:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body" sx={boxTextStyle}>
                {week?.start_date}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  margin: "0 8px",
                }}
              >
                -
              </Typography>

              <Typography variant="body" sx={boxTextStyle}>
                {week?.end_date}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* =======================provider details====================== */}
        <Table sx={{ minWidth: 650, border: "1px solid black", my: 3 }}>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  border: "1px solid black",
                  py: 0.7,
                }}
              >
                Provider Name:
              </TableCell>
              <TableCell
                sx={{ border: "1px solid black", backgroundColor: bg, py: 0.7 }}
              >
                {currentJob?.name}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  border: "1px solid black",
                  py: 0.7,
                }}
              >
                Specialty:
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "10px",
                  border: "1px solid black",
                  backgroundColor: bg,
                  py: 0.7,
                }}
              >
                {currentJob?.speciality?.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  border: "1px solid black",
                  py: 0.7,
                }}
              >
                Facility Name:
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "10px",
                  border: "1px solid black",
                  backgroundColor: bg,
                  py: 0.7,
                }}
              >
                [Facility Name Value]
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  border: "1px solid black",
                  py: 0.7,
                }}
              >
                Recruiter Name:
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "10px",
                  border: "1px solid black",
                  backgroundColor: bg,
                  py: 0.7,
                }}
              >
                [Recruiter Name Value]
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {/* =======================timesheet table====================== */}
        <Table sx={{ border: "1px solid black" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                DATE
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                START TIME
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                END TIME
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                REGULAR HOURS
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                OVERTIME HOURS
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                TOTAL HOURS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {week?.timesheets?.map((day, index) =>
              day.timesheet_details.map((detail, detailIndex) => (
                <TableRow key={`${index}-${detailIndex}`}>
                  <TableCell
                    sx={{ border: "1px solid black", fontSize: "12px" }}
                  >
                    {detailIndex === 0 ? `${day.date} (${day.day})` : ""}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", fontSize: "12px" }}
                  >
                    {detail.start_time}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", fontSize: "12px" }}
                  >
                    {detail.end_time}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", fontSize: "12px" }}
                  >
                    {detail.regular_hours}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", fontSize: "12px" }}
                  >
                    {detail.overtime_hours}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black", fontSize: "12px" }}
                  >
                    {calculateTotalHours(
                      detail.regular_hours,
                      detail.overtime_hours
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
            {week
              ? [
                  ...Array(
                    Math.max(
                      0,
                      6 -
                        week?.timesheets.reduce(
                          (count, day) => count + day.timesheet_details.length,
                          0
                        )
                    )
                  ),
                ]?.map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                    ></TableCell>
                    <TableCell
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                    ></TableCell>
                  </TableRow>
                ))
              : ""}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  border: "1px solid black",
                  fontSize: "12px",
                }}
              >
                Weekly Total
              </TableCell>
              <TableCell
                sx={{ border: "1px solid black", fontSize: "12px" }}
              ></TableCell>
              <TableCell
                sx={{ border: "1px solid black", fontSize: "12px" }}
              ></TableCell>
              <TableCell sx={{ border: "1px solid black", fontSize: "12px" }}>
                {weeklyTotals?.regular?.toFixed(2)}
              </TableCell>
              <TableCell sx={{ border: "1px solid black", fontSize: "12px" }}>
                {weeklyTotals?.overtime?.toFixed(2)}
              </TableCell>
              <TableCell sx={{ border: "1px solid black", fontSize: "12px" }}>
                {calculateTotalHours(
                  weeklyTotals?.regular,
                  weeklyTotals?.overtime
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {/* =======================OVERTIME EXPLANATION====================== */}
        <Box
          sx={{
            m: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ width: "50%" }} fontWeight={600}>
            OVERTIME EXPLANATION:
          </Typography>
          <Typography sx={{ width: "100%", ...boxTextStyle }}>
            EXPLANATIONEXPLANATION
          </Typography>
        </Box>

        {/* =======================provider signature====================== */}
        <Box>
          <Box
            sx={{
              m: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={500} width={155}>
                Provider Signaure:&nbsp;
              </Typography>
              <Typography sx={{ width: "210px", ...boxTextStyle }}>
                yrefhfrheahEr
              </Typography>
            </Box>
            {/* ------------------------------------------------ */}
            <Box
              sx={{
                m: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={500}>Date:&nbsp;</Typography>
              <Typography sx={{ width: "210px", ...boxTextStyle }}>
                30-08-2024
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Times New Roman",
              fontSize: "14px",
              color: "black",
            }}
          >
            *Provider: By signing this work log, you warrant that the hours
            reported represent the time worked for the designated client under
            an independent contractor relationship
          </Typography>
        </Box>
        {/* =======================client signature====================== */}
        <Box>
          <Box>
            <Box
              sx={{
                m: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  m: 2.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={500} width={155}>
                  Client Signature:&nbsp;
                </Typography>
                <Typography sx={{ width: "210px", ...boxTextStyle }}>
                  yrefhfrheahEr
                </Typography>
              </Box>
              {/* ------------------------------------------------ */}
              <Box
                sx={{
                  m: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={500}>Date:&nbsp;</Typography>
                <Typography sx={{ width: "210px", ...boxTextStyle }}>
                  30-08-2024
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Times New Roman",
              fontSize: "14px",
              color: "black",
            }}
          >
            *Client: By signing this work log, you agree with the hours worked
            indicated above and you will be invoiced accordingly. If you have
            any questions or concerns, please email{" "}
            <a href="mailto:accounting@SHGhealth.com.">
              accounting@SHGhealth.com.
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default PdfPerforma;
