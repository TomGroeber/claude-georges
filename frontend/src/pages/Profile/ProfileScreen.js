import Breadcrumb from '../../components/common/Breadcrumb';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { useLocation } from 'react-router-dom';
import {
  getLocalStorageItem,
  isSuperAdmin
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import CommonInput from '../../components/common/Input/CommonInput';
import { Api } from '../../api';
import { useTranslation } from 'react-i18next';

function UserProfile() {
  let location = useLocation();
  const { t } = useTranslation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const [form, setForm] = useState({
    id: '',
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    allowedLeaves: 0,
    password: '',
    passport: '',
  });

  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [pages, setPages] = useState([
    {
      name: t('profile'),
      href: '/profile',
      current: true
    }
  ]);

  useEffect(() => {
    if (userData) {
      setLoader(true);
      Api.getProfile().then((res) => {
        if (res?.data?.meta?.code == 1) {
          setForm({
            ...form,
            firstName: res?.data?.data?.firstName,
            lastName: res?.data?.data?.lastName,
            username: res?.data?.data?.username,
            email: res?.data?.data?.email,
            allowedLeaves: res?.data?.data?.allowedLeaves,
            passport: res?.data?.data?.passport,
            userId: res?.data?.data?.id
          })

        } else {
          setLoader(false);
        }

      })


      setLoader(false);
    }
  }, []);

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

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {location?.state ? (
          <title>User Profile | Vacation Manager Admin</title>
        ) : (
          <title>User Profile | Vacation Manager Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form>
          <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white gap-4">

            <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
              <CommonInput
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                type="text"
                label={t('firstName')}
                error={error.firstName}
                disabled={true}
              />
              <CommonInput
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                label={t('lastName')}
                error={error.lastName}
                disabled={true}
              />

              <CommonInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                label={t('email')}
                error={error.email}
                disabled={true}
              />
              {!isSuperAdmin() &&
                <CommonInput
                  id="allowedLeaves"
                  name="allowedLeaves"
                  type="number"
                  value={form.allowedLeaves}
                  onChange={handleChange}
                  label={t('allowedLeaves')}
                  error={error.allowedLeaves}
                  disabled={true}
                />
              }

              <div>
              </div>

            </div>
          </div>
        </form>
      </div>

    </>
  );
}

export default UserProfile;
