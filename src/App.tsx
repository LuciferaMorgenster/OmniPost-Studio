import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IdeaInputPanel } from './components/IdeaInputPanel';
import { LinkedInCard } from './components/LinkedInCard';
import { TwitterCard } from './components/TwitterCard';
import { InstagramCard } from './components/InstagramCard';
import { ImageModal } from './components/ImageModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HookLabModal } from './components/HookLabModal';
import {
  AspectRatioType,
  CampaignData,
  GeneratedImage,
  ImageGenerationSettings,
  ImageSizeType,
  PlatformKey,
  TextModelType,
  ToneType,
} from './types';
import { INITIAL_SAMPLE_CAMPAIGN, TONE_OPTIONS } from './data/presets';
import {
  Sparkles,
  Layers,
  Wand2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';

export default function App() {
  // Input form state
  const [idea, setIdea] = useState(
    'We just launched Nova: an autonomous AI assistant that automates 70% of weekly repetitive admin tasks for creative freelancers without breaking their flow.'
  );
  const [tone, setTone] = useState<ToneType | string>('witty');
  const [toneIntensity, setToneIntensity] = useState<number>(80);
  const [targetAudience, setTargetAudience] = useState(
    'Freelancers, agency founders, and remote workers'
  );
  const [callToAction, setCallToAction] = useState(
    'Try free for 14 days or comment your biggest time sink'
  );
  const [generateImages, setGenerateImages] = useState<boolean>(true);
  const [textModel, setTextModel] = useState<TextModelType>('gemini-3.8-flash');

  // Image Settings (1K, 2K, 4K & customizable aspect ratios)
  const [imageSettings, setImageSettings] = useState<ImageGenerationSettings>({
    model: 'gemini-3-pro-image-preview',
    imageSize: '2K',
    style: 'Modern Minimalist Studio',
    linkedin: {
      aspectRatio: '16:9',
    },
    twitter: {
      aspectRatio: '16:9',
    },
    instagram: {
      aspectRatio: '1:1',
    },
  });

  // Active campaign & History
  const [activeCampaign, setActiveCampaign] = useState<CampaignData>(INITIAL_SAMPLE_CAMPAIGN);
  const [campaignHistory, setCampaignHistory] = useState<CampaignData[]>([]);

  // Loading states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [refiningPlatform, setRefiningPlatform] = useState<PlatformKey | null>(null);
  const [regenImgPlatform, setRegenImgPlatform] = useState<PlatformKey | null>(null);

  // Modals & Drawers
  const [modalImage, setModalImage] = useState<GeneratedImage | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isHookLabOpen, setIsHookLabOpen] = useState<boolean>(false);
  const [hookLabPlatform, setHookLabPlatform] = useState<PlatformKey>('linkedin');

  // UI Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omnipost_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCampaignHistory(parsed);
        } else {
          setCampaignHistory([INITIAL_SAMPLE_CAMPAIGN]);
        }
      } else {
        setCampaignHistory([INITIAL_SAMPLE_CAMPAIGN]);
      }
    } catch (e) {
      console.warn('Could not load history from localStorage', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save to history helper
  const saveCampaignToHistory = (newCampaign: CampaignData) => {
    setCampaignHistory((prev) => {
      const updated = [newCampaign, ...prev.filter((c) => c.id !== newCampaign.id)].slice(0, 20);
      try {
        localStorage.setItem('omnipost_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save to localStorage', e);
      }
      return updated;
    });
  };

  // Generate All Posts
  const handleGenerateCampaign = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          tone,
          toneIntensity,
          targetAudience,
          callToAction,
          generateImages,
          imageSettings,
          textModel,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Server returned an error');
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const newCamp: CampaignData = {
          id: `camp-${Date.now()}`,
          timestamp: Date.now(),
          idea,
          tone,
          toneIntensity,
          targetAudience,
          callToAction,
          strategySummary: resData.data.strategySummary,
          linkedin: resData.data.linkedin,
          twitter: resData.data.twitter,
          instagram: resData.data.instagram,
        };

        setActiveCampaign(newCamp);
        saveCampaignToHistory(newCamp);
        showToast('Campaign successfully generated for LinkedIn, Twitter, and Instagram!');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast(`Error: ${err.message || 'Generation failed'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate single image
  const handleRegenerateImage = async (
    platform: PlatformKey,
    prompt: string,
    aspectRatio: AspectRatioType,
    size: ImageSizeType
  ) => {
    setRegenImgPlatform(platform);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageSize: size,
          model: imageSettings.model,
          style: imageSettings.style,
          platform,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to render image');
      }

      const updatedImg: GeneratedImage = {
        url: data.imageUrl,
        prompt,
        aspectRatio,
        size,
        model: data.modelUsed,
      };

      setActiveCampaign((prev) => {
        const next = {
          ...prev,
          [platform]: {
            ...prev[platform],
            image: updatedImg,
            imageError: undefined,
          },
        };
        saveCampaignToHistory(next);
        return next;
      });

      showToast(`Refreshed ${platform} image at ${aspectRatio} (${size})`);
    } catch (err: any) {
      console.error(`Regenerate image failed for ${platform}:`, err);
      showToast(`Image Error: ${err.message || 'Image generation failed'}`);
    } finally {
      setRegenImgPlatform(null);
    }
  };

  // Refine single post
  const handleRefinePost = async (platform: PlatformKey, instruction: string) => {
    setRefiningPlatform(platform);
    try {
      let currentText = '';
      if (platform === 'linkedin') currentText = activeCampaign.linkedin.post;
      else if (platform === 'twitter') currentText = activeCampaign.twitter.tweet;
      else if (platform === 'instagram') currentText = activeCampaign.instagram.caption;

      const res = await fetch('/api/refine-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          currentText,
          instruction,
          tone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine post');
      }

      setActiveCampaign((prev) => {
        let updatedPlatformData: any;
        if (platform === 'linkedin') {
          updatedPlatformData = {
            ...prev.linkedin,
            post: data.refinedText,
            characterCount: data.refinedText.length,
          };
        } else if (platform === 'twitter') {
          updatedPlatformData = {
            ...prev.twitter,
            tweet: data.refinedText,
            characterCount: data.refinedText.length,
          };
        } else {
          updatedPlatformData = {
            ...prev.instagram,
            caption: data.refinedText,
            characterCount: data.refinedText.length,
          };
        }

        const next = {
          ...prev,
          [platform]: updatedPlatformData,
        };
        saveCampaignToHistory(next);
        return next;
      });

      showToast(`Refined ${platform} post: ${data.summaryOfChanges || 'Applied update'}`);
    } catch (err: any) {
      showToast(`Refine error: ${err.message}`);
    } finally {
      setRefiningPlatform(null);
    }
  };

  // Copy All Drafts
  const handleCopyAll = () => {
    if (!activeCampaign) return;
    const bundle = `=============================
LINKEDIN DRAFT
=============================
Headline: ${activeCampaign.linkedin.headline}

${activeCampaign.linkedin.post}

Hashtags: ${activeCampaign.linkedin.hashtags.join(' ')}

=============================
TWITTER / 𝕏 DRAFT
=============================
Single Tweet:
${activeCampaign.twitter.tweet}

Thread Breakdown:
${activeCampaign.twitter.thread.join('\n\n')}

Hashtags: ${activeCampaign.twitter.hashtags.join(' ')}

=============================
INSTAGRAM DRAFT
=============================
Hook: ${activeCampaign.instagram.hook}

${activeCampaign.instagram.caption}

CTA: ${activeCampaign.instagram.callToAction}

Hashtags:
${activeCampaign.instagram.hashtags.join(' ')}
`;

    navigator.clipboard.writeText(bundle);
    setCopiedAll(true);
    showToast('Copied all 3 tailored platform drafts to clipboard!');
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Export as Markdown file
  const handleExportMarkdown = () => {
    if (!activeCampaign) return;
    const md = `# Social Media Multi-Platform Campaign
Generated via OmniPost Studio with Gemini AI
Date: ${new Date(activeCampaign.timestamp).toLocaleString()}
Tone: ${activeCampaign.tone} (${activeCampaign.toneIntensity}%)
Target Audience: ${activeCampaign.targetAudience}

## Core Idea
> "${activeCampaign.idea}"

${activeCampaign.strategySummary ? `### Strategy Rationale\n${activeCampaign.strategySummary}\n` : ''}

---

## 1. LinkedIn (Long-Form Thought Leadership)
**Headline:** ${activeCampaign.linkedin.headline}

${activeCampaign.linkedin.post}

**Key Takeaways:**
${activeCampaign.linkedin.keyTakeaways?.map((t) => `- ${t}`).join('\n')}

**Hashtags:**
${activeCampaign.linkedin.hashtags.join(' ')}

**Image Prompt (${activeCampaign.linkedin.image?.aspectRatio || '16:9'} • ${activeCampaign.linkedin.image?.size || '2K'}):**
\`${activeCampaign.linkedin.suggestedImagePrompt}\`

---

## 2. Twitter / 𝕏 (Short & Punchy)
### Standalone Tweet (${activeCampaign.twitter.tweet.length}/280 chars)
${activeCampaign.twitter.tweet}

### Multi-Tweet Thread
${activeCampaign.twitter.thread?.map((tw, i) => `#### Tweet ${i + 1}\n${tw}`).join('\n\n')}

**Hashtags:**
${activeCampaign.twitter.hashtags.join(' ')}

**Image Prompt (${activeCampaign.twitter.image?.aspectRatio || '16:9'} • ${activeCampaign.twitter.image?.size || '2K'}):**
\`${activeCampaign.twitter.suggestedImagePrompt}\`

---

## 3. Instagram (Visual & Storytelling)
**Hook Line:** ${activeCampaign.instagram.hook}

${activeCampaign.instagram.caption}

**Call To Action:**
${activeCampaign.instagram.callToAction}

**Hashtag Cluster:**
${activeCampaign.instagram.hashtags.join(' ')}

**Image Prompt (${activeCampaign.instagram.image?.aspectRatio || '1:1'} • ${activeCampaign.instagram.image?.size || '2K'}):**
\`${activeCampaign.instagram.suggestedImagePrompt}\`
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omnipost-campaign-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded campaign markdown file!');
  };

  // Open Hook Lab for platform
  const openHookLab = (platform: PlatformKey) => {
    setHookLabPlatform(platform);
    setIsHookLabOpen(true);
  };

  const handleApplyHook = (hookText: string) => {
    if (hookLabPlatform === 'linkedin') {
      setActiveCampaign((prev) => ({
        ...prev,
        linkedin: {
          ...prev.linkedin,
          headline: hookText,
        },
      }));
    } else if (hookLabPlatform === 'twitter') {
      setActiveCampaign((prev) => ({
        ...prev,
        twitter: {
          ...prev.twitter,
          tweet: `${hookText}\n\n${prev.twitter.tweet.split('\n\n').slice(1).join('\n\n')}`,
        },
      }));
    } else {
      setActiveCampaign((prev) => ({
        ...prev,
        instagram: {
          ...prev.instagram,
          hook: hookText,
          caption: `${hookText}\n\n${prev.instagram.caption.split('\n\n').slice(1).join('\n\n')}`,
        },
      }));
    }
    showToast(`Applied viral hook to ${hookLabPlatform}!`);
  };

  const activeToneObj = TONE_OPTIONS.find((t) => t.id === activeCampaign.tone);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        campaign={activeCampaign}
        historyCount={campaignHistory.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportMarkdown={handleExportMarkdown}
        onCopyAll={handleCopyAll}
        copiedAll={copiedAll}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Studio Controller (Idea & Tone Input Panel) */}
        <section>
          <IdeaInputPanel
            idea={idea}
            setIdea={setIdea}
            tone={tone}
            setTone={setTone}
            toneIntensity={toneIntensity}
            setToneIntensity={setToneIntensity}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            callToAction={callToAction}
            setCallToAction={setCallToAction}
            generateImages={generateImages}
            setGenerateImages={setGenerateImages}
            imageSettings={imageSettings}
            setImageSettings={setImageSettings}
            textModel={textModel}
            setTextModel={setTextModel}
            onGenerate={handleGenerateCampaign}
            isGenerating={isGenerating}
          />
        </section>

        {/* Strategy Context Banner & Hook Lab trigger */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Current Campaign Strategy</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Tone: {activeToneObj?.label || activeCampaign.tone} ({activeCampaign.toneIntensity}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-2xl">
                {activeCampaign.strategySummary ||
                  'Content dynamically adapted for long-form LinkedIn readers, viral Twitter feeds, and aesthetic Instagram audiences.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openHookLab('linkedin')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Hook Lab</span>
            </button>
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy All Drafts</span>
            </button>
          </div>
        </section>

        {/* 3-Column Studio Grid: LinkedIn, Twitter/X, Instagram */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* LinkedIn Column */}
          <div className="flex flex-col h-full">
            <LinkedInCard
              data={activeCampaign.linkedin}
              onUpdate={(updated) =>
                setActiveCampaign((prev) => ({
                  ...prev,
                  linkedin: { ...prev.linkedin, ...updated },
                }))
              }
              onRegenerateImage={(prompt, ratio, size) =>
                handleRegenerateImage('linkedin', prompt, ratio, size)
              }
              onRefinePost={(instruction) => handleRefinePost('linkedin', instruction)}
              onOpenImageModal={(img) => setModalImage(img)}
              isRefining={refiningPlatform === 'linkedin'}
              isRegeneratingImage={regenImgPlatform === 'linkedin'}
            />
          </div>

          {/* Twitter / X Column */}
          <div className="flex flex-col h-full">
            <TwitterCard
              data={activeCampaign.twitter}
              onUpdate={(updated) =>
                setActiveCampaign((prev) => ({
                  ...prev,
                  twitter: { ...prev.twitter, ...updated },
                }))
              }
              onRegenerateImage={(prompt, ratio, size) =>
                handleRegenerateImage('twitter', prompt, ratio, size)
              }
              onRefinePost={(instruction) => handleRefinePost('twitter', instruction)}
              onOpenImageModal={(img) => setModalImage(img)}
              isRefining={refiningPlatform === 'twitter'}
              isRegeneratingImage={regenImgPlatform === 'twitter'}
            />
          </div>

          {/* Instagram Column */}
          <div className="flex flex-col h-full">
            <InstagramCard
              data={activeCampaign.instagram}
              onUpdate={(updated) =>
                setActiveCampaign((prev) => ({
                  ...prev,
                  instagram: { ...prev.instagram, ...updated },
                }))
              }
              onRegenerateImage={(prompt, ratio, size) =>
                handleRegenerateImage('instagram', prompt, ratio, size)
              }
              onRefinePost={(instruction) => handleRefinePost('instagram', instruction)}
              onOpenImageModal={(img) => setModalImage(img)}
              isRefining={refiningPlatform === 'instagram'}
              isRegeneratingImage={regenImgPlatform === 'instagram'}
            />
          </div>
        </section>
      </main>

      {/* Full-res Image Modal Lightbox */}
      <ImageModal image={modalImage} onClose={() => setModalImage(null)} />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        campaigns={campaignHistory}
        onSelectCampaign={(c) => {
          setActiveCampaign(c);
          setIdea(c.idea);
          setTone(c.tone);
          setToneIntensity(c.toneIntensity);
          setTargetAudience(c.targetAudience);
          setCallToAction(c.callToAction);
          showToast('Loaded campaign into workspace!');
        }}
        onDeleteCampaign={(id) => {
          setCampaignHistory((prev) => {
            const next = prev.filter((c) => c.id !== id);
            localStorage.setItem('omnipost_history', JSON.stringify(next));
            return next;
          });
        }}
        onClearAll={() => {
          setCampaignHistory([]);
          localStorage.removeItem('omnipost_history');
          showToast('Cleared campaign history');
        }}
      />

      {/* Viral Hook Lab Modal */}
      <HookLabModal
        isOpen={isHookLabOpen}
        onClose={() => setIsHookLabOpen(false)}
        idea={idea}
        tone={String(tone)}
        platform={hookLabPlatform}
        onApplyHook={handleApplyHook}
      />
    </div>
  );
}
