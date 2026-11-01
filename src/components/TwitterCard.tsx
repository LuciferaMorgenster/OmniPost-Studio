import React, { useState } from 'react';
import {
  Twitter,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Maximize2,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Share,
  Sliders,
  Wand2,
  Eye,
  Edit3,
  BadgeCheck,
  Layers,
} from 'lucide-react';
import { AspectRatioType, GeneratedImage, ImageSizeType, TwitterPostData } from '../types';

interface TwitterCardProps {
  data: TwitterPostData;
  onUpdate: (updated: Partial<TwitterPostData>) => void;
  onRegenerateImage: (prompt: string, aspectRatio: AspectRatioType, size: ImageSizeType) => Promise<void>;
  onRefinePost: (instruction: string) => Promise<void>;
  onOpenImageModal: (image: GeneratedImage) => void;
  isRefining: boolean;
  isRegeneratingImage: boolean;
}

export const TwitterCard: React.FC<TwitterCardProps> = ({
  data,
  onUpdate,
  onRegenerateImage,
  onRefinePost,
  onOpenImageModal,
  isRefining,
  isRegeneratingImage,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [postMode, setPostMode] = useState<'single' | 'thread'>('single');
  const [copied, setCopied] = useState(false);
  const [customRefinePrompt, setCustomRefinePrompt] = useState('');
  const [showImageTools, setShowImageTools] = useState(false);
  const [customImagePrompt, setCustomImagePrompt] = useState(data.suggestedImagePrompt || '');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(data.image?.aspectRatio || '16:9');
  const [selectedSize, setSelectedSize] = useState<ImageSizeType>(data.image?.size || '2K');

  const charCount = data.tweet.length;
  const charsRemaining = 280 - charCount;
  const isOverLimit = charsRemaining < 0;

  const handleCopy = () => {
    let textToCopy = '';
    if (postMode === 'thread' && data.thread && data.thread.length > 0) {
      textToCopy = data.thread.join('\n\n---\n\n');
    } else {
      textToCopy = `${data.tweet}\n\n${data.hashtags.join(' ')}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenImageClick = async () => {
    await onRegenerateImage(customImagePrompt || data.suggestedImagePrompt, selectedRatio, selectedSize);
  };

  const handleThreadChange = (index: number, val: string) => {
    const nextThread = [...data.thread];
    nextThread[index] = val;
    onUpdate({ thread: nextThread });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col h-full overflow-hidden shadow-xl hover:border-sky-500/40 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 flex items-center justify-center text-white shadow-md">
            <span className="font-extrabold text-sm">𝕏</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">Twitter / 𝕏</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Short & Punchy
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Viral brevity & real-time hooks</p>
          </div>
        </div>

        {/* View Switcher & Copy */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'editor'
                  ? 'bg-slate-800 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
            }`}
            title="Copy Tweet / Thread"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto max-h-[720px] scrollbar-thin">
        {activeTab === 'editor' ? (
          <>
            {/* Format toggle: Single Tweet vs Thread */}
            <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1">
                Display Format:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPostMode('single')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    postMode === 'single'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Single Tweet
                </button>
                <button
                  type="button"
                  onClick={() => setPostMode('thread')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    postMode === 'thread'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Thread ({data.thread?.length || 0})
                </button>
              </div>
            </div>

            {/* Post mode view */}
            {postMode === 'single' ? (
              <div className="space-y-1.5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold uppercase tracking-wider text-slate-400">
                    Tweet Content
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold ${
                        isOverLimit
                          ? 'text-red-400'
                          : charsRemaining < 20
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {charsRemaining} left ({charCount}/280)
                    </span>
                  </div>
                </div>
                <textarea
                  value={data.tweet}
                  onChange={(e) =>
                    onUpdate({ tweet: e.target.value, characterCount: e.target.value.length })
                  }
                  rows={5}
                  className={`w-full flex-1 rounded-xl bg-slate-950/80 border p-3 text-xs leading-relaxed text-slate-200 placeholder-slate-500 focus:outline-none transition resize-y ${
                    isOverLimit ? 'border-red-500/70' : 'border-slate-800 focus:border-sky-500'
                  }`}
                />
              </div>
            ) : (
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Multi-Tweet Thread</span>
                  <span>{data.thread?.length || 0} tweets</span>
                </div>
                <div className="space-y-2">
                  {data.thread?.map((item, idx) => (
                    <div key={idx} className="relative rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-sky-400">Tweet {idx + 1}</span>
                        <span className="font-mono">{item.length}/280</span>
                      </div>
                      <textarea
                        value={item}
                        onChange={(e) => handleThreadChange(idx, e.target.value)}
                        rows={2}
                        className="w-full text-xs bg-transparent border-0 text-slate-200 focus:outline-none resize-y"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Hashtags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Refine with Gemini Quick Actions */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-sky-400" />
                  Refine with Gemini
                </span>
                {isRefining && <span className="text-[11px] text-sky-400 animate-pulse">Polishing...</span>}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Ensure strict under 270 characters with maximum viral punch and curiosity')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  ⚡ Under 270 Chars
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Convert this single tweet into a captivating 4-part thread breakdown')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  🧵 Expand to Thread
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Make the tone more contrarian, bold and witty')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  🔥 Bold & Contrarian
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Format with clean line spacing and punchy bullet takeaways')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  ✨ Spaced Hook
                </button>
              </div>

              {/* Custom refine input */}
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={customRefinePrompt}
                  onChange={(e) => setCustomRefinePrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customRefinePrompt.trim()) {
                      onRefinePost(customRefinePrompt);
                      setCustomRefinePrompt('');
                    }
                  }}
                  placeholder="Custom refinement..."
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  disabled={isRefining || !customRefinePrompt.trim()}
                  onClick={() => {
                    if (customRefinePrompt.trim()) {
                      onRefinePost(customRefinePrompt);
                      setCustomRefinePrompt('');
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Image Preview & Controls */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Tailored Image (𝕏 {data.image?.aspectRatio || '16:9'})
                </span>
                <button
                  type="button"
                  onClick={() => setShowImageTools(!showImageTools)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showImageTools ? 'Close' : 'Adjust Settings'}</span>
                </button>
              </div>

              {isRegeneratingImage ? (
                <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
                  <RotateCcw className="w-6 h-6 text-sky-400 animate-spin" />
                  <span className="text-xs text-slate-400">Rendering visual with Gemini...</span>
                </div>
              ) : data.image?.url ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={data.image.url}
                    alt="Twitter / X graphic"
                    className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-sky-300 border border-sky-500/30">
                      {data.image.aspectRatio}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700">
                      {data.image.size}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenImageModal(data.image!)}
                      className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer"
                      title="View Full Resolution"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <a
                      href={data.image.url}
                      download={`x-post-${Date.now()}.png`}
                      className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 transition"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <p className="text-xs text-slate-400">No image generated yet</p>
                  <button
                    type="button"
                    onClick={handleRegenImageClick}
                    className="text-xs text-sky-400 hover:underline font-semibold"
                  >
                    Generate Twitter Visual
                  </button>
                </div>
              )}

              {/* Image Controls Drawer */}
              {showImageTools && (
                <div className="pt-2 border-t border-slate-800/60 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 block mb-1">Aspect Ratio</label>
                      <select
                        value={selectedRatio}
                        onChange={(e) => setSelectedRatio(e.target.value as AspectRatioType)}
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                      >
                        <option value="16:9">16:9 Landscape</option>
                        <option value="3:2">3:2 Standard Photo</option>
                        <option value="4:3">4:3 Card</option>
                        <option value="1:1">1:1 Square</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-slate-400 block mb-1">Resolution</label>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value as ImageSizeType)}
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
                      >
                        <option value="1K">1K Standard</option>
                        <option value="2K">2K High-Res</option>
                        <option value="4K">4K Studio</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-slate-400 block mb-1">Image Prompt</label>
                    <textarea
                      value={customImagePrompt}
                      onChange={(e) => setCustomImagePrompt(e.target.value)}
                      rows={2}
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isRegeneratingImage}
                    onClick={handleRegenImageClick}
                    className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRegeneratingImage ? 'animate-spin' : ''}`} />
                    <span>Regenerate Twitter Visual</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Realistic Twitter / X Dark Mode Feed Mockup */
          <div className="rounded-xl border border-slate-800 bg-black text-white shadow-xl overflow-hidden p-4 space-y-3 font-sans">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm">
                  𝕏
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm">Your Name</span>
                    <BadgeCheck className="w-4 h-4 text-sky-400 fill-current" />
                  </div>
                  <span className="text-xs text-slate-500">@handle • 1m</span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-slate-300">
                <span className="text-lg">···</span>
              </button>
            </div>

            {/* Tweet body */}
            <div className="text-sm text-slate-100 whitespace-pre-wrap leading-normal">
              {data.tweet}
              <div className="mt-2 text-sky-400 flex flex-wrap gap-1 text-xs">
                {data.hashtags.map((h, i) => (
                  <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
                ))}
              </div>
            </div>

            {/* Attached Image Card */}
            {data.image?.url && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 mt-2">
                <img
                  src={data.image.url}
                  alt="Twitter card attachment"
                  className="w-full max-h-72 object-cover object-center"
                />
              </div>
            )}

            {/* Interaction bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span>48</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
                <Repeat className="w-4 h-4" />
                <span>124</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-pink-400 cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>1,290</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
                <Bookmark className="w-4 h-4" />
                <span>210</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
                <Share className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
