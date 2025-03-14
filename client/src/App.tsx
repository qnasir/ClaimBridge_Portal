
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import PatientDashboard from "./pages/patient/Dashboard";
import SubmitClaim from "./pages/patient/SubmitClaim";
import InsurerDashboard from "./pages/insurer/Dashboard";
import ReviewClaim from "./pages/insurer/ReviewClaim";
import NotFound from "./pages/NotFound";
import { getCurrentUser } from "./lib/mockData";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode,
  allowedRole?: 'patient' | 'insurer' 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    setUser(JSON.parse(currentUser));
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'patient' ? "/patient/dashboard" : "/insurer/dashboard"} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Patient Routes */}
              <Route 
                path="/patient/dashboard" 
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/submit" 
                element={
                  <ProtectedRoute allowedRole="patient">
                    <SubmitClaim />
                  </ProtectedRoute>
                } 
              />
              
              {/* Insurer Routes */}
              <Route 
                path="/insurer/dashboard" 
                element={
                  <ProtectedRoute allowedRole="insurer">
                    <InsurerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insurer/review/:claimId" 
                element={
                  <ProtectedRoute allowedRole="insurer">
                    <ReviewClaim />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
