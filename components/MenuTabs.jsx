'use client';
import { useRef, useState } from 'react';
import AddToCart from './AddToCart';
import DishImage from './DishImage';

// One category at a time keeps the menu calm. Every panel stays in the page HTML for search engines.
export default function MenuTabs({ cats, items, accepting }) {
  const [active, setActive] = useState(cats[0]?.id);
  const tabs = useRef([]);

  function onKey(e, i) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + cats.length) % cats.length;
    setActive(cats[n].id);
    tabs.current[n]?.focus();
  }

  return (
    <>
      <div className="menu-nav">
        <div className="wrap" role="tablist" aria-label="Menu categories">
          {cats.map((c, i) => (
            <button key={c.id} ref={(el) => (tabs.current[i] = el)} role="tab" id={`tab-${c.id}`}
              aria-selected={active === c.id} aria-controls={`panel-${c.id}`} tabIndex={active === c.id ? 0 : -1}
              onClick={() => setActive(c.id)} onKeyDown={(e) => onKey(e, i)}>{c.name}</button>
          ))}
        </div>
      </div>
      <div className="wrap">
        {cats.map((c) => (
          <div key={c.id} role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} hidden={active !== c.id} className="panel">
            {c.description && <p className="panel-note">{c.description}</p>}
            <ul className="dishes">
              {items.filter((i) => i.category_id === c.id).map((i) => (
                <li className="dish" key={i.id}>
                  <DishImage src={i.image_url} name={i.name} slug={c.slug} />
                  <div>
                    <h3>{i.name}{i.vegetarian && <span className="veg" title="Vegetarian" />}{i.featured && <span className="tag">Popular</span>}</h3>
                    {i.description && <p>{i.description}</p>}
                  </div>
                  <div className="dish-buy">
                    {!i.available ? <span className="soldout">Sold out today</span> : accepting ? <AddToCart item={i} /> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
