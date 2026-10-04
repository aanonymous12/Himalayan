'use server';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const round2 = (n) => Math.round(n * 100) / 100;

// Prices are always re-read from the database. The browser only says what and how many.
export async function placeOrder(payload) {
  const name = String(payload?.name || '').trim().slice(0, 80);
  const phone = String(payload?.phone || '').trim().slice(0, 30);
  const email = String(payload?.email || '').trim().slice(0, 120) || null;
  const notes = String(payload?.notes || '').trim().slice(0, 500) || null;
  const pickup = String(payload?.pickup || '').trim().slice(0, 40) || 'ASAP';
  const lines = Array.isArray(payload?.items) ? payload.items.slice(0, 60) : [];

  if (!name) return { error: 'Please enter your name.' };
  if (phone.replace(/\D/g, '').length < 10) return { error: 'Please enter a phone number we can reach, including area code.' };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: 'That email address does not look right.' };
  if (!lines.length) return { error: 'Your cart is empty.' };

  const db = createAdminClient();
  const { data: settings } = await db.from('settings').select('accepting_orders, tax_rate').eq('id', 1).single();
  if (!settings?.accepting_orders) return { error: 'We are not taking online orders right now. Please call us.' };

  const ids = [...new Set(lines.map((l) => l.itemId))];
  const { data: menu } = await db.from('menu_items').select('id, name, price, options, available').in('id', ids);
  const byId = Object.fromEntries((menu || []).map((m) => [m.id, m]));

  const rows = [];
  for (const l of lines) {
    const m = byId[l.itemId];
    const qty = Math.floor(Number(l.qty));
    if (!m || !m.available) return { error: `${l.name || 'An item'} is no longer available. Please remove it and try again.` };
    if (!(qty > 0 && qty <= 50)) return { error: 'Quantities must be between 1 and 50.' };
    let price = m.price, label = null;
    if (m.options?.length) {
      const o = m.options.find((x) => x.label === l.option);
      if (!o) return { error: `Please re-add ${m.name}. Its options changed.` };
      price = o.price; label = o.label;
    }
    rows.push({ menu_item_id: m.id, name: m.name, option_label: label, unit_price: price, qty });
  }

  const subtotal = round2(rows.reduce((n, r) => n + r.unit_price * r.qty, 0));
  const tax = round2(subtotal * Number(settings.tax_rate));
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();

  const { data: order, error } = await db.from('orders')
    .insert({ user_id: user?.id ?? null, customer_name: name, phone, email, notes, pickup_time: pickup, subtotal, tax, total: round2(subtotal + tax) })
    .select('id').single();
  if (error) return { error: 'Something went wrong saving your order. Please try again or call us.' };

  const { error: e2 } = await db.from('order_items').insert(rows.map((r) => ({ ...r, order_id: order.id })));
  if (e2) {
    await db.from('orders').delete().eq('id', order.id);
    return { error: 'Something went wrong saving your order. Please try again or call us.' };
  }
  redirect(`/order/${order.id}`);
}
