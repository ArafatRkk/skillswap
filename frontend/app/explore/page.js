'use client';

import { useState, useEffect } from 'react';
import { getExploreList, getSkills } from '@/lib/api';
import UserCard from '@/components/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search, Compass, Info } from 'lucide-react';

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [search, setSearch] = useState('');
  const [teachFilter, setTeachFilter] = useState('');
  const [learnFilter, setLearnFilter] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users and predefined skills on mount and when filter criteria change
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsData = await getSkills();
        setSkillsList(skillsData);
      } catch (err) {
        console.error('Failed to load skills dropdown:', err.message);
      }
    };
    loadSkills();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getExploreList(search, teachFilter, learnFilter);
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve explore profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [teachFilter, learnFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
      {/* Page Title */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-primary rounded-md border border-blue-150">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Explore SkillSwap</h1>
          <p className="text-xs sm:text-sm text-muted">Discover other students, check mutual overlaps, and exchange knowledge.</p>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white border border-border rounded-lg p-5 mb-8 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Text Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted" />
            <input
              type="text"
              placeholder="Search by name or skills (e.g. React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm text-dark placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            />
          </div>

          {/* Teach Filter Dropdown */}
          <div>
            <select
              value={teachFilter}
              onChange={(e) => setTeachFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition cursor-pointer"
            >
              <option value="">Filter by: Teaches</option>
              {skillsList.map((skill) => (
                <option key={skill._id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Learn Filter Dropdown */}
          <div>
            <select
              value={learnFilter}
              onChange={(e) => setLearnFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition cursor-pointer"
            >
              <option value="">Filter by: Wants to learn</option>
              {skillsList.map((skill) => (
                <option key={skill._id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Matching Tip Callout */}
      <div className="bg-blue-50 border border-blue-100 text-slate-700 p-4 rounded-lg flex items-start space-x-3 mb-8 text-xs sm:text-sm">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-dark">Tip:</span> Log in to automatically see match scores! 
          A <span className="font-semibold text-success">Strong Match</span> means you can teach them what they want, and they can teach you what you want.
        </div>
      </div>

      {/* Error Output */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 mb-8 text-sm">
          {error}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg p-12 text-center shadow-sm">
          <Compass className="mx-auto h-12 w-12 text-muted mb-4" />
          <h3 className="text-lg font-bold text-dark mb-1">No users found</h3>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Try adjusting your search criteria, clearing filters, or adding more teaching/learning skills to your profile.
          </p>
        </div>
      )}
    </div>
  );
}
