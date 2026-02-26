import { NextResponse } from "next/server";
import bankStore from "@/lib/bankStore";
import { validateHolderName, generateAccountNumber } from "@/lib/validations";

/**
 * POST /api/accounts
 * Create a new bank account
 *
 * Request body:
 * {
 *   "holderName": "John Doe",
 *   "isKYCVerified": false
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Account created successfully",
 *   "data": {
 *     "accountNo": "ACC-20260226-12345",
 *     "holderName": "John Doe",
 *     "balance": 0,
 *     "isKYCVerified": false,
 *     "createdAt": "2026-02-26T..."
 *   }
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { holderName, isKYCVerified = false } = body;

    // Validate holder name
    const nameValidation = validateHolderName(holderName);
    if (!nameValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: nameValidation.error,
        },
        { status: 400 }
      );
    }

    // Generate unique account number
    const accountNo = generateAccountNumber();

    // Create account object
    const newAccount = {
      accountNo,
      holderName: holderName.trim(),
      balance: 0,
      isKYCVerified,
      createdAt: new Date().toISOString(),
      transactions: [],
    };

    // Store account
    bankStore.addAccount(accountNo, newAccount);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: newAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Account creation error:", error);
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

/**
 * GET /api/accounts
 * Retrieve all bank accounts
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "accountNo": "ACC-20260226-12345",
 *       "holderName": "John Doe",
 *       "balance": 5000,
 *       "isKYCVerified": true,
 *       "createdAt": "2026-02-26T..."
 *     }
 *   ]
 * }
 */
export async function GET(request) {
  try {
    const accounts = bankStore.getAllAccounts();

    return NextResponse.json(
      {
        success: true,
        data: accounts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch accounts error:", error);
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
