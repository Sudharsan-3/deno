import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { transactionController } from "./index.js";
import multer from 'multer';
import uploads  from "../../middlewares/upload.js"; // Your multer config
import { exportTransactionsZipController } from "./transaction.controller.js";

const upload = multer({ dest: 'uploads/' });


const router = express.Router();

router.put("/updateTransaction/:id", verifyToken, transactionController.updateTransaction);

router.get("/all",verifyToken,transactionController.getTransaction)
router.get("/restore",verifyToken,transactionController.restoreTransaction)
router.get("/history",verifyToken,transactionController.transactionHistroy)

router.delete("/deleteAll",verifyToken,transactionController.deleteAllTransacions)
router.put("/delete",verifyToken,transactionController.deleteTransaction)

router.get("/summary",verifyToken,transactionController.transactionSummary)
router.post("/search",verifyToken,transactionController.transactionSearch)
router.post("/filter",verifyToken,transactionController.transactionFilter)

router.post("/export/csv",verifyToken,transactionController.exportCSV)
router.post("/export/excel",verifyToken,transactionController.exportExcel)

router.post('/import/transactions',verifyToken,upload.single('file'), transactionController.importTransactions);

router.post("/upload/attachments", verifyToken, uploads.array("files", 10), transactionController.uploadTransactionFiles);

router.post("/export-zip", exportTransactionsZipController);

export default router;  