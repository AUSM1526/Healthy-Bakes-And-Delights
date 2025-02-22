import mongoose , {Schema} from "mongoose";

const couponSchema = new Schema(
    {
        code:{
            type:String,
            required:true,
            unique: true
        },
        description:{
            type:String
        },
        discountType:{
            type: String,
            enum: ["Flat","Percentage"],
            required: true
        },
        discountValue:{
            type: Number,
            required: true,
            min: 0
        },
        minOrderValue:{
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        usageLimit:{
            type: Number,
            default: 1,
        },
        usedCount:{
            type: Number,
            default: 0,
        },
        applicableOn:{
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        validFrom:{
            type: Date,
            required: true,
            default: Date.now
        },
        validTo:{
            type: Date,
            required: true,
            default: Date.now
        },
        usersUsed:[
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        isActive:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export const Coupon = mongoose.model("Coupon",couponSchema);