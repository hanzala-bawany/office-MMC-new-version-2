import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    doctorsData: [],
    patinetnDocotrData: []
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
    },
})


export const { updateDoctorsData , updatePatinetnDocotrsData } = doctorSlice.actions

export default doctorSlice.reducer;