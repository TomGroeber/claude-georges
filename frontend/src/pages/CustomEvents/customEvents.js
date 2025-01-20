import { Fragment, useEffect, useRef, useState } from 'react';
import Table from '../../components/common/Table';
import Breadcrumb from '../../components/common/Breadcrumb'
import Pagination from '../../components/common/Pagination/Pagination';
import {
  useOutsideClick,
  getFilterKey,
  getLocalStorageItem,
  successToast,
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import SearchInput from '../../components/common/Input/SearchInput';
import SelectMenu from '../../components/common/SelectMenu';
import {
  PER_PAGE,
} from '../../utils/constants';
import {
  Transition
} from '@headlessui/react';

import {
  XMarkIcon
} from '@heroicons/react/20/solid';
import { Api } from '../../api';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';



function CustomEvents() {
  const wrapperRef = useRef(null);
  const {t}= useTranslation();
  const pages = [{ name: t('customEvents'), href: '/custom-events', current: true }];
  const [loader, setLoader] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const columns = [
    {
      title: t('title'),
      key: 'title',
      type: 'text',
      extend: true,
      align: 'center'
    },
    {
      title: t('fromDate'),
      key: 'start',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: t('toDate'),
      key: 'end',
      type: 'date',
      extend: true,
      align: 'center'
    },
    {
      title: '',
      key: 'action',
      type: 'action',
      align: 'right',
      isEdit: '/custom-events/add-edit',
      isDelete: true
    }
  ];
  const navigate = useNavigate()

  const [filterCriteria, setFilterCriteria] = useState({
    accountType: '',
    accountStatus: '',
    jobRole: '',
    loginPlatform: ''
  });

  const calendarRef = useRef();

  useOutsideClick(calendarRef, () => {
    if (showCalendar) setShowCalendar(!showCalendar);
  });

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  useEffect(() => {
    if (userData.role != 'admin') {
      window.location.href = userData.role != 'admin' ? `/dashboard` : '/users';
    }
  }, [userData]);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getCustomEvents(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code == 1) {
        setUsersList(response?.data?.data);
        setCurrentPage(pageNumber);
        setTotalCount(response?.data?.meta?.totalRecords || 10);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setUsersList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const handleSortBy = (sortByValue) => {
    setSortBy(sortByValue);
    if (sortByValue === sortBy) {
      let tempSortOrder = sortOrder === 1 ? -1 : 1;
      setSortOrder(tempSortOrder);
      handlePagination(
        currentPage,
        selectedPerPage?.value,
        searchTerm,
        filterQuery,
        sortByValue,
        tempSortOrder
      );
    } else {
      setSortOrder(1);
      handlePagination(
        currentPage,
        selectedPerPage?.value,
        searchTerm,
        filterQuery,
        sortByValue,
        1
      );
    }
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, filterQuery, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  const filterHandler = (data, key) => {
    setFilterCriteria((prevData) => ({
      ...prevData,
      [key]: data
    }));
    let clone = JSON.parse(JSON.stringify(filterCriteria));
    const newData = { ...clone, [key]: data };
    let tempFilterQuery = [];
    Object.keys(newData).forEach(function (key) {
      if (newData[key]?.value?.toString()) {
        tempFilterQuery.push(`&${key}=${newData[key]?.value}`);
      }
    });
    let query = tempFilterQuery?.toString()?.replaceAll(',', '');
    setFilterQuery(query);
    handlePagination(1, selectedPerPage.value, searchTerm, query, sortBy, sortOrder);
  };

  const resetHandler = () => {
    setFilterCriteria({
      accountType: '',
      accountStatus: '',
      jobRole: '',
      loginPlatform: ''
    });
    setFilterQuery('');
    setSelectedFilterJob('');
    setSelected('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', filterQuery, sortBy, sortOrder);

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');
    Api.deleteCustomEvent(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        handlePagination(1, selectedPerPage?.value, '');
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  return (
    <div className="relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Custom Events | Vacation Manager Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      {loader && <Loader />}

      <div className="mt-6 px-3">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden lg:flex mr-3 self-center">
              <span className="self-center text-sm mr-2">{t('perPage')}</span>
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="self-center">
              <SearchInput
                id="searchKey"
                name="searchKey"
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchByEventName')}
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex justify-between">
            <div className=" flex lg:hidden self-center">
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex">
              <div className="ml-3 self-center">
                <button
                  type="button"
                  onClick={() => navigate("/custom-events/add-edit")}
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:vacation-primary focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2 sm:w-auto whitespace-nowrap"
                >
                 {t('addEvent')}
                </button>
              </div>
              <div className="ml-3 self-center inline-flex items-center justify-center">
              </div>
            </div>
          </div>
        </div>

        <Transition
          show={showFilterModal}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            ref={wrapperRef}
            className="absolute p-5 right-5 z-[2] mt-2 w-[100%] sm:w-[600px] lg:w-[700px] mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Filters</p>
              <div className="flex space-x-3">
                <button
                  onClick={resetHandler}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">

              <div>
                <SelectMenu
                  menuList={[
                    { name: 'All', value: null },
                    { name: 'B2C', value: false },
                    { name: 'B2B', value: true }
                  ]}
                  label="Role"
                  isRequired={false}
                  defaultSelected={filterCriteria.role}
                  setSelectedMenu={(data) => filterHandler(data, 'role')}
                />
              </div>
            </div>
          </div>
        </Transition>
        {!Object.values(filterCriteria).every((x) => x === '') && (
          <div className="border py-1 px-2 mt-3">
            <div className="flex justify-between">
              <div className="self-center overflow-auto filter-container mr-2">
                <div className="flex">
                  {Object.keys(filterCriteria).map((keyName, i) => (
                    <>
                      {filterCriteria?.[keyName]?.value?.toString() ||
                        filterCriteria?.[keyName]?.toString() ? (
                        <div className="flex bg-gray-200 px-2 py-1 mr-2 whitespace-nowrap" key={i}>
                          <p className="text-[14px] object-contain m-0 whitespace-nowrap">
                            {getFilterKey(
                              keyName === 'accountType' ? 'subscriptionStatus' : keyName
                            )}
                          </p>
                          <p className="text-[14px] m-0 whitespace-nowrap">&nbsp;: &nbsp;</p>
                          <p className="text-[14px] m-0 whitespace-nowrap ">
                            {filterCriteria?.[keyName].name || filterCriteria?.[keyName]}
                          </p>
                          <p
                            className="border cursor-pointer m-0 ml-2 self-center whitespace-nowrap"
                            onClick={() => filterHandler('', keyName)}
                          >
                            <XMarkIcon className="w-[16px] border border-vacation-primary text-white bg-vacation-secondary" />
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div className="flex self-center justify-end w-[50px]">
                <button className="px-2 py-1 bg-vacation-secondary" onClick={resetHandler}>
                  <XMarkIcon className="w-[18px] border-vacation-primary text-white bg-vacation-secondary" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Table
            columns={columns}
            data={usersList}
            name={'custom_events_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
            refreshTable={refreshTable}
            loader={loader}
            showIndex={true}
          />
        </div>
      </div>
      <div>
        {usersList.length > 0 && !loader ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) =>
              handlePagination(
                page,
                selectedPerPage?.value,
                searchTerm,
                filterQuery,
                sortBy,
                sortOrder
              )
            }
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default CustomEvents;
