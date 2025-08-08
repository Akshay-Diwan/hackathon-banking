import { useRef, useState } from "react";
import { useForm } from "../../../context/FormContext";
import AccountProgressTracker from "../../../components/AccountProgressTracker";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function CustomerRegistration() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyOpt, setverifyOtp] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  

  const { updateSection } = useForm(); // 👈 context update method

  // Local input state
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    code: "+91",
    mobile: "",
    email: "",
    pep: "",
    disabled: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleSendOtp = () => {
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!form.mobile || !phoneRegex.test(form.mobile)) {
    return toast.error("Enter a valid 10-digit Indian mobile number.");
  }

  setOtpSent(true);
  toast.success("OTP sent to your mobile number.");
};

 const handleVerifyOtp = () => {
  const enteredOtp = inputRefs.current.map(input => input?.value).join("");

  if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
    return toast.error("Please enter a valid 6-digit OTP.");
  }

  setOtp(enteredOtp); // optional: store it
  toast.success("OTP successfully verified");
  setverifyOtp(true);
};

  const handleNext = () => {

    const requiredFields = [
    "firstName",
    "lastName",
    "mobile",
    "email",
    "pep",
    "disabled",
  ];

  for (const field of requiredFields) {
    if (!form[field] || form[field].trim() === "") {
      return toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1')}`);
    }
  }

  if (!verifyOpt) {
    return toast.error("Please verify OTP before proceeding.");
  }
    
    updateSection("registration", form);
    toast.success("Customer registration saved!");
    navigate('/new-account/basic-savings/documents');
  };

  return (
    <div>
      <AccountProgressTracker currentStep={0} />
      <div className="max-w-3xl mb-2 mx-auto px-6 py-5 bg-white rounded-lg shadow-md border mt-3">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
          Customer Registration
        </h2>

        {/* Name Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {["firstName", "middleName", "lastName"].map((field, index) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700">
                {["First Name ", "Middle Name ", "Last Name "][index]}<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full mt-1 border rounded-md px-3 py-2"
                placeholder={["", "", ""][index]}
              />
            </div>
          ))}
        </div>

        {/* Mobile Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2"
              placeholder="9876543210"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 border rounded-md px-3 py-2"
            placeholder="example@email.com"
          />
        </div>

        {/* Politically Exposed / Disabled */}
        <div className="flex justify-between m-5 mx-1">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Are you a politically exposed person? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pep"
                  value="yes"
                  onChange={handleRadioChange}
                  className="accent-blue-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pep"
                  value="no"
                  onChange={handleRadioChange}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Are you a disabled person? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="disabled"
                  value="yes"
                  onChange={handleRadioChange}
                  className="accent-blue-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="disabled"
                  value="no"
                  onChange={handleRadioChange}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* OTP Section */}
        <div className="mb-6 ">
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          ) : (
            <div className="flex gap-10">
              <div
                className="flex justify-between mb-8 w-90"
                onPaste={handlePaste}
              >
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      type="text"
                      maxLength="1"
                      key={index}
                      required
                      className="w-12 h-12 bg-[#970bfa] text-white text-center text-xl rounded-md"
                      ref={(e) => (inputRefs.current[index] = e)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                className="border h-12 px-3 rounded shadow-2xl bg-amber-300 cursor-pointer hover:bg-amber-400"
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-1">
          <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegistration;
