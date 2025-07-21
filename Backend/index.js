import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔐 Auth Middleware
import { verifyToken } from "./Routes/auth/verifyToken.js";

// 🔐 Auth Routes
import { register } from "./Routes/register/register.js";
import { login } from "./Routes/login/login.js";
app.use("/api/register", register);
app.use("/api/login", login);



// 🏦 Legacy CSV-only Bank/Transaction (optional)
import { bankDetails } from "./Routes/transactions/bankDetails.js";
import { transactionDetails } from "./Routes/transactions/transactionDetails.js";
import { readAccountD } from "./Routes/accountCrud/readAccountD.js";

app.post("/api/bankDetails", verifyToken, upload.single("file"), bankDetails);
app.post("/api/transactionDetails", verifyToken, upload.single("file"), transactionDetails);

// Account CRUD functions
app.use("/api/account-details",verifyToken,readAccountD)


// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

