import express from "express";
// Initialize Prisma Client
import { PrismaClient } from "@prisma/client";
import upload from "../middlewares/upload.js"; // default import now

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/upload/:transactionId
router.post("/:transactionId", upload.array("files", 10), async (req, res) => {
  const { transactionId } = req.params;
  const { description } = req.body;
  const files = req.files;

  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Check if transaction exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Save all files to DB
    const filePromises = files.map((file) =>
      prisma.transactionFile.create({
        data: {
          fileName: file.originalname,
          fileType: file.mimetype,
          filePath: file.path,
          description: description || null,
          transactionId: transaction.id,
        },
      })
    );

    const savedFiles = await Promise.all(filePromises);

    res.status(200).json({
      success: true,
      message: "Files uploaded and saved",
      data: savedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
