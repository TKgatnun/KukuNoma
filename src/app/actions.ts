'use server';

import { revalidatePath } from 'next/cache';
import { addBatch, updateBatchHatch, addSale, completeBatch } from '@/lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function requireAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  // Basic check: ensure the cookie value matches the secure environment variable
  if (!authCookie || authCookie.value !== process.env.ADMIN_PASSWORD) {
    throw new Error('Unauthorized request');
  }
}

export async function loginAction(formData: FormData) {
  const password = (formData.get('password') as string)?.trim();
  const validPassword = process.env.ADMIN_PASSWORD;
  
  if (!validPassword) {
    throw new Error('Server configuration error: ADMIN_PASSWORD environment variable is not set.');
  }

  if (password === validPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', validPassword, { 
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    redirect('/admin');
  } else {
    throw new Error('Invalid password');
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/');
}

export async function createBatchAction(formData: FormData) {
  await requireAuth();

  const start_date = formData.get('start_date') as string;
  const eggs_incubated = parseInt(formData.get('eggs_incubated') as string, 10);

  if (!start_date || isNaN(eggs_incubated)) {
    throw new Error('Invalid input');
  }

  await addBatch({
    start_date,
    eggs_incubated,
  });

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}

export async function recordHatchAction(formData: FormData) {
  await requireAuth();

  const batch_id = formData.get('batch_id') as string;
  const chicks_hatched = parseInt(formData.get('chicks_hatched') as string, 10);

  if (!batch_id || isNaN(chicks_hatched)) {
    throw new Error('Invalid input');
  }

  await updateBatchHatch(batch_id, chicks_hatched);
  
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function recordSaleAction(formData: FormData) {
  await requireAuth();

  const batch_id = formData.get('batch_id') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const age_at_sale_days = parseInt(formData.get('age_at_sale_days') as string, 10);
  const price_per_chick = parseFloat(formData.get('price_per_chick') as string);

  if (!batch_id || isNaN(quantity) || isNaN(age_at_sale_days) || isNaN(price_per_chick)) {
    throw new Error('Invalid input');
  }

  await addSale({
    batch_id,
    quantity,
    age_at_sale_days,
    price_per_chick
  });

  revalidatePath('/admin');
}

export async function markBatchCompleteAction(formData: FormData) {
  await requireAuth();

  const batch_id = formData.get('batch_id') as string;
  if (!batch_id) throw new Error('Invalid input');

  await completeBatch(batch_id);
  revalidatePath('/admin');
  revalidatePath('/');
}
