import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import Table from '../../components/common/Table';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import Loader from '../../components/Loader';
import { errorToast, getLocalStorageItem } from '../../utils/helper';
import { Helmet } from 'react-helmet';
import SelectMenu from '../../components/common/SelectMenu';
import { PER_PAGE } from '../../utils/constants';
import { useTranslation } from 'react-i18next';



const PAGE_SIZE = 10;

function HistoryScreen() {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const pages = [{ name: t('leaves'), href: '#', current: true }];
  const columns = [
    {
      title: t('fromDate'),
      key: 'startDate',
      sortable: false,
      type: 'date',
      align: 'left',
      longText: true
    },
    {
      title: t('toDate'),
      key: 'endDate',
      sortable: false,
      type: 'date',
      align: 'center',
      longText: false
    },
    {
      title: t('reason'),
      key: 'reason',
      sortable: false,
      type: 'text',
      extend: true,
      align: 'left',
    },
    {
      title: t('status'),
      key: 'status',
      sortable: false,
      type: 'badge',
      // extend:true,
      align: 'center',
    },
  
  ];
  const [user,setUser]=useState(null);
  const [loader, setLoader] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getUserAppliedLeaves(pageNumber, pageSize).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setHistoryList(response?.data?.data);
        // setTotalCount(response?.data?.meta?.totalNotifications||0);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setHistoryList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, PAGE_SIZE, searchParam);
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, PAGE_SIZE, '');
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value);
  };

  useEffect(() => {
    if (userData) {
      Api.getProfile().then((res)=>{
        if(res?.data?.meta?.code==1){
          setUser(res?.data?.data)
        }
      })
    }
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Leaves | Vacation Manager User</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
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
            <div className="flex mr-3 ml-3 self-center text-vacation-primary">
              <span className="self-center text-sm mr-2 ">{t('leavesAllowed')}</span>
              <div className="w-[40px] ">
                {user?.allowedLeaves || 0}
              </div>
            </div>
            <div className="self-center flex text-vacation-primary">
              <span className="self-center text-sm mr-2 ">{t('usedLeaves')}</span>
              <div className="w-[50px]">
              {user?.usedLeaves || 0}
              </div>
            </div>
            <div className="self-center flex text-vacation-primary">
              <span className="self-center text-sm mr-2 ">{t('availableLeaves')}</span>
              <div className="w-[40px]">
              {user?.availableLeaves || 0}
              </div>
            </div>
          </div>

       
          <div className="flex ">
            <div className="ml-3 self-center">
              <button
                type="button"
                onClick={() => navigate("/leaves/apply")}
                className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:vacation-primary focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2 sm:w-auto whitespace-nowrap"
              >
                {t('availableLeaves')}
              </button>
            </div>

          </div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={historyList}
            name={'history_table'}
            bottomBorder={totalCount > PAGE_SIZE}
            loader={loader}
            showIndex={true}
          />
        </div>
      </div>
      <div>
        {/* {historyList.length > 0 && !loader ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => handlePagination(page, PAGE_SIZE, searchTerm)}
          />
        ) : (
          <span />
        )} */}
      </div>
    </>
  );
}

export default HistoryScreen;
