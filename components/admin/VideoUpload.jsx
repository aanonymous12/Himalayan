'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Uploads straight from the browser to Supabase Storage (videos are too big for a server action).
export default function VideoUpload({ initial }) {
  const [url, setUrl] = useState(initial || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    if (!/^video\/(mp4|webm)$/.test(f.type)) return setErr('Please choose an MP4 or WebM video.');
    if (f.size > 50 * 1024 * 1024) return setErr('That file is over 50 MB. Compress it first. Under 15 MB is ideal.');
    setBusy(true);
    const sb = createClient();
    const path = `hero-${Date.now()}.${f.type === 'video/webm' ? 'webm' : 'mp4'}`;
    const { error } = await sb.storage.from('site').upload(path, f, { contentType: f.type, cacheControl: '31536000' });
    setBusy(false);
    if (error) return setErr(error.message);
    setUrl(sb.storage.from('site').getPublicUrl(path).data.publicUrl);
  }

  return (
    <div className="field">
      <label htmlFor="hero_video_url">Background video</label>
      {url && <video src={url} muted loop playsInline autoPlay style={{ width: '100%', maxWidth: 440, borderRadius: 10 }} />}
      <input id="hero_video_url" name="hero_video_url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Upload below, or paste a direct .mp4 link" />
      <div className="row">
        <input type="file" accept="video/mp4,video/webm" onChange={pick} disabled={busy} aria-label="Upload a video file" />
        {url && <button type="button" className="btn sm line" onClick={() => setUrl('')}>Remove video</button>}
      </div>
      {busy && <span className="hint">Uploading, keep this page open...</span>}
      {err && <div className="error">{err}</div>}
      <span className="hint">MP4 or WebM, no sound needed, 10 to 20 second loop, 1080p, under 15 MB. Remember to press Save settings.</span>
    </div>
  );
}
