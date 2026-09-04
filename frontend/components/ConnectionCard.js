import Link from 'next/link';
import { Mail, MapPin, UserMinus, ArrowRight } from 'lucide-react';

export default function ConnectionCard({ connection, onDisconnect }) {
  return (
    <div className="bg-white rounded-lg border border-border p-5 flex flex-col justify-between hover:border-gray-300 transition duration-150 shadow-sm">
      <div>
        {/* User profile picture & location header */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={connection.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
            alt={connection.name}
            className="w-12 h-12 rounded-full object-cover border border-border"
          />
          <div>
            <h3 className="text-base font-bold text-dark">{connection.name}</h3>
            <p className="text-xs text-muted flex items-center mt-0.5">
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted" />
              {connection.location || 'Unknown Location'}
            </p>
          </div>
        </div>

        {/* Display verified contact details */}
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
          <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">Contact Info:</p>
          <div className="flex items-center space-x-1.5 text-sm text-dark font-medium">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${connection.email}`} className="hover:underline select-all text-xs break-all">
              {connection.email}
            </a>
          </div>
        </div>
      </div>

      {/* Button options */}
      <div className="flex space-x-2">
        <Link
          href={`/profile/${connection._id}`}
          className="flex-1 flex items-center justify-center space-x-1 bg-background hover:bg-border text-dark border border-border py-1.5 rounded-md text-xs font-semibold transition"
        >
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={() => onDisconnect(connection.requestId)}
          title="Disconnect Connection"
          className="bg-white hover:bg-red-50 text-error border border-error px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer"
        >
          <UserMinus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
