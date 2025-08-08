// src/components/ScheduleVKYC.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";

const ScheduleVkyc = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    branch: "",
    date: "",
    time: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const branches = ["Pune - Model Colony", "Mumbai - Andheri", "Delhi - Connaught Place"];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Enter a valid 10-digit mobile number.";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.branch) errs.branch = "Please select a branch.";
    if (!form.date) errs.date = "Please choose a preferred date.";
    if (!form.time) errs.time = "Please choose a preferred time slot.";
    if (!form.consent) errs.consent = "You must agree to proceed.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Submit form via API or email
    toast.success("VKYC appointment scheduled successfully");
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <main className="min-h-screen mt-20 bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          Schedule Your VKYC Appointment
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Choose a convenient date and time for your Video KYC. Make sure you have your KYC documents and a stable internet connection ready.
        </p>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md">
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-5">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div className="mb-5">
            <label htmlFor="mobile" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Registered Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile no."
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.mobile ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
          </div>

          {/* Email ID */}
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Email ID
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Select Branch */}
          <div className="mb-5">
            <label htmlFor="branch" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Select Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.branch ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600`}
            >
              <option value="" className="text-blue-100">-- Choose a Branch --</option>
              {branches.map((b, i) => (
                <option key={i} value={b} className="text-blue-100">
                  {b}
                </option>
              ))}
            </select>
            {errors.branch && <p className="mt-1 text-sm text-red-500">{errors.branch}</p>}
          </div>

          {/* Preferred Date */}
          <div className="mb-5">
            <label htmlFor="date" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Preferred VKYC Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Preferred Time Slot */}
          <div className="mb-5">
            <label htmlFor="time" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Preferred Time Slot
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
          </div>

          {/* Consent */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              className="h-5 w-5 cursor-pointer text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="consent" className="ml-3 text-gray-700 dark:text-gray-200">
              I confirm that I have the required documents and a stable internet connection.
            </label>
          </div>
          {errors.consent && <p className="mb-5 text-sm text-red-500">{errors.consent}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition"
          >
            Schedule VKYC
          </button>
        </form>
      </section>

      {/* Illustration */}
      <section className="max-w-xs mx-auto mt-8">
        <img
          src="https://source.unsplash.com/400x300/?video-call,kyc,banking"
          alt="Video KYC illustration"
          className="rounded-xl shadow-lg"
        />
      </section>
    </main>
  );
}

export default ScheduleVkyc;
