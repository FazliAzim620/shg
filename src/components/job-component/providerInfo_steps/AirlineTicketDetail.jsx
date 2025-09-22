import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardHeader,
  Card,
  CardContent,
  Grid,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CustomBadge from "../../CustomBadge";
import CustomTypographyBold from "../../CustomTypographyBold";
import { useSelector } from "react-redux";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import { formatTime } from "../../../util";
import {
  CreateNewFolderOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
  SaveAltOutlined,
  Share,
} from "@mui/icons-material";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
import { deleteAirlineAttachment } from "../../../feature/travelSlice";
import API, { baseURLImage } from "../../../API";
import { useDispatch } from "react-redux";

const AirlineTicketDetail = ({
  data,
  editHandler,
  isDeleted,
  setIsDeleted,
  loading,
  isEdit,
}) => {
  const { status } = useSelector((state) => state.travel);

  const dispatch = useDispatch();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const darkMode = useSelector((state) => state.theme.mode);
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = (action) => {
    if (action === "delete") {
      setShowWarning(true);
    }

    setFilterAnchorEl(null);
  };

  const closeModal = () => {
    setShowWarning(false);
  };
  const deleteHandler = async () => {
    setIsLoading(true);
    try {
      const resp = await API.delete(
        `/api/delete-job-plane-ticket-attachment/${data?.id}`
      );
      if (resp?.data?.success) {
        closeModal();
        setIsLoading(false);
        dispatch(deleteAirlineAttachment());
        setIsDeleted(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const downloadHandler = async (fileName) => {
    const url = `${baseURLImage}api/download-file/${fileName}`;
    window.open(url, "_blank");
    handleFilterClose();
  };
  const TableCellStyle = {
    color: "text.primary",
    textTransform: "uppercase",
    fontWeight: 400,
    py: 1,
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: ".75rem",
          backgroundColor: "text.paper",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
          // height: "294px",
          p: 1,
          mb: 4,
        }}
      >
        <CardHeader
          sx={{
            pb: 0.5,
            borderBottom: ".0625rem solid rgba(231, 234, 243, .7)",
          }}
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "text.black",
                }}
              >
                Airline Ticket
                <CustomBadge
                  color="rgba(0, 201, 167)"
                  bgcolor="rgba(0, 201, 167, .1)"
                  text={status ? "Completed" : "In progress"}
                  width="90px"
                  ml={6}
                />
              </Typography>
              {isEdit ? (
                <Button
                  onClick={editHandler}
                  variant="text"
                  component="label"
                  sx={{
                    textTransform: "inherit",
                    boxShadow: "none",
                    // p: ".0 1rem",
                    // mb: 1,
                  }}
                >
                  Edit
                </Button>
              ) : (
                ""
              )}
            </Box>
          }
        />
        <CardContent>
          <Grid container>
            <Grid item xs={12} md={6}>
              <CustomTypographyBold color={"text.black"} fontSize={"1.3125rem"}>
                {data?.airline
                  ?.split("_") // Split the string by spaces
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  ) // Capitalize each word
                  .join(" ")}
              </CustomTypographyBold>
              <Box mt={1}>
                <CustomTypographyBold weight={400}>
                  {data?.airline
                    ?.split("_") // Split the string by spaces
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    ) // Capitalize each word
                    .join(" ")}
                </CustomTypographyBold>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                mb={2}
                sx={{
                  // bgcolor: "gray",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Typography variant="body1">Ticket number:</Typography>
                  <CustomTypographyBold color="text.black">
                    {data.ticket_number}
                  </CustomTypographyBold>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    //   justifyContent: "space-between",
                    //   alignItems: "center",
                    gap: 6.5,
                  }}
                >
                  <Typography variant="body1">
                    Frequent flyer number:
                  </Typography>
                  <CustomTypographyBold color="text.black">
                    {data.flyer_number}
                  </CustomTypographyBold>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead
                sx={{
                  bgcolor:
                    darkMode === "dark" ? "background.page_bg" : "#f9fafc",
                }}
              >
                <TableRow>
                  <TableCell sx={TableCellStyle}>Flight</TableCell>
                  <TableCell sx={TableCellStyle}>From</TableCell>
                  <TableCell sx={TableCellStyle}>To</TableCell>
                  <TableCell sx={TableCellStyle}>Aircraft</TableCell>
                  <TableCell sx={TableCellStyle}>Class/Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.details?.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{`WK ${detail.flight_number}`}</TableCell>
                    <TableCell>
                      <CustomTypographyBold color="text.black">
                        {detail.flight_from}
                      </CustomTypographyBold>
                      <CustomTypographyBold weight={300}>
                        {detail.departure_time}
                      </CustomTypographyBold>
                    </TableCell>
                    <TableCell>
                      <CustomTypographyBold color="text.black">
                        {detail.flight_to}
                      </CustomTypographyBold>
                      <CustomTypographyBold weight={300}>
                        {detail.arrival_time}
                      </CustomTypographyBold>
                    </TableCell>
                    <TableCell>{detail.aircraft_number}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {detail.seat_class}
                      <CustomBadge
                        color="white"
                        bgcolor="rgba(0, 201, 167)"
                        text={
                          detail.seat_status
                          //  === "Confirmed"
                          //   ? "Completed"
                          //   : "In progress"
                        }
                        width="90px"
                        ml={6}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "end", mt: 4, mb: 3 }}>
            <Box
              sx={{
                width: "50%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <CustomTypographyBold weight={400}>
                Total fare amount:
              </CustomTypographyBold>
              <CustomTypographyBold color="text.black">
                ${data.total_fare_amount}
              </CustomTypographyBold>
            </Box>
          </Box>
          {data?.attachment && !isDeleted && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                border: "1px solid #e7eaf3 ",
                p: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    component="img"
                    src={pdfIcon}
                    alt="PDF"
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Tooltip
                      arrow
                      placement="top"
                      title={
                        <CustomTypographyBold color="white">
                          {data?.attachment}
                        </CustomTypographyBold>
                      }
                    >
                      <CustomTypographyBold color="text.black">
                        {data?.attachment?.length < 50
                          ? data?.attachment
                          : `${data?.attachment?.slice(0, 50)}...`}
                      </CustomTypographyBold>
                      <span></span>
                    </Tooltip>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "12px",
                        lineHeight: 1.5,
                        fontWeight: 400,
                      }}
                    >
                      Uploaded {data?.updated_at}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  //   mt={3}
                >
                  <Button
                    variant="text"
                    endIcon={<ExpandMoreOutlined />}
                    sx={{
                      textTransform: "capitalize",
                      color: isFilterMenuOpen ? "#007BFF" : "text.primary",
                      fontSize: "0.8125rem",
                      fontWeight: 400,
                      border: "1px solid rgba(99, 99, 99, 0.2)",
                      padding: "8px 16px",
                      minWidth: 0,
                      bgcolor: "background.paper",
                      "&:hover": {
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        bgcolor: "background.paper",
                        transform: "scale(1.01)",
                        color: "#007BFF",
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                    onClick={handleFilterClick}
                  >
                    More actions
                  </Button>
                  <Menu
                    anchorEl={filterAnchorEl}
                    open={isFilterMenuOpen}
                    onClose={handleFilterClose}
                    sx={{
                      "& .MuiPaper-root": {
                        width: 200,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => downloadHandler(data?.attachment)}
                      sx={{}}
                    >
                      <SaveAltOutlined sx={{ mr: 1, width: 19 }} /> Download
                    </MenuItem>
                    {isEdit && (
                      <MenuItem
                        onClick={() => handleFilterClose("delete")}
                        sx={{}}
                      >
                        <DeleteOutlineOutlined sx={{ mr: 1, width: 19 }} />{" "}
                        Delete
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      <DeleteConfirmModal
        isOpen={showWarning}
        onClose={closeModal}
        onConfirm={deleteHandler}
        isLoading={isLoading}
        itemName={"File"}
        title={"Delete"}
        action={"Delete"}
        bodyText={
          <Typography variant="body2">
            Are you sure you want to delete this File?
            <br /> This action cannot be undone.
          </Typography>
        }
      />
    </>
  );
};

export default AirlineTicketDetail;
