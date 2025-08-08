import React, {useContext, useState} from "react";
import AdminTitle from "../../components/admin/AdminTitle";
import axios from "axios"
import { AppContext } from "../../context/AppContext";
const transactions = [
  {
    id: "txn1",
    name: "Amazon Order #1234",
    amount: 1200,
    type: "debit",
    date: "2025-08-02T14:20:00",
    paymentChannel: "upi",
    category: "Shopping",
    sharableId: "rohit@upi",
    bank: "Axis Bank",
    contact: "9876543210",
    party: "Amazon India",
  },
  {
    id: "txn2",
    name: "Salary Credit",
    amount: 50000,
    type: "credit",
    date: "2025-08-01T10:15:00",
    paymentChannel: "neft",
    category: "Income",
    sharableId: "bank-ac-XXXX1234",
    bank: "ICICI",
    contact: "HR Office",
    party: "Company Payroll",
  },
  {
    id: "txn3",
    name: "Electricity Bill",
    amount: 1500,
    type: "debit",
    date: "2025-07-30T18:00:00",
    paymentChannel: "bank",
    category: "Utilities",
    sharableId: "electricity@upi",
    bank: "SBI",
    contact: "Helpline 1912",
    party: "MSEB",
  },
  {
    id: "txn11",
    name: "Water Bill - Pune Municipal",
    amount: 850,
    type: "debit",
    date: "2025-07-25T12:30:00",
    paymentChannel: "bank",
    category: "Utilities",
    sharableId: "pune-municipal@upi",
    bank: "Bank of Maharashtra",
    contact: "1800-123-456",
    party: "PMC Water Dept",
  },
  {
    id: "txn12",
    name: "Rent Received - July",
    amount: 15000,
    type: "credit",
    date: "2025-07-01T09:00:00",
    paymentChannel: "neft",
    category: "Income",
    sharableId: "tenant123@upi",
    bank: "ICICI",
    contact: "Tenant - Ravi Sharma",
    party: "Ravi Sharma",
  },
  {
    id: "txn13",
    name: "Insurance Premium - LIC",
    amount: 4200,
    type: "debit",
    date: "2025-07-15T16:00:00",
    paymentChannel: "bank",
    category: "Insurance",
    sharableId: "licindia@upi",
    bank: "LIC India",
    contact: "022-6827-6827",
    party: "LIC of India",
  },
  {
    id: "txn14",
    name: "College Fees - COEP",
    amount: 35500,
    type: "debit",
    date: "2025-07-10T10:45:00",
    paymentChannel: "neft",
    category: "Education",
    sharableId: "coepfees@upi",
    bank: "HDFC Bank",
    contact: "020-25507000",
    party: "COEP Admin",
  },
  {
    id: "txn15",
    name: "Project Payment - Upwork",
    amount: 22000,
    type: "credit",
    date: "2025-07-22T14:20:00",
    paymentChannel: "imps",
    category: "Freelance",
    sharableId: "client456@upi",
    bank: "Axis Bank",
    contact: "Client - Sam Wilson",
    party: "Sam Wilson",
  },
  {
    id: "txn16",
    name: "Doctor Appointment - Apollo",
    amount: 1200,
    type: "debit",
    date: "2025-07-26T17:30:00",
    paymentChannel: "upi",
    category: "Health",
    sharableId: "apollohealth@upi",
    bank: "Kotak",
    contact: "1800-102-6464",
    party: "Apollo Clinics",
  },
  {
    id: "txn17",
    name: "Swiggy Food Order",
    amount: 540,
    type: "debit",
    date: "2025-08-02T21:05:00",
    paymentChannel: "upi",
    category: "Food",
    sharableId: "swiggy@upi",
    bank: "Paytm Bank",
    contact: "Swiggy Help",
    party: "Swiggy",
  },
  {
    id: "txn18",
    name: "Credit Card Payment - Axis",
    amount: 7500,
    type: "debit",
    date: "2025-08-01T11:55:00",
    paymentChannel: "bank",
    category: "Loan & EMI",
    sharableId: "axiscc@upi",
    bank: "Axis Bank",
    contact: "1800-419-5959",
    party: "Axis Credit Card",
  },
];

const removeSpecialCharacters = (text) => text.replace(/[^\w\s]/gi, "");

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getTransactionStatus = (date) => {
  const now = new Date();
  return date < now ? "Completed" : "Pending";
};

const formatDateTime = (date) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return {
    dateTime: new Date(date).toLocaleString("en-IN", options),
  };
};

const CategoryBadge = ({ category }) => {
  const colorMap = {
    Income: "bg-green-100 text-green-700",
    Shopping: "bg-blue-100 text-blue-700",
    Utilities: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${
        colorMap[category] || "bg-gray-100 text-gray-700"
      }`}
    >
      {category}
    </span>
  );
};

const Transactions = () => {
  axios.defaults.withCredentials = true
  const {backendUrl} = useContext(AppContext)
  useEffect(async ()=>{
    axios.get(
      backendUrl + 'history',
      {withCredentials: true}
    )
  }, [])
  return (
 
    <div>
      <AdminTitle text="Transaction history" description="Track and manage all your transactions securely. 
      View detailed payment history, transfer modes, and categorized spendings here."/>

    <table className="min-w-full mb-7 mt-10 text-sm border-collapse border border-gray-300/90">
      <thead className="bg-[#f9fafb]">
        <tr>
          <th className="px-2 py-5 text-left">Txn ID</th>
          <th className="px-2 py-5 text-left">Transaction</th>
          <th className="px-2 py-5 text-left">Amount</th>
          <th className="px-2 py-5 text-left">Status</th>
          <th className="px-2 py-5 text-left">Date</th>
          <th className="px-2 py-5 text-left max-md:hidden">Method</th>
          <th className="px-2 py-5 text-left max-md:hidden">Bank</th>
          <th className="px-2 py-5 text-left max-md:hidden">Contact</th>
          <th className="px-2 py-5 text-left max-md:hidden">Category</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatAmount(t.amount);
          const isDebit = t.type === "debit";

          return (
            <tr
              key={t.id}
              className={`${
                isDebit ? "bg-[#fbf5f4]" : "bg-[#ebfdf2]"
              } !border-b-DEFAULT`}
            >
              <td className="pl-2 pr-10 py-4 text-gray-500 font-medium">
                #{t.id}
              </td>

              <td className="max-w-[200px] pl-2 pr-10 py-2">
                <h1 className="text-14 truncate font-semibold text-[#344054]">
                  {removeSpecialCharacters(t.name)}
                </h1>
              </td>

              

              <td
                className={`pl-2 pr-10 py-2 font-semibold ${
                  isDebit ? "text-[#f04438]" : "text-[#039855]"
                }`}
              >
                {isDebit ? `-${amount}` : amount}
              </td>

              <td className="pl-2 pr-10 py-2">
                <CategoryBadge category={status} />
              </td>

              <td className="min-w-32 pl-2 pr-10 py-2">
                {formatDateTime(new Date(t.date)).dateTime}
              </td>

              <td className="pl-2 pr-10 py-2 capitalize max-md:hidden">
                {t.paymentChannel}
              </td>

              <td className="pl-2 pr-10 py-2 max-md:hidden">{t.bank}</td>

    

              <td className="pl-2 pr-10 py-2 max-md:hidden">
                {t.contact}
              </td>

              <td className="pl-2 pr-10 py-2 max-md:hidden">
                <CategoryBadge category={t.category} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
};

export default Transactions;
