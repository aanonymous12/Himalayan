import VideoUpload from '@/components/admin/VideoUpload';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { saveSettings } from '../actions';

export default async function AdminSettings() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <h1 style={{ marginBottom: '1.5rem' }}>Settings</h1>
      <form action={saveSettings} style={{ maxWidth: 680 }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Home page</h2>
        <div className="field"><label htmlFor="hero_title">Headline</label><input id="hero_title" name="hero_title" defaultValue={s.hero_title} maxLength={80} /></div>
        <div className="field"><label htmlFor="hero_subtitle">Line under the headline</label><input id="hero_subtitle" name="hero_subtitle" defaultValue={s.hero_subtitle} maxLength={120} /></div>
        <VideoUpload initial={s.hero_video_url} />

        <h2 style={{ fontSize: '1.4rem', margin: '2.25rem 0 1rem' }}>Ordering</h2>
        <div className="checks"><label><input type="checkbox" name="accepting_orders" defaultChecked={s.accepting_orders} /> <b>Accept online orders</b> (untick when you are closed or slammed)</label></div>
        <div className="field"><label htmlFor="announcement">Banner across the top of the site</label><input id="announcement" name="announcement" defaultValue={s.announcement} placeholder="Closed Thursday for a private event" /><span className="hint">Leave empty for no banner.</span></div>
        <div className="field"><label htmlFor="tax_percent">Sales tax %</label><input id="tax_percent" name="tax_percent" type="number" step="0.01" defaultValue={(Number(s.tax_rate) * 100).toFixed(2)} /></div>

        <h2 style={{ fontSize: '1.4rem', margin: '2.25rem 0 1rem' }}>Restaurant details</h2>
        <div className="grid2">
          <div className="field"><label htmlFor="business_name">Business name</label><input id="business_name" name="business_name" defaultValue={s.business_name} /></div>
          <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" defaultValue={s.phone} /></div>
        </div>
        <div className="field"><label htmlFor="address">Address</label><textarea id="address" name="address" rows={2} defaultValue={s.address} /></div>
        <div className="field"><label htmlFor="hours">Hours</label><textarea id="hours" name="hours" rows={3} defaultValue={s.hours} /></div>
        <div className="field"><label htmlFor="story">Our story</label><textarea id="story" name="story" rows={5} defaultValue={s.story} /></div>
        <button className="btn">Save settings</button>
      </form>
    </>
  );
}
