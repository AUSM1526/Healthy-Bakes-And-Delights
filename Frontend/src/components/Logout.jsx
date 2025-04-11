import React from "react";
import { useState } from "react";
import {apiFunc} from "../utils/apiClient";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout} from "../store/authSlice";
import toast from "react-hot-toast";
import styled from 'styled-components';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmation, setConfirmation] = useState(false);

    const handleLogout = async () => {
        try {
            const res = await apiFunc().post("/user/logout");
            dispatch(logout());
            setConfirmation(false);
            toast.success("Logout successful!");
            navigate("/");
        } catch (error) {
            console.log("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return(
        <>
            <div className="p-2">
                <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    role="menuitem"
                    onClick={() => setConfirmation(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                        />
                    </svg>
                    Logout
                </button>
            </div>

            {confirmation && (
                <StyledWrapper>
                    <div className="card"> 
                    {/* <button className="dismiss" onClick={() => setConfirmation(false)} type="button">×</button>  */}
                    <div className="header"> 
                        <div className="image">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div> 
                        <div className="content">
                        <span className="title">Confirm Logout</span> 
                        <p className="message">Are you sure you want to log out?</p> 
                        </div> 
                        <div className="actions">
                        <button className="cancel" onClick={() => setConfirmation(false)} type="button">Cancel</button> 
                        <button className="logout" onClick={handleLogout} type="button">Logout</button> 
                        </div> 
                    </div> 
                    </div>
                </StyledWrapper>
            )}
        </>
    );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .card {
    overflow: hidden;
    text-align: center;
    border-radius: 0.5rem;
    max-width: 320px;
    background-color: #fff5e1;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    padding: 1.5rem;
  }

  .dismiss {
    position: absolute;
    right: 10px;
    top: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #8B4513;
    cursor: pointer;
  }

  .header {
    padding: 1rem;
  }

  .image {
    display: flex;
    margin: auto;
    background-color: #ffd699;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }

  .image svg {
    width: 2rem;
    height: 2rem;
  }

  .content {
    margin-top: 1rem;
  }

  .title {
    color: #8B4513;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .message {
    margin-top: 0.5rem;
    color: #5a3e1b;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .cancel {
    background-color: #d1a670;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
  }

  .logout {
    background-color: #8B4513;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
  }

  .logout:hover {
    background-color: #5a3e1b;
  }
`;

export default Logout;