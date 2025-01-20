import React from 'react';

const ProgressBar = () => {
  return (
    <>
      <div className="flex p-2 justify-center align-middle bg-vacation-secondary xl:w-1/2 md:w-full sm:w-full  xl:m-5  lg:m-2 md:mx-0 rounded-full">
        <text className="pl-3 text-white "> 1/1</text>
        <div className="w-full bg-vacation-secondary dark:bg-neutral-600 flex mx-7 rounded-full">
          <div className="shadow-xl px-2 bg-white rounded-full" style={{ width: '100%' }} />
        </div>
        <text className="pr-5 text-white ">100%</text>
      </div>
    </>
  );
};

export default ProgressBar;
