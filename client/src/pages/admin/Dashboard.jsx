import React from 'react';
import BalanceOverTime from '../../components/admin/BalanceOverTime';
import AdminTitle from '../../components/admin/AdminTitle';
import TotalBalance from '../../components/admin/TotalBalance';
import TransactionCategoryChart from '../../components/admin/TransactionCategoryChart';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  const transactions = [
    {
      id: 1,
      type: "Credit",
      description: "Salary for August",
      date: "2025-08-01",
      amount: 50000,
    },
    {
      id: 2,
      type: "Debit",
      description: "Electricity Bill",
      date: "2025-08-03",
      amount: 3000,
    },
    {
      id: 3,
      type: "Debit",
      description: "Grocery Store",
      date: "2025-08-05",
      amount: 2500,
    },
    {
      id: 4,
      type: "Credit",
      description: "Refund from Amazon",
      date: "2025-08-06",
      amount: 1500,
    },
    {
      id: 5,
      type: "Debit",
      description: "Movie Tickets",
      date: "2025-08-07",
      amount: 800,
    },
  ];

  return (
    <div className="mb-10">
      <AdminTitle text={t('dashboard.title')} description={t('dashboard.description')} />
      <div className="border flex m-3 p-1 gap-4 max-md:flex-col rounded-2xl border-gray-400/70">
        <BalanceOverTime />
        <TransactionCategoryChart />
        <div className="m-3 my-auto max-md:mb-3">
          <TotalBalance />
        </div>
      </div>

      <div className="flex gap-10 justify-between m-10">
        <div className="max-w-md w-110 bg-white rounded-lg shadow-md p-6 font-sans text-gray-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">{t('dashboard.lastTransactions')}</h2>
            <a
              href="#"
              className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              {t('dashboard.viewMore')}
            </a>
          </div>
          <ul>
            {transactions.map(({ id, type, description, date, amount }) => (
              <li
                key={id}
                className="flex justify-between items-center border-b border-gray-200 py-3 last:border-b-0"
              >
                <div className="max-w-[60%]">
                  <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    {t(`dashboard.transactionTypes.${type.toLowerCase()}`)}
                  </span>
                  <p className="truncate">{description}</p>
                </div>
                <div className="flex flex-col items-end min-w-[120px]">
                  <span className="text-xs text-gray-400 mb-1">{date}</span>
                  <span
                    className={`font-semibold ${
                      type === "Credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {type === "Credit" ? "+" : "-"}₹{amount.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-md:mx-auto w-120">
          <div className="bg-blue-950 rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              🔗 {t('dashboard.linkedServices.title')}
            </h2>

            {/* Aadhaar Linking */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{t('dashboard.linkedServices.aadhaar.title')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.linkedServices.aadhaar.desc')}</p>
              </div>
              <button className="px-4 py-1.5 cursor-pointer rounded-md bg-green-100 text-green-700 font-semibold text-sm hover:bg-green-200">
                {t('dashboard.linkedServices.linked')}
              </button>
            </div>

            {/* Mobile Linking */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{t('dashboard.linkedServices.mobile.title')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.linkedServices.mobile.desc')}</p>
              </div>
              <button className="px-4 py-1.5 cursor-pointer rounded-md bg-green-100 text-green-700 font-semibold text-sm hover:bg-green-200">
                {t('dashboard.linkedServices.linked')}
              </button>
            </div>

            {/* Net Banking */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{t('dashboard.linkedServices.netBanking.title')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.linkedServices.netBanking.desc')}</p>
              </div>
              <button className="px-[19px] cursor-pointer py-[4px] rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">
                {t('dashboard.linkedServices.netBanking.manage')}
              </button>
            </div>

            {/* Debit Card */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{t('dashboard.linkedServices.debitCard.title')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.linkedServices.debitCard.desc')}</p>
              </div>
              <button className="px-3 cursor-pointer text-[16px] py-[4px] rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">
                {t('dashboard.linkedServices.debitCard.viewCard')}
              </button>
            </div>

            {/* UPI Linked */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{t('dashboard.linkedServices.upiHandles.title')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.linkedServices.upiHandles.desc')}</p>
              </div>
              <button className="px-2 bg-amber-600 py-[5px] rounded-md text-[15px] text-gray-700 dark:text-white font-medium hover:bg-amber-600/90 cursor-pointer ">
                {t('dashboard.linkedServices.upiHandles.manageUPI')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
