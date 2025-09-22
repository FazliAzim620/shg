import { Box, IconButton, Modal } from "@mui/material";
import React from "react";
import CustomTypographyBold from "../../components/CustomTypographyBold";
import { Close } from "@mui/icons-material";
import ExpensesTable from "../../provider_portal/provider_components/ExpensesTable";
import NodataFoundCard from "../../provider_portal/provider_components/NodataFoundCard";
const ExpensesModal = ({ open, onClose, data }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", md: 898 },
          maxWidth: "900px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,

          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <CustomTypographyBold color={"text.black"} fontSize={".98438rem"}>
            Attachments
          </CustomTypographyBold>
          <IconButton onClick={onClose} sx={{ mr: -1, color: "text.or_color" }}>
            <Close />
          </IconButton>
        </Box>
        {data?.timesheet_detail_attachments?.length === 0 ? (
          <NodataFoundCard title={"No attachments uploaded"} />
        ) : (
          <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}>
            <ExpensesTable
              expenses={data?.timesheet_detail_attachments}
              view={true}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ExpensesModal;
