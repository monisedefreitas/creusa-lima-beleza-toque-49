
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import LazyImage from '@/components/Performance/LazyImage';
import type { Tables } from '@/integrations/supabase/types';

type MediaItem = Tables<'media_gallery'> & {
  media_gallery_tags?: Array<{
    gallery_tags: Tables<'gallery_tags'>;
  }>;
  services?: Tables<'services'>;
};

interface GalleryLightboxProps {
  item: MediaItem | null;
  items: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrevious
}) => {
  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black border-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <DialogTitle className="text-white text-lg">
            {item.title || 'Imagem da Galeria'}
          </DialogTitle>
        </DialogHeader>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <LazyImage 
            src={item.file_url}
            alt={item.alt_text || item.title || 'Imagem da galeria'}
            className="max-w-full max-h-full object-contain"
            onLoad={() => {}}
          />

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm disabled:opacity-30"
                onClick={onPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm disabled:opacity-30"
                onClick={onNext}
                disabled={currentIndex === items.length - 1}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>

        {/* Bottom Info Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 space-y-4">
          {/* Counter */}
          {items.length > 1 && (
            <div className="text-center">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          )}

          {/* Image Info */}
          <div className="space-y-3">
            {item.description && (
              <p className="text-white text-sm leading-relaxed max-w-3xl">
                {item.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              {/* Service */}
              {item.services && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>{item.services.name}</span>
                </div>
              )}

              {/* Upload Date */}
              {item.upload_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.upload_date).toLocaleDateString('pt-PT')}</span>
                </div>
              )}

              {/* Dimensions */}
              {item.dimensions && (
                <div className="flex items-center gap-1">
                  <span>{item.dimensions}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {item.media_gallery_tags && item.media_gallery_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-300" />
                {item.media_gallery_tags.map(({ gallery_tags }) => (
                  <Badge
                    key={gallery_tags.id}
                    variant="secondary"
                    className="bg-white/20 text-white border-0 backdrop-blur-sm"
                    style={{ backgroundColor: `${gallery_tags.color}40` }}
                  >
                    {gallery_tags.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryLightbox;
