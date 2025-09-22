import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Fab,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  CheckCircle,
  AddCircleOutline,
  DoDisturbOn,
  ArrowUpward,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import API from "../../../API";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import * as SurveyCore from "survey-core";
import Documents from "../../provider_pages/credentials/documents/Documents";
import OrganizationDocuments from "../../provider_pages/credentials/organization-documents/Index";
import ReferenceForm from "../../provider_pages/credentials/reference-forms/Index";
import { CommonInputField } from "../../../components/job-component/CreateJobModal";
import { CommonSelect } from "../../../components/job-component/CommonSelect";
import { getStates } from "../../../api_request";
import Swal from "sweetalert2";
import FormIndex from "../../provider_pages/credentials/forms";
import BackgroundCheck from "../../provider_pages/credentials/background-check/Index";
import ProfessionalRegistration from "../../provider_pages/credentials/professional-register/Index";
import AddLicense from "../../provider_pages/credentials/professional-register/AddLicense";

const NavListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: "8px",
  marginBottom: theme.spacing(1),
  backgroundColor: active ? "rgba(55, 125, 255, 0.1)" : "transparent",
  "&:hover": {
    backgroundColor: active ? "rgba(55, 125, 255, 0.1)" : "#f5f5f5",
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ScrollToTopButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
}));

const SurveyJSForm = ({
  item,
  surveyData,
  setSurveyData,
  handleSurveySubmit,
  submittedData,
  isLoading,
}) => {
  const survey = useMemo(() => {
    const model = new SurveyCore.Model(
      JSON.parse(item.fromable?.json_structure || "{}")
    );
    model.showCompletedPage = false;
    model.showNavigationButtons = item?.name == "Immunizations" ? true : false;
    model.data = submittedData || {};
    if (surveyData[item.id]) {
      model.data = surveyData[item.id];
    }
    if (item?.submissions?.length > 0) {
      model.mode = "display";
    }

    // Prevent default completion behavior
    model.onComplete.add((sender, options) => {
      options.allowComplete = false; // Block default complete action
    });

    return model;
  }, [
    item.fromable?.json_structure,
    item.id,
    surveyData[item.id],
    item.submissions,
    submittedData,
  ]);

  // State to track current page and form validity
  const [isLastPage, setIsLastPage] = useState(
    survey.currentPageNo === survey.pageCount - 1
  );
  const [isFormValid, setIsFormValid] = useState(survey.validate());
  const [currentPageNo, setCurrentPageNo] = useState(survey.currentPageNo);

  useEffect(() => {
    // Update survey data on value change
    const handleValueChanged = (sender, options) => {
      setSurveyData((prev) => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          [options.name]: options.value,
        },
      }));
    };

    // Update page and validity status
    const handlePageChanged = (sender) => {
      setCurrentPageNo(sender.currentPageNo);
      setIsLastPage(sender.currentPageNo === sender.pageCount - 1);
      setIsFormValid(sender.validate());
    };

    // Handle file uploads to prevent page reset
    const handleUploadFiles = (sender, options) => {
      const currentPage = sender.currentPageNo; // Store current page
      options.callback(
        "success",
        options.files.map((file) => ({
          file: file,
          content: URL.createObjectURL(file),
        }))
      );
      // Restore the current page after upload
      sender.currentPageNo = currentPage;
    };

    // Hide Complete button after page render
    const handleAfterRenderPage = (sender, options) => {
      const completeButton = document.querySelector(
        '.sv-action-bar-item[title="Complete"]'
      );
      if (completeButton) {
        completeButton.style.display = "none";
      }
      setIsLastPage(sender.currentPageNo === sender.pageCount - 1);
      setIsFormValid(sender.validate());
    };

    survey.onValueChanged.add(handleValueChanged);
    survey.onCurrentPageChanged.add(handlePageChanged);
    survey.onUploadFiles.add(handleUploadFiles);
    survey.onAfterRenderPage.add(handleAfterRenderPage);

    // Initial check for page and validity
    setCurrentPageNo(survey.currentPageNo);
    setIsLastPage(survey.currentPageNo === survey.pageCount - 1);
    setIsFormValid(survey.validate());

    return () => {
      survey.onValueChanged.clear();
      survey.onCurrentPageChanged.clear();
      survey.onUploadFiles.clear();
      survey.onAfterRenderPage.clear();
      survey.onComplete.clear();
    };
  }, [survey, item.id, setSurveyData]);

  const isSubmitted = item?.submissions?.length > 0;

  // Handle custom submit with validation
  const handleCustomSubmit = () => {
    const isValid = survey.validate();
    if (isValid) {
      handleSurveySubmit(item.id, item.name, item.fromable_id);
    } else {
      survey.focusFirstError(); // Scroll to first invalid field
      console.log("Form validation failed. Required fields are missing.");
    }
  };

  return (
    <Box sx={{ ml: 4, mt: 2 }}>
      <Survey model={survey} />
      {!isSubmitted && isLastPage && isFormValid && (
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleCustomSubmit}
            sx={{ mt: 2 }}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </Box>
      )}
      <style>{`
        /* Hide the Complete button globally */
        .sv-action-bar-item[title="Complete"],
        .sd-navigation__complete-btn {
          display: none !important;
        }
      `}</style>
    </Box>
  );
};

// const SurveyJSForm = ({
//   item,
//   surveyData,
//   setSurveyData,
//   handleSurveySubmit,
//   submittedData,
//   isLoading,
// }) => {
//   const survey = useMemo(() => {
//     const model = new SurveyCore.Model(
//       JSON.parse(item.fromable?.json_structure || "{}")
//     );
//     model.showCompletedPage = false;
//     // model.showNavigationButtons = false;
//     model.data = submittedData;
//     if (surveyData[item.id]) {
//       model.data = surveyData[item.id];
//     }
//     if (item?.submissions?.length > 0) {
//       model.mode = "display";
//     }
//     return model;
//   }, [
//     item.fromable.json_structure,
//     item.id,
//     surveyData[item.id],
//     item.submissions,
//   ]);

//   useEffect(() => {
//     survey.onValueChanged.add((sender, options) => {
//       setSurveyData((prev) => ({
//         ...prev,
//         [item.id]: {
//           ...prev[item.id],
//           [options.name]: options.value,
//         },
//       }));
//     });

//     return () => {
//       survey.onValueChanged.clear();
//     };
//   }, [survey, item.id, setSurveyData]);

//   const isSubmitted = item?.submissions?.length > 0;

//   return (
//     <Box sx={{ ml: 4, mt: 2 }}>
//       <Survey model={survey} />
//       {!isSubmitted && (
//         <Box sx={{ textAlign: "right" }}>
//           <Button
//             variant="contained"
//             color="primary"
//             disabled={isLoading}
//             onClick={() =>
//               handleSurveySubmit(item.id, item.name, item.fromable_id)
//             }
//             sx={{ mt: 2 }}
//           >
//             {isLoading ? "Loading..." : "Submit"}
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

const Preview = ({ userId }) => {
  const packageInfo = useSelector((state) => state.package.packageInfo);
  const { user } = useSelector((state) => state.login);
  const [previewData, setPreviewData] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [activeParentItem, setActiveParentItem] = useState(null);
  const [openGroupsLeft, setOpenGroupsLeft] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState({});
  const [surveyData, setSurveyData] = useState({});
  const [ipAddress, setIpAddress] = useState("");
  const [states, setStates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addProfessional, setAddProfessional] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const getIpAddress = async () => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data?.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  };

  const getStatesHandler = async () => {
    try {
      const resp = await getStates(231);
      if (resp?.data?.success) {
        setStates(resp?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatesHandler();
    getIpAddress();
  }, []);

  const getPreviewData = async () => {
    try {
      const resp = await API.get(
        `/api/get-cred-onb-preview?provider_user_id=${
          userId ? userId : user?.user?.id
        }`
      );
      const packageData = resp?.data?.data?.package;
      setPreviewData(packageData);

      if (packageData?.items?.length > 0) {
        setActiveItem(packageData.items[0]);
        setActiveNavItem(packageData.items[0]);
        setActiveParentItem(packageData.items[0]);
        const initialSections = {};
        packageData.items[0]?.fromable?.sections?.forEach((section) => {
          if (section?.id) {
            initialSections[section.id] = true;
          }
        });
        setOpenSections(initialSections);
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  };

  useEffect(() => {
    getPreviewData();
  }, [packageInfo]);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGroupToggleLeft = (e, itemId) => {
    e.stopPropagation();
    setOpenGroupsLeft((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleSectionToggle = (sectionId) => {
    if (sectionId) {
      setOpenSections((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }));
    }
  };

  const findParentItem = (subItemId) => {
    if (!previewData?.items) return null;
    for (const item of previewData.items) {
      if (item?.group_items?.some((subItem) => subItem.id === subItemId)) {
        return item;
      }
    }
    return null;
  };

  const handleMainItemClick = (item) => {
    if (!item) return;
    setActiveItem(item);
    setActiveNavItem(item);
    setActiveParentItem(item);
    const newSections = {};
    item?.fromable?.sections?.forEach((section) => {
      if (section?.id) {
        newSections[section.id] = true;
      }
    });
    setOpenSections(newSections);
    setShowForm((prev) => ({ ...prev, [item.id]: false }));
  };

  const handleSubItemClick = (subItem, parentItem) => {
    if (!subItem) return;
    setActiveItem(subItem);
    setActiveNavItem(subItem);
    setActiveParentItem(parentItem);
    setOpenGroupsLeft((prev) => ({
      ...prev,
      [parentItem.id]: true,
    }));
    const newSections = {};
    subItem?.fromable?.sections?.forEach((section) => {
      if (section?.id) {
        newSections[section.id] = true;
      }
    });
    setOpenSections(newSections);
    setShowForm((prev) => ({ ...prev, [subItem.id]: false }));

    // Scroll to the sub-item's content
    const element = document.getElementById(`subitem-content-${subItem.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFormChange = (itemId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleFormSubmit = async (itemId, itemName) => {
    const data = formData[itemId] || {};

    const oigFormData = new FormData();
    oigFormData.append(
      "for_provider_user_id",
      userId ? userId : user?.user?.id
    );
    oigFormData.append("dob", data?.age);
    oigFormData.append("upin", data?.upin);
    oigFormData.append("npi", data?.npi);
    oigFormData.append("address", data?.address);
    const samFormData = new FormData();
    samFormData.append(
      "for_provider_user_id",
      userId ? userId : user?.user?.id
    );
    samFormData.append("dob", data?.age);
    samFormData.append("state_id", data?.requestedState);

    try {
      const url = itemName === "SAM" ? "/api/sam-submit" : "/api/oig-submit";
      await API.post(url, itemName === "SAM" ? samFormData : oigFormData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${itemName} data submitted successfully!`,
      });
      getPreviewData();
    } catch (error) {
      console.error(`Error submitting ${itemName} data:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.msg ||
          "An error occurred while processing the request. Please try again later.",
      });
    }
  };

  const handleSurveySubmit = async (itemId, itemName, formId) => {
    setIsLoading(true);
    try {
      const data = surveyData[itemId] || {};
      const formData = new FormData();
      formData.append("for_provider_user_id", userId ? userId : user?.user?.id);
      formData.append("form_id", formId);
      formData.append("ip", ipAddress);
      formData.append("json_structure", JSON.stringify(data));
      await API.post(`/api/save-prov-cred-form`, formData);
      setShowForm((prev) => ({ ...prev, [itemId]: false }));
      setSurveyData((prev) => ({ ...prev, [itemId]: {} }));
      getPreviewData();
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${itemName} data submitted successfully!`,
      });
    } catch (error) {
      setIsLoading(false);
      console.error(`Error submitting ${itemName} survey data:`, error);
      alert(`Failed to submit ${itemName} survey data.`);
    }
  };

  const filterStates = states?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const renderCustomForm = (item) => {
    const itemId = item.id;
    const itemName = item.name.toLowerCase();

    if (itemName === "sam") {
      return (
        <Box component="form" sx={{ mr: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ px: 1, fontSize: "14px", fontWeight: 500 }}
            >
              Name
            </Typography>
            <Typography
              variant="body2"
              sx={{
                p: 1,
                borderRadius: "8px",
                bgcolor: "#F7F9FC",
                mb: 2,
                width: "100%",
              }}
            >
              {user?.user?.name}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              gap: 1,
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "text.black" }}
            >
              Date of birth <span style={{ color: "red" }}>*</span>
            </Typography>
            <CommonInputField
              name={"requestedState"}
              placeholder={"Requested State"}
              type="date"
              value={formData[itemId]?.age || ""}
              onChange={(e) => handleFormChange(itemId, "age", e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              gap: 1,
              mt: 2,
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "text.black" }}
            >
              Requested State <span style={{ color: "red" }}>*</span>
            </Typography>
            <CommonSelect
              height={"2.6rem"}
              minWidth={"61vw"}
              options={filterStates}
              margin="normal"
              name={"requestedState"}
              value={formData[itemId]?.requestedState || ""}
              placeholder={"Requested State"}
              handleChange={(e) =>
                handleFormChange(itemId, "requestedState", e.target.value)
              }
              type="text"
            />
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFormSubmit(itemId, "SAM")}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      );
    } else if (itemName === "oig") {
      return (
        <>
          <Box component="form" sx={{ mr: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ px: 1, fontSize: "14px", fontWeight: 500 }}
              >
                Name
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  bgcolor: "#F7F9FC",
                  mb: 2,
                  width: "100%",
                }}
              >
                {user?.user?.name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ width: "120px", color: "text.black" }}
              >
                Date of birth <span style={{ color: "red" }}>*</span>
              </Typography>
              <CommonInputField
                name={"requestedState"}
                placeholder={"Requested State"}
                type="date"
                value={formData[itemId]?.age || ""}
                onChange={(e) =>
                  handleFormChange(itemId, "age", e.target.value)
                }
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ width: "120px", color: "text.black" }}
              >
                UPIN <span style={{ color: "red" }}>*</span>
              </Typography>
              <CommonInputField
                name={"upin"}
                placeholder={"UPIN"}
                value={formData[itemId]?.upin || ""}
                onChange={(e) =>
                  handleFormChange(itemId, "upin", e.target.value)
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                gap: 1,
                my: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ width: "120px", color: "text.black" }}
              >
                NPI <span style={{ color: "red" }}>*</span>
              </Typography>
              <CommonInputField
                name={"npi"}
                placeholder={"NPI"}
                value={formData[itemId]?.npi || ""}
                onChange={(e) =>
                  handleFormChange(itemId, "npi", e.target.value)
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ width: "120px", color: "text.black" }}
              >
                Address
              </Typography>
              <CommonInputField
                name={"address"}
                placeholder={"address"}
                value={formData[itemId]?.address || ""}
                onChange={(e) =>
                  handleFormChange(itemId, "address", e.target.value)
                }
              />
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFormSubmit(itemId, "OIG")}
                sx={{ mt: 2, textTransform: "none" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </>
      );
    } else if (itemName === "nursys") {
      return (
        <Box>
          <AddLicense />
        </Box>
      );
    }
    return null;
  };

  const renderSurveyJS = (item) => {
    if (
      item.fromable_type === "App\\Models\\Credentialing\\CredentialingForm" &&
      item.fromable?.has_multiple_submissions === 0 &&
      item.fromable?.json_structure
    ) {
      return (
        <SurveyJSForm
          item={item}
          isLoading={isLoading}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
          handleSurveySubmit={handleSurveySubmit}
          submittedData={
            item?.submissions?.length > 0
              ? JSON.parse(
                  item?.submissions?.[item?.submissions?.length - 1]
                    ?.json_structure
                )
              : ""
          }
        />
      );
    }
    return null;
  };

  const renderMultipleSubmissionsTable = (item) => {
    const mockSubmissions = [
      { id: 1, name: "John Doe", age: 25, country: "USA" },
      { id: 2, name: "Jane Smith", age: 30, country: "Canada" },
      { id: 3, name: "Emily Johnson", age: 22, country: "UK" },
    ];

    return (
      <FormIndex id={item?.fromable_id} has_multiple={true} name={item.name} />
    );
  };

  const renderTable = (fromableType, itemName, sections = [], item) => {
    if (
      itemName.toLowerCase() === "sam" ||
      itemName.toLowerCase() === "oig" ||
      itemName.toLowerCase() === "nursys"
    ) {
      return renderCustomForm(item);
    }

    if (
      fromableType === "App\\Models\\Credentialing\\CredentialingForm" &&
      item.fromable?.has_multiple_submissions === 1 &&
      item.fromable?.json_structure
    ) {
      return showForm[item.id]
        ? renderSurveyJS(item)
        : renderMultipleSubmissionsTable(item);
    }

    switch (fromableType) {
      case "App\\Models\\Credentialing\\CredentialingDoc":
        return <Documents />;

      case "App\\Models\\Credentialing\\CredentialingOrgGeneratedDoc":
      case "App\\Models\\Credentialing\\CredentialingOrgUploadDoc":
        return <OrganizationDocuments id={item?.fromable_id} />;

      case "App\\Models\\Credentialing\\CredentialingPeerRefForm":
        return <ReferenceForm id={item?.fromable_id} peer={true} />;

      case "App\\Models\\Credentialing\\CredentialingProfessRefForm":
        return <ReferenceForm id={item?.fromable_id} proffesional={true} />;

      case "App\\Models\\Credentialing\\CredentialingSamResponse":
        return <BackgroundCheck onboarding={true} />;

      case "App\\Models\\Credentialing\\CredentialingNursysLookupResponse":
        return addProfessional ? (
          <AddLicense closeAddHandler={() => setAddProfessional(false)} />
        ) : (
          <ProfessionalRegistration setAddProfessional={setAddProfessional} />
        );

      case "App\\Models\\Credentialing\\CredentialingForm":
        return (
          renderSurveyJS(item) || (
            <Typography variant="body2" color="text.secondary">
              No editable form available for this item.
            </Typography>
          )
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Unknown fromable type: {fromableType}
          </Typography>
        );
    }
  };

  if (!previewData) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          minHeight: "30vh",
        }}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      {/* Left Side: Navigation Menu */}
      <Box
        sx={{
          width: "27%",
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: "12px",
          boxShadow: " rgba(140, 152, 164, 0.08) 0px 3px 12px",
        }}
      >
        <List disablePadding>
          {previewData?.items?.map((item) => (
            <Box key={item?.id || `item-${Math.random()}`}>
              <NavListItem
                button
                active={
                  activeNavItem?.id === item?.id ||
                  (activeParentItem?.id === item?.id &&
                    activeNavItem?.id !== item?.id)
                    ? 1
                    : 0
                }
                onClick={() => handleMainItemClick(item)}
              >
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <CheckCircle
                    sx={{
                      color: "rgba(26, 161, 121, 1)",
                      fontSize: "17px",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item?.name || "Unnamed Item"}
                  primaryTypographyProps={{
                    fontWeight:
                      activeNavItem?.id === item?.id ||
                      activeParentItem?.id === item?.id
                        ? 600
                        : 400,
                  }}
                />
                {item?.group_items?.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleGroupToggleLeft(e, item.id)}
                  >
                    {openGroupsLeft[item.id] ? (
                      <DoDisturbOn
                        sx={{
                          fontSize: "20px",
                          color: "rgba, 117, 125, 1)",
                        }}
                      />
                    ) : (
                      <AddCircleOutline
                        sx={{
                          fontSize: "20px",
                          color: "rgba(108, 117, 125, 1)",
                        }}
                      />
                    )}
                  </IconButton>
                )}
              </NavListItem>

              {item?.group_items?.length > 0 && (
                <Collapse
                  in={!!openGroupsLeft[item.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ position: "relative", mt: 2 }}>
                    <List component="div" disablePadding>
                      {item.group_items.map((subItem, index) => (
                        <NavListItem
                          key={subItem?.id || `subitem-${Math.random()}`}
                          button
                          active={activeNavItem?.id === subItem?.id ? 1 : 0}
                          onClick={() => handleSubItemClick(subItem, item)}
                          sx={{
                            width: "90%",
                            ml: 4,
                            mt: -2,
                            pl: 1,
                            "&:hover": {
                              bgcolor: "transparent",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              borderLeft: `2px solid #6d4a96`,
                              width: "15px",
                              height:
                                index === item?.group_items?.length - 1
                                  ? "60%"
                                  : "100%",
                              position: "absolute",
                              top: 10,
                              left: -5,
                            }}
                          ></Box>
                          {index === item?.group_items?.length - 1 && (
                            <Box
                              sx={{
                                width: "10px",
                                height: "10px",
                                position: "absolute",
                                bottom: 15,
                                left: -9,
                                bgcolor: "#6d4a96",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              bgcolor:
                                activeNavItem?.id === subItem?.id
                                  ? "rgba(55, 125, 255, 0.1)"
                                  : "#ebeef0",
                              width: "100%",
                              pl: 2,
                              py: 1,
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <ListItemText
                              primary={subItem?.name || "Unnamed Subitem"}
                              primaryTypographyProps={{
                                fontWeight:
                                  activeNavItem?.id === subItem?.id ? 600 : 400,
                              }}
                            />
                            <ListItemIcon sx={{ minWidth: "32px" }}>
                              <CheckCircle
                                sx={{
                                  color: "rgba(26, 161, 121, 1)",
                                  fontSize: "17px",
                                }}
                              />
                            </ListItemIcon>
                          </Box>
                        </NavListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              )}
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </List>
      </Box>

      {/* Right Side: Content Area */}
      <Box
        sx={{
          width: "70%",
        }}
      >
        <List>
          {previewData?.items?.map((item, index) => {
            return (
              <Box
                key={item?.id || `content-${Math.random()}`}
                sx={{
                  backgroundColor: "background.paper",
                  p: 2,
                  boxShadow: " rgba(231, 234, 243, 0.7) 0px 3px 12px",
                  mt: index > 0 && "32px",
                  borderRadius: "12px",
                }}
              >
                <ListItem sx={{ px: 0 }}>
                  <Box
                    onClick={() => handleMainItemClick(item)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "20px",
                        color: "text.black",
                        textTransform: "capitalize",
                      }}
                    >
                      {item?.name || "Unnamed Item"}
                    </Typography>
                    <IconButton>
                      {activeItem?.id === item?.id ||
                      activeParentItem?.id === item?.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </Box>
                </ListItem>

                <Collapse
                  in={
                    activeItem?.id === item?.id ||
                    activeParentItem?.id === item?.id
                  }
                  timeout="auto"
                  unmountOnExit
                >
                  {/* Main item content */}
                  {activeItem?.id === item?.id && item?.fromable_type ? (
                    item.fromable_type ===
                      "App\\Models\\Credentialing\\CredentialingForm" &&
                    item.fromable?.has_multiple_submissions === 0 ? (
                      renderSurveyJS(item) || (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={4}
                        >
                          No form data available for this item.
                        </Typography>
                      )
                    ) : (
                      <Box ml={4} mt={2}>
                        {renderTable(
                          item.fromable_type,
                          item.name,
                          item.fromable?.sections || [],
                          item
                        )}
                      </Box>
                    )
                  ) : null}

                  {item?.group_items?.length > 0 && (
                    <Box ml={4} mb={2}>
                      <List disablePadding>
                        {(item.name === "Documents" ||
                        item.name === "Background checks"
                          ? item.group_items.slice(0, 1)
                          : item.group_items
                        ).map((subItem) => (
                          <Box
                            key={
                              subItem?.id || `subitem-content-${Math.random()}`
                            }
                            id={`subitem-content-${subItem?.id}`}
                            sx={{
                              mb: 2,
                              px: 2,
                              py: 2,
                              boxShadow:
                                "rgba(140, 152, 164, 0.08) 0px 3px 12px",
                              borderRadius: "4px",
                              backgroundColor:
                                activeNavItem?.id === subItem?.id
                                  ? "rgba(55, 125, 255, 0.1)"
                                  : "#EBEEF0",
                            }}
                          >
                            <ListItem
                              button
                              onClick={() => handleSubItemClick(subItem, item)}
                              sx={{
                                pl: 0,
                                color: "text.black",
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: "transparent",
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  item.name === "Background checks" ||
                                  item.name === "Professional registration" ||
                                  item.name === "Documents"
                                    ? ""
                                    : subItem?.name || "Unnamed Subitem"
                                }
                              />
                            </ListItem>
                            <Typography variant="caption">
                              {subItem?.name ==
                              "Drug Enforcement Authority (DEA) registration"
                                ? "Add all current and inactive DEA Certificates"
                                : subItem?.name == "State CSR/CDS"
                                ? "Add all current and inactive CSR/CDS Certificates"
                                : subItem?.name == "Education record"
                                ? "Add all Diplomas"
                                : subItem?.name == "Professional training"
                                ? "Training Completion Certificates"
                                : subItem?.name ==
                                  "Continuing Medical Education (CME)"
                                ? "Add all CME Certificates from the last 24 months"
                                : subItem?.name == "Life Supports"
                                ? "Add all Life Support Cards Active/Inactive"
                                : subItem?.name === "Add practice locations"
                                ? "Add all employers you have had since residency"
                                : subItem?.name === "Admitting privileges"
                                ? "Add any facility you have held privileges at since residency"
                                : subItem?.name == "Current insurance policies"
                                ? "Request Current and Past Insurance policies dating back to residency"
                                : ""}
                            </Typography>
                            <Box mt={2}>
                              {subItem.fromable_type ===
                                "App\\Models\\Credentialing\\CredentialingForm" &&
                              subItem.fromable?.has_multiple_submissions === 0
                                ? renderSurveyJS(subItem) || (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      No form data available for this subitem.
                                    </Typography>
                                  )
                                : renderTable(
                                    subItem.fromable_type,
                                    subItem.name,
                                    subItem.fromable?.sections || [],
                                    subItem
                                  )}
                            </Box>
                          </Box>
                        ))}
                      </List>
                    </Box>
                  )}
                </Collapse>
              </Box>
            );
          })}
        </List>
      </Box>

      {showScrollTop && (
        <ScrollToTopButton
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
        >
          <ArrowUpward />
        </ScrollToTopButton>
      )}
    </Box>
  );
};

export default Preview;
