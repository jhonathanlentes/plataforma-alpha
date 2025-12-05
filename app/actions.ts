'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// --- SIMULACIÓN DE EMAIL ---
// En un proyecto real, aquí conectarías con Resend, SendGrid o AWS SES.
async function sendEmailTicket(email: string, ticketId: string, eventName: string) {
    console.log(`
    =============================================================
    📨 [EMAIL SIMULADO - SISTEMA ALPHA]
    -------------------------------------------------------------
    PARA:    ${email}
    ASUNTO:  Confirmación de inscripción - ${eventName}
    
    Hola! Tu registro ha sido exitoso.
    
    🎟️ TU ENTRADA DIGITAL:
    https://scan.cuponizado.com/success?id=${ticketId}
    
    Por favor, presenta el código QR de ese enlace al ingresar.
    =============================================================
    `);
    return true;
}

// --- ACCIÓN 1: CREAR EVENTO PRO (Dashboard) ---
export async function createEventPro(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string; // RUNNING, CICLISMO, etc.
  const dateStr = formData.get('date') as string;
  const location = formData.get('location') as string;
  const bannerUrl = formData.get('bannerUrl') as string;
  const shortDesc = formData.get('shortDesc') as string;
  const longDesc = formData.get('longDesc') as string;
  
  // Los tickets vienen como un string JSON desde el formulario
  const ticketsJson = formData.get('ticketsJson') as string;
  let ticketsData = [];
  try {
    ticketsData = JSON.parse(ticketsJson);
  } catch (e) {
    console.error("Error parseando tickets JSON", e);
    throw new Error("Formato de tickets inválido");
  }

  try {
    await prisma.event.create({
      data: {
        title,
        category: category as any, // "as any" para que coincida con el Enum de Prisma
        date: new Date(dateStr),
        location,
        bannerUrl: bannerUrl || null,
        shortDesc,
        longDesc,
        ticketTypes: {
          create: ticketsData.map((t: any) => ({
            name: t.name,
            description: t.desc,
            price: Number(t.price),
            quantity: Number(t.quantity)
          }))
        }
      }
    });
  } catch (error) {
    console.error("Error creando evento:", error);
    throw new Error("Error al guardar en base de datos");
  }

  revalidatePath('/'); // Actualizar el Home para que salga el nuevo evento
  redirect('/');
}

// --- ACCIÓN 2: REGISTRAR ATLETA V2 (Página de Evento) ---
export async function registerAthleteV2(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const ticketTypeId = formData.get('ticketTypeId') as string;
  const eventId = formData.get('eventId') as string;

  // Generamos un código único para el QR
  const qrCode = uuidv4();

  let newReg;
  
  try {
    // Usamos una transacción para asegurar que si se registra, se descuente el cupo (o cuente como vendido)
    newReg = await prisma.$transaction(async (tx) => {
        
        // 1. Crear el registro
        const reg = await tx.registration.create({
            data: {
                athleteName: name,
                athleteEmail: email,
                qrCode,
                eventId,
                ticketTypeId
            },
            include: { event: true } // Traemos el evento para usar el título en el email
        });

        // 2. Actualizar contador de vendidos en el tipo de ticket
        await tx.ticketType.update({
            where: { id: ticketTypeId },
            data: { sold: { increment: 1 } }
        });

        return reg;
    });

    // 3. "Enviar" el correo
    await sendEmailTicket(email, newReg.id, newReg.event.title);

  } catch (e) {
    console.error("Error en registro V2:", e);
    // En un caso real, aquí deberíamos retornar un error visible al usuario
    return { success: false, error: 'Error al procesar registro' };
  }

  // Redirigir a la página de éxito (Ticket)
  redirect(`/success?id=${newReg.id}`);
}

// --- ACCIÓN 3: CHECK-IN (Scanner) ---
export async function checkInParticipant(qrCode: string) {
  try {
    // 1. Buscar la inscripción por el código QR único
    const registration = await prisma.registration.findUnique({
      where: { qrCode },
      include: { ticket: true, event: true },
    });

    if (!registration) {
      return { success: false, error: 'NOT_FOUND' };
    }

    // 2. Validar si ya entró antes
    if (registration.checkedIn) {
      return { 
        success: false, 
        error: 'ALREADY_CHECKED_IN',
        data: registration 
      };
    }

    // 3. Marcar como ingresado
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