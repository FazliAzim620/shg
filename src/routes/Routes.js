const ROUTES = {
  dashboard: "/",
  test: "/test",
  select: "/select-role-page",
  analytics: "/analytics",
  referee:'/complete-reference',
  // jobManagement: "/job-management",
  jobManagement: "/assignment-management", 
  providerInfo: "/assignment-management/provider-information/",
  jobs: "/jobs",
  leads:'/leads',
  serviceProviders: "/service-providers",
  serviceProviderDetails: "/service-provider-details/",
  credentialing: "/credentialing",
  credentialingDetails: "/credentialing-provider-details",
  createnewpackage:"/create-new",
  schedules: "/shifts",
  clients: "/clients",
  clientHome: "/client",
  timesheets: "/timesheets",
  timesheetDetails: "/timesheet/detail",
  financials: "/financials",
  userManagement: "/user-management",
  rolePermissionManagement: "/role-&-permissions",
  settings: "/settings",
  login: "/login",
  signup: "/signup",
  roleIndexPage: "/role-index-page",  
  userRoleDetailsPage: "/role-details",  
  userDetails: "/user-details",  
  roleAddEditPage: "/add-edit-role", 
  userDetail: "/user-details",
  forgotPswd: "/forgot-password",
  resetPswd: "/reset-password/",
  sessionExpired: "/session-expired",
  postJobDetail: "/job-detail/",
  dynamicFormRoute:'/create-form',
  organizationForm:'/create-organization-form',
  referenceForm:'/create-reference-form',
};
export default ROUTES;
// ------------------------------- Provider routes
export const PROVIDER_ROUTES = {
  login: "/login",
  provdierMain: "/",
  timeSheet: "/job-provider-sheet",
  timeSheetDetail: "/provider-sheet-detial",

  assignmentsLetter: "/provider-assignment-letters",

  credentials: "/provider-credentials",

  travelItinerary: "/provider-travel-Itinerary",

  scheduling: "/provider-scheduling",

  myTimeSheets: "/provider-my-timesheet",

  payments: "/provider-payments",

  settings: "/provider-settings",

  providerProfile: "/provider-profile",
};
