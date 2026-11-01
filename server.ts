import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI server-side client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Helper for image generation with graceful fallback
async function generatePlatformImage(
  ai: GoogleGenAI,
  prompt: string,
  aspectRatio: string = '1:1',
  imageSize: string = '1K',
  modelPreference: string = 'gemini-3-pro-image-preview',
  style: string = 'Modern Minimalist'
): Promise<{ imageUrl: string; modelUsed: string }> {
  const enhancedPrompt = `${prompt}. Style: ${style}, high aesthetic quality, clean lighting, professional social media editorial composition, crisp focus, no watermarks, no distorted artifacts.`;

  // Models to attempt in order
  const modelsToTry = [
    modelPreference || 'gemini-3-pro-image-preview',
    'gemini-nano-banana-2.1',
    'gemini-3.1-flash-lite-image',
  ];

  // Filter unique
  const candidates = Array.from(new Set(modelsToTry));

  let lastError: any = null;

  for (const model of candidates) {
    try {
      console.log(`[ImageGen] Trying model: ${model} with ratio: ${aspectRatio}, size: ${imageSize}`);
      
      const config: any = {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
        },
      };

      // imageSize is supported on gemini-3-pro-image-preview and gemini-nano-banana-2.1
      if (model !== 'gemini-3.1-flash-lite-image' && (imageSize === '1K' || imageSize === '2K' || imageSize === '4K')) {
        config.imageConfig.imageSize = imageSize;
      }

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config,
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          return {
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
            modelUsed: model,
          };
        }
      }
    } catch (err: any) {
      console.warn(`[ImageGen] Failed with model ${model}:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(`Failed to generate image across models: ${lastError?.message || 'Unknown error'}`);
}

// 1. Generate Posts for LinkedIn, Twitter/X, and Instagram simultaneously
app.post('/api/generate-posts', async (req: Request, res: Response) => {
  try {
    const {
      idea,
      tone = 'professional',
      toneIntensity = 75,
      targetAudience = 'Professionals, tech enthusiasts & industry creators',
      callToAction = 'Share your thoughts',
      generateImages = true,
      imageSettings = {},
      textModel = 'gemini-3.8-flash',
    } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide an idea or topic to generate content for.' });
    }

    const ai = getAiClient();

    const systemInstruction = `You are a world-class social media strategist and multi-platform copywriter.
You will receive an idea, a tone, a target audience, and preferred CTA.
You must simultaneously generate 3 tailored versions of the content:
1. LinkedIn (long-form thought leadership):
   - Scroll-stopping opening hook (bold, compelling, first 2 lines determine clicks).
   - Structured readability with short paragraphs (1-2 sentences max per paragraph).
   - 3-5 bulleted key takeaways or actionable lessons.
   - Genuine discussion question or call-to-action.
   - 3-5 high-relevance professional hashtags (#).
   - Optimal character length: 1,000 to 2,000 characters.
   - A descriptive, visually striking image prompt tailored for a corporate/editorial visual at 16:9 aspect ratio.

2. Twitter / X (short & punchy):
   - Hook-driven single tweet under 270 characters (vital: strict character limit compliance).
   - Also provide a 3-part thread (numbered: 1/3, 2/3, 3/3) expanding on the core insight.
   - Punchy, high-signal, zero fluff.
   - 2-3 focused hashtags.
   - A descriptive, high-contrast image prompt tailored for a viral feed visual at 16:9 aspect ratio.

3. Instagram (visual-focused with rich hashtags):
   - Visually engaging caption: compelling hook in the first sentence before the fold (under 120 chars).
   - Relatable, human storytelling with aesthetic spacing (clean line breaks).
   - Strong interactive CTA (e.g. "Save this for later", "Drop your thoughts in comments", "Link in bio").
   - Categorized hashtags array with 15-20 curated tags (niche + industry + trending).
   - A descriptive, aesthetically pleasing image prompt tailored for Instagram aesthetic at 1:1 square aspect ratio.

Tone instructions: The user requested tone "${tone}" with intensity ${toneIntensity}%. Infuse this tone deeply and naturally without sounding gimmicky.
Return purely valid JSON matching the specified structure without markdown wrappers if possible.`;

    const prompt = `Idea / Topic:
"${idea.trim()}"

Tone: ${tone} (Intensity: ${toneIntensity}%)
Target Audience: ${targetAudience}
Key Call To Action: ${callToAction}

Generate the complete JSON object with the following exact keys:
{
  "linkedin": {
    "headline": "Hook / Headline for the post",
    "post": "Full long-form formatted post content with line breaks",
    "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3"],
    "suggestedImagePrompt": "Visual concept prompt for AI image generator",
    "characterCount": 1200
  },
  "twitter": {
    "tweet": "Single punchy standalone tweet under 270 chars",
    "thread": [
      "1/3 Hook + core premise...",
      "2/3 Main insight or lesson...",
      "3/3 Conclusion + takeaway + CTA"
    ],
    "hashtags": ["#Tech", "#Strategy"],
    "suggestedImagePrompt": "Visual concept prompt for AI image generator",
    "characterCount": 240
  },
  "instagram": {
    "hook": "Eye-catching first line",
    "caption": "Full aesthetic caption with formatted spacing",
    "callToAction": "Save this post & share with a colleague",
    "hashtags": ["#marketing", "#socialmedia", "...up to 15-20 tags"],
    "suggestedImagePrompt": "Visual concept prompt for AI image generator",
    "characterCount": 650
  },
  "strategySummary": "One-sentence marketing rationale behind how the tone and angle were adapted for each platform."
}`;

    console.log(`[TextGen] Generating social posts with model: ${textModel || 'gemini-3.8-flash'}`);

    const textResponse = await ai.models.generateContent({
      model: textModel === 'gemini-4-argon' ? 'gemini-4-argon' : 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const rawText = textResponse.text || '{}';
    let generatedData: any;
    try {
      generatedData = JSON.parse(rawText);
    } catch {
      // Cleanup backticks if any
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      generatedData = JSON.parse(cleaned);
    }

    // Fix character counts
    if (generatedData.linkedin) {
      generatedData.linkedin.characterCount = generatedData.linkedin.post?.length || 0;
    }
    if (generatedData.twitter) {
      generatedData.twitter.characterCount = generatedData.twitter.tweet?.length || 0;
    }
    if (generatedData.instagram) {
      generatedData.instagram.characterCount = generatedData.instagram.caption?.length || 0;
    }

    // If generateImages is requested, simultaneously generate tailored images for each platform
    if (generateImages) {
      const imgModel = imageSettings.model || 'gemini-3-pro-image-preview';
      const imgSize = imageSettings.imageSize || '1K';
      const imgStyle = imageSettings.style || 'Modern Minimalist';

      const linkedinRatio = imageSettings.linkedin?.aspectRatio || '16:9';
      const twitterRatio = imageSettings.twitter?.aspectRatio || '16:9';
      const instagramRatio = imageSettings.instagram?.aspectRatio || '1:1';

      console.log(`[ImageGen] Starting parallel image generation for LinkedIn (${linkedinRatio}), Twitter (${twitterRatio}), Instagram (${instagramRatio}) with model ${imgModel}`);

      const [liImgResult, twImgResult, igImgResult] = await Promise.allSettled([
        generatePlatformImage(
          ai,
          generatedData.linkedin?.suggestedImagePrompt || `Professional executive graphic for: ${idea}`,
          linkedinRatio,
          imgSize,
          imgModel,
          imgStyle
        ),
        generatePlatformImage(
          ai,
          generatedData.twitter?.suggestedImagePrompt || `Bold eye-catching visual for: ${idea}`,
          twitterRatio,
          imgSize,
          imgModel,
          imgStyle
        ),
        generatePlatformImage(
          ai,
          generatedData.instagram?.suggestedImagePrompt || `Aesthetic lifestyle editorial visual for: ${idea}`,
          instagramRatio,
          imgSize,
          imgModel,
          imgStyle
        ),
      ]);

      if (generatedData.linkedin) {
        if (liImgResult.status === 'fulfilled') {
          generatedData.linkedin.image = {
            url: liImgResult.value.imageUrl,
            prompt: generatedData.linkedin.suggestedImagePrompt,
            aspectRatio: linkedinRatio,
            size: imgSize,
            model: liImgResult.value.modelUsed,
          };
        } else {
          console.error('[ImageGen] LinkedIn image error:', liImgResult.reason);
          generatedData.linkedin.imageError = liImgResult.reason?.message || 'Image generation failed';
        }
      }

      if (generatedData.twitter) {
        if (twImgResult.status === 'fulfilled') {
          generatedData.twitter.image = {
            url: twImgResult.value.imageUrl,
            prompt: generatedData.twitter.suggestedImagePrompt,
            aspectRatio: twitterRatio,
            size: imgSize,
            model: twImgResult.value.modelUsed,
          };
        } else {
          console.error('[ImageGen] Twitter image error:', twImgResult.reason);
          generatedData.twitter.imageError = twImgResult.reason?.message || 'Image generation failed';
        }
      }

      if (generatedData.instagram) {
        if (igImgResult.status === 'fulfilled') {
          generatedData.instagram.image = {
            url: igImgResult.value.imageUrl,
            prompt: generatedData.instagram.suggestedImagePrompt,
            aspectRatio: instagramRatio,
            size: imgSize,
            model: igImgResult.value.modelUsed,
          };
        } else {
          console.error('[ImageGen] Instagram image error:', igImgResult.reason);
          generatedData.instagram.imageError = igImgResult.reason?.message || 'Image generation failed';
        }
      }
    }

    return res.json({
      success: true,
      data: generatedData,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-posts:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate social media content',
      details: error.toString(),
    });
  }
});

// 2. Dedicated Single Image Generation / Regeneration Endpoint
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      style = 'Modern Minimalist',
      platform = 'custom',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAiClient();
    const result = await generatePlatformImage(ai, prompt, aspectRatio, imageSize, model, style);

    return res.json({
      success: true,
      imageUrl: result.imageUrl,
      modelUsed: result.modelUsed,
      aspectRatio,
      imageSize,
      platform,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate image',
      details: error.toString(),
    });
  }
});

// 3. Post Refinement endpoint (Shorten, change tone, fix CTA, translate, punch up)
app.post('/api/refine-post', async (req: Request, res: Response) => {
  try {
    const {
      platform,
      currentText,
      instruction,
      tone,
    } = req.body;

    if (!currentText || !instruction) {
      return res.status(400).json({ error: 'Current text and instruction are required' });
    }

    const ai = getAiClient();

    const prompt = `You are a social media copy editor specialized in ${platform}.
Current Post Text:
"""
${currentText}
"""

Target Tone: ${tone || 'authentic and engaging'}
Instruction: ${instruction}

Platform specifics:
- LinkedIn: professional readability, spaced line breaks, actionable takeaways, engaging CTA.
- Twitter: strict brevity, under 280 characters if single tweet, high punchiness, strong hook.
- Instagram: visual storytelling, hook before line 125, clean spacing, interactive CTA.

Return JSON in this format:
{
  "refinedText": "The improved post text",
  "summaryOfChanges": "Brief note on what was changed"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '{}';
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      data = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
    }

    return res.json({
      success: true,
      refinedText: data.refinedText || currentText,
      summaryOfChanges: data.summaryOfChanges || 'Refined post successfully',
    });
  } catch (error: any) {
    console.error('Error in /api/refine-post:', error);
    return res.status(500).json({
      error: error.message || 'Failed to refine post',
    });
  }
});

// 4. Quick Headline / Hook Variations generator
app.post('/api/generate-hooks', async (req: Request, res: Response) => {
  try {
    const { idea, platform, tone } = req.body;
    if (!idea) return res.status(400).json({ error: 'Idea is required' });

    const ai = getAiClient();
    const prompt = `Generate 5 alternative high-converting opening hooks for a ${platform} post about: "${idea}". Tone: ${tone}.
Return JSON:
{
  "hooks": [
    { "type": "Contrarian / Hot Take", "text": "..." },
    { "type": "Data / Statistic", "text": "..." },
    { "type": "Personal Story / Vulnerability", "text": "..." },
    { "type": "How-To / Framework", "text": "..." },
    { "type": "Urgent Curiosity Gap", "text": "..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{"hooks":[]}');
    return res.json({ success: true, hooks: parsed.hooks || [] });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Development vs Production serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniPost Server] Running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
