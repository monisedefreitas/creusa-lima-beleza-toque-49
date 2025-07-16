
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { Tables } from '@/integrations/supabase/types';

type MediaItem = Tables<'media_gallery'>;

const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { elementRef, isVisible } = useScrollAnimation();

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['media_gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('is_active', true)
        .eq('file_type', 'image')
        .order('order_index');
      
      if (error) throw error;
      return data as MediaItem[];
    }
  });

  const categories = React.useMemo(() => {
    if (!gallery) return [];
    const uniqueCategories = [...new Set(gallery.map(item => item.category).filter(Boolean))];
    return uniqueCategories;
  }, [gallery]);

  const filteredGallery = React.useMemo(() => {
    if (!gallery) return [];
    if (selectedCategory === 'all') return gallery;
    return gallery.filter(item => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  const handleImageClick = (image: MediaItem, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (filteredGallery && currentIndex < filteredGallery.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(filteredGallery[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(filteredGallery[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'Escape') setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkgreen-800 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section ref={elementRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-darkgreen-900 mb-6">
              <span className="font-tan-mon-cheri">Galeria</span>
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
              Veja alguns dos nossos trabalhos e transformações que proporcionamos aos nossos clientes.
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className={`flex justify-center mb-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="mb-2"
                >
                  Todos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="mb-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            {filteredGallery.map((item, index) => (
              <Card 
                key={item.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
                onClick={() => handleImageClick(item, index)}
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.file_url}
                      alt={item.alt_text || item.title || 'Imagem da galeria'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Info Overlay */}
                  {(item.title || item.category) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {item.title && (
                        <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      )}
                      {item.category && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  )}

                  {item.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-darkgreen-800">
                      Destacado
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? 'Nenhuma imagem encontrada na galeria.' 
                  : `Nenhuma imagem encontrada na categoria "${selectedCategory}".`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent 
          className="max-w-7xl max-h-[90vh] p-0 bg-black border-0"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white">
              {selectedImage?.title}
            </DialogTitle>
          </DialogHeader>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <img 
                src={selectedImage.file_url}
                alt={selectedImage.alt_text || selectedImage.title || 'Imagem da galeria'}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Buttons */}
              {filteredGallery && filteredGallery.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={handleNext}
                    disabled={currentIndex === filteredGallery.length - 1}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {filteredGallery && filteredGallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {filteredGallery.length}
                </div>
              )}

              {/* Image Description */}
              {selectedImage.description && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
                  <p className="text-sm">{selectedImage.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
