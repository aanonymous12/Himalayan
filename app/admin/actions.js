'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { STATUSES } from '@/lib/format';

const done = () => revalidatePath('/', 'layout');
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "Chicken | 14.99" per line -> [{label, price}]
function parseOptions(text) {
  return String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [label, price] = l.split('|').map((x) => x.trim());
    const p = Number(String(price).replace('$', ''));
    if (!label || Number.isNaN(p)) throw new Error(`Option "${l}" should look like: Chicken | 14.99`);
    return { label, price: p };
  });
}

export async function setStatus(fd) {
  const { sb } = await requireAdmin();
  const status = String(fd.get('status'));
  if (!STATUSES.includes(status)) return;
  await sb.from('orders').update({ status }).eq('id', fd.get('id'));
  revalidatePath('/admin', 'layout');
}

export async function saveCategory(fd) {
  const { sb } = await requireAdmin();
  const name = String(fd.get('name') || '').trim();
  if (!name) return;
  const row = {
    name, description: String(fd.get('description') || '') || null,
    sort_order: Number(fd.get('sort_order')) || 0, visible: fd.get('visible') === 'on',
  };
  const id = fd.get('id');
  if (id) await sb.from('menu_categories').update(row).eq('id', id);
  else await sb.from('menu_categories').insert({ ...row, slug: slugify(name), visible: true });
  done();
}

export async function deleteCategory(fd) {
  const { sb } = await requireAdmin();
  await sb.from('menu_categories').delete().eq('id', fd.get('id'));
  done();
}

export async function saveItem(fd) {
  const { sb } = await requireAdmin();
  const options = parseOptions(fd.get('options'));
  const price = fd.get('price') === '' ? NaN : Number(fd.get('price'));
  if (!options.length && Number.isNaN(price)) throw new Error('Add a price, or at least one option.');

  let image_url = fd.get('image_url') || null;
  const file = fd.get('image');
  if (file && typeof file === 'object' && file.size > 0) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await sb.storage.from('menu').upload(path, file, { contentType: file.type });
    if (error) throw new Error(`Photo upload failed: ${error.message}`);
    image_url = sb.storage.from('menu').getPublicUrl(path).data.publicUrl;
  }
  if (fd.get('remove_image') === 'on') image_url = null;

  const row = {
    category_id: fd.get('category_id'), name: String(fd.get('name')).trim(),
    description: String(fd.get('description') || '') || null,
    price: options.length ? null : price, options, image_url,
    vegetarian: fd.get('vegetarian') === 'on', featured: fd.get('featured') === 'on', available: fd.get('available') === 'on',
    sort_order: Number(fd.get('sort_order')) || 0,
  };
  const id = fd.get('id');
  const { error } = id ? await sb.from('menu_items').update(row).eq('id', id) : await sb.from('menu_items').insert(row);
  if (error) throw new Error(error.message);
  done();
}

export async function deleteItem(fd) {
  const { sb } = await requireAdmin();
  await sb.from('menu_items').delete().eq('id', fd.get('id'));
  done();
}

export async function toggleAvailable(fd) {
  const { sb } = await requireAdmin();
  await sb.from('menu_items').update({ available: fd.get('available') !== 'true' }).eq('id', fd.get('id'));
  done();
}

export async function saveSettings(fd) {
  const { sb } = await requireAdmin();
  const pct = Number(fd.get('tax_percent'));
  await sb.from('settings').update({
    business_name: fd.get('business_name'), phone: fd.get('phone'), address: fd.get('address'),
    hours: fd.get('hours'), story: fd.get('story'),
    hero_title: String(fd.get('hero_title') || '').trim() || 'Himalayan flavors, made from scratch.',
    hero_subtitle: String(fd.get('hero_subtitle') || '').trim(),
    hero_video_url: /^https?:\/\//.test(String(fd.get('hero_video_url') || '')) ? String(fd.get('hero_video_url')) : null, announcement: String(fd.get('announcement') || '').trim(),
    tax_rate: Number.isNaN(pct) ? 0.0825 : pct / 100, accepting_orders: fd.get('accepting_orders') === 'on',
  }).eq('id', 1);
  done();
}
