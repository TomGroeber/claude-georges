import PropTypes from 'prop-types';
import React from 'react';

export default function PrimaryButton({ btnText, btnType, disabled, ...rest }) {
  return (
    <>
      <button
        {...rest}
        type={btnType}
        disabled={disabled}
        className={`${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'border border-transparent bg-gradient-to-r from-vacation-primary to-vacation-secondary'
        } rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm ${
          !disabled ? 'hover:bg-vacation-primary' : ''
        } focus:outline-none focus:ring-2 focus:ring-vacation-primary focus:ring-offset-2`}
      >
        {btnText}
      </button>
    </>
  );
}

PrimaryButton.propTypes = {
  btnType: PropTypes.string,
  btnText: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};
