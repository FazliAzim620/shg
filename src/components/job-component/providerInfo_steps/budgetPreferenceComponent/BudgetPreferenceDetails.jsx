import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import CustomTypographyBold from "../../../CustomTypographyBold";

const BudgetPreferenceDetails = ({ section, formData ,hidden}) => {
  switch (section) {
    case "Airfare":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.airfare_cost_covered === 1 || formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
            {formData?.airfare_cost_covered === 1 || formData?.covered ? (
              <>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Payment terms:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.reimbursementType
                      ? formData?.reimbursementType
                      : formData?.airfare_reimbursed_prepaid ===
                        "reimbursed_later"
                      ? "Reimbursed later"
                      : "Prepaid" || "--"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Airline/Booking class preference:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.specificAirlines
                      ? formData?.specificAirlines
                        ? "Yes"
                        : "No"
                      : formData?.booking_class === 1
                      ? "Yes"
                      : "No"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Airline name:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.airline || " "}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Preferred booking class:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.preferred_booking_class ||
                      formData?.preferredClass ||
                      "--"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Roundtrip budget:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  {formData?.roundtripBudget ? (
                    <CustomTypographyBold color={"text.black"}>
                      Min ${formData?.roundtripBudget?.min} - Max $
                      {formData?.roundtripBudget?.max}
                    </CustomTypographyBold>
                  ) : (
                    <CustomTypographyBold color={"text.black"}>
                      Min ${formData?.roundtrip_airfare_min_budget} - Max $
                      {formData?.roundtrip_airfare_max_budget}
                    </CustomTypographyBold>
                  )}
                </Grid>
                {
hidden === "yes" ? "" :
                <>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Number of roundtrips:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.number_of_roundtrips || formData?.numRoundtrips}
                  </CustomTypographyBold>
                </Grid>
                </>
                }
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      );
    case "Hotel":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.hotel_cost_covered === 1 || formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
            {formData?.hotel_cost_covered === 1 || formData?.covered ? (
              <>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Payment terms:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  {formData?.reimbursementType ? (
                    <CustomTypographyBold color={"text.black"}>
                      {formData?.reimbursementType}
                    </CustomTypographyBold>
                  ) : (
                    <CustomTypographyBold color={"text.black"}>
                      {formData?.hotel_reimbursed_prepaid === "reimbursed_later"
                        ? "Reimbursed later"
                        : "Prepaid" || "--"}
                    </CustomTypographyBold>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Preferred hotel:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.preferred_hotel === 1 ||
                    formData?.preferredHotels
                      ? "Yes"
                      : "No"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Specify hotel:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.specify_hotel || formData?.specificHotel || "--"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Budget per night:
                  </CustomTypographyBold>
                </Grid>
                {formData?.budgetPerNight ? (
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold color={"text.black"}>
                      Min ${formData?.budgetPerNight?.min} - Max $
                      {formData?.budgetPerNight?.max}
                    </CustomTypographyBold>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={8}>
                    {formData?.hotel_per_night_min_budget &&
                    formData?.hotel_per_night_max_budget ? (
                      <CustomTypographyBold color={"text.black"}>
                        Min ${formData?.hotel_per_night_min_budget} - Max $
                        {formData?.hotel_per_night_max_budget}
                      </CustomTypographyBold>
                    ) : (
                      "--"
                    )}
                  </Grid>
                )}
             {hidden === "yes" ? "" :   <>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Total nights:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.total_nights || formData?.totalNights || "--"}
                  </CustomTypographyBold>
                </Grid>
                </>}
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      );
    case "Car rental":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.car_cost_covered === 1 || formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
            {formData?.car_cost_covered === 1 || formData?.covered ? (
              <>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Provider car use:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.car_own_rental === 1 || formData?.ownCar
                      ? "Yes"
                      : "No"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Preferred rental car company:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.preferred_rental_car_company === 1 ||
                    formData?.preferredCompanies
                      ? "Yes"
                      : "No"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Specify rental car company:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.specify_rental_car_company ||
                      formData?.specificCompanies ||
                      "--"}
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Limit on rental car class:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.limit_on_rental_car_class === 1 ||
                    formData?.rentalCarClasses
                      ? "Yes"
                      : "No"}
                  </CustomTypographyBold>
                </Grid>

                {formData?.limit_on_rental_car_class === 1 ||
                  (formData?.rentalCarClasses ? (
                    <Grid item xs={12} md={4}>
                      <CustomTypographyBold weight={400} color={"text.primary"}>
                        Specify limit on rental car class:
                      </CustomTypographyBold>
                    </Grid>
                  ) : (
                    ""
                  ))}
                {formData?.limit_on_rental_car_class === 1 ||
                  (formData?.rentalCarClasses ? (
                    <Grid item xs={12} md={8}>
                      <CustomTypographyBold color={"text.black"}>
                        {formData?.specify_limit_rental_car_class ||
                          formData?.specificCarRentClasses ||
                          "--"}
                      </CustomTypographyBold>
                    </Grid>
                  ) : (
                    ""
                  ))}

                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Budget per day:
                  </CustomTypographyBold>
                </Grid>
                {formData?.budgetPerDay ? (
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold color={"text.black"}>
                      Min ${formData?.budgetPerDay?.min} - Max $
                      {formData?.budgetPerDay?.max}
                    </CustomTypographyBold>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={8}>
                    {formData?.rental_car_per_day_min_budget &&
                    formData?.rental_car_per_day_max_budget ? (
                      <CustomTypographyBold color={"text.black"}>
                        Min ${formData?.rental_car_per_day_min_budget} - Max $
                        {formData?.rental_car_per_day_max_budget}
                      </CustomTypographyBold>
                    ) : (
                      "--"
                    )}
                  </Grid>
                )}
            {hidden === "yes" ? "" : <>    <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Total rental days:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.total_rental_days ||
                      formData?.totalRentalDays ||
                      "--"}
                  </CustomTypographyBold>
                </Grid></>}
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      );
    case "Logged miles":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.personal_car_logged_miles_cost === 1 ||
                formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
            {formData?.personal_car_logged_miles_cost === 1 ||
            formData?.covered ? (
              <>
                {formData?.mileage_reimbursement_rate ? (
                  <Grid item xs={12} md={4}>
                    <CustomTypographyBold weight={400} color={"text.primary"}>
                      Reimbursement rate:
                    </CustomTypographyBold>
                  </Grid>
                ) : (
                  ""
                )}
                {formData?.mileage_reimbursement_rate ? (
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold color={"text.black"}>
                      ${formData?.mileage_reimbursement_rate || "--"}
                    </CustomTypographyBold>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Budget:
                  </CustomTypographyBold>
                </Grid>
                {formData?.ratePerMile ? (
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold color={"text.black"}>
                      Min ${formData?.ratePerMile?.min} - Max $
                      {formData?.ratePerMile?.max}
                    </CustomTypographyBold>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={8}>
                    {formData?.mileage_reimbursement_rate_min_budget &&
                    formData?.mileage_reimbursement_rate_max_budget ? (
                      <CustomTypographyBold color={"text.black"}>
                        Min ${formData?.mileage_reimbursement_rate_min_budget} -
                        Max ${formData?.mileage_reimbursement_rate_max_budget}
                      </CustomTypographyBold>
                    ) : (
                      "--"
                    )}
                  </Grid>
                )}
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      );
    case "Tolls":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.tolls_cost_covered === 1 || formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Reimbursement rate:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                ${formData?.tolls_reimbursement_rate || "--"}
              </CustomTypographyBold>
            </Grid> */}
            {formData?.tolls_cost_covered === 1 || formData?.covered ? (
              <>
                <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Budget per day:
                  </CustomTypographyBold>
                </Grid>
                {formData?.ratePerMile ? (
                  <Grid item xs={12} md={8}>
                    <CustomTypographyBold color={"text.black"}>
                      Min ${formData?.ratePerMile?.min} - Max $
                      {formData?.ratePerMile?.max}
                    </CustomTypographyBold>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={8}>
                    {formData?.toll_per_day_min_budget &&
                    formData?.toll_per_day_max_budget ? (
                      <CustomTypographyBold color={"text.black"}>
                        Min ${formData?.toll_per_day_min_budget} - Max $
                        {formData?.toll_per_day_max_budget}
                      </CustomTypographyBold>
                    ) : (
                      "--"
                    )}
                  </Grid>
                )}
            {hidden === "yes" ? "" : <>    <Grid item xs={12} md={4}>
                  <CustomTypographyBold weight={400} color={"text.primary"}>
                    Total toll days:
                  </CustomTypographyBold>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTypographyBold color={"text.black"}>
                    {formData?.total_toll_days || formData?.totalDays || "--"}
                  </CustomTypographyBold>
                </Grid></>}
              </>
            ) : (
              ""
            )}
          </Grid>
        </Box>
      );
    case "Gas":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.gas_cost_covered === 1 || formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "Parking":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Cost covered:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.parking_cost_covered === 1 || formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    case "Over Budget Travel":
      return (
        <Box sx={{ pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CustomTypographyBold weight={400} color={"text.primary"}>
                Client approve overbudget travel cost:
              </CustomTypographyBold>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTypographyBold color={"text.black"}>
                {formData?.client_approve_overbudget_travel_cost === 1 ||
                formData?.covered
                  ? "Yes"
                  : "No"}
              </CustomTypographyBold>
            </Grid>
          </Grid>
        </Box>
      );
    default:
      return null;
  }
};

export default BudgetPreferenceDetails;
