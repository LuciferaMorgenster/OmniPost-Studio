import React, { useState } from 'react';
import { X, Sparkles, Wand2, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { PlatformKey } from '../types';

interface HookOption {
  type: string;
  text: string;
}

interface HookLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: string;
  tone: string;
  platform: PlatformKey;
  onApplyHook: (hookText: string) => void;
}

export const HookLabModal: React.FC<HookLabModalProps> = ({
  isOpen,
  onClose,
  idea,
  tone,
  platform,
  onApplyHook,
}) => {
  const [hooks, setHooks] = useState<HookOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>(platform);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerateHooks = async () => {
    setIsLoading(true);
    setAppliedIdx(null);
    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: idea || 'Autonomous AI tools for creators',
          platform: selectedPlatform,
          tone: tone || 'witty',
        }),
      });
      const data = await res.json();
      if (data.hooks && data.hooks.length > 0) {
        setHooks(data.hooks);
      }
    } catch (err) {
      console.error('Failed to generate hooks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Viral Hook Lab</h3>
              <p className="text-[11px] text-slate-400">
                Powered by fast <span className="font-mono text-amber-400">gemini-3.1-flash-lite</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedPlatform('linkedin')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  selectedPlatform === 'linkedin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                LinkedIn
              </button>
              <button
                onClick={() => setSelectedPlatform('twitter')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  selectedPlatform === 'twitter' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Twitter / 𝕏
              </button>
              <button
                onClick={() => setSelectedPlatform('instagram')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  selectedPlatform === 'instagram' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Instagram
              </button>
            </div>

            <button
              onClick={handleGenerateHooks}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{hooks.length > 0 ? 'Generate More' : 'Generate 5 Hook Angles'}</span>
                </>
              )}
            </button>
          </div>

          {/* Hook list */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {hooks.length === 0 && !isLoading && (
              <div className="text-center py-8 rounded-xl bg-slate-950/50 border border-slate-800/80 p-4">
                <Sparkles className="w-6 h-6 text-amber-400/60 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-semibold">Test opening angles for maximum scroll-stopping power</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click the button above to generate 5 psycho-tested hook structures (Contrarian, Data, Story, How-To, Curiosity).
                </p>
              </div>
            )}

            {hooks.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-amber-500/50 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {h.type}
                  </span>
                  <button
                    onClick={() => {
                      onApplyHook(h.text);
                      setAppliedIdx(i);
                      setTimeout(() => {
                        onClose();
                      }, 400);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {appliedIdx === i ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Applied!</span>
                      </>
                    ) : (
                      <>
                        <span>Use This</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  "{h.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
