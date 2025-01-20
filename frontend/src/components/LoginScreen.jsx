import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CommonInput from './common/Input/CommonInput';
import { Api } from '../api';
import loginValidation from '../services/validations/loginValidation';
import { errorToast, getLocalStorageItem, setLocalStorageItem, successToast } from '../utils/helper';
import { useTranslation } from 'react-i18next';

export default function AnimatedLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const { errors, isValid } = loginValidation(form,t);
  if (isValid) {
    setLoader(true);
    const payload = {
      email: form.email,
      password: form.password
    };
    Api.login(payload)
      .then((res) => {
        if(res?.data?.meta?.code==1){
          setLocalStorageItem('token', res?.data?.data.access);
          setLocalStorageItem('refreshToken', res?.data?.data?.refresh);
          setLocalStorageItem('userData', JSON.stringify(res?.data?.data?.userData));
          successToast(t('loginSuccess'));
  
          if (res?.data?.data?.userData?.role === 'admin') {
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000);
          } else {
            setTimeout(() => {
              navigate('/dashboard');
            }, 1000);
          }
  
          setLoader(false); 
        }else if(res?.data?.meta?.code==0){
          errorToast(res?.data?.meta?.message);
          setLoader(false);
        }
      })
      .catch(error => {
        setLoader(false);
        // console.error('Error in API call', error);
      });
  } else {
    setLoader(false);
    setError(errors);
  }
};


  const handleChange = (e) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(()=>{
    if(userData){
      navigate('/dashboard')
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <AnimatePresence mode="wait">
           
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">{t('login')}</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                  <CommonInput
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    label={t('email')}
                    error={error.email}
                    classNames="px-4 py-2 sm:px-5 sm:py-3"
                    placeholder={t('enterEmail')}
                    isRequired
                  />

                  <div className="space-y-1">
                    <CommonInput
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      label={t('password')}
                      error={error.password}
                      classNames="px-4 py-2 sm:px-5 sm:py-3"
                      placeholder={t('passwordRequired')}
                      isRequired
                      isIcon
                    />
                    <div className="flex items-center justify-end">
                     
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="rounded-3xl border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary w-full py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-vacation-primary focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2"
                    >
                      {t('login')}
                    </button>
                  </div>
                </form>

             
            </motion.div>
          

          
          
        </AnimatePresence>
      
      </motion.div>
    </div>
  );
}

