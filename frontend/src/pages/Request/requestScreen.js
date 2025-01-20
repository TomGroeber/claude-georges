import React, {  useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../components/common/Breadcrumb';
import Loader from '../../components/Loader';
import SelectMenu from '../../components/common/SelectMenu';
import { PER_PAGE } from '../../utils/constants';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import { errorToast, getLocalStorageItem } from '../../utils/helper';
import { useTranslation } from 'react-i18next';


const RequestScreen = () => {
  const [loader, setLoader] = useState(true);
  const {t} = useTranslation();
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [{ name: t('leaveRequests'), href: '/leaves', current: true }];
  
  
  const columns = [
      {
        title: t('name'),
        key: 'name',
        type: 'text',
        extend: true,
        align: 'center'
      },
      {
        title: t('leaveFrom'),
        key: 'startDate',
        type: 'date',
        extend: true,
        align: 'center'
      },
      {
          title: t('leaveTo'),
          key: 'endDate',
          type: 'date',
          extend: true,
          align: 'center'
        },
      {
        title: t('role'),
        key: 'role',
        type: 'text',
        extend: false,
        align: 'center'
      },
      {
        title: t('status'),
        key: 'status',
        type: 'badge',
        extend: true,
        align: 'center'
      },
      {
        title: '',
        key: 'action',
        type: 'action',
        align: 'right',
        isEdit: '/leaves-application',
      //   isView: '/users/user-profile',
      //   isDelete: true
      }
    ];
      const [sortOrder, setSortOrder] = useState(-1);
      const [sortBy, setSortBy] = useState('');
      const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
      const [filterQuery, setFilterQuery] = useState('');
      const navigate = useNavigate()
 
      const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
    
      useEffect(() => {
        if (userData.role != 'admin') {
          window.location.href = userData.role != 'admin' ? `/dashboard` : '/users';
        }
      }, [userData]);
    
      const handlePagination = (pageNumber, pageSize) => {
        setLoader(true);
        Api.getUserAppliedLeaves(pageNumber, pageSize).then((response) => {
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
        
      const handlePerPage = (perPage) => {
        setSelectedPerPage(perPage);
        handlePagination(1, perPage.value);
      };
      
      const refreshTable = () =>
        handlePagination(1, selectedPerPage?.value);
    
    //   const deleteHandler = (id) => {
    //     setLoader(true);
    //     setSearchTerm('');
    //     Api.deleteUser(id).then((response) => {
    //       if (response?.data?.meta?.code === 1) {
    //         handlePagination(1, selectedPerPage?.value, '');
    //         successToast(response?.data?.meta?.message);
    //       } else if (response?.data?.meta?.code === 0) {
    //         setLoader(false);
    //         errorToast(response?.data?.meta?.message);
    //       } else {
    //         setLoader(false);
    //       }
    //     });
    //   };
    
    useEffect(()=>{
        handlePagination(1,selectedPerPage?.value)
    },[])

    return (
        <div className="relative">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Leaves Requests | Vacation Manager Admin</title>
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
          
            </div>
          </div>
  
       
          <div className="mt-4">
            <Table
              columns={columns}
              data={usersList}
              name={'leave_requests_table'}
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
};

export default RequestScreen;