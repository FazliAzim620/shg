import API, { baseURLImage } from "../API";

export const getProviderJobs = async (id, completed_jobs = "") => {
  let url = `/api/get-jobs?provider_id=${id}`;
  if (completed_jobs) url = `${url}&completed_jobs=${completed_jobs}`;
  try {
    const resp = await API.get(url);
    return resp;
  } catch (error) {
    console.log(error);
  }
};
export const getProviderWeeks = async (id) => {
  try {
    const resp = await API.get(`/api/get-job-weeks/${id}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};
export const getCurrentJobBudgetPreferences = async (id) => {
 
  try {
    const resp = await API.get(`/api/get-job-budget-preferences/${id}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const getProviderClients = async (provider_id) => {
  const url = provider_id
    ? `/api/get-provider-clients?provider_id=${provider_id}&with_job_count=true`
    : `/api/get-provider-clients?with_job_count=true`;

  try {
    const resp = await API.get(url);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const getProviderClientsAssignments = async (client_id, provider_id) => {
  try {
    const url = provider_id
      ? `/api/get-provider-assignment-letters/${client_id}?provider_id=${provider_id}`
      : `/api/get-provider-assignment-letters/${client_id}`;

    const resp = await API.get(url);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export const getProviderTravelItinerary = async (id) => {
  try {
    const resp = await API.get(`api/get-provider-travel-itinerary/${id}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};
export const getJobTravelItinerary = async (id) => {
  try {
    const resp = await API.get(`/api/get-job-travel-itinerary/${id}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

// =======================================================
export const getProviderAvailability = async (provider_id) => {
  try {
    // Construct the URL based on whether provider_id is provided or not
    const url = provider_id
      ? `api/get-provider-availability?provider_id=${provider_id}`
      : `api/get-provider-availability`;

    const resp = await API.get(url);
    return resp;
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error if needed for further handling
  }
};

export const getProviderSchedular = async (provider_id, client_id,from_date,to_date) => {
   
  try { 
    let url = "api/get-provider-schedules";
 
    let queryParams = [];
 
    if (provider_id) {
      queryParams.push(`provider_id=${provider_id}`);
    }
 
    if (client_id) {
      queryParams.push(`client_id=${client_id}`);  
    }
 
   
   
      queryParams.push(`from_date=${from_date || ''}`);  

      queryParams.push(`to_date=${to_date  || ''}`);  
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      } 
    // Make the API request
    const resp = await API.get(url);
    return resp;
  } catch (error) {
    console.error("Error fetching provider schedules:", error);
    // Handle or rethrow the error as needed
  }
};
//-------------------------------------------------------  get timesheet receipts
export const fetchExistingFiles = async (shiftId) => {
  const resp = await API.get(
    `/api/get-job-timesheet-detail-attachments/${shiftId}`
  );
  return resp;
};
//-------------------------------------------------------  add timesheet receipts
export const sendFilesToAPI = async (files, shiftId) => {
  const formData = new FormData();
  formData.append("timesheet_id", shiftId);
  files.forEach((receipt, index) => {
    formData.append(`files[${index}]`, receipt);
  });

  try {
    const resp = await API.post(
      `/api/add-job-timesheet-detail-attachments`,
      formData
    );
  } catch (error) {
    console.log(error);
  }
};

// ===========================getCurrentDateTime==============================
export const getCurrentDateTime = () => {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Using toLocaleString to format the date and time
  return now
    .toLocaleString("en-US", options)
    .replace(",", "  ") // Remove the comma from the date
    .replace(" ", ""); // Remove the space between date and time
};

// ===========================getCountries==============================
export const getClients = async () => {
  try {
    const response = await API.get(`/api/get-clients`);
    return response;
  } catch (error) {
    console.log(error);
  }
};
// ===========================getCountries==============================
export const getCountries = async () => {
  try {
    const response = await API.get(`/api/get-countries`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// ===========================getStates==============================
export const getStates = async (id) => {
  try {
    const response = await API.get(`/api/get-states?country_id=${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// =========================== getroles ==============================
export const getroles = async (val) => {
  try {
    let url = "/api/get-roles";
    if (val) url = `${url}?defualt=${val}`;
    const response = await API.get(url);
    return response.data; // Return only the data from the response
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch roles."); // Throw an error with a message
  }
};
// ===========================getusers==============================

export const getUsers = async (data) => {   
  let url;

  if (data?.page) {
    url = `/api/get-users?role=${data?.role || ""}&page=${data.page ||1}&paginate=${data.per_page}&status=${data?.status || ""}&search=${data?.search}&email=${data?.email ||''}`;
  } else {
    url = `/api/get-users?role=${data?.role || ""}&status=${data?.status || ""}`;
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCredentialDocuments = async (data) => {   
  let url;
   if (data?.page && data?.type=='filter') {
    url = `/api/get-cred-docs?page=${data.page ||1}&paginate=${data.per_page}&is_required=${data?.is_required || ""}&search=${data?.search}&has_expiry=${data?.has_expire ||''}&name=${data?.name ||''}&doc_type_id=${data?.document_type ||''}`;
  } else {
    url = `/api/get-cred-docs?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search}&name=${data?.name ||''} `;
 
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getReferenceForms = async (data) => {    
  let url;
   if (data?.page && data?.type=='filter') {
    url = `/api/get-cred-profess-ref-form?page=${data.page ||1}&paginate=${data.per_page}&is_required=${data?.is_required || ""}&search=${data?.search}&name=${data?.name ||''}&provider_role_ids=${data?.provider_role_ids  ||''}`;
  } else {
    url = `/api/get-cred-profess-ref-form?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search}&name=${data?.name ||''} `;
 
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getFormsDocument = async (data) => {   
  let url;
   if (data?.page && data?.type=='filter') {
    url = `/api/get-cred-form?page=${data.page ||1}&paginate=${data.per_page}&is_required=${data?.is_required || ""}&search=${data?.search}&name=${data?.name ||''}&provider_role_ids=${data?.provider_role_ids  ||''}`;
  } else {
    url = `/api/get-cred-form?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search}&name=${data?.name ||''} `;
 
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getOnboardingDocument = async (data) => {   
  let url;
   if (data?.page && data?.type=='filter') {
    url = `/api/get-cred-onb-packages?page=${data.page ||1}&paginate=${data.per_page}&is_required=${data?.is_required || ""}&search=${data?.search}&name=${data?.name ||''}&provider_role_ids=${data?.provider_role_ids  ||''}`;
  } else {
    url = `/api/get-cred-onb-packages?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search}&name=${data?.name ||''} `;
 
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getOrganizationSystemGeneratedDocuments = async (data) => {   
  
  let url;
   if (data?.page && data?.type=='filter') {
    url = `/api/get-cred-org-generated-docs?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search}&name=${data?.name ||''}&purpose=${data?.purpose ||''}&provider_role_ids =${data?.provider_role_ids  ||''}`;
  } else {
    url = `/api/get-cred-org-generated-docs?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search} `;
 
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getOrganizationsDocuments = async (data) => {   
  
  let url;
   if (data?.page && data?.type=='filter') {
    url = `/api/get-cred-org-upload-docs?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search}&name=${data?.name ||''}&purpose=${data?.purpose ||''}&provider_role_ids =${data?.provider_role_ids  ||''}`;
  } else {
    url = `/api/get-cred-org-upload-docs?page=${data.page ||1}&paginate=${data.per_page}&search=${data?.search} `;
 
  }

  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
 
// export const getUsers = async (data) => {
//   console.log("data", data.status);
//   try {
//     const response = await API.get(
//       `/api/get-users?role=${data?.role ? data?.role : data}&status=${
//         data?.status
//       }`
//     );
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };
export const getClientBudgetPreferences = async (id) => {
  try {
    const response = await API.get(`/api/get-client-budget-preference/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPermissions = async (id) => {
  try {
    let url = "/api/get-permissions";
    url = id ? `${url}?role_id=${id}` : url;
    const response = await API.get(url);
    return response;
  } catch (error) {
    console.log(error);
  }
};
// ---------------------------------------------------- client members
export const getClientMembers = async (id) => {
  try {
    const response = await API.get(`/api/get-client-team/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addClientMember = async (data) => {
  try {
    const resp = await API.post(`/api/add-client-team-member`, data);
    return resp;
  } catch (error) {
    console.log(error);
  }
};
export const deleteClientMember = async (id) => {
  try {
    const resp = await API.delete(`/api/delete-client-team-member/${id}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              resolve(data); // Return the country data
            })
            .catch((err) => {
              reject("Failed to fetch country data");
            });
        },
        (error) => {
          reject("Failed to get location");
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};
export const calculateMonthsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return 0; 
  }

  const yearsDifference = end.getFullYear() - start.getFullYear();
  const monthsDifference = end.getMonth() - start.getMonth();

  let totalMonths = yearsDifference * 12 + monthsDifference;

  if (end.getDate() < start.getDate()) {
    totalMonths--;
  }

  if (totalMonths < 0) {
    totalMonths = 0;
  }

  return totalMonths + 1; 
};
// -------------------------------------- export status check and download export
export const downloadExport = async (file) => {

  try {
    const url = `${baseURLImage}api/download-export/${file}`;
    window.open(url, "_blank");
  } catch (error) {
    console.log(error);
  }
};
export const checkGetReadyExport = async (id, startTime = Date.now()) => {
  try {
    const resp = await API.get(`/api/export-status/${id}`);

    if (resp?.data?.success) {
      const status = resp?.data?.data?.job_status?.status;
      
      if (status === 1) {
        downloadExport(resp?.data?.data?.job_status?.file_name);
      } else if (status === 0) { 
        const elapsedTime = Date.now() - startTime;

        let delay = 5000;  

        if (elapsedTime >= 120000 && elapsedTime < 300000) { 
          delay = 10000;
        } else if (elapsedTime >= 300000) { 
          delay = 30000;
        }

        console.log(`Status is 0, retrying in ${delay / 1000} seconds...`);

        // Wait for the delay and then retry the function
        setTimeout(() => checkGetReadyExport(id, startTime), delay);
      }
    }

    return resp;
  } catch (error) {
    console.log(error);
  }
};


// export const checkGetReadyExport = async (id) => {
//   try {
//     const resp = await API.get(`/api/export-status/${id}`);

//     if (resp?.data?.success) {
//       if (resp?.data?.data?.job_status?.status) {
//         downloadExport(resp?.data?.data?.job_status?.file_name);
//       }
     
//     }
//     return resp
//   } catch (error) {
//     console.log(error);
//   }
// };