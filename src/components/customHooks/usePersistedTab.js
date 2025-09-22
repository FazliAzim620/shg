// usePersistedTab.js
import { useState, useEffect } from "react";

const usePersistedTab = (initialTab = 0) => {
  const [tabIndex, setTabIndex] = useState(() => {
    const savedTabIndex = sessionStorage.getItem("currentTabIndex");
    return savedTabIndex !== null ? parseInt(savedTabIndex, 10) : initialTab;
  });

  useEffect(() => {
    sessionStorage.setItem("currentTabIndex", tabIndex);
  }, [tabIndex]);

  return [tabIndex, setTabIndex];
};

export default usePersistedTab;