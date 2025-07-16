
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import GalleryFilters from './GalleryFilters';
import GalleryGrid from './GalleryGrid';
import GalleryLightbox from './GalleryLightbox';
import type { Tables } from '@/integrations/supabase/types';

type MediaItem = Tables<'media_gallery'> & {
  media_gallery_tags?: Array<{
    gallery_tags: Tables<'gallery_tags'>;
  }>;
  services?: Tables<'services'>;
};

const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { elementRef, isVisible } = useScrollAnimation();

  const { data: gallery, isLoading, error } = useQuery({
    queryKey: ['enhanced-media-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_gallery')
        .select(`
          *,
          media_gallery_tags (
            gallery_tags (*)
          ),
          services (
            id,
            name,
            category
          )
        `)
        .eq('is_active', true)
        .eq('file_type', 'image')
        .order('is_featured', { ascending: false })
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as MediaItem[];
    }
  });

  const filteredGallery = useMemo(() => {
    if (!gallery || gallery.length === 0) return [];
    
    let filtered = gallery;
    
    // Filter by category (service category)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.services?.category === selectedCategory ||
        item.category === selectedCategory
      );
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        item.media_gallery_tags?.some(tagRelation =>
          selectedTags.includes(tagRelation.gallery_tags.id)
        )
      );
    }
    
    return filtered;
  }, [gallery, selectedCategory, selectedTags]);

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

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkgreen-800 mx-auto"></div>
          <p className="text-sage-600 mt-4">A carregar galeria...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-darkgreen-900 mb-4">Erro ao carregar galeria</h2>
            <p className="text-sage-600">
              Ocorreu um erro ao carregar as imagens. Por favor, tente novamente mais tarde.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={elementRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-darkgreen-900 mb-6">
              <span className="font-tan-mon-cheri">Galeria</span>
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
              Explore os nossos trabalhos e transformações. Descubra a qualidade e dedicação que colocamos em cada serviço.
            </p>
          </div>

          {gallery && gallery.length > 0 ? (
            <>
              {/* Filters */}
              <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                <GalleryFilters
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onCategoryChange={setSelectedCategory}
                  onTagToggle={handleTagToggle}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Gallery Grid */}
              {filteredGallery.length > 0 ? (
                <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                  <GalleryGrid
                    items={filteredGallery}
                    onItemClick={handleImageClick}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-darkgreen-900 mb-2">
                    Nenhuma imagem encontrada
                  </h3>
                  <p className="text-sage-600 mb-4">
                    Não foram encontradas imagens com os filtros selecionados.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-darkgreen-800 hover:text-darkgreen-900 font-medium underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-darkgreen-900 mb-2">
                Galeria em construção
              </h3>
              <p className="text-sage-600">
                Estamos a preparar as nossas melhores imagens para partilhar convosco.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        item={selectedImage}
        items={filteredGallery}
        currentIndex={currentIndex}
        onClose={() => setSelectedImage(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </section>
  );
};

export default GallerySection;
