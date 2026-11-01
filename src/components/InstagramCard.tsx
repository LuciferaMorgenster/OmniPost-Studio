import React, { useState } from 'react';
import {
  Instagram,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Maximize2,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Sliders,
  Wand2,
  Eye,
  Edit3,
  Tag,
  Hash,
} from 'lucide-react';
import { AspectRatioType, GeneratedImage, ImageSizeType, InstagramPostData } from '../types';

interface InstagramCardProps {
  data: InstagramPostData;
  onUpdate: (updated: Partial<InstagramPostData>) => void;
  onRegenerateImage: (prompt: string, aspectRatio: AspectRatioType, size: ImageSizeType) => Promise<void>;
  onRefinePost: (instruction: string) => Promise<void>;
  onOpenImageModal: (image: GeneratedImage) => void;
  isRefining: boolean;
  isRegeneratingImage: boolean;
}

export const InstagramCard: React.FC<InstagramCardProps> = ({
  data,
  onUpdate,
  onRegenerateImage,
  onRefinePost,
  onOpenImageModal,
  isRefining,
  isRegeneratingImage,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [customRefinePrompt, setCustomRefinePrompt] = useState('');
  const [showImageTools, setShowImageTools] = useState(false);
  const [customImagePrompt, setCustomImagePrompt] = useState(data.suggestedImagePrompt || '');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(data.image?.aspectRatio || '1:1');
  const [selectedSize, setSelectedSize] = useState<ImageSizeType>(data.image?.size || '2K');

  const handleCopy = () => {
    const textToCopy = `${data.caption}\n\n.\n.\n.\n${data.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHashtagsOnly = () => {
    const tagStr = data.hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ');
    navigator.clipboard.writeText(tagStr);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleRegenImageClick = async () => {
    await onRegenerateImage(customImagePrompt || data.suggestedImagePrompt, selectedRatio, selectedSize);
  };

  const charCount = data.caption.length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col h-full overflow-hidden shadow-xl hover:border-pink-500/40 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Instagram className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">Instagram</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Visual & Storytelling
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Aesthetic lifestyle & community tags</p>
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
            title="Copy Instagram Caption & Tags"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto max-h-[720px] scrollbar-thin">
        {activeTab === 'editor' ? (
          <>
            {/* First-Line Hook */}
            {data.hook && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">First Line (Pre-Fold)</span>
                  <span className="font-mono text-pink-400">{data.hook.length}/125 chars</span>
                </div>
                <input
                  type="text"
                  value={data.hook}
                  onChange={(e) => onUpdate({ hook: e.target.value })}
                  className="w-full text-xs font-semibold rounded-lg bg-slate-950/60 border border-slate-800 p-2 text-pink-300 focus:outline-none focus:border-pink-500"
                />
              </div>
            )}

            {/* Caption Textarea */}
            <div className="space-y-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Caption Body</span>
                <span className="font-mono text-slate-400">{charCount} chars</span>
              </div>
              <textarea
                value={data.caption}
                onChange={(e) =>
                  onUpdate({ caption: e.target.value, characterCount: e.target.value.length })
                }
                rows={8}
                className="w-full flex-1 rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs leading-relaxed text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans resize-y"
              />
            </div>

            {/* Call to Action */}
            {data.callToAction && (
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                  Call to Action (CTA)
                </span>
                <p className="text-xs text-slate-300">{data.callToAction}</p>
              </div>
            )}

            {/* Hashtag Cloud with Copy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3 h-3 text-pink-400" />
                  Hashtag Cluster ({data.hashtags?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={handleCopyHashtagsOnly}
                  className="text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
                >
                  {copiedTags ? 'Copied Tags!' : 'Copy Tags Only'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 rounded-lg bg-slate-950/40 border border-slate-800">
                {data.hashtags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20"
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
                  <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                  Refine with Gemini
                </span>
                {isRefining && <span className="text-[11px] text-pink-400 animate-pulse">Polishing...</span>}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Add tasteful emoji spacing and make the voice warm and inspiring')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  ✨ Emoji & Spacing
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Make the opening sentence irresistibly click-worthy before the fold')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  🎯 Hook First Line
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Incorporate a high-converting Save This Post CTA for the algorithm')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  📌 Save Post CTA
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Curate a super high-signal 20-hashtag cluster with niche and community tags')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  🏷️ 20 Viral Tags
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
                  placeholder="Custom Instagram polish..."
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
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
                  className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Generated Image Section & Ratio/Size Controls */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  Tailored Image (Instagram {data.image?.aspectRatio || '1:1'})
                </span>
                <button
                  type="button"
                  onClick={() => setShowImageTools(!showImageTools)}
                  className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showImageTools ? 'Close' : 'Adjust Settings'}</span>
                </button>
              </div>

              {isRegeneratingImage ? (
                <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
                  <RotateCcw className="w-6 h-6 text-pink-400 animate-spin" />
                  <span className="text-xs text-slate-400">Rendering aesthetic photo with Gemini...</span>
                </div>
              ) : data.image?.url ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={data.image.url}
                    alt="Instagram visual"
                    className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/30">
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
                      download={`instagram-post-${Date.now()}.png`}
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
                    className="text-xs text-pink-400 hover:underline font-semibold"
                  >
                    Generate Instagram Visual
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
                        <option value="1:1">1:1 Square (Feed)</option>
                        <option value="4:3">4:3 Horizontal</option>
                        <option value="3:4">3:4 Portrait</option>
                        <option value="9:16">9:16 Story / Reel</option>
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
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isRegeneratingImage}
                    onClick={handleRegenImageClick}
                    className="w-full py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRegeneratingImage ? 'animate-spin' : ''}`} />
                    <span>Regenerate Instagram Visual</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Realistic Instagram Mobile Feed Mockup */
          <div className="rounded-xl border border-slate-800 bg-black text-white shadow-xl overflow-hidden font-sans">
            {/* User Profile Bar */}
            <div className="p-3 flex items-center justify-between border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                    IG
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs">yourbrand</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Original audio • London</span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Post Image (Square or Aspect-locked) */}
            <div className="aspect-square bg-slate-900 relative flex items-center justify-center overflow-hidden">
              {data.image?.url ? (
                <img
                  src={data.image.url}
                  alt="Instagram feed"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="text-center p-4">
                  <Instagram className="w-8 h-8 text-pink-400 mx-auto mb-2 opacity-50" />
                  <span className="text-xs text-slate-500">Image will display here</span>
                </div>
              )}
            </div>

            {/* Action Bar (Heart, Comment, Share, Bookmark) */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <Heart className="w-5 h-5 text-white hover:text-rose-500 cursor-pointer" />
                  <MessageCircle className="w-5 h-5 text-white cursor-pointer" />
                  <Send className="w-5 h-5 text-white cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 text-white cursor-pointer" />
              </div>

              {/* Likes */}
              <div className="text-xs font-bold text-slate-100">
                1,842 likes
              </div>

              {/* Caption */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                <span className="font-bold mr-1.5 text-white">yourbrand</span>
                {data.caption}
              </div>

              {/* Hashtags */}
              <div className="text-xs text-sky-400 flex flex-wrap gap-1 pt-1">
                {data.hashtags?.slice(0, 10).map((h, i) => (
                  <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
                ))}
                {data.hashtags && data.hashtags.length > 10 && (
                  <span className="text-slate-500 text-[11px]">+{data.hashtags.length - 10} more</span>
                )}
              </div>

              {/* Comments count */}
              <div className="text-[11px] text-slate-500 pt-1">
                View all 48 comments • 2 hours ago
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
