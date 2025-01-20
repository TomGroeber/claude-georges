import { SidebarContext } from '../context/SidebarContext';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

const Loader = ({ compact }) => {
  const { isShow } = useContext(SidebarContext);
  const location = useLocation();

  return (
    <div
      className={`flex items-center justify-center ${
        !compact
          ? 'z-30 fixed h-screen w-screen top-0 left-0 bg-opacity-90 bg-gray-100 '
          : 'h-full w-full'
      } p-5`}
    >
      <div className="flex space-x-2 animate-pulse">
        <div className="w-3 h-3 bg-vacation-primary rounded-full"></div>
        <div className="w-3 h-3 bg-vacation-secondary rounded-full"></div>
        <div className="w-3 h-3 bg-vacation-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
