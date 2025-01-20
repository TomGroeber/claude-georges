import * as React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { MaxCharlimit } from '../../../utils/helper';

const CommonInput = ({
  id,
  name,
  value,
  label,
  error,
  type,
  onChange,
  disabled,
  isRequired,
  isIcon,
  autoComplete,
  placeholder,
  classNames,
  isLengthValidate,
  min
}) => {
  const [showEyeIcon, setShowEyeIcon] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {isRequired && !disabled && <span className="text-red-400">&#42;</span>}
        {isLengthValidate && !disabled && (
          <span className="mt-1 float-right text-xs text-red-400">
            {value.length <= MaxCharlimit
              ? MaxCharlimit - value.length + ' Characters Left'
              : 'Out Of Character Limit 100'}
          </span>
        )}
      </label>
      <div className="relative">
        <div className="mt-1">
          <input
            id={id}
            name={name}
            value={value}
            type={showEyeIcon ? 'text' : type}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            min={type=='number'?min:null}
            className={`block w-full rounded-3xl appearance-none border border-gray-300 ${
              classNames ? classNames : 'px-3 py-2'
            } placeholder-gray-400 focus:border-vacation-primary focus:outline-none focus:ring-vacation-primary sm:text-sm`}
          />
        </div>
        {isIcon &&
          (showEyeIcon ? (
            <EyeSlashIcon
              onClick={() => setShowEyeIcon(false)}
              className={`cursor-pointer absolute w-[20px] text-vacation-primary top-1/2 transform -translate-y-1/2 ${
                classNames ? 'right-[13px]' : 'right-[10px]'
              }`}
            />
          ) : (
            <EyeIcon
              onClick={() => setShowEyeIcon(true)}
              className={`cursor-pointer absolute w-[20px] text-vacation-primary top-1/2 transform -translate-y-1/2 ${
                classNames ? 'right-[13px]' : 'right-[10px]'
              }`}
            />
          ))}
      </div>
      {isRequired && <span className="error text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default CommonInput;
