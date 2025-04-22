import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
} from "../controllers/applicationController.js";

const router = express.Router();

// Create a new application
router.post('/create', authenticate, createApplication);

// Get all applications
router.get('/', authenticate, getAllApplications);

// Get a single application by ID
router.get('/:id', authenticate, getApplicationById);

// Update application status
router.put('/:id', authenticate, updateApplicationStatus);

// Delete an application
router.delete('/:id', authenticate, deleteApplication);

export default router;