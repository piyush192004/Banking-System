'use client';

import { useState } from 'react';
import AlertBox from './AlertBox';

export default function TransactionForm() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [formData, setFormData] = useState({
    accountNo: '',
    amount: '',
    senderAccountNo: '',
    receiverAccountNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [transactionResult, setTransactionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: '', type: '' });

    try {
      let endpoint = '';
      let body = {};

      if (activeTab === 'deposit') {
        endpoint = '/api/deposit';
        body = {
          accountNo: formData.accountNo,
          amount: parseFloat(formData.amount)
        };
      } else if (activeTab === 'withdraw') {
        endpoint = '/api/withdraw';
        body = {
          accountNo: formData.accountNo,
          amount: parseFloat(formData.amount)
        };
      } else if (activeTab === 'transfer') {
        endpoint = '/api/transfer';
        body = {
          senderAccountNo: formData.senderAccountNo,
          receiverAccountNo: formData.receiverAccountNo,
          amount: parseFloat(formData.amount)
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ message: data.message, type: 'success' });
        setTransactionResult(data.data);
        resetForm();
      } else {
        setAlert({ message: data.message, type: 'error' });
      }
    } catch (error) {
      setAlert({ message: 'Error processing transaction', type: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      accountNo: '',
      amount: '',
      senderAccountNo: '',
      receiverAccountNo: ''
    });
  };

  const isDepositWithdrawValid = formData.accountNo.trim().length > 0 && parseFloat(formData.amount) > 0;
  const isTransferValid = formData.senderAccountNo.trim().length > 0 &&
    formData.receiverAccountNo.trim().length > 0 &&
    parseFloat(formData.amount) > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction Management</h2>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b">
          {['deposit', 'withdraw', 'transfer'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                resetForm();
                setAlert({ message: '', type: '' });
              }}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AlertBox
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />

        {transactionResult ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Transaction Completed!</h3>
            {activeTab === 'transfer' ? (
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Transaction ID:</strong> {transactionResult.transactionId}</p>
                <div className="bg-white p-3 rounded">
                  <p className="font-medium mb-2">From Account:</p>
                  <p><strong>Account:</strong> {transactionResult.senderAccount.accountNo}</p>
                  <p><strong>Holder:</strong> {transactionResult.senderAccount.holderName}</p>
                  <p><strong>Previous Balance:</strong> ${transactionResult.senderAccount.previousBalance.toFixed(2)}</p>
                  <p className="text-green-600"><strong>New Balance:</strong> ${transactionResult.senderAccount.newBalance.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-medium mb-2">To Account:</p>
                  <p><strong>Account:</strong> {transactionResult.receiverAccount.accountNo}</p>
                  <p><strong>Holder:</strong> {transactionResult.receiverAccount.holderName}</p>
                  <p><strong>Previous Balance:</strong> ${transactionResult.receiverAccount.previousBalance.toFixed(2)}</p>
                  <p className="text-green-600"><strong>New Balance:</strong> ${transactionResult.receiverAccount.newBalance.toFixed(2)}</p>
                </div>
                <p><strong>Amount Transferred:</strong> ${transactionResult.transferAmount.toFixed(2)}</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Account:</strong> {transactionResult.accountNo}</p>
                <p><strong>Holder:</strong> {transactionResult.holderName}</p>
                <p><strong>Previous Balance:</strong> ${transactionResult.previousBalance.toFixed(2)}</p>
                <p><strong>Amount:</strong> ${(transactionResult.depositAmount || transactionResult.withdrawAmount).toFixed(2)}</p>
                <p className="text-green-600"><strong>New Balance:</strong> ${transactionResult.newBalance.toFixed(2)}</p>
              </div>
            )}
            <button
              onClick={() => {
                setTransactionResult(null);
                setAlert({ message: '', type: '' });
              }}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              New Transaction
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {(activeTab === 'deposit' || activeTab === 'withdraw') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    placeholder="e.g., ACC-20260226-12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            {activeTab === 'transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Account Number
                  </label>
                  <input
                    type="text"
                    name="senderAccountNo"
                    value={formData.senderAccountNo}
                    onChange={handleChange}
                    placeholder="e.g., ACC-20260226-12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receiver Account Number
                  </label>
                  <input
                    type="text"
                    name="receiverAccountNo"
                    value={formData.receiverAccountNo}
                    onChange={handleChange}
                    placeholder="e.g., ACC-20260226-54321"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={
                (activeTab !== 'transfer' && !isDepositWithdrawValid) ||
                (activeTab === 'transfer' && !isTransferValid) ||
                loading
              }
              className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
                ((activeTab !== 'transfer' && isDepositWithdrawValid) ||
                  (activeTab === 'transfer' && isTransferValid)) &&
                !loading
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? `Processing ${activeTab}...` : `Confirm ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
