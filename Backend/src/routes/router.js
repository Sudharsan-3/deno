import express from "express"
import multer from "multer";

const router =express.Router()

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware


//  Auth Middleware
import { verifyToken } from "../auth/verifyToken.js";

// Auth Routes
import { register } from "../auth/register.js";
import { login } from "../auth/login.js";
router.use("/register", register);
router.use("/login", login);



// Legacy CSV-only Bank/Transaction (optional)
import { bankDetails } from "../account/bankDetails.js";
import { transactionDetails } from "../transactions/transactionDetails.js";
import { readAccountD } from "../account/readAccountDetails.js";
import { getAllTransactions } from "../transactions/readTransaction.js";
import { transactionSummary } from "../apiSummary/transactionSummary.js";
import { exportTransactionsCSV } from "../apiSummary/exportTransactionsCSV.js";
import { exportTransactionsExcel } from "../apiSummary/exportTransactionsExcel.js";
import { restoreTransactionById } from "../transactions/restoreTransactionById.js";
import { deleteMultipleTransactions } from "../transactions/deleteMultipleTransactions.js";
import { updateAccountD } from "../account/updateAccountDetails.js";
import { search } from "../apiSummary/search.js";
import { history } from "../transactions/history.js";
import { filter } from "../apiSummary/filter.js";
import uploadRoute from "./upload.js";
import { getTransactionAttachments } from "../transactions/getTransactionAttachments.js";
import { deleteAllTransaction } from "../transactions/deleteAllTransaction.js";


router.post("/bankDetails", verifyToken, upload.single("file"), bankDetails);
router.post("/transactionDetails", verifyToken, upload.single("file"), transactionDetails);

// Account CRUD functions
router.use("/account-details",verifyToken,readAccountD)
router.use("/updateAccountD",verifyToken,updateAccountD)

// Transaction CRUD functions

router.use("/transactions",verifyToken,getAllTransactions)

router.use("/deleteMultipleTransactions",verifyToken,deleteMultipleTransactions)
router.use("/deleteAll",verifyToken,deleteAllTransaction)

// Filters
router.use("/filter",verifyToken,filter)
router.use("/history",verifyToken,history)

// Restore By id
router.use("/restoretransactionById",verifyToken,restoreTransactionById)

// Transaction Summary api
router.use("/transactinSummary",verifyToken,transactionSummary)

// Transaction export 

router.use("/export/csv",verifyToken,exportTransactionsCSV)
router.use("/export/excel",verifyToken,exportTransactionsExcel)

// Filter endpoints

router.use("/search",verifyToken,search)

// Upload attachements
router.use("/uploads", express.static("uploads")); // Serve uploaded files
router.use("/upload",verifyToken, uploadRoute);

// Read attachements

router.use("/attachement" ,verifyToken,getTransactionAttachments)


export default router;
