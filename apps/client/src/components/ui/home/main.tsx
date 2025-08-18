import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  FileText,
  Monitor,
  Calculator,
  Camera,
  Globe,
  Play,
} from "lucide-react";

const Main = () => {
  const categories = [
    {
      title: "Redes sociales",
      icon: <Share2 className="w-6 h-6" />,
      bgColor: "bg-red-500",
      preview: {
        text: "Crea\nel post\nperfecto",
        bgImage: "bg-gradient-to-br from-purple-600 to-pink-600",
      },
    },
    {
      title: "Docs",
      icon: <FileText className="w-6 h-6" />,
      bgColor: "bg-teal-500",
      preview: {
        text: "¡Hola,\nequipo!",
        subtitle: "Agenda",
        bgColor: "bg-teal-50",
        textColor: "text-teal-800",
      },
    },
    {
      title: "Presentaciones",
      icon: <Monitor className="w-6 h-6" />,
      bgColor: "bg-yellow-500",
      preview: {
        text: "Presenta\nfácilmente",
        bgImage: "bg-gradient-to-br from-orange-500 to-red-600",
      },
    },
    {
      title: "Hojas de cálculo",
      badge: "Nuevo",
      icon: <Calculator className="w-6 h-6" />,
      bgColor: "bg-blue-500",
      preview: {
        table: true,
        bgColor: "bg-blue-50",
      },
    },
    {
      title: "Editor de fotos",
      badge: "Nuevo",
      icon: <Camera className="w-6 h-6" />,
      bgColor: "bg-pink-500",
      preview: {
        image: true,
        bgImage: "bg-gradient-to-br from-green-400 to-blue-500",
      },
    },
    {
      title: "Sitios web",
      icon: <Globe className="w-6 h-6" />,
      bgColor: "bg-indigo-700",
      preview: {
        text: "Diseño de\nsitios web",
        bgImage: "bg-gradient-to-br from-blue-600 to-purple-700",
      },
    },
    {
      title: "Videos",
      icon: <Play className="w-6 h-6" />,
      bgColor: "bg-purple-500",
      preview: {
        video: true,
        bgImage: "bg-gradient-to-br from-purple-500 to-pink-500",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-6">
            <span className="text-black">¿Qué </span>
            <span className="bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              diseñamos
            </span>
            <span className="text-black"> hoy?</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Con Canva, puedes diseñar, generar, editar e imprimir lo que
            quieras.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-full font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
            Quiero diseñar
          </button>
        </div>

        {/* Categories Grid */}
        <div className="relative">
          {/* Navigation arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-200 z-10">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-200 z-10">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                {/* Header */}
                <div className={`${category.bgColor} text-white p-4 relative`}>
                  <div className="flex items-center justify-between mb-2">
                    {category.icon}
                    {category.badge && (
                      <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                        {category.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm leading-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Preview */}
                <div className="p-4 h-40 flex items-center justify-center">
                  {category.preview.table ? (
                    <div className="w-full">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-white p-2 rounded">IMAGEN</div>
                          <div className="bg-white p-2 rounded">STATUS</div>
                          <div className="bg-white p-2 rounded">BUDGET</div>
                          <div className="bg-gray-200 p-2 rounded h-8"></div>
                          <div className="bg-gray-200 p-2 rounded h-8"></div>
                          <div className="bg-gray-200 p-2 rounded h-8"></div>
                        </div>
                      </div>
                    </div>
                  ) : category.preview.image ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <div
                        className={`${category.preview.bgImage} w-full h-full flex items-center justify-center`}
                      >
                        <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ) : category.preview.video ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <div
                        className={`${category.preview.bgImage} w-full h-full flex items-center justify-center`}
                      >
                        <div className="text-white">
                          <div className="w-8 h-6 bg-white/30 rounded mb-2"></div>
                          <div className="w-12 h-2 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full rounded-lg ${
                        category.preview.bgColor || category.preview.bgImage
                      } flex flex-col justify-center items-start p-4`}
                    >
                      {category.preview.subtitle && (
                        <div className="text-xs text-gray-600 mb-2">
                          {category.preview.subtitle}
                        </div>
                      )}
                      <div
                        className={`${
                          category.preview.textColor || "text-white"
                        } font-medium text-sm leading-tight whitespace-pre-line`}
                      >
                        {category.preview.text}
                      </div>
                      {category.title === "Docs" && (
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-4 h-4 bg-blue-100 rounded"></div>
                            <span>Reunión de hola</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-4 h-4 bg-green-100 rounded"></div>
                            <span>Presentación de ventas</span>
                          </div>
                        </div>
                      )}
                      {category.title === "Sitios web" && (
                        <div className="mt-3">
                          <div className="text-xs text-white/80">PONENTES</div>
                          <div className="flex gap-1 mt-1">
                            <div className="w-6 h-6 bg-white/30 rounded"></div>
                            <div className="w-6 h-6 bg-white/30 rounded"></div>
                            <div className="w-6 h-6 bg-white/30 rounded"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
