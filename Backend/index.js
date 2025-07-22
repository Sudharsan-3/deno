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
app.use(express.json());
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
import { bankDetails } from "./Routes/accountCrud/bankDetails.js";
import { transactionDetails } from "./Routes/transactions/transactionDetails.js";
import { readAccountD } from "./Routes/accountCrud/readAccountD.js";
import { getAllTransactions } from "./Routes/transactions/readTransaction.js";
import { transactionSummary } from "./Routes/apiSummary/transactionSummary.js";
import { exportTransactionsCSV } from "./Routes/export/exportTransactionsCSV.js";
import { exportTransactionsExcel } from "./Routes/export/exportTransactionsExcel.js";
import { restoreTransactionById } from "./Routes/transactions/restoreTransactionById.js";
import { deleteMultipleTransactions } from "./Routes/transactions/deleteMultipleTransactions.js";
import { updateAccountD } from "./Routes/accountCrud/updateAccountD.js";
import { search } from "./Routes/filter/search.js";
import { history } from "./Routes/transactions/history.js";
import { filter } from "./Routes/filter/filter.js";
import uploadRoute from "./Routes/upload.js";
import { getTransactionAttachments } from "./Routes/transactionFiles/getTransactionattachement.js";


app.post("/api/bankDetails", verifyToken, upload.single("file"), bankDetails);
app.post("/api/transactionDetails", verifyToken, upload.single("file"), transactionDetails);

// Account CRUD functions
app.use("/api/account-details",verifyToken,readAccountD)
app.use("/api/updateAccountD",verifyToken,updateAccountD)

// Transaction CRUD functions

app.use("/api/transactions",verifyToken,getAllTransactions)

app.use("/api/deleteMultipleTransactions",verifyToken,deleteMultipleTransactions)
app.use("/api/deleteMultipleTransactions",verifyToken,deleteMultipleTransactions)

// Filters
app.use("/api/filter",verifyToken,filter)
app.use("/api/history",verifyToken,history)

// Restore By id
app.use("/api/restoretransactionById",verifyToken,restoreTransactionById)

// Transaction Summary api
app.use("/api/transactinSummary",verifyToken,transactionSummary)

// Transaction export 

app.use("/api/export/csv",verifyToken,exportTransactionsCSV)
app.use("/api/export/excel",verifyToken,exportTransactionsExcel)

// Filter endpoints

app.use("/api/search",verifyToken,search)

// Upload attachements
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api/upload",verifyToken, uploadRoute);

// Read attachements

app.use("/api/attachement" ,verifyToken,getTransactionAttachments)


// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

