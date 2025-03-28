import { combineReducers } from '@reduxjs/toolkit';
import authReducer from "./authSlice.js";

const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here as needeed
})

export default rootReducer;