import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { cleanLocalStorage, getLocalStorageItem } from '../utils/helper';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!getLocalStorageItem('token')) {
        cleanLocalStorage();
        navigate('/login', { replace: true });
      }
    };

    checkAuthentication();
  }, [navigate]);


  return (
    <Route
      {...rest}
      element={(props) =>
        getLocalStorageItem('token') && (
            <Component {...props} />
          )
      }
    />
  );
};

export default PrivateRoute;
