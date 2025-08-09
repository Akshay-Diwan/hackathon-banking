import React, { useState } from "react";
import AccountProgressTracker from "../../../components/AccountProgressTracker";
import { assets } from "../../../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BasicSaving = () => {
  const { t, i18n } = useTranslation();

  const [selectedOption, setSelectedOption] = useState("");
  const [agreeTnC, setAgreeTnC] = useState(true);
  const [agreeVcip, setAgreeVcip] = useState(true);
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const options = [
    t("basicSaving.options.vkyc"),
    t("basicSaving.options.convertToSB"),
    t("basicSaving.options.referFriend"),
    t("basicSaving.options.continueFlow"),
    t("basicSaving.options.referredByFriend"),
    t("basicSaving.options.completedVkyc"),
    t("basicSaving.options.videoInteraction"),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) {
      return toast.error(t("basicSaving.errors.selectOption"));
    }
    if (!agreeTnC || !agreeVcip) {
      return toast.error(t("basicSaving.errors.checkBoxRequired"));
    }
    navigate("/new-account/basic-savings/registration");
  };

  const changeLanguage = (lang, langLabel, toastMsg) => {
    setLanguage(langLabel);
    setLangOpen(false);
    i18n.changeLanguage(lang);
    toast.success(toastMsg);
  };

  return (
    <div>
      <AccountProgressTracker />
      <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row font-sans">
        {/* Sidebar of Landing Page */}
        <div className="bg-gradient-to-r from-[#0091ffe3] to-[#030889d1] text-white p-8 lg:w-1/3 flex flex-col justify-between">
          <div>
            <img src={assets.bankofmaha} alt="Bank Logo" className="w-full mb-6" />
            <h2 className="text-2xl font-bold mb-2">{t("basicSaving.sidebar.title")}</h2>
            <p className="text-lg">{t("basicSaving.sidebar.subtitle1")}</p>
            <p className="font-semibold mt-1">{t("basicSaving.sidebar.subtitle2")}</p>
          </div>

          <div className="mt-10">
            <img
              src="https://play-lh.googleusercontent.com/5pSuPY1RTSPQ10QSw3SVjsZCLuYCRvsqjHb1sZffLBYtZINNUXYXWxRitQbXVrYoT1Y=w240-h480-rw"
              alt={t("basicSaving.sidebar.chatbotAlt")}
              className="h-16 mt-2 rounded"
            />
          </div>
        </div>

        {/* Landing Page Form Section */}
        <div className="bg-white p-6 md:p-10 lg:w-2/3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">{t("basicSaving.welcome")}</h1>
            <div className="relative group">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center cursor-pointer gap-2 bg-gradient-to-tr from-blue-600 to-blue-400 text-white px-4 py-1.5 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              >
                🌐 {language}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Selector */}
              <div
                className={`absolute ${langOpen ? "block" : "hidden"} top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white shadow-xl border rounded-xl z-50 overflow-hidden text-sm`}
              >
                <button
                  onClick={() => changeLanguage("en", "English", "Language changed to English!")}
                  className="flex items-center cursor-pointer gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
                >
                  🇬🇧 <span>English</span>
                </button>
                <button
                  onClick={() => changeLanguage("hi", "हिंदी", "भाषा हिंदी में बदल दी गई है!")}
                  className="flex items-center cursor-pointer gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
                >
                  🇮🇳 <span>हिंदी</span>
                </button>
                <button
                  onClick={() => changeLanguage("mr", "मराठी", "भाषा मराठीत बदलली गेली आहे!")}
                  className="flex items-center cursor-pointer gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
                >
                  🇮🇳 <span>मराठी</span>
                </button>
                <button
                  onClick={() => changeLanguage("gu", "ગુજરાતી", "ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે!")}
                  className="flex items-center cursor-pointer gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
                >
                  🇮🇳 <span>ગુજરાતી</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 underline">{t("basicSaving.instructions.title")}</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>{t("basicSaving.instructions.aadhar")}</li>
              <li>
                {t("basicSaving.instructions.signature")}{" "}
                <span className="text-gray-500">{t("basicSaving.instructions.signatureNote")}</span>
              </li>
              <li>{t("basicSaving.instructions.mobile")}</li>
              <li>
                {t("basicSaving.instructions.panCard")}{" "}
                <span className="text-gray-500">{t("basicSaving.instructions.panNote")}</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              {t("basicSaving.buttons.userGuide")}
            </button>
            <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              {t("basicSaving.buttons.watchJourney")}
            </button>
          </div>

          {/* Radio Options */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {options.map((opt, idx) => (
              <label key={idx} className="block w-150 cursor-pointer">
                <input
                  type="radio"
                  name="purpose"
                  className="mr-2, cursor-pointer"
                  value={opt}
                  checked={selectedOption === opt}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                {opt}
              </label>
            ))}

            {/* Checkboxes */}
            <div className="mt-4 space-y-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 mr-2"
                  checked={agreeTnC}
                  onChange={() => setAgreeTnC(!agreeTnC)}
                />
                <span>
                  {t("basicSaving.terms.accept")}{" "}
                  <a href="#" className="text-blue-600 underline">
                    {t("basicSaving.terms.termsAndConditions")}
                  </a>
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 mr-2"
                  checked={agreeVcip}
                  onChange={() => setAgreeVcip(!agreeVcip)}
                />
                <span className="text-sm font-medium">{t("basicSaving.vcip.text")}</span>
              </label>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-700 hover:bg-blue-800 cursor-pointer text-white px-6 py-2 rounded text-base font-medium"
              >
                {t("basicSaving.buttons.letsStart")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicSaving;
