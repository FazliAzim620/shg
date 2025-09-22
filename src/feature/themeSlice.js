import { createSlice } from '@reduxjs/toolkit';

const getInitialState =()=> {
    const storemode=localStorage.getItem('mode')
   return(
    {   mode:storemode?storemode: 'light',}
       )
       
};

const themeSlice = createSlice({
  name: 'theme',
  initialState:getInitialState(),
  reducers: {
    toggleMode: (state,action) => {
    state.mode=action.payload
    localStorage.setItem('mode',action.payload)
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleMode, setMode } = themeSlice.actions;

export default themeSlice.reducer;
