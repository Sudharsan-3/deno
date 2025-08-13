import express from "express";
import { accountController } from "./index.js";
import {verifyToken}from "../../middlewares/verifyToken.js"

const router = express.Router();

router.post("/getAccountByuser",verifyToken,accountController.getAccountByUser)

router.post("/account",verifyToken,accountController.accountDetail);

router.get("/account/details",verifyToken,accountController.getAccount)

router.put("/account/update",verifyToken,accountController.updateAccount)

router.delete("/account/delete",verifyToken,accountController.deleteAccount)

export default router;