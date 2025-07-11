import React from 'react';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className }) => {
  // Espaço Sinergia location coordinates
  const lat = 40.6405;
  const lng = -8.6538;
  const zoom = 15;
  
  // Google Maps embed URL with the exact location
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDM4JzI1LjgiTiA4wrAzOScxMy43Ilc!5e0!3m2!1spt!2spt!4v1234567890!5m2!1spt!2spt&zoom=${zoom}`;

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-2xl ${className}`}>
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização do Espaço Sinergia - Aveiro"
        className="rounded-xl"
      ></iframe>
      
      {/* Overlay for premium effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
    </div>
  );
};

export default GoogleMap;