'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function checkInParticipant(qrCode: string) {
  try {
    // 1. Buscar la inscripción
    const registration = await prisma.registration.findUnique({
      where: { qrCode },
      include: { ticket: true, event: true },
    });

    if (!registration) {
      return { success: false, error: 'NOT_FOUND' };
    }

    // 2. Verificar si ya hizo check-in
    if (registration.checkedIn) {
      return { 
        success: false, 
        error: 'ALREADY_CHECKED_IN',
        data: registration 
      };
    }

    // 3. Registrar el check-in
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        checkedIn: true,
        checkInTime: new Date(),
      },
      include: { ticket: true }
    });

    return { success: true, data: updated };

  } catch (error) {
    console.error("Error en check-in:", error);
    return { success: false, error: 'SERVER_ERROR' };
  }
}
