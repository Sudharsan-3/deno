import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export const search = async (req, res) => {
     // Destructure request body to extract required fields
    const { userSearch } = req.body;

    if (!userSearch || typeof userSearch !== "string") {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid search term.",
        });
    }

    try {
        // Getting data from db to search
        const allTransactions = await prisma.transaction.findMany();

        if(allTransactions.length === 0){
            res.status(404).json({
                success :false,
                message : "There is no data to search"
            })
        }
        //  We making the user input to toLowerCase and we compare that with the db data
        const lowerSearch = userSearch.toLowerCase();

        const filtered = allTransactions.filter((t) => {
            if (t.type != "delete") {
              return  (t.description?.toLowerCase().includes(lowerSearch) ||
                    t.chequeOrRef?.toLowerCase().includes(lowerSearch) ||
                    t.amountType?.toLowerCase().includes(lowerSearch) ||
                    t.balanceType?.toLowerCase().includes(lowerSearch))
            }
        }
        );

        if (filtered.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No transactions matched your search: "${userSearch}"`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `${filtered.length} transaction(s) found.`,
            data: filtered,
        });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching transactions.",
            error: error.message,
        });
    }
};
