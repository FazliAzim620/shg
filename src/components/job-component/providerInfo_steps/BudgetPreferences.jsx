import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import AirfareSection from "./budgetPreferenceComponent/AirfareSection";
import HotelSection from "./budgetPreferenceComponent/HotelSection";
import CarRentalSection from "./budgetPreferenceComponent/CarRentalSection";
import {
  updateSection,
  reorderSections,
  setBudgetPreferenceData,
} from "../../../feature/budgetPreferenceSlice";
import CustomBadge from "../../CustomBadge";
import LoggedMiles from "./budgetPreferenceComponent/LoggedMiles";
import Tolls from "./budgetPreferenceComponent/Tolls";
import Gas from "./budgetPreferenceComponent/Gas";
import Parking from "./budgetPreferenceComponent/Parking";
import OverBudget from "./budgetPreferenceComponent/OverBudget";
import BudgetPreferenceDetails from "./budgetPreferenceComponent/BudgetPreferenceDetails";
import { Close, SaveAltOutlined } from "@mui/icons-material";
import {
  BudgetPreferenceForm,
  fetchJobDetail,
} from "../../../thunkOperation/job_management/providerInfoStep";
import { useParams } from "react-router-dom";
import CustomSkeleton from "./CustomSkeleton";
import { updateNewUserDataField } from "../../../feature/jobSlice";
import NoPermissionCard from "../../common/NoPermissionCard";

const BudgetPreferences = ({ batchStatus }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const { sections, status, budgetPreferenceData } = useSelector(
    (state) => state.budgetPreferences
  );
  const formData = useSelector((state) => state.budgetPreferences);
  const [isEdit, setIsEdit] = useState(budgetPreferenceData?.id ? false : true);
  const [isLoading, setIsLoading] = useState(false);
  const { newClientData } = useSelector((state) => state.client);
  const { newUserData } = useSelector((state) => state.job);
  const darkMode = useSelector((state) => state.theme.mode);
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(reorderSections(items));
  };
  const editHandler = () => {
    dispatch(setBudgetPreferenceData(budgetPreferenceData));

    setIsEdit(!isEdit);
  };

  const closeEditHandler = () => {
    setIsEdit(false);
  };

  const submitHandler = async () => {
    setIsLoading(true);
    const resultAction = await dispatch(BudgetPreferenceForm(formData));
    // const resultAction = await dispatch(clientInfoForm(formData));
    if (resultAction?.meta?.rejectedWithValue) {
      // alert(resultAction?.payload?.data?.message);
      setIsLoading(false);
    }
    if (BudgetPreferenceForm.fulfilled.match(resultAction)) {
      setIsEdit(false);
      setIsLoading(false);
      const newUserId = resultAction.payload.data.id;
      dispatch(updateNewUserDataField({ field: "budget_count", value: 1 }));
      // navigate(`/job-management/provider-information/${newUserId}`);
    }
  };

  const renderSection = (section) => {
    switch (section) {
      case "Airfare":
        return (
          <AirfareSection
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Hotel":
        return (
          <HotelSection
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Car rental":
        return (
          <CarRentalSection
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Logged miles":
        return (
          <LoggedMiles
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Tolls":
        return (
          <Tolls
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Gas":
        return (
          <Gas
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Parking":
        return (
          <Parking
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      case "Over Budget Travel":
        return (
          <OverBudget
            isEdit={permissions?.includes(
              "update job management budget preferences"
            )}
          />
        );
      // Add other sections as needed
      default:
        return null;
    }
  };
  useEffect(() => {
    dispatch(updateSection({ field: "clientId", value: newClientData?.id }));
    dispatch(updateSection({ field: "jobId", value: params?.id }));
    dispatch(fetchJobDetail(params?.id));
    setIsEdit(budgetPreferenceData?.id ? false : true);
  }, [params.id]);
  if (permissions?.includes("read job management budget preferences")) {
    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          backgroundColor: "text.paper",
          boxShadow: "none",
        }}
      >
        <CardHeader
          sx={{ pb: 0.5 }}
          title={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-3px",
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
                    marginRight: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    Budget Preferences
                    <CustomBadge
                      color={
                        batchStatus === "Completed"
                          ? "rgba(0, 201, 167)"
                          : "rgba(55, 125, 255)"
                      }
                      bgcolor={
                        batchStatus === "Completed"
                          ? "rgba(0, 201, 167, .1)"
                          : "rgba(55, 125, 255, .1)"
                      }
                      text={"In progress"}
                      width={"92px"}
                    />
                  </Box>
                </Typography>
              </Box>
              {permissions?.includes(
                "update job management budget preferences"
              ) ? (
                <>
                  {isEdit ? (
                    <Button
                      onClick={closeEditHandler}
                      sx={{
                        textAlign: "end",
                        justifyContent: "flex-end",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "none",
                        },
                      }}
                    >
                      <Close />
                    </Button>
                  ) : (
                    <Button
                      onClick={editHandler}
                      variant="text"
                      color="primary"
                      sx={{
                        justifyContent: "flex-end",
                        textTransform: "capitalize",
                        color: "text.link",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        border: "none",
                        minWidth: 64,
                        bgcolor: "background.paper",
                        outline: "none",
                        mt: -1,
                        "&:hover": {
                          outline: "none",
                          backgroundColor: "#ffffff",
                          boxShadow: "none",
                        },
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </>
              ) : (
                ""
              )}
            </Box>
          }
        />
        <Divider
          sx={{
            borderColor: "rgba(231, 234, 243, 01)",
          }}
        />
        <CardContent sx={{ p: 2 }}>
          {isEdit ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided, snapshot) => (
                  <Box
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor:
                        snapshot.isDraggingOver && "rgba(55, 125, 255, .1)",
                    }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {sections.map((section, index) => (
                      <Draggable
                        key={section}
                        draggableId={section}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            sx={{
                              backgroundColor:
                                snapshot.isDragging && "rgba(0, 201, 167, .1)",
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderSection(section)}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
              {permissions?.includes(
                "update job management budget preferences"
              ) ? (
                <Box sx={{ textAlign: "end", pt: 3 }}>
                  <Button
                    onClick={closeEditHandler}
                    sx={{
                      mr: 1,
                      textTransform: "capitalize",
                      color: "text.primary",
                      fontSize: "0.8125rem",
                      fontWeight: 400,
                      border: "1px solid rgba(99, 99, 99, 0.2)",
                      padding: "8px 16px",
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
                  {isLoading ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ px: 4, py: 1.4 }}
                    >
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitHandler}
                      variant="contained"
                      color="primary"
                      startIcon={<SaveAltOutlined />}
                      sx={{ boxShadow: "none", textTransform: "capitalize" }}
                    >
                      Save
                    </Button>
                  )}
                </Box>
              ) : (
                ""
              )}
            </DragDropContext>
          ) : (
            sections.map((section, index) => {
              return (
                <Box key={index}>
                  <Grid
                    container
                    sx={{ display: "flex", alignItems: "center", my: 1.5 }}
                  >
                    <Grid item xs={6} md={2.0}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.98rem",
                          fontWeight: 600,
                          lineHeight: 1.2,
                          // color: "text.black",
                          // p: "1rem 1rem 0.75rem 1rem",
                          color: darkMode == "dark" ? "#6D747B" : "#71869D",
                        }}
                      >
                        {section}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={10.0}>
                      <Divider
                        sx={{
                          borderColor:
                            darkMode == "dark"
                              ? "rgba(255, 255, 255, .7"
                              : "rgba(231, 234, 243, 01)",
                        }}
                      />
                    </Grid>
                  </Grid>

                  {status === "loading" ? (
                    <CustomSkeleton />
                  ) : (
                    <BudgetPreferenceDetails
                      section={section}
                      formData={budgetPreferenceData}
                    />
                  )}
                </Box>
              );
            })
          )}
        </CardContent>
      </Card>
    );
  } else {
    return <NoPermissionCard />;
  }
};

export default BudgetPreferences;
