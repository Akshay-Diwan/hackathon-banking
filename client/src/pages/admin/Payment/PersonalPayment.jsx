import React, { useState, useContext } from 'react';
import AdminTitle from '../../../components/admin/AdminTitle';
import axios from 'axios'
import { AppContext } from '../../../context/AppContext';
const PersonalPayment = () => {
  axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiver_account_number: '',
    ifsc: '',
    amount: '',
    payment_method: 'UPI',
    message: '',
    otp: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const {backendUrl} = useContext(AppContext)
    await axios.post(
      backendUrl + '/transfer',
      formData,
      {withCredentials : true}
    )
     await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Form submitted:', formData);

    setIsLoading(false);// trigger parent logic
  };
  const sendOtp = async () => {
    await axios.get(
      backendUrl + '/requestOtp',
      formData,
      {withCredentials : true}
    )
  }

  return (
    <div>
        <AdminTitle text="Personal Payment" description="  Easily transfer money to your friends using secure and instant banking options. Fill in the recipient's details, choose your preferred transfer method (UPI, NEFT, IMPS, or RTGS), and confirm the transaction with a one-time password (OTP). All transfers are encrypted and protected for your safety. Whether you're sending a small gift or splitting a bill, this form ensures fast and reliable money transfers.
"/>
    <form onSubmit={handleSubmit} className="max-w-3xl mx-3 p-6 bg-white rounded-xl space-y-4">
     
        
        <div className="space-y-4 border border-gray-300 p-5 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recipient Details</h3>
        
      {/* <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Full Name :-</label>
        <input name="friendName" value={formData.friendName} onChange={handleChange}
          required className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="e.g. Rahul Sharma" />
      </div> */}

      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Account No :-</label>
        <input name="accountOrUpi" value={formData.accountOrUpi} onChange={handleChange}
          required className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="rahul@upi or 1234567890" />
      </div>
{/* 
      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Bank Name :-</label>
        <input name="bankName" value={formData.bankName} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="e.g. HDFC Bank" />
      </div> */}

      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">IFSC Code :-</label>
        <input name="ifsc" value={formData.ifsc} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="HDFC0001234" />
      </div>

      {/* <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Email / Mobile :-</label>
        <input name="contact" value={formData.contact} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="+91XXXXXXXXXX or email" />
      </div> */}
      </div>

      <hr className="text-gray-400  w-312 mx-[-20px]" />

      <div className="space-y-4 border border-gray-300 p-5 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Transaction Details</h3>


      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Amount :-</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange}
          required min={1} className="input w-full p-2 px-3 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="₹1000" />
      </div>

      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Transfer Type :-</label>
        <select name="transferType" value={formData.transferType} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded ">
          <option value="UPI">UPI</option>
          <option value="NEFT">NEFT</option>
          <option value="IMPS">IMPS</option>
          <option value="RTGS">RTGS</option>
        </select>
      </div>

      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Message :-</label>
        <input name="message" value={formData.message} onChange={handleChange}
          maxLength={50} className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="e.g. Rent for August" />
      </div>

      {/* <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Transfer Mode :-</label>
        <select name="transferMode" value={formData.transferMode} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded ">
          <option value="instant">Instant</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div> */}

      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Enter OTP :-</label>
        <input name="otp" value={formData.otp} onChange={handleChange}
          required className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="Enter 6-digit OTP" />
          <button onClick={sendOtp} className="w-40 p-[7.3px] border rounded border-amber-600 cursor-pointer bg-amber-500 ">
            <span className='ml-auto'>Request Otp</span>
          </button>
      </div>

      </div>

      <button
  type="submit"
  disabled={isLoading}
  className={`w-full py-3 text-white rounded-md font-medium transition-colors cursor-pointer duration-200 
    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
  {isLoading ? (
    <span className="flex justify-center items-center gap-2">
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Sending...
    </span>
  ) : 'Send Money'}
</button>

    </form>
    </div>
  );
};

export default PersonalPayment;
