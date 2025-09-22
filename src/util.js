import Cookies from "js-cookie";
import { format, formatDistanceToNow, parse, parseISO } from "date-fns";
import { baseURLImage } from "./API";
import { default as PdfIcon } from "../src/assets/brands/pdf-icon.svg";
import { default as DocIcon } from "../src/assets/brands/docs_icon.png";
import { Switch } from "@mui/material";
import { persistor } from "./store";

export const logoutHandler = async () => {
  await persistor.purge(); // Wait for purge to complete
  localStorage.clear();
  Cookies.remove("token");
  Cookies.remove("role");
};
export const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = parse(timeString, "HH:mm:ss", new Date());
  return format(date, "HH:mm");
};
export const alphabetic = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
  { value: "e", label: "E" },
  { value: "f", label: "F" },
  { value: "g", label: "G" },
  { value: "h", label: "H" },
  { value: "i", label: "I" },
  { value: "j", label: "J" },
  { value: "k", label: "K" },
  { value: "l", label: "L" },
  { value: "m", label: "M" },
  { value: "n", label: "N" },
  { value: "o", label: "O" },
  { value: "p", label: "P" },
  { value: "q", label: "Q" },
  { value: "r", label: "R" },
  { value: "s", label: "S" },
  { value: "t", label: "T" },
  { value: "u", label: "U" },
  { value: "v", label: "V" },
  { value: "w", label: "W" },
  { value: "x", label: "X" },
  { value: "y", label: "Y" },
  { value: "z", label: "Z" },
];
export const isFileSizeValid = (file, maxSizeMB) => {
  const maxSize = maxSizeMB * 1024 * 1024;
  return file?.size <= maxSize;
};

export const selectOptions = (data) =>
  data?.map((option) => ({
    value: option.id,
    label: option.abbrevation
      ? `${option.name} (${option.abbrevation})`
      : option.name,
  }));

// global scrollToTop funtion
export const scrollToTop = (top) => {
  window.scrollTo({
    top:top?top: 0,
    behavior: "smooth",
  });
};
export const getTimeAgo = (updatedAt) => {
  const updatedDate = parseISO(updatedAt);
  return ` ${formatDistanceToNow(updatedDate, { addSuffix: true })}`;
};
export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "dd MMM");
  return formattedDate;
};
export const formatOnlyDate = (dateString) => {
  const date = new Date(dateString);
  
  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); 
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};

// export const formatOnlyDate = (dateString) => {
//   const date = new Date(dateString);
//   const formattedDate = date.toISOString().split("T")[0];
//   return formattedDate;
// };
// Utility function to convert full day names to abbreviated forms
export const abbreviateDays = (daysString) => {
  const dayMap = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  // Split the input string by commas and trim extra spaces
  const days = daysString.split(",").map((day) => day.trim());

  // Map each day to its abbreviation
  const abbreviatedDays = days.map((day) => dayMap[day] || day);

  return abbreviatedDays.join(",");
};
export const downloadHandlerFile = async (fileName) => {
  // const url = `${baseURLImage}api/download-file/${fileName}`; 
const url = `${baseURLImage}api/download-file/${fileName}/uploads/credentialing/organization`;
  window.open(url, "_blank");
};

//===============24 hours time to 12 hour along AM & PM==============
export const formatTo12Hour = (time) => {
  let [hours, minutes, seconds] = time.split(":");
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
};

//===============24 hours time to 12 hour along AM & PM==============
export const createdDateToformatDate = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date)) {
    throw new Error("Invalid date input");
  }
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

//=================================getFileIcon
export const getFileIcon = (fileName) => {
  const extension = fileName?.split(".").pop().toLowerCase(); 
  switch (extension) {
    case "pdf":
      return PdfIcon;
    case "doc":
    case "docx":
    case "docs":
      return DocIcon;
    default:
      return "no icon";  
  }
};

export const checkEmailExists = (email, data) => {
  const record = data?.find((record) => record?.email === email);
  return record ? true : false;
};

// ==========calendarEventStyle - used for styling the events of calendar==========
export const eventStyleGetter = (event, color, site, width = null) => {
  const screenWidth = window.innerWidth;
  
  let eventWidth;
  let fontSize;

  if (screenWidth < 600) {
    eventWidth = "100%";  
    fontSize = "0.6rem"; 
  } else if (screenWidth >= 600 && screenWidth < 1400) {
    eventWidth = width ? width : "140px"; 
    fontSize = "0.69rem"; 
  } else {
    eventWidth = width ? width : "160px";
    fontSize = "0.75rem";
  }

  return {
    style: {
      cursor: "pointer",
      textAlign: "center",
      fontSize: event?.myJobs ? fontSize : "0.79rem",  
      margin: " 4px  auto 0px auto",
      color: "black",
      fontWeight: 600,
      width: eventWidth, 
      background: color,
      padding: "5px",
      borderRadius: "3px",
    },
  
    className: `${site === "provider" ? "custom-event" : "admin_custom_event"}`,
  };
};

// ==========capitalizeFirstLetter==========
export const capitalizeFirstLetter = (string) =>
  string?.charAt(0)?.toUpperCase() + string?.slice(1);

// ==========sentense case==========
export const toSentenceCase = (input = "") =>
  input
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());

//--------------------------------------------------------------- timesheet status

//======================if profile image not found then first letter of name==================================
export const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");
