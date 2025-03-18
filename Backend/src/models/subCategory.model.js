import mongoose , {Schema} from "mongoose";

const subCategorySchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique: true
        },
        productType:{
            type: Schema.Types.ObjectId,
            ref: 'ProductType',
            required: true,
        },
        basePrice:{
            type:Number,
            required:true,
            default:0
        }
    },
    {
        timestamps: true
    }
)

export const SubCategory = mongoose.model("SubCategory",subCategorySchema);