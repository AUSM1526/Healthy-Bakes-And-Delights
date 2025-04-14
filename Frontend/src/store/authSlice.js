import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {
            cart: null
        }
    },
    reducers: {
        login: (state,action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        addToCart: (state,action) => {
            state.cart = action.payload;
        },
    }
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;