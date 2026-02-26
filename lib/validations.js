/**
 * Centralized validation logic for all banking operations
 */

/**
 * Validate account holder name
 * @param {string} holderName - Account holder name
 * @returns {Object} {valid: boolean, error?: string}
 */
export function validateHolderName(holderName) {
  if (!holderName || typeof holderName !== "string") {
    return {
      valid: false,
      error: "Holder name is required",
    };
  }

  const trimmedName = holderName.trim();
  if (trimmedName.length < 3) {
    return {
      valid: false,
      error: "Holder name must be at least 3 characters long",
    };
  }

  return { valid: true };
}

/**
 * Validate account number exists
 * @param {string} accountNo - Account number
 * @param {Object} bankStore - Bank store instance
 * @returns {Object} {valid: boolean, error?: string}
 */
export function validateAccountExists(accountNo, bankStore) {
  if (!accountNo || typeof accountNo !== "string") {
    return {
      valid: false,
      error: "Account number is required",
    };
  }

  if (!bankStore.accountExists(accountNo)) {
    return {
      valid: false,
      error: "Account does not exist",
    };
  }

  return { valid: true };
}

/**
 * Validate amount is positive
 * @param {number} amount - Transaction amount
 * @returns {Object} {valid: boolean, error?: string}
 */
export function validateAmount(amount) {
  if (amount === undefined || amount === null) {
    return {
      valid: false,
      error: "Amount is required",
    };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return {
      valid: false,
      error: "Amount must be a valid number",
    };
  }

  if (numAmount <= 0) {
    return {
      valid: false,
      error: "Amount must be greater than 0",
    };
  }

  return { valid: true };
}

/**
 * Validate sufficient balance
 * @param {Object} account - Account object
 * @param {number} amount - Withdrawal/transfer amount
 * @returns {Object} {valid: boolean, error?: string}
 */
export function validateSufficientBalance(account, amount) {
  const numAmount = parseFloat(amount);
  if (account.balance < numAmount) {
    return {
      valid: false,
      error: `Insufficient balance. Available: ${account.balance}, Required: ${numAmount}`,
    };
  }

  return { valid: true };
}

/**
 * Validate KYC verification for transfers
 * @param {Object} account - Account object
 * @returns {Object} {valid: boolean, error?: string}
 */
export function validateKYCVerification(account) {
  if (!account.isKYCVerified) {
    return {
      valid: false,
      error: "Sender must be KYC verified to perform transfers",
    };
  }

  return { valid: true };
}

/**
 * Validate sender and receiver are different accounts
 * @param {string} senderAccountNo - Sender account number
 * @param {string} receiverAccountNo - Receiver account number
 * @returns {Object} {valid: boolean, error?: string}
 */
export function validateDifferentAccounts(senderAccountNo, receiverAccountNo) {
  if (senderAccountNo === receiverAccountNo) {
    return {
      valid: false,
      error: "Cannot transfer to the same account",
    };
  }

  return { valid: true };
}

/**
 * Generate unique account number
 * Format: ACC-YYYYMMDD-XXXXX (where X is random)
 * @returns {string} Unique account number
 */
export function generateAccountNumber() {
  const date = new Date();
  const dateStr =
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");

  return `ACC-${dateStr}-${randomNum}`;
}
