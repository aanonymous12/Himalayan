const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export default function robots() {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/checkout', '/account', '/order/'] }, sitemap: `${site}/sitemap.xml` };
}
