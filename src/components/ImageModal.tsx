import React from 'react';
import { X, Download, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!image) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Studio Image Lightbox</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {image.aspectRatio}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {image.size}
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {image.model}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={image.url}
              download={`omnipost-studio-${Date.now()}.png`}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition text-xs flex items-center gap-1.5 px-3 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/90">
          <img
            src={image.url}
            alt="Studio render"
            className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border border-slate-800/80"
          />
        </div>

        {/* Modal Footer (Prompt & Metadata) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Generation Prompt
            </span>
            <button
              onClick={handleCopy}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied Data URL' : 'Copy Data'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            {image.prompt}
          </p>
        </div>
      </div>
    </div>
  );
};
