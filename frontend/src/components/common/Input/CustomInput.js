import React, { useState, useEffect } from 'react';
import PlusIcon from '../../../assets/images/PlusIcon.svg';
import MinusIcon from '../../../assets/images/MinusIcon.svg';
import PropTypes from 'prop-types';

const CustomInput = ({
  onChange,
  name,
  title,
  placeholder,
  handlePlus,
  handleMinus,
  error,
  optionError,
  value,
  status,
  onChangePositive
}) => {
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    setToggle(status === 1);
  }, [status]);

  useEffect(() => {
    onChangePositive && onChangePositive(toggle);
  }, [toggle]);

  return (
    <div className="container border-vacation-secondary ">
      <div className="container xl:px-4 md:px-3 md:py-3">
        <div className="space-y-1 mr-14 w-full flex align-middle justify-start">
          <div className="w-5/6">
            <div className="flex mt-1 pl-6 rounded-3xl justify-between appearance-none border  focus:border-none shadow-md">
              <input
                id="name"
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                type="text"
                label={title}
                value={value}
                className={
                  'rounded-l-xl align-middle justify-start focus:outline-none w-full px-3 py-2 bg-transparent'
                }
                autoComplete="off"
              />
              <button
                className="px-4 bg-gray-200 rounded-r-3xl  py-2"
                onClick={() => setToggle(!toggle)}
              >
                <h1 className="text-md ">{toggle ? 'Positive' : 'Negative'}</h1>
              </button>
            </div>
          </div>
          {handlePlus || handleMinus ? (
            <div className="flex flex-nowrap">      
              <img src={PlusIcon} onClick={handlePlus} loading='lazy' className="w-10 max-[640px]:w-8" />
              <img src={MinusIcon} onClick={handleMinus} loading='lazy' className="w-10 max-[640px]:w-8" />
            </div>
          ) : (
            ''
          )}
        </div>
        {error || optionError ? (
          <span className="pl-2 error text-xs text-red-400">{`Please Enter ${
            optionError ? 'Option' : 'Question'
          }`}</span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

CustomInput.propTypes = {
  value: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  handlePlus: PropTypes.func,
  handleMinus: PropTypes.func,
  error: PropTypes.bool
};

export default CustomInput;
