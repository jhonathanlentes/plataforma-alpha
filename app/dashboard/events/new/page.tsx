'use client';

import { createEvent } from '../../../actions';
import { useFormState } from 'react-dom';

const initialState = {
  message: '',
};

export default function NewEventPage() {
  const [state, formAction] = useFormState(createEvent, initialState);

  return (
    <div className="container-custom py-12 max-w-2xl">
      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Evento</h1>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Evento</label>
            <input name="title" required type="text" className="w-full p-2 border rounded-md" placeholder="Ej: Maratón Ciudad de Panamá" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input name="date" required type="datetime-local" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ubicación</label>
              <input name="location" required type="text" className="w-full p-2 border rounded-md" placeholder="Cinta Costera" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio de Inscripción ($)</label>
            <input name="price" required type="number" step="0.01" className="w-full p-2 border rounded-md" placeholder="25.00" />
            <p className="text-xs text-gray-500 mt-1">Se creará un ticket "General" automáticamente.</p>
          </div>

          {state?.message && (
             <p className="text-red-500 text-sm">{state.message}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn-secondary" onClick={() => window.history.back()}>Cancelar</button>
            <button type="submit" className="btn-primary">Publicar Evento</button>
          </div>
        </form>
      </div>
    </div>
  );
}
