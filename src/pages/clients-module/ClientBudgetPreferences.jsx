import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Typography,
  Link,
  Divider,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  KeyboardBackspaceOutlined,
  Share,
  Comment,
  Delete,
  SettingsOutlined,
  AirplanemodeActiveOutlined,
  BusinessOutlined,
  DirectionsCarOutlined,
  Speed,
  FormatTextdirectionRToL,
  GasMeter,
  LocalParking,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Header from "../../components/Header";
import ActionMenu from "../../components/client-module/ActionMenu";
import businessIcon from "../../assets/business.svg";
import ScrollableTabBar from "../../components/client-module/ScrollableTabBar";
import BudgetPreferencesEditModal from "../../components/client-module/BudgetPreferencesEditModal";
import CustomButton from "../../components/CustomButton";
import { getClientBudgetPreferences } from "../../api_request";
import CardSkeleton from "../../provider_portal/provider_components/CardSkeleton";
import NoPermissionCard from "../../components/common/NoPermissionCard";

const BudgetPreferencesCard = () => {
  const param = useParams();
  const darkMode = useSelector((state) => state.theme.mode);
  const [isDataFetching, setIsDataFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [preferenceData, setPreferenceData] = useState(null);
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };
  const handleSave = (categoryTitle, updatedData) => {
    setPreferenceData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };
  const getClientBudgetPreferencesHandler = async () => {
    setIsDataFetching(true);
    try {
      const resp = await getClientBudgetPreferences(param.id);

      if (resp?.success) {
        setIsDataFetching(false);
        setPreferenceData(resp?.data);
      }
    } catch (error) {
      console.log(error);
      setIsDataFetching(false);
    }
  };
  useEffect(() => {
    getClientBudgetPreferencesHandler();
  }, []);
  const categories = [
    {
      title: "Airfare",
      icon: <AirplanemodeActiveOutlined sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          label: "Cost Covered",
          name: "airfare_cost_covered",
          value: preferenceData?.airfare_cost_covered ? "Yes" : "No",
          type: "status",
          status: 1,
        },
        {
          label: "Payment terms",
          name: "airfare_reimbursed_prepaid",
          status: 1,
          value: preferenceData?.airfare_cost_covered
            ? preferenceData?.airfare_reimbursed_prepaid || "N/A"
            : "N/A",
        },
        {
          label: "booking_class",
          name: "booking_class",
          status: 0,
          value:
            preferenceData?.airfare_cost_covered &&
            preferenceData?.booking_class
              ? preferenceData?.booking_class
                ? "Yes"
                : "No" || 0
              : "N/A",
        },
        {
          label: "Airline name",
          name: "airline",
          status: 0,
          value:
            preferenceData?.airfare_cost_covered && preferenceData?.airline
              ? preferenceData?.airline
              : "",
        },
        {
          label: "Booking Class",
          name: "preferred_booking_class",
          status: 1,
          value:
            preferenceData?.airfare_cost_covered &&
            preferenceData?.booking_class
              ? preferenceData?.preferred_booking_class || "No preference"
              : "N/A",
        },
        {
          label: "Round trips",
          name: "number_of_roundtrips",
          status: 1,
          value: preferenceData?.airfare_cost_covered
            ? preferenceData?.number_of_roundtrips || 0
            : 0,
        },
        {
          label: "Round trip budget",
          name: "airfare_cost_covered",
          status: 1,
          value: preferenceData?.airfare_cost_covered
            ? `Min $${
                preferenceData?.roundtrip_airfare_min_budget || 0
              } - Max $${preferenceData?.roundtrip_airfare_max_budget || 0}`
            : 0,
        },
        {
          label: "Min budget",
          name: "airfare_min_budget",
          status: 0,
          value: preferenceData?.airfare_cost_covered
            ? preferenceData?.roundtrip_airfare_min_budget || 0
            : 0,
        },
        {
          label: "max budget",
          name: "airfare_max_budget",
          status: 0,
          value: preferenceData?.airfare_cost_covered
            ? preferenceData?.roundtrip_airfare_max_budget
            : 0,
        },
      ],
    },
    {
      title: "Hotel",
      icon: <BusinessOutlined sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          label: "Cost Covered",
          name: "hotel_cost_covered",
          status: 1,
          value: preferenceData?.hotel_cost_covered ? "Yes" : "No",
          type: "status",
        },
        {
          label: "Payment terms",
          name: "hotel_reimbursed_prepaid",
          status: 1,
          value: preferenceData?.hotel_cost_covered
            ? preferenceData?.hotel_reimbursed_prepaid || "--"
            : "N/A",
        },
        {
          label: "Preferred Hotel",
          name: "preferred_hotel",
          status: 0,
          value: preferenceData?.hotel_cost_covered
            ? preferenceData?.preferred_hotel || 0
            : "N/A",
        },
        {
          label: "specific Hotel",
          name: "specify_hotel",
          status: 1,
          value: preferenceData?.hotel_cost_covered
            ? preferenceData?.specify_hotel || ""
            : "",
        },
        {
          label: "Min budget",
          name: "hotel_per_night_min_budget",
          status: 0,
          value: preferenceData?.hotel_per_night_min_budget || 0,
        },
        {
          label: "Max budget",
          name: "hotel_per_night_max_budget",
          status: 0,
          value: preferenceData?.hotel_per_night_max_budget
            ? preferenceData?.hotel_per_night_max_budget || 0
            : 0,
        },
        {
          label: "Total Nights  ",
          name: "total_nights",
          status: 1,
          value: preferenceData?.hotel_cost_covered
            ? preferenceData?.total_nights
            : 0,
        },
        {
          label: "Per Night    ",
          name: "per_night",
          status: 1,
          value: preferenceData?.hotel_cost_covered
            ? `Min $${preferenceData?.hotel_per_night_min_budget || 0} - Max $${
                preferenceData?.hotel_per_night_max_budget || 0
              }`
            : 0,
        },
      ],
    },
    {
      title: "Car",
      icon: <DirectionsCarOutlined sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          label: "Cost Covered",
          name: "car_cost_covered",
          status: 1,
          value: preferenceData?.car_cost_covered ? "Yes" : "No",
          type: "status",
        },
        {
          label: "Own ",
          name: "car_own_rental",
          status: 0,
          value:
            (preferenceData?.car_own_rental &&
              Number(preferenceData?.car_own_rental)) ||
            0,
        },
        {
          label: "Preferred Rental Company",
          name: "preferred_rental_car_company",
          status: 0,
          value:
            preferenceData?.preferred_rental_car_company == 1
              ? preferenceData?.preferred_rental_car_company || 0
              : "N/A",
        },
        {
          label: "If yes, please specify",
          label1: "preferred company",
          name: "specify_rental_car_company",
          status: 1,
          value:
            preferenceData?.preferred_rental_car_company == 1
              ? preferenceData?.specify_rental_car_company || ""
              : "",
        },
        {
          label: "Are there any limits on rental car classes?",
          name: "limit_on_rental_car_class",
          status: 0,
          value: preferenceData?.car_cost_covered
            ? preferenceData?.limit_on_rental_car_class
            : 0,
        },
        {
          label: "If yes, please specify",
          lable1: "Rental companies",
          name: "specify_limit_rental_car_class",

          status: 0,
          value: preferenceData?.car_cost_covered
            ? `${preferenceData?.specify_limit_rental_car_class || ""}`
            : "",
        },
        {
          label: "Total Rental Days",
          name: "total_rental_days",
          status: 1,
          value: preferenceData?.car_cost_covered
            ? preferenceData?.total_rental_days || 0
            : 0,
        },
        {
          label: "Min budget",
          status: 0,
          name: "rental_car_per_day_min_budget",
          value: preferenceData?.rental_car_per_day_min_budget || 0,
        },
        {
          label: "Max budget",
          status: 0,
          name: "rental_car_per_day_max_budget",
          value: preferenceData?.rental_car_per_day_max_budget
            ? preferenceData?.rental_car_per_day_max_budget || 0
            : 0,
        },
        {
          label: "Rental PerBudget",
          status: 1,
          value: preferenceData?.hotel_cost_covered
            ? `Min $${
                preferenceData?.rental_car_per_day_min_budget || 0
              } - Max $${preferenceData?.rental_car_per_day_max_budget || 0}`
            : 0,
        },
      ],
    },
    {
      title: "Logged miles",
      icon: <Speed sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          status: 1,
          label: "Cost Covered",
          name: "personal_car_logged_miles_cost",
          value: preferenceData?.personal_car_logged_miles_cost ? "Yes" : "No",
          type: "status",
        },
        {
          status: 0,
          label: "Is there a mileage reimbursement rate?",
          name: "mileage_reimbursement_rate",
          value: preferenceData?.mileage_reimbursement_rate ? "Yes" : "No",
          type: "status",
        },
        {
          label: "Logged budget ",
          status: 1,
          name: "mileage_reimbursement_rate_budget",
          value: preferenceData?.personal_car_logged_miles_cost
            ? preferenceData?.mileage_reimbursement_rate_budget || 0
            : "",
        },
        // {
        //   label: "Logged budget max per mile",
        //   status: 1,
        //   name: "mileage_reimbursement_rate_max_budget",
        //   value: preferenceData?.personal_car_logged_miles_cost
        //     ? preferenceData?.mileage_reimbursement_rate_max_budget || 0
        //     : "",
        // },
      ],
    },
    {
      title: "Tolls",
      icon: <FormatTextdirectionRToL sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          status: 1,
          label: "Cost Covered",
          name: "tolls_cost_covered",
          value: preferenceData?.tolls_cost_covered ? "Yes" : "No",
          type: "status",
        },
        // {
        //   status: 0,
        //   label: "tolls rate",
        //   name: "tolls_reimbursement_rate",
        //   value: preferenceData?.tolls_reimbursement_rate,
        //   type: "status",
        // },

        // {
        //   status: 1,
        //   label: "Total tolls days",
        //   name: "total_toll_days",
        //   value: preferenceData?.tolls_cost_covered
        //     ? preferenceData?.total_toll_days || 0
        //     : 0,
        // },
        {
          status: 1,
          label: "budget for tolls",
          name: "toll_per_day_min_budget",
          value: preferenceData?.tolls_cost_covered
            ? preferenceData?.toll_per_day_budget || 0
            : 0,
        },
        // {
        //   status: 1,
        //   label: "Tolls per day max budget",
        //   name: "toll_per_day_max_budget",
        //   value: preferenceData?.tolls_cost_covered
        //     ? preferenceData?.toll_per_day_max_budget || 0
        //     : 0,
        // },
      ],
    },
    {
      title: "Gas",
      icon: <GasMeter sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          status: 1,
          label: "Cost Covered",
          name: "gas_cost_covered",
          value: preferenceData?.gas_cost_covered ? "Yes" : "No",
          type: "status",
        },
      ],
    },
    {
      title: "Parking",
      icon: <LocalParking sx={{ fontSize: "1rem" }} />,
      fields: [
        {
          status: 1,
          label: "Cost Covered",
          name: "parking_cost_covered",
          value: preferenceData?.parking_cost_covered ? "Yes" : "No",
          type: "status",
        },
      ],
    },
    // Add more categories as needed
  ];
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >
      {isDataFetching ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
        </>
      ) : (
        categories.map((category, index) => (
          <React.Fragment key={category.title}>
            <CardContent
              sx={{
                pt: 4,
                pb: 0,
                px: 3,
                mx: 2.5,
                borderBottom:
                  darkMode === "light"
                    ? "0.06rem solid #e7eaf3"
                    : "0.06rem solid black",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "text.black",
                  ml: -1.5,
                  pb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {category.icon} {category.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    gap: "10%",
                    width: "80%",
                  }}
                >
                  {category.fields.map((field, index) => {
                    if (field?.status === 1) {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          key={field.label}
                          sx={
                            {
                              // bgcolor:
                              //   index % 2 == 0 ? "lightgreen" : "lightblue",
                            }
                          }
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.or_color",
                                mb: 0.5,
                                fontSize: "0.75rem",
                                lineHeight: 1,
                                textTransform: "capitalize",
                              }}
                            >
                              {field.name == "specify_rental_car_company" ||
                              field.name == "limit_on_rental_car_class"
                                ? field?.label1
                                : field?.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 400,
                                textTransform: "capitalize",
                                color:
                                  field.type === "status"
                                    ? field.value === "Yes"
                                      ? "text.black"
                                      : "error.main"
                                    : "text.black",
                                fontSize: "0.875rem",
                              }}
                            >
                              {field.value == "reimbursed_later"
                                ? "Reimbursed later"
                                : field?.value || "--"}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    } else {
                      ("");
                    }
                  })}
                </Box>
                <CustomButton
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.or_color",
                        "&:hover": { color: "text.btn_blue" },
                      }}
                    >
                      <SettingsOutlined sx={{ fontSize: "1rem" }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.inherit", fontWeight: 500 }}
                      >
                        Edit
                      </Typography>
                    </Box>
                  }
                  onClick={() => handleEditClick(category)}
                  variant="contained"
                />
              </Box>
            </CardContent>
            {index < categories.length - 1 && <Divider sx={{ opacity: 0.1 }} />}
          </React.Fragment>
        ))
      )}
      {selectedCategory && (
        <BudgetPreferencesEditModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          category={selectedCategory}
          onSave={handleSave}
          getClientBudgetPreferencesHandler={getClientBudgetPreferencesHandler}
        />
      )}
    </Card>
  );
};

const ClientBudgetPreferences = () => {
  const navigate = useNavigate();
  const param = useParams();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const darkMode = useSelector((state) => state.theme.mode);
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const [activeTab, setActiveTab] = useState("Budget preferences");
  const [activeTab1, setActiveTab1] = useState(4);

  const menuItems = useMemo(
    () => [
      {
        label: "Action 1",
        icon: <Share fontSize="small" />,
        action: () => console.log("Action 1 clicked"),
      },
      {
        label: "Action 2",
        icon: <Comment fontSize="small" />,
        action: () => console.log("Action 2 clicked"),
      },
      {
        label: "Delete",
        icon: <Delete fontSize="small" />,
        action: () => console.log("Delete clicked"),
      },
    ],
    []
  );

  const breadcrumbItems = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "Clients", href: "/clients" },
      {
        text: currentClient?.name,
        href: `/client/${currentClient?.name
          ?.toLowerCase()
          ?.replace(/ /g, "-")}/${param.id}`,
      },
      { text: activeTab },
    ],
    [currentClient, activeTab, param.id]
  );

  const handleTabChange = (newValue) => {
    setActiveTab1(newValue);
  };
  if (permissions?.includes("read clients budget preferences")) {
    return (
      <Box sx={{ overflowX: "hidden", bgcolor: "background.page_bg" }}>
        <Header />
        <Box
          sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            width: { sm: "100%", xl: "78%" },
            m: "0 auto",
          }}
        >
          <Box mx={1} pt={6} px={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src={businessIcon}
                  alt="logo"
                  sx={{ width: "3rem" }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "21px",
                      color: "text.black",
                    }}
                  >
                    {currentClient?.name}
                  </Typography>
                  <Breadcrumbs aria-label="breadcrumb">
                    {breadcrumbItems.map((item, index) =>
                      index === breadcrumbItems.length - 1 ? (
                        <Typography
                          key={item.text}
                          sx={{
                            color: "text.black",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            pt: 0.2,
                          }}
                        >
                          {item.text}
                        </Typography>
                      ) : (
                        <Link
                          component={RouterLink}
                          to={item.href}
                          key={item.text}
                          underline="hover"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            "&:hover": { color: "text.link" },
                          }}
                        >
                          {item.text}
                        </Link>
                      )
                    )}
                  </Breadcrumbs>
                </Box>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/clients")}
                  sx={{
                    bgcolor:
                      darkMode === "dark" ? "background.paper" : "#dee6f6",
                    boxShadow: "none",
                    color: "text.btn_blue",
                    textTransform: "inherit",
                    // mr: 3,
                    py: 1,
                    fontWeight: 400,
                    "&:hover": {
                      color: "#fff",
                      boxShadow: "none",
                      bgcolor: "background.btn_blue",
                    },
                  }}
                >
                  <KeyboardBackspaceOutlined sx={{ mr: 1, fontSize: "1rem" }} />
                  Back to clients
                </Button>
                {/* <ActionMenu
                  menuItems={menuItems}
                  background={darkMode === "dark" ? "background.paper" : "#fff"}
                  padding={1.2}
                /> */}
              </Box>
            </Box>
          </Box>

          <ScrollableTabBar
            activeTab={activeTab1}
            onTabChange={handleTabChange}
          />
          <Divider sx={{ opacity: 0.3 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 4,
              mx: 1,
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.98rem",
                fontWeight: 600,
                lineHeight: 1.2,
                color: "text.black",
              }}
            >
              Budget Preferences
            </Typography>
            <BudgetPreferencesCard />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default ClientBudgetPreferences;
