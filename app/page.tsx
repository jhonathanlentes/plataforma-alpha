import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* Hero Section */}
      <section className="bg-white pt-24 pb-32 border-b">
        <div className="container-custom text-center max-w-4xl">
          <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 mb-6 border border-blue-100">
            🚀 Levantando Ronda Pre-Seed
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            El Sistema Operativo para <br/>
            <span className="text-blue-600">Eventos Deportivos</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Deja de usar Excel y 10 herramientas diferentes. Alpha unifica inscripciones, tienda, control de acceso y resultados en una sola plataforma diseñada para organizadores en LatAm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 h-auto">
              Empezar Gratis
            </Link>
            <Link href="#demo" className="btn-secondary text-lg px-8 py-4 h-auto">
              Ver Demo en Vivo
            </Link>
          </div>
          
          <div className="mt-16 relative mx-auto max-w-5xl rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
               {/* Placeholder de imagen de dashboard */}
               <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400">
                 [Imagen: Vista previa del Dashboard de Organizador Alpha]
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">Todo lo que necesitas para tu carrera</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              🎫
            </div>
            <h3 className="text-xl font-bold mb-2">Ticketing Especializado</h3>
            <p className="text-gray-500">Formularios con campos deportivos (Talla, Club, Sangre). Categorías por edad automáticas.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
              🛍️
            </div>
            <h3 className="text-xl font-bold mb-2">Tienda Add-on</h3>
            <p className="text-gray-500">Vende camisetas y merch durante el registro. Aumenta tu ticket promedio sin esfuerzo.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
              📱
            </div>
            <h3 className="text-xl font-bold mb-2">App de Staff & QR</h3>
            <p className="text-gray-500">Control de acceso ultra rápido. Funciona sin internet. Olvídate de las listas en papel.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
