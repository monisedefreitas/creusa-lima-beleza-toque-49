
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';

const TestimonialsSection: React.FC = () => {
  const { testimonials, isLoading } = useTestimonials();

  // Filtrar apenas depoimentos aprovados e em destaque
  const featuredTestimonials = testimonials.filter(t => t.is_approved && t.is_featured);

  if (isLoading || featuredTestimonials.length === 0) {
    return null;
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-sage-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que dizem as nossas clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experiências reais de clientes que confiaram nos nossos serviços
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTestimonials.slice(0, 6).map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-sage-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-8 h-8 text-sage-400 flex-shrink-0" />
                  {testimonial.rating && renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.message}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sage-600 font-semibold text-sm">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">Cliente verificada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#testimonial-form"
            className="inline-flex items-center px-6 py-3 bg-darkgreen text-white rounded-lg hover:bg-darkgreen/90 transition-colors"
          >
            Partilhe a sua experiência
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
