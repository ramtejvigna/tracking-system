import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["EBM", "ABM", "CBM"],
        required: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    attend_stamps: [{
        type: Date
    }]
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);
