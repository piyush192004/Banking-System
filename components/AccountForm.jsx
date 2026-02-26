"use client";

import { useState } from "react";
import AlertBox from "./AlertBox";

export default function AccountForm() {
  const [formData, setFormData] = useState({
    holderName: "",
    isKYCVerified: false,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [createdAccount, setCreatedAccount] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "" });

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ message: data.message, type: "success" });
        setCreatedAccount(data.data);
        setFormData({ holderName: "", isKYCVerified: false });
      } else {
        setAlert({ message: data.message, type: "error" });
      }
    } catch (error) {
      setAlert({ message: "Error creating account", type: "error" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.holderName.trim().length >= 3;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Bank Account
        </h2>

        <AlertBox
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />

        {createdAccount ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Account Created Successfully!
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Account Number:</strong> {createdAccount.accountNo}
              </p>
              <p>
                <strong>Holder Name:</strong> {createdAccount.holderName}
              </p>
              <p>
                <strong>Initial Balance:</strong> $
                {createdAccount.balance.toFixed(2)}
              </p>
              <p>
                <strong>KYC Verified:</strong>{" "}
                {createdAccount.isKYCVerified ? "Yes" : "No"}
              </p>
            </div>
            <button
              onClick={() => {
                setCreatedAccount(null);
                setAlert({ message: "", type: "" });
              }}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Create Another Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holder Name
              </label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleChange}
                placeholder="Enter full name (minimum 3 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="kycVerified"
                name="isKYCVerified"
                checked={formData.isKYCVerified}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="kycVerified"
                className="text-sm text-gray-700 cursor-pointer"
              >
                KYC Verified
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
                isFormValid && !loading
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
