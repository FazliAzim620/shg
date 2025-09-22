import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import {
  Business,
  WorkOutline,
  CalendarMonth,
  Group,
  Flight,
  AttachMoneyOutlined,
  AccessTimeOutlined,
  ReceiptOutlined,
  VerifiedOutlined,
  AssignmentSharp,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    height: "3px",
  },
  // Remove the bottom border of the Tabs component
  "& .MuiTabs-flexContainer": {
    borderBottom: "none",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  minWidth: "auto",
  padding: "0px 16px",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));
const ScrollableTabBar = ({ activeTab, onTabChange }) => {
  const param = useParams();
  const navigate = useNavigate();
  const { userRolesPermissions } = useSelector((state) => state.login);
  const permissions = userRolesPermissions?.user_roles_permissions?.map(
    (item) => item?.name
  );
  const { currentClient } = useSelector((state) => state.clientBasicInfo);
  const url = currentClient?.name?.toLowerCase()?.replace(/ /g, "-");
  const roleData = [
    {
      id: 1,
      label: "Client details",
      icon: <Business />,
      url: `/${url}/details/${param.id}`,
      permission: "read clients info",
    },
    {
      id: 2,
      label: "Job orders",
      icon: <WorkOutline />,
      url: `/${url}/jobs-order/${param.id}`,
      permission: "read clients job order",
    },
    {
      id: 3,
      label: "Shifts",
      icon: <CalendarMonth />,
      url: `/${url}/shifts/${param.id}`,
      permission: "read clients shift",
    },
    {
      id: 4,
      label: "Providers",
      icon: <Group />,
      url: `/${url}/providers/${param.id}`,
      permission: "read clients providers",
    },

    {
      id: 6,
      label: "Budget preferences",
      icon: <AttachMoneyOutlined />,
      url: `/${url}/preferences/${param.id}`,
      permission: "read clients budget preferences",
    },
    {
      id: 7,
      label: "Timesheets",
      icon: <AccessTimeOutlined />,
      url: `/${url}/timesheet/${param.id}`,
      permission: "read clients timesheets",
    },
    {
      id: 8,
      label: "Invoices",
      icon: <ReceiptOutlined />,
      url: `/${url}/invoices/${param.id}`,
      permission: "read clients invoices",
    },
    {
      id: 9,
      label: "Credentials",
      icon: <VerifiedOutlined />,
      url: `/${url}/credentials/${param.id}`,
      permission: "read clients credentials",
    },
    {
      id: 10,
      label: "Reports",
      icon: <AssignmentSharp />,
      url: `/${url}/reports/${param.id}`,
      permission: "read clients reports",
    },
  ];
  const filteredTabs = roleData.filter((tab) => {
    if (tab.permission) {
      return permissions?.includes(tab.permission);
    }
    return true;
  });

  const handleTabChange = (event, newValue) => {
    const selectedTab = filteredTabs[newValue];

    if (selectedTab) {
      navigate(selectedTab.url);
    }
    onTabChange(newValue);
  };
  return (
    <Box
      sx={{
        mx: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="scrollable tabs"
          scrollButtons={false}
        >
          {filteredTabs?.map((item) => (
            <StyledTab
              key={item.id}
              icon={item.icon}
              iconPosition="start"
              label={item.label}
            />
          ))}
        </StyledTabs>
      </Box>
    </Box>
  );
};

export default ScrollableTabBar;
