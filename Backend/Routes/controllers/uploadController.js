import fs from 'fs';
import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

// ✅ Helper to clean numbers like "1,23,000.00"
function parseAmount(value) {
  if (!value) return null;
  const num = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

// ✅ Helper to clean dates
function parseDate(value) {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function extractAccountDetailsFromTop(rows) {
  const flat = rows.flatMap(r => Object.values(r));
  const get = (label) => {
    const index = flat.findIndex(v => typeof v === 'string' && v.toLowerCase().includes(label.toLowerCase()));
    return index !== -1 ? flat[index + 1]?.toString().trim() : null;
  };

  return {
    address: flat.slice(0, 6).filter(Boolean).join(', ').trim() || null,
    crf: get('Cust. Reln. No.') || null,
    accountNo: get('Account No.') || '',
    period: get('Period') || null,
    nominationRegd: get('Nomination Regd') || null,
    nomineeName: get('Nominee Name') || null,
    jointHolders: get('Joint Holder') || null,
    ifsc: get('IFSC') || null,
    micr: get('MICR') || null,
  };
}

function extractTransactionsFromData(rows) {
  const txStartIndex = rows.findIndex(row =>
    Object.values(row).some(v => typeof v === 'string' && v.toLowerCase().includes('transaction date'))
  );

  if (txStartIndex === -1) return [];

  const headerRow = rows[txStartIndex];
  const headers = Object.values(headerRow).map(h => h.toString().trim());

  const transactions = [];

  for (let i = txStartIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const values = Object.values(row);
    if (!values.some(v => v)) continue;

    const tx = {};
    headers.forEach((key, idx) => {
      tx[key] = values[idx];
    });

    // Clean and map fields
    transactions.push({
      slNo: parseInt(tx['Sl. No.']) || null,
      transactionDate: parseDate(tx['Transaction Date']),
      valueDate: parseDate(tx['Value Date']),
      description: tx['Description'] || null,
      chequeOrRef: tx['Chq / Ref No.'] || null,
      amount: parseAmount(tx['Amount']),
      type: tx['Dr / Cr'] || null,
      balance: parseAmount(tx['Balance']),
      address: tx['Address'] || null,
      crf: tx['Crf'] || null,
      accountNo: tx['AccountNo'] || null,
      ifsc: tx['IFSC'] || null,
      micr: tx['MICR'] || null,
    });
  }

  return transactions;
}

export const handleUpload = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = file.path;
  const isExcel = file.originalname.endsWith('.xlsx');

  try {
    let rows = [];

    if (isExcel) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
        .map(row => Object.fromEntries(row.map((v, i) => [i, v])));
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      await new Promise((resolve, reject) => {
        parse(fileContent, { columns: true, trim: true, skip_empty_lines: true }, (err, parsed) => {
          if (err) return reject(err);
          rows = parsed;
          resolve();
        });
      });
    }

    fs.unlinkSync(filePath); // Clean temp file

    const accountData = extractAccountDetailsFromTop(rows);
    const transactions = extractTransactionsFromData(rows);

    let createdAccount = null;
    if (accountData.accountNo) {
      createdAccount = await prisma.account.create({ data: accountData });
    }

    const createdTransactions = await prisma.$transaction(
      transactions.map((tx) =>
        prisma.transaction.create({
          data: {
            ...tx,
            accountId: createdAccount?.id || null,
          },
        })
      )
    );

    res.status(201).json({
      message: '✅ Data uploaded successfully',
      accounts: createdAccount ? 1 : 0,
      transactions: createdTransactions.length,
    });
  } catch (err) {
    console.error('❌ Failed to process file:', err);
    res.status(500).json({ error: '❌ Failed to process file' });
  }
};

// import fs from 'fs';
// import path from 'path';
// import { parse } from 'csv-parse';
// import xlsx from 'xlsx';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// function parseDate(value) {
//   if (!value) return null;
//   const parsed = new Date(value);
//   return isNaN(parsed.getTime()) ? null : parsed;
// }

// export const handleUpload = async (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(400).json({ error: 'No file uploaded' });

//   const filePath = file.path;
//   const isExcel = file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls');

//   const transactions = [];
//   const accountMeta = {
//     accountNo: '',
//     crf: '',
//     period: '',
//     address: '',
//     nominationRegd: '',
//     nomineeName: '',
//     jointHolders: '',
//     ifsc: '',
//     micr: ''
//   };

//   try {
//     if (isExcel) {
//       // Excel logic here
//       const workbook = xlsx.readFile(filePath);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

//       fs.unlinkSync(filePath);

//       // Extract account metadata from top rows
//       rows.forEach((row) => {
//         if (!Array.isArray(row)) return;
//         if (row.includes('Account No.')) accountMeta.accountNo = row[row.indexOf('Account No.') + 1] || '';
//         if (row.includes('Cust. Reln. No.')) accountMeta.crf = row[row.indexOf('Cust. Reln. No.') + 1] || '';
//         if (row.includes('Period')) accountMeta.period = row[row.indexOf('Period') + 1] || '';
//         if (row.includes('IFSC')) accountMeta.ifsc = row[row.indexOf('IFSC') + 1] || '';
//         if (row.includes('MICR')) accountMeta.micr = row[row.indexOf('MICR') + 1] || '';
//         if (row.includes('Nomination Regd')) accountMeta.nominationRegd = row[row.indexOf('Nomination Regd') + 1] || '';
//         if (row.includes('Nominee Name')) accountMeta.nomineeName = row[row.indexOf('Nominee Name') + 1] || '';
//       });

//       // Find transaction start row
//       const headerRowIndex = rows.findIndex(
//         (row) => Array.isArray(row) && row.includes('Transaction Date')
//       );

//       const headers = rows[headerRowIndex];
//       const dataRows = rows.slice(headerRowIndex + 1);

//       for (const row of dataRows) {
//         const tx = {};
//         headers.forEach((key, i) => {
//           tx[key] = row[i];
//         });

//         if (tx['Transaction Date']) {
//           transactions.push({
//             slNo: parseInt(tx['Sl. No.']) || null,
//             transactionDate: parseDate(tx['Transaction Date']),
//             valueDate: parseDate(tx['Value Date']),
//             description: tx['Description'] || null,
//             chequeOrRef: tx['Chq / Ref No.'] || null,
//             amount: parseFloat((tx['Amount'] || '').toString().replace(/,/g, '')) || 0,
//             type: tx['Dr / Cr'] || null,
//             balance: parseFloat((tx['Balance'] || '').toString().replace(/,/g, '')) || 0,
//             address: tx['Address'] || null,
//             crf: accountMeta.crf,
//             accountNo: accountMeta.accountNo,
//             ifsc: accountMeta.ifsc,
//             micr: accountMeta.micr
//           });
//         }
//       }
//     } else {
//       // CSV: detect correct header row and parse only data
//       const fileContent = fs.readFileSync(filePath, 'utf-8');
//       const lines = fileContent.split('\n').map((line) => line.trim()).filter(Boolean);

//       let headerIndex = lines.findIndex((line) => line.startsWith('Sl. No.,Transaction Date'));
//       if (headerIndex === -1) throw new Error('No valid transaction header found in CSV.');

//       const csvContent = lines.slice(headerIndex).join('\n');
//       fs.writeFileSync(filePath, csvContent); // rewrite cleaned file

//       const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, trim: true }));

//       for await (const row of parser) {
//         transactions.push({
//           slNo: parseInt(row['Sl. No.']) || null,
//           transactionDate: parseDate(row['Transaction Date']),
//           valueDate: parseDate(row['Value Date']),
//           description: row['Description'] || null,
//           chequeOrRef: row['Chq / Ref No.'] || null,
//           amount: parseFloat((row['Amount'] || '').toString().replace(/,/g, '')) || 0,
//           type: row['Dr / Cr'] || null,
//           balance: parseFloat((row['Balance'] || '').toString().replace(/,/g, '')) || 0,
//           address: row['Address'] || null,
//           crf: null,
//           accountNo: row['AccountNo'] || null,
//           ifsc: row['IFSC'] || null,
//           micr: row['MICR'] || null,
//         });
//       }

//       fs.unlinkSync(filePath);
//     }

//     // Insert transactions
//     const created = await prisma.$transaction(
//       transactions.map((tx) => prisma.transaction.create({ data: tx }))
//     );

//     res.status(201).json({
//       message: isExcel ? '✅ Excel uploaded' : '✅ CSV uploaded',
//       transactions: created.length,
//     });
//   } catch (err) {
//     console.error('❌ Failed to process file:', err);
//     res.status(500).json({ error: '❌ Failed to process file' });
//   }
// };
