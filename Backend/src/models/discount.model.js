import mongoose , {Schema} from "mongoose";

const discountSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        discountType:{
            type: String,
            enum: ["Flat","Percentage"],
            required: true
        },
        applicableOn:{
            type: String,
            enum: ["Product","ProductType","SubCategory","Order"],
            required: true
        },
        discountValue:{
            type: Number,
            required: true,
            min: 0
        },
        product:{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        productType:{
            type: Schema.Types.ObjectId,
            ref: 'ProductType'
        },
        subcategory: { 
            type: Schema.Types.ObjectId, 
            ref: 'Subcategory' 
        },
        order:{
            type: Schema.Types.ObjectId,
            ref: 'Order',
            index: true
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
        isActive:{
            type: Boolean,
            default: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Discount = mongoose.model("Discount",discountSchema);