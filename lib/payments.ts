// lib/payments.ts

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  orderId: string;
  organizerId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

interface PaymentProvider {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

class MockPaymentProvider implements PaymentProvider {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    console.log("💰 [MOCK PAYMENT] Procesando pago...", request);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `mock_tx_${Math.random().toString(36).substring(7)}`,
      };
    } else {
      return {
        success: false,
        error: "Tarjeta rechazada por el banco simulado (Fondos insuficientes)",
      };
    }
  }
}

export function getPaymentProvider(type: 'MOCK' | 'STRIPE' | 'PAYPAL' = 'MOCK'): PaymentProvider {
  switch (type) {
    case 'STRIPE':
      throw new Error("Stripe no configurado aún");
    case 'MOCK':
    default:
      return new MockPaymentProvider();
  }
}
