# 🏦 Banking System

A complete, production-quality banking system built with Next.js, React, and Node.js. This application demonstrates modern web development practices with proper validation, error handling, and a clean UI.

## 📋 Features

✅ **Account Management**
- Create new bank accounts with unique account numbers
- View all accounts with dashboard statistics
- Track account balances and KYC verification status
- Transaction history per account

✅ **Banking Operations**
- **Deposit**: Add funds to accounts
- **Withdraw**: Remove funds with balance validation
- **Transfer**: Send money between accounts with KYC requirements

✅ **Validations & Error Handling**
- Centralized validation logic
- Proper HTTP status codes (201, 200, 400, 404, 500)
- Transaction history tracking
- KYC verification requirements for transfers

✅ **User Interface**
- Responsive Tailwind CSS design
- Clean card-based layouts
- Real-time form validation
- Loading states and error messages
- Dashboard with system statistics

## 🏗️ Project Architecture

```
/app
  /api
    /accounts          # GET: List accounts, POST: Create account
    /deposit           # POST: Deposit funds
    /withdraw          # POST: Withdraw funds
    /transfer          # POST: Transfer between accounts
  /create-account      # Account creation page
  /transactions        # Deposit, Withdraw, Transfer page
  /accounts            # View all accounts page
  layout.jsx           # Root layout with navigation
  page.jsx             # Home page (redirects to create-account)
  globals.css          # Global styles

/components
  AccountForm.jsx      # Account creation form
  TransactionForm.jsx  # Transaction operations (with tabs)
  AccountList.jsx      # List all accounts with stats
  AlertBox.jsx         # Reusable alert component

/lib
  bankStore.js         # Singleton store for all accounts (Map-based)
  validations.js       # Centralized validation functions
  types.js             # JSDoc type definitions
```

## 📊 Data Model

```javascript
{
  accountNo: string,              // Unique: ACC-YYYYMMDD-XXXXX
  holderName: string,             // Min 3 characters
  balance: number,                // Current account balance
  isKYCVerified: boolean,         // Required for transfers
  createdAt: ISO8601 timestamp,   // Account creation date
  transactions: [                 // Transaction history
    {
      type: 'deposit|withdraw|transfer',
      amount: number,
      previousBalance: number,
      newBalance: number,
      fromAccount?: string,       // For transfers only
      toAccount?: string,         // For transfers only
      status: 'success',
      timestamp: ISO8601 timestamp
    }
  ]
}
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ (recommended: LTS version)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/piyush192004/Banking-System.git
cd Banking-System
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:3000`

The application will redirect to the account creation page.

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoint Documentation

### 1️⃣ Create Account
**Endpoint:** `POST /api/accounts`

**Request Body:**
```json
{
  "holderName": "John Doe",
  "isKYCVerified": false
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "accountNo": "ACC-20260226-12345",
    "holderName": "John Doe",
    "balance": 0,
    "isKYCVerified": false,
    "createdAt": "2026-02-26T10:30:00Z",
    "transactions": []
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Holder name must be at least 3 characters long"
}
```

---

### 2️⃣ Get All Accounts
**Endpoint:** `GET /api/accounts`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "accountNo": "ACC-20260226-12345",
      "holderName": "John Doe",
      "balance": 5000,
      "isKYCVerified": true,
      "createdAt": "2026-02-26T10:30:00Z"
    }
  ]
}
```

---

### 3️⃣ Deposit Funds
**Endpoint:** `POST /api/deposit`

**Request Body:**
```json
{
  "accountNo": "ACC-20260226-12345",
  "amount": 5000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Deposit successful",
  "data": {
    "accountNo": "ACC-20260226-12345",
    "holderName": "John Doe",
    "previousBalance": 1000,
    "depositAmount": 5000,
    "newBalance": 6000,
    "timestamp": "2026-02-26T10:35:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Account does not exist"
}
```

---

### 4️⃣ Withdraw Funds
**Endpoint:** `POST /api/withdraw`

**Request Body:**
```json
{
  "accountNo": "ACC-20260226-12345",
  "amount": 1000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Withdrawal successful",
  "data": {
    "accountNo": "ACC-20260226-12345",
    "holderName": "John Doe",
    "previousBalance": 6000,
    "withdrawAmount": 1000,
    "newBalance": 5000,
    "timestamp": "2026-02-26T10:40:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Insufficient balance. Available: 500, Required: 1000"
}
```

---

### 5️⃣ Transfer Funds
**Endpoint:** `POST /api/transfer`

**Request Body:**
```json
{
  "senderAccountNo": "ACC-20260226-12345",
  "receiverAccountNo": "ACC-20260226-54321",
  "amount": 2000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "transactionId": "TXN-1740532800000",
    "senderAccount": {
      "accountNo": "ACC-20260226-12345",
      "holderName": "John Doe",
      "previousBalance": 5000,
      "newBalance": 3000
    },
    "receiverAccount": {
      "accountNo": "ACC-20260226-54321",
      "holderName": "Jane Smith",
      "previousBalance": 2000,
      "newBalance": 4000
    },
    "transferAmount": 2000,
    "timestamp": "2026-02-26T10:45:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Sender must be KYC verified to perform transfers"
}
```

---

## 🔍 Validation Rules

| Operation | Rules |
|-----------|-------|
| **Create Account** | • Name required<br>• Name min 3 characters<br>• Generates unique account number |
| **Deposit** | • Account must exist<br>• Amount > 0 |
| **Withdraw** | • Account must exist<br>• Amount > 0<br>• Sufficient balance |
| **Transfer** | • Both accounts must exist<br>• Sender ≠ Receiver<br>• Amount > 0<br>• Sender KYC verified<br>• Sufficient balance |

## 🎨 UI Pages

### 1. Create Account (`/create-account`)
- Input field for holder name
- KYC verification checkbox
- Form validation with disabled submit button
- Success panel with account details

### 2. Transactions (`/transactions`)
- Tab navigation: Deposit / Withdraw / Transfer
- Conditional form rendering based on active tab
- Alert messages for success/error
- Transaction summary panel

### 3. All Accounts (`/accounts`)
- Dashboard showing total accounts and system balance
- Responsive table with all account details
- KYC status badges
- Account creation date
- Refresh button

## 📦 Code Quality

✅ **Best Practices Implemented:**
- Centralized validation logic in `/lib/validations.js`
- No duplicated code - reusable components and functions
- Meaningful variable and function names
- Modular, reusable React components
- Proper error handling with try-catch blocks
- JSDoc comments for all functions
- Responsive design with Tailwind CSS
- Loading states and form validation

## 🚢 Deployment on Vercel

### Quick Deploy

1. **Push to GitHub**
```bash
git add .
git commit -m "Complete banking system implementation"
git push origin main
```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"

### Live URL
**Production URL:** https://banking-system-demo.vercel.app

### Demo Video
**Demo:** [Add your demo video link here]

## 🧪 Testing the Application

### Create Account
1. Navigate to `/create-account`
2. Enter name (minimum 3 characters)
3. Optionally check KYC Verified
4. Submit and copy the account number

### Make Deposit
1. Go to `/transactions` → Deposit tab
2. Enter account number from step above
3. Enter amount (e.g., 5000)
4. View updated balance

### Make Withdrawal
1. Go to `/transactions` → Withdraw tab
2. Enter same account number
3. Enter amount less than balance
4. View updated balance

### Make Transfer
1. Create 2 accounts (both with KYC verified)
2. Deposit funds into first account
3. Go to `/transactions` → Transfer tab
4. Enter both account numbers and amount
5. View transaction summary

### View All Accounts
1. Go to `/accounts`
2. See dashboard with statistics
3. View complete account table with all details

## 📝 Project Requirements Met

✅ All 4 API endpoints implemented with proper validations
✅ Singleton bank store using Map data structure
✅ Centralized validation logic
✅ Responsive UI with Tailwind CSS
✅ 3 main pages (Create, Transactions, Accounts)
✅ Proper error handling and HTTP status codes
✅ Transaction history tracking
✅ Dashboard with system statistics
✅ Production-quality, reviewer-friendly code
✅ Comprehensive README with API documentation
✅ Ready for Vercel deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Created:** February 26, 2026  
**Version:** 1.0.0  
**Author:** Banking System Team