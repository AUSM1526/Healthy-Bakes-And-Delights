import {useState} from "react";
import { apiFunc } from "../../utils/apiClient";
import toast from "react-hot-toast";

const OrderNotApprovalModal = ({orderId, onClose, onSuccess}) => {
    const [loading, setLoading] = useState(false);
    const handleNotApproveOrder = async () => {
        setLoading(true);
        try {
            await apiFunc().patch(`/order/notApproveOrder?orderId=${orderId}`);
            toast.success("Order Not Approved successfully"); 
            onSuccess();
        } catch (error) {
            console.error("Error while not approving order:", error);
        } finally {
            setLoading(false);
            onClose();
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-[#fefaf6] rounded-2xl shadow-xl p-6 w-full max-w-md text-[#3e2f23]">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Order Not Approval</h2>
                    <p className="text-sm text-gray-700">Are you sure you <span className="font-bold" >don't</span> want to 
                    <span className="font-bold"> Approve</span> this Order?</p>
                </div>
                        
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={()=> onClose()}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleNotApproveOrder}
                        className="px-4 py-2 bg-[#d1a670] text-white rounded-lg hover:bg-[#cb934e] transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <span className="animate-pulse">Not Approving...</span>
                            </div>
                        ) : (
                        "Not Approve Order"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderNotApprovalModal;