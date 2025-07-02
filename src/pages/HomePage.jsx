import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProfileCard from '../components/ProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProfiles } from '../context/ProfileContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiInstagram, FiUsers, FiTrendingUp, FiSettings } = FiIcons;

const HomePage = () => {
  const { profiles, loading, error } = useProfiles();
  const [visibleProfiles, setVisibleProfiles] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const filteredProfiles = profiles.filter(profile =>
    profile.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProfiles = filteredProfiles.slice(0, visibleProfiles);

  useEffect(() => {
    if (inView && displayedProfiles.length < filteredProfiles.length) {
      setVisibleProfiles(prev => Math.min(prev + 8, filteredProfiles.length));
    }
  }, [inView, displayedProfiles.length, filteredProfiles.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <SafeIcon icon={FiInstagram} className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  IG Directory
                </h1>
                <p className="text-sm text-gray-600">Discover amazing profiles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
                <span>Admin</span>
              </Link>
              
              <Link
                to="/submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="text-lg" />
                <span>Add My IG Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <br />
              <span className="text-yellow-300">Instagram Profiles</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Join our community directory and showcase your Instagram profile to the world
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="text-2xl" />
                <span className="text-lg">{profiles.length}+ Profiles</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTrendingUp} className="text-2xl" />
                <span className="text-lg">Growing Community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SafeIcon icon={FiIcons.FiSearch} className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No profiles found</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to add your Instagram profile!'}
              </p>
              <Link
                to="/submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="text-lg" />
                <span>Add Your Profile</span>
              </Link>
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence>
                  {displayedProfiles.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      variants={itemVariants}
                      layout
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProfileCard profile={profile} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Trigger */}
              {displayedProfiles.length < filteredProfiles.length && (
                <div ref={loadMoreRef} className="text-center py-8">
                  <LoadingSpinner />
                </div>
              )}

              {/* Results Summary */}
              <div className="text-center mt-12 text-gray-600">
                <p>
                  Showing {displayedProfiles.length} of {filteredProfiles.length} profiles
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h3>
          <p className="text-xl mb-8 text-white/90">
            Submit your Instagram profile and connect with amazing people
          </p>
          <Link
            to="/submit"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="text-xl" />
            <span>Add My Profile Now</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <SafeIcon icon={FiInstagram} className="text-white text-xl" />
            </div>
            <h4 className="text-xl font-bold">IG Directory</h4>
          </div>
          <p className="text-gray-400">
            Discover and showcase amazing Instagram profiles in our community directory
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;