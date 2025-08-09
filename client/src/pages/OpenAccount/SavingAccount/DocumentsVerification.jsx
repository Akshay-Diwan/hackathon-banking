import { useState, useRef } from "react";
import { useForm } from "../../../context/FormContext";
import toast from "react-hot-toast";
import AccountProgressTracker from "../../../components/AccountProgressTracker";
import { useNavigate } from "react-router-dom";

function DocumentVerification() {
  const { updateSection } = useForm();

  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtpVerified, setAadhaarOtpVerified] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    pan_number: "",
    aadhaar_number: "",
    pan: null,
    aadhaar: null,
    aadhaar_otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSendOtp = () => {
    if (!form.aadhaar_number || form.aadhaar_number.length < 12) {
      return toast.error("Enter valid Aadhaar number before sending OTP.");
    }
    setAadhaarOtpSent(true);
    toast.success("OTP sent to Aadhaar-linked mobile.");
  };

  const handleVerifyOtp = () => {
    setAadhaarOtpVerified(true);
    toast.success("Aadhaar OTP verified.");
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    const chars = paste.split("");
    chars.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleNext = () => {
    if (!aadhaarOtpVerified) {
      return toast.error("Please verify Aadhaar OTP first.");
    }

    // Save to context
    updateSection("documents", form);
    toast.success("Document data saved.");
    
    navigate("/new-account/basic-savings/address");
  };

  const handleBack = () => {
    navigate("/new-account/basic-savings/registration");
  };

  return (
    <div>
      <AccountProgressTracker currentStep={1} />
      <div className="max-w-3xl mb-4 mx-auto px-6 py-5 bg-white rounded-lg shadow-md border mt-3">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
          Document Verification
        </h2>

        {/* PAN Number */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700">
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pan_number"
            value={form.pan_number}
            onChange={handleChange}
            placeholder="ABCDE1234F"
            className="w-full mt-1 border rounded-md px-3 py-2"
          />
        </div>

        {/* Aadhaar Number */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700">
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aadhaar_number"
            value={form.aadhaar_number}
            onChange={handleChange}
            placeholder="1234 5678 9012"
            className="w-full mt-1 border rounded-md px-3 py-2"
          />
        </div>

        {/* Upload Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload PAN Scan Copy <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="pan"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mt-2 cursor-pointer border border-gray-600/30 p-2 rounded text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload Aadhaar Scan Copy <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="aadhaar"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mt-2 cursor-pointer border border-gray-600/30 p-2 rounded text-gray-600"
            />
          </div>
        </div>

        {/* Aadhaar OTP Section */}
        <div className="mb-6">
          {!aadhaarOtpSent ? (
            <button
              onClick={handleSendOtp}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send Aadhaar OTP
            </button>
          ) : (
            <div className="flex gap-10">
              <div className="flex justify-between mb-6 w-90" onPaste={handlePaste}>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      type="text"
                      maxLength="1"
                      key={index}
                      className="w-12 h-12 bg-[#970bfa] text-white text-center text-xl rounded-md"
                      ref={(e) => (inputRefs.current[index] = e)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                className="border h-12 cursor-pointer px-3 rounded shadow-2xl bg-amber-300 cursor-pointer hover:bg-amber-400"
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="fex justify-between mt-1">
          <button 
          onClick={handleBack}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentVerification;

