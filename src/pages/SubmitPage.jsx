import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useProfiles } from '../context/ProfileContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiInstagram, FiUser, FiMail, FiCheck, FiAlertCircle } = FiIcons;

const SubmitPage = () => {
  const navigate = useNavigate();
  const { submitProfile } = useProfiles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const watchHandle = watch('handle');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const profile = await submitProfile(data);
      setPreviewData(profile);
      toast.success('Profile submitted successfully! Awaiting approval.');
      reset();
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to submit profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (previewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="text-green-600 text-2xl" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Submission Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your Instagram profile has been submitted and is now awaiting approval. 
            You'll be redirected to the homepage shortly.
          </p>
          
          {/* Preview Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={previewData.profileImage}
                alt={previewData.handle}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">@{previewData.handle}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{previewData.bio}</p>
              </div>
            </div>
          </div>
          
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>Go to Homepage</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-lg" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <SafeIcon icon={FiInstagram} className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Add Your Instagram Profile</h1>
                <p className="text-white/90">Join our community directory</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Instagram Handle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SafeIcon icon={FiUser} className="text-lg" />
                  </div>
                  <input
                    type="text"
                    placeholder="your_instagram_handle"
                    {...register('handle', {
                      required: 'Instagram handle is required',
                      pattern: {
                        value: /^@?[a-zA-Z0-9._]+$/,
                        message: 'Please enter a valid Instagram handle'
                      },
                      minLength: {
                        value: 1,
                        message: 'Handle must be at least 1 character'
                      },
                      maxLength: {
                        value: 30,
                        message: 'Handle must be less than 30 characters'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                      errors.handle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {watchHandle && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      @{watchHandle.replace('@', '')}
                    </div>
                  )}
                </div>
                {errors.handle && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <SafeIcon icon={FiAlertCircle} className="text-sm" />
                    <span>{errors.handle.message}</span>
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Enter your Instagram username without the @ symbol
                </p>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SafeIcon icon={FiMail} className="text-lg" />
                  </div>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <SafeIcon icon={FiAlertCircle} className="text-sm" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Optional: for notifications and verification
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex space-x-3">
                  <SafeIcon icon={FiIcons.FiInfo} className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">How it works:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• We'll automatically fetch your public profile data</li>
                      <li>• Your submission will be reviewed by our team</li>
                      <li>• Once approved, your profile will appear in the directory</li>
                      <li>• Only public Instagram data is used</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting Profile...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiCheck} className="text-lg" />
                    <span>Submit My Profile</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            By submitting your profile, you agree that your public Instagram data 
            will be displayed in our directory. You can request removal at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;