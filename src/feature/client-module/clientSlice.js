import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchClientsInfo } from "../../thunkOperation/job_management/states";
import { addClientHandler } from "../../thunkOperation/client-module/clientModlueThunk";


// Define the initial state for the slice
const initialState = {
  clientsTableData:[],
  currentClient:null,
  basicInfo: {
    clientName: "",
  firstName: "",
  lastName: "",
  role: "",
  phones: [{ number: "", type: "Mobile" }],
  email: "",
  },
  billingAddress:{
      country:'',
      state:'',
      city:'',
    address_line_1:'',
    address_line_2:'',
    zip_code:'',

  },
  siteAddress:{
    same_is_billing:false,
      country:'',
      state:'',
      city:'',
    address_line_1:'',
    address_line_2:'',
    zip_code:'',

  },
  
  status: "idle", 
  error: null,


};

// Create the slice
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    updateSection: (state, action) => {
      const { section, field, value } = action.payload;
      if (section) {
        if (typeof field === "string") {
          state[section][field] = value;
        } else if (typeof field === "object") {
          Object.assign(state[section], field);
        }
      } else {
        state[field] = value;
      }
    },
    deleteClient: (state, action) => {
      const clientIdToDelete = action.payload;  
      state.clientsTableData = state.clientsTableData.filter(client => client.id !== clientIdToDelete);
    },
    // updateSection: (state, action) => {
    //   const { section, field, value } = action.payload;
  
    //   if(section){
    //     state[section][field] = value;
    //   }else{
    //     state[field]=value
    //   }
      
    // },
    setField: (state, action) => {
      const { field, value } = action.payload;
        state[field] = value;
      
    },
    addPhone: (state) => {
      // Add a new phone with default values
      state.basicInfo.phones.push({ number: "", type: "Mobile" })
    },
    removePhone: (state, action) => {
      const { index } = action.payload;
      state.basicInfo.phones.splice(index, 1);
    },
    updatePhone: (state, action) => {
      const { index, field, value } = action.payload; 
      if (state.basicInfo.phones[index]) {
        state.basicInfo.phones[index][field] = value;
      } else {
        console.error(`Invalid phone index: ${index}`);
      }
    },
    addCurrentClient:(state,action)=>{ 
state.currentClient=action.payload
    },
    removeCurrentClient:(state)=>{ 
state.currentClient=null
    },
    updateClientInfo: (state, action) => {
      // Extract the data from the response
      const  data  = action.payload;
    
      if (state.currentClient) {
        state.currentClient = {
          ...state.currentClient,
          ...data,
          // Preserve nested objects that might not be in the new data
          addresses: state.currentClient.addresses,
          budget_preference: state.currentClient.budget_preference,
          phones: data.phones || state.currentClient.phones,
        };
      }
    },
    updateClientAddress: (state, action) => {
      const data= action.payload;
      if (state.currentClient && state.currentClient.addresses) {
        // Find the index of the billing address in the addresses array
        const addressIndex = state.currentClient.addresses.findIndex(
          addr => addr.id === data.id
        );

        if (addressIndex !== -1) {
          // Preserve the country and state objects while updating other fields
          const existingAddress = state.currentClient.addresses[addressIndex];
          
          state.currentClient.addresses[addressIndex] = {
            ...data,
            // Preserve the country and state objects if they exist
            // country: existingAddress.country || null,
            // state: existingAddress.state || null
          };
        }
      }
    },
    clearFields:(state)=>{
      
      return {
        ...initialState,
        clientsTableData: state.clientsTableData,
        currentClient: state.currentClient,
      };
      // return initialState
      
    }
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientsInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClientsInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.clientsTableData = action.payload;
        
  // console.log("clientsTableData", action.payload?.data);
        state.clientsTableData=action.payload?.data
        state.error = null;
      })
      .addCase(fetchClientsInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addClientHandler.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addClientHandler.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clientsTableData = action.payload;
        // state.clientsTableData.push(action.payload)
        state.error = null;
      })
      .addCase(addClientHandler.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
    
      
   
  },
});

// Export actions
export const {
   setField,addPhone,updateSection,deleteClient,clearFields,updatePhone,removePhone,addCurrentClient,removeCurrentClient,updateClientInfo,updateClientAddress
} = clientSlice.actions;

// Export the reducer to configure the store
export default clientSlice.reducer;
