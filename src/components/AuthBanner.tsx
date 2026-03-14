'use client';

import React, { useState, useEffect } from 'react';

interface AuthBannerProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function AuthBanner({ onLoginClick, onRegisterClick }: AuthBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('authBannerDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('authBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="auth-banner">
      <span className="auth-banner-icon animate-blink">▓</span>
      <span className="auth-banner-text">
        Track your progress, unlock skill tree, earn XP after completing challenges.
      </span>
      <button 
        onClick={onRegisterClick}
        className="auth-banner-btn-register"
      >
        Register Free
      </button>
      <button 
        onClick={onLoginClick}
        className="auth-banner-btn-login"
      >
        Login
      </button>
      <button 
        onClick={handleDismiss}
        className="auth-banner-close"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
