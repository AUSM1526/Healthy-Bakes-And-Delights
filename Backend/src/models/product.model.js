import mongoose , {Schema} from "mongoose";

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            unique: true,
            index: true
        },
        productType:{
            type: Schema.Types.ObjectId,
            ref: 'ProductType',
            required: true,
            unique: true
        },
        subCategory:{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: function(){
                return this.productType === 'Chocolate';
            }
        },
        description:{
            type:String
        },
        images:[
            String
        ],
        additionalPrice:{
            type:Number,
            required: true,
            default: 0
        },
        stock:{
            type:Number,
            required: true,
            default: 0
        },
        reviews:[{
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }],
        discount:{
            type: Schema.Types.ObjectId,
            ref: 'Discount'
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product",productSchema);