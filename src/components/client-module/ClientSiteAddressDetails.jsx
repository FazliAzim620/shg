import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Grid,
  IconButton,
  styled,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { CommonSelect } from "../job-component/CommonSelect";
import { useSelector } from "react-redux";
import { CommonInputField } from "../job-component/CreateJobModal";
import CustomButton from "../CustomButton";
import { getCountries, getStates } from "../../api_request";
import siteImage from "../../assets/add_site.svg";
const ClientSiteAddressDetails = () => {
  const { currentClient, status, error } = useSelector(
    (state) => state.clientBasicInfo
  );

  const [sites, setSites] = useState([
    currentClient?.addresses?.find((current) => current?.type === "site"),
  ]);
  const mode = useSelector((state) => state.theme.mode);
  const isLightMode = mode === "light";

  const [openModal, setOpenModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    state: "",
    country_id: null,
    state_id: null,
    address_line_1: "",
    address_line_2: "",
    zip_code: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const StyledTypography = styled(Typography)({
    color: mode === "dark" ? " #F8F9FA" : "black",
    marginTop: "0.5rem",
    fontWeight: 400,
    fontSize: "0.875rem",
  });

  const getStatesHandler = async (id) => {
    try {
      const resp = await getStates(id);
      if (resp?.data?.success) {
        setStates(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCountriesHandler = async () => {
    try {
      const resp = await getCountries();
      if (resp?.data?.success) {
        setCountries(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCountriesHandler();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
    setEditingSite(null);
    setFormData({
      country: "",
      city: "",
      state: "",
      address_line_1: "",
      address_line_2: "",
      zip_code: "",
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingSite(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name == "country") {
      getStatesHandler(value);
    }
  };

  const handleSave = () => {
    if (editingSite !== null) {
      setSites((prevSites) =>
        prevSites.map((site, index) =>
          index === editingSite ? formData : site
        )
      );
    } else {
      setSites((prevSites) => [...prevSites, formData]);
    }
    handleCloseModal();
  };

  const handleEdit = (index) => {
    setEditingSite(index);
    setFormData(sites[index]);
    setOpenModal(true);
  };

  const handleDelete = (index) => {
    setSites((prevSites) => prevSites.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, pb: 0.5 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "21px",
            color: "text.black",
          }}
        >
          Site address
        </Typography>
        <Button
          onClick={handleOpenModal}
          color="primary"
          sx={{ textTransform: "none" }}
        >
          + Add new site
        </Button>
      </Box>
      <Divider sx={{ opacity: 0.6 }} />
      {sites?.map((site, index) => (
        <Box
          key={index}
          sx={{
            mx: 2,
            mt: sites?.length === 1 || (index == 0 && 2),
            p: 2,
            border: "1px solid #e0e0e0",
            borderBottom: index !== sites?.length - 1 && "none",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "21px",
              color: "text.black",
            }}
          >
            Site #{index + 1}
          </Typography>
          <Grid container spacing={2} ml={0.5}>
            <Grid item xs={3} mt={1}>
              <StyledTypography>Country: </StyledTypography>
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
              }}
            >
              <Typography> {site?.country?.name || "--"}</Typography>
              <Box sx={{}}>
                <CustomButton
                  padding="5px 10px"
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <EditIcon sx={{ fontSize: "1rem", mr: 1 }} /> Edit
                    </Box>
                  }
                  onClick={() => handleEdit(index)}
                  size="small"
                />
                <CustomButton
                  padding={"5px 10px"}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <DeleteOutlineOutlined sx={{ fontSize: "1rem", mr: 1 }} />{" "}
                      Delete
                    </Box>
                  }
                  onClick={() => handleDelete(index)}
                  size="small"
                >
                  <DeleteIcon />
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} ml={0.5} mt={1}>
            <Grid item xs={3}>
              <StyledTypography>City: </StyledTypography>
            </Grid>
            <Grid item xs={9}>
              <Typography> {site?.city || "--"}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} ml={0.5} mt={1}>
            <Grid item xs={3}>
              <StyledTypography>State: </StyledTypography>
            </Grid>
            <Grid item xs={9}>
              <Typography> {site?.state?.name || "--"}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} ml={0.5} mt={1}>
            <Grid item xs={3}>
              <StyledTypography>Address (Line 1): </StyledTypography>
            </Grid>
            <Grid item xs={9}>
              <Typography> {site?.address_line_1 || "--"}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} ml={0.5} mt={1}>
            <Grid item xs={3}>
              <StyledTypography>Zip code: </StyledTypography>
            </Grid>
            <Grid item xs={9}>
              <Typography> {site?.zip_code || "--"}</Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        onClick={handleOpenModal}
        sx={{
          mx: 2,
          my: 3,
          textTransform: "capitalize",

          fontSize: "0.8125rem",
          fontWeight: 600,
          border: "none",
          padding: "5px 16px",
          minWidth: { xs: "100%", md: 500 },
          bgcolor: "background.paper",
          boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 6,
          color: "text.btn_blue",
        }}
      >
        <Box
          component={"img"}
          src={siteImage}
          alt="img"
          sx={{ width: "4.49rem" }}
        />
        + Add new site
      </Button>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", md: 800 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "21px",
              color: "text.black",
            }}
          >
            {editingSite !== null ? "Edit site" : "Add new site"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "30%", mr: 2 }}>Country</Typography>
              <Box sx={{ width: "70%" }}>
                <CommonSelect
                  options={countries.map((country) => ({
                    value: country.id,
                    label: country.name,
                  }))}
                  name="country"
                  value={formData?.country_id}
                  handleChange={handleChange}
                  placeholder="Country"
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "30%", mr: 2 }}></Typography>
              <Box sx={{ width: "70%" }}>
                <CommonSelect
                  options={states.map((state) => ({
                    value: state.id,
                    label: state.name,
                  }))}
                  name="state"
                  value={formData.state}
                  handleChange={handleChange}
                  placeholder="State"
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "30%", mr: 2 }}> </Typography>
              <Box sx={{ width: "70%" }}>
                <CommonInputField
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "30%", mr: 2 }}>
                Address line 1
              </Typography>
              <Box sx={{ width: "70%" }}>
                <CommonInputField
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  placeholder="e.g., street 123"
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "30%", mr: 2 }}>
                Address line 2
              </Typography>
              <Box sx={{ width: "70%" }}>
                <CommonInputField
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleChange}
                  placeholder="Building, street"
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "30%", mr: 2 }}>Zip code</Typography>
              <Box sx={{ width: "70%" }}>
                <CommonInputField
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="Zip code"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              onClick={handleCloseModal}
              sx={{
                mr: 1,
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
                  color: "text.btn_blue",
                  transform: "scale(1.01)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none" }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ClientSiteAddressDetails;
