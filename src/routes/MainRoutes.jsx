import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoutes from "../routes/PrivateRoutes";
import PublicRoutes from "../routes/PublicRoutes";
import Test from "../components/Test";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import AnalyticsPage from "../pages/AnalyticsPage";
import JobManagement from "../pages/JobManagement";
import Jobs from "../pages/Jobs";

// import Credentialing from "../pages/Credentialing";

import Financials from "../pages/Financials";
import RolesAndPermission from "../pages/RolesAndPermission";
import Setting from "../pages/Setting";
import Footer from "../components/Footer";
// import Clients from "../pages/Clients";
import Clients from "../pages/clients-module/index";
import ProviderInfo from "../pages/job_management/ProviderInfo";
import ROUTES from "./Routes";
import ServiceProvider from "../pages/service_provider/ServiceProvider";
import ServiceProviderDetails from "../pages/service_provider/ServiceProviderDetails";
import Timesheets from "../pages/time-sheet/Timesheets";
import TimesheetDetails from "../pages/time-sheet/TimesheetDetails";

import { useSelector } from "react-redux";
import ClientHome from "../pages/clients-module/ClientHome";

import RoleIndex_UsersList from "../components/userManagementcomponents/RoleIndex_UsersList";
import SpecificUserDetailPage from "../components/userManagementcomponents/SpecificUserDetailPage";
import ClientDetails from "../pages/clients-module/ClientDetails";
import ClientBudgetPreferences from "../pages/clients-module/ClientBudgetPreferences";
import ClientTimesheet from "../pages/clients-module/ClientTimesheet";
import ServiceProviderDetailPage_tabFolders from "../components/provider/ServiceProviderDetailPage_tabFolders";
import SessionExpired from "../components/common/Handle401/SessionExpired";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ProviderJobs from "../provider_portal/provider_pages/jobs/timesheet/ProviderJobs";
import ProvidersTab from "../pages/clients-module/providersTab/ProvidersTab";
import JobsOrder from "../pages/clients-module/JobsOrder";
import Schedules from "../pages/schedules/Schedules";
import ShiftsTab from "../pages/clients-module/ShiftsTab";
import JobsModule from "../pages/jobs/JobsModule";
import PostJobDetail_main from "../components/post-job/postJobDetailpage/PostJobDetail_main";
import Users from "../pages/users/Users";
import Credentialing from "../pages/credentialing/Credentialing";
import RoleDetails from "../components/userManagementcomponents/RoleDetails";
import AddEditRole from "../components/userManagementcomponents/AddEditRole";
import UserRoleDetails from "../pages/users/UserRoleDetails";
import UserDetails from "../pages/users/UserDetails";
import SelectRolePage from "../pages/select-page/SelectRolePage";
import ClientInvoices from "../pages/clients-module/ClientInvoices";
import ClientCredentials from "../pages/clients-module/ClientCredentials";
import ClientReports from "../pages/clients-module/ClientReports";
import DynamicForm from "../pages/credentialing/dynamic-form-builder/DynamicForm";
import OrganizationForm from "../pages/credentialing/organization-documents/OrganizationForm";
import CreateReferenceForm from "../pages/credentialing/reference-forms/CreateReferenceForm";
import CreateNewPackage from "../pages/credentialing/onboarding/CreateNewPackage";
import RefereePage from "../pages/RefereePage";
import LeadsModule from "../pages/leads/LeadsModule";
import CredentialingProviderDetails from "../pages/credentialing/CredentialingProviderDetails";

const MainRoutes = () => {
  const location = useLocation();
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const url = currentClient?.name?.toLowerCase()?.replace(/ /g, "-");
  const clientUrl = `${ROUTES.clientHome}/${url}`;
  const clientDetailUrl = url;

  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Test />} path={ROUTES.test} exact />
          <Route element={<RefereePage />} path={`${ROUTES.referee}/:token`} />
          <Route element={<SelectRolePage />} path={ROUTES.select} exact />
          <Route element={<Dashboard />} path={ROUTES.dashboard} exact />
          <Route element={<AnalyticsPage />} path={ROUTES.analytics} exact />
          <Route
            element={<JobManagement />}
            path={ROUTES.jobManagement}
            exact
          />
          <Route
            element={<ProviderInfo />}
            path={`${ROUTES.providerInfo}:id`}
            exact
          />
          <Route element={<JobsModule />} path={ROUTES.jobs} exact />
          <Route element={<LeadsModule />} path={ROUTES.leads} exact />
          <Route
            element={<PostJobDetail_main />}
            path={`${ROUTES.postJobDetail}:id`}
            exact
          />
          <Route
            element={<ServiceProvider />}
            path={ROUTES.serviceProviders}
            exact
          />
          <Route
            element={<ServiceProviderDetailPage_tabFolders />}
            path={`${ROUTES.serviceProviderDetails}:id`}
            exact
          />

          <Route
            element={<ServiceProviderDetails />}
            path={`${ROUTES.serviceProviderDetails}:id/:tab`}
            exact
          />

          <Route
            element={<Credentialing />}
            path={ROUTES.credentialing}
            exact
          />
          <Route
            element={<CredentialingProviderDetails />}
            path={ROUTES.credentialingDetails}
            exact
          />
          <Route
            element={<CreateNewPackage />}
            path={ROUTES.createnewpackage}
            exact
          />
          <Route
            element={<OrganizationForm />}
            path={ROUTES.organizationForm}
            exact
          />
          <Route
            element={<CreateReferenceForm />}
            path={ROUTES.referenceForm}
            exact
          />
          <Route
            element={<DynamicForm />}
            path={ROUTES.dynamicFormRoute}
            exact
          />
          <Route element={<Schedules />} path={ROUTES.schedules} exact />
          <Route element={<Clients />} path={ROUTES.clients} exact />
          <Route element={<ClientHome />} path={`${clientUrl}/:id`} exact />
          <Route
            element={<ClientDetails />}
            path={`${clientDetailUrl}/details/:id`}
            exact
          />
          <Route
            element={<ClientBudgetPreferences />}
            path={`${clientDetailUrl}/preferences/:id`}
            exact
          />
          <Route
            element={<JobsOrder />}
            path={`${clientDetailUrl}/jobs-order/:id`}
            exact
          />
          <Route
            element={<ShiftsTab />}
            path={`${clientDetailUrl}/shifts/:id`}
            exact
          />
          <Route
            element={<ProvidersTab />}
            path={`${clientDetailUrl}/providers/:id`}
            exact
          />
          <Route
            element={<ClientTimesheet />}
            path={`${clientDetailUrl}/timesheet/:id`}
            exact
          />
          <Route
            element={<ClientInvoices />}
            path={`${clientDetailUrl}/invoices/:id`}
            exact
          />
          <Route
            element={<ClientCredentials />}
            path={`${clientDetailUrl}/credentials/:id`}
            exact
          />
          <Route
            element={<ClientReports />}
            path={`${clientDetailUrl}/reports/:id`}
            exact
          />
          <Route element={<Timesheets />} path={ROUTES.timesheets} exact />

          <Route
            element={<TimesheetDetails />}
            path={`${ROUTES.timesheetDetails}/:id`}
            exact
          />
          <Route element={<Financials />} path={ROUTES.financials} exact />
          <Route element={<Users />} path={ROUTES.userManagement} exact />
          <Route
            element={<RolesAndPermission />}
            path={ROUTES.rolePermissionManagement}
            exact
          />
          <Route
            // element={<RoleIndex_UsersList />}
            element={<RoleDetails />}
            // path={`${ROUTES.roleIndexPage}/:id`}
            path={`${ROUTES.roleIndexPage}`}
            exact
          />
          <Route
            element={<UserRoleDetails />}
            path={`${ROUTES.userRoleDetailsPage}`}
            exact
          />
          <Route
            element={<UserDetails />}
            path={`${ROUTES.userDetails}/:id`}
            exact
          />
          <Route
            element={<AddEditRole />}
            path={`${ROUTES.roleAddEditPage}`}
            exact
          />
          <Route
            element={<SpecificUserDetailPage />}
            // path={`${ROUTES.userDetail}/:id`}
            path={`${ROUTES.userDetail}`}
            exact
          />
          <Route element={<Setting />} path={ROUTES.settings} exact />
          <Route
            element={<SessionExpired />}
            path={ROUTES.sessionExpired}
            exact
          />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route element={<Login />} path={ROUTES.login} />
          <Route element={<SignUp />} path={ROUTES.signup} />
        </Route>
      </Routes>

      {location.pathname !== "/" && <Footer />}
      {/* Conditionally render Footer */}
    </>
  );
};

export default MainRoutes;
