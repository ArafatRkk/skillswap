'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, getToken } from '@/lib/api';
import { Sparkles, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (getToken()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      // Store token safely
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillswap_token', response.token);
      }
      
      // Force redirect to dashboard and refresh state
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-8 bg-white border border-border p-8 rounded-lg shadow-sm">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-50 text-primary flex items-center justify-center rounded-md border border-blue-150">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-dark tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted">
            Login to connect and swap skills with classmates
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-dark mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                placeholder="you@school.edu"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-dark mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" className="text-white" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        {/* Link to Register */}
        <div className="text-center text-sm text-muted pt-4 border-t border-border">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
