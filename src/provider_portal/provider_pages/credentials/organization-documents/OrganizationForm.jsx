import React, { useState } from "react";
import Header from "../../../components/Header";
import { Box, Button } from "@mui/material";
import Breadcrumb from "../../../components/BreadCrumb";
import ROUTES from "../../../routes/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import FormCreator from "../../form-builder/FormCreator";
import { useSelector } from "react-redux";
import { KeyboardBackspaceOutlined } from "@mui/icons-material";
import OrganizationHeaderForm from "./OrganizationHeaderForm";
import { clearOrgForm } from "../../../feature/form-builder/organizationFormSlice";
import { useDispatch } from "react-redux";
import { addOrganizationDocument } from "../../../thunkOperation/form-builder/organizationThunk";
import Swal from "sweetalert2";

const OrganizationForm = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const darkMode = useSelector((state) => state.theme.mode);
  const breadcrumbItems = [
    { text: "Home", href: "/" },
    { text: "Credentialing", href: ROUTES.credentialing },
    { text: state?.from ? state?.from : "Organization’s documents" },
  ];
  const backHandler = () => {
    dispatch(clearOrgForm());
    navigate(ROUTES.credentialing, {
      state: { from: state?.from, active: state?.active },
    });
  };
  const saveHandler = async (json) => {
    const resp = await dispatch(addOrganizationDocument(json));
    try {
      if (resp?.payload?.success) {
        dispatch(clearOrgForm());
        Swal.fire({
          title: "Document generated",
          text: resp?.payload?.msg,
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            resp?.payload?.msg ||
            resp?.payload?.msg ||
            `There was an error while ${"Adding"}  the role.`,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          `There was an error while ${"Adding"}  the role.`,
        icon: "error",
        confirmButtonText: "Try Again",
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
            title={state?.from ? state?.from : "Organization’s documents"}
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
        <OrganizationHeaderForm />
        <FormCreator
          setPreview={setPreview}
          preview={preview}
          saveHandler={saveHandler}
        />
      </Box>
    </Box>
  );
};

export default OrganizationForm;
