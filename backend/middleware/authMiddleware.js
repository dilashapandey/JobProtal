import jwt from 'jsonwebtoken';

export const authenticate = async(req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided.",
            success: false
        }); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }
        req.id = decoded.id; 
        next();
    } catch (error) {
        res.status(400).json({
            message: "Invalid token.",
            success: false
        });
    }
};