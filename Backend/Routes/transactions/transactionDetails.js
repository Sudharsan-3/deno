import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper functions
const parseAmount = (amountStr) => {
  if (!amountStr) return 0;
  const num = Number(amountStr.toString().replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
};

const parseDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return new Date();
  try {
    const [datePart, timePart] = dateTimeStr.toString().split(' ');
    const [day, month, year] = datePart.split(/[/-]/);
    if (!timePart) return new Date(`${year}-${month}-${day}`);
    const [hours, minutes] = timePart.split(':');
    return new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    ));
  } catch {
    return new Date();
  }
};

const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  try {
    const [day, month, year] = dateStr.toString().split(/[/-]/);
    return new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    ));
  } catch {
    return new Date();
  }
};

const cleanString = (str) => (str || '').toString().trim();

export const transactionDetails = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const fileExt = req.file.originalname.split('.').pop().toLowerCase();
  const results = [];

  try {
    const { userId, accountId } = req.body;

    // Verify user and account exist
    const [user, account] = await Promise.all([
      prisma.user.findUnique({ where: { id: Number(userId) } }),
      prisma.account.findUnique({ where: { id: Number(accountId) } })
    ]);

    if (!user) return res.status(404).json({ message: `User not found: ${userId}` });
    if (!account) return res.status(404).json({ message: `Account not found: ${accountId}` });

    // Process file
    if (fileExt === 'csv') {
      await processCSV(filePath, results);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      await processExcel(filePath, results);
    } else {
      throw new Error('Only CSV or Excel files are supported');
    }

    if (results.length === 0) {
      throw new Error('No valid transactions found in file');
    }

    // Transform and save data
    const savedTransactions = await saveTransactions(results, userId, accountId);

    res.json({
      success: true,
      message: `Successfully saved ${savedTransactions.length} transactions`,
      data: savedTransactions,
    });

  } catch (error) {
    console.error('Transaction processing error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await prisma.$disconnect();
  }
};

async function saveTransactions(transactions, userId, accountId) {
  const transactionsToCreate = transactions.map(txn => {
    // Debug: Show all available fields in the transaction
    console.log('Transaction fields:', Object.keys(txn));
    
    // Get the DR/CR values - we need to verify the exact field names
    const amountType = (txn['Dr / Cr'] || '').toString().trim().toUpperCase();
    const balanceType = (txn['Balance Dr/Cr'] || txn['Dr / Cr.1'] || '').toString().trim().toUpperCase();

    return {
      slNo: parseInt(txn['Sl. No.']) || 0,
      transactionDate: parseDateTime(txn['Transaction Date']),
      valueDate: parseDate(txn['Value Date']),
      description: cleanString(txn['Description']),
      chequeOrRef: cleanString(txn['Chq / Ref No.']),
      amount: parseAmount(txn['Amount']),
      amountType: amountType === 'CR' ? 'CR' : 'DR', // Default to DR if not CR
      balance: parseAmount(txn['Balance']),
      balanceType: balanceType === 'DR' ? 'DR' : 'CR', // Default to CR if not DR
      createdById: Number(userId),
      accountId: Number(accountId)
    };
  });

  return await prisma.$transaction(
    transactionsToCreate.map(txn => 
      prisma.transaction.create({ data: txn })
    )
  );
}

async function processCSV(filePath, results) {
  return new Promise((resolve, reject) => {
    let skipLines = 0;
    let headers = [];
    let foundHeaders = false;

    // First pass: Detect headers
    const detectStream = fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        skipLines++;
        if (row['0']?.trim() === 'Sl. No.' && row['1']?.trim() === 'Transaction Date') {
          headers = Object.values(row).map(h => h.trim());
          foundHeaders = true;
          detectStream.destroy();
        }
      })
      .on('close', () => {
        if (!foundHeaders) {
          return reject(new Error('CSV headers not found. First row must contain "Sl. No." and "Transaction Date"'));
        }

        // Second pass: Process data with proper column handling
        fs.createReadStream(filePath)
          .pipe(csv({ 
            skipLines: skipLines - 1,
            headers: headers.map((header, index) => {
              // Handle duplicate column names
              const count = headers.slice(0, index).filter(h => h === header).length;
              return count > 0 ? `${header}.${count}` : header;
            }),
            strict: true
          }))
          .on('data', (data) => {
            if (!data['Sl. No.'] || isNaN(data['Sl. No.'])) return;
            if (data['Sl. No.'].toString().includes('Closing balance')) return;
            
            results.push(data);
          })
          .on('end', resolve)
          .on('error', reject);
      })
      .on('error', reject);
  });
}

async function processExcel(filePath, results) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  let headerRowIndex = -1;
  const headers = [];

  // Find headers
  for (let i = 0; i < jsonData.length; i++) {
    if (jsonData[i][0] === 'Sl. No.' && jsonData[i][1] === 'Transaction Date') {
      headerRowIndex = i;
      headers.push(...jsonData[i].map(h => h.toString().trim()));
      break;
    }
  }

  if (headerRowIndex === -1) {
    throw new Error('Excel headers not found. First row must contain "Sl. No." and "Transaction Date"');
  }

  // Process data rows with duplicate column handling
  for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row[0]?.toString().includes('Closing balance')) break;
    
    const transaction = {};
    headers.forEach((header, idx) => {
      // Handle duplicate columns
      const count = headers.slice(0, idx).filter(h => h === header).length;
      const key = count > 0 ? `${header}.${count}` : header;
      transaction[key] = row[idx] !== undefined ? row[idx] : null;
    });
    
    if (transaction['Sl. No.'] && !isNaN(transaction['Sl. No.'])) {
      results.push(transaction);
    }
  }
}