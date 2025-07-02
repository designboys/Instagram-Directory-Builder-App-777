import supabase from '../lib/supabase';
import { instagramService } from './instagramService';

const profanityFilter = ['spam', 'fake', 'scam', 'bot']; // Basic filter

const filterProfanity = (text) => {
  return profanityFilter.some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
};

export const profileService = {
  async getApprovedProfiles() {
    const { data, error } = await supabase
      .from('profiles_ig_directory')
      .select('*')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved profiles:', error);
      throw new Error('Failed to fetch profiles');
    }

    // Transform data to match expected format
    return data.map(profile => ({
      id: profile.id,
      handle: profile.handle,
      profileImage: profile.profile_image,
      bio: profile.bio,
      instagramUrl: profile.instagram_url,
      email: profile.email,
      status: profile.status,
      submittedAt: profile.submitted_at,
      approvedAt: profile.approved_at,
    }));
  },

  async getPendingProfiles() {
    const { data, error } = await supabase
      .from('profiles_ig_directory')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending profiles:', error);
      throw new Error('Failed to fetch pending profiles');
    }

    return data.map(profile => ({
      id: profile.id,
      handle: profile.handle,
      profileImage: profile.profile_image,
      bio: profile.bio,
      instagramUrl: profile.instagram_url,
      email: profile.email,
      status: profile.status,
      submittedAt: profile.submitted_at,
    }));
  },

  async submitProfile(profileData) {
    // Clean handle
    const handle = profileData.handle.replace('@', '').trim();
    
    // Check if handle already exists
    const { data: existingProfile } = await supabase
      .from('profiles_ig_directory')
      .select('id')
      .eq('handle', handle)
      .single();

    if (existingProfile) {
      throw new Error('This Instagram handle has already been submitted');
    }

    // Fetch Instagram data
    const instagramData = await instagramService.fetchProfileData(handle);
    
    // Check for profanity
    if (filterProfanity(instagramData.bio) || filterProfanity(handle)) {
      throw new Error('Profile contains inappropriate content');
    }

    const profileToInsert = {
      handle,
      profile_image: instagramData.profileImage,
      bio: instagramData.bio.substring(0, 200), // Limit bio length
      instagram_url: `https://instagram.com/${handle}`,
      email: profileData.email || null,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('profiles_ig_directory')
      .insert([profileToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error submitting profile:', error);
      throw error;
    }

    return {
      id: data.id,
      handle: data.handle,
      profileImage: data.profile_image,
      bio: data.bio,
      instagramUrl: data.instagram_url,
      email: data.email,
      status: data.status,
      submittedAt: data.submitted_at,
    };
  },

  async approveProfile(profileId) {
    const { data, error } = await supabase
      .from('profiles_ig_directory')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      console.error('Error approving profile:', error);
      throw new Error('Failed to approve profile');
    }

    return {
      id: data.id,
      handle: data.handle,
      profileImage: data.profile_image,
      bio: data.bio,
      instagramUrl: data.instagram_url,
      email: data.email,
      status: data.status,
      submittedAt: data.submitted_at,
      approvedAt: data.approved_at,
    };
  },

  async rejectProfile(profileId) {
    const { error } = await supabase
      .from('profiles_ig_directory')
      .delete()
      .eq('id', profileId);

    if (error) {
      console.error('Error rejecting profile:', error);
      throw new Error('Failed to reject profile');
    }
    
    return true;
  },

  async deleteProfile(profileId) {
    const { error } = await supabase
      .from('profiles_ig_directory')
      .delete()
      .eq('id', profileId);

    if (error) {
      console.error('Error deleting profile:', error);
      throw new Error('Failed to delete profile');
    }
    
    return true;
  },
};