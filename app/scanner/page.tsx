'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { checkInParticipant } from './actions';

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' | 'DUPLICATE'>('IDLE');
  const [participantData, setParticipantData] = useState<any>(null);

  useEffect(() => {
    // Inicializar scanner solo en cliente
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string) {
      if (status === 'LOADING') return;
      
      handleCheckIn(decodedText);
      scanner.pause(true);
      setTimeout(() => scanner.resume(), 3000);
    }

    function onScanFailure(error: any) {
      // Ignorar errores de "no QR encontrado"
    }

    return () => {
      scanner.clear();
    };
  }, []);

  async function handleCheckIn(qrCode: string) {
    setStatus('LOADING');
    setScanResult(qrCode);

    try {
      const result = await checkInParticipant(qrCode);
      
      if (result.success) {
        setStatus('SUCCESS');
        setParticipantData(result.data);
      } else if (result.error === 'ALREADY_CHECKED_IN') {
        setStatus('DUPLICATE');
        setParticipantData(result.data);
      } else {
        setStatus('ERROR');
      }
    } catch (e) {
      setStatus('ERROR');
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Alpha Scanner</h1>
      
      {/* Visor de Cámara */}
      <div id="reader" className="w-full max-w-sm bg-white rounded-lg overflow-hidden text-black"></div>

      {/* Panel de Resultados */}
      <div className="mt-6 w-full max-w-sm">
        {status === 'IDLE' && <p className="text-center text-gray-400">Apunta al código QR del atleta</p>}
        
        {status === 'LOADING' && (
          <div className="p-4 bg-yellow-600 rounded-lg text-center animate-pulse">
            Verificando Ticket...
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="p-6 bg-green-600 rounded-lg text-center shadow-lg transform scale-105 transition-all">
            <h2 className="text-3xl font-bold">✅ ACCESO PERMITIDO</h2>
            <p className="text-xl mt-2">{participantData?.athleteName}</p>
            <p className="text-sm opacity-80">{participantData?.ticket?.name}</p>
          </div>
        )}

        {status === 'DUPLICATE' && (
          <div className="p-6 bg-red-600 rounded-lg text-center shadow-lg">
            <h2 className="text-3xl font-bold">⚠️ YA INGRESÓ</h2>
            <p className="mt-2">Este ticket fue escaneado a las:</p>
            <p className="font-mono text-xl">{new Date(participantData?.checkInTime).toLocaleTimeString()}</p>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="p-6 bg-gray-700 rounded-lg text-center">
            <h2 className="text-xl font-bold">❌ TICKET INVÁLIDO</h2>
            <p>No se encontró registro en la base de datos.</p>
          </div>
        )}
        
        {status !== 'IDLE' && (
            <button 
                onClick={() => setStatus('IDLE')}
                className="mt-4 w-full py-3 bg-blue-600 rounded-lg font-bold"
            >
                Escanear Siguiente
            </button>
        )}
      </div>
    </div>
  );
}
