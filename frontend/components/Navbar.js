'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getToken, removeToken, getMe } from '@/lib/api';
import { Sparkles, User as UserIcon, LogOut, LayoutDashboard, Compass, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (getToken()) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (err) {
          console.error('Navbar load user error:', err.message);
          removeToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-dark tracking-tight">SkillSwap</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              href="/explore" 
              className={`flex items-center space-x-1 text-sm font-medium transition ${
                isActive('/explore') ? 'text-primary' : 'text-muted hover:text-dark'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Explore</span>
            </Link>

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center space-x-1 text-sm font-medium transition ${
                    isActive('/dashboard') ? 'text-primary' : 'text-muted hover:text-dark'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link 
                  href={`/profile/${user._id}`} 
                  className={`flex items-center space-x-1 text-sm font-medium transition ${
                    pathname.startsWith('/profile') ? 'text-primary' : 'text-muted hover:text-dark'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-muted hover:text-error transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-muted hover:text-dark transition"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
                >
                  Join SkillSwap
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-dark hover:bg-background transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-border px-4 pt-2 pb-4 space-y-2">
          <Link 
            href="/explore" 
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/explore') ? 'bg-blue-50 text-primary' : 'text-muted hover:bg-background hover:text-dark'
            }`}
          >
            Explore
          </Link>

          {user ? (
            <>
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard') ? 'bg-blue-50 text-primary' : 'text-muted hover:bg-background hover:text-dark'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href={`/profile/${user._id}`} 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname.startsWith('/profile') ? 'bg-blue-50 text-primary' : 'text-muted hover:bg-background hover:text-dark'
                }`}
              >
                My Profile
              </Link>
              <button 
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-red-50 hover:text-error transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-border space-y-2">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 text-base font-medium text-muted hover:text-dark"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-primary hover:bg-primary-hover text-white py-2 rounded-md text-base font-medium"
              >
                Join SkillSwap
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
