import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinaryConfig.js";

export const getSuggestedUsers = async (req, res) => {
    const userId = req.user._id;
    try {
        const currentUserConnections = await User.findById(userId).select("connections");
        // Filter users based on connections
        const suggestedUsers = await User.find({
            _id: { $nin: currentUserConnections.connections, $ne: userId },
        })
            .select("name username profilePicture headline")
            .limit(5);

        res.json(suggestedUsers);

    } catch (err) {
        console.log("Error in getSuggestedUsers Controller: ", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username })
                               .select("-password");
        

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);
    } catch (err) {
        console.log("Error in gettingUser controller: ", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const updateProfile = async (req, res) => {
    const allowedFileds = [
        "name",
        "headline",
        "profilePicture",
        "locatation",
        "about",
        "education",
        "skills",
        "experience"
    ];
    const userId = req.user._id;

    try {
        const updatedData = {};

        for (const field of allowedFileds) {
            if (req.body[field]) {
                updatedData[field] = req.body[field];            }
        }

        if (req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }

        if (req.body.bannerImage) {
            const result = await cloudinary.uploader.upload(req.body.bannerImage);
            updatedData.bannerImage = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(userId, {$set: updatedData}, { new: true }).select("-password");

        console.log("USer after updating ");
        console.log(user.experience);

        return res.status(200).json(user);
    } catch (err) {
        console.log("Error in updateProfile contorller: " + err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const updateCredentials = async (req, res) => {
    try {
        const { newUsername, newEmail, password, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (newUsername && user.username !== newUsername) { //Checking if newUsername is provided or not
            // Check if a user with newUsename already exists
            const existingUser = user.findOne({ username: newUsername});
            if (existingUser) {
                return res.status(400).json({
                    message: 'Username already taken',
                });
            }

            user.username = newUsername;
        }

        if (newEmail && user.email !== newEmail) {
            const existingUser = await User.findOne({ email: newEmail });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already existis",
                });
            }

            user.email = newEmail;
        }

        if (!password && !newPassword) {
            return res.status(400).json({
                message: "Both current and new passwords are required",
            });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: "Incorrect current password",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({
            message: "Credentials updated successfully",
        });

    } catch (err) {
        console.log("Error in updateCredentials controller: ", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};