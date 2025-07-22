import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // ideally keep this global

export const getTransactionAttachments = async (req, res) => {
  const { id } = req.body;
  console.log(id,"from attachement")

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing transaction ID",
    });
  }

  try {
    const attachments = await prisma.transactionFile.findMany({
      where: {
        transactionId: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Attachments loaded successfully",
      count: attachments.length,
      data: attachments,
    });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
