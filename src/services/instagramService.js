// Mock Instagram service - in production, replace with actual Instagram data fetching
export const instagramService = {
  async fetchProfileData(handle) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Instagram data - in production, use actual Instagram API or scraping service
    const mockProfiles = {
      'photography_lover': {
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
        bio: 'Capturing life\'s beautiful moments through my lens 📸 Travel enthusiast and coffee addict ☕',
      },
      'foodie_adventures': {
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Food blogger sharing culinary adventures around the world 🍕🍜 Chef by day, foodie by night',
      },
      'fitness_journey': {
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Personal trainer helping you achieve your fitness goals 💪 Yoga instructor | Wellness advocate',
      },
      'art_creator': {
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Digital artist creating vibrant illustrations and designs 🎨 Commission work available',
      },
      'travel_wanderer': {
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Exploring the world one destination at a time ✈️ Travel tips and hidden gems',
      },
      'music_producer': {
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        bio: 'Music producer and DJ spinning beats that move your soul 🎵 Available for collaborations',
      },
    };

    // Return mock data or generate random data for new handles
    if (mockProfiles[handle]) {
      return mockProfiles[handle];
    }

    // Generate random profile data for demo
    const randomImages = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=150&h=150&fit=crop&crop=face',
    ];

    const randomBios = [
      'Creative soul sharing my journey ✨ Life is beautiful',
      'Living my best life 🌟 Follow for daily inspiration',
      'Entrepreneur | Dreamer | Achiever 💫 Making things happen',
      'Passionate about life and everything in it 🎯 Stay positive',
      'Creating content that matters 📱 Join the community',
    ];

    return {
      profileImage: randomImages[Math.floor(Math.random() * randomImages.length)],
      bio: randomBios[Math.floor(Math.random() * randomBios.length)],
    };
  },
};

// For production use, you might want to use:
// 1. Instagram Basic Display API (requires Facebook App approval)
// 2. Third-party services like RapidAPI Instagram endpoints
// 3. Web scraping services (be careful about terms of service)
// 4. NoCodeAPI or similar services

/*
Example with actual Instagram API:

export const instagramService = {
  async fetchProfileData(handle) {
    try {
      // Option 1: Using Instagram Basic Display API
      const response = await fetch(`https://graph.instagram.com/v12.0/${handle}?fields=account_type,media_count,followers_count&access_token=${ACCESS_TOKEN}`);
      
      // Option 2: Using a third-party service
      const response = await fetch(`https://instagram-scraper-api.p.rapidapi.com/v1/info?username=${handle}`, {
        headers: {
          'X-RapidAPI-Key': 'your-rapidapi-key',
          'X-RapidAPI-Host': 'instagram-scraper-api.p.rapidapi.com'
        }
      });
      
      const data = await response.json();
      
      return {
        profileImage: data.profile_pic_url,
        bio: data.biography,
      };
    } catch (error) {
      throw new Error('Failed to fetch Instagram data');
    }
  },
};
*/