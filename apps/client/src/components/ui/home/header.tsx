"use client";

import { useState } from "react";
import { Button } from "../button";
import { RegisterModal } from "@/components/modals/register-modal";
import { LoginModal } from "@/components/modals/login-modal"; // Importar el LoginModal

export default function Header() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado para el modal de login
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-white text-2xl font-bold">
              Canva
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/design"
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              Diseño
            </a>
            <a
              href="/product"
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              Producto
            </a>
            <a
              href="/plans"
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              Planes
            </a>
            <a
              href="/business"
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              Empresas
            </a>
            <a
              href="/education"
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              Educación
            </a>
            <a
              href="/help"
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              Ayuda
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsRegisterModalOpen(true)}
              variant="ghost"
              className="hidden sm:inline-flex text-white hover:text-white hover:bg-white/20"
            >
              Regístrate
            </Button>
            <Button
              onClick={() => setIsLoginModalOpen(true)} // Abrir modal de login en lugar de navegar
              className="bg-white text-purple-600 hover:bg-gray-50"
            >
              Iniciar sesión
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-white hover:bg-white/20"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <a
                href="/design"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium py-2"
              >
                Diseño
              </a>
              <a
                href="/product"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium py-2"
              >
                Producto
              </a>
              <a
                href="/plans"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium py-2"
              >
                Planes
              </a>
              <a
                href="/business"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium py-2"
              >
                Empresas
              </a>
              <a
                href="/education"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium py-2"
              >
                Educación
              </a>
              <a
                href="/help"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium py-2"
              >
                Ayuda
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  onClick={() => setIsRegisterModalOpen(true)}
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  Regístrate
                </Button>
                <Button
                  onClick={() => setIsLoginModalOpen(true)} // También para móvil
                  className="bg-white text-purple-600 hover:bg-gray-50"
                >
                  Iniciar sesión
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Modal de Login */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
