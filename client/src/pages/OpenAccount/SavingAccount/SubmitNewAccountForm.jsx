import React, {useContext} from "react";
import { useForm } from "../../../context/FormContext";
import { useNavigate } from "react-router-dom";
import AccountProgressTracker from "../../../components/AccountProgressTracker";
import toast from "react-hot-toast";
import axios from 'axios';
import { AppContext } from "../../../context/AppContext";

const SubmitNewAccountForm = () => {
  const { formData } = useForm();
  const navigate = useNavigate();
  const { backendUrl} = useContext(AppContext)
  const handleFinalSubmit = async () => {
    // Here you'd typically send `formData` to backend
    console.log(backendUrl)
    const {data} = await axios.post(
      backendUrl + '/allUserInfo',
      formData,
      {withCredentials: true}
    )
    console.log(data)
    if(data.success){
      console.log(data)
        toast.success("Form successfully submitted!");
      navigate("/kyc/askforvkyc"); // or reset form or redirect
    }
    else{
      console.log(data)
        toast.error("Error in form submission");

    }
  
  };

  const Section = ({ title, data }) => (
    <div className="mb-6 border rounded-lg p-4 shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold mb-2 text-blue-700">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
            {typeof value === "object" ? (
              <span>{Object.entries(value).filter(([, v]) => v).map(([k]) => k).join(", ") || "None"}</span>
            ) : (
              <span>{value || "N/A"}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <AccountProgressTracker currentStep={6} />
    <div className="max-w-5xl mx-auto p-8 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Preview & Final Submission</h2>

      {/* Sections */}
      <Section title="Registration Details" data={formData.registration} />
      <Section title="Document Details" data={formData.documents} />
      <Section title="Address Details" data={formData.address} />
      <Section title="Personal Details" data={formData.personal} />
      <Section title="Nominee Details" data={formData.nominee} />
      <Section title="Banking Services" data={formData.services} />

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/new-account/basic-savings/services")}
          className="px-5 py-2 border cursor-pointer border-blue-500 text-blue-600 rounded hover:bg-blue-50"
        >
          Back
        </button>
        <button
          onClick={handleFinalSubmit}
          className="px-6 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700"
        >
          Final Submit
        </button>
      </div>
    </div>
    </div>
  );
};

export default SubmitNewAccountForm;


