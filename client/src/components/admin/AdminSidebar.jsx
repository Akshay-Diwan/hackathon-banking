import {
  LayoutDashboardIcon,
  UserCircleIcon,
  CreditCardIcon,
  BanknoteIcon,
  ArrowDownToLineIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  LandmarkIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';

const AdminSidebar = () => {
  const { t, i18n } = useTranslation();

  const [langOpen, setLangOpen] = useState(false);

  const user = {
    firstName: 'Rohit',
    lastName: 'Chavan',
    imageUrl: assets.avatar_icon,
  };

  const bankNavLinks = [
    { name: t('sidebar.dashboard'), path: '/admin', icon: LayoutDashboardIcon },
    { name: t('sidebar.myAccount'), path: '/admin/accounts', icon: UserCircleIcon },
    { name: t('sidebar.transactions'), path: '/admin/transactions', icon: ArrowDownToLineIcon },
    { name: t('sidebar.paymentTransfer'), path: '/admin/payment-transfer', icon: BanknoteIcon },
    { name: t('sidebar.manageCards'), path: '/admin/manage-cards', icon: CreditCardIcon },
    { name: t('sidebar.loanEmiInsurance'), path: '/admin/loan-emi', icon: LandmarkIcon },
    { name: t('sidebar.helpSupport'), path: '/admin/help-support', icon: HelpCircleIcon },
    { name: t('sidebar.logout'), path: '/', icon: LogOutIcon },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  return (
    <div className="h-[calc(100vh)] md:flex flex-col items-center bg-gradient-to-r from-[#040056] via-[#112fb1] to-[#0777c7f3] pt-8 max-w-13 md:max-w-60 w-full border-gray-300 border-r-4 text-sm relative">
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="sidebar"
      />
      <p className="mt-2 font-bold text-[16px] text-indigo-400 max-md:hidden">
        {user.firstName} {user.lastName}
      </p>

      {/* Language selector button */}
      <div className="relative mt-4 max-md:mb-6">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 focus:outline-none"
        >
          🌐 {i18n.language.toUpperCase()}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white shadow-xl border rounded-xl z-50 overflow-hidden text-sm ${
            langOpen ? 'block' : 'hidden'
          }`}
        >
          <button
            onClick={() => changeLanguage('en')}
            className="flex items-center gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className="flex items-center gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
          >
            🇮🇳 हिंदी
          </button>
          <button
            onClick={() => changeLanguage('mr')}
            className="flex items-center gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
          >
            🇮🇳 मराठी
          </button>
          <button
            onClick={() => changeLanguage('gu')}
            className="flex items-center gap-2 px-5 py-3 w-full text-left hover:bg-gray-100 transition-colors duration-200 text-gray-800"
          >
            🇮🇳 ગુજરાતી
          </button>
        </div>
      </div>

      <div className="w-full">
        {bankNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center md:px-4 gap-2 w-full py-2.5 text-gray-400 ${
                isActive && 'bg-blue-400/20  group'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.name}</p>
                <span
                  className={`w-1.5 h-10 rounded-1 right-0 absolute ${
                    isActive ? 'bg-blue-600' : ''
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
