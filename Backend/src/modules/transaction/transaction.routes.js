import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { transactionController } from "./index.js";

const router = express.Router();

router.get("/all",verifyToken,transactionController.getTransaction)
router.get("/restore",verifyToken,transactionController.restoreTransaction)
router.get("/history",verifyToken,transactionController.transactionHistroy)

router.delete("/deleteAll",verifyToken,transactionController.deleteAllTransacions)
router.put("/delete",verifyToken,transactionController.deleteTransaction)

router.get("/summary",verifyToken,transactionController.transactionSummary)
router.post("/search",verifyToken,transactionController.transactionSearch)
router.post("/filter",verifyToken,transactionController.transactionFilter)

router.get("/export/csv",verifyToken,transactionController.exportCSV)

export default router;  