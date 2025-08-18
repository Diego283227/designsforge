import React from "react";
import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 - Descargar y Producto */}
          <div>
            <div className="mb-8">
              <h3 className="text-teal-500 text-2xl font-bold mb-4">
                DesignsForge
              </h3>
              <p className="text-gray-600 font-medium mb-3">
                Descargar DesignsForge gratis
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Windows
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Mac
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-gray-700 font-medium mb-4">Producto</h4>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Últimos lanzamientos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Suite Visual
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Estudio Mágico
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Redes sociales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Funciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Marketplace de apps
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna 2 - Planes */}
          <div>
            <h4 className="text-gray-700 font-medium mb-4">Planes</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Planes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Gratis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Pro
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Equipos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Empresas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Educación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Educación superior
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-gray-700 font-medium mb-4">Inspiración</h4>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Tendencias de diseño
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-800 transition-colors">
                    Kits de Trabajo
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna 3 - Ayuda */}
          <div>
            <h4 className="text-gray-700 font-medium mb-4">Ayuda</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Seguridad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Centro de transparencia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  IA segura de DesignsForge
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Accesibilidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Servicios a empresas
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Herramientas */}
          <div>
            <h4 className="text-gray-700 font-medium mb-4">Herramientas</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-800 transition-colors flex items-center gap-2"
                >
                  Design School
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Mapa del sitio web
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Generador de código QR
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Generador de logos con IA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Generador de firmas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-800 transition-colors">
                  Generador de nombres de empresas
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* URL del sitio en la parte inferior */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-blue-600">
            <a href="#" className="hover:underline">
              https://www.designsforge.com/enterprise/
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
