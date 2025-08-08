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
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminSidebar = () => {
  const location = useLocation();

  const user = {
    firstName: 'Rohit',
    lastName: 'Chavan',
    imageUrl: assets.avatar_icon,
  };

  const bankNavLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'My Account', path: '/admin/accounts', icon: UserCircleIcon },
    { name: 'Transactions', path: '/admin/transactions', icon: ArrowDownToLineIcon },
    { name: 'Payment Transfer', path: '/admin/payment-transfer', icon: BanknoteIcon, hasSubMenu: true },
    { name: 'Manage Cards', path: '/admin/manage-cards', icon: CreditCardIcon },
    { name: 'Loan, EMI & Insurance', path: '/admin/loan-emi', icon: LandmarkIcon },
    { name: 'Help & Support', path: '/admin/help-support', icon: HelpCircleIcon },
    { name: 'Logout', path: '/logout', icon: LogOutIcon },
  ];

  const paymentSubLinks = [
    { name: 'UPI', path: '/admin/payment-transfer/upi' },
    { name: 'Card Payment', path: '/admin/payment-transfer/card' },
    { name: 'Bank Transfer', path: '/admin/payment-transfer/bank' },
  ];

  // State for collapsible menu
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Auto-open Payment Transfer if current route matches
  useEffect(() => {
    if (location.pathname.startsWith('/admin/payment-transfer')) {
      setIsPaymentOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="h-[calc(100vh)] md:flex flex-col items-center bg-gradient-to-r from-[#040056] via-[#112fb1] to-[#0777c7f3] pt-8 max-w-13 md:max-w-60 w-full border-gray-300 border-r-4 text-sm">
      {/* User */}
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="sidebar"
      />
      <p className="mt-2 font-bold text-[16px] text-indigo-400 max-md:hidden">
        {user.firstName} {user.lastName}
      </p>

      {/* Nav Links */}
      <div className="w-full">
        {bankNavLinks.map((link, index) => {
          if (link.hasSubMenu) {
            return (
              <div key={index}>
                <button
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                  className={`relative flex items-center max-md:justify-center md:px-4 gap-2 w-full py-2.5 text-gray-400 hover:bg-blue-400/20 transition ${
                    location.pathname.startsWith('/admin/payment-transfer') ? 'bg-blue-400/20' : ''
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <p className="max-md:hidden">{link.name}</p>
                </button>

                {/* Sub Links */}
                {isPaymentOpen && (
                  <div className="ml-8 flex flex-col border-l border-blue-300">
                    {paymentSubLinks.map((sub, i) => (
                      <NavLink
                        key={i}
                        to={sub.path}
                        className={({ isActive }) =>
                          `py-2 pl-4 text-gray-300 hover:text-white hover:bg-blue-400/20 transition ${
                            isActive ? 'text-white font-medium bg-blue-400/30' : ''
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <NavLink
                key={index}
                to={link.path}
                end
                className={({ isActive }) =>
                  `relative flex items-center max-md:justify-center md:px-4 gap-2 w-full py-2.5 text-gray-400 hover:bg-blue-400/20 transition ${
                    isActive && 'bg-blue-400/20'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.name}</p>
              </NavLink>
            );
          }
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
