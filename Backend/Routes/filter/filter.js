import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const filter = async (req, res) => {
  const {
    date,          // "2025-06-01 18:38:00"
    desciption,    // intentionally preserving typo if frontend sends this
    refNo,
    crMin,
    crMax,
    dbMin,
    dbMax,
    tt,            // amountType (credit/debit)
    attachment,
  } = req.body;

  try {
    // Step 1: Fetch all inuse transactions with files
    const data = await prisma.transaction.findMany({
      where: {
        type: "inuse",
      },
      include: {
        files: true,
      },
    });

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    // Step 2: If no filters provided at all, return all with optional tt (amountType) filter
    const noFiltersApplied =
      !date &&
      !desciption &&
      !refNo &&
      !attachment &&
      crMin === undefined &&
      crMax === undefined &&
      dbMin === undefined &&
      dbMax === undefined;

    // If no filters, just use tt (amountType) filter if provided
    if (noFiltersApplied) {
      const result = tt
        ? data.filter(
            (item) =>
              item.amountType?.toLowerCase() === tt.toLowerCase()
          )
        : data;

      return res.status(200).json({
        success: true,
        message: "Transactions returned (default type filter only)",
        length: result.length,
        data: result,
      });
    }

    // Step 3: Otherwise, apply all relevant filters
    const filtered = data.filter((e) => {
      const tDate = e.transactionDate
        ? new Date(e.transactionDate).toISOString().split("T")[0]
        : "";

      const inputDate = date
        ? new Date(date).toISOString().split("T")[0]
        : null;

      const dateMatch = inputDate ? tDate === inputDate : true;

      const descriptionMatch = desciption
        ? e.description?.toLowerCase().includes(desciption.toLowerCase())
        : true;

      const refNoMatch = refNo
        ? e.chequeOrRef?.toLowerCase().includes(refNo.toLowerCase())
        : true;

      const typeMatch = tt
        ? e.amountType?.toLowerCase() === tt.toLowerCase()
        : true;

      const attachmentMatch = attachment
        ? e.files?.some(
            (file) =>
              file.fileName?.toLowerCase().includes(attachment.toLowerCase()) ||
              file.description?.toLowerCase().includes(attachment.toLowerCase())
          )
        : true;

      const creditMatch =
        e.amountType?.toLowerCase() === "credit"
          ? (crMin === undefined || e.amount >= crMin) &&
            (crMax === undefined || e.amount <= crMax)
          : true;

      const debitMatch =
        e.amountType?.toLowerCase() === "debit"
          ? (dbMin === undefined || e.amount >= dbMin) &&
            (dbMax === undefined || e.amount <= dbMax)
          : true;

      return (
        dateMatch &&
        descriptionMatch &&
        refNoMatch &&
        typeMatch &&
        attachmentMatch &&
        creditMatch &&
        debitMatch
      );
    });

    return res.status(200).json({
      success: true,
      message: "Filtered transactions loaded successfully",
      length: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error("Error filtering transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
