'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register, getToken } from '@/lib/api';
import { Sparkles, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    // Field check
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await register(name, email, password, confirmPassword);
      // Store token safely
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillswap_token', response.token);
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h2 className="mt-6 text-3xl font-extrabold text-dark tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-muted">
            Join the cashless student skill exchange community
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-dark mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="Mohammad Arafat Amin"
            />
          </div>

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
              placeholder="arafat@school.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-dark mb-1">
              Password (min. 6 characters)
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-dark mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" className="text-white" />
                  <span>Registering account...</span>
                </div>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="text-center text-sm text-muted pt-4 border-t border-border">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
