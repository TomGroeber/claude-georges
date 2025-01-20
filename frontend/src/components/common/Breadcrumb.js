import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getLocalStorageItem, isSuperAdmin } from '../../utils/helper';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Api } from '../../api';
import { Fragment, useEffect, useState } from 'react';

const Breadcrumb = ({ pageList }) => {
  const location = useLocation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const userType = userData?.userType;
  const name = userData?.name?.split(' ');
 
  return (
    <nav className=" flex px-3 mt-3 border-b border-gray-200 pb-4" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              to={`${
                userData && (userData?.role!='admin')
                  ? '/dashboard'
                  : '/dashboard'
              }`}
              className={`
                ${
                  location?.pathname === '/dashboard' ||
                  location?.pathname === '/dashboard'
                    ? 'cursor-default'
                    : 'hover:text-gray-500'
                }
                text-gray-400`}
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pageList?.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {page.nonClickable ? (
                <p className="text-vacation-primary  cursor-default ml-4 text-sm font-medium">
                  {page.name}
                </p>
              ) : (
                <Link
                  to={page.href}
                  className={`${
                    page.href === location?.pathname
                      ? 'text-vacation-primary cursor-default'
                      : 'text-gray-500 cursor-pointer hover:text-gray-700'
                  } ml-4 text-sm font-medium `}
                  aria-current={page.current ? 'page' : undefined}
                >
                  {page.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
