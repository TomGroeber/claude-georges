import * as React from 'react';
import PropTypes from 'prop-types';
import { MaxCharlimitLongText } from '../../utils/helper';

const CommonTextarea = ({
  id,
  name,
  value,
  label,
  error,
  onChange,
  rows,
  isRequired,
  disabled,
  isLengthValidate
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {isRequired && !disabled && <span className="text-red-400">&#42;</span>}
        {isLengthValidate && !disabled && (
          <span className="mt-1 float-right text-xs text-red-400">
            {value.length <= MaxCharlimitLongText
              ? MaxCharlimitLongText - value.length + ' Characters Left'
              : 'Out Of Character Limit 100'}
          </span>
        )}
      </label>
      <div className="mt-1">
        <textarea
          id={id}
          name={name}
          value={value}
          rows={rows}
          disabled={disabled}
          onChange={onChange}
          className="block w-full rounded-2xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-vacation-primary focus:outline-none focus:ring-vacation-primary sm:text-sm"
        />
      </div>
      {isRequired && <span className="error text-xs text-red-400">{error}</span>}
    </div>
  );
};

CommonTextarea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  rows: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
  isLengthValidate: PropTypes.any
};
export default CommonTextarea;
