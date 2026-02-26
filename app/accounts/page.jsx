"use client";

import AccountList from "@/components/AccountList";

export default function AccountsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Banking System
          </h1>
          <p className="text-gray-600">View and manage all accounts</p>
        </div>
        <AccountList />
      </div>
    </main>
  );
}
