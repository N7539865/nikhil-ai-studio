// src/services/storageService.ts
import { Brand, ContentIdea, Script, ContentItem, VideoProject, AnalyticsEntry, AiChatMessage, AutoPilotPlanItem, ArtBusinessStats, AiGeneratedVideo } from '../types';

export const DEFAULT_BRANDS: Brand[] = [
  {
    id: 'brand_personal',
    name: 'Personal Creator',
    creatorName: 'Nikhil',
    handleYt: '@NikhilOfficial',
    handleInsta: '@nikhil.creates',
    niches: 'Tech, Gadgets, Digital Life & Creator Growth',
    preferredLanguage: 'hinglish',
    preferredStyle: 'High-energy, practical, visual hooks with fast cuts',
    defaultCta: 'Double tap if this helped, and follow for more smart creator hacks!',
    bio: 'Tech enthusiast & digital creator sharing productivity tips, gear reviews, and workflow breakdowns.',
    color: '#8b5cf6' // Purple
  },
  {
    id: 'brand_arts',
    name: 'Nikhil Arts',
    creatorName: 'Nikhil',
    handleYt: '@NikhilArts',
    handleInsta: '@nikhil.arts',
    niches: 'Fine Art, Digital Illustration, Speed Painting & Visual Design',
    preferredLanguage: 'hindi',
    preferredStyle: 'Calm, aesthetic, process-driven timelapse storytelling',
    defaultCta: 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!',
    bio: 'Showcasing intricate artwork, sketching tutorials, and visual design speedpaints.',
    color: '#ec4899' // Pink
  },
  {
    id: 'brand_gaming',
    name: 'Gaming',
    creatorName: 'Nikhil Gaming',
    handleYt: '@NikhilPlays',
    handleInsta: '@nikhil.gaming',
    niches: 'Esports, GTA, BGMI, PC Gaming Setup & Funny Moments',
    preferredLanguage: 'hinglish',
    preferredStyle: 'Aggressive hype, comedic commentary, clutching moments',
    defaultCta: 'Bhai clutch pasand aaya toh like thokna mat bhoolna!',
    bio: 'Daily high-octane gaming highlights, clutch plays, and hilarious gameplay fails.',
    color: '#10b981' // Emerald
  },
  {
    id: 'brand_comedy',
    name: 'Comedy',
    creatorName: 'Nikhil Comedy',
    handleYt: '@NikhilBakchodi',
    handleInsta: '@nikhil.comedy',
    niches: 'Relatable Desi Skits, Office Humor, Friend Group Dynamics',
    preferredLanguage: 'hindi',
    preferredStyle: 'Rapid punchlines, relatable Indian household archetypes, dual characters',
    defaultCta: 'अपने उस दोस्त को टैग करो जो बिल्कुल ऐसा ही करता है! 😂',
    bio: 'Relatable sketches on daily Indian life, family quirks, and friend banter.',
    color: '#f59e0b' // Amber
  },
  {
    id: 'brand_devpri',
    name: 'Devpri Telecom',
    creatorName: 'Devpri Telecom',
    handleYt: '@DevpriTelecom',
    handleInsta: '@devpri_telecom',
    niches: 'Smartphones, Mobile Accessories, Best Deals & Telecom Updates',
    preferredLanguage: 'hinglish',
    preferredStyle: 'Direct customer value, unboxing, genuine feature comparisons, local store deals',
    defaultCta: 'Best deals ke liye Devpri Telecom visit karein ya WhatsApp par message karein!',
    bio: 'Your trusted digital store for smartphones, accessories, repairs, and telecom solutions.',
    color: '#06b6d4' // Cyan
  }
];

export const DEFAULT_CHECKLIST_KEYS = [
  'video_edited',
  'thumbnail_ready',
  'title_added',
  'description_added',
  'hashtags_added',
  'keywords_added',
  'caption_added',
  'cta_added',
  'video_reviewed',
  'ready_to_publish'
];

export const CHECKLIST_LABELS: Record<string, string> = {
  video_edited: 'Video edited & color graded',
  thumbnail_ready: 'Thumbnail ready (checked on mobile scale)',
  title_added: 'Title added (< 60 chars, curiosity-driven)',
  description_added: 'Description added with timestamps/links',
  hashtags_added: 'Hashtags added (relevant & niche)',
  keywords_added: 'Keywords & search tags added',
  caption_added: 'Caption formatted with clear spacing',
  cta_added: 'Call to Action (CTA) included',
  video_reviewed: 'Video audio & subtitles reviewed',
  ready_to_publish: 'Ready to publish / scheduled'
};

const STORAGE_KEY_PREFIX = 'nikhil_ai_studio_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage read error for key:', key, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error for key:', key, e);
  }
}

// Initial seed data generator
function getInitialSeedData() {
  const ideas: ContentIdea[] = [
    {
      id: 'idea_seed_1',
      brandId: 'brand_personal',
      title: '5 AI Tools Creators Are Gatekeeping in 2026',
      hook: 'Agar aap video banane mein ghanton laga rahe ho, toh ye 5 AI tools aapka kaam 10 minute mein kar denge.',
      concept: 'A rapid-fire countdown showing modern AI tools that automate editing, thumbnail generation, and B-roll generation.',
      suggestedShots: [
        'Close up with shocked expression holding smartphone',
        'Screen capture zooming into tool #1 generating video clips',
        'Split screen showing manual timeline vs automated timeline',
        'Outro pointing to screen with link in comments'
      ],
      cta: 'Comment "AI" and I will DM you the direct tools list!',
      caption: '🚀 Stop wasting time doing manual tasks that AI can do in seconds. Save this reel so you have the list ready when you record next!',
      hashtags: ['#AITools', '#CreatorEconomy', '#ProductivityHacks', '#NikhilAIStudio', '#TechShorts'],
      platform: 'Instagram Reel',
      niche: 'Tech & AI',
      category: 'AI',
      language: 'hinglish',
      duration: '45-60s',
      isFavorite: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'idea_seed_2',
      brandId: 'brand_devpri',
      title: 'Budget vs Flagship: Kaunsa Phone 2026 Mein Lena Chahiye?',
      hook: 'Kya 50,000 extra kharch karna worth hai ya budget phone hi kaafi hai?',
      concept: 'Direct side by side test in Devpri Telecom store comparing camera, battery, and daily speed of 2 popular phones.',
      suggestedShots: [
        'Holding both phones in front of store display',
        'Camera comparison shot in low light',
        'App launch speed test side by side',
        'Store counter showing price tags and special festive offer'
      ],
      cta: 'Devpri Telecom par aao aur best discount paao!',
      caption: 'Smart shopping karo! Har baar mehenga phone lena zaroori nahi hota. Dekho poora comparison. Available at Devpri Telecom!',
      hashtags: ['#DevpriTelecom', '#SmartphoneReview', '#PhoneDeals', '#TechComparison', '#StoreOffer'],
      platform: 'YouTube Short',
      niche: 'Smartphones & Deals',
      category: 'Tech',
      language: 'hinglish',
      duration: '60s',
      isFavorite: true,
      createdAt: new Date().toISOString()
    }
  ];

  const scripts: Script[] = [
    {
      id: 'script_seed_1',
      brandId: 'brand_personal',
      topic: 'How to Double Reel Watch Time',
      platform: 'Instagram Reel',
      duration: '45 seconds',
      language: 'hinglish',
      tone: 'High Energy & Actionable',
      hook: 'Aapki reels 200 views pe atki hain? Toh ye 1 mistake aap 100% kar rahe ho.',
      scenes: [
        {
          sceneNumber: 1,
          timestamp: '0:00 - 0:04',
          visualCues: 'Camera tilts rapidly downward, sudden freeze on host pointing with red question mark icon.',
          dialogue: 'Aapki reels 200 views pe atki hain? Toh ye 1 mistake aap 100% kar rahe ho.',
          onScreenText: '🚨 200 Views Trap!',
          sfx: 'Warning buzzer'
        },
        {
          sceneNumber: 2,
          timestamp: '0:04 - 0:18',
          visualCues: 'Screen recording showing Instagram insight graph dropping at second 3.',
          dialogue: 'Look at this graph: Log pehle 3 second mein scroll kar dete hain kyunki aapka intro boring hai. Directly problem se start karo.',
          onScreenText: 'Fix The First 3 Seconds',
          sfx: 'Slide whistle'
        },
        {
          sceneNumber: 3,
          timestamp: '0:18 - 0:35',
          visualCues: 'Host demonstrates pattern interrupt: holding an unusual object or sudden camera punch-in.',
          dialogue: 'Jab bhi reel start karo, visual movement rakho. Text bada aur bold hona chahiye jo eye-level par ho.',
          onScreenText: 'Use Pattern Interrupts ⚡',
          sfx: 'Whoosh + Pop'
        },
        {
          sceneNumber: 4,
          timestamp: '0:35 - 0:45',
          visualCues: 'Host points to save button overlay with confident smile.',
          dialogue: 'Agli reel mein ye try karo aur results dekho. Save this reel so you remember!',
          onScreenText: 'Hit Save & Follow @Nikhil',
          sfx: 'Cash register ding'
        }
      ],
      fullText: '[0:00 - 0:04] Hook: Aapki reels 200 views pe atki hain? Toh ye 1 mistake aap 100% kar rahe ho.\n\n[0:04 - 0:18] Scene 2: Look at this graph: Log pehle 3 second mein scroll kar dete hain kyunki aapka intro boring hai. Directly problem se start karo.\n\n[0:18 - 0:35] Scene 3: Jab bhi reel start karo, visual movement rakho. Text bada aur bold hona chahiye jo eye-level par ho.\n\n[0:35 - 0:45] Outro: Agli reel mein ye try karo aur results dekho. Save this reel so you remember!',
      cta: 'Double tap if this helped, and follow for more creator hacks!',
      isFavorite: true,
      createdAt: new Date().toISOString()
    }
  ];

  const projects: VideoProject[] = [
    {
      id: 'proj_seed_1',
      brandId: 'brand_personal',
      name: 'Ultimate Desk Setup Tour 2026',
      platform: 'YouTube Long Video',
      status: 'Editing',
      topic: 'Minimalist Creator Setup with Smart Lighting & Productivity Gear',
      script: 'Full studio desk walkthrough script with b-roll markers.',
      caption: 'The complete breakdown of my 2026 creator studio. Every cable, monitor, and light explained!',
      hashtags: '#StudioSetup #DeskTour #MinimalSetup #CreatorStudio #Productivity',
      notes: 'Remember to add color grading LUTs and sound design for mechanical keyboard typing.',
      thumbnailConcept: 'Split screen: Dark aesthetic neon room with arrows pointing to custom glowing audio interface.',
      uploadDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      videoFileRef: 'DeskTour_v3_FinalGrade.mp4',
      checklist: {
        video_edited: true,
        thumbnail_ready: true,
        title_added: true,
        description_added: false,
        hashtags_added: true,
        keywords_added: true,
        caption_added: false,
        cta_added: true,
        video_reviewed: false,
        ready_to_publish: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj_seed_2',
      brandId: 'brand_personal',
      name: '5 AI Tools Reel',
      platform: 'Instagram Reel',
      status: 'Ready',
      topic: 'AI Tools Gatekept by Top Creators',
      caption: 'These 5 AI tools will 10x your workflow in 2026. Save before you lose it!',
      hashtags: '#AITools #ReelsGrowth #ContentCreator',
      thumbnailConcept: 'Host holding neon glowing smartphone with floating AI icons',
      uploadDate: new Date().toISOString().split('T')[0],
      videoFileRef: 'AITools_Reel_Master.mp4',
      checklist: {
        video_edited: true,
        thumbnail_ready: true,
        title_added: true,
        description_added: true,
        hashtags_added: true,
        keywords_added: true,
        caption_added: true,
        cta_added: true,
        video_reviewed: true,
        ready_to_publish: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const calendarItems: ContentItem[] = [
    {
      id: 'cal_seed_1',
      brandId: 'brand_personal',
      title: '5 AI Tools Reel',
      platform: 'Instagram Reel',
      status: 'Ready',
      publishDate: new Date().toISOString().split('T')[0],
      publishTime: '18:30',
      notes: 'Post at peak engagement time (6:30 PM IST). Share to story immediately.',
      projectId: 'proj_seed_2'
    },
    {
      id: 'cal_seed_2',
      brandId: 'brand_personal',
      title: 'Ultimate Desk Setup Tour 2026',
      platform: 'YouTube Long Video',
      status: 'Editing',
      publishDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      publishTime: '20:00',
      notes: 'Premiering live with community chat.',
      projectId: 'proj_seed_1'
    },
    {
      id: 'cal_seed_3',
      brandId: 'brand_personal',
      title: 'Smartphone Camera Secret Hack',
      platform: 'YouTube Short',
      status: 'Script Ready',
      publishDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      publishTime: '19:00',
      notes: 'Quick 30s tutorial on manual exposure lock.'
    }
  ];

  const analytics: AnalyticsEntry[] = [
    {
      id: 'ana_1',
      brandId: 'brand_personal',
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      platform: 'Instagram Reel',
      contentName: '5 AI Tools Creators Are Gatekeeping',
      views: 48500,
      likes: 3820,
      comments: 245,
      shares: 910,
      subscribersGained: 680,
      productCourse: 'AI Video Masterclass',
      orders: 24,
      revenue: 23976,
      notes: 'High share ratio pushed to explore page'
    },
    {
      id: 'ana_2',
      brandId: 'brand_personal',
      date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      platform: 'YouTube Short',
      contentName: 'How I Record 10 Videos In 2 Hours',
      views: 112000,
      likes: 8400,
      comments: 420,
      shares: 1540,
      subscribersGained: 1250,
      productCourse: 'Creator Workflow Template',
      orders: 45,
      revenue: 44550,
      notes: 'Shorts feed algorithm surge'
    },
    {
      id: 'ana_3',
      brandId: 'brand_personal',
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      platform: 'YouTube Long Video',
      contentName: 'Complete YouTube Studio Setup 2026',
      views: 24300,
      likes: 2100,
      comments: 310,
      shares: 480,
      subscribersGained: 410,
      productCourse: 'Lighting Blueprint PDF',
      orders: 18,
      revenue: 14400,
      notes: 'Strong average watch time (62%)'
    },
    {
      id: 'ana_4',
      brandId: 'brand_arts',
      date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
      platform: 'Instagram Reel',
      contentName: 'Hyper-Realistic Eye Sketching Tutorial',
      views: 89000,
      likes: 12400,
      comments: 860,
      shares: 3400,
      subscribersGained: 2100,
      productCourse: 'Graphite Portrait Masterclass',
      orders: 58,
      revenue: 86942,
      notes: 'Audio sync with blending stump timelapse went viral'
    },
    {
      id: 'ana_5',
      brandId: 'brand_arts',
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      platform: 'YouTube Short',
      contentName: '3 Blending Mistakes Every Beginner Makes',
      views: 145000,
      likes: 15800,
      comments: 940,
      shares: 4200,
      subscribersGained: 3400,
      productCourse: 'Procreate Brush & Texture Kit',
      orders: 72,
      revenue: 71928,
      notes: 'Huge conversion to digital brush download'
    },
    {
      id: 'ana_6',
      brandId: 'brand_arts',
      date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
      platform: 'Instagram Reel',
      contentName: '90s Vintage Aesthetic Portrait Speedpaint',
      views: 63000,
      likes: 8900,
      comments: 520,
      shares: 1800,
      subscribersGained: 1450,
      productCourse: 'Portrait Sketching Fundamentals',
      orders: 34,
      revenue: 40766,
      notes: 'Strong comment engagement on rating CTA'
    }
  ];

  const autopilotPlans: AutoPilotPlanItem[] = [
    {
      id: 'ap_item_1',
      brandId: 'brand_arts',
      topic: 'Realistic Eye Shading & Highlights',
      concept: 'A step-by-step macro timelapse revealing how to achieve photorealistic iris reflections using a simple mono eraser.',
      hook: 'अगर आपकी स्केचिंग में आंखें बेजान लगती हैं, तो यह 10 सेकंड की ट्रिक आपकी कला को पूरी तरह बदल देगी!',
      category: 'Drawing',
      platform: 'Instagram Reel',
      duration: '30s',
      language: 'hindi',
      status: 'Published',
      scriptText: `[0:00 - 0:03] Scene 1 (Hook):\nVisual: Macro zoom into graphite eye, mono eraser cutting crisp highlight.\nDialogue: "आंखों में चमक नहीं, तो स्केच कभी जिंदा नहीं लगेगा। देखिए यह आसान तरीका।"\n\n[0:03 - 0:15] Scene 2 (Technique):\nVisual: Blending 4B pencil circular motions with tortillon stump.\nDialogue: "पहले 2B से लाइट बेस टोन बनाएं, फिर 6B से प्यूपिल को गहरा डार्क करें।"\n\n[0:15 - 0:30] Scene 3 (Final & CTA):\nVisual: Full portrait reveal tilting into studio lamp.\nDialogue: "कैसी लगी यह आंख? कमेंट्स में 1 से 10 तक रेटिंग दें और पूरा ट्यूटोरियल देखने के लिए बायो लिंक चेक करें!"`,
      scenes: [
        { sceneNumber: 1, timestamp: '0:00 - 0:03', visualCues: 'Ultra close-up of mono zero eraser erasing fine curved highlight in iris', dialogue: 'आंखों में चमक नहीं, तो स्केच कभी जिंदा नहीं लगेगा।', onScreenText: '✨ Photorealistic Eye Secret', sfx: 'Pencil scratching' },
        { sceneNumber: 2, timestamp: '0:03 - 0:18', visualCues: 'Layering 2B, 4B, and 8B graphite followed by tortillon smoothing', dialogue: 'पहले 2B बेस टोन, फिर 6B प्यूपिल, और अंत में ब्लेंडिंग स्टंप।', onScreenText: 'Step 1: Soft Feathering', sfx: 'Soft lo-fi music' },
        { sceneNumber: 3, timestamp: '0:18 - 0:30', visualCues: 'Finished eye art reveal side by side with live model reference', dialogue: 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!', onScreenText: 'Rate 1 to 10 👇', sfx: 'Chime' }
      ],
      voiceover: 'आंखों में चमक नहीं, तो स्केच कभी जिंदा नहीं लगेगा। पहले 2B बेस टोन, फिर 6B प्यूपिल, और अंत में ब्लेंडिंग स्टंप। कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!',
      onScreenText: '✨ Photorealistic Eye Secret\nStep 1: Soft Feathering\nRate 1 to 10 👇',
      titleOptions: [
        'Realistic Eye Sketching in 30 Seconds (Step-by-Step)',
        'यह 1 शेडिंग सीक्रेट आपकी स्केचिंग 10x बेहतर बना देगा',
        'Drawing Hyper-Realistic Eyes With 3 Simple Pencils'
      ],
      selectedTitle: 'Realistic Eye Sketching in 30 Seconds (Step-by-Step)',
      caption: '👁️ Realistic Eye Shading Breakdown!\n\nअधिकतर बिगिनर्स ब्लेंडिंग और हाइलाइट में गलती करते हैं। इस 3-स्टेप प्रोसेस को सेव करें:\n1. 2B लाइट ग्रेफाइट बेस\n2. 6B डार्क प्यूपिल डेप्थ\n3. मोनो इरेज़र से शार्प रिफ्लेक्शन\n\n📌 इस रील को सेव करें और अपने आर्टिस्ट दोस्तों के साथ शेयर करें!\n\n#NikhilArts #DrawingTutorial #RealisticSketch #PencilArt #SketchingDaily',
      hashtags: ['#NikhilArts', '#DrawingTutorial', '#RealisticSketch', '#PencilArt', '#SketchingDaily', '#ArtTutorials', '#PortraitArtist'],
      cta: 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!',
      thumbnailIdea: 'Macro split-screen: Left shows flat dull sketch, Right shows 3D glowing realistic graphite eye with bold text "DON\'T BLEND LIKE THIS".',
      scheduledDate: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
      scheduledTime: '18:30',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'ap_item_2',
      brandId: 'brand_arts',
      topic: '3 Blending Mistakes Every Beginner Makes',
      concept: 'Demonstrating common shading blunders like finger smudging vs proper paper stump and makeup brush blending.',
      hook: 'अगर आप भी पेंसिल स्केच को उंगली से ब्लेंड करते हैं, तो अभी रुक जाइए!',
      category: 'Art Tutorial',
      platform: 'YouTube Shorts',
      duration: '60s',
      language: 'hindi',
      status: 'Ready',
      scriptText: `[0:00 - 0:05] Scene 1 (Hook):\nVisual: Cross mark on finger smudging paper, leaving oily stain.\nDialogue: "उंगली की नेचुरल स्किन ऑइल आपके पेपर को बर्बाद कर देती है!"\n\n[0:05 - 0:40] Scene 2 (Demonstration):\nVisual: Comparison of tortillon stump vs soft eyeshadow brush on graphite gradients.\nDialogue: "सॉफ्ट स्किन टेक्सचर के लिए हमेशा सॉफ्ट आईशैडो ब्रश और फाइन डिटेल के लिए पेपर स्टंप का इस्तेमाल करें।"\n\n[0:40 - 1:00] Scene 3 (Result & CTA):\nVisual: Flawless smooth tone gradient without harsh edges.\nDialogue: "क्या आप चाहते हैं कि मैं कंप्लीट ब्लेंडिंग टूल्स गाइड शेयर करूं? कमेंट में 'TOOLS' लिखें!"`,
      scenes: [
        { sceneNumber: 1, timestamp: '0:00 - 0:05', visualCues: 'Finger smudge leaving patchy graphite fingerprint with big red X', dialogue: 'उंगली से ब्लेंड करने की यह गलती तुरंत बंद करें!', onScreenText: '❌ NEVER SMUDGE WITH FINGERS', sfx: 'Buzzer' },
        { sceneNumber: 2, timestamp: '0:05 - 0:40', visualCues: 'Side by side comparison of blending stump vs soft brush', dialogue: 'सॉफ्ट स्किन टोन के लिए ब्रश और शार्प शैडो के लिए स्टंप इस्तेमाल करें।', onScreenText: '✅ Use Soft Blending Brush', sfx: 'Instructional beat' },
        { sceneNumber: 3, timestamp: '0:40 - 1:00', visualCues: 'Clean smooth render shown with tool kit', dialogue: 'कमेंट में TOOLS लिखें और मैं आपको टूल्स की लिस्ट भेज दूंगा!', onScreenText: 'Comment "TOOLS" for link', sfx: 'Success bell' }
      ],
      voiceover: 'उंगली से ब्लेंड करने की यह गलती तुरंत बंद करें! सॉफ्ट स्किन टोन के लिए ब्रश और शार्प शैडो के लिए स्टंप इस्तेमाल करें। कमेंट में TOOLS लिखें!',
      onScreenText: '❌ NEVER SMUDGE WITH FINGERS\n✅ Use Soft Blending Brush\nComment "TOOLS" for link',
      titleOptions: [
        'Stop Blending With Your Fingers! (Do This Instead)',
        '3 सबसे बड़ी ब्लेंडिंग गलतियां जो हर आर्टिस्ट करता है',
        'How to Blend Pencil Shading Like a Pro in 60s'
      ],
      selectedTitle: 'Stop Blending With Your Fingers! (Do This Instead)',
      caption: '🎨 3 Blending Mistakes Ruining Your Sketches!\n\nFinger oils destroy the tooth of your paper and cause blotchy dark spots that never erase cleanly. Instead, use these 2 tools for professional shading.\n\nSave this for your next drawing session! 📌\n\n#DrawingHacks #ArtTips #SketchingMistakes #NikhilArts #PencilShading',
      hashtags: ['#DrawingHacks', '#ArtTips', '#SketchingMistakes', '#NikhilArts', '#PencilShading', '#ShadingGuide', '#ArtMasterclass'],
      cta: 'कमेंट में "TOOLS" लिखें और मैं फ्री टूल गाइड भेज दूंगा!',
      thumbnailIdea: 'Split screen: Smudged fingerprint vs butter-smooth brush blend with yellow warning arrow pointing to the brush.',
      scheduledDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
      scheduledTime: '17:30',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'ap_item_3',
      brandId: 'brand_arts',
      topic: 'Nose Anatomy & Proportions Guide',
      concept: 'Quick geometric box and ball method to draw any nose angle in under 30 seconds.',
      hook: 'नाक बनाने में एंगल बिगड़ जाता है? बस यह 3 सर्कल याद रख लो!',
      category: 'Drawing',
      platform: 'Instagram Reels',
      duration: '30s',
      language: 'hindi',
      status: 'Editing',
      scriptText: `[0:00 - 0:03] Scene 1 (Hook):\nVisual: Quick geometric sketch of 3 circles forming the base of a nose.\nDialogue: "नाक बनाने के लिए कोई भी मुश्किल गाइडलाइन की जरूरत नहीं है।"\n\n[0:03 - 0:20] Scene 2 (Steps):\nVisual: Connecting the nostrils and bridge effortlessly.\nDialogue: "बीच में बड़ा सर्कल, दोनों तरफ छोटे सर्कल, और ब्रिज को सीधा जॉइन कर लो।"\n\n[0:20 - 0:30] Scene 3 (Outro):\nVisual: Shaded 3D nose with highlight on tip.\nDialogue: "फॉलो करें और भी आसान आर्ट ट्रिक्स के लिए!"`,
      scenes: [
        { sceneNumber: 1, timestamp: '0:00 - 0:03', visualCues: 'Stylus drawing 3 intersecting circles in red digital pencil', dialogue: 'बस यह 3 सर्कल याद रख लो!', onScreenText: '👃 Easy 3-Circle Nose Rule', sfx: 'Pencil chime' },
        { sceneNumber: 2, timestamp: '0:03 - 0:20', visualCues: 'Rapidly connecting nostrils and shading underneath the septum', dialogue: 'बीच में बड़ा सर्कल और साइड में दो छोटे ओवल्स।', onScreenText: 'Step 2: Connect the Nostrils', sfx: 'Smooth lofi' },
        { sceneNumber: 3, timestamp: '0:20 - 0:30', visualCues: 'Final nose in perspective with studio signature', dialogue: 'फॉलो करें और भी आसान आर्ट ट्रिक्स के लिए!', onScreenText: 'Follow @nikhil.arts ❤️', sfx: 'End bell' }
      ],
      voiceover: 'नाक बनाने के लिए बस यह 3 सर्कल याद रख लो! बीच में बड़ा सर्कल और साइड में दो छोटे ओवल्स। फॉलो करें और भी आसान आर्ट ट्रिक्स के लिए!',
      onScreenText: '👃 Easy 3-Circle Nose Rule\nStep 2: Connect the Nostrils\nFollow @nikhil.arts ❤️',
      titleOptions: [
        'The 3-Circle Rule to Draw ANY Nose Angle',
        'नाक बनाने का सबसे आसान 30 सेकंड का फॉर्मूला',
        'Nose Anatomy Made Simple for Beginners'
      ],
      selectedTitle: 'The 3-Circle Rule to Draw ANY Nose Angle',
      caption: '👃 Never struggle with nose symmetry or proportions again!\n\nThe 3-Circle construction method works for front, 3/4, and profile views. Try it on your sketchbook right now!\n\n#NikhilArts #DrawingTutorial #FaceProportions #SketchingTips #NoseDrawing',
      hashtags: ['#NikhilArts', '#DrawingTutorial', '#FaceProportions', '#SketchingTips', '#NoseDrawing', '#LearnToDraw'],
      cta: 'Double tap if this trick made drawing noses easier for you!',
      thumbnailIdea: 'Bright canvas showing the 3 red guidelines transitioning into a 3D painted nose with text "EASY 3-CIRCLE TRICK".',
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      scheduledTime: '18:30',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'ap_item_4',
      brandId: 'brand_arts',
      topic: 'How to Sketch Realistic Hair Strands',
      concept: 'Layering clumps of hair before rendering individual strands with mechanical 0.3mm pencil.',
      hook: 'अगर आप एक-एक बाल खींच कर थक गए हैं और फिर भी हेयर नेचुरल नहीं लग रहे...',
      category: 'Drawing',
      platform: 'Instagram Reels',
      duration: '45s',
      language: 'hindi',
      status: 'Recording',
      scriptText: `[0:00 - 0:04] Scene 1 (Hook):\nVisual: Frustrated artist erasing stringy flat hair.\nDialogue: "बालों को कभी भी एक-एक लाइन की तरह मत बनाओ। बालों के गुच्छे (clumps) बनाओ!"\n\n[0:04 - 0:30] Scene 2 (Process):\nVisual: Drawing big ribbon ribbons of hair, then adding shadow in the hollows.\nDialogue: "बालों को रिबन की तरह सोचो। लाइट कहां पड़ रही है और डार्क शैडो कहां है, पहले यह तय करो।"\n\n[0:30 - 0:45] Scene 3 (Result):\nVisual: Flowing glossy hair with flyaways added at the edges.\nDialogue: "अगर यह टिप पसंद आई तो सेव कर लो!"`,
      scenes: [
        { sceneNumber: 1, timestamp: '0:00 - 0:04', visualCues: 'Close up of erasing spidery hair lines', dialogue: 'बालों को कभी भी एक-एक लाइन की तरह मत बनाओ।', onScreenText: '💇 Stop Drawing Single Hair Lines', sfx: 'Whoosh' },
        { sceneNumber: 2, timestamp: '0:04 - 0:30', visualCues: 'Blocking out ribbon clumps with broad graphite stick', dialogue: 'बालों को रिबन की तरह सोचो और वॉल्यूम बनाओ।', onScreenText: 'Step: Think in Ribbons', sfx: 'Energetic beat' },
        { sceneNumber: 3, timestamp: '0:30 - 0:45', visualCues: 'Adding flyaways with 0.3mm mechanical pencil for realism', dialogue: 'अगर यह टिप पसंद आई तो सेव कर लो!', onScreenText: 'Save This Reel 📌', sfx: 'Ding' }
      ],
      voiceover: 'बालों को कभी भी एक-एक लाइन की तरह मत बनाओ। बालों को रिबन की तरह सोचो और वॉल्यूम बनाओ। अगर यह टिप पसंद आई तो सेव कर लो!',
      onScreenText: '💇 Stop Drawing Single Hair Lines\nStep: Think in Ribbons\nSave This Reel 📌',
      titleOptions: [
        'How to Draw Realistic Hair: Ribbon Technique',
        'बालों की स्केचिंग में यह गलती कभी मत करना!',
        'Sketching Glossy Hair in 45 Seconds'
      ],
      selectedTitle: 'How to Draw Realistic Hair: Ribbon Technique',
      caption: '✨ Master Realistic Hair Drawing!\n\nDon\'t draw 10,000 individual strands. Group them into ribbon clumps, shade the depth underneath, and finish with subtle flyaways.\n\nSave this reel for your next portrait! 📌\n\n#HairDrawing #NikhilArts #PencilSketch #HairTutorial #PortraitArt',
      hashtags: ['#HairDrawing', '#NikhilArts', '#PencilSketch', '#HairTutorial', '#PortraitArt', '#DrawingReels'],
      cta: 'सेव करें ताकि स्केचिंग करते समय आसानी से रेफर कर सकें!',
      thumbnailIdea: 'Extreme close-up of glossy textured graphite curls with title "THE RIBBON METHOD".',
      scheduledDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      scheduledTime: '18:30',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ap_item_5',
      brandId: 'brand_arts',
      topic: 'Acrylic Canvas Speedpainting: Mountain Sunset',
      concept: 'Fast-paced vibrant palette knife landscape painting with heavy acrylic textures.',
      hook: 'कैनवास पर पैलेट नाइफ का यह जादुई स्ट्रोक आपका मूड फ्रेश कर देगा!',
      category: 'Painting',
      platform: 'YouTube Shorts',
      duration: '60s',
      language: 'hindi',
      status: 'Idea',
      scriptText: `[0:00 - 0:04] Scene 1 (Hook):\nVisual: Palette knife scooping thick glowing orange and magenta acrylic paint.\nDialogue: "तैयार हो जाइए 60 सेकंड के सबसे रिलैक्सिंग पेंटिंग सेशन के लिए!"\n\n[0:04 - 0:40] Scene 2 (Painting):\nVisual: ASMR knife scrape on canvas, slicing mountain peaks and glowing horizon.\nDialogue: "पैलेट नाइफ की यही खासियत है—हर स्ट्रोक में एक अनूठी बनावट और गहराई आती है।"\n\n[0:40 - 1:00] Scene 3 (Reveal & Rating):\nVisual: Peeling off the border tape to reveal crisp white edges.\nDialogue: "कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!"`,
      scenes: [
        { sceneNumber: 1, timestamp: '0:00 - 0:04', visualCues: 'Macro shot of thick acrylic paint swirl on knife blade', dialogue: 'तैयार हो जाइए 60 सेकंड के रिलैक्सिंग आर्ट सेशन के लिए!', onScreenText: '🎨 ASMR Palette Knife Painting', sfx: 'Paint squelch' },
        { sceneNumber: 2, timestamp: '0:04 - 0:40', visualCues: 'Crisp scrapes sculpting mountain ridges and sun flare', dialogue: 'हर स्ट्रोक में एक अनूठी बनावट और गहराई आती है।', onScreenText: 'Texture & Mountain Ridges', sfx: 'Satisfying knife scrape' },
        { sceneNumber: 3, timestamp: '0:40 - 1:00', visualCues: 'Satisfying tape peel revealing sharp border with sign', dialogue: 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!', onScreenText: 'Tape Peel Reveal ✨ Rate 1-10', sfx: 'Tape peel sound' }
      ],
      voiceover: 'तैयार हो जाइए 60 सेकंड के रिलैक्सिंग आर्ट सेशन के लिए! हर स्ट्रोक में एक अनूठी बनावट और गहराई आती है। कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!',
      onScreenText: '🎨 ASMR Palette Knife Painting\nTexture & Mountain Ridges\nTape Peel Reveal ✨ Rate 1-10',
      titleOptions: [
        'Satisfying Acrylic Mountain Speedpaint (Tape Peel ASMR)',
        'पैलेट नाइफ से सनसेट पेंटिंग बनाने का सबसे सुकून भरा तरीका',
        'Heavy Texture Palette Knife Painting Timelapse'
      ],
      selectedTitle: 'Satisfying Acrylic Mountain Speedpaint (Tape Peel ASMR)',
      caption: '🏔️ Sunset Mountains Acrylic Speedpainting!\n\nUsing heavy body acrylics and an angled palette knife to create deep textural layers. Wait for the satisfying tape peel at the end! ✨\n\nRate this painting 1 to 10 in the comments below! 👇\n\n#PaletteKnife #AcrylicPainting #SatisfyingArt #TapePeel #NikhilArts',
      hashtags: ['#PaletteKnife', '#AcrylicPainting', '#SatisfyingArt', '#TapePeel', '#NikhilArts', '#SpeedPainting', '#LandscapeArt'],
      cta: 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!',
      thumbnailIdea: 'The moment the tape is peeled away showing the vivid magenta sunset and thick textured knife ridges with text "SATISFYING TAPE PEEL".',
      scheduledDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      scheduledTime: '19:00',
      createdAt: new Date().toISOString()
    }
  ];

  return { ideas, scripts, projects, calendarItems, analytics, autopilotPlans };
}

// Storage API
export const StorageService = {
  getBrands(): Brand[] {
    const brands = getStorage<Brand[]>('brands', []);
    if (!brands || brands.length === 0) {
      setStorage('brands', DEFAULT_BRANDS);
      return DEFAULT_BRANDS;
    }
    return brands;
  },

  saveBrand(brand: Brand): Brand[] {
    const brands = this.getBrands();
    const index = brands.findIndex(b => b.id === brand.id);
    let updated: Brand[];
    if (index >= 0) {
      updated = [...brands];
      updated[index] = brand;
    } else {
      updated = [...brands, brand];
    }
    setStorage('brands', updated);
    return updated;
  },

  deleteBrand(brandId: string): Brand[] {
    const brands = this.getBrands().filter(b => b.id !== brandId);
    setStorage('brands', brands);
    return brands;
  },

  getActiveBrandId(): string {
    return getStorage<string>('active_brand_id', 'brand_personal');
  },

  setActiveBrandId(brandId: string): void {
    setStorage('active_brand_id', brandId);
  },

  // Ideas
  getIdeas(brandId?: string): ContentIdea[] {
    let ideas = getStorage<ContentIdea[]>('ideas', []);
    if (ideas.length === 0) {
      const seed = getInitialSeedData();
      setStorage('ideas', seed.ideas);
      ideas = seed.ideas;
    }
    return brandId ? ideas.filter(i => i.brandId === brandId) : ideas;
  },

  saveIdea(idea: ContentIdea): void {
    const ideas = getStorage<ContentIdea[]>('ideas', []);
    const idx = ideas.findIndex(i => i.id === idea.id);
    if (idx >= 0) {
      ideas[idx] = idea;
    } else {
      ideas.unshift(idea);
    }
    setStorage('ideas', ideas);
  },

  deleteIdea(id: string): void {
    const ideas = getStorage<ContentIdea[]>('ideas', []).filter(i => i.id !== id);
    setStorage('ideas', ideas);
  },

  toggleFavoriteIdea(id: string): void {
    const ideas = getStorage<ContentIdea[]>('ideas', []);
    const item = ideas.find(i => i.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      setStorage('ideas', ideas);
    }
  },

  // Scripts
  getScripts(brandId?: string): Script[] {
    let scripts = getStorage<Script[]>('scripts', []);
    if (scripts.length === 0) {
      const seed = getInitialSeedData();
      setStorage('scripts', seed.scripts);
      scripts = seed.scripts;
    }
    return brandId ? scripts.filter(s => s.brandId === brandId) : scripts;
  },

  saveScript(script: Script): void {
    const scripts = getStorage<Script[]>('scripts', []);
    const idx = scripts.findIndex(s => s.id === script.id);
    if (idx >= 0) {
      scripts[idx] = script;
    } else {
      scripts.unshift(script);
    }
    setStorage('scripts', scripts);
  },

  deleteScript(id: string): void {
    const scripts = getStorage<Script[]>('scripts', []).filter(s => s.id !== id);
    setStorage('scripts', scripts);
  },

  // Projects
  getProjects(brandId?: string): VideoProject[] {
    let projects = getStorage<VideoProject[]>('projects', []);
    if (projects.length === 0) {
      const seed = getInitialSeedData();
      setStorage('projects', seed.projects);
      projects = seed.projects;
    }
    return brandId ? projects.filter(p => p.brandId === brandId) : projects;
  },

  saveProject(project: VideoProject): void {
    const projects = getStorage<VideoProject[]>('projects', []);
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setStorage('projects', projects);
  },

  deleteProject(id: string): void {
    const projects = getStorage<VideoProject[]>('projects', []).filter(p => p.id !== id);
    setStorage('projects', projects);
  },

  // Calendar
  getCalendarItems(brandId?: string): ContentItem[] {
    let items = getStorage<ContentItem[]>('calendar', []);
    if (items.length === 0) {
      const seed = getInitialSeedData();
      setStorage('calendar', seed.calendarItems);
      items = seed.calendarItems;
    }
    return brandId ? items.filter(c => c.brandId === brandId) : items;
  },

  saveCalendarItem(item: ContentItem): void {
    const items = getStorage<ContentItem[]>('calendar', []);
    const idx = items.findIndex(c => c.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    setStorage('calendar', items);
  },

  deleteCalendarItem(id: string): void {
    const items = getStorage<ContentItem[]>('calendar', []).filter(c => c.id !== id);
    setStorage('calendar', items);
  },

  // Analytics
  getAnalytics(brandId?: string): AnalyticsEntry[] {
    let list = getStorage<AnalyticsEntry[]>('analytics', []);
    if (list.length === 0) {
      const seed = getInitialSeedData();
      setStorage('analytics', seed.analytics);
      list = seed.analytics;
    }
    return brandId ? list.filter(a => a.brandId === brandId) : list;
  },

  saveAnalyticsEntry(entry: AnalyticsEntry): void {
    const list = getStorage<AnalyticsEntry[]>('analytics', []);
    const idx = list.findIndex(a => a.id === entry.id);
    if (idx >= 0) {
      list[idx] = entry;
    } else {
      list.unshift(entry);
    }
    setStorage('analytics', list);
  },

  deleteAnalyticsEntry(id: string): void {
    const list = getStorage<AnalyticsEntry[]>('analytics', []).filter(a => a.id !== id);
    setStorage('analytics', list);
  },

  // Auto-Pilot Plans
  getAutoPilotPlans(brandId?: string): AutoPilotPlanItem[] {
    let list = getStorage<AutoPilotPlanItem[]>('autopilot_plans', []);
    if (list.length === 0) {
      const seed = getInitialSeedData();
      setStorage('autopilot_plans', seed.autopilotPlans);
      list = seed.autopilotPlans;
    }
    return brandId ? list.filter(p => p.brandId === brandId) : list;
  },

  saveAutoPilotPlanItem(item: AutoPilotPlanItem): void {
    const list = getStorage<AutoPilotPlanItem[]>('autopilot_plans', []);
    const idx = list.findIndex(p => p.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setStorage('autopilot_plans', list);
  },

  saveAutoPilotPlanItems(items: AutoPilotPlanItem[]): void {
    const list = getStorage<AutoPilotPlanItem[]>('autopilot_plans', []);
    const map = new Map(list.map(i => [i.id, i]));
    items.forEach(i => map.set(i.id, i));
    setStorage('autopilot_plans', Array.from(map.values()));
  },

  deleteAutoPilotPlanItem(id: string): void {
    const list = getStorage<AutoPilotPlanItem[]>('autopilot_plans', []).filter(p => p.id !== id);
    setStorage('autopilot_plans', list);
  },

  clearAutoPilotPlan(brandId: string): void {
    const list = getStorage<AutoPilotPlanItem[]>('autopilot_plans', []).filter(p => p.brandId !== brandId);
    setStorage('autopilot_plans', list);
  },

  // Art Business Stats
  getArtBusinessStats(brandId: string): ArtBusinessStats {
    const defaultStats: ArtBusinessStats = brandId === 'brand_arts'
      ? {
          totalCourses: 4,
          students: 1250,
          digitalProducts: 8,
          completedOrders: 412,
          baseOrders: 420,
          baseRevenue: 285000
        }
      : {
          totalCourses: 2,
          students: 540,
          digitalProducts: 4,
          completedOrders: 180,
          baseOrders: 185,
          baseRevenue: 120000
        };
    return getStorage<ArtBusinessStats>(`art_business_${brandId}`, defaultStats);
  },

  saveArtBusinessStats(brandId: string, stats: ArtBusinessStats): void {
    setStorage(`art_business_${brandId}`, stats);
  },

  // Saved AI Messages
  getChatHistory(brandId: string): AiChatMessage[] {
    return getStorage<AiChatMessage[]>(`chat_${brandId}`, [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: `Hey Nikhil! Welcome to your personal **Nikhil AI Studio**. I'm your dedicated content strategist, ready to craft high-retention hooks, full scripts, and viral concepts in Hindi, Hinglish, or English. How can I help you create today?`,
        timestamp: new Date().toISOString(),
        platform: 'Instagram Reel',
        language: 'hinglish'
      }
    ]);
  },

  saveChatHistory(brandId: string, messages: AiChatMessage[]): void {
    setStorage(`chat_${brandId}`, messages);
  },

  // Video Studio History & Saved Videos
  getVideoStudioHistory(brandId: string): AiGeneratedVideo[] {
    const defaultHistory: AiGeneratedVideo[] = [
      {
        id: 'vid_sample_1',
        brandId,
        title: 'Realistic Krishna Portrait with Pencil on White Paper',
        prompt: 'Create a cinematic 10-second video of an artist drawing a realistic Krishna portrait with a pencil on white paper. Close-up shots of the hand, pencil movement and final artwork reveal. Warm studio lighting, realistic details, smooth camera movement.',
        enhancedPrompt: 'Cinematic art-studio sequence showing an artist crafting an intricate graphite portrait of Lord Krishna on textured ivory paper. Scene opens with a dynamic macro close-up of a 4B pencil gliding across the page, capturing the crown (Mukut) detail. Camera glides gracefully tracking hand movements with shallow depth of field, revealing delicate shading of the eyes and flute. Golden hour studio rim light casts warm highlights across the paper. Culminates in a smooth pull-back dolly shot unveiling the breathtaking completed masterpiece.',
        settings: {
          aspectRatio: '9:16',
          duration: 10,
          resolution: '1080p',
          style: 'Cinematic',
          camera: 'Cinematic'
        },
        scenes: [
          {
            id: 'scene_s1_1',
            sceneNumber: 1,
            title: 'Paper & Guideline Prep',
            prompt: 'Extreme close-up: Artist hand gently smoothing paper, laying initial geometric proportions for Krishna face.',
            duration: 2,
            camera: 'Close-up',
            transition: 'Cross Dissolve'
          },
          {
            id: 'scene_s1_2',
            sceneNumber: 2,
            title: 'Eyes & Expression Shading',
            prompt: 'Macro tracking shot: Pencil tip feathering delicate graphite gradients across the lotus eyes and peacock feather.',
            duration: 3,
            camera: 'Tracking',
            transition: 'Cross Dissolve'
          },
          {
            id: 'scene_s1_3',
            sceneNumber: 3,
            title: 'Mukut & Flute Highlights',
            prompt: 'Slow tilt: Blending stump smoothing deep contrasts, white charcoal pencil popping luminous ornaments and flute reflections.',
            duration: 3,
            camera: 'Tilt',
            transition: 'Zoom In'
          },
          {
            id: 'scene_s1_4',
            sceneNumber: 4,
            title: 'Masterpiece Reveal',
            prompt: 'Smooth cinematic crane/dolly back: Studio lights warming as full realistic portrait is unveiled with artist signature.',
            duration: 2,
            camera: 'Cinematic',
            transition: 'Fade to Black'
          }
        ],
        totalDuration: 10,
        status: 'ready',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
        isSaved: true,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'vid_sample_2',
        brandId,
        title: '3D Speed Painting & Color Splash Reel',
        prompt: 'Vibrant acrylic colors splashing onto canvas in slow motion, artist brush stroking vibrant neon palette, hyperrealistic lighting.',
        enhancedPrompt: 'High-speed cinematic phantom capture of vivid cobalt blue and cadmium orange acrylic paints colliding onto black gesso canvas. Dynamic slow-motion fluid dynamics at 1000fps, macro brush fibers carving clean energetic strokes with volumetric studio neon backlight and atmospheric mist.',
        settings: {
          aspectRatio: '16:9',
          duration: 8,
          resolution: '1080p',
          style: 'Art',
          camera: 'Close-up'
        },
        scenes: [
          {
            id: 'scene_s2_1',
            sceneNumber: 1,
            title: 'Fluid Paint Drop',
            prompt: 'Slow motion macro impact: Pigment droplet hitting canvas surface creating radial bloom.',
            duration: 3,
            camera: 'Close-up',
            transition: 'Cross Dissolve'
          },
          {
            id: 'scene_s2_2',
            sceneNumber: 2,
            title: 'Palette Knife Sweep',
            prompt: 'Tracking side angle: Metal palette knife carving crisp impasto textures across canvas.',
            duration: 3,
            camera: 'Tracking',
            transition: 'Whip Pan'
          },
          {
            id: 'scene_s2_3',
            sceneNumber: 3,
            title: 'Widescreen Gallery Reveal',
            prompt: 'Dolly out shot: Contemporary art studio displaying vibrant textured abstract painting.',
            duration: 2,
            camera: 'Dolly',
            transition: 'Fade to Black'
          }
        ],
        totalDuration: 8,
        status: 'ready',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80',
        isSaved: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    return getStorage<AiGeneratedVideo[]>(`video_history_${brandId}`, defaultHistory);
  },

  saveVideoStudioHistory(brandId: string, history: AiGeneratedVideo[]): void {
    setStorage(`video_history_${brandId}`, history);
  },

  getSavedVideos(brandId: string): AiGeneratedVideo[] {
    const history = this.getVideoStudioHistory(brandId);
    return history.filter(v => v.isSaved);
  },

  saveSavedVideo(brandId: string, video: AiGeneratedVideo): void {
    const history = this.getVideoStudioHistory(brandId);
    const existingIdx = history.findIndex(v => v.id === video.id);
    let updated: AiGeneratedVideo[];
    if (existingIdx >= 0) {
      updated = [...history];
      updated[existingIdx] = { ...video, isSaved: true };
    } else {
      updated = [{ ...video, isSaved: true }, ...history];
    }
    this.saveVideoStudioHistory(brandId, updated);
  },

  deleteSavedVideo(brandId: string, videoId: string): void {
    const history = this.getVideoStudioHistory(brandId);
    const updated = history.map(v => v.id === videoId ? { ...v, isSaved: false } : v);
    this.saveVideoStudioHistory(brandId, updated);
  },

  // Export / Import Full Database Backup
  exportAllData(): string {
    const exportObject = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      brands: this.getBrands(),
      ideas: getStorage('ideas', []),
      scripts: getStorage('scripts', []),
      projects: getStorage('projects', []),
      calendar: getStorage('calendar', []),
      analytics: getStorage('analytics', []),
      autopilotPlans: getStorage('autopilot_plans', [])
    };
    return JSON.stringify(exportObject, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      // Security: Strip prototype pollution keys during JSON deserialization
      const parsed = JSON.parse(jsonString, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return undefined;
        }
        return value;
      });

      // Validate array structures before committing to persistent storage
      if (Array.isArray(parsed.brands)) setStorage('brands', parsed.brands);
      if (Array.isArray(parsed.ideas)) setStorage('ideas', parsed.ideas);
      if (Array.isArray(parsed.scripts)) setStorage('scripts', parsed.scripts);
      if (Array.isArray(parsed.projects)) setStorage('projects', parsed.projects);
      if (Array.isArray(parsed.calendar)) setStorage('calendar', parsed.calendar);
      if (Array.isArray(parsed.analytics)) setStorage('analytics', parsed.analytics);
      if (Array.isArray(parsed.autopilotPlans)) setStorage('autopilot_plans', parsed.autopilotPlans);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
};

export const storageService = StorageService;

