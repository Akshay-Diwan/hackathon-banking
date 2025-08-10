import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SavingAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const savingTypes = [
    {
      id: "basic-savings",
      name: t("savingAccount.basicSavings.name"),
      minBalance: t("savingAccount.basicSavings.minBalance"),
      description: t("savingAccount.basicSavings.description"),
    },
    {
      id: "lok-bachat",
      name: t("savingAccount.lokBachat.name"),
      minBalance: t("savingAccount.lokBachat.minBalance"),
      description: t("savingAccount.lokBachat.description"),
    },
    {
      id: "yuva-yojana",
      name: t("savingAccount.yuvaYojana.name"),
      minBalance: t("savingAccount.yuvaYojana.minBalance"),
      description: t("savingAccount.yuvaYojana.description"),
    },
    {
      id: "royal-savings",
      name: t("savingAccount.royalSavings.name"),
      minBalance: t("savingAccount.royalSavings.minBalance"),
      description: t("savingAccount.royalSavings.description"),
    },
    {
      id: "purple-savings",
      name: t("savingAccount.purpleSavings.name"),
      minBalance: t("savingAccount.purpleSavings.minBalance"),
      description: t("savingAccount.purpleSavings.description"),
    },
    {
      id: "smart-sb",
      name: t("savingAccount.smartSB.name"),
      minBalance: t("savingAccount.smartSB.minBalance"),
      description: t("savingAccount.smartSB.description"),
    },
    {
      id: "salary-account",
      name: t("savingAccount.salaryAccount.name"),
      minBalance: t("savingAccount.salaryAccount.minBalance"),
      description: t("savingAccount.salaryAccount.description"),
    },
  ];

  return (
    <div className="p-8 max-w-4xl mt-20 mx-auto space-y-8">
      <h1 className="text-3xl text-blue-500 font-bold">{t("savingAccount.heading")}</h1>
      <p>{t("savingAccount.subheading")}</p>

      <div className="space-y-6">
        {savingTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => navigate(`/new-account/${type.id}`)}
            className="bg-white group hover:shadow-lg p-6 rounded-lg shadow cursor-pointer"
          >
            <h2 className="text-2xl group-hover:text-blue-600 font-semibold mb-2">{type.name}</h2>
            <p className="text-gray-700 mb-1">
              <strong>{t("savingAccount.minBalanceLabel")}:</strong> {type.minBalance}
            </p>
            <p className="text-gray-600">{type.description}</p>
          </div>
        ))}
      </div>

      <section className="pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-2">{t("savingAccount.commonDetails.heading")}</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>{t("savingAccount.commonDetails.applicableInterest")}</li>
          <li>{t("savingAccount.commonDetails.eligibility")}</li>
          <li>{t("savingAccount.commonDetails.documentsNeeded")}</li>
          <li>{t("savingAccount.commonDetails.balanceCharges")}</li>
        </ul>
      </section>

      <section className="pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-2">{t("savingAccount.additionalServices.heading")}</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>{t("savingAccount.additionalServices.fixedDeposit")}</li>
          <li>{t("savingAccount.additionalServices.nriSavings")}</li>
        </ul>
      </section>
    </div>
  );
};

export default SavingAccount;
