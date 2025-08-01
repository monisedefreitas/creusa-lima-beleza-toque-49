
import React, { useState, useEffect } from 'react';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export const useCookieConsent = () => {

  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed);
        setHasConsent(true);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
      }
    }
  }, []);

  const updateConsent = (newConsent: CookieConsent) => {
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    setConsent(newConsent);
    setHasConsent(true);
  };

  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setConsent(null);
    setHasConsent(false);
  };

  const canUseAnalytics = () => {
    return consent?.analytics === true;
  };

  const canUseMarketing = () => {
    return consent?.marketing === true;
  };

  return {
    consent,
    hasConsent,
    updateConsent,
    clearConsent,
    canUseAnalytics,
    canUseMarketing
  };
};
