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
                const currentPath = window.location.pathname;
                console.log("Unauthorized, Please login again!");
                toast.error("Session expired. Please log in again.");
                store.dispatch(logout());
                if(currentPath !== "/"){
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                }
            }
            else return Promise.reject(error);
        }
    );
    return apiClient;
}

export default apiClient;