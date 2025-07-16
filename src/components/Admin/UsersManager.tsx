
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, Mail, Calendar } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

const UsersManager: React.FC = () => {
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AdminUser[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Utilizadores</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Utilizadores</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{adminUsers?.length || 0} utilizadores admin</span>
        </div>
      </div>

      <div className="grid gap-4">
        {adminUsers?.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold">{user.email}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded uppercase">
                        {user.role || 'Admin'}
                      </span>
                      {!user.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Inativo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>Email verificado</span>
                      </div>
                      {user.created_at && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Criado em {new Date(user.created_at).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!adminUsers || adminUsers.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum utilizador encontrado
            </h3>
            <p className="text-gray-600">
              Não existem utilizadores administrativos registados no sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersManager;
