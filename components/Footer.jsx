import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import { telHref } from '@/lib/format';

export default async function Footer() {
  const s = await getSettings();
  return (
    <footer>
      <div className="wrap">
        <div><h3>{s.business_name}</h3><p>Nepali and Indian cooking, made fresh daily.</p></div>
        <div><h3>Visit</h3><p className="pre">{s.address}</p><p className="pre">{s.hours}</p></div>
        <div>
          <h3>Order</h3>
          <p><a href={telHref(s.phone)}>{s.phone}</a></p>
          <p><Link href="/#menu">Order online for pickup</Link></p>
        </div>
        <div className="legal">&copy; {new Date().getFullYear()} {s.business_name}. Payment is taken at the restaurant.</div>
      </div>
    </footer>
  );
}
