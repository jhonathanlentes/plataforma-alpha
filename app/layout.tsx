import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plataforma Alpha | El SO para Eventos Deportivos',
  description: 'Gestión integral para carreras, triatlones y eventos deportivos en LatAm.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container-custom flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              ALPHA
            </Link>

            {/* Menú Desktop */}
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <Link href="#features" className="hover:text-blue-600">Características</Link>
              <Link href="#pricing" className="hover:text-blue-600">Precios</Link>
              <Link href="/scanner" className="hover:text-blue-600 text-blue-500">App Staff (QR)</Link>
            </div>

            {/* Acciones */}
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black flex items-center">
                Ingresar
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Crear Evento
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">{children}</main>
        
        <footer className="bg-white border-t py-12 mt-12">
          <div className="container-custom text-center text-gray-500 text-sm">
            <p>© 2025 Plataforma Alpha. Hecho para el deporte en LatAm.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
