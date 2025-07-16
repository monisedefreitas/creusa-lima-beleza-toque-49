
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Star } from 'lucide-react';
import LazyImage from '@/components/Performance/LazyImage';
import type { Tables } from '@/integrations/supabase/types';

type MediaItem = Tables<'media_gallery'> & {
  media_gallery_tags?: Array<{
    gallery_tags: Tables<'gallery_tags'>;
  }>;
  services?: Tables<'services'>;
};

interface GalleryGridProps {
  items: MediaItem[];
  onItemClick: (item: MediaItem, index: number) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <Card 
          key={item.id} 
          className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-sage-200 hover:border-darkgreen-300 transform hover:-translate-y-1"
          onClick={() => onItemClick(item, index)}
        >
          <CardContent className="p-0 relative">
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
              <LazyImage 
                src={item.file_url}
                alt={item.alt_text || item.title || 'Imagem da galeria'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onLoad={() => {}}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="h-8 w-8 text-white mb-2 mx-auto" />
                  <p className="text-white text-sm text-center px-2">Ver detalhes</p>
                </div>
              </div>

              {/* Featured Badge */}
              {item.is_featured && (
                <Badge className="absolute top-3 right-3 bg-yellow-500 text-white shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>

            {/* Info Section */}
            <div className="p-4 space-y-2">
              {item.title && (
                <h3 className="font-semibold text-darkgreen-900 text-sm line-clamp-2 group-hover:text-darkgreen-700 transition-colors">
                  {item.title}
                </h3>
              )}
              
              {item.services && (
                <Badge variant="secondary" className="text-xs bg-sage-100 text-darkgreen-800">
                  {item.services.name}
                </Badge>
              )}

              {/* Tags */}
              {item.media_gallery_tags && item.media_gallery_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.media_gallery_tags.slice(0, 2).map(({ gallery_tags }) => (
                    <Badge
                      key={gallery_tags.id}
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: gallery_tags.color, color: gallery_tags.color }}
                    >
                      {gallery_tags.name}
                    </Badge>
                  ))}
                  {item.media_gallery_tags.length > 2 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{item.media_gallery_tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GalleryGrid;
