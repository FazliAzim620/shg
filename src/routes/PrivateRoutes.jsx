import { Outlet, Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import ROUTES from "./Routes";
import SelectRolePage from "../pages/select-page/SelectRolePage";

const PrivateRoutes = () => {
  const user = useSelector((state) => state.login);
  const location = useLocation(); // To get the current location/path
  const token = Cookies.get("token");

  // If the user has a role and is on '/select-role-page', redirect to '/'
  if (location.pathname === "/select-role-page" && user?.user?.role) {
    return <Navigate to="/" />;
  }

  return token ? (
    !user?.user?.role ? (
      <SelectRolePage />
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
