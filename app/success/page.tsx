import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function SuccessPage({ searchParams }: { searchParams: { id: string } }) {
  if (!searchParams.id) return notFound();

  const registration = await prisma.registration.findUnique({
    where: { id: searchParams.id },
    include: { event: true, ticket: true }
  });

  if (!registration) return notFound();

  // Generamos QR rápido
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${registration.qrCode}`;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-green-500">

        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Inscripción Confirmada!</h1>
        <p className="text-gray-500 mb-6">Nos vemos en <strong>{registration.event.title}</strong>.</p>

        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TU PASE DE ACCESO</p>
          <div className="flex justify-center mb-4">
            <img src={qrUrl} alt="QR de acceso" className="mix-blend-multiply" />
          </div>
          <p className="font-mono text-sm bg-gray-200 py-1 px-3 rounded inline-block">{registration.qrCode}</p>
        </div>

        <div className="space-y-3 text-left text-sm text-gray-600 mb-8">
          <div className="flex justify-between">
            <span>Atleta:</span>
            <span className="font-bold">{registration.athleteName}</span>
          </div>
          <div className="flex justify-between">
            <span>Ticket:</span>
            <span className="font-bold">{registration.ticket.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Fecha:</span>
            <span>{new Date(registration.event.date).toLocaleDateString()}</span>
          </div>
        </div>

        <Link href="/" className="btn-primary w-full block py-3">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
