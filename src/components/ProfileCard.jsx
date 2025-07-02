import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiExternalLink, FiInstagram } = FiIcons;

const ProfileCard = ({ profile }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        {/* Profile Image and Handle */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={profile.profileImage}
              alt={profile.handle}
              className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
              <SafeIcon icon={FiInstagram} className="text-white text-xs" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              @{profile.handle}
            </h3>
            <p className="text-sm text-gray-500">Instagram Profile</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {profile.bio}
          </p>
        </div>

        {/* Visit Button */}
        <motion.a
          href={profile.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <SafeIcon icon={FiExternalLink} className="text-lg group-hover:rotate-12 transition-transform" />
          <span>Visit on Instagram</span>
        </motion.a>
      </div>

      {/* Gradient Footer */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
    </motion.div>
  );
};

export default ProfileCard;