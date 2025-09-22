import { Box, Typography, Divider, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormsTable from "./FormsTable";
import { useSelector } from "react-redux";
import UploadDocument from "./UploadDocument";
import API from "../../../../API";
import Swal from "sweetalert2";
import OnBoardingTable from "./OnBoardingTable";

const FormIndex = ({ id, has_multiple, userId, name }) => {
  const { user } = useSelector((state) => state.login);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [changeOccure, setChangeOccure] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [onboardingAdd, setOnBoardingAdd] = useState(null);
  const [drawerMode, setDrawerMode] = useState("add");
  const getIpAddress = async () => {
    // Fetch the IP address from the API
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data?.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  };

  const confirmStatus = (curr_user) => {
    setChangeStatus(true);
    // setUser(curr_user);
  };

  const uploadDocumentHandler = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", data?.id || "");
      formData.append("for_provider_user_id", userId ? userId : user?.user?.id);
      formData.append("class", data?.class);
      formData.append("ip", ipAddress);
      formData.append("signature", data?.text_signature || data?.signature);

      const resp = await API.post(`/api/sign-prov-cred-org-doc`, formData);
      if (resp?.data?.success) {
        setIsLoading(false);
        setUploadDrawerOpen(false);
        setChangeOccure(!changeOccure);
        Swal.fire({
          title: "Document Added!",
          text: resp?.data?.msg || "The document has been added successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditHandler = (data) => {
    setDrawerMode("edit");
    setUploadDrawerOpen(true);
    setSelectedDocument(data);
  };
  const viewDetailsHandler = (data) => {
    setDrawerMode("view");
    setUploadDrawerOpen(true);
    setSelectedDocument(data);
  };
  useEffect(() => {
    getIpAddress();
  }, []);
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: "24px" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "right",
            justifyContent: id ? "right" : "left",
            width: "100%",
          }}
        >
          {id ? (
            ""
          ) : (
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, fontSize: "20px", color: "text.black" }}
            >
              Forms
            </Typography>
          )}
          {has_multiple ? (
            <Button
              onClick={() => {
                setOnBoardingAdd(!onboardingAdd);
              }}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Add new
            </Button>
          ) : (
            ""
          )}
        </Box>
      </Box>
      <Divider />

      <Box sx={{ p: "24px" }}>
        {!id ? (
          <FormsTable
            openEditHandler={openEditHandler}
            confirmStatus={confirmStatus}
            viewDetailsHandler={viewDetailsHandler}
            changeOccure={changeOccure}
            ipAddress={ipAddress}
            id={id}
            userId={userId}
          />
        ) : (
          <OnBoardingTable
            openEditHandler={openEditHandler}
            confirmStatus={confirmStatus}
            viewDetailsHandler={viewDetailsHandler}
            changeOccure={changeOccure}
            ipAddress={ipAddress}
            id={id}
            onboardingAdd={onboardingAdd}
            setOnBoardingAdd={setOnBoardingAdd}
            userId={userId}
            name={name}
          />
        )}
      </Box>
      <UploadDocument
        open={uploadDrawerOpen}
        mode={drawerMode}
        data={selectedDocument}
        isLoading={isLoading}
        onClose={() => {
          setUploadDrawerOpen(false);
          setIsLoading(false);
          setSelectedDocument(null);
        }}
        onSave={(data) => {
          uploadDocumentHandler(data);
        }}
        reloadData={() => {
          setChangeOccure(!changeOccure);
        }}
        userId={userId}
        ipAddress={ipAddress}
      />
    </Box>
  );
};

export default FormIndex;
