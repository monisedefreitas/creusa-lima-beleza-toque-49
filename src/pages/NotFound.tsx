
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-darkgreen-200 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-darkgreen-900 mb-4">
              Página não encontrada
            </h2>
            <p className="text-darkgreen-600 text-lg mb-8">
              A página que procura não existe ou foi movida. 
              Verifique o endereço ou regresse à página inicial.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full bg-darkgreen-700 hover:bg-darkgreen-800 text-white">
                <Home className="w-4 h-4 mr-2" />
                Voltar à Página Inicial
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full border-sage-300 text-darkgreen-700 hover:bg-sage-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar Atrás
            </Button>
          </div>

          <div className="mt-12 p-6 bg-sage-50 rounded-lg">
            <h3 className="text-lg font-semibold text-darkgreen-800 mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-darkgreen-600 mb-4">
              Entre em contacto connosco para obter assistência.
            </p>
            <div className="space-y-2 text-sm text-darkgreen-700">
              <p>📞 +351 964 481 966</p>
              <p>📧 info@creusalima.pt</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
