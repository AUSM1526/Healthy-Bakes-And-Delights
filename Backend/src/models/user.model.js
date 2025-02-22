import mongoose , {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type: String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true
        },
        firstName:{
            type: String,
            required:true,
            trim: true
        },
        lastName:{
            type: String,
            trim: true
        },
        phoneNumber:{
            type: String,
            unique: true
        },
        password:{
            type: String,
            required:true
        },
        accountType:{
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true
        },
        avatar:{
            type:String 
        },
        orderHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Order'
            }
        ],
        cart:[
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity:{
                    type: Number,
                    default:1,
                    min:1
                }
            }
        ],
        address:[
            {
                houseNumber: {
                    type: String,
                    required: true
                },
                name:{
                    type: String,
                    required: true
                },
                area:{
                    type: String,
                    required: true
                },
                city:{
                    type: String,
                    required: true
                },
                state:{
                    type: String,
                    required: true
                },
                pincode:{
                    type:Number,
                    required: true
                },
                isDefault:{
                    type:Boolean,
                    default:false
                }
            }
        ]
    },
    {
        timestamps: true
    }
)


export const User = mongoose.model("User",userSchema);