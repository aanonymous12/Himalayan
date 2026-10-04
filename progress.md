# Progress log: Himalayan Nepalese & Indian Cuisine website

Stack (one framework only): **Next.js 15 (App Router, React 19)** on **Vercel**, **Supabase** (Postgres, Auth, Storage). Plain CSS, no UI kit. No payment gateway: customers pay at the restaurant.

## Revision 2 (restaurant, theme, responsive)
- Reworded everything from food truck to restaurant.
- Applied the new color theme (see Design decisions).
- Home is now a single page with anchor navigation; menu moved onto it.
- Every dish has an image slot with upload in Admin. **Real food photos still need to be uploaded**, I cannot source licensed photos.
- Fully responsive layout and mobile hamburger navigation.
- If you already ran the old schema: `update settings set story = replace(story, 'in our truck', 'in our kitchen') where id = 1;`

## Revision 3 (cleaner, more professional, hero video)
- **Home redesigned**: full-screen hero with a short headline, two buttons and a slim hours / address / phone bar. Guest favorites row (photos), menu, short story, visit section.
- **Admin-controlled hero video**: Admin > Settings > Home page. Upload an MP4/WebM (uploads straight to Supabase Storage) or paste a link. Headline and subline are editable too. Without a video the hero shows a clean rust mountain ridge.
- Video is muted, looping, paused for visitors who prefer reduced motion, with a visible Pause button.
- **Menu declutter**: category tabs (one category on screen at a time), two-line dish descriptions, compact image rows with an Add button.
- New heading font (Cormorant Garamond) with Figtree for text, calmer spacing, trimmed copy.
- **Existing database?** Run `supabase/migrations/002_hero_video.sql` once. New projects: `schema.sql` already includes it.

## Done

### Database (`supabase/schema.sql`, `supabase/seed.sql`)
- Tables: `profiles`, `settings`, `menu_categories`, `menu_items`, `orders`, `order_items`. Order numbers start at 1001.
- Row Level Security on every table. The public can read the menu and settings. Customers can read only their own orders. Only admins can write anything.
- Nobody can insert an order from the browser. Orders are created only by the server after prices are re-checked (see Checkout).
- `menu` storage bucket for dish photos (public read, admin write).
- Seed file loads the full menu from the website text (9 categories, 44 items). Dishes with protein choices (Tikka Masala, Butter Masala, Korma, Coconut Curry) use `options` so one row holds Chicken / Lamb-Goat / Shrimp prices.

### Public site
- **One-page home with anchor navigation** (Menu, About, Visit us): hero, full menu, story, address/hours/map. Nav highlights the section you are in and becomes a hamburger menu below 900px. Old `/menu`, `/about`, `/contact` URLs redirect to the matching section.
- **Menu**: category chips (sticky), a photo for every dish, vegetarian marker, Popular tag, sold-out state, option picker, add to cart. Dishes without an uploaded photo show a brand-colored illustration until you add one in Admin > Menu.
- **Cart and checkout**: cart saved in the browser. **Guest checkout** (default, no account) and **log in / sign up** choice. Logged-in customers get details pre-filled and the order attached to their account.
- **Order confirmation**: order number, items, total due at pickup. Reached by an unguessable id, so guests need no account.
- **My orders** for logged-in customers.
- SEO: metadata and canonical URLs per page, Open Graph and Twitter tags, `sitemap.xml`, `robots.txt` (blocks admin, checkout, account), JSON-LD, semantic headings, lazy images.

### Checkout security
`placeOrder` (server action) ignores any price sent by the browser. It reloads each dish and option from the database, rejects sold-out dishes, validates name, phone and quantities, calculates tax from the admin-set rate, then saves the order and items. If saving the items fails, the order is rolled back.

### Admin (`/admin`, admins only)
Checked on every page and every action, and again by database RLS.
- **Dashboard**: open orders, sales today, last 7 days, last 30 days, sales by day, best sellers, latest orders. Refreshes every 30 seconds.
- **Orders**: filter by status, customer contact, items, notes, pickup time, one-tap status flow (new, preparing, ready, picked up) and cancel. Guest vs account orders are labelled. Refreshes every 20 seconds.
- **Menu**: add, edit, delete categories and dishes; options and prices; photo upload; vegetarian, featured and sold-out toggles; ordering.
- **Settings**: pause online ordering, top-of-site banner, business name, phone, address, hours, story text, sales tax rate.

### Design decisions
Palette taken from the supplied swatch: rust `#9a4f26`, gold `#ffd21a`, espresso `#2b1810`, plus white and black. Header is a rust bar over a gold rule, hero is espresso with a rust mountain ridge. Young Serif for headings, Figtree for text. Responsive for phone, iPad and desktop (breakpoints 520 / 800 / 900 / 1000px), 44px touch targets, follows the visitor's light/dark setting.

## Assumptions to confirm
- Naan was listed as "$1.99+". I seeded Plain $1.99, Butter $2.49, Garlic $2.99. **Fix real prices in Admin > Menu.**
- Tax rate defaults to 8.25% (Texas state plus local). Confirm with your accountant, change in Admin > Settings.
- "Pay in store" means paying at the restaurant on pickup.
- Sales reports count every order that is not cancelled.
- The plan documents mention buffet, delivery/DoorDash and table reservations. Dine-in reservations are still planned (see below). Buffet and DoorDash were not in the menu text, so they are not built. Tell me if you want them.

## Not built yet (next phases)
1. Email confirmations through Resend (needs your Resend key and a verified sender domain).
2. Reviews page with Google review link, internal feedback form, and the NFC review flow.
3. Gallery with photos and video, plus Instagram feed (need real photos).
4. Contact form saved to the database.
5. Blog, keyword research, 2 posts per week, and backlinks.
6. Google Business Profile and Meta/Google Ads work (done outside the code).
7. Table reservations and event booking from the plan,
8. Order alert sound or SMS for the kitchen, spam protection (rate limiting or CAPTCHA) on checkout, and custom domain email.
9. Automated uptime ping so the free Supabase project does not pause.

## Verified
- `next build` compiles all 15 routes with no errors. (Google Fonts could not be fetched in my sandbox, so I checked the build with fonts stubbed. They load normally on Vercel.)
- Not tested against a live Supabase project, because I have no credentials. Follow the README, then place a test order.
