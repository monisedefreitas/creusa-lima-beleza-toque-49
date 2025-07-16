
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const TestimonialsManager: React.FC = () => {
  const { testimonials, isLoading, fetchTestimonials, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchTestimonials(true);
  }, []);

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'pending') return !testimonial.is_approved;
    if (filter === 'approved') return testimonial.is_approved;
    return true;
  });

  const handleApprove = async (id: string, approved: boolean) => {
    await updateTestimonial(id, { is_approved: approved });
  };

  const handleFeature = async (id: string, featured: boolean) => {
    await updateTestimonial(id, { is_featured: featured });
  };

  const handleDelete = async (id: string) => {
    await deleteTestimonial(id);
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Carregando depoimentos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Depoimentos</h1>
          <p className="text-gray-600 mt-2">
            Gerir depoimentos de clientes e aprovar para exibição no site
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todos ({testimonials.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pendentes ({testimonials.filter(t => !t.is_approved).length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Aprovados ({testimonials.filter(t => t.is_approved).length})
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'Nenhum depoimento encontrado' 
                  : filter === 'pending'
                  ? 'Nenhum depoimento pendente'
                  : 'Nenhum depoimento aprovado'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={testimonial.is_approved ? "default" : "secondary"}>
                          {testimonial.is_approved ? "Aprovado" : "Pendente"}
                        </Badge>
                        {testimonial.is_featured && (
                          <Badge variant="outline">Em Destaque</Badge>
                        )}
                      </div>
                    </div>
                    {testimonial.rating && renderStars(testimonial.rating)}
                    <CardDescription>
                      {testimonial.email && `${testimonial.email} • `}
                      {testimonial.phone && `${testimonial.phone} • `}
                      {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{testimonial.message}</p>
                
                <div className="flex gap-2 flex-wrap">
                  {!testimonial.is_approved ? (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(testimonial.id, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(testimonial.id, false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Desaprovar
                    </Button>
                  )}
                  
                  {testimonial.is_approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFeature(testimonial.id, !testimonial.is_featured)}
                    >
                      {testimonial.is_featured ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Remover Destaque
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Destacar
                        </>
                      )}
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja eliminar este depoimento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(testimonial.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;
