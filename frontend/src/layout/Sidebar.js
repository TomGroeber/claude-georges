import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  cleanLocalStorage,
  getLocalStorageItem,
  isSuperAdmin
} from '../utils/helper';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import Menu from './Menu';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/images/main_logo.png'
import companyDashboardIcon from '../assets/images/companyDashboardIcon.svg'
import activecompanyDashboardIcon from '../assets/images/ActivecompanyDashboardIcon.svg'
import userIcon from '../assets/images/Users.svg'
import activeUserIcon from '../assets/images/ActiveUsers.svg'
import historyIcon from '../assets/images/CMS.svg';
import activeHistoryIcon from '../assets/images/ActiveCMS.svg';
import notificationIcon from '../assets/images/Notification.svg';
import activeNotificationIcon from '../assets/images/ActiveNotification.svg';
import activeCmsIcon from '../assets/images/ActiveCMS.svg';
import cmsIcon from '../assets/images/CMS.svg';
import activeConigIcon from '../assets/images/Activeconfig.svg';
import configIcon from '../assets/images/config.svg';
import activeProileIcon from '../assets/images/ActiveSubAdmin.svg';
import profileIcon from '../assets/images/SubAdmin.svg';
import activeBagIcon from '../assets/images/ActivebagIcon.svg';
import bagIcon from '../assets/images/bagIcon.svg';
import { Api } from '../api';
import { useTranslation } from 'react-i18next';




function Sidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [sidebarData, setSidebarData] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexAlt, setActiveIndexAlt] = useState(0);
  const [openedSubMenuIndex, setOpenedSubMenuIndex] = useState(null);
  const [notificationCounts, setNotificationCounts] = useState(0);

  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/notification') {
        Api.getNotificationCount()
          .then((res) => {
            setNotificationCounts(res?.data?.data);
          })
          .catch((err) => {
            console.log(err);
          });
        }
      }, 3000)

    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/notification') {
        Api.getNotificationCount()
          .then((res) => {
            setNotificationCounts(res?.data?.data);
          })
          .catch((err) => {
            console.log(err);
          });
        }


  }, [window.location.pathname]);

  useEffect(() => {
    if (userData) {
      if (userData.role == 'admin') {
        setSidebarData([
          {
            name: t('dashboard'),
            href: `/dashboard`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },
          {
            name: t('users'),
            href: `/users`,
            icon: userIcon,
            activeIcon: activeUserIcon,
            access: true
          },
          {
            name: t('leaveRequests'),
            href: `/leaves`,
            icon: cmsIcon,
            activeIcon: activeCmsIcon,
            access: true
          },
          {
            name: t('customEvents'),
            href: `/custom-events`,
            icon: bagIcon,
            activeIcon: activeBagIcon,
            access: true
          },
          {
            name: t('profile'),
            href: `/profile`,
            icon: profileIcon,
            activeIcon: activeProileIcon,
            access: true
          },
          {
            name: t('manageBoundary'),
            href: `/boundaries`,
            icon: configIcon,
            activeIcon: activeConigIcon,
            access: true
          },
          {
            name: t('notification'),
            href: `/notification`,
            icon: notificationIcon,
            activeIcon: activeNotificationIcon,
            access: true
          },
        ]);
      } else {
        setSidebarData([
          {
            name: t('dashboard'),
            href: '/dashboard',
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },
          {
            name: t('leaves'),
            href: `/leaves`,
            icon: historyIcon,
            activeIcon: activeHistoryIcon,
            access: true
          },
          {
            name: t('profile'),
            href: `/profile`,
            icon: profileIcon,
            activeIcon: activeProileIcon,
            access: true
          },
          {
            name: t('notification'),
            href: `/notification`,
            icon: notificationIcon,
            activeIcon: activeNotificationIcon,
            access: true
          },

        ]);
      }
    }
  }, [

  ]);

  useEffect(() => {
    if (sidebarData.length) {
      let index = sidebarData.findIndex((data) => {
        if (data.isDropDown && data.subMenu) {
          return data.subMenu.some((subItem) => location?.pathname?.includes(subItem.href));
        }
        return location?.pathname?.includes(data.href);
      });
      if (index !== -1) {
        for (let i = 0; i <= index; i++) {
          if (sidebarData[i].access) {
            // index--;
          } else {
            index--;
          }
        }
      }
      if (index === -1) {
        setActiveIndexAlt(null);
        setActiveIndex(null);
      } else {
        let adjustedIndex = index;
        if (openedSubMenuIndex !== null && openedSubMenuIndex < index) {
          const visibleSubMenus = sidebarData[openedSubMenuIndex]?.subMenu.filter(
            (subItem) => subItem.show
          );
          adjustedIndex += visibleSubMenus.length + visibleSubMenus.length * 0.12;
        }

        setActiveIndexAlt(adjustedIndex);
      }
    }
  }, [location.pathname, sidebarData, openedSubMenuIndex]);

  const handleLogout = async () => {
    cleanLocalStorage();
    navigate('/login');
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="flex w-full h-full bg-white relative z-40  shadow-md rounded-2xl overflow-y-auto flex-1 flex-col">
      <div className="h-0 flex-1 relative overflow-y-auto sidebar-container">
        <div className="flex justify-center w-full bg-vacation-primary  sticky z-50 top-0 left-0 items-center px-4 h-[87px] border-b border-vacation-gray2">
          <img loading='lazy' className="h-16 w-auto " src={Logo} alt="Logo" />
        </div>
        <nav className=" mt-4 relative mb-[15px]">
          {
            <div
              style={{
                translate: `0 ${activeIndexAlt * 100}%`
              }}
              className={`w-2 h-12 rounded-r-lg bg-vacation-primary origin-bottom translate-y-[${activeIndex * 100
                }%]  absolute top-0 left-0 transition-all`}
            ></div>
          }
          {sidebarData?.map((item, index) =>
            !item?.access ? (
              ''
            ) : (
              <Menu
                key={index}
                item={item}
                index={index}
                setActiveIndex={setActiveIndex}
                openedSubMenuIndex={openedSubMenuIndex}
                setOpenedSubMenuIndex={setOpenedSubMenuIndex}
                notificationCounts={notificationCounts}
              />
            )
          )}
        </nav>
      </div>



      <div className="flex flex-col gap-y-4 justify-center items-center flex-shrink-0 border-t py-6 border-vacation-gray2 p-4">
        {isSuperAdmin() &&
          <div
            className="group block w-full flex-shrink-0 cursor-pointer"
            onClick={() => {
              navigate('/change-password');
            }}
          >
            <div className="flex items-center">
              <div className="bg-vacation-sidebarBackground p-1 rounded-[50%]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>

              </div>
              <div className="ml-3">
                <p className="text-sm text-vacation-sidebarBackground font-semibold">
                  {t('changePassword')}
                </p>
              </div>
            </div>
          </div>
        }

        <div
          className="group block w-full flex-shrink-0 cursor-pointer"
          onClick={() => {
            handleLogout();
          }}
        >
          <div className="flex items-center">
            <div className="bg-vacation-sidebarBackground p-1 rounded-[50%]">
              <ArrowRightOnRectangleIcon className="w-[20px] text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-vacation-sidebarBackground font-semibold">
                {t('logout')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
