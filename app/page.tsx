// app/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// Instancia de Prisma (Singleton simple para MVP)
const prisma = new PrismaClient();

// Evitar cache para ver eventos nuevos al instante
export const dynamic = 'force-dynamic';

async function getEvents(category?: string) {
  // Filtro por categoría si existe en la URL
  const whereClause = category && category !== '' 
    ? { category: category as any, isPublished: true } 
    : { isPublished: true };
  
  return await prisma.event.findMany({
    where: whereClause,
    orderBy: { date: 'asc' },
    include: { ticketTypes: true } // Importante para calcular el precio "desde"
  });
}

export default async function HomePage({ searchParams }: { searchParams: { cat?: string } }) {
  const events = await getEvents(searchParams.cat);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gray-900 py-20 px-4 text-center relative overflow-hidden">
        {/* Imagen de fondo oscurecida */}
        <div className="absolute inset-0 z-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1533560906234-54c628e685bc?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Desafía tus límites
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 font-light">
            La plataforma oficial de inscripciones para los mejores eventos deportivos de Latinoamérica.
          </p>
          
          {/* Botones de Categoría Rápida */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/?cat=RUNNING" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 transition">
              🏃 Running
            </Link>
            <Link href="/?cat=CICLISMO" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 transition">
              🚴 Ciclismo
            </Link>
            <Link href="/?cat=TRIATLON" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 transition">
              🏊 Triatlón
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Eventos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchParams.cat ? `Eventos de ${searchParams.cat}` : 'Próximos Eventos'}
          </h2>
          {searchParams.cat && (
            <Link href="/" className="text-blue-600 text-sm font-medium hover:underline">
              ✕ Borrar filtros
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="mb-4 text-4xl">📅</div>
            <h3 className="text-lg font-medium text-gray-900">No hay eventos disponibles</h3>
            <p className="text-gray-500 mb-6">Sé el primero en crear un evento en esta categoría.</p>
            <Link href="/dashboard/events/new" className="btn-primary bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Crear Evento Ahora
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              // Calcular precio más bajo
              const prices = event.ticketTypes.map(t => Number(t.price));
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              const hasTickets = prices.length > 0;

              return (
                <Link key={event.id} href={`/event/${event.id}`} className="group h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    
                    {/* Banner */}
                    <div className="h-52 bg-gray-200 relative overflow-hidden">
                      <img 
                        src={event.bannerUrl || `https://source.unsplash.com/800x600/?${event.category.toLowerCase()},sport`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                        {event.category}
                      </div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">
                          {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                        {event.shortDesc || "Un evento increíble te espera. Regístrate ahora para asegurar tu lugar."}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center text-gray-500 text-xs">
                          <span className="truncate max-w-[150px]">📍 {event.location}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium">Inscripción</p>
                          <p className="text-lg font-bold text-gray-900">
                            {hasTickets ? `$${minPrice.toFixed(2)}` : 'Gratis'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer Simple */}
      <footer className="bg-white border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © 2025 PlataformaAlpha. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}