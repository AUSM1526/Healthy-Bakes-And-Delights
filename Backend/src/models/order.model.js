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
                    required: true,
                    min: 1
                },
                price:{
                    type: Number,
                    required: true
                },
                image:{
                    type: String,
                },
                productName:{
                    type: String,
                },
                subCategory:{
                    type: String,
                },
                productType:{
                    type: String,
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
                //required: true
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
        transactionId:{
            type: String,
            default: null
        },
        isApproved:{
            type: Boolean,
            default: false
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

export const Order = mongoose.model("Order",orderSchema);