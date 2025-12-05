// app/event/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { registerAthleteV2 } from '@/app/actions'; // Asegúrate de tener esta acción en actions.ts

const prisma = new PrismaClient();

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { ticketTypes: true }
  });

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header del Evento */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
           <div className="inline-block bg-blue-600 px-3 py-1 rounded text-xs font-bold mb-4">
             {event.category}
           </div>
           <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
           <div className="flex gap-6 text-gray-300 mt-4">
             <p>📅 {new Date(event.date).toLocaleDateString()}</p>
             <p>📍 {event.location}</p>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información */}
        <div className="md:col-span-2 space-y-8">
          {event.bannerUrl && (
            <img src={event.bannerUrl} alt="Banner" className="w-full rounded-xl shadow-md" />
          )}
          
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Sobre el evento</h2>
            <div className="prose text-gray-600">
              <p>{event.longDesc || event.shortDesc || "No hay descripción disponible."}</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tickets */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Inscripciones</h3>
            
            <form action={registerAthleteV2} className="space-y-4">
              <input type="hidden" name="eventId" value={event.id} />
              
              {/* Selección de Ticket */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">Selecciona tu entrada:</p>
                {event.ticketTypes.map((ticket) => (
                  <label key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="ticketTypeId" value={ticket.id} required className="text-blue-600" />
                      <div>
                        <p className="font-bold text-sm text-gray-900">{ticket.name}</p>
                        <p className="text-xs text-gray-500">{ticket.description}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">${Number(ticket.price)}</span>
                  </label>
                ))}
              </div>

              {/* Datos del Corredor */}
              <div className="space-y-3">
                <input name="name" required placeholder="Nombre Completo" className="w-full p-3 border rounded-lg text-sm" />
                <input name="email" type="email" required placeholder="Correo Electrónico" className="w-full p-3 border rounded-lg text-sm" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-4">
                Completar Inscripción
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                Pago seguro simulado (Mock)
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}