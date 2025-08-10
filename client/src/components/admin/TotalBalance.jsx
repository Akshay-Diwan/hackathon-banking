import { Wallet, ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TotalBalance = () => {
  const { t } = useTranslation();

  const overviewData = [
    {
      title: t('totalBalance.accountBalance'),
      value: "₹45,000",
      icon: <Wallet className="text-cyan-600" size={28} />,
      bg: "bg-gradient-to-r from-cyan-100 to-blue-100",
    },
    {
      title: t('totalBalance.monthlySpending'),
      value: "₹18,200",
      icon: <TrendingUp className="text-red-500" size={28} />,
      bg: "bg-gradient-to-r from-red-100 to-pink-100",
    },
    {
      title: t('totalBalance.incomingFunds'),
      value: "₹22,000",
      icon: <ArrowDown className="text-green-600" size={28} />,
      bg: "bg-gradient-to-r from-green-100 to-emerald-100",
    },
    {
      title: t('totalBalance.outgoingFunds'),
      value: "₹18,200",
      icon: <ArrowUp className="text-yellow-600" size={28} />,
      bg: "bg-gradient-to-r from-yellow-100 to-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
      {overviewData.map((item, index) => (
        <div
          key={index}
          className={`p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow h-35 duration-300 cursor-pointer ${item.bg}`}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-semibold">{item.title}</div>
            <div className="p-2 bg-white rounded-full shadow-inner">
              {item.icon}
            </div>
          </div>
          <div className="mt-4 text-2xl font-bold text-gray-800">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default TotalBalance;
