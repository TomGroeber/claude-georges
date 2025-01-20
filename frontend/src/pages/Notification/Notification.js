import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Api } from '../../api';
import { errorToast, isSuperAdmin, successToast } from '../../utils/helper';
import Loader from '../../components/Loader';
import Pagination from '../../components/common/Pagination/Pagination';
import { TrashIcon } from '@heroicons/react/24/outline';
import DeletePopup from '../../components/common/modals/DeletePopup';
import LazyLoadImageProp from '../../components/common/LazyLoadImage';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';
import TextBox from '../../components/common/modals/TextBox';
import { useTranslation } from 'react-i18next';


function Notification() {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [notificationList, setNotificationList] = useState([]);
  const pages = [{ name: t('notification'), href: '#', current: true }];
  const PAGE_SIZE = 15;
  const [openDeletePopup, setDeletePopup] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idToDelete, setIdToDelete] = useState('');
  const [deleteType, setDeleteType] = useState();
  const [show, setShow] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handlePagination = (pageNumber, pageSize) => {
    setLoader(true);

    Api.getAllNotifications(pageNumber, pageSize).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setNotificationList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setNotificationList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });

  };

  const deleteHandler = (id) => {
    setIdToDelete(id);
    setDeletePopup(true);
    setDeleteType(id ? 1 : 2)
  };

  const handleDeletePopup = () => {
    setLoader(true);
    Api.deleteNotifications(idToDelete)
      .then((response) => {
        if (response?.data?.meta?.code === 1) {
          successToast(response?.data?.meta?.message);
          handlePagination(1, PAGE_SIZE);
        } else {
          errorToast(response?.data?.meta?.message || t('somethingWentWrong'));
        }
      })
      .finally(() => {
        setLoader(false);
        setDeletePopup(false);
      });
    setIdToDelete('');

  };

  useEffect(() => {
    handlePagination(1, PAGE_SIZE);
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      {notificationList?.length > 0 ? (
        <div className="mt-3 mx-3">
          <div className="text-right">
            <button
              onClick={() =>  deleteHandler('') }
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-3xl border border-gray-300  bg-white px-6 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {t('clearAllNotifications')}
            </button>
          </div>
          <div className="mt-3 mx-3 overflow-hidden border border-gray-200 bg-white rounded-t-md">
            <ul role="list" className="">
              {notificationList?.map((item, index) => (
                <li
                  key={index}
                  className={`group px-4 py-4 lg:py-2 hover:bg-gray-50 cursor-pointer ${item?.isRead
                    ? 'border-gray-200 border-b'
                    : 'shadow-sm bg-white border-b-2 border-gray-300'
                    }`}
                >
                  <div className="w-full lg:flex justify-between">
                    <div

                      className="lg:flex lg:w-[calc(100%-150px)]"
                    >
                      <div className="flex justify-between lg:w-[220px] lg:pr-3">
                        <div className="flex">
                          <div className="h-8 w-8 flex-shrink-0">
                            {item?.fromUser?.userProfile ? (
                              // {false ? (
                              <LazyLoadImageProp
                                imageSrc={item?.fromUser?.userProfile}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div
                                onClick={() => {
                                  setShow(!show);
                                  setSelectedNotification(item);
                                }}
                                className="bg-black text-sm flex justify-center items-center h-8 w-8 rounded-full">
                                <span className="text-white capitalize">
                                  {item?.fromUser?.firstName?.split(' ')[0]?.charAt(0)}
                                </span>
                                <span className="text-white capitalize">
                                  {item?.fromUser?.firstName?.split(' ')[1]?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-2 self-center">
                            <div
                              onClick={() => {
                                setShow(!show);
                                setSelectedNotification(item);
                              }}
                              className={`text-sm ${item?.isRead
                                ? 'text-gray-500'
                                : 'text-gray-500 font-bold'
                                }`}
                            >
                              {item?.fromUser?.firstName}
                            </div>
                          </div>
                        </div>
                        <div className="lg:hidden block">
                          {/* <p className="text-right group-hover:hidden block text-gray-400 self-center text-[12px]">
                            {moment(item?.publishedOn).format('lll')}
                          </p> */}
                          <p className="group-hover:block hidden ml-auto text-gray-400 text-[12px]">
                            <TrashIcon
                              onClick={() => deleteHandler(item?.id)}
                              className="text-right ml-auto w-[20px] text-red-500"
                            />
                          </p>
                        </div>
                      </div>
                      <div className="flex lg:mt-0 mt-2 lg:w-[calc(100%-220px)]">
                        <p
                          onClick={() => {
                            setShow(!show);
                            setSelectedNotification(item);
                          }}
                          className={`lg:ml-5 inline-block whitespace-nowrap overflow-hidden overflow-ellipsis text-sm self-center ${item?.isRead ? 'text-gray-500' : 'text-gray-500 font-bold'
                            }`}
                        >
                          {item.title}{' '}
                          <span className="text-gray-400 font-normal">- {item.message}</span>
                        </p>
                      </div>
                    </div>
                    <div className="lg:block hidden self-center">
                      {/* <p className="lg:w-[150px] group-hover:hidden block text-right text-gray-400 text-[12px]">
                        {moment(item?.createdAt).format('lll')}
                      </p> */}
                      <p className="lg:w-[150px] group-hover:block hidden ml-auto text-gray-400 text-[12px]">
                        <TrashIcon
                          onClick={() => deleteHandler(item?.id)}
                          className="text-right ml-auto w-[20px] text-red-500"
                        />
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-6 mx-3 text-center">
          <div className="py-[20px] bg-white border-t border-[#EAEAEA] w-full">
            <NoDataFoundImg
              className={`m-auto text-indigo-50 border border-vacation-blue rounded-lg`}
            />
            <p className="text-center text-vacation-gray4 text-sm mt-3">{t('noNotifications')}</p>
          </div>
        </div>
      )}
      <div>
        {totalCount > PAGE_SIZE ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => handlePagination(page, PAGE_SIZE, '')}
          />
        ) : (
          <span />
        )}
      </div>
      {openDeletePopup && (
        <DeletePopup
          open={openDeletePopup}
          title={deleteType === 1 ? t('deleteNotification') : t('deleteAllNotification')}
          message={`${deleteType === 1 ? t('deleteNotificationMessage') : t('AreYouSureDeleteNotifications')}`}
          setOpen={setDeletePopup}
          setDelete={handleDeletePopup}
        />
      )}
      {show && (
        <TextBox
          open={show}
          message={selectedNotification?.message}
          setOpen={setShow}
          type={selectedNotification?.type}
          title={selectedNotification?.title}
          id={selectedNotification?._id || selectedNotification.id}
          url={'/leaves-notification'}
          data={selectedNotification}
          showButtons={isSuperAdmin()}
        />
      )}
    </>
  );
}

export default Notification;
