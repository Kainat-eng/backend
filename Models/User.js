// import mongoose from 'mongoose';

// const usersSchema = new mongoose.Schema({
//     firstname: String,
//     lastname: String,
//     email: String,
//     password: String,
// }, { timestamps: true });

// export default mongoose.model("Users", usersSchema);

import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
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
    role: { 
        type: String, 
        default: "user", 
        enum: ["user", "admin"] 
    },
    token: {
        type: String,
        default: null
    },
})

export default mongoose.model("Users", usersSchema);