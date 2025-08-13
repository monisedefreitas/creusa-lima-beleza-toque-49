
import React from 'react';
import SEOManager from '@/components/SEO/SEOManager';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import { Shield, Mail, Calendar, Database } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      <SEOManager
        title="Política de Privacidade - Creusa Lima Linfoterapia"
        description="Política de privacidade e proteção de dados da clínica Creusa Lima. Saiba como tratamos e protegemos suas informações pessoais de acordo com o RGPD."
        keywords="política privacidade, proteção dados, RGPD, Creusa Lima, linfoterapia"
        type="article"
      />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-darkgreen-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-darkgreen-900 mb-4">
                Política de Privacidade
              </h1>
              <p className="text-darkgreen-600 text-lg">
                Última atualização: {new Date().toLocaleDateString('pt-PT')}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6" />
                  1. Informações que Recolhemos
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Recolhemos diferentes tipos de informação quando utiliza os nossos serviços:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li><strong>Dados de Identificação:</strong> Nome completo, número de telefone, endereço de email</li>
                  <li><strong>Dados de Contacto:</strong> Informações fornecidas nos formulários de contacto e marcação</li>
                  <li><strong>Dados de Navegação:</strong> Cookies, endereço IP, tipo de navegador</li>
                  <li><strong>Dados de Saúde:</strong> Informações médicas relevantes para os tratamentos (com consentimento expresso)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  2. Como Utilizamos os Seus Dados
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Os seus dados são utilizados para as seguintes finalidades:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>Prestação de serviços de linfoterapia e estética</li>
                  <li>Gestão de marcações e consultas</li>
                  <li>Comunicação sobre tratamentos e seguimento</li>
                  <li>Melhoria dos nossos serviços</li>
                  <li>Cumprimento de obrigações legais</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  3. Base Legal do Tratamento
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  O tratamento dos seus dados pessoais baseia-se em:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li><strong>Consentimento:</strong> Para comunicações promocionais e cookies não essenciais</li>
                  <li><strong>Execução de contrato:</strong> Para prestação dos serviços contratados</li>
                  <li><strong>Interesse legítimo:</strong> Para melhoria dos serviços e segurança</li>
                  <li><strong>Obrigação legal:</strong> Para cumprimento de requisitos fiscais e de saúde</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  4. Os Seus Direitos (RGPD/LGPD)
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Tem os seguintes direitos relativamente aos seus dados pessoais:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                    <li><strong>Acesso:</strong> Consultar os dados que possuímos</li>
                    <li><strong>Retificação:</strong> Corrigir dados incorretos</li>
                    <li><strong>Apagamento:</strong> Solicitar a eliminação dos dados</li>
                    <li><strong>Portabilidade:</strong> Receber os dados em formato estruturado</li>
                  </ul>
                  <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                    <li><strong>Oposição:</strong> Opor-se ao tratamento</li>
                    <li><strong>Limitação:</strong> Restringir o processamento</li>
                    <li><strong>Retirada:</strong> Retirar o consentimento a qualquer momento</li>
                    <li><strong>Reclamação:</strong> Apresentar queixa à autoridade competente</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  5. Partilha de Dados
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Os seus dados pessoais não são vendidos, alugados ou partilhados com terceiros, exceto:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>Com fornecedores de serviços que nos auxiliam (sob acordo de confidencialidade)</li>
                  <li>Quando exigido por lei ou autoridades competentes</li>
                  <li>Para proteção dos nossos direitos legais</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  6. Retenção de Dados
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Mantemos os seus dados pessoais apenas pelo tempo necessário para:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li><strong>Dados de clientes:</strong> 5 anos após o último contacto</li>
                  <li><strong>Dados de saúde:</strong> Conforme legislação aplicável (mínimo 10 anos)</li>
                  <li><strong>Dados de marketing:</strong> Até retirada do consentimento</li>
                  <li><strong>Dados de navegação:</strong> Máximo 13 meses</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  7. Segurança dos Dados
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados:
                </p>
                <ul className="list-disc list-inside text-darkgreen-700 space-y-2">
                  <li>Encriptação de dados sensíveis</li>
                  <li>Controlo de acesso restrito</li>
                  <li>Backups seguros e regulares</li>
                  <li>Formação regular da equipa em proteção de dados</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  8. Contacto
                </h2>
                <p className="text-darkgreen-700 mb-4">
                  Para exercer os seus direitos ou esclarecer dúvidas sobre esta política:
                </p>
                <div className="bg-sage-50 rounded-lg p-6">
                  <p className="text-darkgreen-800 font-medium mb-2">Encarregada de Proteção de Dados:</p>
                  <p className="text-darkgreen-700">Creusa Lima</p>
                  <p className="text-darkgreen-700">Email: privacidade@creusalima.pt</p>
                  <p className="text-darkgreen-700">Telefone: +351 964 481 966</p>
                  <p className="text-darkgreen-700">Morada: Rua Fernando Lopes Graça 379 B, 2775-571 Carcavelos</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-darkgreen-800 mb-4">
                  9. Alterações a Esta Política
                </h2>
                <p className="text-darkgreen-700">
                  Esta política pode ser atualizada periodicamente. As alterações significativas serão 
                  comunicadas através do website ou por email. Recomendamos a consulta regular desta página.
                </p>
              </section>

              <div className="bg-darkgreen-50 rounded-lg p-6 mt-8">
                <p className="text-darkgreen-800 font-medium text-center">
                  Esta política está em conformidade com o RGPD (UE) 2016/679 e a LGPD brasileira.
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

export default PrivacyPolicy;
