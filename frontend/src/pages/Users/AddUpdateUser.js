import Breadcrumb from '../../components/common/Breadcrumb';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  successToast,
  getLocalStorageItem
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import CommonInput from '../../components/common/Input/CommonInput';
import PrimaryButton from '../../components/common/Buttons/PrimaryButton';
import SecondaryButton from '../../components/common/Buttons/SecondaryButton';
import ConfirmPopup from '../../components/common/modals/ConfirmPopup';
import UserAddEditValidation from '../../services/validations/userAddValidation';
import { ROLES } from '../../utils/constants';
import SelectMenu from '../../components/common/SelectMenu';
import { Api } from '../../api';
import { useTranslation } from 'react-i18next';

function UserAddEdit() {
  let location = useLocation();
  let propsData = location?.state;
  const {t}= useTranslation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

  const handleRole = (role) => {
    if (role) {
      if (role?.value) {
        setIsAdmin(role.value == 'admin')
      }
      setSelectedMenu(role)
    }
  };

  const [form, setForm] = useState({
    id: '',
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    allowedLeaves: 2.7,
    password: '',
    passport: '',
  });

  const [error, setError] = useState({});
  const [selectedMenu, setSelectedMenu] = useState(ROLES[0]);
  const [loader, setLoader] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [pages, setPages] = useState([
    {
      name: t('users'),
      href: '/users',
      current: true
    },
    {
      name: t('addUser'),
      href: '/users/add-edit',
      current: true
    }
  ]);

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        {
          name: t('users'),
          href: '/users',
          current: true
        },
        {
          name: t('editUser'),
          href: '/users/add-edit',
          current: true
        }
      ]);

      Api.getUserDetail(propsData?.id).then((res) => {
        if (res?.data?.meta?.code == 1) {
          setForm({
            ...form,
            firstName: res?.data?.data?.firstName,
            lastName: res?.data?.data?.lastName,
            username: res?.data?.data?.username,
            email: res?.data?.data?.email,
            allowedLeaves: res?.data?.data?.allowedLeaves,
            passport: res?.data?.data?.passport,
            password: res?.data?.data?.password
          })
          setSelectedMenu(ROLES.filter((user) => user.name === res?.data?.data?.role)?.[0]);
          setIsAdmin(res?.data?.data?.role == 'Admin');
          setLoader(false);
        } else {
          setLoader(false)
        }
      })
    }
  }, [propsData]);

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


  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();
    const { errors, isValid } = UserAddEditValidation(form, t);
    if (isValid) {
      if (location?.state && !fromPopup) {
        setOpenConfirmPopup(true);
      } else {
        setLoader(true);
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          email: form.email,
          password: form.password,
          allowedLeaves: isAdmin ? 0 : form.allowedLeaves,
          passport: form.passport,
          role: selectedMenu.value
        };

        if (propsData && propsData?.action == 'edit') {
          Api.updateUser(propsData?.id, payload).then((response) => {
            if (response?.data?.meta?.code === 1) {
              setLoader(false);
              successToast(response?.data?.meta?.message);
              navigate('/users');
            }
            else {
              // errorToast('Email already exists.')
              setLoader(false);
            }
          });
        }
        else {
          Api.addEditUser(payload).then((response) => {
            if (response?.data?.meta?.code === 1) {
              setLoader(false);
              successToast(response?.data?.meta?.message);
              navigate('/users');
            }
            else {
              // errorToast('Email already exists.')
              setLoader(false);
            }
          });
        }


      }
    } else {
      setError(errors);
    }
  };

  const handleNo = () => {
    setOpenConfirmPopup(false)
  }


  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {location?.state ? (
          <title>Edit User | Vacation Manager Admin</title>
        ) : (
          <title>Add User | Vacation Manager Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form onSubmit={handleSubmit}>
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
                isRequired
              />
              <CommonInput
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                label={t('lastName')}
                error={error.lastName}
                isRequired
              />
              {/* <CommonInput
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                label="Username"
                error={error.username}
              /> */}
              <CommonInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                label={t('email')}
                error={error.email}
                isRequired
              />
              <CommonInput
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                label={t('password')}
                error={error.password}
                isRequired
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                {t('role')}
                </label>
                <SelectMenu
                  menuList={ROLES}
                  showLabel={false}
                  defaultSelected={selectedMenu}
                  setSelectedMenu={handleRole}
                />
              </div>

              {!isAdmin &&
                <CommonInput
                  id="allowedLeaves"
                  name="allowedLeaves"
                  type="number"
                  value={form.allowedLeaves}
                  onChange={handleChange}
                  min={0}
                  label="Allowed Leaves"
                  error={error.allowedLeaves}
                />
              }

              <div>
              </div>

              <div className="text-right flex justify-end gap-x-2 mt-12">
                <SecondaryButton btnText={t('cancel')} btnType="button" />
                <PrimaryButton btnText={t('submit')} btnType="submit" />

              </div>
            </div>

          </div>
        </form>
      </div>

      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={t('updateUserDetails')}
          setAccepted={(e) => handleSubmit(e, true)}
          handleNo={handleNo}
        />
      )}
    </>
  );
}

export default UserAddEdit;
