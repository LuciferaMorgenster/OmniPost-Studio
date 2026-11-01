export type PlatformKey = 'linkedin' | 'twitter' | 'instagram';

export type ToneType = 
  | 'professional'
  | 'witty'
  | 'urgent'
  | 'thought-leadership'
  | 'casual'
  | 'inspirational';

export type AspectRatioType = 
  | '1:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '9:16'
  | '16:9'
  | '21:9';

export type ImageSizeType = '1K' | '2K' | '4K';

export type ImageModelType = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type TextModelType = 'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite';

export interface GeneratedImage {
  url: string;
  prompt: string;
  aspectRatio: AspectRatioType;
  size: ImageSizeType;
  model: string;
}

export interface LinkedInPostData {
  headline: string;
  post: string;
  keyTakeaways: string[];
  hashtags: string[];
  suggestedImagePrompt: string;
  characterCount: number;
  image?: GeneratedImage;
  imageError?: string;
}

export interface TwitterPostData {
  tweet: string;
  thread: string[];
  hashtags: string[];
  suggestedImagePrompt: string;
  characterCount: number;
  image?: GeneratedImage;
  imageError?: string;
}

export interface InstagramPostData {
  hook: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
  suggestedImagePrompt: string;
  characterCount: number;
  image?: GeneratedImage;
  imageError?: string;
}

export interface CampaignData {
  id: string;
  timestamp: number;
  idea: string;
  tone: ToneType | string;
  toneIntensity: number;
  targetAudience: string;
  callToAction: string;
  strategySummary?: string;
  linkedin: LinkedInPostData;
  twitter: TwitterPostData;
  instagram: InstagramPostData;
}

export interface ImageGenerationSettings {
  model: ImageModelType;
  imageSize: ImageSizeType;
  style: string;
  linkedin: {
    aspectRatio: AspectRatioType;
  };
  twitter: {
    aspectRatio: AspectRatioType;
  };
  instagram: {
    aspectRatio: AspectRatioType;
  };
}
