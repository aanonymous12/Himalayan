import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return (
    <div className="wrap admin">
      <nav className="admin-nav" aria-label="Admin">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/menu">Menu</Link>
        <Link href="/admin/settings">Settings</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
