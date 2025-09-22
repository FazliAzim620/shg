import React, { useState } from "react";
import Header from "../../../components/Header";
import { Box, Button } from "@mui/material";
import Breadcrumb from "../../../components/BreadCrumb";
import ROUTES from "../../../routes/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import FormCreator from "../../form-builder/FormCreator";
import { useSelector } from "react-redux";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import ReferenceFormHeader from "./ReferenceFormHeader";
import { clearRefForm } from "../../../feature/form-builder/referenceFormSlice";
import { addReferenceDocument } from "../../../thunkOperation/form-builder/referenceThunk";
// import ReferenceForm from "./ReferenceForm";

const CreaReferenceForm = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const darkMode = useSelector((state) => state.theme.mode);
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Credentialing", href: ROUTES.credentialing },
    { text: state?.from ? state?.from : "Reference forms" },
  ];
  const backHandler = () => {
    dispatch(clearRefForm());
    navigate(ROUTES.credentialing, {
      state: { from: state?.from, active: state?.active },
    });
  };
  const saveHandler = async (json) => {
    const resp = await dispatch(
      addReferenceDocument({ surveyData: json, btnState: state?.btn })
    );

    if (resp?.payload?.success) {
      dispatch(clearRefForm());
      Swal.fire({
        title: "Document generated",
        text: resp?.payload?.msg,
        icon: "success",
        confirmButtonText: "Okay",
      });
    } else {
      Swal.fire({
        title: "Document generated",
        text: resp?.payload?.msg,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            pr: 2,
          }}
        >
          <Breadcrumb
            items={breadcrumbItems}
            title={state?.from ? state?.from : "Reference forms"}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={backHandler}
            sx={{
              bgcolor: darkMode === "dark" ? "background.paper" : "#dee6f6",
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
            <KeyboardBackspaceOutlined
              sx={{
                mr: 1,
                fontSize: "1rem",
              }}
            />
            Back
          </Button>
        </Box>
        <ReferenceFormHeader />
        <FormCreator
          setPreview={setPreview}
          preview={preview}
          saveHandler={saveHandler}
        />
      </Box>
    </Box>
  );
};

export default CreaReferenceForm;
