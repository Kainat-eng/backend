import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: null
    },
    lastname: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    // role: { 
    //     type: String, 
    //     default: "user", 
    //     enum: ["user", "admin", "server_admin"] 
    // },
     role: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Role", 
        required: true 
    },
    token: {
        type: String,
        default: null
    }
});

export default mongoose.model("User", userSchema);