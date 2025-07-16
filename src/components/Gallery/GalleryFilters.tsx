
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GalleryFiltersProps {
  selectedCategory: string;
  selectedTags: string[];
  onCategoryChange: (category: string) => void;
  onTagToggle: (tagId: string) => void;
  onClearFilters: () => void;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearFilters
}) => {
  const { data: services } = useQuery({
    queryKey: ['gallery-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, category')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: tags } = useQuery({
    queryKey: ['gallery-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_tags')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const categories = React.useMemo(() => {
    if (!services) return [];
    const uniqueCategories = [...new Set(services.map(s => s.category).filter(Boolean))];
    return uniqueCategories;
  }, [services]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0;

  return (
    <div className="space-y-6 mb-8">
      {/* Category Filters */}
      <div>
        <h3 className="text-lg font-semibold text-darkgreen-900 mb-3">Categorias</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => onCategoryChange('all')}
            className={`${selectedCategory === 'all' ? 'bg-darkgreen-800 hover:bg-darkgreen-900' : ''}`}
          >
            Todas
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category)}
              className={`${selectedCategory === category ? 'bg-darkgreen-800 hover:bg-darkgreen-900' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tag Filters */}
      {tags && tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-darkgreen-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTags.includes(tag.id) 
                    ? 'bg-darkgreen-800 hover:bg-darkgreen-900' 
                    : 'hover:bg-sage-100'
                }`}
                style={{ borderColor: tag.color, color: selectedTags.includes(tag.id) ? 'white' : tag.color }}
                onClick={() => onTagToggle(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-sage-600 hover:text-darkgreen-800"
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryFilters;
