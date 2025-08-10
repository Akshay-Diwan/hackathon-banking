import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();

  // Messages to show during loading
  const messages = [
    "Verifying User...",
    "Connecting to Bank Servers...",
    "Processing Transaction Securely...",
    "Finalizing Payment...",
    "Generating Receipt..."
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    // Change messages every 1 second
    let index = 0;
    const msgInterval = setInterval(() => {
      index++;
      if (index < messages.length) {
        setCurrentMessage(messages[index]);
      }
    }, 1000);

    // After 5 seconds, redirect to success page
    const timer = setTimeout(() => {
      navigate("/admin/payment-transfer/payment-success");
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(msgInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">
      
      {/* Animated Banking Spinner */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-8 border-indigo-200 rounded-full"></div>
        <div className="absolute inset-0 border-8 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      {/* Banking Icon / Logo */}
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-indigo-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M4 6h16M5 14h14M6 18h12" />
      </svg>

      {/* Dynamic Message */}
      <p className="text-lg font-semibold text-gray-800 animate-fade">{currentMessage}</p>

      {/* Inline animation styles */}
      <style>
        {`
          @keyframes fade {
            0%, 100% { opacity: 0; transform: translateY(5px); }
            50% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade {
            animation: fade 1s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingPage;
