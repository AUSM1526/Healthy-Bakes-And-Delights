import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        addresses:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Address',
                required: true
            }
        ],
        refreshToken:{
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccesToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);