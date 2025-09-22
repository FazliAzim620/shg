import SHGadmins from "../../assets/userManagemnet/defaultrolesIcons/SHGadmins.svg";
import cleints from "../../assets/userManagemnet/defaultrolesIcons/clients.svg";
import providers from "../../assets/userManagemnet/defaultrolesIcons/providers.svg";
import techSupport from "../../assets/userManagemnet/defaultrolesIcons/technicalsuport.svg";
import financeTeam from "../../assets/userManagemnet/defaultrolesIcons/financeTeam.svg";
import travelManagers from "../../assets/userManagemnet/defaultrolesIcons/TravelManagers.svg";
import clientManagers from "../../assets/userManagemnet/defaultrolesIcons/clientmanagers.svg";
import HRandCredentialings from "../../assets/userManagemnet/defaultrolesIcons/HrAndCredentialings.svg";
import {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
} from "../Images";

// used in the file ShiftSchedules.jsx at line 405 for the working days
export const daysArray = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

// Sample providersData
export const paymentData = {
  data: [
    {
      id: 1,
      invoice: "INV-001",
      date: "2023-09-01",
      client: "Client A",
      paymentStatus: "Paid",
      submissionStatus: "Approved by client",
      totalAmount: 1500,
    },
    {
      id: 2,
      invoice: "INV-002",
      date: "2023-09-05",
      client: "Client B",
      paymentStatus: "Pending",
      submissionStatus: "	Sent to SHG",
      totalAmount: 2000,
    },
  ],
  total: 2,
  per_page: 15,
};
export const optionsYesNoUnsure = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Unsure", value: "unsure" },
];

export const flxCntrSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
// =====================default roles array=================
export const defaultRoles = [
  { name: "SHG admins", icon: SHGadmins, userCount: 0 },
  { name: "Client managers", userCount: 1, icon: clientManagers },
  { name: "Finance team", userCount: 2, icon: financeTeam },
  { name: "Travel managers", userCount: 2, icon: travelManagers },
  { name: "HR & credentialing", userCount: 2, icon: HRandCredentialings },
  { name: "Providers", userCount: 2, icon: providers },
  { name: "Clients", userCount: 2, icon: cleints },
  { name: "Technical support", userCount: 2, icon: techSupport },
];

export const medicalSpecialities = [
  {
    id: 3,
    name: "Primary Care",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 4,
    name: "Pediatrics",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 5,
    name: "Women's Health",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 6,
    name: "Geriatrics",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 7,
    name: "Urgent Care",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 8,
    name: "Mental Health",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 9,
    name: "Chronic Disease Management",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
  {
    id: 10,
    name: "Occupational Health",
    status: 1,
    created_at: "2024-07-24T11:00:32.000000Z",
    updated_at: "2024-07-24T11:00:32.000000Z",
  },
];
export const permssionTypes = [
  { value: "Guest", label: "Guest" },
  { value: "Can edit", label: "Can edit" },
  { value: "Can comment", label: "Can comment" },
  { value: "Full access", label: "Full access" },
];
// ----------------------posted jobs  colum names and dummy data----------------------------
export const postedJobsTableColumns = [
  { label: "JOB ID", sortable: true, field: "job_id" },
  { label: "CLIENT NAME", sortable: true, field: "client_name" },
  { label: "JOB TITLE" },
  { label: "SPECIALITY & ROLES" },
  { label: "LOCATION",    },
  // {label:'Facility'}
  // { label: "DUE DATE" },
  { label: "SHIFT START TIME" },
  { label: "SHIFT END TIME" },
  { label: "APPLICATIONS" },
  { label: "JOB STATUS" },
  { label: "SETUP COMPLETION" },
  { label: "ACTIONS" },
];
export const leadsTableColumn = [
  { label: "SERIAL #" },
  { label: "PROVIDER NAME"},
  { label: "LEAD TYPE  " },
  { label: "SUBMITTED FORM" },
  { label: "STATUS",    },
 
  { label: "DATE SUBMITTED " },
  { label: "ASSIGNED TO" },
 
  { label: "ACTIONS" },
];
export const postJobsTableData = [
  {
    id: 1,
    client_name: "Al Khidmat Razi",
    email: "johndoe@example.com",
    image: "https://via.placeholder.com/150",
    title: "Software Engineer",
    description: "Responsible for developing and maintaining web applications.",
    location: "New York, NY",
    dueDate: "26-12-2024",
    step_completed: 2,
    applications: 5,
    status: 1,
    shiftStartTime: "09:00 AM",
    shiftEndTime: "05:00 PM",
  },
  {
    id: 2,
    client_name: "Charing Cross Hospital",
    email: "janesmith@example.com",
    image: "https://via.placeholder.com/150",
    title: "Project Manager",
    description: "Oversees project execution and ensures timely delivery.",
    location: "Los Angeles, CA",
    dueDate: "26-12-2024",
    step_completed: 3,
    applications: 5,
    shiftStartTime: "08:00 AM",
    shiftEndTime: "04:00 PM",
  },
  {
    id: 3,
    client_name: "Navel Complex",
    email: "alicejohnson@example.com",
    image: "https://via.placeholder.com/150",
    title: "Graphic Designer",
    description: "Creates visually appealing designs for marketing materials.",
    location: "Chicago, IL",
    dueDate: "26-12-2024",
    step_completed: 1,
    applications: 5,
    status: 0,
    shiftStartTime: "10:00 AM",
    shiftEndTime: "06:00 PM",
  },
  {
    id: 4,
    client_name: "PIMS",
    email: "michaelbrown@example.com",
    image: "https://via.placeholder.com/150",
    title: "Data Analyst",
    description: "Analyzes data to provide actionable business insights.",
    location: "Houston, TX",
    dueDate: "26-12-2024",
    step_completed: 7,
    applications: 5,
    status: 1,
    shiftStartTime: "07:00 AM",
    shiftEndTime: "03:00 PM",
  },
  {
    id: 5,
    client_name: "Shifa Trust Eye",
    email: "emilydavis@example.com",
    image: "https://via.placeholder.com/150",
    title: "HR Specialist",
    description: "Manages recruitment and employee relations.",
    location: "San Francisco, CA",
    dueDate: "26-12-2024",
    step_completed: 5,
    applications: 5,
    status: 1,
    shiftStartTime: "09:30 AM",
    shiftEndTime: "05:30 PM",
  },
];
export const applicantsTableColumns = [
  { label: "APPLICANT ID", sortable: true, field: "applicantid" },
  { label: "APPLICANT NAME", sortable: true, field: "applicantname" },
  { label: "QUALIFICATION", field: "qualification" }, 
  { label: "LOCATION", field: "location" },
  // { label: "HOURLY RATE", field: "location" },
  { label: "APPLY DATE", field: "applydate" },
  { label: "EXPERIENCE", field: "experience" },
  // { label: "ATTACHMENTS", field: "attachments" },
  { label: "STATUS", field: "status" }, 
  { label: "ACTIONS", field: "actions" },
];

export const applicants = [
  {
    applicantid: "1",
    applicantname: "John Doe",
    email: "john.doe@example.com",
    image: "https://via.placeholder.com/150", // Placeholder image URL
    role: "Project Manager",
    speciality: "Project Management",
    location: "New York, USA",
    applydate: "2024-11-10",
    experience: "5 years",
    attachments: [
      { filename: "resume.pdf", url: "https://example.com/resume.pdf" },
      { filename: "portfolio.pdf", url: "https://example.com/portfolio.pdf" },
    ],
    status: "Shortlisted",
  },
  {
    applicantid: "2",
    applicantname: "Jane Smith",
    email: "jane.smith@example.com",
    image: "https://via.placeholder.com/150", // Placeholder image URL
    role: "Software Engineer",
    speciality: "Web Development",
    location: "San Francisco, USA",
    applydate: "2024-10-15",
    experience: "3 years",
    attachments: [
      { filename: "resume.pdf", url: "https://example.com/resume2.pdf" },
    ],
    status: "Shortlisted",
  },
  {
    applicantid: "3",
    applicantname: "Michael Johnson",
    email: "michael.johnson@example.com",
    image: "https://via.placeholder.com/150", // Placeholder image URL
    role: "Data Analyst",
    speciality: "Data Science",
    location: "Los Angeles, USA",
    applydate: "2024-09-25",
    experience: "4 years",
    attachments: [
      { filename: "resume.pdf", url: "https://example.com/resume3.pdf" },
      {
        filename: "coverletter.pdf",
        url: "https://example.com/coverletter.pdf",
      },
    ],
    status: "Rejected",
  },
  {
    applicantid: "4",
    applicantname: "Emily Davis",
    email: "emily.davis@example.com",
    image: "https://via.placeholder.com/150", // Placeholder image URL
    role: "UX Designer",
    speciality: "User Experience",
    location: "Chicago, USA",
    applydate: "2024-08-30",
    experience: "6 years",
    attachments: [
      { filename: "resume.pdf", url: "https://example.com/resume4.pdf" },
      { filename: "portfolio.pdf", url: "https://example.com/portfolio4.pdf" },
    ],
    status: "Shortlisted",
  },
  {
    applicantid: "5",
    applicantname: "David Lee",
    email: "david.lee@example.com",
    image: "https://via.placeholder.com/150", // Placeholder image URL
    role: "HR Specialist",
    speciality: "Human Resources",
    location: "Miami, USA",
    applydate: "2024-11-05",
    experience: "7 years",
    attachments: [
      { filename: "resume.pdf", url: "https://example.com/resume5.pdf" },
    ],
    status: "Rejeted",
  },
];

export const applicantsAttachments = [
  { id: 1, name: "Costa Quinn resume.pdf", size: "80kb" },
  { id: 2, name: "John Doe report.doc", size: "120kb" },
  { id: 3, name: "Jane Smith analysis.pdf", size: "150kb" },
  { id: 4, name: "Project plan.doc", size: "100kb" },
];
