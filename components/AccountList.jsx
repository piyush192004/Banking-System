"use client";

import { useState, useEffect } from "react";
import AlertBox from "./AlertBox";

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [stats, setStats] = useState({ totalAccounts: 0, totalBalance: 0 });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/accounts");
      const data = await response.json();

      if (data.success) {
        setAccounts(data.data);

        // Calculate stats
        let totalBalance = 0;
        data.data.forEach((account) => {
          totalBalance += account.balance;
        });
        setStats({
          totalAccounts: data.data.length,
          totalBalance: totalBalance,
        });
      } else {
        setAlert({ message: "Failed to fetch accounts", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "Error fetching accounts", type: "error" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Accounts</h2>
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className={`px-4 py-2 rounded font-medium text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <AlertBox
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium">Total Accounts</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalAccounts}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium">
              Total System Balance
            </p>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Accounts Table */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No accounts found. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Account Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Holder Name
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    KYC Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, index) => (
                  <tr
                    key={account.accountNo}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-gray-800 font-mono text-xs">
                      {account.accountNo}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {account.holderName}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      ${account.balance.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          account.isKYCVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.isKYCVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
