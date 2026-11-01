import React, { useState } from 'react';
import {
  Linkedin,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Maximize2,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Sliders,
  Wand2,
  Eye,
  Edit3,
} from 'lucide-react';
import { AspectRatioType, GeneratedImage, ImageSizeType, LinkedInPostData } from '../types';

interface LinkedInCardProps {
  data: LinkedInPostData;
  onUpdate: (updated: Partial<LinkedInPostData>) => void;
  onRegenerateImage: (prompt: string, aspectRatio: AspectRatioType, size: ImageSizeType) => Promise<void>;
  onRefinePost: (instruction: string) => Promise<void>;
  onOpenImageModal: (image: GeneratedImage) => void;
  isRefining: boolean;
  isRegeneratingImage: boolean;
}

export const LinkedInCard: React.FC<LinkedInCardProps> = ({
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
  const [customRefinePrompt, setCustomRefinePrompt] = useState('');
  const [showImageTools, setShowImageTools] = useState(false);
  const [customImagePrompt, setCustomImagePrompt] = useState(data.suggestedImagePrompt || '');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(data.image?.aspectRatio || '16:9');
  const [selectedSize, setSelectedSize] = useState<ImageSizeType>(data.image?.size || '2K');

  const handleCopy = () => {
    const textToCopy = `${data.post}\n\n${data.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenImageClick = async () => {
    await onRegenerateImage(customImagePrompt || data.suggestedImagePrompt, selectedRatio, selectedSize);
  };

  const charCount = data.post.length;
  const isOptimal = charCount >= 800 && charCount <= 2200;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col h-full overflow-hidden shadow-xl hover:border-blue-500/40 transition-colors">
      {/* Card Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Linkedin className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">LinkedIn</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Long-Form
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Thought leadership & industry reach</p>
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
            title="Copy LinkedIn post"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-y-auto max-h-[720px] scrollbar-thin">
        {activeTab === 'editor' ? (
          <>
            {/* Headline / Hook */}
            {data.headline && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Opening Hook
                </span>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => onUpdate({ headline: e.target.value })}
                  className="w-full text-xs font-semibold rounded-lg bg-slate-950/60 border border-slate-800 p-2 text-blue-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Post Content Textarea */}
            <div className="space-y-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Post Body</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono ${isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {charCount} chars
                  </span>
                  <span className="text-[10px] text-slate-500">(Optimal: 1,000–2,000)</span>
                </div>
              </div>
              <textarea
                value={data.post}
                onChange={(e) => onUpdate({ post: e.target.value, characterCount: e.target.value.length })}
                rows={9}
                className="w-full flex-1 rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs leading-relaxed text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-sans resize-y"
              />
            </div>

            {/* Key Takeaways list */}
            {data.keyTakeaways && data.keyTakeaways.length > 0 && (
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Key Takeaways
                </span>
                <div className="space-y-1">
                  {data.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{takeaway}</span>
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
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
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
                  <Wand2 className="w-3.5 h-3.5 text-blue-400" />
                  Refine with Gemini
                </span>
                {isRefining && <span className="text-[11px] text-blue-400 animate-pulse">Polishing...</span>}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Make the opening hook 2x punchier and optimize for mobile scrolling')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  ⚡ Punchier Hook
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Add an engaging discussion question at the end to drive comments')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  💬 Stronger CTA
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Shorten the post by 25% while keeping key insights crisp')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  ✂️ Cut Fluff
                </button>
                <button
                  type="button"
                  disabled={isRefining}
                  onClick={() => onRefinePost('Format with cleaner bullet points and executive spacing')}
                  className="px-2 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-left transition cursor-pointer disabled:opacity-50"
                >
                  📋 Clean Bullets
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
                  placeholder="Custom polish instruction..."
                  className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
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
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Generated Image Section & Ratio/Size Controls */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Tailored Image (LinkedIn {data.image?.aspectRatio || '16:9'})
                </span>
                <button
                  type="button"
                  onClick={() => setShowImageTools(!showImageTools)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showImageTools ? 'Close' : 'Adjust Settings'}</span>
                </button>
              </div>

              {/* Image preview / error / loader */}
              {isRegeneratingImage ? (
                <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
                  <RotateCcw className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="text-xs text-slate-400">Rendering studio image with Gemini...</span>
                </div>
              ) : data.image?.url ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={data.image.url}
                    alt="LinkedIn graphic"
                    className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-blue-300 border border-blue-500/30">
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
                      download={`linkedin-post-${Date.now()}.png`}
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
                    className="text-xs text-blue-400 hover:underline font-semibold"
                  >
                    Generate LinkedIn Visual
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
                        <option value="4:3">4:3 Standard</option>
                        <option value="1:1">1:1 Square</option>
                        <option value="21:9">21:9 Ultrawide</option>
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
                      className="w-full text-xs bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isRegeneratingImage}
                    onClick={handleRegenImageClick}
                    className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRegeneratingImage ? 'animate-spin' : ''}`} />
                    <span>Regenerate LinkedIn Visual</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Realistic LinkedIn Feed Mockup */
          <div className="rounded-xl border border-slate-700/80 bg-white text-slate-900 shadow-xl overflow-hidden">
            {/* Post Header */}
            <div className="p-3.5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  OP
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-slate-900">Your Name</span>
                    <span className="text-[10px] text-slate-500">• 1st</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">Founder & Lead Strategist • 12,400 followers</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    Just now • <Globe className="w-2.5 h-2.5" />
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-3.5 pb-3 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {data.post}
              <div className="mt-2 text-blue-700 font-semibold flex flex-wrap gap-1">
                {data.hashtags.map((h, i) => (
                  <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
                ))}
              </div>
            </div>

            {/* Attached Media */}
            {data.image?.url && (
              <div className="border-t border-b border-slate-200 bg-slate-100">
                <img
                  src={data.image.url}
                  alt="LinkedIn feed attachment"
                  className="w-full max-h-72 object-cover object-center"
                />
              </div>
            )}

            {/* Reactions bar */}
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <span className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">👍</span>
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">💡</span>
                  <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">❤️</span>
                </span>
                <span className="ml-1">842</span>
              </div>
              <div>68 comments • 14 reposts</div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1.5 flex items-center justify-between text-xs text-slate-600 font-medium">
              <button className="flex-1 py-1.5 hover:bg-slate-100 rounded flex items-center justify-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Like</span>
              </button>
              <button className="flex-1 py-1.5 hover:bg-slate-100 rounded flex items-center justify-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>
              <button className="flex-1 py-1.5 hover:bg-slate-100 rounded flex items-center justify-center gap-1.5">
                <Repeat2 className="w-3.5 h-3.5" />
                <span>Repost</span>
              </button>
              <button className="flex-1 py-1.5 hover:bg-slate-100 rounded flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
