import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UpiPayment from "../../../components/admin/Payment/UpiPayment";
import CreditCardPayment from "../../../components/admin/Payment/CreditCardPayment";
import DebitCardPayment from "../../../components/admin/Payment/DebitCardPayment";
import NetBankingPayment from "../../../components/admin/Payment/NetBankingPayment";
import PersonalPayment from "./PersonalPayment";
import { useTranslation } from "react-i18next";

export default function PaymentOptions() {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);

  const paymentMethods = [
    { name: "upi", icon: "💰", component: <UpiPayment /> },
    { name: "creditCard", icon: "💳", component: <CreditCardPayment /> },
    { name: "debitCard", icon: "🏦", component: <DebitCardPayment /> },
    { name: "netBanking", icon: "🌐", component: <NetBankingPayment /> },
    { name: "neftRtgs", icon: "📱", component: <PersonalPayment /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {!selectedOption ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-center mb-8">
                {t("paymentOptions.chooseMethod")}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.name}
                    onClick={() => setSelectedOption(method.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition"
                  >
                    <div className="text-5xl mb-4">{method.icon}</div>
                    <h2 className="text-xl font-semibold">
                      {t(`paymentOptions.methods.${method.name}`)}
                    </h2>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-lg rounded-2xl p-6"
            >
              <button
                onClick={() => setSelectedOption(null)}
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                ← {t("paymentOptions.back")}
              </button>
              <h2 className="text-2xl font-bold mb-4">
                {t(`paymentOptions.methods.${selectedOption}`)} {t("paymentOptions.payment")}
              </h2>
              {paymentMethods.find((m) => m.name === selectedOption).component}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
