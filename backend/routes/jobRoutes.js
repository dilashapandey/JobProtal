import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from "../controllers/jobController.js";

const router = express.Router();

// Create a new job
router.post('/create', authenticate, createJob);

// Get all jobs
router.get('/', getAllJobs);

// Get a single job by ID
router.get('/:id', getJobById);

// Update a job
router.put('/:id', authenticate, updateJob);

// Delete a job
router.delete('/:id', authenticate, deleteJob);

export default router;