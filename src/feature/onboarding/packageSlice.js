import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStep: 0,
  minReferences:'',
  packageInfo: {
    id: '',
    packageName: '',
    roles: [],
    status: 'Active',
  },
  documents: {
    documents: [],
    organizationDocs: [],
    referenceForms: [],
    forms: [],
    professionalRegistration: [],
    backgroundChecks: [],
  },
  selectedTab: 'documents',
  selectedDocuments: [],
  organizeItems:[],
  organizedSections: [],
  tabData: {
    documents: [],
    organizationDocs: [],
    referenceForms: [],
    forms: [],
    professionalRegistration: [],
    backgroundChecks: [],
  },
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setMinReferences: (state, action) => {
      console.log('action',action.payload)
      state.minReferences = action.payload;
    },
    setPackageInfo: (state, action) => {
      state.packageInfo = { ...state.packageInfo, ...action.payload };
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    toggleDocument: (state, action) => {
      const { id, name,class: docClass } = action.payload;
      const index = state.selectedDocuments.findIndex(
        (d) => d.id === id && d.class === docClass
      );
      if (index >= 0) {
        // Document exists, remove it
        state.selectedDocuments.splice(index, 1);
      } else {
        // Document doesn't exist, add it with id and class
        state.selectedDocuments.push({ id,name, class: docClass });
      }
    },
    editPackage: (state, action) => {
      const { id, name, provider_roles, items,min_profess_ref_to_submit
        , status = 'Active' } = action.payload;
        state.minReferences = min_profess_ref_to_submit;
      state.packageInfo = {
        id,
        packageName: name,
        roles: provider_roles?.map((role)=>role?.provider_role_id) || [],
        status,
      };
    
      // Clear previous state
      state.selectedDocuments = [];
      state.organizedSections = [];
      state.organizeItems = [];
    
      // Categorize documents
      const tabData = {
        documents: [],
        organizationDocs: [],
        referenceForms: [],
        forms: [],
        professionalRegistration: [],
        backgroundChecks: [],
      };
      const allItems = [
        ...(items || []),
        ...action.payload.groups.flatMap(group => group.items || [])
      ];
      
      allItems?.forEach((item) => {
        const { fromable_type, fromable_id, name } = item;
    
        const doc = {
          id: fromable_id,
          name,
          class: fromable_type,
        };
    
        state.selectedDocuments.push(doc);})
     
    
      state.tabData = tabData;
    }
,    
    setOrganizedSections: (state, action) => {
      state.organizedSections = action.payload;
    },
    setOrganizeItems: (state, action) => {
      state.organizeItems = action.payload;
    },
    setTabData: (state, action) => {
      state.tabData = action.payload;
    },
    cancelPackage: (state) => {
      return initialState;
    },
  },
});

export const {
  setActiveStep,setMinReferences,
  setPackageInfo,
  setSelectedTab,
  toggleDocument,
  setOrganizedSections,editPackage,
  setTabData,setOrganizeItems,
  cancelPackage,
} = packageSlice.actions;

export default packageSlice.reducer;