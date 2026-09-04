import Link from 'next/link';
import SkillBadge from './SkillBadge';
import { Check, X } from 'lucide-react';

export default function RequestCard({ request, type = 'incoming', onAccept, onReject, onCancel }) {
  // If incoming request, display sender profile details. If outgoing, display receiver profile details.
  const otherUser = type === 'incoming' ? request.sender : request.receiver;

  if (!otherUser) return null;

  return (
    <div className="bg-white rounded-lg border border-border p-5 flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 hover:border-gray-300 transition duration-150">
      {/* Profile Details & Skills */}
      <div className="flex items-start space-x-4">
        <img
          src={otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
          alt={otherUser.name}
          className="w-12 h-12 rounded-full object-cover border border-border mt-0.5"
        />
        <div>
          <Link href={`/profile/${otherUser._id}`} className="font-bold text-dark hover:text-primary hover:underline transition">
            {otherUser.name}
          </Link>
          <p className="text-xs text-muted mb-2">{otherUser.location || 'Location not specified'}</p>
          
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted font-medium">Teaches:</span>
            {otherUser.teachingSkills && otherUser.teachingSkills.slice(0, 3).map((skill, index) => (
              <SkillBadge key={index} skill={skill} type="teach" />
            ))}
            {otherUser.teachingSkills && otherUser.teachingSkills.length > 3 && (
              <span className="text-xs text-muted">+{otherUser.teachingSkills.length - 3} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Button controls */}
      <div className="flex items-center space-x-2 justify-end">
        {type === 'incoming' ? (
          <>
            <button
              onClick={() => onAccept(request._id)}
              className="flex items-center space-x-1 bg-success hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => onReject(request._id)}
              className="flex items-center space-x-1 bg-white hover:bg-red-50 text-error border border-error px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reject</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => onCancel(request._id)}
            className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-muted border border-border px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel Request</span>
          </button>
        )}
      </div>
    </div>
  );
}
