import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

const ProfileContext = createContext();

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const approved = await profileService.getApprovedProfiles();
      const pending = await profileService.getPendingProfiles();
      setProfiles(approved);
      setPendingProfiles(pending);
      setError(null);
    } catch (err) {
      setError('Failed to fetch profiles');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitProfile = async (profileData) => {
    try {
      const newProfile = await profileService.submitProfile(profileData);
      setPendingProfiles(prev => [newProfile, ...prev]);
      return newProfile;
    } catch (err) {
      throw new Error('Failed to submit profile');
    }
  };

  const approveProfile = async (profileId) => {
    try {
      const approvedProfile = await profileService.approveProfile(profileId);
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
      setProfiles(prev => [approvedProfile, ...prev]);
      return approvedProfile;
    } catch (err) {
      throw new Error('Failed to approve profile');
    }
  };

  const rejectProfile = async (profileId) => {
    try {
      await profileService.rejectProfile(profileId);
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (err) {
      throw new Error('Failed to reject profile');
    }
  };

  const deleteProfile = async (profileId) => {
    try {
      await profileService.deleteProfile(profileId);
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (err) {
      throw new Error('Failed to delete profile');
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const value = {
    profiles,
    pendingProfiles,
    loading,
    error,
    submitProfile,
    approveProfile,
    rejectProfile,
    deleteProfile,
    refetch: fetchProfiles,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};