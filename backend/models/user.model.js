import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bannerImage: {
        type: String,
        default: "",
    },
    headline: {
        type: String,
        default: "Linked in User",
    },
    locatation: {
        type: String,
        default: "Unknown",
    },
    about: {
        type: String,
        default: "",
    },
    skills: [String],
    experience: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String,
        }
    ],
    eudcation: [
        {
            school: String,
            degree: String,
            startYear: Number,
            endYear: Number,
            fieldOfStudy: String,
        }
    ],
    connections: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    }]

}, { timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;

