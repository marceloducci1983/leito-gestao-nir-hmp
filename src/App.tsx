
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { NewAuthScreen } from '@/components/auth/NewAuthScreen';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { AdminPasswordChanger } from '@/components/auth/AdminPasswordChanger';
import { useAuth } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showPasswordChanger, setShowPasswordChanger] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <NewAuthScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Botão temporário para mostrar o alterador de senha */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowPasswordChanger(!showPasswordChanger)}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs"
          >
            Admin Password Tool
          </button>
        </div>

        {/* Modal temporário para alteração de senha */}
        {showPasswordChanger && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg">
              <AdminPasswordChanger />
              <button
                onClick={() => setShowPasswordChanger(false)}
                className="mt-4 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
