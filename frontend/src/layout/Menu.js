import { Fragment, useState, useContext, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { SidebarContext } from '../context/SidebarContext';
import { getLocalStorageItem } from '../utils/helper';
import { errorToast } from '../utils/helper';
import { useTranslation } from 'react-i18next';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const subMenu = [];

const Menu = ({ item, setActiveIndex, index, openedSubMenuIndex, setOpenedSubMenuIndex, notificationCounts }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setShow } = useContext(SidebarContext);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const getStatus = () => {
    return !!subMenu?.map((item) => item.href)?.includes(location.pathname);
  };

  const [showSubMenu, setShowSubMenu] = useState(getStatus());

  useEffect(() => {
    setShowSubMenu(openedSubMenuIndex === index);
  }, [openedSubMenuIndex, index]);

  const handleRedirect = (link) => {
    if (item?.isDisabled) {
      return errorToast(t('accessDenied'));
    }
    if (window.innerWidth < 1024) {
      setShow(false);
    }
    if (!item.remove) {
      navigate(link);
    } else {
      navigate(`/dashboard`);
    }
  };

  const toggleSubMenu = () => {
    if (showSubMenu) {
      setOpenedSubMenuIndex(null);
    } else {
      setOpenedSubMenuIndex(index);
    }
  };

  return (
    <>
      <div
        key={item.name}
        onClick={() => {
          if (item.href === 'isDropDown') {
            toggleSubMenu();
          } else {
            handleRedirect(item.href);
            setActiveIndex(index);
          }
        }}
        className={classNames(
          location?.pathname?.includes(item.href)
            ? 'font-semibold text-vacation-newDashboardBlue cursor-pointer '
            : 'text-vacation-gray2 cursor-pointer',
          'group outline-none mx-2 flex relative items-center py-3 px-2 text-sm font-normal rounded-md'
        )}
      >
        {location?.pathname?.includes(item.href) ? (
          <img
            loading='lazy'
            src={item?.activeIcon}
            alt="sidebar_icon"
            className={`mr-3 ml-2 h-6 w-6  flex-shrink-0 text-white`}
          />
        ) : (
          <img
            loading='lazy'
            src={item?.icon}
            alt="sidebar_icon"
            className={`mr-3 ml-2 h-6 w-6 flex-shrink-0`}
          />
        )}

        {/* <item.icon className={`mr-3 ml-2 h-6 w-6 flex-shrink-0 text-white`} aria-hidden='true' /> */}
        {item.name}

        {item.name == t('notification') &&
        
          notificationCounts > 0 && (
            <div className="absolute right-[84px] lg:right-[8px] shadow-2xl top-[15px] rounded-[50%] text-white text-[10px] flex justify-center align-middle text-center bg-[red] h-[20px] w-[20px]">
              <p className="self-center">
                {notificationCounts > 99 ? '99+' : notificationCounts}
              </p>
            </div>
          )
        }


        {item.isDropDown &&
          (showSubMenu ? (
            <ChevronUpIcon className="w-[20px] ml-2" />
          ) : (
            <ChevronDownIcon className="w-[20px] ml-2" />
          ))}
      </div>
      {item.isDropDown && showSubMenu && (
        <Transition
          show={showSubMenu}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="text-vacation-newDashboardBlue py-2 space-y-2 px-2 bg-vacation-offWhite">
            {item.subMenu?.map((innerItem, subIndex) => {
              return !innerItem.show ? (
                ''
              ) : (
                <div
                  key={subIndex}
                  onClick={() => handleRedirect(innerItem.href)}
                  className={classNames(
                    location?.pathname?.includes(innerItem.href)
                      ? 'bg-gradient-to-r from-vacation-primary text-white to-vacation-secondary cursor-pointer'
                      : 'cursor-pointer text-vacation-gray2',
                    'pl-[20px] mx-4  group outline-none flex  items-center py-3 px-2 text-sm font-normal rounded-md'
                  )}
                >
                  {innerItem.name}
                </div>
              );
            })}
          </div>
        </Transition>
      )}
    </>
  );
};

Menu.propTypes = {
  item: PropTypes.any,
  setActiveIndex: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  openedSubMenuIndex: PropTypes.number,
  setOpenedSubMenuIndex: PropTypes.func.isRequired,
};

export default Menu;
