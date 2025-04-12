import { Pencil, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { apiFunc } from "../../utils/apiClient";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

const AddressCard = ({addrId,houseNumber,name,area,city,state,pincode,isDefault,OnSuccess}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    houseNumber: houseNumber || "",
    name: name || "",
    area: area || "",
    city: city || "",
    state: state || "",
    pincode: pincode || "",
    isDefault: isDefault || false
  });

  const dispatch = useDispatch();

  
  const handleEditAddress = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSave = async() => {
    try {
      const res = await apiFunc().patch(`/address/${addrId}`, formData);
      dispatch(login(res.data.data.user));
      if(OnSuccess) OnSuccess();
      toast.success("Address updated successfully");
    } catch (error) {
      console.log("Error updating address:", error);
      toast.error("Error updating address");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-[#fcf8f3] rounded-lg border px-6 py-4 text-[#4b2e1e] shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Default Badge */}
            {isDefault && (
              <span className="bg-[#4b2e1e] text-white text-xs font-medium px-2 py-1 rounded">
                Default
              </span>
            )}
          </div>

          {/* Address Info */}

          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              <input name="houseNumber" placeholder="HouseNumber" value={formData.houseNumber} onChange={handleEditAddress} className="input" />
              <input name="name" placeholder="HouseName"value={formData.name} onChange={handleEditAddress} className="input" />
              <input name="area" placeholder="Area"value={formData.area} onChange={handleEditAddress} className="input" />
              <input name="city" placeholder="City" value={formData.city} onChange={handleEditAddress} className="input" />
              <input name="state" placeholder="State" value={formData.state} onChange={handleEditAddress} className="input" />
              <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleEditAddress} className="input" />
            </div>
          ) : (
            <>
              <p>{houseNumber}, {name}, {area}</p>
              <p>{city}, {state} - {pincode}</p>
            </>
          )}

        </div>

        {/* Action Icons */}
        <div className="flex gap-3 text-[#754c24]">
          {!isEditing && (
            <>

              {!isDefault && (
                <button type="button" title="Set as Default" className="hover:text-chocolate-buttonHover transition-colors">
                  <MapPin className="w-4 h-4" />
                </button>
              )}

              <button type="button" title="Edit" className="hover:text-chocolate-buttonHover transition-colors" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4" />
              </button>

              <button type="button" title="Delete" className="hover:text-chocolate-buttonHover transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>

            </>
          )}

          {isEditing && (
            <>
              <button title="Save" onClick={handleSave} className="hover:text-chocolate-buttonHover">
                Save
              </button>
              <button title="Cancel" onClick={() => setIsEditing(false)} className="hover:text-[#d1a670]">
                Cancel
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddressCard;