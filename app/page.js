import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import MenuTabs from '@/components/MenuTabs';
import DishImage from '@/components/DishImage';
import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/settings';
import { money, telHref } from '@/lib/format';

export default async function Home() {
  const sb = await createClient();
  const s = await getSettings();
  const [{ data: cats }, { data: items }] = await Promise.all([
    sb.from('menu_categories').select('*').eq('visible', true).order('sort_order'),
    sb.from('menu_items').select('*').order('sort_order'),
  ]);
  const shown = (cats || []).filter((c) => items?.some((i) => i.category_id === c.id));
  const slugOf = Object.fromEntries((cats || []).map((c) => [c.id, c.slug]));
  const favs = (items || []).filter((i) => i.featured && i.available).slice(0, 4);
  const addressLine = s.address.replace(/\n/g, ', ');
  const mapQ = encodeURIComponent(addressLine);

  const ld = {
    '@context': 'https://schema.org', '@type': 'Restaurant',
    name: s.business_name, servesCuisine: ['Nepalese', 'Indian'], telephone: s.phone,
    address: { '@type': 'PostalAddress', streetAddress: '115 Wonder World Drive', addressLocality: 'San Marcos', addressRegion: 'TX', postalCode: '78666', addressCountry: 'US' },
    openingHours: 'Mo-Sa 12:00-21:00', url: process.env.NEXT_PUBLIC_SITE_URL, hasMenu: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/#menu`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <section className="hero" id="top">
        {s.hero_video_url && <HeroVideo src={s.hero_video_url} />}
        <div className="hero-shade" />
        <div className="hero-main">
          {!s.hero_video_url && (
            <svg className="hero-art" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 160V104L110 60L200 110L340 28L470 104L590 50L710 118L850 34L980 102L1100 64L1200 112V160Z" fill="#9a4f26" opacity=".9" />
              <path d="M0 104L110 60L200 110L340 28L470 104L590 50L710 118L850 34L980 102L1100 64L1200 112" fill="none" stroke="#ffd21a" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          <div className="wrap hero-content">
            <h1>{s.hero_title}</h1>
            {s.hero_subtitle && <p className="lede">{s.hero_subtitle}</p>}
            <div className="actions">
              <Link href="/#menu" className="btn gold">Order for pickup</Link>
              <a href={telHref(s.phone)} className="btn line">Call {s.phone}</a>
            </div>
          </div>
        </div>
        <div className="info-strip">
          <div className="wrap">
            <div><small>Hours</small>{s.hours.split('\n')[0]}</div>
            <div><small>Address</small>{addressLine}</div>
            <div><small>Phone</small><a href={telHref(s.phone)}>{s.phone}</a></div>
          </div>
        </div>
      </section>

      {favs.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="sec-head sec-row">
              <h2>Guest favorites</h2>
              <Link href="/#menu" className="btn line sm">See full menu</Link>
            </div>
            <div className="favs">
              {favs.map((d) => (
                <Link href="/#menu" className="fav" key={d.id}>
                  <DishImage src={d.image_url} name={d.name} slug={slugOf[d.category_id]} className="fav-img" />
                  <b>{d.name}</b>
                  <span>{d.options?.length ? `From ${money(Math.min(...d.options.map((o) => o.price)))}` : money(d.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="menu" className="menu-sec">
        <div className="wrap sec-head">
          <h2>Our menu</h2>
          <p><span className="veg" style={{ marginRight: 8 }} />Vegetarian. Tell us about allergies when you order.</p>
          {!s.accepting_orders && <div className="error" style={{ marginTop: '1rem' }}>We are not taking online orders right now. Please call {s.phone}.</div>}
        </div>
        <MenuTabs cats={shown} items={items || []} accepting={s.accepting_orders} />
      </section>

      <section id="about" className="section soft">
        <div className="wrap about">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <h2>Our story</h2>
            <p className="story" style={{ color: 'var(--fg)' }}>{s.story}</p>
          </div>
          <ul className="pillars">
            <li><b>Made fresh daily</b><span>Curries simmered slowly, never reheated from a bag.</span></li>
            <li><b>Hand-folded momo</b><span>Steamed, fried or tossed in chilli sauce.</span></li>
            <li><b>Tandoor naan</b><span>Baked to order, plain, butter or garlic.</span></li>
          </ul>
        </div>
      </section>

      <section id="visit" className="section">
        <div className="wrap visit">
          <div>
            <div className="sec-head" style={{ marginBottom: '1.25rem' }}><h2>Visit us</h2></div>
            <dl>
              <dt>Address</dt><dd>{s.address}</dd>
              <dt>Hours</dt><dd>{s.hours}</dd>
              <dt>Phone</dt><dd><a href={telHref(s.phone)}>{s.phone}</a></dd>
            </dl>
            <div className="actions" style={{ marginTop: 0 }}>
              <a className="btn rust" href={`https://www.google.com/maps/dir/?api=1&destination=${mapQ}`} target="_blank" rel="noopener">Get directions</a>
              <a className="btn line" href={telHref(s.phone)}>Call us</a>
            </div>
          </div>
          <iframe className="map" title="Map to the restaurant" loading="lazy" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} />
        </div>
      </section>
    </>
  );
}
