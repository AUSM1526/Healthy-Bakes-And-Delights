import mongoose , {Schema} from "mongoose";

const reviewSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        product:{
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        rating:{
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment:{
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model("Review",reviewSchema);