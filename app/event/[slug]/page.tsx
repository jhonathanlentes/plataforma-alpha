'use client';

import { useState } from 'react';

// Mock Data para el evento
const EVENT = {
  title: "Gran Fondo Ocean to Ocean 2025",
  date: "Domingo, 15 Noviembre 2025 • 6:00 AM",
  location: "Amador Causeway, Panamá",
  description: "El evento de ciclismo más importante del año. Cruza del Pacífico al Atlántico en un recorrido desafiante de 130km. Incluye hidratación, medalla y jersey oficial.",
  banner: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
  tickets: [
    { id: 1, name: "General - 130km", price: 85.00 },
    { id: 2, name: "Medio Fondo - 60km", price: 65.00 },
    { id: 3, name: "Elite VIP", price: 150.00 },
  ],
  merch: [
    { id: 101, name: "Gorra Oficial 2025", price: 25.00, img: "🧢" },
    { id: 102, name: "Medias de Compresión", price: 15.00, img: "🧦" },
  ]
};

export default function PublicEventPage({ params }: { params: { slug: string } }) {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [step, setStep] = useState<'TICKETS' | 'FORM' | 'MERCH' | 'PAYMENT'>('TICKETS');
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any, type: 'TICKET' | 'MERCH') => {
    setCart([...cart, { ...item, type }]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Banner del Evento */}
      <div className="h-64 md:h-80 w-full bg-gray-900 relative overflow-hidden">
        <img src={EVENT.banner} alt={EVENT.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full bg-gradient-to-t from-gray-900/90 to-transparent">
          <div className="container-custom">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Ciclismo</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{EVENT.title}</h1>
            <p className="text-gray-200 flex items-center gap-2">
              📅 {EVENT.date} &nbsp;|&nbsp; 📍 {EVENT.location}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8 grid md:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Acerca del evento</h2>
            <p className="text-gray-600 leading-relaxed">{EVENT.description}</p>
          </div>
        </div>

        {/* Columna Derecha: Widget de Compra (Sticky) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border shadow-lg p-6 sticky top-24">
            
            {step === 'TICKETS' && (
              <>
                <h3 className="text-lg font-bold mb-4">Selecciona tu entrada</h3>
                <div className="space-y-3">
                  {EVENT.tickets.map((ticket) => (
                    <div 
                      key={ticket.id}
                      onClick={() => { setSelectedTicket(ticket.id); addToCart(ticket, 'TICKET'); setStep('FORM'); }}
                      className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center group"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-700">{ticket.name}</p>
                        <p className="text-sm text-gray-500">Incluye kit + chip</p>
                      </div>
                      <span className="font-bold text-lg">${ticket.price}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 'FORM' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold mb-4">Datos del Corredor</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre Completo" className="w-full p-2 border rounded" />
                  <input type="email" placeholder="Correo Electrónico" className="w-full p-2 border rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="w-full p-2 border rounded">
                      <option>Talla Camiseta</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                    </select>
                    <input type="text" placeholder="Club / Team" className="w-full p-2 border rounded" />
                  </div>
                  <button onClick={() => setStep('MERCH')} className="btn-primary w-full mt-4">Continuar</button>
                </div>
              </div>
            )}

            {step === 'MERCH' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold mb-2">🔥 ¡Completa tu kit!</h3>
                <p className="text-sm text-gray-500 mb-4">Añade merch oficial a tu orden.</p>
                <div className="space-y-3 mb-6">
                  {EVENT.merch.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.img}</span>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">${item.price}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => addToCart(item, 'MERCH')}
                        className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-100"
                      >
                        + Añadir
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('PAYMENT')} className="btn-primary w-full">Ir a Pagar (${total})</button>
                <button onClick={() => setStep('PAYMENT')} className="w-full text-center text-sm text-gray-500 mt-2 underline">No gracias, solo inscripción</button>
              </div>
            )}

            {step === 'PAYMENT' && (
              <div className="animate-fade-in text-center">
                <h3 className="text-lg font-bold mb-4">Resumen de Pago</h3>
                <div className="bg-gray-50 p-4 rounded mb-4 text-left space-y-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Botón Simulado de Pago */}
                <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  💳 Pagar con Tarjeta
                </button>
                <p className="text-xs text-gray-400 mt-3">Pagos seguros vía PagueloFacil / Stripe</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
