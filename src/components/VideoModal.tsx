'use client';

import React from 'react';
import { X, Play } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const { content } = useSiteContent();
  const video = content.modals.video;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden max-w-3xl w-full text-white relative shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d151c]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c3f53c]" />
            <span className="text-sm font-bold text-white">{video.title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-slate-950 flex items-center justify-center group overflow-hidden">
          {video.videoUrl ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={video.thumbImage}
                alt={video.headline}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[#c3f53c] text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer mb-4">
                  <Play className="w-8 h-8 fill-slate-950 ml-1" />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{video.headline}</h4>
                <p className="text-xs text-slate-300 max-w-md">{video.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
