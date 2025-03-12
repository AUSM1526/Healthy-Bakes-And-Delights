import mongoose , {Schema} from "mongoose";

const orderSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        products:[
            {
                product:{
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                },
                price:{
                    type: Number,
                    required: true
                }
            }
        ],
        totalPrice:{
            type: Number,
            required: true
        },
        status:{
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"], 
            default: "Pending"
        },
        paymentInfo:{
            method:{
                type:String,
                enum: ["COD", "Card", "UPI"],
                required: true
            },
            transactionId:{
                type:String
            }
        },
        address:{
            type: Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },
        discount:[{
            type: Schema.Types.ObjectId,
            ref: 'Discount'
        }],
        coupon:[{
            type: Schema.Types.ObjectId,
            ref: 'Coupon'
        }]
    },
    {
        timestamps: true
    }
)