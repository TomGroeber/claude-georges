import React, { useState } from 'react';
import { Api } from '../api';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/Loader';
import { errorToast, successToast } from '../utils/helper';
import ChangePassValidations from '../services/validations/changePassValidations';
import CommonInput from '../components/common/Input/CommonInput';
import PrimaryButton from '../components/common/Buttons/PrimaryButton';
import { useTranslation } from 'react-i18next';


export default function ChangePassword() {
  const {t} = useTranslation();
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const pages = [{ name: t('changePassword'), href: '/change-password', current: true }];
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = ChangePassValidations(form, t);
    if (isValid) {
      setLoader(true);
      const payload = {
        oldPassword: form.password,
        newPassword: form.newPassword
      };
      const response = await Api.changePassword(payload);
      if (response?.data?.meta?.code === 1) {
        setForm({
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoader(false);
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      }
    }
    setError(errors);
    setLoader(false);
  };

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      <div className="mt-6 mx-3 flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white gap-4">
        <div className="sm:w-[430px] w-full">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <CommonInput
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                label={t('EnterOldPassword')}
                error={error.password}
                classNames="px-4 py-2 sm:px-5 sm:py-3"
                isRequired
                placeholder={t('enterCurrentPasswordMessage')}
                isIcon
              />
              <CommonInput
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                label={t('EnterNewPassword')}
                classNames="px-4 py-2 sm:px-5 sm:py-3"
                error={error.newPassword}
                isRequired
                placeholder={t('enterNewPasswordMessage')}
                isIcon
              />
              <CommonInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                label={t('EnterConfirmPassword')}
                error={error.confirmPassword}
                classNames="px-4 py-2 sm:px-5 sm:py-3"
                placeholder={t('enterConfirmPasswordMessage')}
                isRequired
                isIcon
              />
              <div className="text-end">
                <PrimaryButton btnText={t('save')} btnType="submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
