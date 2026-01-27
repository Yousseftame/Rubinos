// src/components/SplashScreen.tsx
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onLoadComplete?: () => void;
}

const SplashScreen = ({ onLoadComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Remove 'loading' class from body when splash is shown
    document.body.classList.remove('loading');
    
    // Auto-hide after minimum time
    const timer = setTimeout(() => {
      if (onLoadComplete) {
        setFadeOut(true);
        setTimeout(() => {
          onLoadComplete();
          // Mark that splash has been shown in this session
          sessionStorage.setItem('rubinos_splash_shown', 'true');
        }, 500); // Wait for fade animation
      }
    }, 1200); // Minimum display time

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0E302A' }}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Animated Logo/Text */}
        <div className="animate-fade-in-up">
          <h1 
            className="font-head text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.05em] text-center"
            style={{ color: '#d4ccc0' }}
          >
            Rubino's
          </h1>
        </div>

        {/* Elegant Subtitle */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
          <p 
            className="font-serif text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase text-center"
            style={{ color: '#b8aea0' }}
          >
            Italian Experience
          </p>
        </div>

        {/* Decorative Divider */}
        <div 
          className="animate-fade-in flex items-center gap-4 mt-8"
          style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="h-[1px] w-12 sm:w-16 md:w-20" style={{ backgroundColor: '#b8aea0' }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#b8aea0' }} />
          <div className="h-[1px] w-12 sm:w-16 md:w-20" style={{ backgroundColor: '#b8aea0' }} />
        </div>

        {/* Loading Animation */}
        <div 
          className="animate-fade-in mt-12"
          style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="flex space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: '#d4ccc0', animationDelay: '0s' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: '#d4ccc0', animationDelay: '0.1s' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: '#d4ccc0', animationDelay: '0.2s' }}
            />
          </div>
        </div>
      </div>

      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      />
    </div>
  );
};

export default SplashScreen;