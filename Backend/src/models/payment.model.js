import mongoose , {Schema} from "mongoose";

const paymentSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        order:{
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
        paymentMethod:{
            type:String,
            enum: ["COD", "Card", "UPI"],
            required: true
        },
        transactionId:{
            type:String,
            required: true,
            unique: true
        },
        paymentStatus:{
            type:String,
            enum: ["Pending", "Success", "Failed", "Refunded"], 
            default: "Pending"
        },
        totalAmount:{
            type: Number,
            required: true
        },
        paymentDate:{
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

export const Payment = mongoose.model("Payment",paymentSchema);