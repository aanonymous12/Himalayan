// Shows the dish photo when one has been uploaded in Admin > Menu.
// Until then, each category gets a simple illustration in the brand colors.
const R = '#9a4f26', E = '#2b1810', G = '#ffd21a', W = '#ffffff';

const ART = {
  bowl: [R, <g key="a"><path d="M14 38h52a26 26 0 0 1-52 0z" fill={G} /><rect x="30" y="64" width="20" height="4" rx="2" fill={G} /><path d="M30 30c-4-5 4-8 0-13M42 30c-4-5 4-8 0-13M54 30c-4-5 4-8 0-13" stroke={W} strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>],
  momo: [E, <g key="a"><path d="M10 52c4-26 56-26 60 0 0 6-8 8-30 8S10 58 10 52z" fill={W} /><path d="M28 36l4 18M40 33v22M52 36l-4 18" stroke={R} strokeWidth="2.5" strokeLinecap="round" fill="none" /><rect x="8" y="62" width="64" height="4" rx="2" fill={G} /></g>],
  naan: [R, <g key="a"><ellipse cx="40" cy="42" rx="28" ry="22" fill={G} /><circle cx="30" cy="38" r="3" fill={R} /><circle cx="49" cy="33" r="2.5" fill={R} /><circle cx="45" cy="50" r="3" fill={R} /><circle cx="28" cy="50" r="2" fill={R} /></g>],
  rice: [E, <g key="a"><ellipse cx="40" cy="54" rx="30" ry="10" fill={W} /><path d="M16 52c2-24 46-24 48 0z" fill={G} /><path d="M30 42l3 2M42 36l3 2M50 44l3 2M36 48l3 1" stroke={R} strokeWidth="2" strokeLinecap="round" /></g>],
  drink: [R, <g key="a"><path d="M24 22h32l-4 40a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4z" fill={W} /><path d="M27 36h26l-2 24a3 3 0 0 1-3 3H32a3 3 0 0 1-3-3z" fill={G} /><path d="M46 26l8-14" stroke={E} strokeWidth="3" strokeLinecap="round" /></g>],
  sweet: [E, <g key="a"><ellipse cx="40" cy="58" rx="28" ry="6" fill={W} /><circle cx="30" cy="46" r="11" fill={G} /><circle cx="50" cy="46" r="11" fill={R} /></g>],
  fried: [R, <g key="a"><path d="M10 58L32 20l22 38z" fill={G} /><path d="M38 58l16-28 16 28z" fill={W} /></g>],
};
const BY_SLUG = { appetizers: 'fried', mains: 'bowl', vegetarian: 'bowl', momo: 'momo', biryani: 'rice', 'rice-noodles': 'rice', naan: 'naan', desserts: 'sweet', drinks: 'drink' };

export default function DishImage({ src, name, slug, className = 'dish-img' }) {
  if (src) return <img className={className} src={src} alt={name} loading="lazy" />;
  const [bg, art] = ART[BY_SLUG[slug] || 'bowl'];
  return (
    <svg className={className} viewBox="0 0 80 80" role="img" aria-label={`${name}, photo coming soon`}>
      <rect width="80" height="80" fill={bg} />{art}
    </svg>
  );
}
