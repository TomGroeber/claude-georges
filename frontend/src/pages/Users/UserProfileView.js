import Breadcrumb from '../../components/common/Breadcrumb';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CommonInput from '../../components/common/Input/CommonInput';
import { Api } from '../../api';
import { useTranslation } from 'react-i18next';

function UserProfileView() {
  let location = useLocation();
  let propsData = location?.state;
  const {t}= useTranslation();
  
  const [form, setForm] = useState({
    id: '',
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    allowedLeaves:0,
    password:'',
    passport:'',
  });

  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [pages, setPages] = useState([
    {
      name: t('profileView'),
      href: '/users/user-profile',
      current: true
    }
  ]);

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      Api.getUserDetail(propsData?.id).then((res)=>{
        if(res?.data?.meta?.code==1){
          setForm({
            ...form,
            firstName:res?.data?.data?.firstName,
            lastName:res?.data?.data?.lastName,
            username:res?.data?.data?.username,
            email:res?.data?.data?.email,
            allowedLeaves:res?.data?.data?.allowedLeaves,
            passport:res?.data?.data?.passport,
          })
    
        }else{
          setLoader(false);
        }

      })
      setLoader(false);
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

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {location?.state ? (
          <title>User Profile View | Vacation Manager Admin</title>
        ) : (
          <title>User Profile View | Vacation Manager Admin</title>
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
              {/* <CommonInput
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                label="Username"
                error={error.username}
                disabled={true}

              /> */}
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
              {/* <div>
               <label className="block text-sm font-medium text-gray-700">
                        Role                    
                    </label>
              <SelectMenu
                menuList={ROLES}
                showLabel={false}
                defaultSelected={role}
                setSelectedMenu={handleRole}
                disabled={true}
              />

              </div> */}
              <div>
              </div>

              {/* <div className="text-right flex justify-end gap-x-2 mt-12">
                <SecondaryButton btnText="Cancel" btnType="button" />
                <PrimaryButton btnText="Submit" btnType="submit" />
              </div> */}
            </div>
          </div>
        </form>
      </div>

    </>
  );
}

export default UserProfileView;
