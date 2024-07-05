import express from "express";
import connectToDB from "./db/connectToDB.js";
import cors from "cors";
import dotenv from "dotenv";

import checkRoutes from "./routes/checkRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


const PORT = process.env.PORT;


// Routes
app.use("/api/v1/dev", checkRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server listening on http://localhost:${PORT} on ${new Date()}`);
});