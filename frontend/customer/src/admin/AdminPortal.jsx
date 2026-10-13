import React from 'react';
import './admin.css';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './views/LoginPage';
import OverviewView from './views/OverviewView';
import UsersView from './views/UsersView';
import FirmsView from './views/FirmsView';
import PermissionsMatrixView from './views/PermissionsMatrixView';
import AiQuotasView from './views/AiQuotasView';
import AuditLogsView from './views/AuditLogsView';
import SettingsView from './views/SettingsView';
import SubAdminsView from './views/SubAdminsView';
import AdminRolesView from './views/AdminRolesView';
import MastersView from './views/MastersView';
import InquiriesView from './views/InquiriesView';

import CreateUserModal from './components/modals/CreateUserModal';
import EditUserModal from './components/modals/EditUserModal';
import CreateFirmModal from './components/modals/CreateFirmModal';
import EditPermissionsModal from './components/modals/EditPermissionsModal';
import CreditTopupModal from './components/modals/CreditTopupModal';
import DatabaseModal from './components/modals/DatabaseModal';
import CreateSubAdminModal from './components/modals/CreateSubAdminModal';
import EditSubAdminModal from './components/modals/EditSubAdminModal';
import EditSubAdminPermissionsModal from './components/modals/EditSubAdminPermissionsModal';
import CreateRoleModal from './components/modals/CreateRoleModal';
import EditRoleModal from './components/modals/EditRoleModal';
import ApplyRoleModal from './components/modals/ApplyRoleModal';
import ConfirmModal from './components/modals/ConfirmModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

import { LockKeyhole, LogOut } from 'lucide-react';

function AdminAppInner() {
  const {
    currentTab,
    activeModal,
    modalTargetUser,
    isAuthenticated,
    canAccessModule,
    logoutUser,
    closeModal,
  } = useAdmin();

  // If not authenticated, show Admin Login Page with zero black background
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-wrapper">
          {!canAccessModule(currentTab) ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#fef2f2',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <LockKeyhole size={26} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                Access Restricted
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748b', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
                Your assigned role does not have permission to view or manage this module. Please contact your system administrator to adjust your permissions.
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'overview' && <OverviewView />}
              {currentTab === 'users' && <UsersView />}
              {currentTab === 'masters' && <MastersView />}
              {currentTab === 'sub-admins' && <SubAdminsView />}
              {currentTab === 'admin-roles' && <AdminRolesView />}
              {currentTab === 'inquiries' && <InquiriesView />}
            </>
          )}
        </div>
      </main>

      {/* Dynamic Modals */}
      {activeModal === 'createUser' && (
        <CreateUserModal onCreated={modalTargetUser?.onCreated} />
      )}
      {activeModal === 'editUser' && (
        <EditUserModal
          user={modalTargetUser?.user || modalTargetUser}
          onUpdated={modalTargetUser?.onUpdated}
        />
      )}
      {activeModal === 'createFirm' && <CreateFirmModal />}
      {activeModal === 'permissions' && <EditPermissionsModal />}
      {activeModal === 'credits' && <CreditTopupModal />}
      {activeModal === 'database' && <DatabaseModal />}
      {activeModal === 'createSubAdmin' && (
        <CreateSubAdminModal onCreated={modalTargetUser?.onCreated} />
      )}
      {activeModal === 'editSubAdmin' && (
        <EditSubAdminModal
          subAdmin={modalTargetUser?.subAdmin || modalTargetUser?.targetUser || modalTargetUser}
          onUpdated={modalTargetUser?.onUpdated}
        />
      )}
      {activeModal === 'editSubAdminPermissions' && (
        <EditSubAdminPermissionsModal
          subAdmin={modalTargetUser}
          onUpdated={modalTargetUser?.onUpdated}
        />
      )}
      {activeModal === 'createRole' && (
        <CreateRoleModal onCreated={modalTargetUser?.onCreated} />
      )}
      {activeModal === 'editRole' && (
        <EditRoleModal
          role={modalTargetUser?.role}
          onUpdated={modalTargetUser?.onUpdated}
        />
      )}
      {activeModal === 'applyRole' && (
        <ApplyRoleModal
          targetUser={modalTargetUser?.targetUser || modalTargetUser}
          onUpdated={modalTargetUser?.onUpdated}
        />
      )}
      {activeModal === 'confirmLogout' && (
        <LogoutConfirmModal
          isOpen={true}
          onConfirm={() => {
            closeModal();
            logoutUser();
          }}
          onCancel={closeModal}
        />
      )}

      <Toast />
    </div>
  );
}

export default function AdminPortal() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AdminAppInner />
      </AdminProvider>
    </ErrorBoundary>
  );
}
