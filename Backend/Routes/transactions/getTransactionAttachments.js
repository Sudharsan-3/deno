import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient(); 

export const getTransactionAttachments = async (req, res) => {
   // Destructure request body to extract required fields
  const { id } = req.body;
  console.log(id,"from attachement")

  // Here we are checking that the user entered value is a number and not null
  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing transaction ID",
    });
  }

  try {
    // Getting attachement from the db 
    const attachments = await prisma.transactionFile.findMany({
      where: {
        transactionId: Number(id),
      },
    });
    // If no attachement is found it will return

    if(attachments.length ===0){
      return res.status(404).json({
        success : false,
        message : "No attachement was founded"
      })
    }

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
