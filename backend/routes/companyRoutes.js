import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from "../controllers/companyController.js";

const router = express.Router();

// Create a new company
router.post('/create', authenticate, createCompany);

// Get all companies
router.get('/', getAllCompanies);

// Get a single company by ID
router.get('/:id', getCompanyById);

// Update a company
router.put('/:id', authenticate, updateCompany);

// Delete a company
router.delete('/:id', authenticate, deleteCompany);

export default router;