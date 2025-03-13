
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import SubmitClaim from "./pages/patient/SubmitClaim";
import { useEffect, useState } from "react";
import { User } from "./lib/types";
import { getCurrentUser } from "./lib/mockData";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRole
} : {
  children: React.ReactNode,
  allowedRole?: 'patient' | 'insurer'
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to={user.role === 'patient' ? "/patient/dashboard" : "/insurer/dashboard"} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'patient' ? "/patient/dashboard" : "/insurer/dashboard"} />
  }

  return <>{children}</>
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path='/' element={<Index />} />
              <Route path='/login' element={<Login />} />
              <Route path="/patient/submit" element={
                <ProtectedRoute allowedRole="patient"><SubmitClaim /></ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
