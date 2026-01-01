import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    doctorsData: []
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
    },
})


export const { updateDoctorsData } = doctorSlice.actions

export default doctorSlice.reducer;