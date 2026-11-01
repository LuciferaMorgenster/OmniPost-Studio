import { AspectRatioType, CampaignData, ImageSizeType, ToneType } from '../types';

export interface ToneOption {
  id: ToneType;
  label: string;
  emoji: string;
  tagline: string;
  badgeColor: string;
  description: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'professional',
    label: 'Professional',
    emoji: '👔',
    tagline: 'Polished & Authoritative',
    badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    description: 'Executive presence, articulate industry framing, data-backed logic and formal clarity.',
  },
  {
    id: 'witty',
    label: 'Witty',
    emoji: '⚡',
    tagline: 'Sharp, Clever & Engaging',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    description: 'Playful metaphors, dry humor, unexpected hooks, and smart viral phrasing that hooks readers.',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    emoji: '🚨',
    tagline: 'High-Impact & Action-Oriented',
    badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    description: 'Direct call-to-action, time-sensitive framing, FOMO, and punchy immediate takeaways.',
  },
  {
    id: 'thought-leadership',
    label: 'Thought Leadership',
    emoji: '💡',
    tagline: 'Visionary & Deep Insight',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    description: 'Contrarian viewpoints, foundational frameworks, forward-looking macro perspective.',
  },
  {
    id: 'casual',
    label: 'Casual & Relatable',
    emoji: '☕',
    tagline: 'Warm & Conversational',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    description: 'Friendly peer-to-peer tone, honest backstage vulnerability, zero corporate jargon.',
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    emoji: '🚀',
    tagline: 'Motivational & Visionary',
    badgeColor: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    description: 'Hero journey framing, perseverance lessons, and empowering call-to-arms.',
  },
];

export const ASPECT_RATIOS: { value: AspectRatioType; label: string; description: string; bestFor: string }[] = [
  { value: '16:9', label: '16:9 Landscape', description: 'Classic widescreen card', bestFor: 'LinkedIn & Twitter/X' },
  { value: '1:1', label: '1:1 Square', description: 'Universal balanced square', bestFor: 'Instagram Feed & LinkedIn' },
  { value: '4:3', label: '4:3 Standard', description: 'Editorial photo ratio', bestFor: 'LinkedIn Articles & Twitter' },
  { value: '9:16', label: '9:16 Vertical', description: 'Full mobile story / reel', bestFor: 'Instagram Stories & Reels' },
  { value: '3:4', label: '3:4 Portrait', description: 'Mobile feed portrait', bestFor: 'Instagram & Pinterest' },
  { value: '2:3', label: '2:3 Vertical', description: 'Classic 35mm portrait', bestFor: 'Editorial Mobile' },
  { value: '3:2', label: '3:2 Landscape', description: 'Standard 35mm landscape', bestFor: 'Website & Twitter Cards' },
  { value: '21:9', label: '21:9 Ultrawide', description: 'Cinematic panorama banner', bestFor: 'Header Banners & Hero' },
];

export const IMAGE_SIZES: { value: ImageSizeType; label: string; resolution: string; badge: string }[] = [
  { value: '1K', label: '1K Standard', resolution: '1024 x 1024 approx', badge: 'Fast & Crisp' },
  { value: '2K', label: '2K High-Res', resolution: '2048 x 2048 approx', badge: 'High Quality' },
  { value: '4K', label: '4K Ultra Studio', resolution: '4096 x 4096 approx', badge: 'Maximum Fidelity' },
];

export const IMAGE_STYLES = [
  'Modern Minimalist Studio',
  'Editorial Photography',
  '3D Isometric Glassmorphism',
  'Vibrant Vector Illustration',
  'Cyberpunk Neon Cinematic',
  'Dark Mode Luxury Editorial',
  'Warm Indie Hand-Crafted',
];

export const IDEA_PRESETS = [
  {
    title: '🚀 Launching AI Agent Assistant',
    idea: 'We just launched Nova: an autonomous AI assistant that automates 70% of weekly repetitive admin tasks for creative freelancers without breaking their flow.',
    audience: 'Freelancers, agency founders, and remote workers',
    tone: 'witty' as ToneType,
    cta: 'Try free for 14 days or comment your biggest time sink',
  },
  {
    title: '💡 The Death of 10-Slide Pitch Decks',
    idea: 'Investors don\'t read 10-page decks anymore. They test interactive prototypes in 60 seconds. Why interactive proof of work beats polished promises in 2026.',
    audience: 'Startup founders, angel investors, and venture scouts',
    tone: 'thought-leadership' as ToneType,
    cta: 'What is your current view on pitch decks versus interactive MVPs?',
  },
  {
    title: '🚨 Zero-Day Security Notice & Migration',
    idea: 'Critical security update: We patched an industry-wide session vulnerability within 42 minutes. All customer tokens rotated safely with 99.99% uptime preserved.',
    audience: 'CTOs, DevOps engineers, and compliance teams',
    tone: 'urgent' as ToneType,
    cta: 'Review your audit logs and verify MFA status in dashboard',
  },
  {
    title: '☕ Why We Banned Friday Meetings',
    idea: 'Six months ago our engineering team banned all internal meetings on Fridays. Deep-work output doubled and developer retention hit 100%. Here is the exact playbook.',
    audience: 'Engineering managers, product leaders, and remote team leads',
    tone: 'professional' as ToneType,
    cta: 'Would your company survive a zero-meeting Friday rule?',
  },
];

// High quality initial sample campaign loaded on mount
export const INITIAL_SAMPLE_CAMPAIGN: CampaignData = {
  id: 'sample-campaign-001',
  timestamp: Date.now(),
  idea: 'We just launched Nova: an autonomous AI assistant that automates 70% of weekly repetitive admin tasks for creative freelancers without breaking their flow.',
  tone: 'witty',
  toneIntensity: 80,
  targetAudience: 'Freelancers, agency founders, and remote workers',
  callToAction: 'Try free for 14 days or comment your biggest time sink',
  strategySummary: 'Tailored with executive credibility on LinkedIn, razor-sharp viral humor on Twitter/X, and aesthetic lifestyle productivity vibes on Instagram.',
  linkedin: {
    headline: 'Freelancers spend 14 hours a week doing things they hate. We spent 9 months fixing that.',
    post: `Freelancers spend 14 hours a week doing things they hate. We spent 9 months fixing that.

When you started your independent career, you envisioned deep creative craft, autonomy, and choosing dream projects.

Instead, your calendar looks like this:
• 4 hours formatting invoices and chasing overdue receipts
• 5 hours manually copying briefs across three different project tools
• 5 hours drafting follow-up emails that should have been automatic

Today, we're launching Nova — the autonomous assistant engineered specifically for solo creators and boutique studios.

Key takeaways from our beta of 1,200 creators:
1. 73% reduction in weekly administrative overhead.
2. Zero context-switching: Nova operates natively inside your favorite workspace.
3. Automatic billing reconciliation with smart payment nudges that keep relationships warm.

The era of being your own underpaid executive assistant is officially over.

What is the single most soul-crushing administrative task on your weekly to-do list? Drop it below — let's see if Nova can obliterate it.`,
    keyTakeaways: [
      '73% reduction in weekly admin busywork',
      'Zero context switching across freelance workspaces',
      'Automated intelligent billing and cordial client reminders',
    ],
    hashtags: ['#FreelanceEconomy', '#FutureOfWork', '#ProductivityHacks', '#ArtificialIntelligence'],
    suggestedImagePrompt: 'Clean minimalist executive workspace with floating glowing holographic task interfaces, warm morning natural sunlight, high-end architectural studio design, 16:9 banner composition',
    characterCount: 1180,
    image: {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Clean minimalist executive workspace with floating glowing holographic task interfaces',
      aspectRatio: '16:9',
      size: '2K',
      model: 'gemini-3-pro-image-preview',
    },
  },
  twitter: {
    tweet: `You didn’t quit your 9-to-5 to become a full-time invoice formatter. 

Meet Nova: the autonomous AI assistant deleting 70% of freelancer admin busywork before your first cup of coffee.

14-day free trial live today. Let your craft breathe again. 👇`,
    thread: [
      `1/3 You didn’t quit your 9-to-5 to become a full-time invoice formatter. 

Meet Nova: the autonomous AI assistant deleting 70% of freelancer admin busywork before your first cup of coffee. 👇`,
      `2/3 What Nova automates in the background:
• Auto-reconciles invoices without awkward emails
• Syncs client briefs across your tools
• Drafts meeting notes & scopes in 1 click

1,200 beta testers reclaimed 14+ hours every single week.`,
      `3/3 Your craft is too valuable to waste on spreadsheet purgatory.

Try Nova free for 14 days (no credit card required). Link below. What's the 1 admin task you despise most?`,
    ],
    hashtags: ['#IndieHacker', '#BuildInPublic', '#AITools'],
    suggestedImagePrompt: 'Punchy high-contrast typography visual with neon turquoise and matte charcoal accents, showing a split screen of chaos vs tranquility',
    characterCount: 247,
    image: {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      prompt: 'Punchy high-contrast typography visual with neon turquoise and matte charcoal accents',
      aspectRatio: '16:9',
      size: '2K',
      model: 'gemini-3-pro-image-preview',
    },
  },
  instagram: {
    hook: 'Confession: 40% of your freelance week is completely stolen by admin chaos. 🛑',
    caption: `Confession: 40% of your freelance week is completely stolen by admin chaos. 🛑

You didn't take the leap into independent work to spend Tuesday afternoons formatting PDF receipts and agonizing over follow-up emails.

✨ Meet Nova — your invisible studio manager.

While you focus on designing, writing, and building:
▫️ Invoices are tracked & politely nudged
▫️ Project milestones stay synced
▫️ Client scopes draft themselves in seconds

Our early cohort saved an average of 14 hours every single week. That's almost two full working days back in your hands.

Hit the link in bio to claim your 14-day trial. 

Save this post so you remember to stop doing admin by hand this weekend! 📌`,
    callToAction: 'Tap link in bio to claim your 14-day pass & save this post for later 📌',
    hashtags: [
      '#freelancelife',
      '#solopreneur',
      '#creativestudio',
      '#workfromanywhere',
      '#productivitytips',
      '#designlife',
      '#agencyowner',
      '#indiecreator',
      '#futureofwork',
      '#digitalnomadlife',
      '#smarttools',
      '#entrepreneurmindset',
      '#desksetup',
      '#workspacegoals',
    ],
    suggestedImagePrompt: 'Warm aesthetic Scandinavian studio desk with artisan ceramic coffee mug, sleek laptop displaying luminous creative workflow UI, soft afternoon shadows, square composition',
    characterCount: 684,
    image: {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
      prompt: 'Warm aesthetic Scandinavian studio desk with artisan ceramic coffee mug and sleek laptop',
      aspectRatio: '1:1',
      size: '2K',
      model: 'gemini-3-pro-image-preview',
    },
  },
};
