"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter} from "next/navigation";

// Componente del Modal de Registro exactamente como la imagen
export const RegisterModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con imagen de fondo */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden flex">
        {/* Left Side - Form */}
        <div className="flex-1 p-12 max-w-md bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              ¡Anímate a volver!
            </h1>

            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 mx-auto">
              D
            </div>

            {/* User Info */}
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Diego Calfuan
            </h2>
            <p className="text-gray-500 mb-8">diegocalfuan@gmail.com</p>
          </div>

          {/* Continue Button */}
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-xl mb-6"
            onClick={() => console.log("Continuar")}
          >
            Continuar
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-400">o</span>
            </div>
          </div>

          {/* Alternative Login */}
          <Button
            variant="ghost"
            className="w-full text-gray-700 hover:text-gray-900 font-medium py-2 mb-8"
            onClick={() => router.push("/register")}
          >
            Usar otra cuenta
          </Button>

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center">
            Al continuar, aceptas los{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Términos y condiciones de uso
            </a>{" "}
            de Canva. Consulta nuestra{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Política de privacidad
            </a>
            .
          </div>

          {/* Delete Account Link */}
          <div className="text-center mt-6">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
            >
              ¿Necesitas eliminar una cuenta?
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex flex-1">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat rounded-r-3xl"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDUwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTVlN2ViIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZ3JhZCkiLz48L3N2Zz4=')",
            }}
          >
            {/* Simulación de la laptop con Canva */}
            <div className="flex items-center justify-center h-full p-8">
              <div className="bg-gray-800 rounded-2xl p-4 shadow-2xl transform -rotate-1">
                <div className="bg-white rounded-lg p-4 w-80 h-48">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm font-bold text-purple-600">
                      Diseña con facilidad
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-purple-200 rounded w-3/4"></div>
                    <div className="h-4 bg-purple-200 rounded w-1/2"></div>
                    <div className="h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded mt-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        Diseña con facilidad
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <div className="w-6 h-6 bg-red-400 rounded"></div>
                    <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                    <div className="w-6 h-6 bg-purple-400 rounded"></div>
                    <div className="w-6 h-6 bg-blue-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
