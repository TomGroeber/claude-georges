import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, isSuperAdmin } from '../../../utils/helper';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const TextBox = ({ open, setOpen, title, message, type, id, url, data, showButtons }) => {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleNo = () => {
    setOpen(false);
  };

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <div className="mb-2 w-full px-3 py-3">
                  <p className=" w-full text-left text-xl text-gray-700 lg:text-center lg:text-3xl">
                    {title}
                  </p>
                </div>
                <div className="bg-white px-4 pb-3">
                  <div className="sm:flex sm:items-start">
                    <div className="text-center  ">
                      <div className="flex h-[10vh] w-full flex-col gap-y-2 overflow-y-auto text-left text-xs text-gray-700 lg:h-auto lg:text-base">
                  
                        <div>
                          <p className="">
                            Message : <span className=""> {capitalizeFirstLetter(message)}</span>
                          </p>
                          <p className="">
                            {t('leaveRequest')} : {moment(data?.leaveRequest?.startDate).format("YYYY-MM-DD") + ' ' + moment(data?.leaveRequest?.startDate).format('HH:mm')} ~ {moment(data?.leaveRequest?.endDate).format("YYYY-MM-DD") + ' ' + moment(data?.leaveRequest?.endDate).format('HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {showButtons && 
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                      type="button"
                      className={`inline-flex w-full justify-center bg-vacation-primary darkBg: rounded-3xl border border-transparent font-semibold  px-6 py-2 text-base  text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() => navigate(url,{
                        state:data
                      })}
                    >
                      {t('checkIt')}
                    </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-3xl border border-gray-300 bg-white px-6 py-2 text-base font-semibold  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleNo();
                    }}
                    ref={cancelButtonRef}
                  >
                    {t('cancel')}
                  </button>
                </div>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TextBox;
