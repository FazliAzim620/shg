//These are attachments uploaded by applicants as part of their job applications, such as CVs, resumes and certificates.
import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { downloadHandlerFile, getFileIcon } from "../../../util";
import { HeadingCommon } from "../../../provider_portal/provider_components/settings/profile/HeadingCommon";
import { downloadIcon, eyeIcon } from "../../Images";
import { applicantsAttachments } from "../../constants/data";
import { FileDownloadOutlined } from "@mui/icons-material";

const Attachments = ({ applicantAttachment, mode }) => {
  return (
    <Box
      sx={{
        border: "0.5px solid #DEE2E6",
        borderRadius: "12px",
        mb: 3.5,
      }}
    >
      {/* {applicantsAttachments.map((file, index) => ( */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          py: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            style={{ marginLeft: 10 }}
            src={getFileIcon(applicantAttachment)}
            width={40}
            alt={`${applicantAttachment} icon`}
          />

          <Box ml={2}>
            <Tooltip
              arrow
              placement="top"
              title={
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: "200px",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    color: "#ffffff",
                  }}
                >
                  {applicantAttachment}
                </Typography>
              }
            >
              <HeadingCommon
                mb={"0px"}
                title={
                  applicantAttachment?.length > 40
                    ? `${applicantAttachment?.slice(0, 40)}...`
                    : applicantAttachment
                }
                fontSize={14}
              />
              <Typography fontSize={12.3} color={"#677788"}>
                {/* {file.size} */}
              </Typography>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <img
            style={{ marginRight: 10 }}
            src={eyeIcon}
            width={16}
            alt={`${applicantAttachment} icon`}
          /> */}
          <IconButton onClick={() => downloadHandlerFile(applicantAttachment)}>
            {mode ? (
              <FileDownloadOutlined />
            ) : (
              <img
                style={{ marginRight: 10 }}
                src={downloadIcon}
                width={16}
                alt={`${applicantAttachment} icon`}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      {/* ))} */}
    </Box>
  );
};

export default Attachments;
