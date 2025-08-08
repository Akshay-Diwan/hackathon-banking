// src/components/ContactUs.jsx
import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

/**
 * ContactUs.jsx
 * A beautiful Tailwind-styled Contact Us component using content copied
 * from the Bank of Maharashtra contact page (navbar/footer excluded).
 *
 * Images use Unsplash dynamic keywords (no external libs required).
 *
 * Usage: <ContactUs />
 */

const ContactCard = ({ title, children, icon }) => (
  <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/25 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h4>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const ContactUs = () => {

  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b mt-20 from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 p-6 md:p-10">
      {/* Hero */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-rose-400/20 backdrop-blur-sm"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-6 p-8 md:p-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
                Contact Us
              </h1>
              <p className="mt-3 text-white/90 max-w-xl">
                Bank of Maharashtra contact details for complaints or for your
                feedback. Quick numbers, emails and dedicated support channels
                to help you with balance enquiry, mini statements, e-statements
                or reporting cyber fraud.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#missed-call"
                  className="inline-block bg-white/90 text-indigo-700 font-semibold px-4 py-2 rounded-lg shadow"
                >
                  Missed Call Numbers
                </a>
                <a
                  href="#tollfree"
                  className="inline-block bg-white/10 text-white/90 font-semibold px-4 py-2 rounded-lg border border-white/20"
                >
                  Toll Free
                </a>
                <a
                  href="#cyber-fraud"
                  className="inline-block bg-white/10 text-white/90 font-semibold px-4 py-2 rounded-lg border border-white/20"
                >
                  Cyber Fraud
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              {/* Unsplash image for visual appeal */}
              <img
                src={assets.bankofmaha}
                alt="Customer support"
                className="w-full h-44 object-cover "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: quick links / list */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
              <li>ATM Service Helpdesk</li>
              <li>Internet Banking Helpdesk</li>
              <li>Toll Free Numbers</li>
              <li>Head Office</li>
              <li>Zonal Offices</li>
              <li>Functional Heads</li>
              <li>Nodal Officer</li>
              <li>Forex Contacts</li>
              <li>Complaints & Grievances</li>
              <li>Chief Liaison Officer of SC/ST/PWD and OBC</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Our Most Popular Products
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex flex-col items-start gap-2">
                <img
                  src={assets.savingaccount}
                   onClick={() => navigate("/new-account/saving-account")}
                  alt="Savings"
                  className="w-full cursor-pointer h-30 object-cover rounded-md"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Savings Account
                </span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <img
                  src={assets.currentaccount}
                  onClick={() => navigate("/new-account/current-account")}
                  alt="Home loan"
                  className="w-full cursor-pointer h-30 object-cover rounded-md"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Home Loan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column: main contact info */}
        <div className="lg:col-span-2 space-y-6">
          <div id="missed-call" className="grid md:grid-cols-2 gap-6">
            <ContactCard
              title="Missed Call Numbers"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14" />
                </svg>
              }
            >
              <div className="space-y-2">
                <div>
                  <strong>1) Balance Enquiry :</strong>{" "}
                  <span className="font-mono">98333 35555</span>
                  <div className="text-xs text-slate-500 mt-1">
                    Balance of all SB/CA/CC accounts linked to caller’s mobile
                    no. will be sent by SMS.
                  </div>
                </div>

                <div>
                  <strong>2) Mini Statement :</strong>{" "}
                  <span className="font-mono">72878 88886</span>
                  <div className="text-xs text-slate-500 mt-1">
                    Last 5 transactions of all SB/CA/CC accounts linked to
                    caller’s Mobile no. will be sent on SMS (Separate SMS will
                    be sent for each account).
                  </div>
                </div>

                <div>
                  <strong>3) E-Statement :</strong>{" "}
                  <span className="font-mono">72878 88887</span>
                  <div className="text-xs text-slate-500 mt-1">
                    Statement of account (.pdf) for a period of last 30 days
                    will be sent for all SB/CA/CC accounts linked to caller’s
                    mobile no. on caller’s registered email id.
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  The above Missed Call No facilities are available for all
                  customers having mobile number registered with Bank.
                </div>
              </div>
            </ContactCard>

            <ContactCard
              title="Lodge a Complaint (Email)"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            >
              <div className="space-y-2">
                <div>
                  <strong>To lodge any complaint through email :</strong>
                </div>
                <div className="mt-2">
                  <a href="mailto:hocomplaints@mahabank.co.in" className="block text-indigo-700 font-medium">
                    hocomplaints@mahabank.co.in
                  </a>
                  <a href="mailto:cmcustomerservice@mahabank.co.in" className="block text-indigo-700 font-medium">
                    cmcustomerservice@mahabank.co.in
                  </a>
                </div>
              </div>
            </ContactCard>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ContactCard
              title="General Toll Free"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m0 14v2m12-10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div>
                <strong>MAHASEVA - 24x7 :</strong>{" "}
                <span className="font-mono">1800-233-4526</span>
              </div>
            </ContactCard>

            <ContactCard
              id="cyber-fraud"
              title="Cyber Fraud - Reporting Incident"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              }
            >
              <div className="space-y-2">
                <div>
                  <strong>Website :</strong>{" "}
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-700 font-medium"
                  >
                    cybercrime.gov.in
                  </a>
                </div>
                <div>
                  <strong>Toll free number :</strong>{" "}
                  <span className="font-mono">1930</span>
                </div>
              </div>
            </ContactCard>
          </div>

          {/* A small gallery / images */}
          

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Notes & Disclaimers
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              The missed call services and numbers listed above are available
              for customers having the mobile number registered with the bank.
              For more details or additional contact categories like Head Office,
              Zonal Offices and Functional Heads, refer to the official contact
              page.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              <strong>Source:</strong>{" "}
              <a
                href="https://bankofmaharashtra.in/contact-us"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                bankofmaharashtra.in — Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUs;
