import {
  SurveyCreator,
  SurveyCreatorComponent,
  localization,
} from "survey-creator-react";
// import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { Box } from "@mui/material";
import { clearOrgForm } from "../../feature/form-builder/organizationFormSlice";

import { useDispatch } from "react-redux";
import { addOrganizationDocument } from "../../thunkOperation/form-builder/organizationThunk";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const FormCreator = ({ setPreview, preview, saveHandler }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const allowedQuestionTypes = [
    // "paneldynamic",
    "text",
    "radiogroup",
    "checkbox",
    "dropdown",
    "rating",
    "comment",
    // "html",
    "datepicker",
    "timepicker",
    "file",
    "signaturepad",
  ];

  const options = {
    showJSONEditorTab: true,
    questionTypes: allowedQuestionTypes,
    showPropertyGrid: false,
  };

  const defaultJson = {
    pages: [
      {
        name: "page1",
        elements: [],
      },
    ],
  };

  const creator = new SurveyCreator(options);

  creator.JSON = state?.editData
    ? JSON.parse(state?.editData)
    : defaultJson || defaultJson;
  creator.saveSurveyFunc = async (saveNo, callback) => {
    await saveSurveyJson(creator.JSON);
    callback(saveNo, true);
  };
  const translations = localization.getLocale("en");
  translations.pe.surveyTitlePlaceholder = "Form name";
  translations.pe.pageTitlePlaceholder = "Section {num}";
  translations.toolboxCategories["misc"] = "Other Questions";
  creator.showHeader = false;

  const generateUniqueId = () => {
    return "survey_" + Math.random().toString(36).substr(2, 9);
  };
  creator.toolbox.allowExpandMultipleCategories = true;
  // creator.toolbox.showCategoryTitles = true;
  creator.toolbox.forceCompact = false;
  creator.allowEditSurveyTitle = false;
  const saveSurveyJson = async (json) => {
    const enhancedJson = {
      ...json,
      id: generateUniqueId(),
      name: "Survey Name",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    // setPreview(enhancedJson);
    saveHandler(json);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        mt: 2,
        mx: { xs: "24px", xl: "0" },
        position: "relative",
      }}
    >
      <SurveyCreatorComponent creator={creator} />
    </Box>
  );
};

export default FormCreator;
