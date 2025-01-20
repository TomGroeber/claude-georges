import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeletePopup from './modals/DeletePopup';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpDownIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';
import ConfirmPopup from './modals/ConfirmPopup';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { Listbox, Popover, Transition } from '@headlessui/react';
import Loader from '../Loader';

const Table = ({
  columns,
  data = [],
  setDeleteId,
  setSelectedRow,
  name,
  addNewURL,
  sortBy,
  setSortBy,
  sortOrder,
  refreshTable,
  contentType,
  loader,
  setSearchTerm,
  showIndex,
  onNameClick,
  isEdit = false,
  isdetail = true,
  isname = false,
  handleDropdownChange,
  options
}) => {
  const {t} = useTranslation();
  const checkbox = useRef({ indeterminate: false });
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRowOfTable, setSelectedRowOfTable] = useState(null);
 
  useLayoutEffect(() => {
    if (data?.length > 0) {
      const isIndeterminate = selectedData.length > 0 && selectedData.length < data.length;
      setChecked(selectedData.length === data.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedData, data.length]);

  function toggleAll() {
    setSelectedData(checked || indeterminate ? [] : data?.map((temp) => temp.id));
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const [openDeletePopup, setDeletePopup] = useState(false);
  const [bulkOperationPopup, setBulkOperationPopup] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openVideoPlayer, setVideoPlayer] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [activePlaying, setActivePlaying] = useState(null);
  const [actionType] = useState('');
  const [open, setOpen] = React.useState(false);
  const [focusData, setFocusData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const deleteHandler = (id) => {
    setIdToDelete(id);
    setDeletePopup(true);
  };

  const focusPopUpHandler = (state) => {
    setFocusData([]);
    setOpenFocusPopup(true);
    setFocusData(state);
  };

  const formattedData = (rowData, data, type, column, index) => {
    const handleOldNew = (state) => {
      navigate(column.isTwoOption, {
        state: { ...rowData, action: 'view', option: state?.value === 1 ? 1 : 2 }
      });
    };

    if (type === 'badge') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === 'approved' ? 'bg-green-100' : data==='pending'? 'bg-yellow-300' : 'bg-red-100'
          } px-3 py-1 text-md leading-5 capitalize font-semibold tracking-normal ${
            data === 'approved' ? 'text-green-700' : data==='pending'? 'text-yellow-600' : 'text-red-700'
          }`}
        >
          {data === 'approved' ? t('approved') : data==='pending'?t('pending'): t('rejected')}
        </p>
      );
    } else if (type === 'userType') {
      return getUserType(data);
    } else if (type === 'sentToUser') {
      return getSentToUser(data);
    } else if (type === 'profile') {
      let username = rowData.firstName?.split(' ');
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div>
              {/* {data && <LazyLoadImageProp imageSrc={data ? data : ProfilePic} />} */}
              {!data && (
                <div className="bg-black flex justify-center items-center h-10 w-10 rounded-full">
                  <span className="text-white">{username[0]?.charAt(0)}</span>
                  <span className="text-white">{username[1]?.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          {isdetail && !isname && (
            <div className="ml-4">
              <div className="font-medium text-gray-900">{rowData?.firstName} {rowData?.lastName}</div>
              <div className="text-gray-500 lowercase">{rowData?.email}</div>
            </div>
          )}
          {/* {isname && column?.isView && (
            <div className="ml-4">
              <div
                className=" hover:text-blue-700 underline"
                onClick={() => navigate(column?.isView, { state: { ...rowData, action: 'edit' } })}
              >
                {rowData.name}
              </div>
            </div>
          )} */}
        </div>
      );
    }else if (type === 'action') {
      return (
        <div className="flex items-center justify-end">
          {column.isEdit && (
            <PencilSquareIcon
              className="w-[20px] ml-2 text-vacation-secondary cursor-pointer"
              onClick={() => {
                
                  navigate(column.isEdit,{
                    state: { ...rowData, action: 'edit' }
                  });
                
              }}
            />
          )}
          {column.isClone && (
            <DocumentDuplicateIcon
              className="w-[20px] ml-2 text-vacation-secondary cursor-pointer"
              // onClick={() => {
              //   if (column.handleEdit) {
              //     column.handleEdit(rowData);
              //   } else {
              //     navigate(buildUrlWithId(column.isEdit,column.isDraft), {
              //       state: { ...rowData, action: 'edit' }
              //     });
              //   }
              // }}
            />
          )}
          {column?.isView && (
            <EyeIcon
              className="w-[20px] ml-2 text-vacation-secondary cursor-pointer"
              onClick={() => {
                if (column.handleEdit) {
                  column.handleEdit(rowData);
                } else {
                  navigate(column.isView, {
                    state: { ...rowData, action: 'edit' }
                  });
                }
              }}
            />
          )}
          {/* For Survey we don't want enter in this condition */}
          {column?.isTwoOption &&
            (rowData.parentId ? (
              <div>
                <EyeIcon
                  className="w-[20px] ml-2 text-vacation-secondary cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
                {open && (
                  <Listbox onChange={(state) => handleOldNew(state)}>
                    {() => (
                      <>
                        <div className="relative">
                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="right-0 absolute shadow-lg text-center cursor-pointer z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {CONTENT_APPROVAL_TYPE.map((menu, index) => (
                                <Listbox.Option
                                  key={index}
                                  className="text-gray-900 relative cursor-default  py-2 pl-3 pr-9 hover:text-white hover:bg-vacation-primary"
                                  disabled={menu?.value === ''}
                                  value={menu}
                                >
                                  <span className="font-normal cursor-pointer">{menu?.name}</span>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                )}
              </div>
            ) : (
              <EyeIcon
                className="w-[20px] ml-2 text-vacation-secondary cursor-pointer"
                onClick={() => {
                  let uri = column.isTwoOption;
                  if (rowData?.contentType === 8 || name === 'survey_table_data') {
                    uri = getPathForSurvey(
                      `/view-survey/${
                        rowData?.contentType === 8 ? rowData?.content_type_id : rowData?.id
                      }?type=${name === 'content_approval' ? 'approval' : 'preview'}`
                    );
                  }
                  navigate(uri, {
                    state: { ...rowData, action: 'view' }
                  });
                }}
              />
            ))}
          {column.isDelete && (
            <TrashIcon
              className="w-[20px] ml-2 text-red-500 cursor-pointer"
              onClick={() => deleteHandler(rowData?.id || rowData?._id)}
            />
          )}
          {column.isResend && (
            <div
              className="text-vacation-secondary cursor-pointer"
              onClick={() => {
                setSelectedRowOfTable(rowData);
                setOpenConfirmPopup(true);
              }}
            >
              Resend
            </div>
          )}

          {column?.isDownload && rowData?.download ? (
            <ArrowDownTrayIcon
              className="w-[20px] ml-2 text-vacation-secondary cursor-pointer"
              onClick={() => {
                handleDownload(rowData?.download);
              }}
            />
          ) : column?.isDownload && !rowData?.download ? (
            'N/A'
          ) : (
            ''
          )}
          {column?.isReport && (
            <Popover className="">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
                ${
                  open ? '' : 'text-opacity-90'
                } px-2 py-1 text-xs font-medium text-vacation-secondary shadow-sm hover:vacation-primary focus:outline-none sm:w-auto`}
                  >
                    <ArrowDownTrayIcon className="w-[20px] cursor-pointer" />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="bg-white rounded-md border absolute right-0 z-40 mt-1 max-w-[15rem] -translate-y-6 -translate-x-14 transform">
                      <p
                        className="px-4 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => column?.isReport(rowData, 'CSV')}
                      >
                        Download CSV
                      </p>
                      <p
                        className="px-4 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => column?.isReport(rowData, 'PDF')}
                      >
                        Download PDF
                      </p>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          )}
        </div>
      );
    }else if (type === 'boolean') {
      return (
        <>
          <p
            className="w-[3rem] min-w-[2rem] inline-block overflow-hidden overflow-ellipsis text-center"
            id={column.key + rowData.id}
          >
            {data ? 'Yes' : 'No'}
          </p>
        </>
      );
    } else if (type === 'button') {
      return (
        <>
          <button class="hover:bg-blue-800 text-white font-light mr-1  px-8 rounded-3xl bg-vacation-primary">
            Pause
          </button>

          <button class="bg-red-600 hover:bg-red-800 text-white font-light  px-3 rounded-3xl">
            Deactivate
          </button>
        </>
      );
    } else if (type === 'text') {
      return data ? (
        <>
          {column.longText ? (
            <p
              className="w-[20rem] min-w-[8rem] inline-block overflow-hidden overflow-ellipsis"
              id={column.key + rowData.id}
              data-tooltip-id={column.key + rowData.id}
              data-tooltip-content={data?.name}
            >
              {data}
              {data.length >= 35 && <ReactTooltip id={column.key + rowData.id} />}
            </p>
          ) : (
            data
          )}
        </>
      ) : (
        'N/A'
      );
    } else if (type === 'date') {
      return data ? moment(data).format('MMM D, YYYY') : 'N/A';
    }  else if (type === 'array') {
      const array = data.slice(0, 2);
      return (
        <div>
          {array?.map((value, key) => (
            <div key={key}>
              {key === array.length - 1 ? value?.display_name : value?.display_name + ','}
            </div>
          ))}
          {data?.length > 2 ? (
            <div
              className="text-blue-800 font-medium cursor-pointer"
              onClick={() => focusPopUpHandler(data)}
            >
              +{data.length - array.length} more
            </div>
          ) : null}
        </div>
      );
    }
  };

  const handleDeletePopup = () => {
    setDeletePopup(false);
    setDeleteId(idToDelete);
    setIdToDelete('');
  };

  // const handleBulkOperation = () => {
  //   setBulkOperationPopup(false);
  //   setSearchTerm('');
  //   if (name === 'users_table') {
  //     const payload = {
  //       userIds: selectedData,
  //       userStatus: actionType
  //     };
  //     Api.postUserBulkAction(payload).then((response) => {
  //       if (response.data.meta.code === 1) {
  //         successToast(response.data.meta.message);
  //         setSelectedData([]);
  //         setChecked(false);
  //         setIndeterminate(false);
  //         refreshTable();
  //       } else if (response.data.meta.code === 0) {
  //         errorToast(response.data.meta.message);
  //       }
  //     });
  //   } else {
  //     const payload = {
  //       contentIds: selectedData,
  //       contentType: contentType,
  //       contentStatus: actionType
  //     };
  //     //api call to delete
  //     Api.postBulkAction(payload).then((response) => {
  //       if (response.data.meta.code === 1) {
  //         successToast(response.data.meta.message);
  //         setSelectedData([]);
  //         setChecked(false);
  //         setIndeterminate(false);
  //         refreshTable();
  //       } else if (response.data.meta.code === 0) {
  //         errorToast(response.data.meta.message);
  //       }
  //     });
  //   }
  // };

  const handleResendNotification = (e, row) => {
    e.preventDefault();
    setSelectedRow(row);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="inline-block min-w-full pt-2 align-middle ">
            <div
              className={`overflow-hidden border border-gray-200 shadow rounded-t-[15px]`}
            >
              {data?.length > 0 ? (
                <table className="min-w-full divide-y  divide-[#EAEAEA]">
                  <thead className="">
                    <tr>
                      {showIndex && (
                        <th className="text-sm p-3 bg-vacation-secondary text-left text-white">
                          S No.
                        </th>
                      )}
                      {columns?.map((column, index) => {
                        const isColumnHighlighted =
                          column.sortable && sortBy && sortBy === column?.sortKey;
                        const widthClasses = column.width
                          ? `max-w-[${column.width}px] min-w-[20px] text-ellipsis overflow-hidden whitespace-nowrap`
                          : '';
                        const minusWidthClasses = column.width
                          ? `max-w-[${Math.max(
                              column.width - 20,
                              20
                            )}px] text-ellipsis overflow-hidden whitespace-nowrap`
                          : '';
                        return (
                          <Fragment key={index}>
                            {column.type === 'checkBox1' ? (
                              <th
                                scope="col"
                                className={`bg-gray-300 relative w-12 px-6 sm:w-16 sm:px-8 ${widthClasses}`}
                              >
                                <input
                                  type="checkbox1"
                                  className={`${
                                    data.length !== 0 && 'cursor-pointer'
                                  } absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border border-[blue] accent-vacation-primary sm:left-6`}
                                  ref={checkbox}
                                  checked={checked}
                                  onChange={toggleAll}
                                  disabled={data.length === 0}
                                />
                              </th>
                            ) : (
                              <th
                                key={index}
                                scope="col"
                                className={`p-3 bg-vacation-secondary text-white ${
                                  column.sortable ? 'cursor-pointer' : ''
                                } ${
                                  columns[0]?.type === 'checkBox' &&
                                  index === 1 &&
                                  column.type !== 'play'
                                    ? 'min-w-[14rem]'
                                    : ''
                                } ${
                                  column.style?.align ||
                                  (column.align === 'left'
                                    ? 'text-left'
                                    : column.align === 'center'
                                    ? 'text-center'
                                    : 'text-right')
                                } ${column.extend ? 'min-w-[13rem] ' : ''} text-sm font-normal ${
                                  isColumnHighlighted
                                    ? 'text-vacation-primary'
                                    : 'text-black  '
                                } ${widthClasses}`}
                              >
                                {column.sortable ? (
                                  <Fragment>
                                    <ReactTooltip id={`table-col-${index}-tip`} />
                                    <div
                                      data-tooltip-id={`table-col-${index}-tip`}
                                      data-tooltip-content={column.title}
                                      className="flex "
                                      onClick={() =>
                                        setSortBy(column?.sortKey ? column?.sortKey : column.key)
                                      }
                                    >
                                      <span className={`self-center ${minusWidthClasses}`}>
                                        {column.title}{' '}
                                      </span>
                                      <span className="self-center">
                                        {column.sortable ? (
                                          sortBy && sortOrder && sortBy === column?.sortKey ? (
                                            sortOrder === 1 ? (
                                              <ChevronDoubleUpIcon className="ml-2 w-4" />
                                            ) : (
                                              <ChevronDoubleDownIcon className="ml-2 w-4" />
                                            )
                                          ) : (
                                            <ChevronUpDownIcon className="w-[20px]" />
                                          )
                                        ) : (
                                          ''
                                        )}
                                      </span>
                                    </div>
                                  </Fragment>
                                ) : (
                                  column.title
                                )}
                              </th>
                            )}
                          </Fragment>
                        );
                      })}
                    </tr>
                  </thead>
                  {/* divide-y */}
                  <tbody className=" divide-[#EAEAEA] bg-white">
                    {loader ? (
                      <tr>
                        <td>
                          <Loader />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {data?.length > 0 ? (
                          data?.map((data, index) => {
                            return (
                              <tr
                                key={index}
                                className="hover:bg-gray-100 md:cursor-pointer"
                              >
                                {showIndex && (
                                  <td className="p-3 text-sm text-[#606060] whitespace-nowrap">
                                    {index + 1}.
                                  </td>
                                )}
                                {columns?.map((column, index1) => {
                                  const hasAnyDarkTextColumn = columns.some(
                                    (column) => column.darkText
                                  );
                                  const widthClasses = column.width
                                    ? `max-w-[${column.width}px] min-w-[20px] text-ellipsis overflow-hidden whitespace-nowrap`
                                    : '';
                                  return (
                                    <Fragment key={index1}>
                                      {column.type === 'checkBox' ? (
                                        <td
                                          className={`relative w-12 px-6 sm:w-16 sm:px-8 ${widthClasses}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="cursor-pointer absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 accent-blue-200 sm:left-6"
                                            value={data.id}
                                            checked={selectedData.includes(data.id)}
                                            onChange={(e) =>
                                              setSelectedData(
                                                e.target.checked
                                                  ? [...selectedData, data.id]
                                                  : selectedData.filter((p) => p !== data.id)
                                              )
                                            }
                                          />
                                        </td>
                                      ) : column.type === 'companyName' ? (
                                        <td
                                          className={`test1 whitespace-nowrap ${
                                            column.style?.align ||
                                            (column.align === 'left'
                                              ? 'text-left'
                                              : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-right')
                                          } p-3 text-sm text-[#606060] ${
                                            column.transform ? column.transform : ''
                                          } ${widthClasses}`}
                                        >
                                          <div className="flex flex-row items-center gap-2">
                                            <p className="whitespace-nowrap">
                                              {formattedData(
                                                data,
                                                data[column.key1],
                                                column.type,
                                                column,
                                                index1,
                                                column?.parant,
                                                column?.parantURL
                                              )}
                                            </p>
                                          </div>
                                        </td>
                                      ) : (
                                        <td
                                          key={index}
                                          className={`${
                                            column.style?.align ||
                                            (column.align === 'left'
                                              ? 'text-left'
                                              : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-right')
                                          }
                                          p-3 text-sm text-[#606060] 
                                          ${column.transform || ''} 
                                          ${
                                            column.darkText ||
                                            (!hasAnyDarkTextColumn && index1 === 0)
                                              ? ''
                                              : column.style?.opacity || 'opacity-50'
                                          } 
                                          ${widthClasses}`}
                                        >
                                          {column?.nested
                                            ? formattedData(
                                                data,
                                                data[column.key1]?.[column.key2],
                                                column.type,
                                                column,
                                                index1
                                              )
                                            : formattedData(
                                                data,
                                                data[column.key],
                                                column.type,
                                                column,
                                                index1,
                                                column?.parant,
                                                column?.parantURL
                                              )}
                                        </td>
                                      )}
                                    </Fragment>
                                  );
                                })}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={columns.length}>
                              <div className="py-[20px] bg-white border-t border-[#EAEAEA] w-full">
                                <NoDataFoundImg
                                  className={`m-auto text-indigo-50 border border-vacation-blue rounded-lg`}
                                />
                                <p className="text-center text-vacation-gray4 text-sm mt-3">
                                  {t('noResult')}
                                </p>
                                {addNewURL && (
                                  <div className="text-center mt-3">
                                    <button
                                      type="button"
                                      onClick={() => navigate(addNewURL)}
                                      className="items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:vacation-primary focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2 sm:w-auto whitespace-nowrap"
                                    >
                                      {t('addNew')}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="h-full py-8 bg-white rounded-2xl border-[#EAEAEA] w-full">
                  <NoDataFoundImg
                    className={`m-auto text-indigo-50 border border-vacation-blue rounded-lg`}
                  />
                  <p className="text-center text-vacation-gray4 text-sm mt-3">{t('noResult')}</p>
                  {addNewURL && (
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={() => navigate(addNewURL)}
                        className="items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:vacation-primary focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2 sm:w-auto whitespace-nowrap"
                      >
                        {t('addNew')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {openDeletePopup && (
        <DeletePopup
          open={openDeletePopup}
          setOpen={setDeletePopup}
          setDelete={handleDeletePopup}
        />
      )}
     
    </>
  );
};

export default Table;
