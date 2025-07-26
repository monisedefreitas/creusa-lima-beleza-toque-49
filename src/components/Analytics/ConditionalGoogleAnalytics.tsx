
import * as React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface ConditionalGoogleAnalyticsProps {
  trackingId: string;
}

const ConditionalGoogleAnalytics: React.FC<ConditionalGoogleAnalyticsProps> = ({ trackingId }) => {
  const { canUseAnalytics } = useCookieConsent();

  if (!canUseAnalytics()) {
    return null;
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
};

export default ConditionalGoogleAnalytics;
