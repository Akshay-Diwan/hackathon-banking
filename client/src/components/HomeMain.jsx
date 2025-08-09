import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useTranslation } from "react-i18next";
import Quiz from './Quiz';

const HomeMain = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    { id: 'new-account',       name: t('home.features1.newAccount.name'),       icon: '🆕', color: 'bg-orange-500', description: t('home.features1.newAccount.desc') },
    { id: 'internet-banking',  name: t('home.features1.internetBanking.name'),  icon: '💻', color: 'bg-blue-500',   description: t('home.features1.internetBanking.desc') },
    { id: 'home-loans',        name: t('home.features1.homeLoans.name'),        icon: '🏠', color: 'bg-emerald-600',description: t('home.features1.homeLoans.desc') },
    { id: 'personal-loans',    name: t('home.features1.personalLoans.name'),    icon: '💰', color: 'bg-yellow-500', description: t('home.features1.personalLoans.desc') },
    { id: 'credit-cards',      name: t('home.features1.creditCards.name'),      icon: '💳', color: 'bg-purple-500', description: t('home.features1.creditCards.desc') },
    { id: 'fixed-deposits',    name: t('home.features1.fixedDeposits.name'),    icon: '🏦', color: 'bg-indigo-500', description: t('home.features1.fixedDeposits.desc') },
    { id: 'mutual-funds',      name: t('home.features1.mutualFunds.name'),      icon: '📈', color: 'bg-teal-500',   description: t('home.features1.mutualFunds.desc') },
    { id: 'insurance',         name: t('home.features1.insurance.name'),         icon: '🛡️', color: 'bg-pink-500',   description: t('home.features1.insurance.desc') },
    { id: 'customer-support',  name: t('home.features1.customerSupport.name'),  icon: '📞', color: 'bg-red-500',    description: t('home.features1.customerSupport.desc') },
    { id: 'account-services',  name: t('home.features1.accountServices.name'),  icon: '🧾', color: 'bg-gray-600',   description: t('home.features1.accountServices.desc') },
    { id: 'upi-payments',      name: t('home.features1.upiPayments.name'),      icon: '🔁', color: 'bg-cyan-600',   description: t('home.features1.upiPayments.desc') },
    { id: 'branch-locator',    name: t('home.features1.branchLocator.name'),    icon: '📍', color: 'bg-lime-600',   description: t('home.features1.branchLocator.desc') },
  ];

  return (
    <section id="Home" className="relative overflow-hidden bg-slate-50 ">
      <div className="absolute hidden md:block top-4 right-4 z-40">
        <Quiz />
      </div>

      <div className="max-w-[1800px] w-full flex px-4 sm:px-10 md:px-12 mx-auto">
        <div className="bg-header-mobile bg-custom-mobile-header-size absolute left-0 bg-top w-full h-full bg-no-repeat lg:hidden"></div>
        <div className="bg-header-desktop absolute -right-[30%] w-full h-full bg-no-repeat hidden lg:block bg-left"></div>

        <div className="max-w-xl mx-auto max-md:mt-[-10px] lg:mx-0 h-screen relative z-20">
          <div className="h-full flex flex-col justify-center md:justify-end pb-4 lg:pb-0 lg:w-96 lg:justify-center">
            <div className="h-2/3 flex flex-col backdrop-blur-[2px] bg-white/30 lg:backdrop-blur-none lg:bg-transparent rounded-lg px-2 justify-center items-center text-center lg:items-start lg:text-left">
              <div className="flex flex-col justify-center items-center lg:items-start flex-grow lg:pt-16 max-md:w-full ">
                <h1 className="text-4xl font-bold !font-sans lg:leading-[1.20] lg:text-5xl text-slate-800 lg:text-purple-800 pb-5 drop-shadow-md">
                  <div className="max-md:flex max-md:w-50 max-md:mt-10 max-md:flex-col ">
                    <span className="bg-yellow-400 text-teal-700 px-2 max-md:text-[26px] max-md:h-10 max-md:w-50 rounded">
                      {t('home.hero.highlight1')}
                    </span>{" "}
                    <span className="max-md: max-md:text-[19px]">
                      {t('home.hero.text')}
                    </span>
                    <span className="bg-indigo-600 max-md:w-40 max-md:mx-auto text-white rounded px-2">
                      {t('home.hero.highlight2')}
                    </span>
                  </div>
                </h1>

                <p className="max-md:w-50 max-md:mb-13 text-gray-500 font-inter mt-[-9px] text-[14.5px] md:text-[17px] leading-snug my-6 drop-shadow-sm">
                  {t('home.hero.desc')}
                </p>
              </div>

              <div className="h-30 p-5 max-md:p-1 flex items-center ml-[-25px] mt-10 max-md:mt-5 justify-center">
                <div className="grid grid-flow-col max-md:grid-rows-3 max-md:gap-1 grid-rows-3 gap-2.5 bg-white rounded-xl shadow-xl p-3 overflow-auto max-w-full">
                  {features.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(`/${item.id}`)}
                      className="relative cursor-pointer group w-43 h-17 max-md:w-20 max-md:h-18 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-white font-semibold text-sm"
                    >
                      <div className={`${item.color} w-full h-full rounded-xl flex flex-col items-center justify-center`}>
                        <div className="text-3xl max-md:text-xl">{item.icon}</div>
                        <div className="mt-2 text-center px-1">{item.name}</div>
                      </div>

                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white text-sm font-semibold rounded-xl p-4 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.8)] 
                        opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 
                        transition-all duration-500 ease-in-out border-2 border-transparent group-hover:border-white animate-borderPulse z-10 pointer-events-none">
                        <p className="text-center max-md:text-[10px]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMain;
