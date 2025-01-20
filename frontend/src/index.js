import React, { memo } from 'react';
import { Toaster } from 'react-hot-toast';
import './index.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import Routes from './routes/index';
import { SidebarProvider } from './context/SidebarContext';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';


const MainApp = memo(() => {
  return (
    <SidebarProvider>
        <div className="bg-[#f3f4f7]">
          <Routes />
        </div>
        <Toaster />
    </SidebarProvider>
  );
});


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<MainApp />);

