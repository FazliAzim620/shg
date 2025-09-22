// clientConfirmationLetterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  deleteAttachment,
  getJobAttachment,
  updateAttachmentStatus,
  uploadConfirmationLetter,
} from "../thunkOperation/job_management/providerInfoStep";

const initialState = {
  job_id: "",
  isActive: 0,
  files: [],
  uploadProgress: 0,
  status: "idle",
  type: "client",
  error: null,
};
const clientConfirmationLetterSlice = createSlice({
  name: "clientConfirmationLetter",
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
      state.error=null
    },
    setUploadStatus: (state, action) => {
      state.status = action.payload;
    },
    uploadFile: (state, action) => {
      // state.files.push( action.payload)
      state.error=null
    },
    setJobId: (state, action) => {
      state.job_id = action.payload;
    },

    resetClientConfirmationFields: (state) => {
      return initialState;
    },
    deleteFile: (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobAttachment.pending, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "loading";
        }
      })
      .addCase(getJobAttachment.fulfilled, (state, action) => {
        if (action.payload.type === "client") {
          state.status = "succeeded";
          state.files = action.payload?.data?.data;
        }
      })
      .addCase(getJobAttachment.rejected, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "failed";
          state.error = action.payload.error;
        }
      })
      .addCase(uploadConfirmationLetter.pending, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "loading";
        }
      })
      .addCase(uploadConfirmationLetter.fulfilled, (state, action) => {
        if (action.payload.type === "client") {
          state.status = "succeeded";
          state.files = state.files.map((file) => ({
            ...file,
            is_active: 0,
          }));
          const newFile = {
            ...action.payload.data?.data,
            is_active: 1,
          };

          state.files.unshift(newFile);
          state.uploadProgress = 0;
        }
      })
      .addCase(uploadConfirmationLetter.rejected, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "failed";
          state.error = action.payload.error;
        }
      })
      .addCase(updateAttachmentStatus.pending, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "loading";
        }
      })
      .addCase(updateAttachmentStatus.fulfilled, (state, action) => {
        if (action.payload.type === "client") {
          state.status = "succeeded";
          state.files = state.files.map((file) => ({
            ...file,
            is_active: 0,
          }));
          const fileIndex = state.files.findIndex(
            (file) => file.id === action.payload?.data?.data.id
          );
          if (fileIndex !== -1) {
            state.files[fileIndex] = action.payload?.data?.data;
          }
        }
      })
      .addCase(updateAttachmentStatus.rejected, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "failed";
          state.error = action.payload.error;
        }
      })
      .addCase(deleteAttachment.pending, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "loading";
        }
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        if (action.payload.type === "client") {
          state.status = "succeeded";
        }
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        if (action.meta.arg.type === "client") {
          state.status = "failed";
          state.error = action.payload.error;
        }
      });
  },
});

export const {
  setUploadProgress,
  setUploadStatus,
  uploadFile,
  setJobId,
  resetClientConfirmationFields,
  deleteFile,
} = clientConfirmationLetterSlice.actions;

export default clientConfirmationLetterSlice.reducer;
