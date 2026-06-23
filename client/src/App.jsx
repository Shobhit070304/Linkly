import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "./components/Layout/DashboardLayout";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./components/Auth/Auth"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Workspaces = lazy(() => import("./pages/Workspaces"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/preview/:shortCode" element={<PreviewPage />} />
        
        {/* Dashboard Routes wrapped in Sidebar Layout */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/links"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/analytics/:shortCode"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />
        <Route
          path="/workspaces"
          element={
            <DashboardLayout>
              <Workspaces />
            </DashboardLayout>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
