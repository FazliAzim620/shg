import React, { useMemo, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { getTheme } from "../theme";
import { CssBaseline, Skeleton, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
// Lazy load components
const MainRoutes = React.lazy(() => import("./routes/MainRoutes"));
const ProviderRoutes = React.lazy(() => import("./routes/ProviderRoutes"));
const Login = React.lazy(() => import("./pages/Login"));
const NodataFoundCard = React.lazy(() =>
  import("./provider_portal/provider_components/NodataFoundCard")
);
const ForgetPassword = React.lazy(() => import("./pages/auth/ForgetPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
const AlertMessage = React.lazy(() =>
  import("./feature/alert-message/AlertMessage")
);
import ROUTES from "./routes/Routes";
import SessionExpireAlert from "./feature/alert-message/SessionExpireAlert";
import { getLocation } from "./api_request";
import { useDispatch } from "react-redux";
import { addUserLocation } from "./feature/loginSlice";
import { addCurrentClient } from "./feature/client-module/clientSlice";
import RefereePage from "./pages/RefereePage";
function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.login);
  const provider = user?.user?.role === "provider" && "providerA";
  const theme = useMemo(() => getTheme(mode, provider), [mode]);

  window.global = window;
  useEffect(() => {
    getLocation()
      .then((data) => {
        dispatch(addUserLocation(data?.countryCode));
      })
      .catch((err) => {});
    const currentClient = localStorage.getItem("current_client");

    if (currentClient) {
      dispatch(addCurrentClient(JSON.parse(currentClient)));
    }
  }, []);
  // console.log("login user", user?.user);
  const mainRoles = user?.user?.user_all_roles?.map((item) => item?.name);
  // console.log("user?.user?.user_all_roles", user?.user?.user_all_roles);
  const { userRolesPermissions } = useSelector((state) => state.login);

  // Check if the user's role exists in the list of main roles
  const isMainRole = mainRoles?.includes(user?.user?.role);

  if (!user?.user?.success) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<Skeleton width={"100wh"} height={"100vh"} />}>
            <Routes>
              <Route
                element={<RefereePage />}
                path={`${ROUTES.referee}/:token`}
              />
              <Route element={<Login />} path={ROUTES.login} />
              <Route element={<ForgetPassword />} path={ROUTES.forgotPswd} />
              <Route
                element={<ResetPassword />}
                path={`/reset-password/:token`}
                exact
              />
              <Route
                path="*"
                element={
                  <NodataFoundCard
                    title="Page not found!"
                    button="show button"
                  />
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    );
  }

  if (user?.user?.role === "provider") {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionExpireAlert />
        <BrowserRouter>
          <Suspense fallback={<Skeleton width={"100wh"} height={"100vh"} />}>
            <ProviderRoutes />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    );
  } else if (isMainRole || !user?.user?.role || !user?.user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionExpireAlert />
        <BrowserRouter>
          <Suspense fallback={<Skeleton width={"100wh"} height={"100vh"} />}>
            <MainRoutes />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
