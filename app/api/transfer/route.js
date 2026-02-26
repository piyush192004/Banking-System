import { NextResponse } from "next/server";
import bankStore from "@/lib/bankStore";
import {
  validateAccountExists,
  validateAmount,
  validateSufficientBalance,
  validateKYCVerification,
  validateDifferentAccounts,
} from "@/lib/validations";

/**
 * POST /api/transfer
 * Transfer money between accounts
 *
 * Request body:
 * {
 *   "senderAccountNo": "ACC-20260226-12345",
 *   "receiverAccountNo": "ACC-20260226-54321",
 *   "amount": 2000
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { senderAccountNo, receiverAccountNo, amount } = body;

    // Validate sender account exists
    const senderValidation = validateAccountExists(senderAccountNo, bankStore);
    if (!senderValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: senderValidation.error,
        },
        { status: 404 }
      );
    }

    // Validate receiver account exists
    const receiverValidation = validateAccountExists(
      receiverAccountNo,
      bankStore
    );
    if (!receiverValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Receiver account does not exist",
        },
        { status: 404 }
      );
    }

    // Validate sender and receiver are different
    const differentAccountsValidation = validateDifferentAccounts(
      senderAccountNo,
      receiverAccountNo
    );
    if (!differentAccountsValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: differentAccountsValidation.error,
        },
        { status: 400 }
      );
    }

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: amountValidation.error,
        },
        { status: 400 }
      );
    }

    // Get sender account
    const senderAccount = bankStore.getAccount(senderAccountNo);

    // Validate KYC verification
    const kycValidation = validateKYCVerification(senderAccount);
    if (!kycValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: kycValidation.error,
        },
        { status: 400 }
      );
    }

    // Validate sufficient balance
    const balanceValidation = validateSufficientBalance(senderAccount, amount);
    if (!balanceValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: balanceValidation.error,
        },
        { status: 400 }
      );
    }

    // Get receiver account
    const receiverAccount = bankStore.getAccount(receiverAccountNo);

    // Process transfer
    const numAmount = parseFloat(amount);
    const senderNewBalance = senderAccount.balance - numAmount;
    const receiverNewBalance = receiverAccount.balance + numAmount;

    // Update both accounts
    bankStore.updateBalance(senderAccountNo, senderNewBalance);
    bankStore.updateBalance(receiverAccountNo, receiverNewBalance);

    // Record transactions for both accounts
    bankStore.addTransaction(senderAccountNo, {
      type: "transfer",
      amount: numAmount,
      fromAccount: senderAccountNo,
      toAccount: receiverAccountNo,
      previousBalance: senderAccount.balance,
      newBalance: senderNewBalance,
      status: "success",
    });

    bankStore.addTransaction(receiverAccountNo, {
      type: "transfer",
      amount: numAmount,
      fromAccount: senderAccountNo,
      toAccount: receiverAccountNo,
      previousBalance: receiverAccount.balance,
      newBalance: receiverNewBalance,
      status: "success",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Transfer successful",
        data: {
          transactionId: `TXN-${Date.now()}`,
          senderAccount: {
            accountNo: senderAccountNo,
            holderName: senderAccount.holderName,
            previousBalance: senderAccount.balance,
            newBalance: senderNewBalance,
          },
          receiverAccount: {
            accountNo: receiverAccountNo,
            holderName: receiverAccount.holderName,
            previousBalance: receiverAccount.balance,
            newBalance: receiverNewBalance,
          },
          transferAmount: numAmount,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
