import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";


export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            res.status(400).json({
                message: "Please provide name, username, email and a password."
            });
        }
        
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ 
                message: "Email already exists" 
            });
        }
        
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ 
                message: "Username already exists" 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password should have atleast 8 characters"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);;

        const user = new User({
             name, 
             username, 
             email, 
             password: hashedPassword 
        });

        await user.save();

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: "3d"});

        res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (err) {
        console.log("Error in signup controller", err.message);
        res.status(500).json({
            message: "Internal sever error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Incorrect Password',
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            message: "Logged in successfully",
        });
    } catch (err) {
        console.log("Error in login controller", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("jwt-linkedin", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = (req, res) => {
    console.log("Get Current User called");
    try {
        return res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in gettCurrentUser Controller: ", err.message);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};