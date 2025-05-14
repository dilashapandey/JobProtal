import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("Token from cookies:", token);
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        console.log("SECRET_KEY:", process.env.SECRET_KEY);
        const decode = jwt.verify(token, process.env.SECRET_KEY); // Use SECRET_KEY from .env
        console.log("Decoded User ID:", decode.id);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decode.id; // Attach user ID to the request
        console.log("User ID attached to request:", req.id);
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};