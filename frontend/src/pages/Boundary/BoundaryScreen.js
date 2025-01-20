import Breadcrumb from '../../components/common/Breadcrumb';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    successToast,
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import CommonInput from '../../components/common/Input/CommonInput';
import PrimaryButton from '../../components/common/Buttons/PrimaryButton';
import ConfirmPopup from '../../components/common/modals/ConfirmPopup';
import { Api } from '../../api';
import ManageBoundaryValidation from '../../services/validations/manageBoundaryValidations';
import { useTranslation } from 'react-i18next';

function ManageBoundary() {
    let location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        turnerLimit: 0,
        millerLimit: 0,
        welderLimit: 0
    });

    const [error, setError] = useState({});
    const [loader, setLoader] = useState(false);
    const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
    const [pages, setPages] = useState([
        {
            name: t('manageBoundary'),
            href: '/boundaries',
            current: true
        },
    ]);

    const handleNo = () => {
        setOpenConfirmPopup(false);
      };

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
        const { errors, isValid } = ManageBoundaryValidation(form, t);
        if (isValid) {
            if (!fromPopup) {
                setOpenConfirmPopup(true);
            } else {
                setLoader(true);
                const payload = {
                    turnerLimit: form.turnerLimit,
                    millerLimit: form.millerLimit,
                    welderLimit: form.welderLimit
                };
                Api.updateBoundaries(payload).then((response) => {
                    if (response?.data?.meta?.code === 1) {
                        setLoader(false);
                        successToast(response?.data?.meta?.message);
                        navigate('/boundaries');
                    }
                    else {
                        setLoader(false);
                    }
                });

            }
        } else {
            setError(errors);
        }
    };

    const getAllBoundaries=()=>{
        setLoader(true)
        Api.getBoundaries().then((response) => {
            if (response?.data?.meta?.code === 1) {
                setLoader(false);
                setForm({
                    ...form,
                    turnerLimit:response?.data?.data[0]?.maxConncurentOff || 0,
                    millerLimit:response?.data?.data[1]?.maxConncurentOff || 0,
                    welderLimit:response?.data?.data[2]?.maxConncurentOff || 0
                })
            }   
            else {
                setLoader(false);
            }
        });
    }

    useEffect(()=>{
        getAllBoundaries()
    },[])

    return (
        <>
            {loader && <Loader />}
            <Helmet>
                <meta charSet="utf-8" />
                {location?.state ? (
                    <title>Edit Boundary | Vacation Manager Admin</title>
                ) : (
                    <title>Add Boundary | Vacation Manager Admin</title>
                )}
            </Helmet>
            <Breadcrumb pageList={pages} />
            <div className="mt-6 px-3">
                <form onSubmit={handleSubmit}>
                    <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white gap-4">

                        <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
                            <CommonInput
                                id="turnerLimit"
                                name="turnerLimit"
                                value={form.turnerLimit}
                                onChange={handleChange}
                                type="text"
                                label={t('turnerLimit')}
                                error={error.turnerLimit}
                            />

                            <CommonInput
                                id="millerLimit"
                                name="millerLimit"
                                value={form.millerLimit}
                                onChange={handleChange}
                                type="text"
                                label={t('millerLimit')}
                                error={error.millerLimit}
                            />

                            <CommonInput
                                id="welderLimit"
                                name="welderLimit"
                                value={form.welderLimit}
                                onChange={handleChange}
                                type="text"
                                label={t('welderLimit')}
                                error={error.welderLimit}
                            />

                            <div>
                            </div>

                            <div className="text-right flex justify-end gap-x-2 mt-12">
                                <PrimaryButton btnText={t('update')} btnType="submit" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {openConfirmPopup && (
                <ConfirmPopup
                    open={openConfirmPopup}
                    setOpen={setOpenConfirmPopup}
                    message={t('updateBoundaries')}
                    setAccepted={(e) => handleSubmit(e, true)}
                    handleNo={handleNo}
                />
            )}
        </>
    );
}

export default ManageBoundary;
