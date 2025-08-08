import React, { useState } from "react";

const NetBankingPayment = () => {
  const [bank, setBank] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Redirecting to ${bank} Net Banking...`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="w-full p-3 rounded-lg border-gray-300"
        required
      >
        <option value="">Select Your Bank</option>
        <option value="SBI">State Bank of India</option>
        <option value="HDFC">HDFC Bank</option>
        <option value="ICICI">ICICI Bank</option>
      </select>
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Proceed to Bank
      </button>
    </form>
  );
}


export default NetBankingPayment;