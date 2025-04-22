import express from "express";
import { deleteUser, getUser, login, register, updateUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateUser } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post('/register', validateUser, register);

router.post('/login', login);

router.get('/details', authenticate, getUser);

router.put('/update', authenticate, validateUser, updateUser);

router.delete('/delete', authenticate, deleteUser);

export default router;