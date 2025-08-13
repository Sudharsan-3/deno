# Xlorit-TI_Backend

🧾 GitHub Repository
🔗 Repo: https://github.com/Sudharsan-3/deno


🔐 Auth Endpoints

POST /api/register – Register a new user


POST /api/login – Login user



🏦 Bank & Transaction Upload

POST /api/bankDetails – Upload bank details (CSV)


POST /api/transactionDetails – Upload transaction details (CSV)



📁 Account Management

GET /api/account-details – Get all account details


PUT /api/updateAccountD – Update account details



💳 Transaction Management

GET /api/transactions – Get all transactions


DELETE /api/deleteMultipleTransactions – Delete multiple transactions


DELETE /api/deleteAll – Delete all transactions


PUT /api/restoretransactionById – Restore a deleted transaction by ID



📊 Summary & History

GET /api/transactinSummary – Get transaction summary


GET /api/history – Get transaction history



🔍 Search & Filter

POST /api/filter – Filter transactions


POST /api/search – Search transactions



📤 Export Transactions

GET /api/export/csv – Export transactions as CSV


GET /api/export/excel – Export transactions as Excel



📎 File Uploads & Attachments

POST /api/upload – Upload attachments


GET /api/attachement – Get all attachments


GET /uploads/<filename> – Access uploaded file by name
