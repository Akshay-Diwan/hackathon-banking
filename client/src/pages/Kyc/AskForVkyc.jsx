import React from "react";
import { CheckCircle } from "lucide-react"; // optional icon lib
import { useNavigate } from "react-router-dom";

const AskForVkyc = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fefcea] to-[#f1da36] px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-xl w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-yellow-200 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎉 Congratulations! 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          You have successfully completed the journey.
        </p>

        <p className="text-base font-medium text-gray-800 mb-6">
          <span className="font-semibold text-black">
            Your account number and other documents
          </span>{" "}
          will be issued after completing the video call with our Bank official.
        </p>

        <p className="text-gray-700 mb-8">
          Please schedule your video interaction with our Bank official.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
          onClick={() => navigate("/user-call")} 
          className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
            Call Now
          </button>
          <button
          onClick={() => navigate("/kyc/schedule-vkyc")} 
          className="border cursor-pointer border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-all">
            Schedule for Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskForVkyc;

