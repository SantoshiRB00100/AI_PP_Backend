const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required: [true, "Email is required"],
            unique:true,
            lowercase: true,
            trim: true,
        },

        password:{
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },

        role:{
            type: String,
            enum:["student", "company", "admin"],
            default: "student",
        },

        isActive:{
            type:Boolean,
            default:true,
        },
    },{
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return ;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    ;
});

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;