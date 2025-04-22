import Application from "../models/application.js";
import Job from "../models/jobModel.js";

// Create a new application
export const createApplication = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        const newApplication = new Application({
            job: jobId,
            application: req.user.id, // Assuming the user is authenticated
        });

        await newApplication.save();

        res.status(201).json({
            message: "Application created successfully.",
            success: true,
            application: newApplication
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get all applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("job")
            .populate("application");

        res.status(200).json({
            message: "Applications fetched successfully.",
            success: true,
            applications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get a single application by ID
export const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId)
            .populate("job")
            .populate("application");

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Application fetched successfully.",
            success: true,
            application
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values are 'pending', 'approved', or 'rejected'.",
                success: false
            });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Application status updated successfully.",
            success: true,
            application: updatedApplication
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Delete an application
export const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const deletedApplication = await Application.findByIdAndDelete(applicationId);

        if (!deletedApplication) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Application deleted successfully.",
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