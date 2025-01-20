import React, { Fragment, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonInput from '../../components/common/Input/CommonInput';
import { Helmet } from 'react-helmet';
import Loader from '../../components/Loader';
import moment from 'moment';
import { Api } from '../../api';
import { successToast, useOutsideClick } from '../../utils/helper';
import CommonTextarea from '../../components/common/CommonTextarea';
import ConfirmPopup from '../../components/common/modals/ConfirmPopup';
import { Transition } from '@headlessui/react';
import { DateRangePicker } from 'react-date-range';
import { fr } from 'react-date-range/dist/locale';
import { TimePicker } from 'rsuite';
import { useTranslation } from 'react-i18next';


const LeaveApplicationAdmin = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false);
    const [comment, setComment] = useState('');
    const [leaveStatus, setStatus] = useState('rejected');
    const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedStartTimeRange, setSelectedStartTimeRange] = useState('00:00');
    const [selectedEndTimeRange, setSelectedEndTimeRange] = useState('00:00');
    const [leaveDateRange, setLeaveDateRange] = useState({
        startDate: new Date(location?.state?.startDate),
        endDate: new Date(location?.state?.endDate)
    });
    const [form, setForm] = useState({
        startDate: new Date(),
        endDate: new Date(),
        reason: '',
        startTime: '',
        endTime: ''
    });
    const wrapperRef = useRef();

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [editTime, setEditTime] = useState(false);


    const navigate = useNavigate();

    useOutsideClick(wrapperRef, () => {
        if (showFilterModal) {
            setShowFilterModal(false);
        }

    });

    const handleSubmit = (status, skip = false) => {

        const startDateTime = new Date(leaveDateRange.startDate);
        const endDateTime = new Date(leaveDateRange.endDate);

        if(editTime){
            const [startHour, startMinute] = selectedStartTimeRange.split(':');
            startDateTime.setHours(startHour, startMinute, 0, 0);
            const [endHour, endMinute] = selectedEndTimeRange.split(':');
            endDateTime.setHours(endHour, endMinute, 0, 0);
        }else{
            startDateTime.setHours(moment(location?.state?.startDate).format('HH'), moment(location?.state?.startDate).format('mm'), 0, 0);
            endDateTime.setHours(moment(location?.state?.endDate).format('HH'), moment(location?.state?.endDate).format('mm'), 0, 0);
        }

        let payload = {
            startDate: moment(startDateTime).format('YYYY-MM-DDTHH:mm:ss'),
            endDate: moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss'),
            status,
            comment,
            skipWarning: skip
        }


        Api.leaveStatusUpdate(location?.state?.id, payload).then((res) => {
            if (res?.data?.meta?.code == 1) {
                successToast(res?.data?.meta?.message)
                setLoader(false);
                navigate('/leaves')
            } else if (res?.data?.meta?.code === 0) {
                setLoader(false);
                errorToast(res?.data?.meta?.message);
            } else if (res?.data?.meta?.code === 2) {
                setLoader(false);
                setMessage(res?.data?.meta?.message);
                setOpenConfirmPopup(true);
            } else {
                setLoader(false);
            }
        })
            .catch(err => {
                setLoader(false);
            })
    }

    const handleNo = () => {
        setOpenConfirmPopup(false);
    };


    const handleSelectRange = (e) => {
        let start = new Date(e?.selection?.startDate);
        let end = new Date(e?.selection?.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const date = {
            startDate: start,
            endDate: end
        };
        setLeaveDateRange(date);
    };

    const handleStartTimeRangeChange = (value) => {
        // Extract hours and minutes
        const startTime = value;

        const formatTime = (time) => {
            if (!time) return ""; // If no time is selected, return an empty string
            const hours = time.getHours();
            const minutes = time.getMinutes();
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Format as "HH:mm"
        };

        setSelectedStartTimeRange(formatTime(startTime));
    };

    const handleEndTimeRangeChange = (value) => {
        // Extract hours and minutes
        const endTime = value;

        const formatTime = (time) => {
            if (!time) return ""; // If no time is selected, return an empty string
            const hours = time.getHours();
            const minutes = time.getMinutes();
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Format as "HH:mm"
        };

        setSelectedEndTimeRange(formatTime(endTime));
    };

    return (
        <>
            {loader && <Loader />}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Leave Approval | Vacation Manager Admin</title>
            </Helmet>
            <div className="mt-6 px-3">

                <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white gap-4">

                    <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">

                        <CommonInput
                            id="fromUser"
                            name="fromUser"
                            value={location?.state?.name}
                            type="text"
                            label={t('leaveRequestFrom')}
                            disabled={true}
                        />

                        <CommonInput
                            id="reason"
                            name="reason"
                            value={location?.state?.reason}
                            type="text"
                            label={t('reason')}
                            disabled={true}
                        />

                        <div className="relative w-full">
                            <label
                                htmlFor={"days"}
                                className="text-md block font-medium text-gray-700"
                            >
                                {t('dates')}
                                <span className={`text-red-400`}>&#42;</span>
                            </label>
                            <div
                                onClick={() => setShowFilterModal((state) => !state)}
                                className={`mt-1 block w-full cursor-pointer appearance-none rounded-3xl border border-gray-300 px-4 py-3 placeholder-gray-400 outline-none focus:outline-none `}
                            >
                                {form.startDate ? (
                                    `${moment(leaveDateRange.startDate).format("YYYY-MM-DD")} ~ ${moment(leaveDateRange.endDate).format("YYYY-MM-DD")}`
                                ) : (
                                    <div className="text-gray-400">
                                        {t('dates')}
                                    </div>
                                )}
                            </div>
                            {showFilterModal && (
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
                                        className="absolute left-0 scale-y-[70%] scale-x-[80%] md:scale-x-[100%] md:scale-y-[90%]  top-0 z-50 mx-auto mt-2  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        ref={wrapperRef}
                                    >
                                        <DateRangePicker
                                            locale={fr}
                                            ranges={[
                                                {
                                                    startDate: leaveDateRange?.startDate ? leaveDateRange?.startDate : new Date(),
                                                    endDate: leaveDateRange?.endDate ? leaveDateRange?.endDate : new Date(),
                                                    key: 'selection'
                                                }
                                            ]}
                                            onChange={handleSelectRange}
                                        />
                                    </div>
                                </Transition>
                            )}
                        </div>

                        <div className='flex flex-col m-auto lg:m-0 w-full lg:w-[430px]'>
                            <div className='flex gap-x-6 md:gap-x-3 mb-3 w-full'>
                                <div className='!w-full mb-1 flex items-center gap-x-3'>
                                    {location?.state &&
                                        <p className='block text-sm font-medium text-gray-700'>{t('userSelectedSlots')} : {moment(location?.state?.startDate).format('HH:mm')} ~ {moment(location?.state?.endDate).format('HH:mm')}
                                        </p>
                                    }
                                    <button
                                        className="rounded-3xl text-white border bg-vacation-primary bg-gradient-to-r py-1 px-3 text-sm font-medium shadow-sm focus:outline-none "
                                        onClick={() => setEditTime(!editTime)}
                                    >{editTime ? t('cancel') : t('edit')}</button>
                                </div>


                            </div>

                            {editTime &&
                                <div className='flex gap-x-6 md:gap-x-3 w-full'>
                                    <div className='!w-full'>
                                        <p className='block text-sm mb-1 font-medium text-gray-700'>{t('startSlot')}</p>
                                        <TimePicker
                                            hideHours={hour => hour < 7 || hour > 16}
                                            onChange={handleStartTimeRangeChange}
                                            // hideMinutes={minute => minute % 15 !== 0} 
                                            editable={false}
                                            showNow={false}
                                        />
                                    </div>
                                    <div className='!w-full'>
                                        <p className='block text-sm mb-1 font-medium text-gray-700'>{t('endSlot')}</p>
                                        <TimePicker
                                            hideHours={hour => hour < 7 || hour > 16}
                                            onChange={handleEndTimeRangeChange}
                                            // hideMinutes={minute => minute === 0} 
                                            editable={false}
                                            showNow={false}
                                        />
                                    </div>
                                </div>
                            }


                        </div>

                        <CommonTextarea
                            rows={4}
                            name="comment"
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            label={t('comment')}
                            disabled={location?.state?.status != 'pending'}
                        />

                        <div className="text-right mt-16 flex justify-end gap-x-2 ">
                            <button
                                onClick={() => {
                                    setStatus('rejected')
                                    handleSubmit("rejected")
                                }
                                }
                                className="rounded-3xl border border-vacation-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-vacation-primary "
                                disabled={location?.state?.status != 'pending'}
                            >
                                {t('reject')}
                            </button>

                            <button
                                onClick={() => {
                                    setStatus('approved')
                                    handleSubmit("approved")
                                }}
                                disabled={location?.state?.status != 'pending'}
                                className={`border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary
         rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-vacation-primary
         focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2`}
                            >
                                {t('approve')}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {openConfirmPopup && (
                <ConfirmPopup
                    open={openConfirmPopup}
                    setOpen={setOpenConfirmPopup}
                    message={message}
                    setAccepted={() => handleSubmit(leaveStatus, true)}
                    handleNo={handleNo}
                />
            )}
        </>
    );
};

export default LeaveApplicationAdmin;