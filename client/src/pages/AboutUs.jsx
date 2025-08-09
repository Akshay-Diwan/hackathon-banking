import React from "react";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 mt-30 text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 to-blue-600 text-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("aboutUs.hero.title")}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            {t("aboutUs.hero.description")}
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-blue-900">{t("aboutUs.legacy.title")}</h2>
            <p className="text-lg leading-relaxed">{t("aboutUs.legacy.paragraph1")}</p>
            <p className="mt-4 text-lg leading-relaxed">{t("aboutUs.legacy.paragraph2")}</p>
          </div>
          <img
            src={assets.bankofmahalegasy}
            alt={t("aboutUs.legacy.imageAlt")}
            className="rounded-xl shadow-xl w-full h-auto"
          />
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-blue-50 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">{t("aboutUs.vision.title")}</h3>
            <p className="text-lg leading-relaxed">{t("aboutUs.vision.description")}</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">{t("aboutUs.mission.title")}</h3>
            <p className="text-lg leading-relaxed">{t("aboutUs.mission.description")}</p>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-blue-900 mb-10">{t("aboutUs.stats.title")}</h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold text-blue-700">2200+</h4>
              <p className="text-lg">{t("aboutUs.stats.branches")}</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-blue-700">1900+</h4>
              <p className="text-lg">{t("aboutUs.stats.atms")}</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-blue-700">3.5 Cr+</h4>
              <p className="text-lg">{t("aboutUs.stats.customers")}</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-blue-700">87+ {t("aboutUs.stats.years")}</h4>
              <p className="text-lg">{t("aboutUs.stats.trust")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-blue-100 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-blue-900 mb-10 text-center">{t("aboutUs.leadership.title")}</h3>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src="https://www.bankofmaharashtra.in/writereaddata/Portal/Images/Board-of-Directors.png"
              alt={t("aboutUs.leadership.imageAlt")}
              className="rounded-xl shadow-xl"
            />
            <p className="text-lg leading-relaxed">{t("aboutUs.leadership.description")}</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-blue-900 text-white py-16 px-6 md:px-20 text-center">
        <h3 className="text-3xl font-bold mb-4">{t("aboutUs.cta.title")}</h3>
        <p className="text-lg mb-6">{t("aboutUs.cta.description")}</p>
        <button className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-200 transition">
          {t("aboutUs.cta.button")}
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
