import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PromptProvider } from './context/PromptContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './index.css';

// Import implemented pages
import { CreatePromptPage } from './pages/CreatePromptPage';
import { PromptsPage } from './pages/PromptsPage';
import { EditPromptPage } from './pages/EditPromptPage';

// Import Dashboard
import { Dashboard } from './pages/Dashboard';
import { FavoritesPage } from './pages/FavoritesPage';
import { TagsPage } from './pages/TagsPage';
import { SharedPromptPage } from './pages/SharedPromptPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/prompts" 
        element={
          <ProtectedRoute>
            <Layout>
              <PromptsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/favorites" 
        element={
          <ProtectedRoute>
            <Layout>
              <FavoritesPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/tags" 
        element={
          <ProtectedRoute>
            <Layout>
              <TagsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <Layout>
              <CreatePromptPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/prompts/:promptId/edit" 
        element={
          <ProtectedRoute>
            <Layout>
              <EditPromptPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="/shared" element={<SharedPromptPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <PromptProvider>
        <AppContent />
      </PromptProvider>
    </AuthProvider>
  );
}

export default App;
