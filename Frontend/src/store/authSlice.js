import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null
    },
    reducers: {
        login: (state,action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        addToCart: (state,action) => {
            state.user.cart = action.payload;
        },
    }
});

export const {login, logout, addToCart} = authSlice.actions;
export default authSlice.reducer;