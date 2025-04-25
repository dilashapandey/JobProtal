import bcrypt from "bcryptjs";
import {user} from "../models/userModel.js"
import jwt from "jsonwebtoken";
import { response } from "express";

export const register = async(req,res)=>{
    try {
        const {name, email, password, phone_no, role} = req.body;

        // Validate user input
        if (!name || !email || !password || !phone_no)
        return res.status(400).json({ 
            message: 'All fields are required.' ,
            success:false
        });

        const existinguser = await user.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ 
                message: "User already exists.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new user ({
            name,
            email, 
            password: hashedPassword,
            phone_no, 
            role,
            profile:{

            }
        })

        await user.save();

        res.status(201).json({
            message: "user created",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Internal server error.',
            success: false
        });
    }    
}

export const login = async(req,res)=>{
    try {
        const{email,password, role} = req.body;

        // Validate user input
        if (!email || !password||!role) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false
            });
        }

        // Check if the user exists
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password.",
                success: false
            });
        }

        //role
        if (role =!existingUser.role) {
            return res.status(401).json({
                message: "account doesn't exist",
                success: false
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: existingUser._id}, 
            process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Send the token as a cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({
            message:`Welcome back ${existingUser.name}`,
            success:true
        });

        res.status(200).json({
            message: "Login successful.",
            success: true,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) =>{
    try {
        const { name, email, phone_no, bio, skills } = req.body;
        const file = req.file;
        let skillsArray= skills.split(",");
        // Find the user by ID (assuming the user is authenticated and their ID is in req.user.id)
        const userId = req.id;
        const euser = await user.findById(userId);

        if (!euser) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update user details
        euser.name = name || euser.name;
        euser.email = email || euser.email;
        euser.phone_no = phone_no || euser.phone_no;
        euser.profile.bio = bio || euser.profile.bio;
        euser.profile.skills = skillsArray || euser.profile.skills;

        await euser.save();

        res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            euser
        });
    } catch (error) {
        console.log(error);
    }
}