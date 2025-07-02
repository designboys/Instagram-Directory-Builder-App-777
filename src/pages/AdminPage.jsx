import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useProfiles } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCheck, FiX, FiTrash2, FiClock, FiUsers, FiEye, FiLogOut, FiShield, FiUser } = FiIcons;

const AdminPage = () => {
  const { profiles, pendingProfiles, loading, approveProfile, rejectProfile, deleteProfile } = useProfiles();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleApprove = async (profileId) => {
    setProcessingId(profileId);
    try {
      await approveProfile(profileId);
      toast.success('Profile approved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to approve profile');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (profileId) => {
    setProcessingId(profileId);
    try {
      await rejectProfile(profileId);
      toast.success('Profile rejected');
    } catch (error) {
      toast.error(error.message || 'Failed to reject profile');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    setProcessingId(profileId);
    try {
      await deleteProfile(profileId);
      toast.success('Profile deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete profile');
    } finally {
      setProcessingId(null);
    }
  };

  const ProfileCard = ({ profile, showActions = true }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={profile.profileImage}
            alt={profile.handle}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">@{profile.handle}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                profile.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{profile.bio}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Submitted: {new Date(profile.submittedAt).toLocaleDateString()}</span>
              {profile.email && <span>Email: {profile.email}</span>}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <SafeIcon icon={FiEye} className="text-sm" />
              <span className="text-sm">View Profile</span>
            </a>

            <div className="flex items-center space-x-2">
              {profile.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleApprove(profile.id)}
                    disabled={processingId === profile.id}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    {processingId === profile.id ? (
                      <LoadingSpinner size="xs" />
                    ) : (
                      <SafeIcon icon={FiCheck} className="text-sm" />
                    )}
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(profile.id)}
                    disabled={processingId === profile.id}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiX} className="text-sm" />
                    <span>Reject</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleDelete(profile.id)}
                  disabled={processingId === profile.id}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                >
                  {processingId === profile.id ? (
                    <LoadingSpinner size="xs" />
                  ) : (
                    <SafeIcon icon={FiTrash2} className="text-sm" />
                  )}
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="text-lg" />
                <span>Back to Directory</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-xl">
                  <SafeIcon icon={FiShield} className="text-white text-lg" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiClock} className="text-lg" />
                  <span>{pendingProfiles.length} Pending</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiUsers} className="text-lg" />
                  <span>{profiles.length} Approved</span>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-300" />

              {/* User Info & Logout */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <SafeIcon icon={FiUser} className="text-lg" />
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-sm text-gray-500">({user?.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending Approval ({pendingProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'approved'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Approved Profiles ({profiles.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'pending' ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {pendingProfiles.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No pending profiles to review at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {pendingProfiles.map((profile) => (
                      <ProfileCard key={profile.id} profile={profile} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="approved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {profiles.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No approved profiles</h3>
                  <p className="text-gray-600">Approved profiles will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {profiles.map((profile) => (
                      <ProfileCard key={profile.id} profile={profile} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;