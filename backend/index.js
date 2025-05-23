import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./config/database.js";
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions));

import userRoutes from "./routes/userRoute.js"
import companyRoutes from "./routes/companyRoute.js"

app.use("/api/user",userRoutes);
app.use("/api/company",companyRoutes);

app.get('/',(req,res)=>{
    res.send('Hello World');
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
    ConnectDB();
    console.log(`Server is running on port ${port}`)
});