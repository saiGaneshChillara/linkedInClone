import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, { timestamps: true });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;