'use client';
import { useEffect, useMemo, useState } from 'react';

const IMG = (p) => (p ? `https://image.tmdb.org/t/p/w92${p}` : null);

// Derive region from browser locale (fallback US)
function getRegion() {
  if (typeof navigator === 'undefined') return 'US';
  const lang = navigator.language || 'en-US';
  const parts = lang.split('-');
  return parts[1]?.toUpperCase() || 'US';
}

export default function ProvidersRow({ type, id }) {
  const [data, setData] = useState(null);
  const [region, setRegion] = useState('US');

  useEffect(() => {
    setRegion(getRegion());
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/tmdb/providers?type=${type}&id=${id}`);
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      }
    };
    run();
  }, [type, id]);

  const regionData = useMemo(() => data?.results?.[region] || data?.results?.US, [data, region]);

  if (!data) return null;
  if (!regionData) return (
    <div className="text-white/70">No streaming info available.</div>
  );

  const groups = [
    { key: 'flatrate', label: 'Stream' },
    { key: 'rent', label: 'Rent' },
    { key: 'buy', label: 'Buy' },
  ];

  return (
    <div className="space-y-2">
      <div className="text-white/70 text-sm">Where to watch ({regionData.link ? <a href={regionData.link} target="_blank" className="underline hover:text-white">More</a> : '—'})</div>
      <div className="flex flex-wrap gap-4">
        {groups.map(g => {
          const list = regionData[g.key];
          if (!list || list.length === 0) return null;
          return (
            <div key={g.key} className="flex items-center gap-2">
              <span className="text-white/70 text-sm w-14">{g.label}:</span>
              <div className="flex items-center gap-2">
                {list.slice(0, 12).map(p => (
                  <div key={p.provider_id} className="grid place-items-center">
                    <img src={IMG(p.logo_path)} alt={p.provider_name} title={p.provider_name}
                      className="w-8 h-8 rounded object-cover ring-1 ring-white/10" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}