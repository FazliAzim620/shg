import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loginReducer from "./feature/loginSlice.js";
import themeReducer from "./feature/themeSlice.js";
import jobReducer from "./feature/jobSlice.js";
import postJobReducer from "./feature/post-job/PostJobSlice.js";
import clientReducer from "./feature/clientSlice.js";
import leadsReducer from "./feature/leads/LeadsSlice.js";
import budgetPreferencesReducer from "./feature/budgetPreferenceSlice.js";
import clientConfirmationLetterReducer from "./feature/clientConfirmationLetter.js";
import providerConfirmationLetterReducer from "./feature/providerConfirmationLetter.js";
import shiftSchedulesReducer from "./feature/shiftSchedulesSlice.js";
import travelReducer from "./feature/travelSlice.js";
import hotelReducer from "./feature/hotelBookingSlice.js";
import carRentalReducer from "./feature/carRentalBooking.js";
import getUserInfoReducer from "./feature/settings/getUserInfoSlice.js";
import getCurrentJobReducer from "./feature/providerPortal/currentJobSlice.js";
import getCurrentTimesheetReducer from "./feature/timesheets/timesheetsSlice.js";
import serviceProviderReducer from "./feature/service_provider/serviceProvider.js";
import providerSchedulesReducer from "./feature/providerPortal/providerSchedulesSlice.js";
import providerAvailabilityReducer from "./feature/providerPortal/getProviderAvailiblitySlice.js";
import clientModuleBasicInfoReducer from "./feature/client-module/clientSlice.js";
import getRolesReducers from "./feature/userManagmentModule/GetRolesSlice.js"; 
import alertReducer from './feature/alert-message/alertSlice.js'
import organizationFormReducer from './feature/form-builder/organizationFormSlice.js'
import referenceFormReducer from './feature/form-builder/referenceFormSlice.js'
import packageReducer from './feature/onboarding/packageSlice.js';
const persistConfig = {
  key: "root",
  storage,
  // Optionally, you can whitelist specific reducers to persist
  // whitelist: ['login', 'theme']
};
const rootReducer = combineReducers({
  alert: alertReducer,
  //---------------------------------------------- admin portal reducers
  login: loginReducer,
  userInfo: getUserInfoReducer,
  theme: themeReducer,
  job: jobReducer,
  postJob: postJobReducer,
  leads: leadsReducer,
  client: clientReducer,
  budgetPreferences: budgetPreferencesReducer,
  clientConfirmation: clientConfirmationLetterReducer,
  providerConfirmation: providerConfirmationLetterReducer,
  shiftSchedules: shiftSchedulesReducer,
  travel: travelReducer,
  hotel: hotelReducer,
  carRental: carRentalReducer,
  providerDetails: serviceProviderReducer,
  currentTimesheet: getCurrentTimesheetReducer,
  clientBasicInfo: clientModuleBasicInfoReducer,
  users: getRolesReducers,
  package: packageReducer,
  // --------------------------------------------- form builder
  organizationForm: organizationFormReducer,
  referenceForm: referenceFormReducer,
  // --------------------------------------------- provider portal reducers
  currentJob: getCurrentJobReducer,
  providerSchedules: providerSchedulesReducer,
  providerAvailability: providerAvailabilityReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
