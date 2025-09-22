import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CommonSelect } from "../../job-component/CommonSelect";
import { permssionTypes } from "../../constants/data";
import { IosCommonSwitch } from "../../common/IosCommonSwitch";
import { menuItems } from "../../MainMenuDropdown";
import { CommonInputField } from "../../job-component/CreateJobModal";

const TakingUserPermissionsModal = ({ open, handleClose, ModalTitleStyle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStates, setPermissionStates] = useState(
    menuItems?.reduce((acc, permission) => {
      acc[permission.title] = false;
      return acc;
    }, {})
  );

  const handlePermissionChange = (name) => {
    setPermissionStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          // width: "798px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          px: 4,
          pt: 2,
          pb: 4,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={ModalTitleStyle}>Invite users</Typography>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
        </Box>

        {/* <Box
          sx={{
            maxHeight: { md: "290px", xl: "100%" },
            overflowY: "auto",
          }}
          mt={3}
          display="flex"
          flexDirection="column"
        >
          <Typography
            sx={{
              fontSize: ".76562rem",
              color: "#1e2022",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Define permissions
          </Typography>
          <Divider />
          {menuItems?.map((permission) => (
            <Box
              key={permission.title}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="9px 0"
              pr={3}
              // pb={4}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={permission.icon}
                  alt={`${permission.title} icon`}
                  style={{ width: "17px" }}
                />
                <Typography sx={{ color: "#1e2022", fontSize: "14px" }}>
                  {permission.title}
                </Typography>
              </Box>
              <IosCommonSwitch
                checked={permissionStates[permission.title]}
                onChange={() => handlePermissionChange(permission.title)}
              />
            </Box>
          ))}
        </Box>
        <Divider
          sx={{
            opacity: 0.5,
            mb: 4,
            "&::before, &::after": {
              bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
            },
          }}
        />

        <Typography
          sx={{
            fontSize: ".76562rem",
            color: "#1e2022",
            fontWeight: 600,
            mb: 1,
          }}
        >
          Invite by email
        </Typography>
        <Divider
          sx={{
            opacity: 0.5,
            mb: 4,
            "&::before, &::after": {
              bgcolor: ".0625rem solid rgba(231, 234, 243, .7)",
            },
          }}
        /> */}
        <Box component="form" sx={{ display: "flex", mt: 1, width: "100%" }}>
          <CommonInputField
            // width={"29%"}
            isUser={true}
            name={"fullname"}
            placeholder="Enter user's full name"
            // value={jobData.email}
            // value={selectedCurrentData?.email}
            // onChange={handleChange}
            type="text"
            // error={!jobData.email && error.email ? true : false}
          />
          <CommonInputField
            // width={"29%"}
            isUser={true}
            name={"email"}
            placeholder="User's email"
            // value={jobData.email}
            // value={selectedCurrentData?.email}
            // onChange={handleChange}
            type="text"
            // error={!jobData.email && error.email ? true : false}
          />
          {/* <CommonSelect
            width={"230px"}
            // height={"2.6rem"}
            options={permssionTypes}
            placeholder="Select..."
            type="text"
            // name={""}
            // handleChange={handleChange}
            // value={}
          /> */}

          <Button
            variant="contained"
            color="primary"
            sx={{
              width: "16%",
              textTransform: "none",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              px: 2,
            }}
          >
            {/* Send invite */}
            {isLoading ? (
              <CircularProgress
                size={23}
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Invite"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TakingUserPermissionsModal;
