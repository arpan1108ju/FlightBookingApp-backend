import express from "express";
import connectToDB from "./db/connectToDB.js";
import cors from "cors";
import dotenv from "dotenv";
// import session from "express-session";
import passport from "passport";

import checkRoutes from "./routes/checkRoutes.js";
import authRoutes from './routes/authRoutes/authRoutes.js';
import userRoutes from "./routes/userRoutes/userRoutes.js";
import airlineRoutes from './routes/airlineRoutes.js';

import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { authenticated } from "./controllers/authController/authController.js";


const app = express();
app.use(cors());
app.use(express.json());

// app.use(session({ secret: process.env.SESSION_SECRET_KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());

dotenv.config();


const PORT = process.env.PORT;


// Routes
app.use("/api/v1/dev", checkRoutes);
app.use("/api/v1/airline", airlineRoutes);

app.use('/api/v1/auth',authRoutes);

app.use('/api/v1/user' ,authenticated ,userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server listening on http://localhost:${PORT} on ${new Date()}`);
});