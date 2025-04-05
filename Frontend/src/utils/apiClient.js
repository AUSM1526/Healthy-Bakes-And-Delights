import axios from 'axios';
import toast from "react-hot-toast";
import {store} from '../store/store.js';
import {logout} from "../store/authSlice";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

export const apiFunc = () => {
    apiClient.interceptors.response.use(
        (response) => response,
        async(error) => {
            console.log("Error in request: ", error);
            if(error.response?.status === 401){
                console.log("Unauthorized, Please login again!");
                store.dispatch(logout());
            }
            else return Promise.reject(error);
        }
    );
    return apiClient;
}

export default apiClient;