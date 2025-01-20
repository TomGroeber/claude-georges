import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const MaxCharlimit = 100;
export const MaxCharlimitLongText = 1000;
export const getLocalStorageItem = (key) => localStorage.getItem(key);
export const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);
export const removeLocalStorageItem = (key) => localStorage.removeItem(key);
export const cleanLocalStorage = () => localStorage.clear();
export const getJWTToken = () => 'Bearer ' + localStorage.getItem('token');

export const errorToast = (msg, toastId = '') =>
  toast.error(msg, {
    duration: 2500,
    id: toastId
  });

export const successToast = (msg, duration = 2000) =>
  toast.success(msg, {
    duration
  });

export const informativeToast = (msg, duration = 3000) =>
  toast.custom(
    (t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-2">
          <div className="flex items-start">
            <div className="self-center">
              <InformationCircleIcon className="w-[24px] text-vacation-secondary" />
            </div>
            <div className="ml-3 self-center">
              <p className="mt-1 text-gray-500">{msg}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration
    }
  );

export const useOutsideClick = (ref, callback) => {
  const handleClick = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    const handleClickOutside = (e) => handleClick(e);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handleClick]);
};

export const capitalize = (value) => {
  let lowerCase = value?.toLowerCase();
  return lowerCase.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const isSuperAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.role === 'admin';
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export const capitalizeFirstLetter = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : null;
};

export const getSentToUser = (type) =>
  type === 1
    ? 'All'
    : 'Custom User'


export const getFilterKey = (value) => {
  let key = value?.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
  let returnKey = key?.toString()?.replaceAll(',', ' ');
  return capitalize(returnKey);
};

