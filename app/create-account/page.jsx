"use client";

import AccountForm from "@/components/AccountForm";

export default function CreateAccountPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Banking System
          </h1>
          <p className="text-gray-600">Create and manage your bank account</p>
        </div>
        <AccountForm />
      </div>
    </main>
  );
}
