"use client";

import TransactionForm from "@/components/TransactionForm";

export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Banking System
          </h1>
          <p className="text-gray-600">Deposit, Withdraw, or Transfer funds</p>
        </div>
        <TransactionForm />
      </div>
    </main>
  );
}
