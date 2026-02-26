import { NextResponse } from 'next/server';
import bankStore from '@/lib/bankStore';
import { validateAccountExists, validateAmount } from '@/lib/validations';

/**
 * POST /api/deposit
 * Deposit money to an account
 * 
 * Request body:
 * {
 *   "accountNo": "ACC-20260226-12345",
 *   "amount": 5000
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

    // Get account and update balance
    const account = bankStore.getAccount(accountNo);
    const newBalance = account.balance + parseFloat(amount);
    bankStore.updateBalance(accountNo, newBalance);

    // Record transaction
    bankStore.addTransaction(accountNo, {
      type: 'deposit',
      amount: parseFloat(amount),
      previousBalance: account.balance,
      newBalance: newBalance,
      status: 'success'
    });

    const updatedAccount = bankStore.getAccount(accountNo);

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit successful',
        data: {
          accountNo,
          holderName: updatedAccount.holderName,
          previousBalance: account.balance,
          depositAmount: parseFloat(amount),
          newBalance: newBalance,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Deposit error:', error);
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
