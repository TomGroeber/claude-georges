import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function SecondaryButton({ btnText, btnType }) {
  const navigate = useNavigate();
  return (
    <>
      <button
        type={btnType}
        className="rounded-3xl border border-vacation-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-vacation-primary "
        onClick={() => navigate(-1)}
      >
        {btnText}
      </button>
    </>
  );
}

SecondaryButton.propTypes = {
  btnType: PropTypes.string,
  btnText: PropTypes.string
};
