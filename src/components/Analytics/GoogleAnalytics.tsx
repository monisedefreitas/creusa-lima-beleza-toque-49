
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  trackingId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  trackingId = 'G-XXXXXXXXXX' // Replace with actual GA4 ID
}) => {
  const location = useLocation();

  useEffect(() => {
    if (!trackingId || trackingId === 'G-XXXXXXXXXX') return;

    // Initialize Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      document.head.removeChild(script);
    };
  }, [trackingId]);

  // Track page views
  useEffect(() => {
    if (!window.gtag || !trackingId || trackingId === 'G-XXXXXXXXXX') return;

    window.gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search,
    });
  }, [location, trackingId]);

  return null;
};

// Analytics helper functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!window.gtag) return;
  
  window.gtag('event', eventName, {
    event_category: 'engagement',
    ...parameters
  });
};

export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click', {
    event_category: 'contact',
    event_label: 'whatsapp_button'
  });
};

export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    event_category: 'services',
    event_label: serviceName
  });
};

export const trackBookingIntent = () => {
  trackEvent('booking_intent', {
    event_category: 'conversion',
    event_label: 'booking_button'
  });
};

export default GoogleAnalytics;
