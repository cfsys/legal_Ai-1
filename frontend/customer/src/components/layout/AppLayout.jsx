import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-main-content">
        <Header />
        <main
          style={{
            padding: '1.25rem 1.75rem',
            flex: 1,
            backgroundColor: '#f6f5f1',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
