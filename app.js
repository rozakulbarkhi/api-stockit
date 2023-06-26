import express from "express";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import cookieParser from "cookie-parser";

import productsRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";

import connectDB from "./utils/db.js";

const app = express();

dotenv.config();

// connect db
connectDB();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// middleware
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

// route
app.use("/api/products", productsRoute);
app.use("/api/users", userRoute);

app.use("*", (req, res) => {
  res.status(404).send(`URL with ${req.originalUrl} not found`);
});

// Express error handling middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () =>
  console.log(`Server was running on port ${process.env.PORT}`)
);
