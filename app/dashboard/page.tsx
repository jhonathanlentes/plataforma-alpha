import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Esta función se ejecuta en el servidor cada vez que entras
async function getEvents() {
  // Obtenemos todos los eventos (en producción filtraríamos por usuario)
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: { 
       registrations: true // Incluimos inscripciones para contar vendidos
    }
  });
  return events;
}

export default async function DashboardPage() {
  const events = await getEvents();

  // Calcular ingresos totales simples
  const totalRevenue = events.reduce((acc, event) => {
    // Esto es simplificado. En real sumaríamos las Orders pagadas.
    return acc + (event.registrations.length * 25); // Asumiendo precio base 25 por ahora
  }, 0);

  const totalSold = events.reduce((acc, event) => acc + event.registrations.length, 0);

  return (
    <div className="container-custom py-8">

      {/* Header del Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500">Bienvenido Organizador.</p>
        </div>
        <Link href="/dashboard/events/new" className="btn-primary">
          + Crear Nuevo Evento
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Ingresos Estimados</p>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Entradas Vendidas</p>
          <p className="text-3xl font-bold text-gray-900">{totalSold}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm font-medium text-gray-500">Eventos Activos</p>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
        </div>
      </div>

      {/* Tabla de Eventos */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-900">Mis Eventos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="px-6 py-3">Nombre del Evento</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Slug (Link Público)</th>
                <th className="px-6 py-3 text-right">Vendidos</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No has creado eventos aún. ¡Crea el primero!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-blue-600">
                       <Link href={`/event/${event.slug}`} target="_blank">
                         /event/{event.slug}
                       </Link>
                    </td>
                    <td className="px-6 py-4 text-right">{event.registrations.length}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/events/${event.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        Gestionar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
