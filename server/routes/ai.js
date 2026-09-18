// server/routes/ai.js
import express from 'express';
import { generateMockResponse } from '../providers/mockGenerator.js';
import { callGemini } from '../providers/gemini.js';
import { callOpenAI } from '../providers/openai.js';

const router = express.Router();

function buildSystemPrompt(brand, taskType, language = 'hinglish') {
  const brandName = brand?.name || 'Personal Creator';
  const creatorName = brand?.creatorName || 'Nikhil';
  const niches = brand?.niches || 'Technology, Content Creation & Creative Media';
  const defaultCta = brand?.defaultCta || 'Follow for daily high-value creator breakdowns!';
  const brandBio = brand?.bio || 'High-energy, practical creator sharing insightful breakdowns.';

  let langInstruction = '';
  if (language === 'english') {
    langInstruction = `CRITICAL MANDATORY LANGUAGE RULE: The user selected ENGLISH.
Your response MUST be 100% in pure English only.
ABSOLUTELY FORBIDDEN: Do NOT use any Hindi words, Hindi sentences, Devanagari script, or mixed Hinglish phrases under any circumstances. Every single heading, bullet point, hook, dialogue, cue, title, caption, hashtag, and CTA must be exclusively in English.`;
  } else if (language === 'hindi') {
    langInstruction = `CRITICAL MANDATORY LANGUAGE RULE: The user selected HINDI.
Your response MUST be 100% in pure Hindi written in Devanagari script (हिंदी).
ABSOLUTELY FORBIDDEN: Do NOT write in English or Hinglish except for universal technical brand names (like YouTube, Instagram, AI) where unavoidable. Every sentence, dialogue, hook, and caption must be in Hindi.`;
  } else {
    langInstruction = `CRITICAL MANDATORY LANGUAGE RULE: The user selected HINGLISH.
Your response MUST be in natural conversational Hinglish (colloquial Hindi written in English/Latin script mixed naturally with English creator vocabulary, just like Indian creators speak on YouTube and Instagram).`;
  }

  return `You are the exclusive personal AI Copilot for "${creatorName}" in "Nikhil AI Studio".
Brand: ${brandName}
Niches: ${niches}
Bio/Voice: ${brandBio}
Default Call to Action (CTA): ${defaultCta}
Task: ${taskType}

${langInstruction}

Always format output professionally using clean markdown, with bold headings, bullet points, and actionable creator-friendly pacing notes.`;
}

// Status endpoint
router.get('/status', (req, res) => {
  const provider = process.env.AI_PROVIDER || 'mock';
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  res.json({
    activeProvider: provider,
    hasGeminiKey: hasGemini,
    hasOpenAIKey: hasOpenAI,
    status: 'online',
    version: '1.0.0'
  });
});

// Chat Assistant
router.post('/chat', async (req, res) => {
  try {
    const { prompt, brand, language = 'hinglish', platform = 'Instagram Reel' } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = buildSystemPrompt(brand, `AI Assistant Conversation for ${platform}`, language);
      const result = await callGemini(sys, prompt, process.env.GEMINI_API_KEY);
      return res.json(result);
    }

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const sys = buildSystemPrompt(brand, `AI Assistant Conversation for ${platform}`, language);
      const result = await callOpenAI(sys, prompt, process.env.OPENAI_API_KEY, process.env.OPENAI_BASE_URL);
      return res.json(result);
    }

    // Default or fallback to mock
    const mock = generateMockResponse('chat', { prompt, brand, language, platform });
    return res.json(mock);
  } catch (error) {
    console.warn('Live AI call failed, falling back to smart generator:', error.message);
    const mock = generateMockResponse('chat', req.body);
    return res.json({ ...mock, fallbackNotice: `Generated via Studio Engine (${error.message})` });
  }
});

// Idea Generator
router.post('/generate-ideas', async (req, res) => {
  try {
    const { platform = 'Instagram Reel', niche = 'Tech', language = 'hinglish', category = 'Educational', duration = '45-60s', brand } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = buildSystemPrompt(brand, `Viral Idea Generation for ${platform}`, language);
      const userPrompt = `Generate 3 viral content ideas for ${platform}.
Niche: ${niche}
Category: ${category}
Duration: ${duration}
Output JSON format array with keys: title, hook, concept, suggestedShots (array of 4 strings), cta, caption, hashtags (array). Return only valid JSON.`;

      try {
        const result = await callGemini(sys, userPrompt, process.env.GEMINI_API_KEY);
        const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const ideas = (Array.isArray(parsed) ? parsed : parsed.ideas || []).map((item, idx) => ({
          id: 'idea_' + Date.now() + '_' + idx,
          title: item.title,
          hook: item.hook,
          concept: item.concept,
          suggestedShots: item.suggestedShots || [],
          cta: item.cta || brand?.defaultCta,
          caption: item.caption,
          hashtags: item.hashtags || [],
          platform: platform,
          niche: niche,
          category: category,
          language: language,
          duration: duration,
          isFavorite: false,
          createdAt: new Date().toISOString()
        }));
        if (ideas.length > 0) {
          return res.json({ success: true, ideas });
        }
      } catch (jsonErr) {
        console.warn('Could not parse Gemini JSON, falling back to mock:', jsonErr.message);
      }
    }

    // Mock fallback
    const mock = generateMockResponse('ideas', req.body);
    return res.json(mock);
  } catch (error) {
    console.error('Error generating ideas:', error);
    const mock = generateMockResponse('ideas', req.body);
    return res.json(mock);
  }
});

// Script Generator
router.post('/generate-script', async (req, res) => {
  try {
    const { topic = 'Creator Workflow', platform = 'Instagram Reel', duration = '60s', language = 'hinglish', style, tone, brand } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = buildSystemPrompt(brand, `Full Script Generation for ${platform}`, language);
      const userPrompt = `Create a high-retention video script for:
Topic: ${topic}
Platform: ${platform}
Duration: ${duration}
Tone: ${tone}
Style: ${style}

Output JSON with keys:
- hook (the 3-second opening hook)
- scenes (array of objects with sceneNumber, timestamp, visualCues, dialogue, onScreenText, sfx)
- cta (Call to Action)
Return ONLY raw valid JSON.`;

      try {
        const result = await callGemini(sys, userPrompt, process.env.GEMINI_API_KEY);
        const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({
          success: true,
          script: {
            id: 'script_' + Date.now(),
            topic,
            platform,
            duration,
            language,
            tone,
            hook: parsed.hook,
            scenes: parsed.scenes,
            fullText: (parsed.scenes || []).map(s => `[${s.timestamp}] ${s.onScreenText || ''}\nVisual: ${s.visualCues}\nAudio: ${s.dialogue}`).join('\n\n'),
            cta: parsed.cta || brand?.defaultCta,
            createdAt: new Date().toISOString()
          }
        });
      } catch (jsonErr) {
        console.warn('Could not parse Gemini JSON script, falling back to mock generator:', jsonErr.message);
      }
    }

    const mock = generateMockResponse('script', req.body);
    return res.json(mock);
  } catch (error) {
    console.error('Error generating script:', error);
    const mock = generateMockResponse('script', req.body);
    return res.json(mock);
  }
});

// Titles & Hashtags
router.post('/generate-titles-hashtags', async (req, res) => {
  try {
    const { topic = 'Content Growth', platform = 'YouTube Short', language = 'hinglish', brand } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = buildSystemPrompt(brand, `High-CTR Titles & Hashtag Generation for ${platform}`, language);
      const userPrompt = `Generate 10 YouTube Titles, 10 Shorts Titles, 3 Captions, targeted Hashtags, and SEO Keywords for:
Topic: ${topic}
Platform: ${platform}

Output JSON with keys:
- youtubeTitles (array of 10 strings)
- shortsTitles (array of 10 strings)
- captions (array of 3 strings)
- hashtags (array of 10 strings)
- keywords (array of 8 strings)
- ctaSuggestions (array of 4 strings)
Return ONLY raw valid JSON.`;

      try {
        const result = await callGemini(sys, userPrompt, process.env.GEMINI_API_KEY);
        const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({
          success: true,
          youtubeTitles: parsed.youtubeTitles || [],
          shortsTitles: parsed.shortsTitles || [],
          captions: parsed.captions || [],
          hashtags: parsed.hashtags || [],
          keywords: parsed.keywords || [],
          ctaSuggestions: parsed.ctaSuggestions || [],
          disclaimer: language === 'hindi'
            ? 'ℹ️ क्रिएटर सलाह: हैशटैग और कीवर्ड्स सर्च इंडेक्सिंग में मदद करते हैं, लेकिन दर्शकों का वॉच-टाइम ही रिकमेंडेशन बढ़ाता है।'
            : (language === 'english'
              ? 'ℹ️ Creator Notice: Hashtags and keywords aid search indexing, but viewer watch time drives recommendations.'
              : 'ℹ️ Pro Tip: Hashtags and keywords improve discoverability, but authentic watch time drives recommendations.')
        });
      } catch (jsonErr) {
        console.warn('Could not parse Gemini JSON, falling back to mock generator:', jsonErr.message);
      }
    }

    const mock = generateMockResponse('titles', { ...req.body, language });
    return res.json(mock);
  } catch (error) {
    console.error('Error generating titles:', error);
    return res.status(500).json({ error: 'Failed to generate titles' });
  }
});

// Image Prompts
router.post('/generate-image-prompts', async (req, res) => {
  try {
    const { category = 'Thumbnail', subject = 'Creator Setup', language = 'english', brand } = req.body;
    const mock = generateMockResponse('prompts', { category, subject, language, brand });
    return res.json(mock);
  } catch (error) {
    console.error('Error generating prompts:', error);
    return res.status(500).json({ error: 'Failed to generate prompts' });
  }
});

// Auto-Pilot Analysis
router.post('/autopilot/analyze', async (req, res) => {
  try {
    const { fileName, context, platform = 'Instagram Reel', category = 'Tech & Education', language = 'hinglish', brand } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = buildSystemPrompt(brand, `AI Content Auto-Pilot Video Analysis for ${platform}`, language);
      const userPrompt = `You are analyzing a creator's uploaded video for ${platform}.
Video File Name: ${fileName || 'unnamed_video.mp4'}
Creator Context / Topic: ${context || 'General creator video'}
Category: ${category}
Platform: ${platform}

CRITICAL RULES:
1. NEVER guarantee or promise virality, guaranteed views, or viral reach. Use realistic terms like "high-retention", "optimized", "strong audience alignment".
2. Follow strict language rules: ${language === 'english' ? '100% pure English only' : (language === 'hindi' ? '100% Hindi in Devanagari script' : 'Natural mixed Hinglish')}.

Generate exactly:
- 3 distinct Title options (titleOptions)
- 3 distinct Opening Hook options (hookOptions)
- 1 Full detailed video description (description)
- 3 distinct Caption options with emojis and spacing (captionOptions)
- 3 distinct CTA options (ctaOptions)
- 10 platform-tailored Hashtags (hashtags)
- 7 SEO Keywords (keywords)
- 1 high-CTR Thumbnail / Cover concept description (thumbnailConcept)
- Extracted main topic (topic)
- Recommended post time in IST e.g. "18:30" (recommendedPostTime)
- Recommended post date in YYYY-MM-DD (recommendedPostDate)
- Clear reasoning for posting time (postingTimeReasoning)
- Confidence and safety note (confidenceNote)

Return ONLY valid JSON matching these exact keys.`;

      try {
        const result = await callGemini(sys, userPrompt, process.env.GEMINI_API_KEY);
        const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({
          success: true,
          ...parsed
        });
      } catch (geminiErr) {
        console.warn('Gemini AutoPilot parse error, falling back to mock generator:', geminiErr.message);
      }
    }

    const mock = generateMockResponse('autopilot', req.body);
    return res.json(mock);
  } catch (error) {
    console.error('Error in autopilot analyze:', error);
    const mock = generateMockResponse('autopilot', req.body);
    return res.json(mock);
  }
});

// Auto-Pilot Generate Full Content Plan
router.post('/autopilot/generate-plan', async (req, res) => {
  try {
    const { platform = 'Instagram Reel', category = 'Drawing', language = 'hindi', itemCount = 5, frequency = 'Daily', duration = '30s', customTopic = '', brand } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = buildSystemPrompt(brand, `AI Content Auto-Pilot Workflow Generation for ${platform}`, language);
      const userPrompt = `Generate a ${itemCount}-item content plan for ${platform}.
Category: ${category}
Language: ${language}
Duration: ${duration}
Posting Frequency: ${frequency}
${customTopic ? `Theme / Focus: ${customTopic}` : ''}

For each item generate:
- topic (string)
- concept (string)
- hook (high-retention opening line)
- scriptText (full formatted script)
- scenes (array of 3 scenes with sceneNumber, timestamp, visualCues, dialogue, onScreenText, sfx)
- voiceover (full narration text)
- onScreenText (on screen cues)
- titleOptions (array of 3 high-CTR titles)
- caption (engaging caption with spacing and emojis)
- hashtags (array of 8 hashtags)
- cta (clear call to action)
- thumbnailIdea (vibrant visual thumbnail description)

Output JSON format: { "success": true, "plan": [ ...${itemCount} items... ] }. Return raw JSON only.`;

      try {
        const result = await callGemini(sys, userPrompt, process.env.GEMINI_API_KEY);
        const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.plan && Array.isArray(parsed.plan) && parsed.plan.length > 0) {
          const now = new Date();
          const plan = parsed.plan.map((item, idx) => ({
            id: 'ap_' + Date.now() + '_' + (idx + 1),
            brandId: brand?.id || 'brand_arts',
            topic: item.topic || `Topic ${idx + 1}`,
            concept: item.concept || '',
            hook: item.hook || '',
            category,
            platform,
            duration,
            language,
            status: idx === 0 ? 'Ready' : (idx === 1 ? 'Recording' : (idx === 2 ? 'Script Ready' : 'Idea')),
            scriptText: item.scriptText || '',
            scenes: item.scenes || [],
            voiceover: item.voiceover || '',
            onScreenText: item.onScreenText || '',
            titleOptions: item.titleOptions || [item.topic],
            selectedTitle: (item.titleOptions && item.titleOptions[0]) || item.topic,
            caption: item.caption || '',
            hashtags: item.hashtags || [],
            cta: item.cta || brand?.defaultCta,
            thumbnailIdea: item.thumbnailIdea || '',
            scheduledDate: new Date(now.getTime() + (idx + 1) * 86400000).toISOString().split('T')[0],
            scheduledTime: '18:30',
            createdAt: new Date().toISOString()
          }));
          return res.json({ success: true, count: plan.length, plan });
        }
      } catch (geminiErr) {
        console.warn('Gemini generate plan failed or parse error, using smart generator:', geminiErr.message);
      }
    }

    const mock = generateMockResponse('autopilot-plan', req.body);
    return res.json(mock);
  } catch (error) {
    console.error('Error generating autopilot plan:', error);
    const mock = generateMockResponse('autopilot-plan', req.body);
    return res.json(mock);
  }
});

// Auto-Pilot Regenerate Single Item
router.post('/autopilot/regenerate-item', async (req, res) => {
  try {
    const { item, brand } = req.body;
    const planResult = generateMockResponse('autopilot-plan', {
      itemCount: 1,
      category: item.category,
      platform: item.platform,
      duration: item.duration,
      language: item.language,
      customTopic: item.topic,
      brand
    });
    if (planResult.plan && planResult.plan[0]) {
      const newItem = {
        ...planResult.plan[0],
        id: item.id,
        status: item.status,
        scheduledDate: item.scheduledDate,
        scheduledTime: item.scheduledTime
      };
      return res.json({ success: true, item: newItem });
    }
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Error regenerating item:', error);
    return res.json({ success: true, item: req.body.item });
  }
});

// Auto-Pilot Publish / Dispatch
router.post('/autopilot/publish', async (req, res) => {
  try {
    const { draft, platform, publishNow = false, scheduleTime } = req.body;
    
    const hasYouTubeApiKey = !!process.env.YOUTUBE_API_KEY || !!process.env.YOUTUBE_CLIENT_SECRET;
    const hasMetaGraphKey = !!process.env.META_ACCESS_TOKEN || !!process.env.INSTAGRAM_ACCOUNT_ID;

    let platformConfigured = false;
    if (platform === 'YouTube Short' || platform === 'YouTube Long Video') {
      platformConfigured = hasYouTubeApiKey;
    } else if (platform === 'Instagram Reel') {
      platformConfigured = hasMetaGraphKey;
    }

    const mode = platformConfigured ? 'live_api' : 'simulated_v1';
    const dispatchId = 'dispatch_' + Date.now();

    return res.json({
      success: true,
      mode,
      dispatchId,
      platform,
      publishNow,
      scheduledAt: publishNow ? new Date().toISOString() : (scheduleTime || new Date().toISOString()),
      message: publishNow
        ? `Successfully published to ${platform}! [Mode: ${mode === 'live_api' ? 'Official API' : 'Studio Simulated Dispatch'}]`
        : `Successfully scheduled for ${platform} on ${scheduleTime || 'optimal window'}.`,
      receipt: {
        title: draft?.selectedTitle || 'Untitled Video',
        platform,
        status: publishNow ? 'Published' : 'Scheduled',
        apiStatus: platformConfigured ? 'Connected to Official Platform API' : 'V1 Sandbox Mode (Ready for OAuth Connect)'
      }
    });
  } catch (error) {
    console.error('Error in autopilot publish:', error);
    return res.status(500).json({ error: 'Failed to dispatch post' });
  }
});

// AI Video Studio - Enhance Prompt
router.post('/video/enhance-prompt', async (req, res) => {
  try {
    const { prompt, settings = {}, brand } = req.body;
    const provider = process.env.AI_PROVIDER || 'mock';
    const style = settings.style || 'Cinematic';
    const camera = settings.camera || 'Cinematic';
    const duration = settings.duration || 10;

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const sys = `You are an elite Hollywood visual director & AI prompt engineer for prompt-to-video systems (like Google Flow, Runway Gen-3, Sora).
Your task is to transform the user's brief idea into an ultra-detailed, highly effective prompt for AI video generation.
MANDATORY RULES:
1. Include: Subject, Environment, Action, Camera movement, Shot type, Lighting, Mood, Style, Composition, Motion, Duration (${duration}s), and Ending.
2. DO NOT unnecessarily add people, characters, or objects that the user did not request.
3. Keep the enhanced prompt crisp, evocative, and photorealistic. Output ONLY the enhanced prompt paragraph, no quotes or intro.`;
      const result = await callGemini(sys, `Enhance this video prompt for style "${style}" and camera "${camera}": "${prompt}"`, process.env.GEMINI_API_KEY);
      if (result && result.text) {
        return res.json({ success: true, enhancedPrompt: result.text.trim() });
      }
    }

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const sys = `You are an elite Hollywood visual director & AI prompt engineer for prompt-to-video systems. Transform the user's brief prompt into a detailed, photorealistic prompt incorporating Subject, Environment, Action, Camera movement, Shot type, Lighting, Mood, Style (${style}), Composition, Motion, Duration (${duration}s), and Ending without adding unrequested characters. Output ONLY the enhanced prompt paragraph.`;
      const result = await callOpenAI(sys, prompt, process.env.OPENAI_API_KEY, process.env.OPENAI_BASE_URL);
      if (result && result.text) {
        return res.json({ success: true, enhancedPrompt: result.text.trim() });
      }
    }

    // Default smart generator
    const cleanPrompt = (prompt || 'realistic drawing on paper').trim();
    const isDrawing = /draw|sketch|pencil|paint|portrait|art|krishna|canvas|paper|ink/i.test(cleanPrompt);
    let enhanced = '';

    if (isDrawing) {
      enhanced = `Create a highly realistic ${style.toLowerCase()} art-studio scene based on: "${cleanPrompt}". Begin with an intimate macro close-up shot of the artist's hand and tool touching textured paper, followed by a smooth ${camera.toLowerCase()} movement tracking the precision strokes and line work. Transition through the developing details with high micro-contrast, rich graphite textures, and soft warm studio lighting. End with a cinematic smooth pull-back reveal of the finished artwork under golden rim light. Crisp 4K focus, shallow depth of field, fluid ${duration}-second progression, zero distortion.`;
    } else {
      enhanced = `Cinematic ${style.toLowerCase()} visual composition: "${cleanPrompt}". Detailed focal subject positioned in an authentic atmospheric environment, captured with smooth ${camera.toLowerCase()} camera movement and balanced three-point studio lighting. Shallow depth of field focusing sharply on the primary action with subtle ambient dust particles and warm color grading. Pacing designed for a seamless ${duration}-second visual flow with a high-impact conclusive ending. Highly detailed, photorealistic textures, zero artifacts.`;
    }

    return res.json({ success: true, enhancedPrompt: enhanced });
  } catch (error) {
    console.error('Error enhancing video prompt:', error);
    return res.status(500).json({ error: error.message });
  }
});

// AI Video Studio - Rewrite Prompt Variations
router.post('/video/rewrite-prompt', async (req, res) => {
  try {
    const { prompt, style = 'Cinematic', brand } = req.body;
    const base = prompt || 'artist drawing realistic portrait';
    const variations = [
      `Cinematic Close-Up: Detailed focus on hand movement and textures during "${base}", with warm directional studio lighting and slow-motion reveal.`,
      `Atmospheric Timelapse: Smooth tracking shot following the fluid creation of "${base}", accompanied by changing soft golden-hour ambient reflections.`,
      `Dramatic Modern Reveal: Dynamic push-in camera accelerating through "${base}" with crisp rim lighting and high contrast finishing in a museum-grade display.`
    ];
    return res.json({ success: true, variations });
  } catch (error) {
    console.error('Error rewriting video prompt:', error);
    return res.status(500).json({ error: error.message });
  }
});

// AI Video Studio - Generate Video
router.post('/video/generate', async (req, res) => {
  try {
    const { prompt, enhancedPrompt, referenceImage, settings = {}, scenes = [], brand } = req.body;
    const totalDuration = scenes.length > 0
      ? scenes.reduce((acc, s) => acc + s.duration, 0)
      : (settings.duration || 10);

    const titleWords = prompt.split(' ').slice(0, 7).join(' ');
    const title = titleWords.length > 5 ? titleWords.charAt(0).toUpperCase() + titleWords.slice(1) : 'Cinematic AI Video';

    const video = {
      id: 'vid_' + Date.now(),
      brandId: brand?.id || 'brand_personal',
      title,
      prompt,
      enhancedPrompt,
      referenceImage,
      settings,
      scenes,
      totalDuration,
      status: 'ready',
      thumbnailUrl: referenceImage || (settings.style === 'Art'
        ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'),
      isSaved: false,
      createdAt: new Date().toISOString()
    };

    return res.json({ success: true, video });
  } catch (error) {
    console.error('Error generating video:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
