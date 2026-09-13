import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Clock, Star, X } from 'lucide-react';
import { studySpaceService } from '../services/studySpaceService';
import type { StudySpace } from '../types';

const iconColors: Record<StudySpace['type'], string> = {
  library: '#7c3aed',
  cafe: '#f59e0b',
  coworking: '#06b6d4',
  study_room: '#10b981',
};

const typeLabels: Record<StudySpace['type'], string> = {
  library: 'Biblioteca',
  cafe: 'Café',
  coworking: 'Coworking',
  study_room: 'Sala de Estudos',
};

const typeEmoji: Record<StudySpace['type'], string> = {
  library: '📚',
  cafe: '☕',
  coworking: '💼',
  study_room: '🎓',
};

function createMarkerIcon(type: StudySpace['type']) {
  const color = iconColors[type];
  const emoji = typeEmoji[type];
  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 40px; height: 40px; border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    ">
      <span style="transform: rotate(45deg); font-size: 18px; display:block; text-align:center; line-height:36px;">${emoji}</span>
    </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
}

export function MapPage() {
  const [spaces, setSpaces] = useState<StudySpace[]>([]);
  const [selected, setSelected] = useState<StudySpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StudySpace['type'] | 'all'>('all');

  useEffect(() => {
    studySpaceService.getAll().then((data) => {
      setSpaces(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? spaces : spaces.filter((s) => s.type === filter);

  const filters: Array<{ key: StudySpace['type'] | 'all'; label: string }> = [
    { key: 'all', label: '🗺 Todos' },
    { key: 'library', label: '📚 Bibliotecas' },
    { key: 'cafe', label: '☕ Cafés' },
    { key: 'coworking', label: '💼 Coworking' },
    { key: 'study_room', label: '🎓 Salas' },
  ];

  return (
    <div className="flex flex-col h-full relative">
      <div
        className="flex-shrink-0 px-5 pt-12 pb-4 relative z-10"
        style={{ background: 'linear-gradient(to bottom, #0b0b18 80%, transparent)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={22} className="text-violet-400" />
          <h1 className="font-['Outfit'] text-2xl font-bold text-white">Espaços de Estudo</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                filter === key
                  ? { background: 'rgba(124,58,237,0.3)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.5)' }
                  : { background: '#1e1e3a', color: '#8b8aaa', border: '1px solid #2a2a4a' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <MapContainer
            center={[-3.7319, -38.5267]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            {filtered.map((space) => (
              <Marker
                key={space.id}
                position={[space.lat, space.lng]}
                icon={createMarkerIcon(space.type)}
                eventHandlers={{ click: () => setSelected(space) }}
              >
                <Popup>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                    {space.name}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {selected && (
        <div
          className="absolute bottom-20 left-4 right-4 rounded-2xl p-4 z-50 transition-all"
          style={{
            background: '#14142a',
            border: '1px solid rgba(124,58,237,0.4)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 p-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={16} className="text-[#8b8aaa]" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${iconColors[selected.type]}22`, border: `1px solid ${iconColors[selected.type]}44` }}
            >
              {typeEmoji[selected.type]}
            </div>
            <div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block"
                style={{ background: `${iconColors[selected.type]}22`, color: iconColors[selected.type] }}
              >
                {typeLabels[selected.type]}
              </span>
              <h3 className="font-['Outfit'] font-bold text-white text-base leading-tight">
                {selected.name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#8b8aaa] mt-2 leading-relaxed">{selected.description}</p>

          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex items-start gap-2 text-xs text-[#8b8aaa]">
              <MapPin size={12} className="mt-0.5 flex-shrink-0 text-violet-400" />
              <span>{selected.address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8b8aaa]">
              <Clock size={12} className="text-violet-400" />
              <span>{selected.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(selected.rating) ? 'text-amber-400 fill-amber-400' : 'text-[#2a2a4a]'}
                />
              ))}
              <span className="text-amber-400 font-semibold font-['Outfit']">{selected.rating}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
