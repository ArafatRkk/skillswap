'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getProfile, 
  getSkills, 
  updateProfile, 
  sendRequest, 
  getRequestsList, 
  respondToRequest, 
  cancelRequest, 
  getMe 
} from '@/lib/api';
import SkillBadge from '@/components/SkillBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getMatchBadgeDetails } from '@/lib/match';
import { MapPin, Mail, Send, Check, X, Edit3, Save, ArrowLeft, UserMinus, Star } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = useParams();

  // Profile data states
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [relationship, setRelationship] = useState({ state: 'none', requestId: null });

  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Mode states
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedTeaching, setEditedTeaching] = useState([]);
  const [editedLearning, setEditedLearning] = useState([]);

  // Fetch all initial parameters
  const loadProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch profile profile
      const profData = await getProfile(id);
      setProfile(profData);
      setEditedName(profData.name);
      setEditedLocation(profData.location);
      setEditedBio(profData.bio);
      setEditedTeaching(profData.teachingSkills || []);
      setEditedLearning(profData.learningSkills || []);

      // 2. Fetch logged-in user check
      let current = null;
      try {
        current = await getMe();
        setCurrentUser(current);
      } catch (e) {
        // Not logged in
        setCurrentUser(null);
      }

      // 3. Fetch predefined skills list
      try {
        const skillsData = await getSkills();
        setSkillsList(skillsData);
      } catch (e) {
        console.error('Failed to load skills list');
      }

      // 4. Calculate relationship if looking at another profile
      if (current && current._id.toString() !== id.toString()) {
        const reqData = await getRequestsList();
        const incomingMatch = reqData.incoming.find(r => r.sender._id.toString() === id.toString());
        const outgoingMatch = reqData.outgoing.find(r => r.receiver._id.toString() === id.toString());

        if (incomingMatch) {
          setRelationship({ state: incomingMatch.status === 'accepted' ? 'accepted' : 'incoming_pending', requestId: incomingMatch._id });
        } else if (outgoingMatch) {
          setRelationship({ state: outgoingMatch.status === 'accepted' ? 'accepted' : 'outgoing_pending', requestId: outgoingMatch._id });
        } else {
          setRelationship({ state: 'none', requestId: null });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [id]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode && profile) {
      // Reset values to saved state
      setEditedName(profile.name);
      setEditedLocation(profile.location);
      setEditedBio(profile.bio);
      setEditedTeaching(profile.teachingSkills || []);
      setEditedLearning(profile.learningSkills || []);
    }
  };

  // Skill checkbox toggler
  const toggleSkill = (skillName, type = 'teach') => {
    if (type === 'teach') {
      if (editedTeaching.includes(skillName)) {
        setEditedTeaching(editedTeaching.filter(s => s !== skillName));
      } else {
        setEditedTeaching([...editedTeaching, skillName]);
      }
    } else {
      if (editedLearning.includes(skillName)) {
        setEditedLearning(editedLearning.filter(s => s !== skillName));
      } else {
        setEditedLearning([...editedLearning, skillName]);
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editedName.trim()) {
      setError('Name is required');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await updateProfile(id, {
        name: editedName,
        location: editedLocation,
        bio: editedBio,
        teachingSkills: editedTeaching,
        learningSkills: editedLearning
      });
      setProfile(updated);
      setEditMode(false);
      
      // Proactively reload profile data to recalculate scores
      loadProfileData();
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setActionLoading(false);
    }
  };

  // Connection Handlers
  const handleSendRequest = async () => {
    setActionLoading(true);
    try {
      const requestObj = await sendRequest(id);
      setRelationship({ state: 'outgoing_pending', requestId: requestObj._id });
    } catch (err) {
      setError(err.message || 'Failed to send request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setActionLoading(true);
    try {
      await respondToRequest(relationship.requestId, 'accepted');
      setRelationship({ state: 'accepted', requestId: relationship.requestId });
      // Reload profile to refresh credentials / email visibility
      loadProfileData();
    } catch (err) {
      setError(err.message || 'Failed to accept connection request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    setActionLoading(true);
    try {
      await respondToRequest(relationship.requestId, 'rejected');
      setRelationship({ state: 'none', requestId: null });
    } catch (err) {
      setError(err.message || 'Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setActionLoading(true);
    try {
      await cancelRequest(relationship.requestId);
      setRelationship({ state: 'none', requestId: null });
    } catch (err) {
      setError(err.message || 'Failed to remove connection.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex-grow flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center flex-grow">
        <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 mb-4">
          {error}
        </div>
        <button onClick={() => router.back()} className="inline-flex items-center text-primary font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Previous Page
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id.toString() === id.toString();
  const matchInfo = profile ? getMatchBadgeDetails(profile.match) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
      {/* Navigation Header */}
      <button 
        onClick={() => router.push('/explore')} 
        className="inline-flex items-center text-sm font-semibold text-muted hover:text-dark transition mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Explore peers
      </button>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar, Location, Match State, Request Button */}
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm text-center h-fit">
          <img
            src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
            alt={profile.name}
            className="w-28 h-28 rounded-full object-cover border border-border mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-dark">{profile.name}</h2>
          
          <p className="text-xs text-muted flex items-center justify-center mt-1 mb-4">
            <MapPin className="h-3.5 w-3.5 mr-1 text-muted" />
            {profile.location || 'Location not specified'}
          </p>

          {/* Connected Details Block */}
          {relationship.state === 'accepted' && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4 text-left">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Classmate Contact:</span>
              <a href={`mailto:${profile.email}`} className="text-xs font-semibold text-dark hover:underline flex items-center space-x-1 break-all">
                <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0 mr-1" />
                <span>{profile.email}</span>
              </a>
            </div>
          )}

          {/* Match Score Info Block */}
          {!isOwnProfile && currentUser && profile.match && profile.match.score > 0 && (
            <div className="border border-border rounded-md p-4 mb-4 text-left bg-background">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border mb-2 ${matchInfo.color}`}>
                {matchInfo.label}
              </span>
              <p className="text-xs text-muted leading-relaxed">
                {matchInfo.description}
              </p>
            </div>
          )}

          {/* Connection Actions / Edit Profile Button */}
          <div className="mt-6">
            {isOwnProfile ? (
              <button
                onClick={handleEditToggle}
                className="w-full flex items-center justify-center space-x-2 bg-background hover:bg-border text-dark border border-border py-2 rounded-md text-sm font-semibold transition cursor-pointer"
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Cancel Editing</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            ) : currentUser ? (
              /* Relationship Button States */
              <div className="space-y-2">
                {relationship.state === 'none' && (
                  <button
                    onClick={handleSendRequest}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white py-2 rounded-md text-sm font-semibold transition disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    <span>Connect & Swap</span>
                  </button>
                )}

                {relationship.state === 'outgoing_pending' && (
                  <button
                    onClick={handleCancelRequest}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-red-50 text-error border border-error py-2 rounded-md text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel Request</span>
                  </button>
                )}

                {relationship.state === 'incoming_pending' && (
                  <div className="space-y-2">
                    <button
                      onClick={handleAcceptRequest}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-success hover:bg-green-700 text-white py-2 rounded-md text-sm font-semibold transition disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={handleRejectRequest}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-red-50 text-error border border-error py-2 rounded-md text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                )}

                {relationship.state === 'accepted' && (
                  <button
                    onClick={handleCancelRequest}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-red-50 text-error border border-error py-2 rounded-md text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    <UserMinus className="h-4 w-4" />
                    <span>Disconnect</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md text-sm font-semibold transition cursor-pointer"
              >
                Log in to Connect
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Bio details, Teaching and Learning skills */}
        <div className="md:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-error rounded-md p-4 text-sm">
              {error}
            </div>
          )}

          {editMode ? (
            /* ================= EDIT MODE FORM ================= */
            <form onSubmit={handleSaveProfile} className="bg-white border border-border rounded-lg p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-dark border-b border-border pb-2 flex items-center space-x-1.5">
                <Edit3 className="h-5 w-5 text-primary" />
                <span>Modify Profile Details</span>
              </h3>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Location</label>
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Short Bio</label>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition resize-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              {/* Skills Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Teaching Skills Checklist */}
                <div>
                  <h4 className="text-sm font-bold text-dark border-b border-border pb-1.5 mb-3 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span>Skills You Can Teach:</span>
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-2 border border-border/40 rounded-md p-2 bg-background">
                    {skillsList.map((skill) => (
                      <label key={skill._id} className="flex items-center space-x-2 text-xs text-dark hover:bg-white p-1 rounded transition cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editedTeaching.includes(skill.name)}
                          onChange={() => toggleSkill(skill.name, 'teach')}
                          className="rounded text-primary focus:ring-primary h-4 w-4 border-border"
                        />
                        <span>{skill.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Learning Skills Checklist */}
                <div>
                  <h4 className="text-sm font-bold text-dark border-b border-border pb-1.5 mb-3 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span>Skills You Want to Learn:</span>
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-2 border border-border/40 rounded-md p-2 bg-background">
                    {skillsList.map((skill) => (
                      <label key={skill._id} className="flex items-center space-x-2 text-xs text-dark hover:bg-white p-1 rounded transition cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editedLearning.includes(skill.name)}
                          onChange={() => toggleSkill(skill.name, 'learn')}
                          className="rounded text-primary focus:ring-primary h-4 w-4 border-border"
                        />
                        <span>{skill.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Save Controls */}
              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center space-x-1.5 bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md text-sm font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{actionLoading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* ================= VIEW MODE PROFILE ================= */
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm space-y-6">
              
              {/* Bio block */}
              <div>
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider border-b border-border pb-1.5 mb-3">About Me</h3>
                <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">
                  {profile.bio || 'This user has not written a bio yet.'}
                </p>
              </div>

              {/* Skills block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider border-b border-border pb-1.5 mb-3">Skills I Can Teach</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.teachingSkills && profile.teachingSkills.length > 0 ? (
                      profile.teachingSkills.map((s, idx) => (
                        <SkillBadge key={idx} skill={s} type="teach" />
                      ))
                    ) : (
                      <span className="text-sm text-muted italic">No teaching skills listed</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider border-b border-border pb-1.5 mb-3">Skills I Want to Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.learningSkills && profile.learningSkills.length > 0 ? (
                      profile.learningSkills.map((s, idx) => (
                        <SkillBadge key={idx} skill={s} type="learn" />
                      ))
                    ) : (
                      <span className="text-sm text-muted italic">No learning request tags added</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
