import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  styled,
  Badge,
  Link,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DeleteOutlineOutlined,
  BadgeOutlined,
} from "@mui/icons-material";
import CustomButton from "../CustomButton";

import { DeleteConfirmModal } from "../handleConfirmDelete";
const StyledBadge = styled(Badge)(({ theme, online }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: online ? "#44b700" : "#ffa000",
    color: online ? "#44b700" : "#ffa000",

    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: online && "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserInfoCard = ({ data, setEditData, setOpenModal, deleteMember }) => {
  const { name, job_title, phone, email } = data;
  const editHandler = (data) => {
    setOpenModal(true);
    setEditData(data);
  };

  const deleteHandler = (id) => {
    deleteMember(id);
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        pl: 2,
        py: 1,
        boxShadow: "0 .375rem .75rem rgba(140, 152, 164, .075)",
        borderRadius: "10px",
        mx: 2,
      }}
    >
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        online={data?.isOnline}
      >
        <Avatar
          src={data?.avatar}
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#EBF2FF",
            color: "#1976d2",
            fontSize: "1.5rem",
            textTransform: "capitalize",
          }}
        >
          {name ? name?.charAt(0) : data?.first_name?.charAt(0)}
        </Avatar>
      </StyledBadge>
      <CardContent sx={{ flex: 1, py: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              pt: 1,
              textAlign: "left",
              width: "30%",
            }}
          >
            <Link
              component="button"
              variant="body2"
              underline="none"
              onClick={() => {
                console.info("team user details");
              }}
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "21px",
                textTransform: "capitalize",
                color: "text.black",
                "&:hover": {
                  color: "text.btn_blue",
                },
              }}
            >
              {name ? name : data?.first_name + " " + data?.last_name}
            </Link>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <BadgeOutlined sx={{ fontSize: "1rem" }} /> {job_title}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              mt: 1,

              width: "50%",
            }}
          >
            <PhoneIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary", fontSize: "0.9rem" }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mr: 2, fontSize: "0.75rem" }}
            >
              {phone}
            </Typography>
            <EmailIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary", fontSize: "0.75rem" }}
            />
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>

          <Box sx={{ width: "20%", mt: 1, textAlign: "right" }}>
            <CustomButton
              onClick={() => editHandler(data)}
              padding="5px 10px"
              label={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <EditIcon sx={{ fontSize: "1rem", mr: 1 }} /> Edit
                </Box>
              }
              // onClick={onEdit}
              size="small"
            />
            <CustomButton
              onClick={() => deleteHandler(data?.id)}
              mr={"0px"}
              padding={"5px 10px"}
              label={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "red",
                  }}
                >
                  <DeleteOutlineOutlined sx={{ fontSize: "1rem", mr: 1 }} />{" "}
                  Delete
                </Box>
              }
              // onClick={onDelete}
              size="small"
            >
              <DeleteIcon />
            </CustomButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
