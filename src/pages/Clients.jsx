import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import underConstrucationImage from "../assets/svg/illustrations/oc-project-development.svg";
import Breadcrumb from "../components/BreadCrumb";
import ClientTable from "../components/client/ClientTable";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchClientsInfo } from "../thunkOperation/job_management/states";
import { useSelector } from "react-redux";
const Clients = () => {
  const [clientInfo, setClientInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.mode);
  // ==================== get client information =================
  const getClients = async () => {
    const response = await dispatch(fetchClientsInfo(10));
    setIsLoading(false);
    setClientInfo(response?.payload);
  };
  useEffect(() => {
    getClients();
  }, []);
  const breadcrumbItems = [{ text: "Home", href: "/" }, { text: "Clients" }];
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
        <Breadcrumb items={breadcrumbItems} title={"clients"} />
        <Box
          sx={{
            flexGrow: 1,
            py: 4,
            px: 2,
            //   width: { sm: "100%", md: "70%", xl: "55%" },
            m: "0 auto",
          }}
        >
          <ClientTable
            darkMode={darkMode}
            clientsData={clientInfo}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Clients;
