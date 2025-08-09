import { CheckCircleIcon } from "lucide-react";
import React from "react";

import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-12 text-center transform transition-all hover:scale-[1.01]">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="w-20 h-20 text-emerald-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-4">
          Payment Successful 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for your payment! Your transaction has been completed successfully.
          A confirmation email has been sent to your registered email address.
        </p>

        {/* Transaction Details Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-5 mb-8 shadow-inner">
          <div className="flex justify-between py-1 text-gray-700">
            <span className="font-medium">Transaction ID:</span>
            <span>#TXN12345678</span>
          </div>
          <div className="flex justify-between py-1 text-gray-700">
            <span className="font-medium">Amount Paid:</span>
            <span>₹1,200.00</span>
          </div>
          <div className="flex justify-between py-1 text-gray-700">
            <span className="font-medium">Payment Method:</span>
            <span>UPI</span>
          </div>
          <div className="flex justify-between py-1 text-gray-700">
            <span className="font-medium">Date:</span>
            <span>Aug 8, 2025</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/admin")}
            className="bg-emerald-500 cursor-pointer hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-300"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/transactions")}
            className="bg-white cursor-pointer hover:bg-blue-500/20 border border-emerald-400 text-emerald-600 font-semibold py-3 px-6 rounded-xl shadow hover:shadow-md transition duration-300"
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
