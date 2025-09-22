import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import { setPackageInfo } from "../../feature/onboarding/packageSlice";
import { CommonSelect } from "../job-component/CommonSelect";
import { CommonInputField } from "../job-component/CreateJobModal";
import MultipleSelectCheckmarks from "../common/MultipleSelectCheckmarks";
import { selectOptions } from "../../util";
const PackageInfo = () => {
  const dispatch = useDispatch();
  const packageInfo = useSelector((state) => state.package.packageInfo);
  const [error, setError] = React.useState({});
  const { providerRolesList, medicalSpecialities } = useSelector(
    (state) => state.job
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPackageInfo({ [name]: value }));
  };

  const roleOptions = selectOptions(providerRolesList);

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        bgcolor: "background.paper",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Package Information
      </Typography>

      {/* Package Name */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ mb: 1 }}>
          Package name
        </Typography>
        <CommonInputField
          name="packageName"
          placeholder="Basic onboarding package"
          value={packageInfo.packageName || ""}
          onChange={handleChange}
          type="text"
          error={!packageInfo.packageName && error.packageName ? true : false}
        />
      </Box>

      {/* Roles */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ mb: 1 }}>
          Roles
        </Typography>
        <MultipleSelectCheckmarks
          width={"900px"}
          name="provider_specialities"
          options={roleOptions}
          value={packageInfo.roles || []}
          onChange={(e, value) => {
            dispatch(setPackageInfo({ ["roles"]: value }));
          }}
          error={!packageInfo.roles && error.roles ? true : false}
        />
      </Box>

      {/* Status */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ mb: 1 }}>
          Status
        </Typography>
        <CommonSelect
          name="status"
          value={packageInfo.status || ""}
          handleChange={handleChange}
          placeholder="Select status"
          options={statusOptions}
          error={!packageInfo.status && error.status ? true : false}
        />
      </Box>
    </Box>
  );
};

export default PackageInfo;
