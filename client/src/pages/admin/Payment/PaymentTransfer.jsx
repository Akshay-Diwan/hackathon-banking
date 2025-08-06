import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  School,
  Building2,
  HeartHandshake,
  Landmark,
  Store,
  Users,
  HandCoins
} from "lucide-react";
import AdminTitle from "../../../components/admin/AdminTitle";

const PaymentTransfer = () => {
  const [formData, setFormData] = useState({
    senderBank: "",
    name: "",
    email: "",
    sharableId: "",
    amount: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const categories = [
  {
    id: "education",
    label: "Education",
    description: "School, college fees or academic payments.",
    Icon: School,
  },
  {
    id: "utility",
    label: "Utilities",
    description: "Electricity, water, gas, society charges.",
    Icon: Building2,
  },
  {
    id: "religious",
    label: "Religious / NGO",
    description: "Mandir donations or NGO contributions.",
    Icon: HeartHandshake,
  },
  {
    id: "govt",
    label: "Government / PSU",
    description: "Pay state or central government fees.",
    Icon: Landmark,
  },
  {
    id: "merchant",
    label: "Business / Merchant",
    description: "Shopkeepers, tuition classes, small vendors.",
    Icon: Store,
  },
  {
    id: "personal",
    label: "Friends / Family",
    description: "Send money to personal contacts.",
    Icon: Users,
  },
  ];
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const accounts = [
    { id: "bank1", name: "Bank of Maharashtra" },
    { id: "bank2", name: "State Bank of India" },
    { id: "bank3", name: "Axis Bank" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Dummy delay to simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert("Funds transferred successfully!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div>
       <AdminTitle text="Payment Transfer" description=" Experience seamless and secure fund transfers for all purposes — personal, educational, professional, or social.
         From tuition fees to monthly rent, handle every transaction with confidence and clarity."/>
    {/*<form onSubmit={handleSubmit} className="flex flex-col">
      <div className="border-t border-gray-200 payment-transfer_form-item pb-6 pt-5">
        <div className="payment-transfer_form-content">
          <label className="text-14 font-medium text-gray-700">
            Select Source Bank
          </label>
          <p className="text-12 font-normal text-gray-600">
            Select the bank account you want to transfer funds from
          </p>
        </div>
        <div className="flex w-full flex-col">
          <select
            name="senderBank"
            value={formData.senderBank}
            onChange={handleChange}
            className="!w-full input-class"
          >
            <option value="">Select Bank</option>
            {accounts.map((acc, idx) => (
              <option key={idx} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
          {errors.senderBank && (
            <span className="text-12 text-red-500">{errors.senderBank}</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 payment-transfer_form-item pb-6 pt-5">
        <div className="payment-transfer_form-content">
          <label className="text-14 font-medium text-gray-700">
            Transfer Note (Optional)
          </label>
          <p className="text-12 font-normal text-gray-600">
            Please provide any additional information or instructions related to
            the transfer
          </p>
        </div>
        <div className="flex w-full flex-col">
          <textarea
            name="name"
            placeholder="Write a short note here"
            className="input-class"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="text-12 text-red-500">{errors.name}</span>
          )}
        </div>
      </div>

      <div className="payment-transfer_form-details">
        <h2 className="text-18 font-semibold text-gray-900">
          Bank account details
        </h2>
        <p className="text-16 font-normal text-gray-600">
          Enter the bank account details of the recipient
        </p>
      </div>

      <div className="border-t border-gray-200 payment-transfer_form-item py-5">
        <label className="text-14 w-full max-w-[280px] font-medium text-gray-700">
          Recipient&apos;s Email Address
        </label>
        <div className="flex w-full flex-col">
          <input
            type="email"
            name="email"
            placeholder="ex: johndoe@gmail.com"
            className="input-class"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-12 text-red-500">{errors.email}</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 payment-transfer_form-item pb-5 pt-6">
        <label className="text-14 w-full max-w-[280px] font-medium text-gray-700">
          Receiver&apos;s Plaid Sharable Id
        </label>
        <div className="flex w-full flex-col">
          <input
            name="sharableId"
            placeholder="Enter the public account number"
            className="input-class"
            value={formData.sharableId}
            onChange={handleChange}
          />
          {errors.sharableId && (
            <span className="text-12 text-red-500">{errors.sharableId}</span>
          )}
        </div>
      </div>

      <div className="border-y border-gray-200 payment-transfer_form-item py-5">
        <label className="text-14 w-full max-w-[280px] font-medium text-gray-700">
          Amount
        </label>
        <div className="flex w-full flex-col">
          <input
            name="amount"
            placeholder="ex: 5.00"
            className="input-class"
            value={formData.amount}
            onChange={handleChange}
          />
          {errors.amount && (
            <span className="text-12 text-red-500">{errors.amount}</span>
          )}
        </div>
      </div>

      <div className="payment-transfer_btn-box">
        <button type="submit" className="payment-transfer_btn">
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span> &nbsp; Sending...
            </>
          ) : (
            "Transfer Funds"
          )}
        </button>
      </div>
    </form>
*/}


    <div className="flex justify-center items-center gap-2 text-blue-600 mt-10">
        <HandCoins size={28} strokeWidth={2.2} />
        <span className="text-xl font-medium tracking-wide">Choose Category</span>
      </div>


  <div className="p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map(({ id, label, description, Icon }, index) => {
    // Rotate through colors
    const shadowColors = ["shadow-pink-200", "shadow-blue-200", "shadow-green-200", "shadow-yellow-200", "shadow-indigo-200", "shadow-red-200"];
    const borderColors = ["border-pink-500", "border-blue-500", "border-orange-500 ", "border-yellow-500", "border-indigo-500", "border-red-500"];
    const colorClass = shadowColors[index % shadowColors.length];
    const borderColor = borderColors[index % borderColors.length];

    return (
      <div
        key={id}
        onClick={() => {
           setSelectedCategory(id); 
           navigate(`/admin/payment-transfer/${id}`); 
         }}
        className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]
          bg-white shadow-md hover:shadow-xl hover:${colorClass} 
          ${selectedCategory === id ? `${borderColor} shadow-[${borderColor}]` : "border-gray-300"}
        `}
      >
        <div className="flex justify-center mb-4">
          <Icon size={44} className="text-blue-600 group-hover:animate-pulse transition-transform duration-300" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {label}
        </h3>
        <p className="text-sm text-gray-600 mt-2 text-center group-hover:text-gray-800">
          {description}
        </p>
      </div>
    );
  })}
</div>

  
    
    <div className="text-center mt-2 mb-10">
      <p className="text-gray-600 mt-2 text-base max-w-xl mx-auto leading-relaxed">
        We support a wide range of transactions — from tuition fees to donations, from rent to regular bill payments.
        Select the category that best fits your purpose and proceed with ease.
      </p>
    </div>


    </div>
  );
};

export default PaymentTransfer;
