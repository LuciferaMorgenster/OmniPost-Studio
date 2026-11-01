import React from 'react';
import {
  Sparkles,
  Layers,
  History,
  Copy,
  Check,
  Download,
  Share2,
  Cpu,
} from 'lucide-react';
import { CampaignData } from '../types';

interface NavbarProps {
  campaign: CampaignData | null;
  historyCount: number;
  onOpenHistory: () => void;
  onExportMarkdown: () => void;
  onCopyAll: () => void;
  copiedAll: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  campaign,
  historyCount,
  onOpenHistory,
  onExportMarkdown,
  onCopyAll,
  copiedAll,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OmniPost
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Platform AI Engine • LinkedIn • X • Instagram
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition shadow-sm cursor-pointer"
            title="Saved Campaigns"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Saved</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                {historyCount}
              </span>
            )}
          </button>

          {/* Copy All */}
          <button
            onClick={onCopyAll}
            disabled={!campaign}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer ${
              copiedAll
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title="Copy all 3 drafted posts to clipboard"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Copy All</span>
              </>
            )}
          </button>

          {/* Export Markdown */}
          <button
            onClick={onExportMarkdown}
            disabled={!campaign}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export campaign as Markdown"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Engine Status Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span className="font-mono text-slate-300">gemini-3.8-flash</span>
            <span className="text-slate-600">+</span>
            <span className="font-mono text-purple-300">gemini-3-pro-image</span>
          </div>
        </div>
      </div>
    </header>
  );
};
