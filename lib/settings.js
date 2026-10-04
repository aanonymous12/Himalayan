import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

const fallback = {
  business_name: 'Himalayan Nepalese & Indian Cuisine',
  phone: '(512) 748-0104',
  address: '115 Wonder World Drive\nSan Marcos, TX 78666',
  hours: 'Monday to Saturday: 12:00 PM to 9:00 PM\nSunday: Closed',
  story: '',
  hero_title: 'Himalayan flavors, made from scratch.',
  hero_subtitle: 'Nepali and Indian cooking in San Marcos.',
  hero_video_url: null,
  announcement: '',
  tax_rate: 0.0825,
  accepting_orders: true,
};

export const getSettings = cache(async () => {
  try {
    const sb = await createClient();
    const { data } = await sb.from('settings').select('*').eq('id', 1).maybeSingle();
    return { ...fallback, ...(data || {}) };
  } catch {
    return fallback;
  }
});
