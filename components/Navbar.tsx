// components/Navbar.tsx
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 1. Logo y Categorías */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1 rounded font-bold text-xl group-hover:bg-blue-700 transition">PA</div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">PlataformaAlpha</span>
            </Link>

            {/* Menú Desktop */}
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/?cat=RUNNING" className="hover:text-blue-600 transition">Running</Link>
              <Link href="/?cat=CICLISMO" className="hover:text-blue-600 transition">Ciclismo</Link>
              <Link href="/?cat=TRIATLON" className="hover:text-blue-600 transition">Triatlón</Link>
            </div>
          </div>

          {/* 2. Área de Acción */}
          <div className="flex items-center gap-4">
            
            {/* Acceso Staff (Scanner) */}
            <Link href="/scanner" className="text-gray-400 hover:text-gray-800 p-2" title="Scanner Staff">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
            </Link>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {/* Botones Claros */}
            <div className="flex items-center gap-3">
               {/* Login genérico */}
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                Ingresar
              </Link>
              
              {/* Botón Principal para Organizadores */}
              <Link href="/dashboard" className="bg-gray-900 text-white hover:bg-gray-800 text-xs px-4 py-2 rounded-md font-bold transition shadow-sm flex items-center gap-2">
                <span>Crear Evento</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}