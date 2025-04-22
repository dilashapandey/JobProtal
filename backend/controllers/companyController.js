import Company from "../models/companyModel.js";

// Create a new company
export const createCompany = async (req, res) => {
    try {
        const { name, description, website, location, logo } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const newCompany = new Company({
            name,
            description,
            website,
            location,
            logo,
            userId: req.user.id // Assuming the user is authenticated
        });

        await newCompany.save();

        res.status(201).json({
            message: "Company created successfully.",
            success: true,
            company: newCompany
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate("userId");
        res.status(200).json({
            message: "Companies fetched successfully.",
            success: true,
            companies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get a single company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId).populate("userId");

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Company fetched successfully.",
            success: true,
            company
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Update a company
export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { name, description, website, location, logo } = req.body;

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { name, description, website, location, logo },
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Company updated successfully.",
            success: true,
            company: updatedCompany
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Delete a company
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        const deletedCompany = await Company.findByIdAndDelete(companyId);

        if (!deletedCompany) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Company deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};