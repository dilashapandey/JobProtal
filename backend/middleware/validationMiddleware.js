export const validateUser = (req, res, next) => {
    const { name, email, password, phone_no, role } = req.body;

    if (!name || !email || !password || !phone_no || !role) {
        return res.status(400).json({
            message: "All fields are required.",
            success: false
        });
    }

    if (!['student', 'recruiter'].includes(role)) {
        return res.status(400).json({
            message: "Invalid role. Role must be 'student' or 'recruiter'.",
            success: false
        });
    }

    next();
};