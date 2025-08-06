import {
  LayoutDashboardIcon,
  UserCircleIcon,
  CreditCardIcon,
  BanknoteIcon,
  ArrowDownToLineIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminSidebar = () => {
  const user = {
    firstName: 'Rohit',
    lastName: 'Chavan',
    imageUrl: assets.avatar_icon,
  };

  const bankNavLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'My Account', path: '/admin/accounts', icon: UserCircleIcon },
    { name: 'Transactions', path: '/admin/transactions', icon: ArrowDownToLineIcon },
    { name: 'Payment Transfer', path: '/admin/payment-transfer', icon: BanknoteIcon },
    { name: 'Cards & UPI', path: '/admin/cards', icon: CreditCardIcon },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
    { name: 'Help & Support', path: '/admin/help-support', icon: HelpCircleIcon },
    { name: 'Logout', path: '/logout', icon: LogOutIcon },
  ];

  return (
    <div className="h-[calc(100vh)] md:flex flex-col items-center bg-gradient-to-r from-[#040056] via-[#112fb1] to-[#0777c7f3] pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300 border-r-4 text-sm">
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="sidebar"
      />
      <p className="mt-2 font-bold text-[16px] text-indigo-400 max-md:hidden">
        {user.firstName} {user.lastName}
      </p>

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
                    isActive && ''
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

