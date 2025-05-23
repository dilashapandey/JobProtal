import bcrypt from "bcryptjs";
import {user} from "../models/userModel.js"
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try {
        console.log(req.body);
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

        const newuser = new user ({
            name,
            email, 
            password: hashedPassword,
            phone_no, 
            role,
            profile:{

            }
        })

        await newuser.save();

        res.status(201).json({
            message: "user created",
            newuser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Internal server error.',
            success: false
        });
    }    
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate user input
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required.",
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

        // Check role
        if (role !== existingUser.role) {
            return res.status(401).json({
                message: "Account doesn't exist for the specified role.",
                success: false
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });

        // Send the token as a cookie and include it in the response
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({
            message: `Welcome back ${existingUser.name}`,
            success: true,
            token, // Include the token in the response
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
            message: "Internal server error.",
            success: false
        });
    }
};

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

export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone_no, bio, skills } = req.body;
        const file = req.file;
        let skillsArray;

        // Convert skills to an array if provided
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        console.log(userId);
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

        // Update profile picture if a file is uploaded
        if (file) {
            euser.profile.profilePic = file.path; // Assuming multer saves the file path
        }

        await euser.save();

        // Create a new object for the response
        const updatedUser = {
            _id: euser._id,
            fullname: euser.name,
            email: euser.email,
            phoneNumber: euser.phone_no,
            role: euser.role,
            profile: euser.profile
        };

        res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};