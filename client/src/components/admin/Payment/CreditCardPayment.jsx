import React, { useState } from "react";

const CreditCardPayment = () => {
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Processing Credit Card payment...");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Card Number"
        value={card.number}
        onChange={(e) => setCard({ ...card, number: e.target.value })}
        className="w-full p-3 rounded-lg border-gray-300"
        required
      />
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="MM/YY"
          value={card.expiry}
          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
          className="w-1/2 p-3 rounded-lg border-gray-300"
          required
        />
        <input
          type="password"
          placeholder="CVV"
          value={card.cvv}
          onChange={(e) => setCard({ ...card, cvv: e.target.value })}
          className="w-1/2 p-3 rounded-lg border-gray-300"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Pay Now
      </button>
    </form>
  );
}

export default CreditCardPayment;