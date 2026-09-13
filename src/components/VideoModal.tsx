import { X, CheckCircle, Clock } from 'lucide-react';
import type { TrailNode } from '../types';
import { useAppContext } from '../context/AppContext';

interface Props {
  node: TrailNode;
  onClose: () => void;
}

export function VideoModal({ node, onClose }: Props) {
  const { completeVideo, isCompleted } = useAppContext();
  const completed = isCompleted(node.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#14142a', border: '1px solid rgba(124,58,237,0.3)', maxHeight: '90vh' }}
      >
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex-1 pr-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block"
              style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}
            >
              {node.category}
            </span>
            <h2 className="font-['Outfit'] text-lg font-bold text-white leading-tight">
              {node.title}
            </h2>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#8b8aaa]">
              <Clock size={12} />
              <span>{node.durationMin} min</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={18} className="text-[#8b8aaa]" />
          </button>
        </div>

        <div className="mx-5 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#0b0b18' }}>
          <iframe
            src={`https://www.youtube.com/embed/${node.videoId}?rel=0&modestbranding=1`}
            title={node.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <p className="px-5 py-4 text-sm text-[#8b8aaa] leading-relaxed">{node.description}</p>

        <div className="px-5 pb-6">
          <button
            onClick={() => {
              completeVideo(node.id);
              onClose();
            }}
            disabled={completed}
            className="w-full py-3.5 rounded-2xl font-['Outfit'] font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2"
            style={
              completed
                ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', cursor: 'default' }
                : { background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white' }
            }
          >
            <CheckCircle size={18} />
            {completed ? 'Concluído!' : 'Marcar como Concluído'}
          </button>
        </div>
      </div>
    </div>
  );
}
