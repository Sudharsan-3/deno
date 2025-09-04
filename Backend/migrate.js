// migrate.js
const { PrismaClient: PostgreSQLClient } = require('@prisma/client');
const { PrismaClient: MySQLClient } = require('@prisma/client');

const postgres = new PostgreSQLClient();
const mysql = new MySQLClient();

async function migrate() {
  // Export data from PostgreSQL
  const users = await postgres.user.findMany();
  const accounts = await postgres.account.findMany();
  const transactions = await postgres.transaction.findMany();
  const transactionFiles = await postgres.transactionFile.findMany();
  const transactionSnapshots = await postgres.transactionSnapshot.findMany();

  // Import data to MySQL
  for (const user of users) {
    await mysql.user.create({ data: user });
  }
  
  for (const account of accounts) {
    await mysql.account.create({ data: account });
  }
  
  for (const transaction of transactions) {
    await mysql.transaction.create({ data: transaction });
  }
  
  for (const file of transactionFiles) {
    await mysql.transactionFile.create({ data: file });
  }
  
  for (const snapshot of transactionSnapshots) {
    await mysql.transactionSnapshot.create({ data: snapshot });
  }

  console.log('Migration completed successfully');
  process.exit(0);
}

migrate().catch(console.error);