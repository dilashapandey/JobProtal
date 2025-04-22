import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import user from '../models/userModel.js'; // Assuming you have a User model

// Create a new user
export const register = async (req, res) => {
    try {
        const { name, email, password, phone_no, role } = req.body;

        if (!name || !email || !password || !phone_no || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new user({
            name,
            email,
            password: hashedPassword,
            phone_no,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Check if user exists
        const user = await user.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            message: "Login successful",
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get user details
export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone_no, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phone_no, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

