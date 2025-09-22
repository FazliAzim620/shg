import React from "react";
import ProviderProtectedRoutes from "./ProviderProtectedRoutes";
import ProviderJobs from "../provider_portal/provider_pages/jobs/timesheet/ProviderJobs";
import ROUTES, { PROVIDER_ROUTES } from "./Routes";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import ProviderPublic from "./ProviderPublic";
// import ProviderTimeSheet from "../provider_portal/provider_pages/jobs/timesheet/ProviderTimeSheet";

import ProviderTimeSheetDetail from "../provider_portal/provider_pages/jobs/timesheet/ProviderTimeSheetDetail";
import Credentials from "../provider_portal/provider_pages/credentials/Credentials";
import TravelItinerary from "../provider_portal/provider_pages/travelItinerary/TravelItinerary";
import Scheduling from "../provider_portal/provider_pages/scheduling/Scheduling";
import MyTimeSheets from "../provider_portal/provider_pages/myTimeSheets/MyTimeSheets";
import Payments from "../provider_portal/provider_pages/payments/Payments";
import ProviderSettings from "../provider_portal/provider_pages/settings/ProviderSettings";
import AssignmentLetters from "../provider_portal/provider_pages/assignmentLetters/AssignmentLetters";
import ProviderTimeSheet from "../provider_portal/provider_pages/jobs/timesheet/ProviderTimeSheet";
import Profile_main from "../provider_portal/provider_components/settings/profile/Profile_main";
import UpdateTimesheet from "../provider_portal/provider_pages/jobs/timesheet/UpdateTimesheet";
import RefereePage from "../pages/RefereePage";
const ProviderRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<Login />} path={"/*"} exact />
        <Route element={<RefereePage />} path={`${ROUTES.referee}/:token`} />
        <Route element={<ProviderPublic />}>
          <Route element={<Login />} path={PROVIDER_ROUTES.login} exact />
        </Route>
        <Route element={<ProviderProtectedRoutes />}>
          <Route
            element={<ProviderJobs />}
            path={PROVIDER_ROUTES.provdierMain}
            exact
          />
          <Route
            element={<ProviderTimeSheet />}
            path={`${PROVIDER_ROUTES.timeSheet}/:id`}
            exact
          />
          <Route
            // element={<ProviderTimeSheetDetail />}
            element={<UpdateTimesheet />}
            path={`${PROVIDER_ROUTES.timeSheetDetail}/:id`}
            exact
          />
          {/* ==========================assignment letters============================ */}
          <Route
            element={<AssignmentLetters />}
            path={PROVIDER_ROUTES?.assignmentsLetter}
            exact
          />

          {/* ==========================credentials============================ */}
          <Route
            element={<Credentials />}
            path={PROVIDER_ROUTES?.credentials}
            exact
          />

          {/* =========================travel Itinerary============================ */}
          <Route
            element={<TravelItinerary />}
            path={PROVIDER_ROUTES?.travelItinerary}
            exact
          />

          {/* =========================schedulings========================== */}
          <Route
            element={<Scheduling />}
            path={PROVIDER_ROUTES?.scheduling}
            exact
          />

          {/* ==========================my timesheets============================ */}
          <Route
            element={<MyTimeSheets />}
            path={PROVIDER_ROUTES?.myTimeSheets}
            exact
          />

          {/* ==========================payments============================ */}
          <Route
            element={<Payments />}
            path={PROVIDER_ROUTES?.payments}
            exact
          />

          {/* ==========================settings============================ */}
          <Route
            element={<ProviderSettings />}
            path={PROVIDER_ROUTES?.settings}
            exact
          />

          {/* ==========================provider profile============================ */}
          <Route
            element={<Profile_main />}
            path={PROVIDER_ROUTES?.providerProfile}
            exact
          />
        </Route>
      </Routes>
    </>
  );
};

export default ProviderRoutes;
