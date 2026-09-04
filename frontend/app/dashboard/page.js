'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getDashboard, 
  getToken, 
  respondToRequest, 
  cancelRequest 
} from '@/lib/api';
import UserCard from '@/components/UserCard';
import RequestCard from '@/components/RequestCard';
import ConnectionCard from '@/components/ConnectionCard';
import SkillBadge from '@/components/SkillBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LayoutDashboard, Users, BookOpen, RefreshCw, AlertCircle, Heart, Star } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      const dashboardData = await getDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err.message);
      setError(err.message || 'Session expired. Please log in again.');
      // If unauthorized, redirect to login
      if (err.message.includes('authorized') || err.message.includes('token')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if token exists
    if (!getToken()) {
      router.push('/login');
    } else {
      loadDashboardData();
    }
  }, [router]);

  // Request actions handlers
  const handleAccept = async (requestId) => {
    try {
      await respondToRequest(requestId, 'accepted');
      // Refresh dashboard counters & lists
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to accept connection request.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await respondToRequest(requestId, 'rejected');
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to reject request.');
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelRequest(requestId);
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to remove connection.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex-grow flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex-grow">
        <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/login')}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-semibold text-sm transition cursor-pointer"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const { user, stats, matches, incomingRequests, outgoingRequests, connections } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
      {/* Header Banner */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-primary rounded-md border border-blue-150">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Track matching users, pending exchanges, and active peer connections.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 mb-6 flex items-start space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Cards Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border p-5 rounded-lg shadow-sm">
          <span className="text-xs text-muted font-bold uppercase tracking-wider block">Teaching</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-dark">{stats.teachingCount}</span>
            <span className="text-xs text-muted">Skills</span>
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-lg shadow-sm">
          <span className="text-xs text-muted font-bold uppercase tracking-wider block">Learning</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-dark">{stats.learningCount}</span>
            <span className="text-xs text-muted">Skills</span>
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-lg shadow-sm">
          <span className="text-xs text-muted font-bold uppercase tracking-wider block">Potential Matches</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-dark">{stats.matchesCount}</span>
            <span className="text-xs text-muted">Peers</span>
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-lg shadow-sm">
          <span className="text-xs text-muted font-bold uppercase tracking-wider block">Connections</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-black text-dark">{stats.connectionsCount}</span>
            <span className="text-xs text-muted">Classmates</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side (2 cols): Matches, Requests, Connections */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Connections */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-dark border-b border-border pb-2 flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Your Connections ({connections.length})</span>
            </h2>
            {connections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connections.map((c) => (
                  <ConnectionCard key={c._id} connection={c} onDisconnect={handleCancel} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg p-8 text-center text-sm text-muted">
                No active connections. Send requests to matches to start swapping!
              </div>
            )}
          </div>

          {/* Incoming Requests */}
          {incomingRequests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-dark border-b border-border pb-2 flex items-center space-x-2">
                <Users className="h-5 w-5 text-warning" />
                <span>Incoming Connection Requests</span>
              </h2>
              <div className="space-y-3">
                {incomingRequests.map((r) => (
                  <RequestCard 
                    key={r._id} 
                    request={r} 
                    type="incoming" 
                    onAccept={handleAccept} 
                    onReject={handleReject} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sent Requests */}
          {outgoingRequests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-dark border-b border-border pb-2 flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted" />
                <span>Sent Requests</span>
              </h2>
              <div className="space-y-3">
                {outgoingRequests.map((r) => (
                  <RequestCard 
                    key={r._id} 
                    request={r} 
                    type="outgoing" 
                    onCancel={handleCancel} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Potential Matches */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-dark border-b border-border pb-2 flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span>Potential Matches</span>
            </h2>
            {matches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matches.map((matchUser) => (
                  <UserCard key={matchUser._id} user={matchUser} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg p-8 text-center text-sm text-muted">
                No potential matches yet. Try adding more skills you can teach or learn!
              </div>
            )}
          </div>

        </div>

        {/* Right Side (1 col): My Skills Summary & Edit Quick Access */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-base font-bold text-dark border-b border-border pb-2 mb-4 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Your Skills</span>
            </h3>

            {/* Teaching */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                <span>I can teach:</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.teachingSkills && user.teachingSkills.length > 0 ? (
                  user.teachingSkills.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} type="teach" />
                  ))
                ) : (
                  <span className="text-xs text-muted italic">Add skills you can teach</span>
                )}
              </div>
            </div>

            {/* Learning */}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                <span>I want to learn:</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.learningSkills && user.learningSkills.length > 0 ? (
                  user.learningSkills.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} type="learn" />
                  ))
                ) : (
                  <span className="text-xs text-muted italic">Add skills you want to learn</span>
                )}
              </div>
            </div>

            <button
              onClick={() => router.push(`/profile/${user._id}`)}
              className="w-full bg-background hover:bg-border border border-border text-dark py-2 rounded-md text-xs font-semibold transition cursor-pointer text-center block"
            >
              Modify My Skills & Info
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
