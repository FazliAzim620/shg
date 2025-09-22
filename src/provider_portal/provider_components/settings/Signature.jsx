import React, { useRef, useState, useEffect } from "react";
import CardCommon from "../../../components/CardCommon";
import { Alert, Box, Button, CircularProgress, Skeleton } from "@mui/material";
import API from "../../../API";
import ReactSignatureCanvas from "react-signature-canvas";
import { fetchUserInfo } from "../../../thunkOperation/auth/loginUserInfo";
import { useSelector, useDispatch } from "react-redux";

const Signature = ({ add, onClose }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [apiResponse, setApiResponse] = useState({});
  const [apiResponseYes, setApiResponseYes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSignature, setIsFetchingSignature] = useState(
    add ? false : true
  ); // State for loading signature
  const [showAlert, setShowAlert] = useState(false);
  const [signature, setSignature] = useState("");
  const dispatch = useDispatch();
  const sigCanvas = useRef(null);
  const { loadingData, userData } = useSelector((state) => state?.userInfo);

  // Function to fetch saved signature
  const fetchSignature = async (userId) => {
    setIsFetchingSignature(true); // Start fetching
    try {
      const response = await API.get(`/api/get-user-signature/${userId}`);
      if (response?.data?.data?.signature) {
        const savedSignature = response?.data?.data?.signature;
        setSignature(savedSignature);
        sigCanvas.current.fromDataURL(savedSignature); // Load the saved signature onto the canvas
      }
    } catch (error) {
      console.log("Error fetching signature:", error);
    } finally {
      setIsFetchingSignature(false); // End fetching
    }
  };

  // Dispatch the fetchUserInfo thunk when the component mounts
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  // Fetch the saved signature when userData is available
  useEffect(() => {
    if (userData?.id && !add) {
      fetchSignature(userData.id); // Call the fetchSignature function with the user ID
    }
  }, [userData]);

  const clearSignature = () => {
    setIsDeleted(true);
    sigCanvas.current.clear();
    setSignature(""); // Clear the saved signature state
  };

  const saveSignature = async () => {
    setIsLoading(true);
    const dataURL = sigCanvas.current.toDataURL();
    setSignature(dataURL);

    const formData = new FormData();
    formData?.append("signature", dataURL);
    try {
      const response = await API.post("/api/save-user-signature", formData);
      const data = response.data;
      if (onClose) {
        onClose();
      }
      setApiResponseYes(true);
      setApiResponse(data);
      setIsLoading(false);
      setShowAlert(true); // Show alert on success
    } catch (error) {
      setIsLoading(false);
      console.log("Error:", error);
    }
  };
  const handleCanvasChange = () => {
    // If the user starts drawing again, set isDeleted to false
    if (isDeleted) {
      setIsDeleted(false);
    }
  };
  return (
    <CardCommon cardTitle={"Digital Signature"} minHeight={230}>
      {showAlert &&
        apiResponseYes &&
        (apiResponse?.error ? (
          <Alert severity="error" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ) : (
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            {apiResponse?.msg}
          </Alert>
        ))}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        {isFetchingSignature ? (
          <Skeleton
            variant="rectangular"
            width={500}
            height={200}
            animation="wave"
          />
        ) : (
          <ReactSignatureCanvas
            ref={sigCanvas}
            penColor="black"
            backgroundColor="white"
            canvasProps={{
              width: 500,
              height: 200,
              className: "signature-canvas",
            }}
            onEnd={handleCanvasChange}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end", gap: 1, mx: 2 }}>
        <Button
          onClick={clearSignature}
          variant="contained"
          sx={{
            textTransform: "capitalize",
          }}
        >
          Clear
        </Button>
        <Button
          onClick={saveSignature}
          disabled={isDeleted}
          variant="contained"
          sx={{
            textTransform: "capitalize",
          }}
        >
          {isLoading ? (
            <CircularProgress size={23} sx={{ color: "white" }} />
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </CardCommon>
  );
};

export default Signature;
