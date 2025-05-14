import express from "express";
import { login, logout, register, updateProfile } from "../controllers/uesrController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const route = express.Router();

route.post('/register', register);

route.post('/login',login);

route.post('/logout',logout);

route.put('/update',isAuthenticated,updateProfile);

export default route;