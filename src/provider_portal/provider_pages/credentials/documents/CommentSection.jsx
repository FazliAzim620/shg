import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import API from "../../../../API";

const CommentSection = ({
  id,
  postedComments,
  setComments,
  getDocumentTypesHandler,
}) => {
  const [comment, setComment] = useState("");

  const handleAddComment = async () => {
    if (comment.trim()) {
      // Optimistically add the comment locally
      setComment("");
      try {
        // Send the comment to the API
        const response = await API.post(
          "/api/admin/credentialing/add-document-comment",
          {
            doc_uploaded_id: id, // Assuming `id` is passed as a prop
            comment: comment,
          }
        );
        if (response?.data?.success) {
          setComments((prevComments) => [...prevComments, response.data?.data]);
          getDocumentTypesHandler();
        }
      } catch (error) {
        // Handle any errors (e.g., network failure)
        console.error("Failed to add comment:", error);
        // Optionally, revert the local comment if the API fails
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
      }}
    >
      {/* Comments List */}
      <Box
        sx={{
          mb: 3,
          height: { xs: 300, xl: 600 }, // Fixed height for scrollable area
          overflowY: "auto",

          pr: 1, // Padding for the scrollbar
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#999",
          },
        }}
      >
        {postedComments?.length > 0 ? (
          postedComments?.map((commentItem) => {
            const fullName = commentItem?.commented_by
              ? commentItem?.commented_by?.name
                ? commentItem?.commented_by?.name
                : `${commentItem?.commented_by?.first_name} ${commentItem?.commented_by?.last_name}`
              : "Anonymous"; // If commented_by is an object, extract the full name

            return (
              <Paper
                key={commentItem?.id}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Avatar
                    src={commentItem?.signature || "default-avatar-url.jpg"} // Assuming `signature` holds a base64 image or use a default
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#666",
                          fontSize: "0.75rem",
                        }}
                      >
                        {new Date(commentItem?.created_at).toLocaleString()}
                      </Typography>
                      <IconButton size="small" sx={{ color: "#666" }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        lineHeight: 1.4,
                        fontSize: "0.875rem",
                      }}
                    >
                      <strong>{fullName}</strong>: {` ${commentItem?.comment}`}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#888",
                fontSize: "1.25rem",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Be the first to comment!
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#555",
                maxWidth: "300px",
                marginBottom: "40px",
              }}
            >
              No one has left a comment yet. Share your thoughts with us.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add Comment Section */}
      <Box sx={{}}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            mb: 2,
            color: "#333",
            fontSize: "1rem",
          }}
        >
          Add comment
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#bbb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 1,
                },
              },
              "& .MuiInputBase-input": {
                padding: "12px 14px",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#999",
                opacity: 1,
              },
            }}
          />
          <IconButton
            onClick={handleAddComment}
            disabled={!comment.trim()}
            sx={{
              backgroundColor: "#6c757d",
              color: "white",
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: "#5a6268",
              },
              "&:disabled": {
                backgroundColor: "#e9ecef",
                color: "#6c757d",
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentSection;
