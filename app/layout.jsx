import './globals.css';

export const metadata = {
  title: 'Banking System',
  description: 'A complete banking system with account creation, deposits, withdrawals, and transfers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">🏦 Banking System</h1>
            <div className="space-x-4 flex">
              <a href="/create-account" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Create Account
              </a>
              <a href="/transactions" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Transactions
              </a>
              <a href="/accounts" className="text-gray-700 hover:text-blue-600 font-medium transition">
                All Accounts
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2026 Banking System. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
