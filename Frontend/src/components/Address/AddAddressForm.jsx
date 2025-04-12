import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiFunc } from "../../utils/apiClient";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

const AddAddressForm = ({onSuccess}) => {
  const [addressData, setAddressData] = useState({
    houseNumber: "",
    name: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFunc().post("/address/add-address", addressData);
      dispatch(login(res.data.data.user));
      toast.success("Address added successfully!");
      if(onSuccess) onSuccess();
    } catch (error) {
      console.log("Error while adding Address: ", error);
      toast.error("Error while adding address!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8f3] rounded-xl p-6 shadow-lg border border-[#e7e2dc] text-[#4b2e1e] max-w-2xl w-full mx-auto mt-6 transition-all">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
            <label className="block text-sm font-medium mb-1">House / Flat / Block No.</label>
            <input
                type="text"
                name="houseNumber"
                value={addressData.houseNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#ddd] rounded-lg bg-white text-[#4b2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
                placeholder="e.g. A-101"
                required
            />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">House Name</label>
            <input
              type="text"
              name="name"
              value={addressData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#ddd] rounded-lg bg-white text-[#4b2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
              placeholder="e.g. The Enclave"
              required
            />
          </div>

        <div>
          <label className="block text-sm font-medium mb-1">Area / Street / Colony</label>
          <input
            type="text"
            name="area"
            value={addressData.area}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#ddd] rounded-lg bg-white text-[#4b2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
            placeholder="e.g. Chocolate Avenue, Sweet Lane"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#ddd] rounded-lg bg-white text-[#4b2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
              placeholder="e.g. Ahmedabad"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#ddd] rounded-lg bg-white text-[#4b2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
              placeholder="e.g. Gujarat"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={addressData.pincode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#ddd] rounded-lg bg-white text-[#4b2e1e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e1e]"
              placeholder="e.g. 3XXXXX3"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={addressData.isDefault}
              onChange={(e) =>
                setAddressData({ ...addressData, isDefault: e.target.checked })
              }
              className="w-4 h-4 accent-[#4b2e1e] cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-sm cursor-pointer">
              Set as default address
            </label>
          </div>

        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#4b2e1e] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3a2317] hover:scale-[1.02] transition-transform duration-200"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
