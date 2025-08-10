import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UpiPayment = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const validateUpiId = (id) => {
    // Basic regex for UPI ID format: something@bank
    const upiRegex = /^[\w.-]+@[\w]+$/;
    return upiRegex.test(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateUpiId(upiId)) {
      alert("Please enter a valid UPI ID");
      return;
    }
    if (Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    // Proceed with payment logic or navigation
    navigate("/loading"); // Redirect to loading page or payment processing page
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <label className="block">
        <span className="text-gray-700 font-medium">UPI ID</span>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="example@upi"
          className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300"
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Amount (₹)</span>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300"
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Note (Optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Payment note"
          className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300"
        />
      </label>

      <button
        type="submit"
        className="w-full cursor-pointer py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Pay Now
      </button>
    </form>
  );
};

export default UpiPayment;
