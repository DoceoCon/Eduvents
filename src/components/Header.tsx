"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Find Events' },
    { path: '/list-event', label: 'List Your Event' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push('/admin');
    } else {
      router.push('/login');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-tight">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="EDUVENTS" className="h-25 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-lg font-medium transition-colors hover:text-primary font-league-gothic uppercase tracking-wide ${isActive(link.path)
                  ? 'text-primary'
                  : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {pathname !== '/login' && (
              <button
                onClick={handleAdminClick}
                className={`text-lg font-medium transition-colors hover:text-primary font-league-gothic uppercase tracking-wide ${pathname.startsWith('/admin') || pathname === '/login'
                  ? 'text-primary'
                  : 'text-muted-foreground'
                  }`}
              >
                Admin
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-lg font-medium text-red-500 hover:text-red-600 transition-colors font-league-gothic uppercase tracking-wide"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-primary font-league-gothic uppercase tracking-wide ${isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {pathname !== '/login' && (
                <button
                  onClick={() => {
                    handleAdminClick();
                    setIsMenuOpen(false);
                  }}
                  className={`text-lg font-medium transition-colors hover:text-primary text-left font-league-gothic uppercase tracking-wide ${pathname.startsWith('/admin') || pathname === '/login'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                    }`}
                >
                  Admin
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-lg font-medium text-red-500 hover:text-red-600 transition-colors text-left font-league-gothic uppercase tracking-wide"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
