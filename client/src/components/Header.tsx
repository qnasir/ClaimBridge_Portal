
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Menu, X } from "lucide-react";
import { getCurrentUser, clearCurrentUser } from '@/lib/mockData';
import { User } from '@/lib/types';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    navigate('/login');
  };

  const getDashboardUrl = () => {
    if (!user) return '/login';
    return user.role === 'patient' ? '/patient/dashboard' : '/insurer/dashboard';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight transition-colors hover:text-primary"
          >
            ClaimBridge
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to={getDashboardUrl()} 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              {user.role === 'patient' && (
                <Link 
                  to="/patient/submit" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Submit Claim
                </Link>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </nav>

        <button 
          className="md:hidden flex items-center justify-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b animate-fade-in">
          <div className="container py-4 space-y-4">
            {user ? (
              <>
                <Link 
                  to={getDashboardUrl()} 
                  className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                {user.role === 'patient' && (
                  <Link 
                    to="/patient/submit" 
                    className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    Submit Claim
                  </Link>
                )}
                <div className="flex items-center gap-2 py-2">
                  <UserCircle className="h-4 w-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login" className="block w-full">
                <Button variant="default" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
