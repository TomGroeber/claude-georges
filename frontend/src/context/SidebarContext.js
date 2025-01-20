import { createContext } from 'react';
import { useState } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/helper';
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isShow, setShow] = useState(true);

  return (
    <SidebarContext.Provider value={{ isShow, setShow }}>
      {children}
    </SidebarContext.Provider>
  );
};

