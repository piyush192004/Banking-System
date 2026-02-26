import { NextResponse } from 'next/server';
import bankStore from '@/lib/bankStore';
import { validateAccountExists, validateAmount, validateSufficientBalance } from '@/lib/validations';

/**
 * POST /api/withdraw
 * Withdraw money from an account
 * 
 * Request body:
 * {
 *   "accountNo": "ACC-20260226-12345",
 *   "amount": 1000
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { accountNo, amount } = body;

    // Validate account exists
    const accountValidation = validateAccountExists(accountNo, bankStore);
    if (!accountValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: accountValidation.error
        },
        { status: 404 }
      );
    }

    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: amountValidation.error
        },
        { status: 400 }
      );
    }

    // Get account and validate sufficient balance
    const account = bankStore.getAccount(accountNo);
    const balanceValidation = validateSufficientBalance(account, amount);
    if (!balanceValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: balanceValidation.error
        },
        { status: 400 }
      );
    }

    // Update balance
    const newBalance = account.balance - parseFloat(amount);
    bankStore.updateBalance(accountNo, newBalance);

    // Record transaction
    bankStore.addTransaction(accountNo, {
      type: 'withdraw',
      amount: parseFloat(amount),
      previousBalance: account.balance,
      newBalance: newBalance,
      status: 'success'
    });

    const updatedAccount = bankStore.getAccount(accountNo);

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal successful',
        data: {
          accountNo,
          holderName: updatedAccount.holderName,
          previousBalance: account.balance,
          withdrawAmount: parseFloat(amount),
          newBalance: newBalance,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message
      },
      { status: 500 }
    );
  }
}
