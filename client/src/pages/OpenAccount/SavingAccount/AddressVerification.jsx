import { useState } from "react";
import { useForm } from "../../../context/FormContext";
import toast from "react-hot-toast";
import AccountProgressTracker from "../../../components/AccountProgressTracker";
import { useNavigate } from "react-router-dom";

function AddressVerification() {
  const { updateSection } = useForm();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    country: "",
    state: "",
    district: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const {
      addressLine1,
      country,
      state,
      district,
      city,
      postalCode,
    } = form;

    if (
      !addressLine1.trim() ||
      !country.trim() ||
      !state.trim() ||
      !district.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      return toast.error("Please fill in all required fields.");
    }

    // Save to context
    updateSection("address", form);
    toast.success("Address data saved.");
    console.log("Saved to context:", form);
    navigate("/new-account/basic-savings/personal-details");
  };


  const handleBack = () => {
    navigate("/new-account/basic-savings/documents");
  };

  return (
    <div>
      <AccountProgressTracker  />
      <div className="max-w-3xl mb-4 mx-auto px-6 py-5 bg-white rounded-lg shadow-md border mt-3">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
          Address Verification
        </h2>

        {/* Address Lines */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            placeholder="123, Street Name"
            className="w-full mt-1 border bg-gray-400/10 border-gray-400 rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            placeholder="Apartment, Suite, etc."
            className="w-full mt-1 bg-gray-400/10 border-gray-400 border rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700">
            Address Line 3
          </label>
          <input
            type="text"
            name="addressLine3"
            value={form.addressLine3}
            onChange={handleChange}
            placeholder="Landmark or other info"
            className="w-full bg-gray-400/10 border-gray-400 mt-1 border rounded-md px-3 py-2"
          />
        </div>

        {/* Country, State, District, City, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full mt-1 bg-gray-400/10 border-gray-400 border rounded-md px-3 py-2"
              placeholder="India"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full bg-gray-400/10 border-gray-400 mt-1 border rounded-md px-3 py-2"
              placeholder="Maharashtra"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              District <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full bg-gray-400/10 border-gray-400 mt-1 border rounded-md px-3 py-2"
              placeholder="Pune"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mt-1 bg-gray-400/10 border-gray-400 border rounded-md px-3 py-2"
              placeholder="Pimpri"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="w-full mt-1 bg-gray-400/10 border-gray-400 border rounded-md px-3 py-2"
              placeholder="411001"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-1">
          <button 
          onClick={handleBack}
          className="bg-gray-300 cursor-pointer text-gray-800 px-6 py-2 rounded hover:bg-gray-400">
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressVerification;

