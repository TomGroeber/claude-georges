import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ConfirmPopup = ({ open, setOpen, setAccepted, message, handleNo }) => {
  const cancelButtonRef = useRef(null);
  const {t} = useTranslation();

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50"  initialFocus={cancelButtonRef} onClose={() => {}}>
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
          <div className="flex min-h-full  justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <QuestionMarkCircleIcon
                        className="h-6 w-6 text-vacation-secondary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {t('confirm')}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm  text-gray-500">{message}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full hover:bg-inherit justify-center rounded-3xl border border-transparent bg-vacation-primary px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-vacation-secondary focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={(e) => {
                      setOpen(false);
                      setAccepted(e);
                    }}
                  >
                    {t('yes')}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full hover:bg-inherit justify-center rounded-3xl border border-gray-300 bg-white  px-6 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setOpen(false);
                      handleNo();
                    }}
                    ref={cancelButtonRef}
                  >
                    {t('no')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

ConfirmPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  setAccepted: PropTypes.func,
  handleNo: PropTypes.func,
  message: PropTypes.string
};

export default ConfirmPopup;
