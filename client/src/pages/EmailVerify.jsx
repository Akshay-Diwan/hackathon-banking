import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const [isLoading, setIsLoading] = useState(false);


  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const inputRefs = useRef([]);

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

  const onSubmitHandler = async (e) => {
    setIsLoading(true);
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/createUser/verification/phone",
        { otp }, { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/new-account/basic-savings/documents");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
    setIsLoading(false);
  }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center bg-gradient-to-r from-[#05a2f7] to-[#0307ee] bg-cover bg-center justify-center min-h-screen bg-gradient-to-br">
     <div className="absolute top-5 w-full flex justify-center sm:justify-start px-5">
  <img
    onClick={() => navigate("/")}
    src={assets.bankofmaha}
    alt="logo"
    className="w-80 max-md:w-72 cursor-pointer"
  />
</div>

      <form
        onSubmit={onSubmitHandler}
        className="border-2 p-10 rounded-lg shadow-[0_0_20px_rgba(255,62,200,0.3)] w-full sm:w-96 text-indigo-300 backdrop-blur-md bg-indigo-400/50 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          OTP Verfication ✅
        </h1>
        <p className="text-center mb-6 font-bold text-indigo-200">
          Enter the 6-digit code sent to your email id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input type="text" maxLength="1" key={index} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" ref={(e) => (inputRefs.current[index] = e)} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button 
          disabled={isLoading}
          className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full transition-all duration-200 
          ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

      </form>
    </div>
  );
};

export default EmailVerify;
