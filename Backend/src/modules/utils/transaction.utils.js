import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';

export const parseAmount = (amountStr) => {
  if (!amountStr) return 0;
  const num = Number(amountStr.toString().replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
};

export const parseDateTime = (dateTimeStr) => {
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

export const parseDate = (dateStr) => {
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

export const cleanString = (str) => (str || '').toString().trim();

export const processCSV = async (filePath, results) => {
  return new Promise((resolve, reject) => {
    let skipLines = 0;
    let headers = [];
    let foundHeaders = false;

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
        if (!foundHeaders) return reject(new Error('CSV headers not found.'));

        fs.createReadStream(filePath)
          .pipe(csv({ 
            skipLines: skipLines - 1,
            headers: headers.map((header, index) => {
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
};

export const processExcel = async (filePath, results) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  let headerRowIndex = -1;
  const headers = [];

  for (let i = 0; i < jsonData.length; i++) {
    if (jsonData[i][0] === 'Sl. No.' && jsonData[i][1] === 'Transaction Date') {
      headerRowIndex = i;
      headers.push(...jsonData[i].map(h => h.toString().trim()));
      break;
    }
  }

  if (headerRowIndex === -1) throw new Error('Excel headers not found.');

  for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row[0]?.toString().includes('Closing balance')) break;

    const transaction = {};
    headers.forEach((header, idx) => {
      const count = headers.slice(0, idx).filter(h => h === header).length;
      const key = count > 0 ? `${header}.${count}` : header;
      transaction[key] = row[idx] !== undefined ? row[idx] : null;
    });

    if (transaction['Sl. No.'] && !isNaN(transaction['Sl. No.'])) {
      results.push(transaction);
    }
  }
};
