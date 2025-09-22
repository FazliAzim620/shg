import React, { useState } from "react";
import { format } from "date-fns";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
  Menu,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import CustomBadge from "../../CustomBadge";
import CustomTypographyBold from "../../CustomTypographyBold";
import { useSelector } from "react-redux";
import pdfIcon from "../../../assets/svg/brands/pdf-icon.svg";
import {
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
  SaveAltOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteCarBookingAttachment } from "../../../feature/carRentalBooking";
import { DeleteConfirmModal } from "../../handleConfirmDelete";
import API, { baseURLImage } from "../../../API";

const CarBookingDetail = ({ data, status, editHandler, isEdit }) => {
  const dispatch = useDispatch();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const darkMode = useSelector((state) => state.theme.mode);
  const [isLoading, setIsLoading] = useState(false);
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (action) => {
    if (action === "delete") {
      // dispatch(deleteCarBookingAttachment(data?.id));
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
        `/api/delete-job-car-rental-attachment/${data?.id}`
      );
      if (resp?.data?.success) {
        closeModal();
        setIsLoading(false);
        dispatch(deleteCarBookingAttachment(data?.id));
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
                Car Booking
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
                {data?.car_rental_company}
              </CustomTypographyBold>
              <Box mt={1}>
                <CustomTypographyBold weight={400}>
                  Pickup: {data?.pickup_address}
                </CustomTypographyBold>
                <CustomTypographyBold weight={400}>
                  Dropoff: {data?.dropoff_address}
                </CustomTypographyBold>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                mb={2}
                sx={{
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
                  <Typography variant="body1">Pickup date:</Typography>
                  <CustomTypographyBold width={"170px"} color="text.black">
                    {data?.pickup_date} at {data?.pickup_time}
                  </CustomTypographyBold>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                  }}
                >
                  <Typography variant="body1">Dropoff date:</Typography>
                  <CustomTypographyBold width={"170px"} color="text.black">
                    {data?.dropoff_date} at {data?.dropoff_time}
                  </CustomTypographyBold>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                  }}
                >
                  <Typography variant="body1">Rental Amount:</Typography>
                  <CustomTypographyBold width={"170px"} color="text.black">
                    ${data?.rental_amount}
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
                  <TableCell sx={TableCellStyle}>PICK-UP </TableCell>
                  <TableCell sx={TableCellStyle}>DROP-OFF </TableCell>
                  <TableCell sx={TableCellStyle}>Rental Company</TableCell>
                  <TableCell sx={TableCellStyle}>Car type/Class </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box>
                      <CustomTypographyBold color={"text.black"}>
                        {data?.pickup_address}
                      </CustomTypographyBold>
                      <CustomTypographyBold weight={400}>
                        {data?.pickup_date &&
                          format(data?.pickup_date, "EEE MMM-dd-yyyy")}
                      </CustomTypographyBold>
                      <CustomTypographyBold weight={400}>
                        {data?.pickup_time}
                      </CustomTypographyBold>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <CustomTypographyBold color={"text.black"}>
                        {data?.dropoff_address}
                      </CustomTypographyBold>
                      <CustomTypographyBold weight={400}>
                        {data?.dropoff_date &&
                          format(data?.dropoff_date, "EEE MMM-dd-yyyy")}
                      </CustomTypographyBold>
                      <CustomTypographyBold weight={400}>
                        {data?.dropoff_time}
                      </CustomTypographyBold>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <CustomTypographyBold weight={400}>
                      {data?.car_rental_company}
                    </CustomTypographyBold>
                  </TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {data?.car_type}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {data?.attachment && (
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
                      Uploaded {data?.updated_at?.replace(/\.\d{6}Z$/, "")}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
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
                    <MenuItem onClick={() => downloadHandler(data?.attachment)}>
                      <SaveAltOutlined sx={{ mr: 1, width: 19 }} /> Download
                    </MenuItem>

                    {isEdit && (
                      <MenuItem onClick={() => handleFilterClose("delete")}>
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
            <br />
            This action cannot be undone.
          </Typography>
        }
      />
    </>
  );
};

export default CarBookingDetail;
