'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// --- AUTENTICACIÓN & USUARIOS ---

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) return { message: "Faltan datos" };

  const hashedPassword = await hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: 'ORGANIZER'
      }
    });
  } catch (e) {
    return { message: "El usuario ya existe" };
  }
  
  redirect('/dashboard');
}

// --- GESTIÓN DE EVENTOS (ORGANIZADOR) ---

export async function createEvent(prevState: any, formData: FormData) {
  const firstUser = await prisma.user.findFirst();
  if (!firstUser) return { message: "Error: Crea un usuario primero en /register" };

  const title = formData.get('title') as string;
  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  const date = new Date(formData.get('date') as string);
  const price = parseFloat(formData.get('price') as string);
  const location = formData.get('location') as string;

  try {
    await prisma.event.create({
      data: {
        title,
        slug: slug + '-' + Math.floor(Math.random() * 1000),
        date,
        location,
        organizerId: firstUser.id,
        isPublished: true,
        ticketTypes: {
          create: [
            { name: "General Entry", price: price, quantity: 1000 }
          ]
        }
      }
    });
  } catch (e) {
    console.error(e);
    return { message: "Error al crear evento" };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// --- ZONA PÚBLICA (ATLETA) ---

export async function registerAthlete(formData: FormData) {
  const ticketId = formData.get('ticketId') as string;
  const eventId = formData.get('eventId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  // Guardar en DB
  const registration = await prisma.registration.create({
    data: {
      ticketId,
      eventId,
      athleteName: name,
      athleteEmail: email,
      athleteData: {},
      checkedIn: false
    }
  });

  // Simulación Pago Exitoso
  await prisma.order.create({
    data: {
      registrationId: registration.id,
      totalAmount: 50.00, 
      status: 'PAID',
      paymentProvider: 'MOCK'
    }
  });

  // REDIRECCIÓN A LA PÁGINA DE ÉXITO
  redirect(`/success?id=${registration.id}`);
}
