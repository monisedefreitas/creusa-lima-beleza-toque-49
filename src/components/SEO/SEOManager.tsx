
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title = "Creusa Lima - Linfoterapia e Estética Premium em Carcavelos",
  description = "Especialista em linfoterapia, pós-operatório e estética avançada. 20+ anos de experiência. Atendimento personalizado em Carcavelos, Portugal.",
  keywords = "linfoterapia, drenagem linfática, pós-operatório, estética, Carcavelos, Portugal, massagem, radiofrequência, hifu, depilação laser",
  image = "/lovable-uploads/73d8cd7b-d053-484a-b84e-0c423886228f.png",
  url = window.location.href,
  type = "website"
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Creusa Lima - Linfoterapia e Estética",
    "description": description,
    "url": url,
    "image": image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Fernando Lopes Graça 379 B",
      "addressLocality": "Carcavelos",
      "postalCode": "2775-571",
      "addressCountry": "PT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "38.6917",
      "longitude": "-9.3339"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+351-964-481-966",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://instagram.com/creusalima_estetica"
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-18:00"
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Creusa Lima" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="pt-PT" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Creusa Lima - Linfoterapia e Estética" />
      <meta property="og:locale" content="pt_PT" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2D5016" />
      <meta name="msapplication-TileColor" content="#2D5016" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Preload Important Resources */}
      <link rel="preload" href="/lovable-uploads/46b56184-9c80-42e2-9f4b-8fb2bf567b13.png" as="image" />
      <link rel="preload" href="/lovable-uploads/73d8cd7b-d053-484a-b84e-0c423886228f.png" as="image" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//api.whatsapp.com" />
    </Helmet>
  );
};

export default SEOManager;
