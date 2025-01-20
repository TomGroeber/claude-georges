import Breadcrumb from '../../components/common/Breadcrumb';
import { Fragment, useEffect, useRef, useState } from 'react';
import Loader from '../../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    successToast,
    getLocalStorageItem,
    useOutsideClick
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import CommonInput from '../../components/common/Input/CommonInput';
import PrimaryButton from '../../components/common/Buttons/PrimaryButton';
import SecondaryButton from '../../components/common/Buttons/SecondaryButton';
import ConfirmPopup from '../../components/common/modals/ConfirmPopup';
import { Api } from '../../api';
import AddLeaveScreenValidation from '../../services/validations/AddLeaveScreenValidation';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import { Transition } from '@headlessui/react';
import { fr } from 'react-date-range/dist/locale';
import { TimePicker } from 'rsuite';
import { useTranslation } from 'react-i18next';


function AddEditCustomEvent() {
    let location = useLocation();
    let propsData = location?.state;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [form, setForm] = useState({
        startDate: new Date(),
        endDate: new Date(),
        title: '',
        startTime: '',
        endTime: ''
    });

    const wrapperRef = useRef();
    const [error, setError] = useState({});
    const [loader, setLoader] = useState(false);
    const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
    const [pages, setPages] = useState([
        {
            name: t('customEvents'),
            href: '/custom-events',
            current: true
        },
        {
            name: t('addCustomEvent'),
            href: '/custom-events/add-edit',
            current: true
        }
    ]);
    const [customEvent, setcustomEvent] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const [selectedStartTimeRange, setSelectedStartTimeRange] = useState();
    const [selectedEndTimeRange, setSelectedEndTimeRange] = useState();

    const handleSelectRange = (e) => {
        let start = new Date(e?.selection?.startDate);
        let end = new Date(e?.selection?.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const date = {
            startDate: start,
            endDate: end
        };
        setcustomEvent(date);
    };

    useOutsideClick(wrapperRef, () => {
        if (showFilterModal) {
            setShowFilterModal(false);
        }

    });


    useEffect(()=>{
        if(propsData){
            setPages([
                {
                    name: t('customEvents'),
                    href: '/custom-events',
                    current: true
                },
                {
                    name: t('editCustomEvent'),
                    href: '/custom-events/add-edit',
                    current: true
                }
            ]);
            setForm({
                title: propsData.title,
                startDate: propsData.start,
                endDate: propsData.end
            })
            setSelectedEndTimeRange(moment(propsData.end).toDate());
            setSelectedStartTimeRange(moment(propsData.start).toDate());
            setcustomEvent({
                startDate: new Date(propsData.start),
                endDate: new Date(propsData.end)
            });
        }
    },[])


    const handleChange = (e) => {
        setError((prevState) => ({
            ...prevState,
            [e.target.name]: ''
        }));

        setForm((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };


    const handleSubmit = (e, fromPopup = false) => {
        e.preventDefault();
        const { errors, isValid } = AddLeaveScreenValidation(form);
        if (isValid) {
            if (propsData && !fromPopup) {
                setOpenConfirmPopup(true);
            } else {
                setLoader(true);
                const startDateTime = new Date(customEvent.startDate);
                let starting = formatTime(selectedStartTimeRange);
                let ending = formatTime(selectedEndTimeRange);
                const [startHour, startMinute] = starting.split(':');
                startDateTime.setHours(startHour, startMinute, 0, 0);

                const endDateTime = new Date(customEvent.endDate);
                const [endHour, endMinute] = ending.split(':');
                endDateTime.setHours(endHour, endMinute, 0, 0);

                const payload = {
                    start: moment(startDateTime).format('YYYY-MM-DDTHH:mm:ss'),
                    end: moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss'),
                    title: form.title,
                };

                if(propsData){
                    Api.editCustomEvent(propsData.id, payload).then((response) => {
                        if (response?.data?.meta?.code === 1) {
                            setLoader(false);
                            successToast(response?.data?.meta?.message);
                            navigate('/custom-events');
                        }
                        else {
                            setLoader(false);
                        }
                    });
                }else{
                    Api.addCustomEvent(payload).then((response) => {
                        if (response?.data?.meta?.code === 1) {
                            setLoader(false);
                            successToast(response?.data?.meta?.message);
                            navigate('/custom-events');
                        }
                        else {
                            setLoader(false);
                        }
                    });
                }
            }
        } else {
            setError(errors);
        }
    };

    const handleNo = () => {
        setOpenConfirmPopup(false)
    }

    const formatTime = (time) => {
        if (!time) return ""; // If no time is selected, return an empty string
        const hours = time.getHours();
        const minutes = time.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Format as "HH:mm"
    };


    const handleStartTimeRangeChange = (value) => {
        // Extract hours and minutes
        const startTime = value;
        setSelectedStartTimeRange(startTime);
    };

    const handleEndTimeRangeChange = (value) => {
        // Extract hours and minutes
        const endTime = value;
        setSelectedEndTimeRange(endTime);
    };

    return (
        <>
            {loader && <Loader />}
            <Helmet>
                <meta charSet="utf-8" />
                <title>{propsData ? 'Edit' : 'Add'} Custom Event | Vacation Manager User</title>
            </Helmet>
            <Breadcrumb pageList={pages} />
            <div className="mt-6 px-3">
               

                <form onSubmit={handleSubmit}>
                <div className="flex mb-3">
                   
                </div>
                    <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white gap-4">

                        <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">

                            <CommonInput
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                type="text"
                                label={t('title')}
                                error={error.title}
                            />

                            <div className="relative w-full">
                                <label
                                    htmlFor={"days"}
                                    className="text-md block font-medium text-gray-700"
                                >
                                    {t('days')}
                                    <span className={` text-red-400`}>&#42;</span>
                                </label>
                                <div
                                    onClick={() => setShowFilterModal((state) => !state)}
                                    className={`mt-1 block w-full cursor-pointer appearance-none rounded-3xl border border-gray-300 px-4 py-3 placeholder-gray-400 outline-none focus:outline-none `}
                                >
                                    {form.startDate ? (
                                        `${moment(customEvent.startDate).format("YYYY-MM-DD")} ~ ${moment(customEvent.endDate).format("YYYY-MM-DD")}`
                                    ) : (
                                        <div className="text-gray-400">
                                            {t('days')}
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
                                                        startDate: customEvent?.startDate ? customEvent?.startDate : new Date(),
                                                        endDate: customEvent?.endDate ? customEvent?.endDate : new Date(),
                                                        key: 'selection'
                                                    }
                                                ]}
                                                
                                                onChange={handleSelectRange}
                                            />
                                        </div>
                                    </Transition>
                                )}
                            </div>
                            <div>
                            </div>
                        </div>

                        <div className='flex flex-col m-auto lg:m-0 w-full lg:w-[430px]'>
                            <div className='flex gap-x-6 md:gap-x-3 w-full'>
                                <div className='!w-full'>
                                    <p className='block text-sm mb-1 font-medium text-gray-700'>{t('startTime')}</p>
                                    <TimePicker 
                                    value={selectedStartTimeRange}
                                    hideHours={hour => hour < 7 || hour > 16} 
                                    onChange={handleStartTimeRangeChange} 
                                    // hideMinutes={minute => minute % 15 !== 0} 
                                    editable={false} 
                                    showNow={false}
                                    />
                                </div>
                                <div className='!w-full'>
                                    <p className='block text-sm mb-1 font-medium text-gray-700'>{t('endTime')}</p>
                                    <TimePicker 
                                    value={selectedEndTimeRange}
                                    hideHours={hour => hour < 7 || hour > 16} 
                                    onChange={handleEndTimeRangeChange} 
                                    // hideMinutes={minute => minute === 0} 
                                    editable={false} 
                                    showNow={false}
                                    />
                                </div>

                            </div>

                            <div className="text-right mt-16 flex justify-end gap-x-2 ">
                                <SecondaryButton btnText={t('cancel')} btnType="button" />
                                <PrimaryButton btnText={t('submit')} btnType="submit" />

                            </div>
                        </div>



                    </div>
                </form>
            </div>

            {openConfirmPopup && (
                <ConfirmPopup
                    open={openConfirmPopup}
                    setOpen={setOpenConfirmPopup}
                    message={t('customEventConfirmation')}
                    setAccepted={(e) => handleSubmit(e, true)}
                    handleNo={handleNo}
                />
            )}
        </>
    );
}

export default AddEditCustomEvent;
