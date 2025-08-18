import React from "react";

const Banner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-pink-300 rounded-lg opacity-80 transform rotate-12"></div>
      <div className="absolute top-32 left-24 w-12 h-12 bg-purple-500 rounded-lg opacity-70"></div>
      <div className="absolute top-28 left-40 w-8 h-8 bg-green-400 rounded opacity-60"></div>
      <div className="absolute top-36 left-48 w-6 h-6 bg-orange-400 rounded opacity-50"></div>

      <div className="absolute top-20 right-10 w-20 h-16 bg-blue-400 rounded-lg opacity-60 transform -rotate-12"></div>
      <div className="absolute top-40 right-24 w-16 h-12 bg-red-500 rounded-lg opacity-70"></div>
      <div className="absolute top-32 right-40 w-12 h-12 bg-white rounded-lg opacity-80 shadow-lg"></div>

      <div className="absolute bottom-20 left-20 w-14 h-14 bg-teal-400 rounded-lg opacity-50 transform rotate-45"></div>
      <div className="absolute bottom-32 right-16 w-18 h-14 bg-indigo-400 rounded-lg opacity-60"></div>

      {/* Contenido principal */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-white text-4xl md:text-5xl font-light mb-4">
          ¡Qué alegría volver a verte! <span className="inline-block">👋</span>
        </h1>
        <p className="text-white/90 text-lg font-light">
          Accede a tu cuenta para seguir diseñando
        </p>
      </div>

      {/* Tarjeta de usuario */}
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 z-10">
        <div className="text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-semibold">D</span>
          </div>

          {/* Nombre y email */}
          <h2 className="text-gray-900 text-xl font-semibold mb-2">
            Diego Calfuan
          </h2>
          <p className="text-gray-600 mb-8">diegocalfuan@gmail.com</p>

          {/* Botón continuar */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 mb-6">
            Continuar
          </button>
        </div>
      </div>

      {/* Opción de usar otra cuenta */}
      <button className="mt-6 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center gap-2 z-10">
        <span className="text-xl">+</span>
        Usar otra cuenta
      </button>

      {/* Enlace de eliminar cuentas */}
      <div className="mt-8 z-10">
        <span className="text-white/80 text-sm">
          ¿Necesitas{" "}
          <a
            href="#"
            className="text-purple-300 hover:text-purple-200 underline"
          >
            eliminar cuentas
          </a>
          ?
        </span>
      </div>
    </div>
  );
};

export default Banner;
