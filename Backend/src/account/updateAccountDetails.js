import { PrismaClient } from "@prisma/client";
// Initialize Prisma Client
const prisma = new PrismaClient();


export const updateAccountD = async (req, res) => {
   // Destructure request body to extract required fields
  const {
    id,
    createdById,
    name,
    address,
    custRelnNo,
    accountNo,
    startDate,
    endDate,
    currency,
    branch,
    ifsc,
    micr,
  } = req.body;

  // Validate required input
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing 'id' in request body.",
    });
  }

  try {
    // Check if the account exists
    const existingAccount = await prisma.account.findUnique({
      where: { id: Number(id) },
    });

    if (!existingAccount) {
      return res.status(404).json({
        success: false,
        message: `No account found with ID ${id}`,
      });
    }

    // Update account with fallback values
    const updatedAccount = await prisma.account.update({
      where: { id: Number(id) },
      data: {
        createdById: createdById ?? existingAccount.createdById,
        name: name ?? existingAccount.name,
        address: address ?? existingAccount.address,
        custRelnNo: custRelnNo ?? existingAccount.custRelnNo,
        accountNo: accountNo ?? existingAccount.accountNo,
        startDate: startDate ?? existingAccount.startDate,
        endDate: endDate ?? existingAccount.endDate,
        currency: currency ?? existingAccount.currency,
        branch: branch ?? existingAccount.branch,
        ifsc: ifsc ?? existingAccount.ifsc,
        micr: micr ?? existingAccount.micr,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account updated successfully.",
      data: updatedAccount,
    });

  } catch (error) {
    console.error("Account update error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating account.",
      error: error.message || "Unknown error",
    });
  }
};
