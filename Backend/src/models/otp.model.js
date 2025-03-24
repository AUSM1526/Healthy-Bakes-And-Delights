import mongoose , {Schema} from "mongoose";

const otpSchema = new Schema(
    {
        email:{
            type:String,
            required:true
        },
        otp:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default: Date.now,
            expires: 300
        }
    }
);

export const OTP = mongoose.model("OTP",otpSchema);