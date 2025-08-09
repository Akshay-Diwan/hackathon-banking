import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';  // import useTranslation

const SelectNewAccount = ({ onStart }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Use keys for translation instead of hardcoded text
  const accountTypes = [
    {
      id: "saving-account",
      img: assets.savingaccount,
      title: t('selectNewAccount.accountTypes.savingAccount.title'),
      description: t('selectNewAccount.accountTypes.savingAccount.description'),
    },
    {
      id: "current-account",
      img: assets.currentaccount,
      title: t('selectNewAccount.accountTypes.currentAccount.title'),
      description: t('selectNewAccount.accountTypes.currentAccount.description'),
    },
    {
      id: "student",
      img: assets.studentaccount,
      title: t('selectNewAccount.accountTypes.student.title'),
      description: t('selectNewAccount.accountTypes.student.description'),
    },
    {
      id: "minor",
      img: assets.minoraccount,
      title: t('selectNewAccount.accountTypes.minor.title'),
      description: t('selectNewAccount.accountTypes.minor.description'),
    },
  ];

  const relatedAccountActions = [
    {
      id: 'check-status',
      name: t('selectNewAccount.relatedActions.checkStatus.name'),
      icon: '📋',
      color: 'bg-blue-600',
      description: t('selectNewAccount.relatedActions.checkStatus.description'),
    },
    {
      id: 'complete-kyc',
      name: t('selectNewAccount.relatedActions.completeKyc.name'),
      icon: '🆔',
      color: 'bg-green-600',
      description: t('selectNewAccount.relatedActions.completeKyc.description'),
    },
    {
      id: 'update-info',
      name: t('selectNewAccount.relatedActions.updateInfo.name'),
      icon: '✏️',
      color: 'bg-yellow-600',
      description: t('selectNewAccount.relatedActions.updateInfo.description'),
    },
    {
      id: 'download-forms',
      name: t('selectNewAccount.relatedActions.downloadForms.name'),
      icon: '📄',
      color: 'bg-purple-600',
      description: t('selectNewAccount.relatedActions.downloadForms.description'),
    },
    {
      id: 'schedule-branch-visit',
      name: t('selectNewAccount.relatedActions.scheduleBranchVisit.name'),
      icon: '📅',
      color: 'bg-red-500',
      description: t('selectNewAccount.relatedActions.scheduleBranchVisit.description'),
    },
    {
      id: 'video-kyc',
      name: t('selectNewAccount.relatedActions.videoKyc.name'),
      icon: '🎥',
      color: 'bg-indigo-600',
      description: t('selectNewAccount.relatedActions.videoKyc.description'),
    },
    {
      id: 'nominee-details',
      name: t('selectNewAccount.relatedActions.nomineeDetails.name'),
      icon: '👨‍👩‍👧',
      color: 'bg-pink-500',
      description: t('selectNewAccount.relatedActions.nomineeDetails.description'),
    },
    {
      id: 'cancel-application',
      name: t('selectNewAccount.relatedActions.cancelApplication.name'),
      icon: '❌',
      color: 'bg-gray-700',
      description: t('selectNewAccount.relatedActions.cancelApplication.description'),
    },
    {
      id: 'contact-support',
      name: t('selectNewAccount.relatedActions.contactSupport.name'),
      icon: '📞',
      color: 'bg-cyan-700',
      description: t('selectNewAccount.relatedActions.contactSupport.description'),
    },
  ];

  return (
    <div className="min-h-screen mt-20 px-6 py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">{t('selectNewAccount.heading')}</h1>
        <p className="text-gray-600 mt-2">{t('selectNewAccount.subheading')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {accountTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => navigate(`/new-account/${type.id}`)}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={type.img}
              alt={type.title}
              className="w-66 h-46 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{type.title}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          👀 {t('selectNewAccount.relatedActions.heading')}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedAccountActions.map((action) => (
            <div
              key={action.id}
              onClick={() => navigate(`/account/${action.id}`)}
              className="cursor-pointer p-5 rounded-xl shadow-md hover:shadow-lg transition bg-white"
            >
              <div
                className={`text-3xl w-12 h-12 rounded-full flex items-center justify-center ${action.color} text-white mb-3`}
              >
                {action.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{action.name}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectNewAccount;
