import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    doctorsData: [],
    patinetnDocotrData: [],
    refreshPatients: false
}

const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        updateDoctorsData: (state, action) => {
            // console.log(state, "state");
            // console.log(action, "action");
            state.doctorsData = action.payload;
        },
        updatePatinetnDocotrsData: (state, action) => {
            // console.log(state, "state");
            // console.log(action, "action");
            state.patinetnDocotrData = action.payload;
        },
        toggleRefreshPatients: (state) => {
            state.refreshPatients = !state.refreshPatients;
        }
    },
})


export const { updateDoctorsData, updatePatinetnDocotrsData , toggleRefreshPatients } = doctorSlice.actions

export default doctorSlice.reducer;