import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import SelectDocuments from "./SelectDocuments";
import OrganizeSections from "./OrganizeSections";
import Preview from "./Preview";
import {
  cancelPackage,
  setActiveStep,
  setOrganizeItems,
  setPackageInfo,
  setSelectedTab,
  setTabData,
} from "../../feature/onboarding/packageSlice";
import PackageInfo from "./PackageInfo";
import API from "../../API";
import Swal from "sweetalert2";
import { East } from "@mui/icons-material";
import CustomOutlineBtn from "../button/CustomOutlineBtn";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../routes/Routes";

const steps = [
  "Package info",
  "Select documents & forms",
  "Organize sections",
  "Preview",
];

const PackageStepper = () => {
  const dispatch = useDispatch();
  const activeStep = useSelector((state) => state.package.activeStep);
  const selectedTab = useSelector((state) => state.package.selectedTab);
  const selectedDocuments = useSelector(
    (state) => state.package.selectedDocuments
  );
  const navigate = useNavigate();
  const { state } = useLocation();
  const tabData = useSelector((state) => state.package.tabData);
  const [isLoading, setIsLoading] = useState(false);
  const packageInfo = useSelector((state) => state.package.packageInfo);
  const [visitedTabs, setVisitedTabs] = useState(new Set(["documents"]));
  // Filter tabOrder to only include tabs with data
  const tabOrder = [
    "documents",
    "organizationDocs",
    "referenceForms",
    "forms",
    "professionalRegistration",
    "backgroundChecks",
  ].filter((tab) => tabData?.[tab]?.length > 0);

  // Ensure selectedTab is valid when tabData changes
  useEffect(() => {
    if (tabData && activeStep === 1) {
      // If current selectedTab has no data or isn't in filtered tabOrder
      if (!tabOrder.includes(selectedTab)) {
        // Set to first available tab with data, or 'documents' if none
        const firstValidTab = tabOrder.length > 0 ? tabOrder[0] : "documents";
        dispatch(setSelectedTab(firstValidTab));
      }
    }
  }, [tabData, activeStep, selectedTab, dispatch, tabOrder]);

  // Update visitedTabs whenever tab changes
  useEffect(() => {
    if (selectedTab && tabOrder.includes(selectedTab)) {
      setVisitedTabs((prev) => new Set([...prev, selectedTab]));
    }
  }, [selectedTab]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };
  const getItems = async () => {
    try {
      const resp = await API.get(
        `/api/get-cred-onb-items?package_id=${packageInfo?.id}`
      );
      if (resp?.data?.success) {
        dispatch(setOrganizeItems(resp?.data?.data?.package));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const packageInfoHandler = async () => {
    setIsLoading(true);
    try {
      const obj = {
        provider_role_ids: packageInfo?.roles?.join(","),
        name: packageInfo?.packageName,
        is_active: packageInfo?.status === "Active" ? 1 : "0",
        id: packageInfo?.id || "",
      };
      const resp = await API.post(`/api/get-cred-onb-steps`, obj);
      if (resp?.data?.success) {
        dispatch(setActiveStep(activeStep + 1));
        dispatch(setPackageInfo({ ["id"]: resp?.data?.data?.package?.id }));
        const docData = resp?.data?.data;
        const packageData = docData;
        const formatTabData = {
          documents: packageData.docs.map((doc) => ({
            id: doc.id,
            class: doc.class,
            name: doc.name,
            description: doc.description || "-",
            required: doc.is_required ? "Yes" : "No",
            isActive: doc.is_active ? "Active" : "Inactive",
          })),
          organizationDocs: packageData.org_docs.map((doc) => ({
            id: doc.id,
            class: doc.class,
            name: doc.name,
            purpose: doc.purpose || "-",
            uploaded: formatDate(doc.created_at),
            lastUpdated: formatDate(doc.updated_at),
          })),
          referenceForms: packageData.ref_forms.map((form) => ({
            id: form.id,
            class: form.class,
            name: form.name,
            description: form.description || "-",
            created: formatDate(form.created_at),
            lastUpdated: formatDate(form.updated_at),
          })),
          forms: packageData.forms.map((form) => ({
            id: form.id,
            class: form.class,
            name: form.name,
            description: form.description || "-",
            created: formatDate(form.created_at),
            lastUpdated: formatDate(form.updated_at),
          })),
          professionalRegistration: packageData.profess_reg || [],
          backgroundChecks: packageData.back_checks || [],
        };

        dispatch(setTabData(formatTabData));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resp?.data?.message || "Something went wrong!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.msg ||
          "An error occurred while processing the request. Please try again later.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectDocumentFormsHandler = async (data = null) => {
    const updatedDocuments = selectedDocuments.map((doc) => ({
      item_id: doc.id,
      item_name: doc.name,
      item_class: doc.class,
    }));
    const obj = {
      package_id: packageInfo?.id,
      package_items: updatedDocuments,
    };

    try {
      const resp = await API.post(
        `/api/update-cred-onb-pkg-items`,
        data ? data : obj
      );
      if (resp?.data?.success) {
        if (!data) {
          dispatch(setActiveStep(activeStep + 1));
        }
        getItems();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resp?.data?.message || "Something went wrong!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.msg ||
          "An error occurred while processing the request. Please try again later.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const hasSelectedDocumentsInCurrentTab = () => {
    const currentTabData = tabData?.[selectedTab] || [];
    return currentTabData.some((doc) =>
      selectedDocuments.some(
        (selected) => selected.id === doc.id && selected.class === doc.class
      )
    );
  };

  const hasDocumentsInCurrentTab = () => {
    return (tabData?.[selectedTab] || []).length > 0;
  };
  const finishHandler = () => {
    dispatch(cancelPackage());
    navigate(ROUTES?.credentialing, {
      state: { from: state?.from, active: state?.active },
    });
  };
  const handleNext = () => {
    if (activeStep === 0) {
      packageInfoHandler();
    } else if (activeStep === 1) {
      const currentTabIndex = tabOrder.indexOf(selectedTab);

      if (currentTabIndex < tabOrder.length - 1) {
        if (hasDocumentsInCurrentTab() && !hasSelectedDocumentsInCurrentTab()) {
          Swal.fire({
            icon: "warning",
            title: "No Documents Selected",
            text: `You haven't selected any documents in the ${selectedTab} tab. Would you like to proceed to the next tab anyway?`,
            showCancelButton: true,
            confirmButtonText: "Proceed",
            cancelButtonText: "Stay on this tab",
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(setSelectedTab(tabOrder[currentTabIndex + 1]));
            }
          });
        } else {
          dispatch(setSelectedTab(tabOrder[currentTabIndex + 1]));
        }
      } else {
        if (selectedDocuments.length > 0) {
          selectDocumentFormsHandler();
          //   dispatch(setActiveStep(activeStep + 1));
        } else {
          Swal.fire({
            icon: "error",
            title: "No Documents Selected",
            text: "Please select at least one document across any tab before proceeding.",
          });
        }
      }
    } else if (activeStep === 2) {
      getItems();
      dispatch(setActiveStep(activeStep + 1));
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      const currentTabIndex = tabOrder.indexOf(selectedTab);

      if (currentTabIndex > 0) {
        dispatch(setSelectedTab(tabOrder[currentTabIndex - 1]));
      } else {
        dispatch(setActiveStep(activeStep - 1));
      }
    } else {
      dispatch(setActiveStep(activeStep - 1));
    }
  };

  const getTabProgressInfo = () => {
    if (activeStep !== 1) return null;

    const currentTabIndex = tabOrder.indexOf(selectedTab);
    return tabOrder.length > 0
      ? `Tab ${currentTabIndex + 1} of ${tabOrder.length}`
      : "No tabs available";
  };

  const getNextButtonText = () => {
    if (isLoading) {
      return <CircularProgress size={18} sx={{ color: "white" }} />;
    }

    if (activeStep === 1) {
      const currentTabIndex = tabOrder.indexOf(selectedTab);
      if (currentTabIndex < tabOrder.length - 1) {
        return "Next";
      }
    }

    return "Next";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: "24px",
          my: "2rem",
          borderRadius: "12px",
        }}
      >
        <Stepper activeStep={activeStep} sx={{}}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography
                  sx={{
                    color:
                      activeStep === index || activeStep > index
                        ? "text.main"
                        : "text.secondary",
                    fontWeight: activeStep === index ? 500 : "normal",
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 0 && <PackageInfo />}
      {activeStep === 1 && (
        <>
          <SelectDocuments getTabProgressInfo={getTabProgressInfo} />
        </>
      )}
      {activeStep === 2 && (
        <OrganizeSections
          getItems={getItems}
          selectDocumentFormsHandler={selectDocumentFormsHandler}
        />
      )}
      {activeStep === 3 && <Preview />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          p: 2,
          bgcolor: "background.paper",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          //   gap: 2,
        }}
      >
        {(activeStep > 0 ||
          (activeStep === 1 && tabOrder.indexOf(selectedTab) > 0)) && (
          <CustomOutlineBtn
            text={
              activeStep === 1 && tabOrder.indexOf(selectedTab) > 0
                ? "Back"
                : "Back"
            }
            onClick={handleBack}
            hover={"text.btn_blue"}
          />
        )}

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={finishHandler}
            sx={{ textTransform: "none", height: "41.92px", mt: "5px" }}
          >
            Finish
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1 || isLoading}
            sx={{ textTransform: "none", height: "41.92px", mt: "5px" }}
          >
            {getNextButtonText()} <East sx={{ fontSize: "18px" }} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PackageStepper;
