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


//  Auth Middleware
import { verifyToken } from "./routes/auth/verifyToken.js";

// Auth Routes
import { register } from "./routes/auth/register.js";
import { login } from "./routes/auth/login.js";
app.use("/api/register", register);
app.use("/api/login", login);



// Legacy CSV-only Bank/Transaction (optional)
import { bankDetails } from "./routes/account/bankDetails.js";
import { transactionDetails } from "./routes/transactions/transactionDetails.js";
import { readAccountD } from "./routes/account/readAccountD.js";
import { getAllTransactions } from "./routes/transactions/readTransaction.js";
import { transactionSummary } from "./routes/apiSummary/transactionSummary.js";
import { exportTransactionsCSV } from "./routes/apiSummary/exportTransactionsCSV.js";
import { exportTransactionsExcel } from "./routes/apiSummary/exportTransactionsExcel.js";
import { restoreTransactionById } from "./routes/transactions/restoreTransactionById.js";
import { deleteMultipleTransactions } from "./routes/transactions/deleteMultipleTransactions.js";
import { updateAccountD } from "./routes/account/updateAccountDetails.js";
import { search } from "./routes/apiSummary/search.js";
import { history } from "./routes/transactions/history.js";
import { filter } from "./routes/apiSummary/filter.js";
import uploadRoute from "./routes/upload.js";
import { getTransactionAttachments } from "./routes/transactions/getTransactionAttachments.js";
import { deleteAllTransaction } from "./routes/transactions/deleteAllTransaction.js";


app.post("/api/bankDetails", verifyToken, upload.single("file"), bankDetails);
app.post("/api/transactionDetails", verifyToken, upload.single("file"), transactionDetails);

// Account CRUD functions
app.use("/api/account-details",verifyToken,readAccountD)
app.use("/api/updateAccountD",verifyToken,updateAccountD)

// Transaction CRUD functions

app.use("/api/transactions",verifyToken,getAllTransactions)

app.use("/api/deleteMultipleTransactions",verifyToken,deleteMultipleTransactions)
app.use("/api/deleteAll",verifyToken,deleteAllTransaction)

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


//  Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

