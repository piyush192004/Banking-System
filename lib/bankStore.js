/**
 * Singleton store for managing all bank accounts
 * Stores accounts in a Map for efficient O(1) lookups
 */

class BankStore {
  constructor() {
    this.accounts = new Map();
    this.transactionHistory = [];
  }

  /**
   * Add a new account to the store
   * @param {string} accountNo - Account number
   * @param {Object} account - Account object
   */
  addAccount(accountNo, account) {
    this.accounts.set(accountNo, {
      ...account,
      transactions: []
    });
  }

  /**
   * Get account by account number
   * @param {string} accountNo - Account number
   * @returns {Object|null} Account object or null if not found
   */
  getAccount(accountNo) {
    return this.accounts.get(accountNo) || null;
  }

  /**
   * Update account balance
   * @param {string} accountNo - Account number
   * @param {number} amount - New balance
   */
  updateBalance(accountNo, amount) {
    const account = this.accounts.get(accountNo);
    if (account) {
      account.balance = amount;
      this.accounts.set(accountNo, account);
    }
  }

  /**
   * Add transaction to account history
   * @param {string} accountNo - Account number
   * @param {Object} transaction - Transaction object
   */
  addTransaction(accountNo, transaction) {
    const account = this.accounts.get(accountNo);
    if (account) {
      account.transactions.push({
        ...transaction,
        timestamp: new Date().toISOString()
      });
      this.accounts.set(accountNo, account);
    }
  }

  /**
   * Get all accounts
   * @returns {Array} Array of all accounts
   */
  getAllAccounts() {
    return Array.from(this.accounts.values());
  }

  /**
   * Check if account exists
   * @param {string} accountNo - Account number
   * @returns {boolean} True if account exists
   */
  accountExists(accountNo) {
    return this.accounts.has(accountNo);
  }

  /**
   * Get system statistics
   * @returns {Object} Object with total accounts and system balance
   */
  getSystemStats() {
    let totalBalance = 0;
    this.accounts.forEach(account => {
      totalBalance += account.balance;
    });

    return {
      totalAccounts: this.accounts.size,
      totalSystemBalance: totalBalance
    };
  }
}

// Create and export singleton instance
const bankStore = new BankStore();
export default bankStore;
