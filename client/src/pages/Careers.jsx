import React from "react";
import { useTranslation } from "react-i18next";

const Careers = () => {
  const { t } = useTranslation();

  const whyJoinItems = t('careers.whyJoinUs.items', { returnObjects: true });
  const openRoles = t('careers.openPositions.roles', { returnObjects: true });
  const benefits = t('careers.benefits.items', { returnObjects: true });

  return (
    <div className="bg-gray-50 mt-29 text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20 px-6 md:px-20 text-center">
        <h1 className="text-5xl font-bold mb-4">{t('careers.hero.title')}</h1>
        <p className="text-xl max-w-2xl mx-auto">{t('careers.hero.description')}</p>
      </div>

      {/* Why Join Us */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">{t('careers.whyJoinUs.title')}</h2>
          <p className="text-lg mb-10 max-w-3xl mx-auto">{t('careers.whyJoinUs.description')}</p>
          <div className="grid md:grid-cols-3 gap-10">
            {whyJoinItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-2xl rounded-2xl p-6 transition-transform hover:scale-105 border-t-4 border-blue-500"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-blue-50 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">{t('careers.openPositions.title')}</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {openRoles.map((role, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition">
                <h3 className="text-2xl font-bold text-blue-800 mb-2">{role.title}</h3>
                <p className="text-gray-700 mb-2">{role.desc}</p>
                <p className="text-sm text-blue-600 italic">{role.eligibility}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Culture */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">{t('careers.benefits.title')}</h2>
            <ul className="list-disc text-lg pl-5 space-y-3 text-gray-700">
              {benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
          <img
            src="https://www.bankofmaharashtra.in/writereaddata/Portal/Images/Employee.png"
            alt={t('careers.hero.title')}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-20 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold mb-4">{t('careers.cta.title')}</h2>
        <p className="text-lg mb-8">{t('careers.cta.description')}</p>
        <a
          href="https://www.bankofmaharashtra.in/current-openings"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-full shadow hover:bg-gray-200 transition"
        >
          {t('careers.cta.button')}
        </a>
      </section>
    </div>
  );
};

export default Careers;
