/**
 * @typedef {Object} Account
 * @property {string} accountNo - Unique account number
 * @property {string} holderName - Name of account holder
 * @property {number} balance - Current account balance
 * @property {boolean} isKYCVerified - KYC verification status
 * @property {Array} transactions - Transaction history
 */

/**
 * @typedef {Object} Transaction
 * @property {string} type - 'deposit', 'withdraw', or 'transfer'
 * @property {number} amount - Transaction amount
 * @property {string} fromAccount - Source account (for transfer)
 * @property {string} toAccount - Destination account (for transfer)
 * @property {Date} timestamp - Transaction timestamp
 * @property {string} status - 'success' or 'failed'
 */

module.exports = {};
