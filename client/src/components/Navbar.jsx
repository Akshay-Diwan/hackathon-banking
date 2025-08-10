import {
  LogOutIcon,
  MenuIcon,
  ShieldIcon,
  UserCircleIcon,
  XIcon,
  MailCheckIcon,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { setUserData, userData, setIsLoggedin } = useContext(AppContext);

  const navLinks = [
    { to: "/", key: "nav.home" },
    { to: "/about-us", key: "nav.aboutUs" },
    { to: "/locate-us", key: "nav.locateUs" },
    { to: "/careers", key: "nav.careers" },
    { to: "/contact-us", key: "nav.contactUs" },
  ];

  const langMap = {
    English: "en",
    हिंदी: "hi",
    मराठी: "mr",
    ગુજરાતી: "gu",
  };

  const handleLanguageChange = (langDisplayName) => {
    setLanguage(langDisplayName);
    i18n.changeLanguage(langMap[langDisplayName]);
    setLangOpen(false);

    const toastMessages = {
      English: "Language changed to English!",
      हिंदी: "भाषा हिंदी में बदल दी गई है!",
      मराठी: "भाषा मराठीत बदलली गेली आहे!",
      ગુજરાતી: "ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે!",
    };
    toast.success(toastMessages[langDisplayName]);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedin(false);
    navigate("/");
  };

  return (
    <div>
      <nav className="bg-white dark:bg-gray-800 fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center max-md:p-4 justify-between mx-auto p-4">
          <NavLink
            to="/"
            className="max-md:flex-1 ml-[-50px] flex items-center"
          >
            <img src={assets.bankofmaha} alt="Logo" className="w-47 h-15" />
          </NavLink>

          {/* Center nav links */}
          <div
            className={`max-md:absolute max-md:top-0 max-md:left-0 z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 
              max-md:h-screen min-md:rounded-full backdrop-blur bg-amber-50 md:bg-white/90 md:border border-gray-300/60 overflow-hidden 
              transition-all duration-300 ${
                isOpen
                  ? "max-md:w-full"
                  : "max-md:w-0 max-md:opacity-0 max-md:pointer-events-none"
              }`}
          >
            <XIcon
              className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />

            {navLinks.map(({ to, key }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                className={({ isActive }) =>
                  `hover:scale-105 transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 font-semibold underline underline-offset-4"
                      : ""
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-8 max-md:gap-1">
            {/* Language Selector */}
            <div className="relative group">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center cursor-pointer gap-2 bg-gradient-to-tr from-blue-600 to-blue-400 text-white px-4 py-1.5 max-md:px-1 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              >
                🌐 {language}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    langOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`absolute ${
                  langOpen ? "block" : "hidden"
                } top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white shadow-xl border rounded-xl z-50 overflow-hidden text-sm`}
              >
                {Object.keys(langMap).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className="flex items-center cursor-pointer gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
                  >
                    {lang === "English" && "🇬🇧"}
                    {lang === "हिंदी" && "🇮🇳"}
                    {lang === "मराठी" && "🇮🇳"}
                    {lang === "ગુજરાતી" && "🇮🇳"} <span>{lang}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile or Sign In */}
            {userData ? (
              <div
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="w-10 h-10 flex justify-center items-center max-md:ml-[-20px] rounded-full bg-gradient-to-tr from-[#841aee] to-[#dd00ff] text-white font-semibold text-lg cursor-pointer shadow-md hover:scale-110 transition-all duration-300 ease-in-out">
                  {userData.name[0].toUpperCase()}
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">
                        {t("profile.hello")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userData.email}
                      </p>
                    </div>

                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <a
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                        >
                          <UserCircleIcon className="w-4 h-4 text-blue-500" />
                          {t("profile.myProfile")}
                        </a>
                      </li>
                      <li>
                        <a
                          href="/admin/settings/security"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                        >
                          <ShieldIcon className="w-4 h-4 text-green-500" />
                          {t("profile.securitySettings")}
                        </a>
                      </li>

                      {!userData.isAccountVerified && (
                        <li>
                          <a
                            href="/admin/verify-email"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-50 text-yellow-600 font-medium"
                          >
                            <MailCheckIcon className="w-4 h-4" />
                            {t("profile.verifyEmail")}
                          </a>
                        </li>
                      )}
                    </ul>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        {t("profile.logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-white border-2 border-blue-700 max-md:w-20 max-md:h-10 max-md:p-0 shadow-[0_0_20px_rgba(165,152,224,0.5)] bg-gradient-to-r from-[#a40ffb] to-[#0b05b1] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 cursor-pointer py-2 text-center"
              >
                🔐 {t("nav.signIn")}
              </button>
            )}

            <MenuIcon
              className="bg-indigo-400 rounded-xl max-md:mr-[-10px] md:hidden w-8 h-5 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
