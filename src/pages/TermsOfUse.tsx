
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import { FileText, Scale, AlertCircle } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <FileText className="w-16 h-16 text-darkgreen-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-darkgreen-900 mb-4">
                Termos de Uso
              </h1>
              <p className="text-darkgreen-600 text-lg">
                Última atualização: {new Date().toLocaleDateString('pt-PT')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Ao aceder e utilizar este website, concorda expressamente com estes termos de uso. 
                  Se não concordar com qualquer parte destes termos, não deverá utilizar este website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  2. Descrição do Serviço
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Este website destina-se a fornecer informações sobre os serviços de linfoterapia e 
                  estética prestados por Creusa Lima, bem como permitir a marcação de consultas e 
                  contacto direto.
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>Informações sobre tratamentos de linfoterapia</li>
                  <li>Serviços de estética avançada</li>
                  <li>Sistema de marcação online</li>
                  <li>Área de contacto e localização</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  3. Uso Aceitável
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Compromete-se a utilizar este website apenas para fins legítimos e de acordo com estes termos. 
                  É proibido:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>Usar o website para fins ilegais ou não autorizados</li>
                  <li>Tentar aceder a áreas restritas do sistema</li>
                  <li>Interferir com o funcionamento normal do website</li>
                  <li>Transmitir vírus ou código malicioso</li>
                  <li>Copiar ou reproduzir conteúdo sem autorização</li>
                  <li>Usar informações para spam ou marketing não solicitado</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  4. Marcação de Consultas
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  O sistema de marcação online está sujeito às seguintes condições:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>As marcações estão sujeitas à disponibilidade</li>
                  <li>Confirmação necessária por telefone ou email</li>
                  <li>Política de cancelamento com 24 horas de antecedência</li>
                  <li>Informações médicas devem ser precisas e completas</li>
                  <li>Menores de idade necessitam de autorização dos pais/tutores</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6" />
                  5. Propriedade Intelectual
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Todo o conteúdo deste website, incluindo textos, imagens, logos, gráficos e software, 
                  é propriedade de Creusa Lima ou dos seus licenciadores e está protegido por direitos de autor.
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>É permitida a visualização e impressão para uso pessoal</li>
                  <li>É proibida a reprodução comercial sem autorização</li>
                  <li>Links para o website são permitidos com crédito adequado</li>
                  <li>O uso de conteúdo para treino de IA requer autorização expressa</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  6. Limitação de Responsabilidade
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Na máxima extensão permitida por lei, Creusa Lima não será responsável por:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>Danos diretos, indiretos ou consequenciais</li>
                  <li>Perda de dados ou interrupção de serviço</li>
                  <li>Erros ou omissões no conteúdo</li>
                  <li>Ações de terceiros ou links externos</li>
                  <li>Problemas técnicos ou de conectividade</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  7. Informações Médicas
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Aviso Importante</h4>
                      <p className="text-amber-700">
                        As informações fornecidas neste website são apenas para fins informativos e 
                        não substituem o aconselhamento médico profissional. Consulte sempre um 
                        profissional de saúde qualificado para questões específicas.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  8. Cookies e Privacidade
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Este website utiliza cookies conforme descrito na nossa 
                  <a href="/privacy-policy" className="text-sage-600 hover:text-sage-700 underline ml-1">
                    Política de Privacidade
                  </a>. 
                  Ao continuar a usar o website, concorda com o uso de cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  9. Modificações dos Termos
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação no website. 
                  A utilização continuada constitui aceitação dos novos termos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  10. Lei Aplicável e Jurisdição
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Estes termos são regidos pela lei portuguesa. Qualquer litígio será submetido 
                  à jurisdição exclusiva dos tribunais de Lisboa, Portugal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  11. Contacto
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Para questões sobre estes termos de uso:
                </p>
                <div className="bg-sage-50 rounded-lg p-6">
                  <p className="text-darkgreen-800 font-medium mb-2">Creusa Lima - Linfoterapia e Estética</p>
                  <p className="text-darkgreen-700">Email: info@creusalima.pt</p>
                  <p className="text-darkgreen-700">Telefone: +351 964 481 966</p>
                  <p className="text-darkgreen-700">Morada: Rua Fernando Lopes Graça 379 B, 2775-571 Carcavelos</p>
                </div>
              </section>

              <div className="bg-darkgreen-50 rounded-lg p-6 mt-8">
                <p className="text-darkgreen-800 font-medium text-center">
                  Ao utilizar este website, confirma que leu, compreendeu e aceita estes termos de uso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
