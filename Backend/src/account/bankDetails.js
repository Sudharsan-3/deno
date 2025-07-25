import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client

const prisma = new PrismaClient();

// Export async function to handle bank details submission
export const bankDetails = async (req, res) => {
   // Destructure request body to extract required fields
  const {
    createdBy,
    name,
    address,
    custRelnNo,
    accountNo,
    startDate,
    endDate,
    currency,
    branch,
    ifsc,
    micr
  } = req.body;
 

  try {
    // Validate required fields
    if (!createdBy || !name || !address || !accountNo || !branch || !ifsc || !micr) {
      return res.status(400).json({
        message: "Missing required fields. Please ensure all mandatory fields are provided: createdBy, name, address, accountNo, period, branch, IFSC, MICR."
      });
    }

     // Convert createdBy to a number and validate
    const id = Number(createdBy);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid user ID (createdBy). Must be a valid number."
      });
    }

     // Check if the user exists in the database
   
    const checkUser = await prisma.user.findUnique({
      where:{
        id
      }
    })

    // If user is not found, return a 404 response
    if(!checkUser){
      return res.status(404).json({
        message : "The user id is not valid"
      })

    } 
    const checkAccNo = await prisma.account.findUnique({
      where:{
        accountNo
      }
    })
    // Check if the account number already exists

    if(checkAccNo){
      return res.status(409).json({
        message : "The account number you entered is already in use"
      })

    } 

    // Create a new Account and associate with existing User
    const resp = await prisma.account.create({
      data: {
        createdById: id,
        name,
        address,
        custRelnNo,
        accountNo,
        startDate,
        endDate,
        currency,
        branch,
        ifsc,
        micr
      }
    });

    // Success response
    return res.status(201).json({
      message: "Bank details stored successfully.",
      command: "POST /bank-details",
      inserted: resp
    });

  } catch (error) {
    console.error("Error inserting bank details:", error);

    return res.status(500).json({
      message: "Internal server error. Could not store bank details.",
      command: "POST /bank-details",
      error: error.message
    });
  }
};
