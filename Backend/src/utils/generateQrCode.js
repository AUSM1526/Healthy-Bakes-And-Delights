import QRCode from "qrcode";

const generateUPIQRCode = async (amount) => {
    const upiId = process.env.UPI_ID; 
    const name = process.env.UPI_NAME;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    try {
        const qrCode = await QRCode.toDataURL(upiUrl);
        return qrCode;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
    }
};

export default generateUPIQRCode;