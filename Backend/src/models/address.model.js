import mongoose , {Schema} from "mongoose";

const addressSchema = new Schema(
    {
        userId:{
                type: Schema.Types.ObjectId,
                ref: 'User',
        },
        houseNumber: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        isDefault: {
            type: Boolean,
            default: false
        }        
    },
    {
        timestamps: true
    }
)

export const Address = mongoose.model("Address",addressSchema);