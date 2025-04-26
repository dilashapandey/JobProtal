import bcrypt from "bcryptjs";
import {user} from "../models/userModel.js"
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
        const{email,password} = req.body;

        // Validate user input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false
            });
        }

        // Check if the user exists
        const existingUser = await User.findOne({ email });
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
                message: "Invalid credentials.",
                success: false
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Send the token as a cookie
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000 // 1 day
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
