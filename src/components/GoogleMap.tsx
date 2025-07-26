
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className }) => {
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('is_active', true)
        .order('is_primary', { ascending: false })
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  // Use primary address with the correct Sinergia Corpo & Mente coordinates
  const primaryAddress = addresses?.find(addr => addr.is_primary) || addresses?.[0];
  
  // Coordenadas corretas da Sinergia Corpo & Mente
  const lat = primaryAddress?.latitude || 38.6964;
  const lng = primaryAddress?.longitude || -9.3334;
  const zoom = 16;
  
  // Address details for Sinergia Corpo & Mente
  const addressLine1 = primaryAddress?.street_address || 'R. Fernando Lopes Graça, 379 B';
  const addressLine2 = `${primaryAddress?.postal_code || '2775-571'} ${primaryAddress?.city || 'Carcavelos'}`;
  const country = primaryAddress?.country || 'Portugal';
  const businessName = primaryAddress?.name || 'Sinergia Corpo & Mente';
  
  // Google Maps embed URL com as coordenadas corretas da Sinergia Corpo & Mente
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.2!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQxJzQ3LjAiTiA5wrAyMCcwMC4yIlc!5e0!3m2!1spt!2spt!4v1234567890!5m2!1spt!2spt&zoom=${zoom}`;

  const handleNavigate = () => {
    // Usar as coordenadas exatas da Sinergia Corpo & Mente para navegação GPS
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=ChIJdRa2_KpMOA0R1732DDkDwMw`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96 md:h-[450px] group">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Localização - ${businessName}, ${addressLine1}, ${addressLine2}`}
          className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay for premium effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
      </div>
      
      {/* Address and Navigation */}
      <div className="mt-6 text-center space-y-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg inline-block">
          <div className="text-sm text-darkgreen-600 space-y-1">
            <div className="font-bold text-darkgreen-800">{businessName}</div>
            <div className="font-semibold text-darkgreen-800">{addressLine1}</div>
            <div>{addressLine2}</div>
            <div>{country}</div>
          </div>
        </div>
        
        <Button 
          onClick={handleNavigate}
          className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Navigation className="h-5 w-5 mr-2" />
          Iniciar Navegação
        </Button>
      </div>
    </div>
  );
};

export default GoogleMap;
