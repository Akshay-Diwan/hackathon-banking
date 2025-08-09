import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = ["#4f46e5", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const TransactionCategoryChart = () => {
  const { t } = useTranslation();

  // Data with translated category names
  const data = [
    { name: t("transactionCategories.food"), value: 3500 },
    { name: t("transactionCategories.rent"), value: 10000 },
    { name: t("transactionCategories.travel"), value: 2500 },
    { name: t("transactionCategories.shopping"), value: 4000 },
    { name: t("transactionCategories.bills"), value: 1800 },
    { name: t("transactionCategories.others"), value: 1200 },
  ];

  return (
    <div className="min-w-105 max-md:w-full m-2 mx-auto bg-blue-400/40 rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("transactionCategories.title")}
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="w-full md:w-1/2">
          <ul className="space-y-3">
            {data.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.name}
                </span>
                <span className="font-medium text-gray-900">₹{item.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionCategoryChart;
