import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useEffect } from "react";
import ProviderHeader from "../provider_portal/provider_components/ProviderHeader";

const ProviderProtectedRoutes = () => {
  const token = Cookies.get("token");
  const user = useSelector((state) => state.login);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token && user?.user?.role !== "provider") {
      localStorage.clear();
      navigate("/login");
    }
  }, []);
  return token && user?.user?.role === "provider" ? (
    <>
      <ProviderHeader />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProviderProtectedRoutes;
