import React from "react";
import { useState, useEffect } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { apiFunc } from "../utils/apiClient";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../store/authSlice";
import toast from "react-hot-toast";
import DefaultIcon from "../assets/DefaultIcon.jpg";
import ShowAddressDetails from "../components/Address/ShowAddressDetails";
import AddAddressModal from "../components/Address/AddAddressModal";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  //console.log("User: ", user);
  const username = user?.username || null;
  const firstName = user?.firstName || null;
  const lastName = user?.lastName || null;
  const email = user?.email || null;
  const phoneNumber = user?.phoneNumber || null;
  const avatar = user?.avatar || null;
  
  const [isEditAvatar, setIsEditAvatar] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [isEditName, setIsEditName] = useState(false);

  const [addAddress, setAddAddress] = useState(false);

  const handleEditAvatar = (e) => {
    e.preventDefault();
    setIsEditAvatar(true);
  };

  const handleAvatarChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    //console.log(file);

    if(file)
    {
      setNewAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const saveNewAvatar = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    setLoading(true);
    try {
      const res = await apiFunc().patch("/user/update-avatar",formData);
      dispatch(login(res.data.data.user));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile picture. Please try again.");
      console.log("Error uploading avatar:", error);
    } finally {
      setLoading(false);
      setIsEditAvatar(false);
    }
  }

  const handleEditName = (e) => {
    e.preventDefault();
    setIsEditName(true);
  }

  const handleNameChange = async(e) => {
    e.preventDefault();
    
    setLoading(true);
    if(newFirstName === "") {
      toast.error("First name cannot be empty.");
      setLoading(false);
      return;
    }
    try {
      const res = await apiFunc().patch("user/update-name", {
        firstName: newFirstName,
        lastName: newLastName,
      });
      dispatch(login(res.data.data.user));
      toast.success("Name updated successfully!");
    } catch (error) {
      toast.error("Failed to update name. Please try again.");
      console.log("Error updating name:", error);
    } finally {
      setLoading(false);
      setIsEditName(false);
    }
  }

  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddAddress(true);
  }

  const [addressDetails, setAddressDetails] = useState([]);
  
  const fetchAddressDetails = async() => {
    try {
          const res = await apiFunc().get("/user/get-all-addresses");
          const addresses = res.data.data.addr;
          setAddressDetails(addresses);
        } catch (error) {
            console.log("Error fetching address details:", error);
            toast.error("Failed to fetch address details. Please try again later.");
        }
  };

  useEffect(() => {
    fetchAddressDetails();
  },[]);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="min-h-screen bg-[#F9F4EF] p-4 sm:p-6 font-sans text-[#3e2b1c]">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 mt-8 font-serif">My Profile</h1>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Left Section */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 col-span-1 flex flex-col items-center h-[415px] overflow-y-auto">
            <div className="relative">
              <img
                src={avatar || `${DefaultIcon}`}
                alt="Profile"
                className="w-24 sm:w-28 h-24 sm:h-28 rounded-full object-cover border-4 border-chocolate-medium"
              />
              <button className="absolute bottom-1 right-1 bg-[#5c3a1d] text-white p-1 rounded-full hover:bg-[#3e2b1c]" onClick={handleEditAvatar}>
                <MdOutlineModeEditOutline size={14} />
              </button>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-base sm:text-lg font-semibold">{firstName} {lastName}</h2>
              <p className="text-sm text-gray-500">{username}</p>
            </div>

            <div className="mt-6 space-y-3 w-full text-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Full Name</span>

                {/* Editable Name Section */}
                {isEditName ? (
                  <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                  />
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                  />
                  <button
                    onClick={handleNameChange}
                    disabled={loading}
                    className="text-chocolate-dark text-sm font-medium hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditName(false);
                      setNewFirstName(firstName);
                      setNewLastName(lastName);
                    }}
                    className="text-[#d1a670] text-sm font-medium hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                ) : (
                  <span className="flex items-center gap-1 text-right">
                  {firstName} {lastName}
                  <MdOutlineModeEditOutline size={14} className="cursor-pointer" onClick={handleEditName}/>
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Email</span>
                <span className="text-right">{email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Phone</span>
                <span className="text-right">+91 {phoneNumber}</span>
              </div>
            </div>

            <button className="mt-9 bg-[#5c3a1d] hover:bg-[#3e2b1c] text-white w-full py-2 rounded-lg text-sm font-medium">
              View My Orders
            </button>
          </div>

          {/* Right Section */}
          <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Addresses */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">My Addresses</h2>
                <button className="bg-[#5c3a1d] hover:bg-[#3e2b1c] text-white px-4 py-1 text-sm rounded flex items-center gap-1" onClick={handleAddAddress}>
                  Add New Address
                </button>
              </div>
              <ShowAddressDetails addressDetails={addressDetails} OnSuccess={() => {fetchAddressDetails();}}/>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Recent Orders</h2>
                <button className="text-sm text-[#5c3a1d] font-medium hover:underline">View All</button>
              </div>
              <p className="text-gray-400 italic">No recent orders yet.</p>
            </div>

          </div>
        </div>
      </div>

      {isEditAvatar && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-chocolate-light rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Edit Profile Picture</h2>
                <div className="flex flex-col items-center">
                  {/* Current or New DP */}
                  <img
                    src={newAvatar|| avatar || "https://res.cloudinary.com/dyc2wudtr/image/upload/v1743596377/ucgp1exuhcwl4vyqu8yk.jpg"}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover mb-4"
                  />

                  {/* Upload Button */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="text-sm mb-4"
                  />

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditAvatar(false)}
                      className="px-4 py-2 bg-[#d1a670] rounded-lg hover:bg-[#cb934e] text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNewAvatar}
                      className="px-4 py-2 bg-chocolate-buttonColor text-white rounded-lg hover:bg-chocolate-buttonHover"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <span className="animate-pulse mr-2">Saving...</span>
                        </div>
                      ) : (
                      "Save"
                    )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
      )}

      {addAddress && <AddAddressModal onClose={() => setAddAddress(false)}    onSuccess={() => {
        fetchAddressDetails();
        setAddAddress(false); 
        }}/>
      }
      
    </>
  );
};

export default Profile;
