import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Marketing Layout & Shared
import MarketingLayout from './components/marketing/MarketingLayout';
import ScrollToTop from './components/shared/ScrollToTop';
import GlobalEscapeModalHandler from './components/common/GlobalEscapeModalHandler';

// Marketing Pages (Public - No Login Required)
import Home from './pages/marketing/Home';
import Features from './pages/marketing/Features';
import Solutions from './pages/marketing/Solutions';
import SolutionDetail from './pages/marketing/SolutionDetail';
import ProductDetail from './pages/marketing/ProductDetail';
import Security from './pages/marketing/Security';
import Pricing from './pages/marketing/Pricing';
import About from './pages/marketing/About';
import Contact from './pages/marketing/Contact';
import Careers from './pages/marketing/Careers';
import Partners from './pages/marketing/Partners';
import Demo from './pages/marketing/Demo';
import Resources from './pages/marketing/Resources';
import Blog from './pages/marketing/Blog';
import BlogDetail from './pages/marketing/BlogDetail';
import Guides from './pages/marketing/Guides';
import LegalUpdates from './pages/marketing/LegalUpdates';
import HelpCentre from './pages/marketing/HelpCentre';
import LegalPage from './pages/marketing/LegalPage';

// Auth Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// App Layout & Protected Pages
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AskThemesAiPage from './pages/AskThemesAiPage';
import LegalResearchPage from './pages/LegalResearchPage';
import NewResearchPage from './pages/NewResearchPage';
import JudgmentSearchPage from './pages/JudgmentSearchPage';
import JudgmentDetailPage from './pages/JudgmentDetailPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import ContractReviewPage from './pages/ContractReviewPage';
import ContractDetailPage from './pages/ContractDetailPage';
import MattersPage from './pages/MattersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import TasksPage from './pages/TasksPage';

// Administration & Platform Pages
import MastersPage from './pages/admin/MastersPage';
import OrganisationPage from './pages/admin/OrganisationPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import UsagePage from './pages/admin/UsagePage';
import SecurityPage from './pages/admin/SecurityPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import IntegrationsPage from './pages/admin/IntegrationsPage';
import SuperAdminPage from './pages/admin/SuperAdminPage';
import InquiriesPage from './pages/admin/InquiriesPage';

import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import {
  DraftingPage,
} from './pages/OtherPages';

// Unified Admin Portal Component
import AdminPortal from './admin/AdminPortal';

const PRODUCT_SLUGS = [
  'ai-legal-research',
  'judgment-search',
  'document-intelligence',
  'legal-drafting',
  'contract-review',
  'matter-management',
];

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        Loading Legal AI Workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Customer Home Route: If already logged in, go to /app/dashboard; otherwise show Customer Homepage
const CustomerHomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        Loading Legal AI Workspace...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Home />;
};

// Public Auth Route Guard: If already logged in, redirect to /app/dashboard
const PublicAuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>
        Loading Legal AI Workspace...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <GlobalEscapeModalHandler />
          <Routes>
            {/* Public Marketing Showcase & Customer Homepage Routes */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<CustomerHomeRoute />} />
              <Route path="/customer" element={<CustomerHomeRoute />} />
              <Route path="/customer/home" element={<CustomerHomeRoute />} />
              <Route path="/features" element={<Features />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/:persona" element={<SolutionDetail />} />
              {PRODUCT_SLUGS.map((slug) => (
                <Route key={slug} path={`/${slug}`} element={<ProductDetail slug={slug} />} />
              ))}
              <Route path="/security" element={<LegalPage />} />
              <Route path="/enterprise-security" element={<Security />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/blog" element={<Blog />} />
              <Route path="/resources/blog/:slug" element={<BlogDetail />} />
              <Route path="/resources/guides" element={<Guides />} />
              <Route path="/resources/legal-updates" element={<LegalUpdates />} />
              <Route path="/resources/help" element={<HelpCentre />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/ai-disclaimer" element={<LegalPage />} />
              <Route path="/cookie-policy" element={<LegalPage />} />
            </Route>

            {/* Auth Routes - Redirects to /app/dashboard if already logged in */}
            <Route path="/register" element={<PublicAuthRoute><RegisterPage /></PublicAuthRoute>} />
            <Route path="/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
            <Route path="/customer/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
            <Route path="/customer/register" element={<PublicAuthRoute><RegisterPage /></PublicAuthRoute>} />

            {/* Dedicated Admin Portal Routes - When user types /admin in URL */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/*" element={<AdminPortal />} />

            {/* Customer Workspace Alias Routes */}
            <Route path="/customer/workspace" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/customer/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/customer/app/*" element={<Navigate to="/app" replace />} />

            {/* Authenticated Workspace Application Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="ai" element={<AskThemesAiPage />} />
              <Route path="research" element={<LegalResearchPage />} />
              <Route path="research/new" element={<NewResearchPage />} />
              <Route path="research/:id" element={<AskThemesAiPage />} />
              <Route path="judgments" element={<JudgmentSearchPage />} />
              <Route path="judgments/:id" element={<JudgmentDetailPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/:id" element={<DocumentDetailPage />} />
              <Route path="contracts" element={<Navigate to="/app/documents" replace />} />
              <Route path="contracts/*" element={<Navigate to="/app/documents" replace />} />
              <Route path="matters" element={<MattersPage />} />
              <Route path="drafting" element={<DraftingPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="masters" element={<MastersPage />} />
              <Route path="masters/:category" element={<MastersPage />} />
              <Route path="admin/masters" element={<MastersPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/organisation" element={<OrganisationPage />} />
              <Route path="admin/subscriptions" element={<SubscriptionsPage />} />
              <Route path="admin/usage" element={<UsagePage />} />
              <Route path="admin/security" element={<SecurityPage />} />
              <Route path="admin/audit" element={<AuditLogsPage />} />
              <Route path="admin/integrations" element={<IntegrationsPage />} />
              <Route path="admin/inquiries" element={<InquiriesPage />} />
              <Route path="admin/leads" element={<InquiriesPage />} />
              <Route path="super-admin" element={<SuperAdminPage />} />
            </Route>

            {/* Direct Super Admin Route */}
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
              <Route path="dashboard" element={<SuperAdminPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
