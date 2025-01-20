import axios from 'axios';

import {
  cleanLocalStorage,
  errorToast,
  getJWTToken,
  getLocalStorageItem,
  setLocalStorageItem
} from '../utils/helper';

import { API_BASE_URL } from '../core/env.configs';

const BASE_URL = API_BASE_URL || '';

const GetApi = async (tag = '', isHeader = false) => {
  try {
    const data = await axios.get(BASE_URL + 'api' + tag, {
      headers: isHeader
        ? {
          Authorization: getJWTToken(),
          "ngrok-skip-browser-warning": "69420"
        }
        : {
          "ngrok-skip-browser-warning": "69420"
        }
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};

const PostApi = async (tag = '', reqBody, isHeader = false, flag = false) => {
  let flagCheck = flag
    ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
    : 'application/json';

  try {
    const data = await axios.post(BASE_URL + 'api' + tag, reqBody, {
      headers: isHeader
        ? {
          'Content-Type': flagCheck,
          accept: 'application/json',
          Authorization: getJWTToken()
        }
        : {}
    });
    return data;  // Return the full response, which includes data, status, etc.
  } catch (e) {
    ErrorHandler(e);  // Ensure this properly handles the error or logs it
    return null; // Ensure something is returned, even on error
  }
};


const DeleteApi = async (tag = '', isHeader = false) => {
  try {
    const data = await axios.delete(BASE_URL + 'api' + tag, {
      headers: isHeader
        ? {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: getJWTToken(),
        }
        : {}
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};

const PatchApi = async (tag = '', reqBody, isHeader, isJSON = false) => {
  const contentType = {
    'Content-Type': 'application/json'
  };
  const headers = {
    accept: 'application/json',
    Authorization: getJWTToken(),
    ...(isJSON ? contentType : {})
  };
  try {
    const data = await axios.patch(BASE_URL + 'api' + tag, reqBody !== null && reqBody, {
      headers: isHeader ? headers : {}
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};



const ErrorHandler = async (e) => {
  if (e.response?.data?.message) {
    if (e.response?.data?.code === 498) {
      RefreshToken();
    } else if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = '/login';
    } else {
      errorToast(e.response?.data?.message);
    }
  } else if (e.response?.data) {
    if (e.response?.data?.meta?.code === 498) {
      RefreshToken();
    } else if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = '/login';
    } else if (e.response?.status === 400) {
      errorToast(e.response?.data?.meta?.message);
    } else {
      errorToast(e.response?.data?.message);

    }
  } else {
    errorToast(`Quelque chose s'est mal passé.`);
  }
};

const RefreshToken = async () => {
  await axios
    .post(
      `${BASE_URL}/api/users/refresh`,
      { 'refresh': getLocalStorageItem('refreshToken') },
    )
    .then(async (response) => {
      if (response.data) {
        setLocalStorageItem('token', response?.data?.meta?.access);
        window.location.reload();
      }
    })
    .catch(async (error) => {
      if (error.response.code === 401) {
        // await Api.logoutUser();
        cleanLocalStorage();
        window.location.href = '/login';
      } else {
        cleanLocalStorage();
        window.location.href = '/login';
      }
    });
};

export const Api = {
  login: (reqBody) => PostApi('/users/login', reqBody),
  getAllUsers: (pageNumber, pageSize, searchKey) => GetApi(`/users/list?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKey=${searchKey}`, true),
  addEditUser: (reqBody) => PostApi('/users/create', reqBody, true),
  deleteUser: (id) => DeleteApi(`/users/${id}`, true),
  getUserDetail: (id) => GetApi(`/users/${id}`, true),
  changePassword: (reqBody) => PostApi('/users/change-password', reqBody, true),
  getProfile: () => GetApi('/users/self', true),
  updateUser: (id, reqBody) => PatchApi(`/users/${id}`, reqBody, true),
  updateBoundaries: (reqBody) => PatchApi('/users/limits', reqBody, true),
  getBoundaries: () => GetApi('/users/limits', true),
  applyLeave: (reqBody) => PostApi('/time-off/', reqBody, true),
  getEvents: (month,year) => GetApi(`/time-off/?month=${month}&year=${year}`, true),
  getNotificationCount: () => GetApi('/notifications/count', true),
  getAllNotifications: (pageNumber, pageSize) => GetApi(`/notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`, true),
  deleteNotifications: (id) => DeleteApi(`/notifications/?id=${id}`, true),
  leaveStatusUpdate: (id, reqBody) => PatchApi(`/time-off/${id}/approval`, reqBody, true),
  getUserAppliedLeaves: (pageNumber, pageSize) => GetApi(`/time-off/list?pageNumber=${pageNumber}&pageSize=${pageSize}`, true),
  addCustomEvent : (reqBody) => PostApi('/events/', reqBody, true),
  editCustomEvent : (id, reqBody) => PatchApi(`/events/${id}`, reqBody, true),
  deleteCustomEvent : (id) => DeleteApi(`/events/${id}`, true),
  getCustomEvents : (pageNumber,pageSize,searchKey) => GetApi(`/events/?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKey=${searchKey}`, true),
};
