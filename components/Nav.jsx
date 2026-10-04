'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CartLink from './CartLink';
import SignOut from './SignOut';

const LINKS = [['menu', 'Menu'], ['about', 'About'], ['visit', 'Visit us']];

// Anchor navigation: links jump to sections on the home page and light up as you scroll.
export default function Nav({ user, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
    if (path !== '/') return setActive('');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    );
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [path]);

  const close = () => setOpen(false);
  return (
    <>
      <nav id="site-nav" className={`nav${open ? ' open' : ''}`} aria-label="Main">
        {LINKS.map(([id, label]) => (
          <Link key={id} href={`/#${id}`} className={active === id ? 'active' : ''} onClick={close}>{label}</Link>
        ))}
        {isAdmin && <Link href="/admin" onClick={close}>Admin</Link>}
        {user ? (<><Link href="/account" onClick={close}>My orders</Link><SignOut /></>) : <Link href="/login" onClick={close}>Log in</Link>}
      </nav>
      <div className="head-actions">
        <CartLink />
        <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
      </div>
    </>
  );
}
