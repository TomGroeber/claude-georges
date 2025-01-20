import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalStorageItem } from '../utils/helper';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const {t}= useTranslation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const handleGoBack = () => {
    if (userData.role == 'admin') {
      navigate(`/dashboard`);
    } else if (userData.role != 'admin') {
      navigate(`/dashboard`);
    }  else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-base font-semibold text-vacation-primary">404</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {t('pageNotFound')}
              </h1>
              <p className="mt-2 text-base text-gray-500">
                {t('notFoundMessage')}
              </p>
              <div className="mt-6">
                <button
                  onClick={handleGoBack}
                  type="button"
                  className="text-base font-medium text-vacation-primary hover:text-vacation-primary"
                >
                  {t('goBackHome')}
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;
