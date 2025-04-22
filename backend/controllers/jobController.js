import Job from "../models/jobModel.js";

// Create a new job
export const createJob = async (req, res) => {
    try {
        const { title, description, location, salary, requirements, experienceLevel, jobType, position, company } = req.body;

        if (!title || !description || !location || !salary || !experienceLevel || !jobType || !position || !company) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            requirements,
            experienceLevel,
            jobType,
            position,
            company,
            created_by: req.user.id // Assuming the user is authenticated
        });

        await newJob.save();

        res.status(201).json({
            message: "Job created successfully.",
            success: true,
            job: newJob
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("company").populate("created_by");
        res.status(200).json({
            message: "Jobs fetched successfully.",
            success: true,
            jobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company").populate("created_by");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Job fetched successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Update a job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, location, salary, requirements, experienceLevel, jobType, position } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { title, description, location, salary, requirements, experienceLevel, jobType, position },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Job updated successfully.",
            success: true,
            job: updatedJob
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        res.status(200).json({
            message: "Job deleted successfully.",
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