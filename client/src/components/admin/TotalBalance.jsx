import { Wallet, ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';
import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios'
import { useEffect } from 'react';

const overviewData = [
  {
    title: "Account Balance",
    value: "₹45,000",
    icon: <Wallet className="text-cyan-600" size={28} />,
    bg: "bg-gradient-to-r from-cyan-100 to-blue-100",
  },
  {
    title: "Monthly Spending",
    value: "₹18,200",
    icon: <TrendingUp className="text-red-500" size={28} />,
    bg: "bg-gradient-to-r from-red-100 to-pink-100",
  },
  {
    title: "Incoming Funds",
    value: "₹22,000",
    icon: <ArrowDown className="text-green-600" size={28} />,
    bg: "bg-gradient-to-r from-green-100 to-emerald-100",
  },
  {
    title: "Outgoing Funds",
    value: "₹18,200",
    icon: <ArrowUp className="text-yellow-600" size={28} />,
    bg: "bg-gradient-to-r from-yellow-100 to-orange-100",
  },
];

const TotalBalance = () => {
  axios.defaults.withCredentials = true;
  const [balance, setBalance] = useState('')
const {backendUrl} = useContext(AppContext)
//   useEffect( async ()=>{
//     const {data} = await axios.get(
//     backendUrl + '/getBalance',
//     {withCredentials : true}
//   )
//   setBalance(data.balance)
// }, [])
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
