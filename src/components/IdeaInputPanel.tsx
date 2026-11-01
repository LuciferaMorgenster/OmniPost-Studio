import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lightbulb,
  Zap,
  Target,
  Megaphone,
  Palette,
  Layers,
} from 'lucide-react';
import {
  AspectRatioType,
  ImageGenerationSettings,
  ImageModelType,
  ImageSizeType,
  TextModelType,
  ToneType,
} from '../types';
import {
  ASPECT_RATIOS,
  IDEA_PRESETS,
  IMAGE_SIZES,
  IMAGE_STYLES,
  TONE_OPTIONS,
} from '../data/presets';

interface IdeaInputPanelProps {
  idea: string;
  setIdea: (idea: string) => void;
  tone: ToneType | string;
  setTone: (tone: ToneType | string) => void;
  toneIntensity: number;
  setToneIntensity: (val: number) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  callToAction: string;
  setCallToAction: (val: string) => void;
  generateImages: boolean;
  setGenerateImages: (val: boolean) => void;
  imageSettings: ImageGenerationSettings;
  setImageSettings: React.Dispatch<React.SetStateAction<ImageGenerationSettings>>;
  textModel: TextModelType;
  setTextModel: (val: TextModelType) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const IdeaInputPanel: React.FC<IdeaInputPanelProps> = ({
  idea,
  setIdea,
  tone,
  setTone,
  toneIntensity,
  setToneIntensity,
  targetAudience,
  setTargetAudience,
  callToAction,
  setCallToAction,
  generateImages,
  setGenerateImages,
  imageSettings,
  setImageSettings,
  textModel,
  setTextModel,
  onGenerate,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showImageSettings, setShowImageSettings] = useState(true);

  const handleApplyPreset = (preset: typeof IDEA_PRESETS[0]) => {
    setIdea(preset.idea);
    setTone(preset.tone);
    setTargetAudience(preset.audience);
    setCallToAction(preset.cta);
  };

  const handleRatioChange = (platform: 'linkedin' | 'twitter' | 'instagram', ratio: AspectRatioType) => {
    setImageSettings((prev) => ({
      ...prev,
      [platform]: {
        aspectRatio: ratio,
      },
    }));
  };

  const selectedToneObj = TONE_OPTIONS.find((t) => t.id === tone);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Top Header & Inspiration Chips */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <label className="text-sm font-bold tracking-wide text-slate-200 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            What is your core idea or campaign topic?
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Inspiration presets:</span>
          </div>
        </div>

        {/* Preset suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
          {IDEA_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="shrink-0 px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="E.g., We just launched an open-source tool that shrinks Docker containers by 80% without modifying configuration. Perfect for DevOps and cloud teams..."
            rows={3}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition resize-y min-h-[95px]"
          />
          {idea && (
            <button
              onClick={() => setIdea('')}
              className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition text-xs"
              title="Clear idea"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tone Selection (Mandatory core requirement) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Select Desired Tone
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Tone Strength:</span>
            <span className="font-semibold text-indigo-400 font-mono">{toneIntensity}%</span>
          </div>
        </div>

        {/* Tone Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {TONE_OPTIONS.map((opt) => {
            const isSelected = tone === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTone(opt.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${opt.badgeColor} ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]`
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{opt.emoji}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </div>
                <span className="font-bold text-xs text-white leading-tight">{opt.label}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.tagline}</span>
              </button>
            );
          })}
        </div>

        {/* Tone slider */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Subtle</span>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={toneIntensity}
            onChange={(e) => setToneIntensity(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Punchy & Bold</span>
        </div>
      </div>

      {/* Image Generation Affordances (Resolution, Ratio per Platform, Model) */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGenerateImages(!generateImages)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                generateImages ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generateImages ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              Generate Platform-Optimized Images
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowImageSettings(!showImageSettings)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <span>{showImageSettings ? 'Hide Options' : 'Configure Ratios & Resolution'}</span>
            {showImageSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {generateImages && showImageSettings && (
          <div className="space-y-4 pt-2 border-t border-slate-800/60">
            {/* Image Resolution & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Image Size (1K, 2K, 4K affordance) */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Resolution Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {IMAGE_SIZES.map((sz) => (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => setImageSettings((prev) => ({ ...prev, imageSize: sz.value }))}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                        imageSettings.imageSize === sz.value
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold'
                          : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>{sz.value}</div>
                      <div className="text-[9px] opacity-70">{sz.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Studio Image Engine
                </label>
                <select
                  value={imageSettings.model}
                  onChange={(e) =>
                    setImageSettings((prev) => ({
                      ...prev,
                      model: e.target.value as ImageModelType,
                    }))
                  }
                  className="w-full h-9 rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview (Studio Pro)</option>
                  <option value="gemini-nano-banana-2.1">gemini-nano-banana-2.1 (Fast & Clean)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">High-fidelity generative imagery</p>
              </div>

              {/* Visual Aesthetic Style */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Aesthetic Style
                </label>
                <select
                  value={imageSettings.style}
                  onChange={(e) => setImageSettings((prev) => ({ ...prev, style: e.target.value }))}
                  className="w-full h-9 rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {IMAGE_STYLES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Applied across all visual prompts</p>
              </div>
            </div>

            {/* Platform Aspect Ratios */}
            <div className="pt-2 border-t border-slate-800/40">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Optimal Aspect Ratio per Platform
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* LinkedIn Ratio */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-blue-400">LinkedIn Visual</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Current: {imageSettings.linkedin.aspectRatio}
                    </span>
                  </div>
                  <select
                    value={imageSettings.linkedin.aspectRatio}
                    onChange={(e) => handleRatioChange('linkedin', e.target.value as AspectRatioType)}
                    className="w-full rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="16:9">16:9 Landscape (Optimal Banner)</option>
                    <option value="4:3">4:3 Standard Editorial</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="21:9">21:9 Ultrawide Header</option>
                  </select>
                </div>

                {/* Twitter / X Ratio */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-sky-400">Twitter / X Visual</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Current: {imageSettings.twitter.aspectRatio}
                    </span>
                  </div>
                  <select
                    value={imageSettings.twitter.aspectRatio}
                    onChange={(e) => handleRatioChange('twitter', e.target.value as AspectRatioType)}
                    className="w-full rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 p-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="16:9">16:9 Landscape (Feed Standard)</option>
                    <option value="3:2">3:2 Standard Photo</option>
                    <option value="4:3">4:3 Classic Card</option>
                    <option value="1:1">1:1 Square</option>
                  </select>
                </div>

                {/* Instagram Ratio */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-pink-400">Instagram Visual</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Current: {imageSettings.instagram.aspectRatio}
                    </span>
                  </div>
                  <select
                    value={imageSettings.instagram.aspectRatio}
                    onChange={(e) => handleRatioChange('instagram', e.target.value as AspectRatioType)}
                    className="w-full rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 p-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  >
                    <option value="1:1">1:1 Square (Classic Feed)</option>
                    <option value="4:3">4:3 Horizontal</option>
                    <option value="3:4">3:4 Portrait Feed</option>
                    <option value="9:16">9:16 Full Story / Reel</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Collapsible (Target Audience, Call-To-Action, AI Model) */}
      <div className="border-t border-slate-800/60 pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Audience & Context Settings' : 'Audience, CTA & Model Settings'}</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="E.g., B2B SaaS Founders, Remote Engineers..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
                <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
                Desired Call To Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="E.g., Try free for 14 days, comment thoughts..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Text Strategy Model
              </label>
              <select
                value={textModel}
                onChange={(e) => setTextModel(e.target.value as TextModelType)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Fast & Multi-Tone)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex Reasoning & Nuance)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !idea.trim()}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow-xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="px-6 py-3.5 rounded-xl bg-slate-950/80 group-hover:bg-slate-950/40 transition-all flex items-center justify-center gap-2.5">
            {isGenerating ? (
              <>
                <RotateCcw className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="font-bold text-sm text-white tracking-wide">
                  Generating Tailored LinkedIn, X, and Instagram Posts & Images...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm text-white tracking-wide">
                  Generate Cross-Platform Content & Studio Images
                </span>
                <span className="text-xs text-indigo-200/80 hidden sm:inline font-normal">
                  ({selectedToneObj?.label} • 3 Platforms)
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
