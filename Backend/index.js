import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
// Import all routes from one file
// import router from "./src/routes/router.js";
// app.use("/api", router);
import { errorHandler } from "./src/middlewares/error.middleware.js";
import { userRoutes } from "./src/modules/user/index.js";
import { accountRoutes } from "./src/modules/account/index.js";
import { transactionRoutes } from "./src/modules/transaction/index.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api",userRoutes)

app.use("/api",accountRoutes)

app.use("/api/transaction",transactionRoutes)

app.use(errorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
