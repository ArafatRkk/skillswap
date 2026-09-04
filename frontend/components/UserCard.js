import Link from 'next/link';
import SkillBadge from './SkillBadge';
import { getMatchBadgeDetails } from '@/lib/match';
import { MapPin, ArrowRight } from 'lucide-react';

export default function UserCard({ user }) {
  const matchInfo = getMatchBadgeDetails(user.match);

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        {/* Match Score Indicator (Hidden if score is 0 or no active user context) */}
        {user.match && user.match.score > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${matchInfo.color}`}>
              {matchInfo.label}
            </span>
            {user.match.score === 2 && (
              <span className="text-[10px] bg-green-100 text-success font-bold px-1.5 py-0.5 rounded-md border border-success/20">
                Direct Match
              </span>
            )}
          </div>
        )}

        {/* User Card Header */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-border"
          />
          <div>
            <h3 className="text-base font-bold text-dark">{user.name}</h3>
            <p className="text-xs text-muted flex items-center mt-0.5">
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted" />
              {user.location || 'Unknown Location'}
            </p>
          </div>
        </div>

        {/* User Bio Preview */}
        <p className="text-sm text-muted line-clamp-2 mb-4 h-10">
          {user.bio || 'No bio description provided.'}
        </p>

        {/* Skills Overview */}
        <div className="space-y-3 mb-6">
          <div>
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Teaches:</h4>
            <div className="flex flex-wrap gap-1.5">
              {user.teachingSkills && user.teachingSkills.length > 0 ? (
                user.teachingSkills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} type="teach" />
                ))
              ) : (
                <span className="text-xs text-muted italic">No teaching skills listed</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">Wants to learn:</h4>
            <div className="flex flex-wrap gap-1.5">
              {user.learningSkills && user.learningSkills.length > 0 ? (
                user.learningSkills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} type="learn" />
                ))
              ) : (
                <span className="text-xs text-muted italic">No learning requests listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Button to Profile Page */}
      <Link 
        href={`/profile/${user._id}`}
        className="w-full flex items-center justify-center space-x-1.5 bg-background hover:bg-border text-dark border border-border py-2 rounded-md text-sm font-medium transition"
      >
        <span>View Profile</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
