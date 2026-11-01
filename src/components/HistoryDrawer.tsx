import React from 'react';
import { X, Trash2, ArrowRight, History, Calendar, Sparkles } from 'lucide-react';
import { CampaignData } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: CampaignData[];
  onSelectCampaign: (campaign: CampaignData) => void;
  onDeleteCampaign: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  campaigns,
  onSelectCampaign,
  onDeleteCampaign,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Campaign History</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
              {campaigns.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {campaigns.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-500/10 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <History className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No saved campaigns yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Any campaign you generate will automatically be saved here so you can revisit drafts anytime.
              </p>
            </div>
          ) : (
            campaigns.map((camp) => (
              <div
                key={camp.id}
                className="group p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-950 transition-all space-y-2.5 relative"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="capitalize px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold text-[10px]">
                      {camp.tone}
                    </span>
                    <span className="text-slate-500">
                      {new Date(camp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCampaign(camp.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                    title="Delete saved draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 font-medium">
                  "{camp.idea}"
                </p>

                {/* Thumbnails of generated images if any */}
                <div className="flex items-center gap-1.5 pt-1">
                  {camp.linkedin.image?.url && (
                    <img
                      src={camp.linkedin.image.url}
                      alt="li"
                      className="w-7 h-7 rounded object-cover border border-slate-800"
                    />
                  )}
                  {camp.twitter.image?.url && (
                    <img
                      src={camp.twitter.image.url}
                      alt="tw"
                      className="w-7 h-7 rounded object-cover border border-slate-800"
                    />
                  )}
                  {camp.instagram.image?.url && (
                    <img
                      src={camp.instagram.image.url}
                      alt="ig"
                      className="w-7 h-7 rounded object-cover border border-slate-800"
                    />
                  )}
                  <span className="text-[10px] text-slate-500 ml-auto">
                    3 platforms
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectCampaign(camp);
                    onClose();
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer mt-1"
                >
                  <span>Load Into Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
