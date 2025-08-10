import React, { useState, useContext } from 'react';
import AdminTitle from '../../../components/admin/AdminTitle';
import { createWorker } from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import axios from 'axios'
import { AppContext } from '../../../context/AppContext';
const PersonalPayment = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [imageURL, setImageURL] = useState(null); 
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const [formData, setFormData] = useState({
    receiver_account_number: '',
    ifsc: '',
    amount: '',
    payment_method: 'UPI',
    message: '',
    otp: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageURL(URL.createObjectURL(file));
      setImageFile(file);
      setOcrText('');
      setFormData((prev) => ({
        ...prev,
        friendName: '',
        accountOrUpi: '',
        bankName: '',
        ifsc: '',
      }));
    }
  };

  const runOCR = async () => {
    if (!imageFile) {
      alert(t('personalPayment.alertUploadPassbook'));
      return;
    }

    setOcrLoading(true);

    const worker = createWorker({
      logger: (m) => {
        // optional progress logging
      },
    });

    try {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageFile);
      setOcrText(text);
      parseOCRText(text);
      await worker.terminate();
    } catch (error) {
      alert(t('personalPayment.alertOcrError'));
      console.error(error);
    } finally {
      setOcrLoading(false);
    }
  };

  const parseOCRText = (rawText) => {
    const accountNoMatch = rawText.match(/\b\d{9,18}\b/);
    const ifscMatch = rawText.match(/[A-Z]{4}0[A-Z0-9]{6}/);
    const nameMatch = rawText.match(/Name\s*[:\-]?\s*([A-Za-z\s]+)/i);
    const bankNameMatch = rawText.match(/Bank\s*[:\-]?\s*([A-Za-z\s]+)/i);

    setFormData((prev) => ({
      ...prev,
      friendName: nameMatch ? nameMatch[1].trim() : prev.friendName,
      accountOrUpi: accountNoMatch ? accountNoMatch[0] : prev.accountOrUpi,
      bankName: bankNameMatch ? bankNameMatch[1].trim() : prev.bankName,
      ifsc: ifscMatch ? ifscMatch[0] : prev.ifsc,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const {backendUrl} = useContext(AppContext)
    await axios.post(
      backendUrl + '/transfer',
      formData,
      {withCredentials : true}
    )
     await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Form submitted:', formData);

    setIsLoading(false);
    navigate("/loading");
  };
  const sendOtp = async () => {
    await axios.get(
      backendUrl + '/requestOtp',
      formData,
      {withCredentials : true}
    )
  }

  return (
    <div>
      <AdminTitle
        text={t('personalPayment.title')}
        description={t('personalPayment.description')}
      />

      <div className="max-w-3xl mx-3 p-6 bg-white rounded-xl mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('personalPayment.uploadTitle')}</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        {imageURL && (
          <div className="mb-4">
            <img src={imageURL} alt={t('personalPayment.passbookPreviewAlt')} className="w-full rounded shadow" />
          </div>
        )}
        <button
          onClick={runOCR}
          disabled={ocrLoading}
          className={`px-4 py-2 rounded text-white ${
            ocrLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {ocrLoading ? 'Processing...' : 'Extract Details from Image'}
        </button>

        {ocrText && (
          <pre className="mt-4 p-3 bg-gray-100 rounded max-h-40 overflow-auto whitespace-pre-wrap text-sm font-mono">
            <strong>OCR Extracted Text:</strong>
            <br />
            {ocrText}
          </pre>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-3 p-6 bg-white rounded-xl space-y-4"
      >
        <div className="space-y-4 border border-gray-300 p-5 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('personalPayment.recipientDetails')}</h3>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.fullName')} :-
            </label>
            <input
              name="friendName"
              value={formData.friendName}
              onChange={handleChange}
              required
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.fullNamePlaceholder')}
            />
          </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recipient Details</h3>
        
      {/* <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Full Name :-</label>
        <input name="friendName" value={formData.friendName} onChange={handleChange}
          required className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="e.g. Rahul Sharma" />
      </div> */}

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.accountNo')} :-
            </label>
            <input
              name="accountOrUpi"
              value={formData.accountOrUpi}
              onChange={handleChange}
              required
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.accountOrUpiPlaceholder')}
            />
          </div>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.bankName')} :-
            </label>
            <input
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.bankNamePlaceholder')}
            />
          </div>
      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Account No :-</label>
        <input name="accountOrUpi" value={formData.accountOrUpi} onChange={handleChange}
          required className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="rahul@upi or 1234567890" />
      </div>
{/* 
      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Bank Name :-</label>
        <input name="bankName" value={formData.bankName} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="e.g. HDFC Bank" />
      </div> */}

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.ifscCode')} :-
            </label>
            <input
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.ifscPlaceholder')}
            />
          </div>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.contact')} :-
            </label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.contactPlaceholder')}
            />
          </div>
        </div>
      {/* <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Email / Mobile :-</label>
        <input name="contact" value={formData.contact} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="+91XXXXXXXXXX or email" />
      </div> */}
      </div>

        <hr className="text-gray-400  w-312 mx-[-20px]" />

        <div className="space-y-4 border border-gray-300 p-5 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('personalPayment.transactionDetails')}</h3>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.amount')} :-
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min={1}
              className="input w-full p-2 px-3 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.amountPlaceholder')}
            />
          </div>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.transferType')} :-
            </label>
            <select
              name="transferType"
              value={formData.transferType}
              onChange={handleChange}
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
            >
              <option value="NEFT">{t('personalPayment.transferTypes.neft')}</option>
              <option value="IMPS">{t('personalPayment.transferTypes.imps')}</option>
              <option value="RTGS">{t('personalPayment.transferTypes.rtgs')}</option>
            </select>
          </div>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.message')} :-
            </label>
            <input
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={50}
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.messagePlaceholder')}
            />
          </div>

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.transferMode')} :-
            </label>
            <select
              name="transferMode"
              value={formData.transferMode}
              onChange={handleChange}
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
            >
              <option value="instant">{t('personalPayment.transferModes.instant')}</option>
              <option value="scheduled">{t('personalPayment.transferModes.scheduled')}</option>
            </select>
          </div>
      {/* <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Transfer Mode :-</label>
        <select name="transferMode" value={formData.transferMode} onChange={handleChange}
          className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded ">
          <option value="instant">Instant</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div> */}

          <div className="flex max-md:flex-col gap-2 items-center">
            <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">
              {t('personalPayment.enterOtp')} :-
            </label>
            <input
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded "
              placeholder={t('personalPayment.otpPlaceholder')}
            />
            <button className="w-40 p-[7.3px] border rounded border-amber-600 cursor-pointer bg-amber-500 ">
              <span className="ml-auto">{t('personalPayment.requestOtp')}</span>
            </button>
          </div>
        </div>
      <div className='flex max-md:flex-col gap-2 items-center'>
        <label className="block text-[16px] w-50 max-md:ml-[-120px] font-medium text-gray-500">Enter OTP :-</label>
        <input name="otp" value={formData.otp} onChange={handleChange}
          required className="input w-full p-2 outline-none text-[15px] border border-gray-700/40 rounded " placeholder="Enter 6-digit OTP" />
          <button onClick={sendOtp} className="w-40 p-[7.3px] border rounded border-amber-600 cursor-pointer bg-amber-500 ">
            <span className='ml-auto'>Request Otp</span>
          </button>
      </div>

      </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 text-white rounded-md font-medium transition-colors cursor-pointer duration-200 
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? (
            <span className="flex justify-center items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {t('personalPayment.sending')}
            </span>
          ) : (
            t('personalPayment.sendMoney')
          )}
        </button>
      </form>
    </div>
  );
};

export default PersonalPayment;
