import mongoose , {Schema} from "mongoose";

const productTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        hasSubCategories:{
            type: Boolean,
            default:false
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)


export const ProductType = mongoose.model("ProductType",productTypeSchema);