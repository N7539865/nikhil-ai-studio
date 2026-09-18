// server/providers/mockGenerator.js
// Intelligent creator engine for Nikhil AI Studio
// Strictly supports 100% English, 100% Hindi (Devanagari), and natural mixed Hinglish

export function generateMockResponse(type, data) {
  const brand = data.brand || { name: 'Nikhil', creatorName: 'Nikhil', niches: 'Tech, Creativity & Digital Trends' };
  const lang = (data.language || 'hinglish').toLowerCase();
  const platform = data.platform || 'Instagram Reel';

  switch (type) {
    case 'chat':
      return handleChat(data, brand, lang, platform);
    case 'ideas':
      return handleIdeas(data, brand, lang, platform);
    case 'script':
      return handleScript(data, brand, lang, platform);
    case 'titles':
      return handleTitles(data, brand, lang, platform);
    case 'prompts':
      return handlePrompts(data, brand, lang);
    case 'autopilot':
      return handleAutoPilot(data, brand, lang, platform);
    case 'autopilot-plan':
      return handleAutoPilotPlan(data, brand, lang, platform);
    default:
      return { success: true, text: 'Nikhil AI Studio ready.' };
  }
}

function handleChat(data, brand, lang, platform) {
  const prompt = (data.prompt || '').toLowerCase();
  const brandId = brand.id || '';
  const isArt = brandId === 'brand_arts' || (brand.niches && /art|paint|illustrat/i.test(brand.niches));
  const isGaming = brandId === 'brand_gaming' || (brand.niches && /gaming|esport|clutch/i.test(brand.niches));
  const isComedy = brandId === 'brand_comedy' || (brand.niches && /comedy|skit|humor/i.test(brand.niches));
  const isTelecom = brandId === 'brand_devpri' || (brand.niches && /telecom|smartphone|phone/i.test(brand.niches));

  const wantsScript = /script|word-for-word|generate|haan|yes|bolo|kar do|banao|scenes/i.test(prompt);

  let reply = '';

  if (wantsScript) {
    if (isArt) {
      if (lang === 'english') {
        reply = `Here is your word-for-word script for **${brand.name || 'Nikhil Arts'}** (${platform}):\n\n` +
          `🎬 **Title:** From 90s Vintage Photo to Digital Masterpiece\n` +
          `⏱️ **Duration:** 30–45s | **Audio Track:** Lo-fi nostalgic beat with subtle retro vinyl crackle\n\n` +
          `**[0:00 - 0:03] Scene 1 (Hook):**\n` +
          `• **Visual:** Quick zoom into the retro photo with "ज़िंदगी एक सफ़र है सुहाना" board and denim jacket, sudden paper-tear transition.\n` +
          `• **Voiceover:** "They don't make aesthetic vibes like the 90s anymore... so I decided to turn this photograph into a hand-crafted artwork."\n` +
          `• **On-Screen Text:** 🎨 90s Vintage Art Reel\n\n` +
          `**[0:03 - 0:15] Scene 2 (The Sketch & Layering):**\n` +
          `• **Visual:** Timelapse of digital stylus blocking out the silhouette of the classic car, the sunglasses, and the jacket textures.\n` +
          `• **Voiceover:** "The hardest part? Capturing that warm golden-hour lighting bouncing off the chrome grill and the denim folds."\n` +
          `• **On-Screen Text:** Step 1: Textured Linework & Shadows\n\n` +
          `**[0:15 - 0:30] Scene 3 (The Final Render):**\n` +
          `• **Visual:** Rapid opacity wipe revealing the finished, vibrant painted portrait side-by-side with the real photo.\n` +
          `• **Voiceover:** "Look at how the film grain and oil texture bring the nostalgic feeling to life."\n` +
          `• **On-Screen Text:** ✨ Final Painting Reveal\n\n` +
          `**[0:30 - 0:40] Scene 4 (Outro & CTA):**\n` +
          `• **Visual:** Host holding the stylus with a smile, showing the full canvas.\n` +
          `• **Voiceover:** "${brand.defaultCta || 'How would you rate this painting from 1 to 10? Drop your rating in the comments!'}"\n` +
          `• **On-Screen Text:** Rate 1 to 10 in Comments! 👇`;
      } else if (lang === 'hindi') {
        reply = `यह रहा **${brand.name || 'निखिल आर्ट्स'}** के लिए आपका पूरा दृश्य-वार (सीन-बाय-सीन) वॉइसओवर स्क्रिप्ट:\n\n` +
          `🎬 **शीर्षक:** 90 के दशक की विंटेज तस्वीर से बनी सुंदर डिजिटल पेंटिंग\n` +
          `⏱️ **अवधि:** 30–45 सेकंड | **ऑडियो:** धीमी विंटेज धुन और विनाइल क्रैकल\n\n` +
          `**[0:00 - 0:03] दृश्य 1 (हुक):**\n` +
          `• **दृश्य:** विंटेज कार और "ज़िंदगी एक सफ़र है सुहाना" बोर्ड पर त्वरित ज़ूम, फिर तुरंत स्केच कैनवास में ट्रांज़िशन।\n` +
          `• **वॉइसओवर:** "90 के दशक जैसी सादगी और अंदाज़ अब कहाँ मिलता है... इसलिए मैंने इस तस्वीर को एक हाथ से बनी पेंटिंग में बदल दिया।"\n` +
          `• **ऑन-स्क्रीन टेक्स्ट:** 🎨 90s रेट्रो आर्ट प्रोसेस\n\n` +
          `**[0:03 - 0:15] दृश्य 2 (स्केच और शेडिंग):**\n` +
          `• **दृश्य:** डिजिटल स्टाइलस से कार की क्रोम ग्रिल और डेनिम जैकेट की परतों पर शेडिंग का टाइमलैप्स।\n` +
          `• **वॉइसओवर:** "सबसे मुश्किल काम था धूप की सुनहरी चमक और उस क्लासिक कार के विंटेज रंगों को जीवंत करना।"\n` +
          `• **ऑन-स्क्रीन टेक्स्ट:** चरण 1: टेक्सचर्ड लाइनवर्क और छाया\n\n` +
          `**[0:15 - 0:30] दृश्य 3 (अंतिम परिणाम):**\n` +
          `• **दृश्य:** मूल तस्वीर और तैयार कलाकृति का सुंदर स्लाइडर रिवील।\n` +
          `• **वॉइसओवर:** "देखिए कैसे हर एक ब्रश-स्ट्रोक ने इस विंटेज याद को एक अमर कलाकृति बना दिया।"\n` +
          `• **ऑन-स्क्रीन टेक्स्ट:** ✨ अंतिम पेंटिंग परिणाम\n\n` +
          `**[0:30 - 0:40] दृश्य 4 (समाप्ति व CTA):**\n` +
          `• **वॉइसओवर:** "${brand.defaultCta || 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!'}"\n` +
          `• **ऑन-स्क्रीन टेक्स्ट:** कमेंट्स में 1 से 10 तक रेटिंग दें! 👇`;
      } else {
        // Hinglish
        reply = `Haan Nikhil! Ye raha **${brand.name || 'Nikhil Arts'}** ke liye word-for-word viral-ready voiceover script:\n\n` +
          `🎬 **Reel Concept:** 90s Retro Bollywood Aesthetic Photo to Digital Art Masterpiece\n` +
          `⏱️ **Duration:** 35–45s | **Audio Recommendation:** Kishore Kumar / Retro Lo-fi instrumental beat\n\n` +
          `**[0:00 - 0:04] Scene 1 (Pattern-Interrupt Hook):**\n` +
          `• **Visual:** Photo pe slow dramatic punch-in (focusing on the classic car & "ज़िंदगी एक सफ़र है सुहाना" board), sudden brush stroke wipe!\n` +
          `• **Voiceover:** "90s ka cinema aesthetic aur vintage Bollywood vibe... jab maine is retro photo ko dekha, toh mujhse raha nahi gaya aur maine iska ek complete painting bana daala!"\n` +
          `• **On-Screen Text:** 🚨 Wait for the final painting!\n` +
          `• **SFX:** Camera shutter + Whoosh brush sound\n\n` +
          `**[0:04 - 0:18] Scene 2 (The Process & Detailing):**\n` +
          `• **Visual:** High-speed screen recording: Stylus blocking out the denim jacket texture, chrome reflections on the vintage car hood, and warm sunset highlights.\n` +
          `• **Voiceover:** "Sabse tricky part tha denim folds ki lighting aur retro sunglasses par reflection catch karna. Har ek brush stroke mein 90s film grain ka feel aana chahiye tha."\n` +
          `• **On-Screen Text:** 🎨 Layering & Retro Lighting Textures\n` +
          `• **SFX:** Fast sketching / pencil scribbling ASMR\n\n` +
          `**[0:18 - 0:32] Scene 3 (The Masterpiece Reveal):**\n` +
          `• **Visual:** Dramatic split-screen slider: Left side original photo, right side hyper-aesthetic painted illustration.\n` +
          `• **Voiceover:** "And look at this final artwork! Ye photo se bhi zyada nostalgic aur cinematic lag raha hai!"\n` +
          `• **On-Screen Text:** ✨ Before vs After Painting Reveal\n` +
          `• **SFX:** Cinematic swell + Shimmer ding\n\n` +
          `**[0:32 - 0:42] Scene 4 (Retention Loop & CTA):**\n` +
          `• **Visual:** Full-screen zoom into the finished artwork details with pointer to comments.\n` +
          `• **Voiceover:** "${brand.defaultCta || 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!'} Aur agar agla artwork dekhna chahte ho, toh abhi follow kar lo!"\n` +
          `• **On-Screen Text:** Rate 1 - 10 In Comments! 👇\n\n` +
          `📌 **Suggested Hashtags:** #NikhilArts #SpeedPainting #DigitalIllustration #RetroAesthetic #VintageVibes #ZindagiEkSafarHaiSuhana #90sBollywood #ArtReels #ProcreateArtist`;
      }
      return {
        success: true,
        text: reply,
        model: `Nikhil AI Studio Engine (${lang.toUpperCase()})`
      };
    }
  }

  // Default strategic chat response tailored to niche
  let hook = 'Stop scrolling if you want to double your reach without spending any money on advertising.';
  if (isArt) {
    hook = lang === 'english'
      ? 'They don\'t make aesthetic vibes like the 90s anymore — watch how this photograph becomes a painting.'
      : (lang === 'hindi'
        ? '90 के दशक का वो क्लासिक अंदाज़ देखिए कैसे एक खूबसूरत पेंटिंग में बदल गया!'
        : 'Ye 90s retro photo dekh rahe ho? Dekho kaise isse maine ek aesthetic painting mein convert kiya!');
  } else if (isGaming) {
    hook = lang === 'english'
      ? 'Everyone thought this round was completely lost until this 1v4 clutch happened.'
      : (lang === 'hindi'
        ? 'सबको लगा मैच हाथ से निकल गया, तभी यह 1v4 क्लच हुआ!'
        : 'Sabko laga tha game khatam hai, tabhi ye impossible clutch ho gaya!');
  } else if (isComedy) {
    hook = lang === 'english'
      ? 'Every Indian household has that one person who always does this.'
      : (lang === 'hindi'
        ? 'हर भारतीय घर में एक इंसान ऐसा जरूर होता है जो हमेशा यही करता है!'
        : 'Har ghar mein ek aisa dost ya rishtedaar zaroor hota hai!');
  } else if (isTelecom) {
    hook = lang === 'english'
      ? 'Is spending extra money on a flagship phone really worth it in 2026?'
      : (lang === 'hindi'
        ? 'क्या 2026 में महंगा फ्लैगशिप फोन लेना सच में समझदारी है?'
        : 'Kya 50,000 extra kharch karna worth hai ya budget phone hi kaafi hai?');
  }

  if (lang === 'english') {
    reply = `Hello ${brand.creatorName || 'Nikhil'}! Here is a dedicated creator strategy for your **${platform}** targeting peak viewer engagement in the ${brand.niches || 'Creative'} space:\n\n` +
      `🚀 **High-Retention Hook:** "${hook}"\n\n` +
      `📋 **Creator Strategy Framework:**\n` +
      `1. **First 3 Seconds:** Instant visual pattern-interrupt — begin directly in the middle of an action or camera motion.\n` +
      `2. **High-Value Delivery:** Deliver 2 practical, actionable insights without long introductions or unnecessary fluff.\n` +
      `3. **Seamless Retention Loop:** Frame your closing sentence so it flows cleanly back into your opening hook.\n\n` +
      `📢 **Suggested Call to Action (CTA):** "${brand.defaultCta || 'Follow for daily high-value creator breakdowns!'}"\n\n` +
      `Would you like me to refine this hook, generate 10 title options, or draft the full scene-by-scene script?`;
  } else if (lang === 'hindi') {
    reply = `नमस्ते ${brand.creatorName || 'Nikhil'}! आपके **${platform}** के लिए (${brand.name || 'Nikhil Studio'}) यह रही एक अत्यंत प्रभावी और व्यावहारिक रणनीति:\n\n` +
      `🔥 **उच्च-अवधारण हुक (High-Retention Hook):** "${hook}"\n\n` +
      `📌 **कंटेंट रणनीति ढांचा:**\n` +
      `1. **शुरुआती 3 सेकंड:** तत्काल विजुअल पैटर्न-इंटरप्ट — बिना किसी लंबी भूमिका के सीधे मुख्य दृश्य से शुरुआत करें।\n` +
      `2. **मूल्यवान जानकारी:** बिना समय गंवाए मुख्य रचनात्मक प्रक्रिया प्रस्तुत करें ताकि दर्शक अंत तक जुड़े रहें।\n` +
      `3. **सीमलेस लूप तकनीक:** अंतिम वाक्य को इस तरह समाप्त करें कि वह पुनः शुरुआती हुक से स्वाभाविक रूप से जुड़ जाए।\n\n` +
      `📢 **सुझाया गया कॉल-टू-एक्शन (CTA):** "${brand.defaultCta || 'कैसी लगी यह कलाकृति? कमेंट्स में बताएं!'}"\n\n` +
      `क्या आप चाहते हैं कि मैं इसका पूरा दृश्य-वार (सीन-बाय-सीन) स्क्रिप्ट तैयार करूँ?`;
  } else {
    // Hinglish
    reply = `Hey ${brand.creatorName || 'Nikhil'}! For your **${platform}** in the ${brand.niches || 'Creative/Tech'} space, here is how we can make this super engaging:\n\n` +
      `🎯 **High-Retention Hook:** "${hook}"\n\n` +
      `🧠 **Creator Strategy Breakdown:**\n` +
      `1. **First 3 Seconds:** Rapid pattern-interrupt — start in the middle of an action or sound effect.\n` +
      `2. **Value Stacking:** Deliver 2 high-impact actionable points without any fluff or long intros.\n` +
      `3. **Loop Technique:** End the sentence such that it seamlessly flows back into the opening hook.\n\n` +
      `📢 **Suggested CTA:** "${brand.defaultCta || 'Save this reel & share with a creator friend!'}"\n\n` +
      `Aap bolo toh main iska word-for-word voiceover script generate kar doon?`;
  }


  return {
    success: true,
    text: reply,
    model: `Nikhil AI Studio Engine (${lang.toUpperCase()})`
  };
}

function handleIdeas(data, brand, lang, platform) {
  const niche = data.niche || 'Tech & Digital Creation';
  const category = data.category || 'Educational';
  const duration = data.duration || '45-60s';

  let ideas = [];

  if (lang === 'english') {
    ideas = [
      {
        id: 'idea_' + Date.now() + '_1',
        title: `${niche}: 3 Game-Changing Secrets Nobody Is Talking About`,
        hook: "90% of people still have this essential feature turned off — here is why that is a costly mistake.",
        concept: `A fast-paced, high-utility breakdown exposing hidden optimization tips in ${niche}. Uses dynamic zoom-ins, screen recordings, and before/after comparisons to boost viewer watch time.`,
        suggestedShots: [
          "0-3s: Tight close-up looking directly into the lens with an urgent expression",
          "3-15s: Fast screen recording with glowing red circles pointing to the key menu",
          "15-30s: Side-by-side performance test comparison showing dramatic difference",
          "30-45s: Host on camera showing final result with high energy and smooth outro"
        ],
        cta: "Save this video right now so you can refer to it later!",
        caption: `🔥 If you work with ${niche}, this simple workflow change makes all the difference. Try these exact steps and see the results yourself!\n\nTag a friend who needs to see this! 👇`,
        hashtags: ["#TechTips", "#CreatorHacks", "#VideoGrowth", "#DailyProductivity", "#SmartWorkflow"],
        platform,
        niche,
        category,
        language: 'english',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'idea_' + Date.now() + '_2',
        title: `Mistake vs Masterstroke: The Real Truth About ${niche}`,
        hook: "Stop doing this immediately unless you want to lose your hard-earned audience engagement.",
        concept: `Debunking a widespread myth in ${niche}. Explains why conventional advice fails in 2026 and provides a modern, proven alternative.`,
        suggestedShots: [
          "0-3s: Host waving hand across the lens with buzzer sound effect",
          "3-18s: Bold red animated X over the outdated method with critical reaction",
          "18-40s: Clean green checkmark demonstration of the correct modern method",
          "40-50s: Quick summary card on screen with finger-pointing to follow button"
        ],
        cta: "Follow for more objective, fluff-free creator breakdowns!",
        caption: `Don't fall for outdated advice that stopped working years ago. Here is what actually delivers results today. Bookmark this before you forget! 📌`,
        hashtags: ["#ContentStrategy", "#CreatorTips", "#ShortsGrowth", "#WorkflowOptimization", "#DigitalCreation"],
        platform,
        niche,
        category,
        language: 'english',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'idea_' + Date.now() + '_3',
        title: `Behind The Scenes: How Professional Creators Structure ${niche}`,
        hook: "Here is what top creators never show you on camera: The unfiltered truth.",
        concept: `Authentic storytelling demonstrating the exact planning, editing timeline, and lessons learned behind high-performing videos. Builds deep community trust.`,
        suggestedShots: [
          "0-3s: Atmospheric studio desk with glowing monitors in timelapse",
          "3-20s: Rapid jumpcuts of script editing, voiceover recording, and timeline cuts",
          "20-45s: Final render notification and smiling host previewing the finished video",
          "45-60s: Key takeaway message encouraging creators to build consistent habits"
        ],
        cta: "Which step in your creative process takes the longest? Share below!",
        caption: `Behind every concise 60-second video is deliberate planning and experimentation. Consistency beats perfection every single time. What are you building this week? 🚀`,
        hashtags: ["#CreatorJourney", "#StudioVlog", "#BehindTheScenes", "#CreativeProcess", "#Discipline"],
        platform,
        niche,
        category,
        language: 'english',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
    ];
  } else if (lang === 'hindi') {
    ideas = [
      {
        id: 'idea_' + Date.now() + '_1',
        title: `${niche}: 3 गुप्त रहस्य जिनके बारे में कोई बात नहीं कर रहा`,
        hook: "क्या आपको पता है 90% लोग इस जरूरी सेटिंग को बंद करना भूल जाते हैं?",
        concept: `${niche} में छिपे हुए महत्वपूर्ण सुझावों को उजागर करने वाली एक तेज गति वाली, ज्ञानवर्धक वीडियो प्रस्तुति। यह दर्शकों के वॉच-टाइम को दोगुना करने में मदद करती है।`,
        suggestedShots: [
          "0-3 सेकंड: कैमरे की ओर सीधे देखते हुए गंभीर और उत्सुकता भरे भाव के साथ क्लोज़-अप शॉट",
          "3-15 सेकंड: महत्वपूर्ण सेटिंग्स की ओर लाल घेरा बनाकर दिखाते हुए स्क्रीन रिकॉर्डिंग",
          "15-30 सेकंड: पुरानी और नई विधि के बीच स्पष्ट तुलना दिखाता दृश्य",
          "30-45 सेकंड: मुख्य परिणाम दिखाते हुए आत्मविश्वासपूर्ण समाप्ति"
        ],
        cta: "लाइक करें और ऐसी ही उपयोगी जानकारी के लिए हमें तुरंत फॉलो करें!",
        caption: `🔥 यदि आप ${niche} से जुड़े हैं, तो यह जानकारी आपके बहुत काम आएगी। इसे अभी सेव करें और अपने मित्रों के साथ साझा करें! 👇`,
        hashtags: ["#टेक_टिप्स", "#क्रिएटर_गाइड", "#वायरल_रील्स", "#दैनिक_कंटेंट", "#डिजिटल_ज्ञान"],
        platform,
        niche,
        category,
        language: 'hindi',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'idea_' + Date.now() + '_2',
        title: `गलती बनाम सही तरीका: ${niche} की असली सच्चाई`,
        hook: "अगर आप भी ऐसा कर रहे हैं, तो तुरंत रुक जाइए वरना भारी नुकसान हो सकता है!",
        concept: `${niche} से जुड़े एक आम भ्रम को दूर करना। दर्शकों को समझाएं कि पुराना तरीका क्यों विफल होता है और नया सही तरीका क्या है।`,
        suggestedShots: [
          "0-3 सेकंड: कैमरे के सामने हाथ हिलाते हुए चेतावनी का भाव",
          "3-18 सेकंड: गलत तरीके पर लाल क्रॉस एनीमेशन के साथ स्पष्टीकरण",
          "18-40 सेकंड: सही तरीके का स्पष्ट और चरणबद्ध प्रदर्शन",
          "40-50 सेकंड: स्क्रीन पर सारांश कार्ड और फॉलो करने का संकेत"
        ],
        cta: "सच्ची और व्यावहारिक जानकारी के लिए अभी फॉलो करें!",
        caption: `पुरानी और गलत सलाह से बचें। यह रहा 2026 का सबसे कारगर तरीका। इसे भूलने से पहले सेव कर लें! 📌`,
        hashtags: ["#सच्चाई", "#ट्रेंडिंग_शॉर्ट्स", "#क्रिएटर_सपोर्ट", "#स्मार्ट_तरीका", "#कंटेंट_ग्रोथ"],
        platform,
        niche,
        category,
        language: 'hindi',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'idea_' + Date.now() + '_3',
        title: `पर्दे के पीछे का सच: ${brand.name || 'निखिल स्टूडियो'} कैसे काम करता है`,
        hook: "कैमरे के पीछे क्या होता है? आइए मैं आपको बिना किसी बनावट के दिखाता हूँ।",
        concept: `वास्तविक कार्यप्रणाली, स्टूडियो सेटअप और वीडियो निर्माण की चुनौतियों को दर्शाने वाली भावनात्मक और प्रेरणादायक कहानी।`,
        suggestedShots: [
          "0-3 सेकंड: देर रात तक जलते हुए कंप्यूटर मॉनिटर का टाइमलैप्स",
          "3-20 सेकंड: स्क्रिप्ट लिखने, रिकॉर्डिंग और एडिटिंग के वास्तविक दृश्य",
          "20-45 सेकंड: अंतिम वीडियो रेंडर होने की खुशी और संतुष्टि",
          "45-60 सेकंड: नए क्रिएटर्स के लिए एक प्रेरणादायक संदेश"
        ],
        cta: "आपके वीडियो निर्माण में सबसे ज्यादा समय किस काम में लगता है? कमेंट्स में बताएं!",
        caption: `हर 60 सेकंड के वीडियो के पीछे घंटों का समर्पण होता है। निरंतरता हमेशा श्रेष्ठ होती है। आप इस सप्ताह क्या नया बना रहे हैं? 🚀`,
        hashtags: ["#क्रिएटर_सफर", "#स्टूडियो_व्लॉग", "#पर्दे_के_पीछे", "#रचनात्मकता", "#लगन"],
        platform,
        niche,
        category,
        language: 'hindi',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
    ];
  } else {
    // Hinglish
    ideas = [
      {
        id: 'idea_' + Date.now() + '_1',
        title: `${niche}: 3 Game-Changing Secrets Jo Koi Nahi Batata`,
        hook: "Ye ek setting off kiye bina phone mat chalana, warna regret karoge!",
        concept: `A fast-paced, high-utility breakdown exposing hidden optimization tips in ${niche}. Uses dynamic zoom-ins, screen recordings, and before/after comparisons to boost viewer watch time.`,
        suggestedShots: [
          "0-3s: Tight close-up looking directly at lens with an urgent expression",
          "3-15s: Fast screen recording with glowing red circles pointing to key menu",
          "15-30s: Side-by-side speed test comparison showing dramatic difference",
          "30-45s: Host on camera showing final result with high energy and smooth outro"
        ],
        cta: "Drop a comment 'GUIDE' and I will send the direct link!",
        caption: `🔥 Agar aap ${niche} use karte ho, toh ye trick aapka game badal degi. Try karke khud dekho!\n\nApne dost ke sath share karo jisko iski zaroorat hai! 👇`,
        hashtags: ["#TechTips", "#CreatorHacks", "#ReelsViral", "#NikhilAIStudio", "#DailyContent", "#SmartTech"],
        platform,
        niche,
        category,
        language: 'hinglish',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'idea_' + Date.now() + '_2',
        title: `Mistake vs Masterstroke: The Real Truth About ${niche}`,
        hook: "Agar aap bhi ye galti kar rahe ho, toh abhi ruko!",
        concept: `Debunking a common myth in ${niche}. Show why the popular advice is outdated and provide the 2026 battle-tested alternative that actually yields results.`,
        suggestedShots: [
          "0-3s: Host waving hand across lens with buzzer sound effect",
          "3-18s: Red 'X' animation over the wrong method with sarcastic reaction",
          "18-40s: Clean green checkmark demonstration of the correct method",
          "40-50s: Quick summary card on screen with finger-pointing to follow button"
        ],
        cta: "Aise aur realistic insights ke liye follow button daba do!",
        caption: `Don't fall for outdated advice. Here is what actually works today. Save this before you forget! 📌`,
        hashtags: ["#TruthUncovered", "#TrendingReels", "#ShortsCreator", "#SmartHacks", "#ContentGrowth"],
        platform,
        niche,
        category,
        language: 'hinglish',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'idea_' + Date.now() + '_3',
        title: `Behind The Scenes: Ek Creator Ka Camera Ke Peeche Ka Sach`,
        hook: "Behind the scenes: Jo creators kabhi camera pe nahi dikhate!",
        concept: `Relatable storytelling showing real workflow, studio setup, editing timeline, and lessons learned. High emotional connection and humanized branding.`,
        suggestedShots: [
          "0-3s: Chaotic desk / late night glowing monitors timelapse",
          "3-20s: Rapid jumpcuts of coffee, typing, voiceover recording, and failed takes",
          "20-45s: Satisfying final render beep and smiling host previewing the video",
          "45-60s: Genuine takeaway message to aspiring creators"
        ],
        cta: "Aapke workflow mein sabse zyada time kisme lagta hai? Comments mein batao!",
        caption: `Behind every 60-second video is hours of experimentation. Consistency > Perfection always. What are you building this week? 🚀`,
        hashtags: ["#CreatorJourney", "#StudioVlog", "#BehindTheScenes", "#CreativeProcess", "#Discipline"],
        platform,
        niche,
        category,
        language: 'hinglish',
        duration,
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  return { success: true, ideas };
}

function handleScript(data, brand, lang, platform) {
  const topic = data.topic || 'How to Scale Your Creative Workflow in 2026';
  const duration = data.duration || '60 seconds';
  const tone = data.tone || 'High Energy & Engaging';

  if (lang === 'english') {
    const hook = "Wait! If you create content in 2026 and are not using this exact workflow, you are wasting hours every single week.";
    const scenes = [
      {
        sceneNumber: 1,
        timestamp: "0:00 - 0:04",
        visualCues: "Host leans into camera with wide eyes. Sudden camera punch-in with bold pulsing red captions.",
        dialogue: hook,
        onScreenText: "⚠️ STOP SCROLLING!",
        sfx: "Record scratch / Sub-bass whoosh"
      },
      {
        sceneNumber: 2,
        timestamp: "0:04 - 0:18",
        visualCues: "Screen switches to clean screen capture demonstration. Bright yellow cursor highlights the key menu option.",
        dialogue: "Most creators spend five hours juggling scattered notes, unfinished drafts, and disorganized folders. Here is the streamlined system.",
        onScreenText: "Step 1: The Unified Workflow",
        sfx: "Mouse click + UI chime"
      },
      {
        sceneNumber: 3,
        timestamp: "0:18 - 0:38",
        visualCues: "Side-by-side comparison. Left side shows cluttered old way with red tint; Right side shows crisp modern studio.",
        dialogue: "The secret is simple: When your ideation, script bank, pre-publish checklist, and analytics live in one integrated dashboard, your velocity triples.",
        onScreenText: "Old Way ❌ vs New Way ✅",
        sfx: "Success chime (ding ding)"
      },
      {
        sceneNumber: 4,
        timestamp: "0:38 - 0:52",
        visualCues: "Host back on main camera, pointing to on-screen UI preview with confident smile.",
        dialogue: "Start applying this today. Everything you need is right here, and your future self will thank you for organizing your creative process.",
        onScreenText: "Try It Today 🚀",
        sfx: "Riser / Upbeat drum drop"
      },
      {
        sceneNumber: 5,
        timestamp: "0:52 - 1:00",
        visualCues: "Smooth zoom out with end-screen animation, social handles (@NikhilStudio), and dynamic follow pointer.",
        dialogue: `${brand.defaultCta || 'Save this for your next recording session, and follow for more creator breakdowns!'}`,
        onScreenText: "Follow @Nikhil | Save & Share",
        sfx: "Smooth bass drop outro"
      }
    ];

    return {
      success: true,
      script: {
        id: 'script_' + Date.now(),
        topic,
        platform,
        duration,
        language: 'english',
        tone,
        hook,
        scenes,
        fullText: scenes.map(s => `[${s.timestamp}] ${s.onScreenText}\nVisual: ${s.visualCues}\nAudio: ${s.dialogue}\n`).join('\n'),
        cta: brand.defaultCta || "Follow & Save for more tips!",
        createdAt: new Date().toISOString()
      }
    };
  } else if (lang === 'hindi') {
    const hook = "रुकिए! अगर आप 2026 में सफल क्रिएटर बनना चाहते हैं, तो इस वीडियो के अगले 30 सेकंड आपकी पूरी कार्यप्रणाली बदल देंगे।";
    const scenes = [
      {
        sceneNumber: 1,
        timestamp: "0:00 - 0:04",
        visualCues: "होस्ट कैमरे की ओर गंभीरता से झुकते हुए। अचानक कैमरा कंपन प्रभाव और लाल रंग के बोल्ड सबटाइटल्स।",
        dialogue: hook,
        onScreenText: "⚠️ तुरंत रुकिए!",
        sfx: "रिकॉर्ड स्क्रैच / सब-बास प्रभाव"
      },
      {
        sceneNumber: 2,
        timestamp: "0:04 - 0:18",
        visualCues: "स्क्रीन रिकॉर्डिंग पर स्विच। चमकीला पीला कर्सर मुख्य विकल्प को उजागर करता है।",
        dialogue: "अधिकांश लोग स्क्रिप्ट लिखने और योजना बनाने में घंटों बर्बाद करते हैं। लेकिन इस एकीकृत प्रणाली से आप मिनटों में सब तैयार कर सकते हैं।",
        onScreenText: "चरण 1: कार्यप्रणाली का सरलीकरण",
        sfx: "माउस क्लिक + यूआई घंटी"
      },
      {
        sceneNumber: 3,
        timestamp: "0:18 - 0:38",
        visualCues: "तुलनात्मक दृश्य: बाईं ओर अव्यवस्थित पुराना तरीका (लाल रंग में); दाईं ओर सुव्यवस्थित आधुनिक स्टूडियो।",
        dialogue: "सच्चाई बहुत सीधी है: जब आपके सभी विचार, स्क्रिप्ट्स, शेड्यूलिंग और चेकलिस्ट एक ही डैशबोर्ड में होते हैं, तो आपकी कार्यक्षमता तीन गुना बढ़ जाती है।",
        onScreenText: "पुरानी विधि ❌ बनाम नई विधि ✅",
        sfx: "सफलता की घंटी (डिंग)"
      },
      {
        sceneNumber: 4,
        timestamp: "0:38 - 0:52",
        visualCues: "होस्ट पुनः मुख्य कैमरे पर, आत्मविश्वास भरे मुस्कुराते चेहरे के साथ स्क्रीन की ओर इशारा करते हुए।",
        dialogue: "इसे आज ही आजमाएं और अंतर स्वयं देखें। यह आपके वीडियो निर्माण को बेहद सहज और तेज बना देगा।",
        onScreenText: "आज ही आजमाएं 🚀",
        sfx: "उत्साहवर्धक संगीत उठान"
      },
      {
        sceneNumber: 5,
        timestamp: "0:52 - 1:00",
        visualCues: "स्मूथ ज़ूम आउट, एंड-स्क्रीन एनीमेशन और सोशल हैंडल के साथ फॉलो करने का संकेत।",
        dialogue: "अगर यह वीडियो मददगार लगा, तो अभी फॉलो करें और अपने दोस्तों के साथ अवश्य साझा करें!",
        onScreenText: "फॉलो करें | सेव और शेयर करें",
        sfx: "स्मूथ बास ड्रॉप आउट्रो"
      }
    ];

    return {
      success: true,
      script: {
        id: 'script_' + Date.now(),
        topic,
        platform,
        duration,
        language: 'hindi',
        tone,
        hook,
        scenes,
        fullText: scenes.map(s => `[${s.timestamp}] ${s.onScreenText}\nदृश्य: ${s.visualCues}\nसंवाद: ${s.dialogue}\n`).join('\n'),
        cta: "लाइक करें और ऐसी ही उपयोगी जानकारी के लिए फॉलो करें!",
        createdAt: new Date().toISOString()
      }
    };
  } else {
    // Hinglish
    const hook = "Wait! Agar aap content banate ho ya daily tech use karte ho, toh agle 45 seconds bilkul skip mat karna!";
    const scenes = [
      {
        sceneNumber: 1,
        timestamp: "0:00 - 0:04",
        visualCues: "Host leans into camera with wide eyes. Sudden camera shake SFX with bold pulsing red captions.",
        dialogue: hook,
        onScreenText: "⚠️ STOP SCROLLING!",
        sfx: "Record scratch / Sub-bass whoosh"
      },
      {
        sceneNumber: 2,
        timestamp: "0:04 - 0:18",
        visualCues: "Screen switches to screen recording / visual demo. Bright yellow cursor highlights the main action.",
        dialogue: "Zyadatar creators hours spend karte hain scripts aur planning mein, jabki ye single workflow sab automate kar deta hai.",
        onScreenText: "Step 1: The Automation Secret",
        sfx: "Mouse click + UI chime"
      },
      {
        sceneNumber: 3,
        timestamp: "0:18 - 0:38",
        visualCues: "Side-by-side comparison. Left side shows cluttered old way with red tint; Right side shows crisp modern studio.",
        dialogue: "Dekho simple rule hai: Jab ideas, calendar aur production checklist ek single dashboard mein honge, toh focus 3x badh jayega!",
        onScreenText: "Old Way ❌ vs New Way ✅",
        sfx: "Ding ding (success chime)"
      },
      {
        sceneNumber: 4,
        timestamp: "0:38 - 0:52",
        visualCues: "Host back on main camera, holding phone or pointing to on-screen UI preview with confident smile.",
        dialogue: "Isko aaj hi try karo. Link bio mein hai aur comments mein 'STUDIO' type karo agar aapko direct access chahiye!",
        onScreenText: "Try It Today 🚀",
        sfx: "Riser / Upbeat drum drop"
      },
      {
        sceneNumber: 5,
        timestamp: "0:52 - 1:00",
        visualCues: "Smooth zoom out with end-screen animation, social handles (@NikhilStudio), and dynamic subscribe/follow pointer.",
        dialogue: `${brand.defaultCta || 'Video pasand aayi toh double tap karo aur follow karna mat bhoolna!'}`,
        onScreenText: "Follow @Nikhil | Save & Share",
        sfx: "Smooth bass drop outro"
      }
    ];

    return {
      success: true,
      script: {
        id: 'script_' + Date.now(),
        topic,
        platform,
        duration,
        language: 'hinglish',
        tone,
        hook,
        scenes,
        fullText: scenes.map(s => `[${s.timestamp}] ${s.onScreenText}\nVisual: ${s.visualCues}\nAudio: ${s.dialogue}\n`).join('\n'),
        cta: brand.defaultCta || "Follow & Save for more tips!",
        createdAt: new Date().toISOString()
      }
    };
  }
}

function handleTitles(data, brand, lang, platform) {
  const topic = data.topic || 'Creator Growth';

  if (lang === 'english') {
    const ytTitles = [
      `I Tried ${topic} For 30 Days (The Honest Truth)`,
      `How I Scale ${topic} Without Burning Out [Step-by-Step Guide]`,
      `Stop Doing ${topic} In 2026! (Do This Instead)`,
      `The Ultimate ${topic} Blueprint Nobody Told You About`,
      `Why 99% Of People Fail At ${topic} (And How To Fix It)`,
      `${topic}: From Complete Beginner To Pro In 15 Minutes`,
      `The Secret Strategy Behind 1,000,000 Views in ${topic}`,
      `Is ${topic} Still Worth It in 2026? My Candid Review`,
      `5 Costly ${topic} Mistakes You Must Avoid Right Now`,
      `How ${brand.creatorName || 'Nikhil'} Builds High-Impact Content in 2026`
    ];

    const shortsTitles = [
      `This 1 Trick Fixed My ${topic} 🤯`,
      `Never Do This In ${topic}! ❌`,
      `The Secret Hack For ${topic} ⚡`,
      `${topic} in 60 Seconds! ⏳`,
      `Do Not Ignore This In ${topic}! ⚠️`,
      `Why Everyone Is Talking About ${topic} 🔥`,
      `Before vs After: ${topic} Experiment`,
      `The 2026 Cheat Code for ${topic} 🤫`,
      `Did You Know This About ${topic}? 💡`,
      `Watch This Before Starting ${topic} 🚀`
    ];

    const captions = [
      `🔥 The reality of ${topic} that most creators will not share. When you optimize the small fundamentals, the results compound rapidly.\n\nSave this post so you can reference it when recording your next piece of content! 👇\n\nWhat is your biggest question about ${topic}? Drop it below!`,
      `Ever wondered why some content in ${topic} takes off while others stall? It almost always comes down to 3 things: pacing, retention hooks, and delivering genuine value.\n\nDouble tap if you agree and check the bio for more! 🚀`,
      `Quick reminder for anyone diving into ${topic} today: Consistency beats intensity every single time. Keep testing, keep refining.\n\nTag a creator friend who needs a boost today! 💪`
    ];

    const hashtags = [
      "#CreatorEconomy", `#${topic.replace(/[^a-zA-Z0-9]/g, '')}`, "#ReelsTrends", 
      "#YouTubeShorts", "#ContentStrategy", "#VideoProduction", "#TechTrends", 
      "#GrowthMindset", "#CreatorStudio", "#DigitalCreation"
    ];

    const keywords = [
      topic, `${topic} tutorial`, `${topic} 2026`, "best creator tools", 
      "content creation workflow", "how to grow on youtube", "instagram reels algorithm"
    ];

    return {
      success: true,
      youtubeTitles: ytTitles,
      shortsTitles: shortsTitles,
      captions,
      hashtags,
      keywords,
      ctaSuggestions: [
        "Comment 'GUIDE' below to get the direct template link!",
        "Save this video right now so you do not lose these steps!",
        "Follow for daily unfiltered creator and tech breakdowns.",
        "Share this with someone who is struggling with their video pacing."
      ],
      disclaimer: "ℹ️ Creator Notice: Hashtags and keywords help search indexing, but viewer watch time and retention drive algorithmic recommendations."
    };
  } else if (lang === 'hindi') {
    const ytTitles = [
      `मैंने 30 दिनों तक ${topic} आजमाया (सच्चाई जानकर चौंक जाएंगे)`,
      `बिना तनाव के ${topic} में महारत कैसे हासिल करें [सम्पूर्ण गाइड]`,
      `2026 में ${topic} करना तुरंत बंद करें! (इसकी जगह यह करें)`,
      `${topic} का वह अंतिम ब्लूप्रिंट जो किसी ने आपको नहीं बताया`,
      `99% लोग ${topic} में असफल क्यों होते हैं? (और इसे कैसे सुधारें)`,
      `${topic}: शुरुआती स्तर से प्रो बनें केवल 15 मिनट में`,
      `${topic} में 10 लाख व्यूज लाने की गोपनीय रणनीति`,
      `क्या 2026 में ${topic} उपयोगी है? मेरा निष्पक्ष विश्लेषण`,
      `5 बड़ी ${topic} गलतियाँ जिनसे आपको तुरंत बचना चाहिए`,
      `${brand.creatorName || 'निखिल'} के साथ प्रभावशाली कंटेंट निर्माण`
    ];

    const shortsTitles = [
      `इस 1 ट्रिक ने सब बदल दिया 🤯`,
      `${topic} में यह गलती कभी मत करना! ❌`,
      `${topic} की सबसे जादुई ट्रिक ⚡`,
      `60 सेकंड में ${topic} सीखें! ⏳`,
      `इसे अनदेखा करने की भूल मत करना! ⚠️`,
      `हर कोई ${topic} की बात क्यों कर रहा है? 🔥`,
      `पहले बनाम बाद में: ${topic} प्रयोग`,
      `2026 में ${topic} का असली सीक्रेट कोड 🤫`,
      `क्या आपको ${topic} का यह सच पता था? 💡`,
      `शुरुआत करने से पहले यह वीडियो जरूर देखें 🚀`
    ];

    const captions = [
      `🔥 ${topic} की वह सच्चाई जो ज्यादातर लोग साझा नहीं करते। जब आप छोटी-छोटी बातों को सुधारते हैं, तो परिणाम बहुत तेजी से बढ़ते हैं।\n\nइस पोस्ट को अभी सेव करें ताकि अगली रिकॉर्डिंग में आप इसे देख सकें! 👇\n\n${topic} को लेकर आपका सबसे बड़ा सवाल क्या है? कमेंट्स में पूछें!`,
      `क्या आपने कभी सोचा है कि ${topic} में कुछ वीडियो वायरल क्यों होते हैं और कुछ रुक जाते हैं? इसका कारण 3 चीजें हैं: पेसिंग, हुक और वास्तविक मूल्य।\n\nसहमति के लिए लाइक करें और चैनल को फॉलो करें! 🚀`,
      `आज ${topic} शुरू करने वाले प्रत्येक व्यक्ति के लिए महत्वपूर्ण सलाह: निरंतरता हमेशा श्रेष्ठ होती है। सीखते रहें, आगे बढ़ते रहें।\n\nअपने उस साथी को टैग करें जिसे इस सलाह की आवश्यकता है! 💪`
    ];

    const hashtags = [
      "#क्रिएटर_गाइड", "#यूट्यूब_शॉर्ट्स", "#वायरल_रील्स", "#कंटेंट_रणनीति",
      "#वीडियो_निर्माण", "#हिंदी_टेक", "#दैनिक_टिप्स", "#सफलता_मंत्र"
    ];

    const keywords = [
      topic, `${topic} सीखें`, `${topic} गाइड 2026`, "यूट्यूब ग्रोथ टिप्स",
      "इंस्टाग्राम रील्स कैसे वायरल करें", "वीडियो एडिटिंग टिप्स"
    ];

    return {
      success: true,
      youtubeTitles: ytTitles,
      shortsTitles: shortsTitles,
      captions,
      hashtags,
      keywords,
      ctaSuggestions: [
        "पूरी गाइड प्राप्त करने के लिए नीचे 'गाइड' कमेंट करें!",
        "इस वीडियो को अभी सेव कर लें ताकि यह महत्वपूर्ण जानकारी खो न जाए!",
        "दैनिक उपयोगी वीडियो और सुझावों के लिए हमें फॉलो करें।",
        "इसे अपने उस मित्र के साथ साझा करें जो वीडियो बनाता है।"
      ],
      disclaimer: "ℹ️ क्रिएटर सलाह: हैशटैग और कीवर्ड्स सर्च इंडेक्सिंग में सहायता करते हैं, लेकिन दर्शकों का वॉच-टाइम और जुड़ाव ही वीडियो को आगे बढ़ाता है।"
    };
  } else {
    // Hinglish
    const ytTitles = [
      `I Tried ${topic} For 30 Days (The Honest Truth)`,
      `How I Scale ${topic} Without Burning Out [Step-by-Step Guide]`,
      `Stop Doing ${topic} In 2026! (Do This Instead)`,
      `The Ultimate ${topic} Blueprint Nobody Told You About`,
      `Why 99% Of People Fail At ${topic} (And How To Fix It)`,
      `${topic}: From Complete Beginner To Pro In 15 Minutes`,
      `The Secret Strategy Behind 1,000,000 Views in ${topic}`,
      `Is ${topic} Still Worth It in 2026? My Candid Review`,
      `5 Costly ${topic} Mistakes You Must Avoid Right Now`,
      `How ${brand.creatorName || 'Nikhil'} Builds High-Impact Content in 2026`
    ];

    const shortsTitles = [
      `This 1 Trick Fixed My ${topic} 🤯`,
      `Never Do This In ${topic}! ❌`,
      `The Secret Hack For ${topic} ⚡`,
      `${topic} in 60 Seconds! ⏳`,
      `Don't Ignore This In ${topic}! ⚠️`,
      `Why Everyone Is Talking About ${topic} 🔥`,
      `Before vs After: ${topic} Experiment`,
      `The 2026 Cheat Code for ${topic} 🤫`,
      `Did You Know This About ${topic}? 💡`,
      `Watch This Before Starting ${topic} 🚀`
    ];

    const captions = [
      `🔥 The reality of ${topic} that most creators won't share. When you optimize the small fundamentals, the results compound rapidly.\n\nSave this post so you can reference it when recording your next piece of content! 👇\n\nWhat's your biggest question about ${topic}? Drop it below!`,
      `Ever wondered why some content in ${topic} takes off while others stall? It almost always comes down to 3 things: pacing, retention hooks, and delivering genuine value.\n\nDouble tap if you agree and check the bio for more! 🚀`,
      `Quick reminder for anyone diving into ${topic} today: Consistency beats intensity every single time. Keep testing, keep refining.\n\nTag a creator friend who needs a boost today! 💪`
    ];

    const hashtags = [
      "#CreatorEconomy", `#${topic.replace(/[^a-zA-Z0-9]/g, '')}`, "#ReelsTrends", 
      "#YouTubeShorts", "#ContentStrategy", "#VideoProduction", "#TechTrends", 
      "#GrowthMindset", "#CreatorStudio", "#DigitalCreation"
    ];

    const keywords = [
      topic, `${topic} tutorial`, `${topic} 2026`, "best creator tools", 
      "content creation workflow", "how to grow on youtube", "instagram reels algorithm"
    ];

    return {
      success: true,
      youtubeTitles: ytTitles,
      shortsTitles: shortsTitles,
      captions,
      hashtags,
      keywords,
      ctaSuggestions: [
        "Comment 'WORKFLOW' below to get the direct template link!",
        "Save this video right now so you don't lose these steps!",
        "Follow for daily unfiltered creator and tech breakdowns.",
        "Share this with someone who is struggling with their video pacing."
      ],
      disclaimer: "ℹ️ Pro Tip: Hashtags and keywords improve discoverability, but authentic watch time and retention drive recommendations."
    };
  }
}

function handlePrompts(data, brand, lang) {
  const category = data.category || 'Thumbnail';
  const subject = data.subject || 'Cinematic Creator Workspace';

  let title1 = `${category} — Hyper-Realistic Cyberpunk Creator Setup`;
  let title2 = `${category} — High-CTR YouTube Thumbnail Style`;
  let title3 = `Vertical 9:16 — Reel / Short Atmospheric Scene`;
  let style1 = 'Cinematic Photorealistic';
  let style2 = 'YouTube High-CTR';
  let style3 = 'Reel Aesthetic';

  if (lang === 'hindi') {
    title1 = `${category} — सिनेमाई क्रिएटर स्टूडियो सेटअप`;
    title2 = `${category} — उच्च क्लिक-दर यूट्यूब थंबनेल शैली`;
    title3 = `वर्टिकल 9:16 — रील और शॉर्ट्स वायुमंडलीय दृश्य`;
    style1 = 'सिनेमाई यथार्थवादी (Cinematic)';
    style2 = 'उच्च क्लिक दर (High-CTR)';
    style3 = 'रील सौंदर्य (Reel Aesthetic)';
  } else if (lang === 'hinglish') {
    title1 = `${category} — Cyberpunk Creator Setup Style`;
    title2 = `${category} — High-CTR Viral Thumbnail Look`;
    title3 = `Vertical 9:16 — Atmospheric Reel Scene`;
  }

  const prompts = [
    {
      id: 'p1',
      title: title1,
      prompt: `Ultra-photorealistic 8k octane render of ${subject}, modern neon ambient lighting in deep indigo and electric amber, dramatic cinematic backlight, shallow depth of field, sharp focus, Sony A7R V 50mm f/1.2 lens, photorealistic textures, studio quality, professional color grading --ar 16:9 --v 6.0`,
      negativePrompt: `blurry, low quality, distorted hands, noisy background, bad lighting, watermark, oversaturated artifacts`,
      aspectRatio: '16:9',
      style: style1,
      recommendedTool: 'Midjourney v6 / Flux.1'
    },
    {
      id: 'p2',
      title: title2,
      prompt: `Expressive creator portrait of an Indian creator with dramatic surprised facial reaction, dynamic lighting, glowing rim light in purple and cyan, high-contrast bold typography placeholder, clean dark studio backdrop with subtle glowing graph, 8k resolution, crisp details --ar 16:9 --style raw`,
      negativePrompt: `dull colors, low contrast, washed out face, extra fingers, cartoonish, grain, text gibberish`,
      aspectRatio: '16:9',
      style: style2,
      recommendedTool: 'Ideogram / Midjourney'
    },
    {
      id: 'p3',
      title: title3,
      prompt: `Vertical 9:16 framing, dynamic motion blur, ${subject}, atmospheric haze, volumetric god rays piercing through window blinds, sleek minimalist aesthetic, cinematic teal and orange grade, hyper-detailed 4k --ar 9:16`,
      negativePrompt: `landscape crop, distorted perspective, pixelated, plastic skin`,
      aspectRatio: '9:16',
      style: style3,
      recommendedTool: 'Flux.1 / Midjourney / Sora'
    }
  ];

  return { success: true, prompts };
}

function handleAutoPilot(data, brand, lang, platform) {
  const context = data.context || data.fileName || 'Creator Video';
  const category = data.category || 'Tech & Education';
  const cleanTopic = context.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now.getTime() + 86400000);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  let postTime = '18:30';
  let platformNote = '';
  if (platform === 'Instagram Reel') {
    postTime = '18:30';
    platformNote = 'Instagram Reels experience peak mobile feed activity during evening transit and post-dinner hours (6:30 PM - 9:00 PM IST).';
  } else if (platform === 'YouTube Short') {
    postTime = '17:30';
    platformNote = 'YouTube Shorts viewer traffic peaks as students and young professionals browse in the late afternoon (5:00 PM - 7:30 PM IST).';
  } else {
    postTime = '19:00';
    platformNote = 'Long-form YouTube videos gain maximum high-retention watch time when viewers relax during evening prime hours (7:00 PM - 9:30 PM IST).';
  }

  const currentHour = now.getHours();
  const postDate = currentHour >= 18 ? tomorrowStr : todayStr;

  if (lang === 'english') {
    return {
      success: true,
      topic: cleanTopic,
      category,
      titleOptions: [
        `Stop Scrolling: The ${cleanTopic} Breakdown You Need Right Now`,
        `How I Mastered ${cleanTopic} in 2026 (Without Any Expensive Tools)`,
        `3 Critical ${cleanTopic} Mistakes You Must Avoid Immediately`
      ],
      hookOptions: [
        `If you are struggling with ${cleanTopic}, this 30-second fix changes everything.`,
        `Nobody is talking about this hidden trick in ${cleanTopic}, but top creators use it daily.`,
        `Watch this before you spend another minute trying to optimize ${cleanTopic} manually.`
      ],
      description: `In this video, ${brand.creatorName || 'Nikhil'} breaks down essential, high-impact strategies for ${cleanTopic}.\n\n📌 What you will learn:\n- Key optimization principles for ${cleanTopic}\n- Common bottlenecks to avoid\n- Step-by-step practical implementation\n\n📢 Call to Action: ${brand.defaultCta || 'Follow for daily creator insights!'}\n\nDisclaimer: Content performance depends on viewer retention and authentic audience engagement.`,
      captionOptions: [
        `🚀 Stop wasting time guessing what works for ${cleanTopic}. Here is the exact framework to level up your workflow today.\n\nSave this video so you can refer back to it during your next project! 📌\n\nDrop your thoughts in the comments below! 👇`,
        `The difference between average and exceptional results in ${cleanTopic} comes down to these 3 fundamentals. Try this out and see the difference for yourself! ✨\n\nDouble tap if you found this valuable! ❤️`,
        `Quick breakdown on ${cleanTopic} for every creator striving for consistency in 2026. Keep refining, keep shipping! 💪\n\nShare this with a creator friend who needs to see this! 🚀`
      ],
      ctaOptions: [
        "Save this post right now so you do not lose it!",
        "Comment 'GUIDE' below and I will send you the direct resource link!",
        "Follow for daily unfiltered creator and tech breakdowns."
      ],
      hashtags: [
        `#${cleanTopic.replace(/[^a-zA-Z0-9]/g, '')}`,
        "#ContentCreator",
        "#CreatorEconomy",
        "#ProductivityTips",
        "#VideoCreation",
        "#TechShorts",
        "#DigitalCreator",
        "#CreatorStudio",
        "#DailyGrowth",
        "#WorkflowHacks"
      ],
      keywords: [
        cleanTopic,
        `${cleanTopic} tutorial`,
        `${cleanTopic} tips 2026`,
        "creator workflow",
        "video optimization",
        "audience retention",
        "digital productivity"
      ],
      thumbnailConcept: `High-contrast close-up of host with an intrigued expression, holding a neon-rimmed smartphone showing a stylized glowing graph for ${cleanTopic}. Bold yellow typography overlay: "FIX THIS FIRST!".`,
      recommendedPostDate: postDate,
      recommendedPostTime: postTime,
      postingTimeReasoning: `Scheduled for peak audience active hours (${postTime} IST). ${platformNote}`,
      confidenceNote: "Metadata and timing optimized for high CTR and audience availability. Organic distribution depends on watch time — virality is never guaranteed."
    };
  } else if (lang === 'hindi') {
    return {
      success: true,
      topic: cleanTopic,
      category,
      titleOptions: [
        `${cleanTopic}: यह एक गलती आपके व्यूज रोक रही है!`,
        `2026 में ${cleanTopic} सीखने का सबसे आसान और सही तरीका`,
        `क्या आप भी ${cleanTopic} में यह 3 गलतियाँ कर रहे हैं?`
      ],
      hookOptions: [
        `यदि आप ${cleanTopic} पर काम कर रहे हैं, तो अगले 30 सेकंड आपके लिए बेहद जरूरी हैं।`,
        `इसके बारे में कोई बात नहीं कर रहा, लेकिन सफल क्रिएटर यही गुप्त तरीका अपनाते हैं।`,
        `इस वीडियो को पूरा देखे बिना ${cleanTopic} शुरू करने की गलती मत करना!`
      ],
      description: `इस वीडियो में ${brand.creatorName || 'निखिल'} बता रहे हैं ${cleanTopic} के लिए सबसे महत्वपूर्ण और व्यावहारिक सुझाव।\n\n📌 मुख्य बिंदु:\n- ${cleanTopic} की सटीक और आसान प्रक्रिया\n- आम गलतियों से बचने के उपाय\n- व्यावहारिक सुधार के चरण\n\n📢 कॉल-टू-एक्शन: लाइक करें और ऐसी ही उपयोगी जानकारी के लिए हमें तुरंत फॉलो करें!\n\nसूचना: वीडियो की पहुंच दर्शकों के वॉच-टाइम और जुड़ाव पर निर्भर करती है।`,
      captionOptions: [
        `🚀 ${cleanTopic} के लिए यह तरीका आपका काफी समय बचा सकता है। इस वीडियो को अभी सेव करें ताकि आप इसे बाद में देख सकें! 📌\n\nकमेंट्स में बताएं कि आपको यह जानकारी कैसी लगी! 👇`,
        `शानदार परिणाम पाने के लिए ${cleanTopic} के इन बुनियादी नियमों का पालन करें। इसे अपने क्रिएटर दोस्तों के साथ जरूर शेयर करें! ✨\n\nअगर वीडियो पसंद आए तो लाइक और फॉलो जरूर करें! ❤️`,
        `2026 में लगातार आगे बढ़ने के लिए ${cleanTopic} की यह रणनीति बहुत मददगार है। मेहनत जारी रखें! 💪\n\nअपने उस दोस्त को टैग करें जिसे इसकी सबसे ज्यादा जरूरत है! 🚀`
      ],
      ctaOptions: [
        "इस वीडियो को तुरंत सेव करें ताकि यह जानकारी खो न जाए!",
        "कमेंट में 'टिप्स' लिखें और मैं आपको पूरी जानकारी भेज दूंगा!",
        "प्रतिदिन ऐसी ज्ञानवर्धक जानकारियों के लिए हमें अभी फॉलो करें।"
      ],
      hashtags: [
        "#क्रिएटर_गाइड",
        "#टेक_टिप्स",
        "#वायरल_रील्स",
        "#दैनिक_कंटेंट",
        "#डिजिटल_ज्ञान",
        "#स्मार्ट_वर्क",
        "#कंटेंट_रणनीति",
        "#यूट्यूब_टिप्स",
        "#रील्स_टिप्स",
        "#क्रिएटर_स्टूडियो"
      ],
      keywords: [
        cleanTopic,
        `${cleanTopic} हिंदी गाइड`,
        `${cleanTopic} सीखें`,
        "क्रिएटर टिप्स 2026",
        "वीडियो बनाने का तरीका",
        "ऑडियंस रीच कैसे बढ़ाएं",
        "डिजिटल क्रिएटर"
      ],
      thumbnailConcept: `गंभीर और उत्सुकता भरे चेहरे के साथ क्लोज़-अप शॉट, पृष्ठभूमि में गहरे नीले और सुनहरे रंग की रोशनी। स्क्रीन पर बड़े देवनागरी अक्षरों में टेक्स्ट: "यह गलती मत करना!".`,
      recommendedPostDate: postDate,
      recommendedPostTime: postTime,
      postingTimeReasoning: `भारतीय दर्शकों के चरम सक्रिय समय (${postTime} IST) के आधार पर निर्धारित। ${platformNote}`,
      confidenceNote: "यह समय और मेटाडेटा दर्शकों की उपस्थिति के विश्लेषण पर आधारित है। वीडियो की पहुंच वॉच-टाइम पर निर्भर करती है — व्यूज या वायरल होने की कोई गारंटी नहीं होती।"
    };
  } else {
    // Hinglish
    return {
      success: true,
      topic: cleanTopic,
      category,
      titleOptions: [
        `${cleanTopic}: Ye 1 Mistake Aapke Views Rok Rahi Hai!`,
        `How I Mastered ${cleanTopic} in 2026 (Without Spending Any Money)`,
        `3 Costly ${cleanTopic} Mistakes Every Creator Should Avoid`
      ],
      hookOptions: [
        `Agar aap ${cleanTopic} mein time waste kar rahe ho, toh ye 30-second breakdown aapke ghanton bachayega.`,
        `Is secret trick ke baare mein koi nahi bata raha, lekin top creators isse roz use karte hain.`,
        `Wait! Agla video record karne se pehle ye ${cleanTopic} ka golden rule dekh lo.`
      ],
      description: `In this video, ${brand.creatorName || 'Nikhil'} breaks down the complete, fluff-free strategy for ${cleanTopic}.\n\n📌 Key Takeaways:\n- Real secrets of ${cleanTopic} that actually work in 2026\n- How to double your watch time and retention\n- Step-by-step practical creator workflow\n\n📢 Call to Action: ${brand.defaultCta || 'Follow for daily creator breakdowns!'}\n\nNotice: Video performance depends on content quality and retention. No virality is ever guaranteed.`,
      captionOptions: [
        `🚀 Stop wasting time guessing what works for ${cleanTopic}. Ye exact framework aapke workflow ko 10x improve kar dega.\n\nSave this reel so you don't lose it during your next shoot! 📌\n\nAapka ispe kya opinion hai? Comments mein batao! 👇`,
        `Consistency + Smart Execution = Growth. Ye 3 fundamentals ${cleanTopic} mein hamesha kaam karte hain. Try them out today! ✨\n\nDouble tap if this helped you! ❤️`,
        `Quick reminder for every creator diving into ${cleanTopic}: Pacing and retention always win. Keep creating, keep improving! 💪\n\nShare this with a creator friend who needs to see this! 🚀`
      ],
      ctaOptions: [
        "Save this video right now so you don't forget these steps!",
        "Comment 'INFO' below and I will send you the complete breakdown!",
        "Follow for daily high-value creator and tech hacks."
      ],
      hashtags: [
        `#${cleanTopic.replace(/[^a-zA-Z0-9]/g, '')}`,
        "#CreatorTips",
        "#ReelsGrowth",
        "#ShortsGrowth",
        "#ContentStrategy",
        "#TechHacks",
        "#VideoEditing",
        "#DigitalCreator",
        "#DailyProductivity",
        "#NikhilAIStudio"
      ],
      keywords: [
        cleanTopic,
        `${cleanTopic} breakdown`,
        `${cleanTopic} tips 2026`,
        "creator growth tricks",
        "how to improve watch time",
        "high retention reels",
        "viral content strategy"
      ],
      thumbnailConcept: `Expressive creator reaction looking at camera with shocked expression, pointing to a glowing neon UI badge showing ${cleanTopic}. Bold yellow & white text: "DON'T DO THIS!".`,
      recommendedPostDate: postDate,
      recommendedPostTime: postTime,
      postingTimeReasoning: `Targeting peak audience active window (${postTime} IST) for maximum early momentum. ${platformNote}`,
      confidenceNote: "Timings and metadata calculated for optimal CTR and viewer availability. Retention and authentic engagement drive reach — virality is never guaranteed."
    };
  }
}



function handleAutoPilotPlan(data, brand, lang, platform) {
  const itemCount = parseInt(data.itemCount || 5, 10) || 5;
  const category = data.category || 'Drawing';
  const duration = data.duration || '30s';
  const frequency = data.frequency || 'Daily';
  const customTopic = (data.customTopic || '').trim();
  const brandName = brand?.name || 'Nikhil Arts';
  const creatorName = brand?.creatorName || 'Nikhil';
  const defaultCta = brand?.defaultCta || (lang === 'hindi' ? 'कैसी लगी यह पेंटिंग? कमेंट्स में 1 से 10 तक रेटिंग दें!' : (lang === 'english' ? 'Rate this from 1 to 10 in the comments!' : 'Kaisi lagi ye painting? Comments me 1 se 10 rating do!'));

  const artTopicsHindi = [
    { topic: 'आंखों की यथार्थवादी शेडिंग और रिफ्लेक्शन ट्रिक', concept: 'मोनो इरेज़र और 4B पेंसिल से आंखों में जीवंत 3D चमक लाने की 30 सेकंड की तकनीक', hook: 'अगर आपकी स्केचिंग में आंखें बेजान लगती हैं, तो यह आसान ट्रिक आपकी कला को पूरी तरह बदल देगी!' },
    { topic: 'पेंसिल ब्लेंडिंग की 3 सबसे बड़ी गलतियां जो बिगिनर्स करते हैं', concept: 'उंगली से ब्लेंड करने के नुकसान और ब्रश तथा पेपर स्टंप के सही इस्तेमाल का प्रदर्शन', hook: 'अगर आप भी पेंसिल स्केच को उंगली से ब्लेंड करते हैं, तो अभी रुक जाइए!' },
    { topic: '3-सर्कल फॉर्मूला: किसी भी एंगल से नाक बनाना सीखें', concept: 'बिना किसी उलझन के 3 इंटरसेक्टिंग सर्कल्स से किसी भी पर्सपेक्टिव में परफेक्ट नाक की ड्राइंग', hook: 'नाक बनाने में एंगल बिगड़ जाता है? बस यह 3 सर्कल याद रख लो!' },
    { topic: 'रिबन मेथड से बालों की स्मूथ और चमकदार शेडिंग', concept: 'एक-एक बाल खींचने के बजाय बालों को रिबन क्लंप्स में बांटकर शेडिंग करने का फॉर्मूला', hook: 'अगर आप एक-एक बाल खींच कर थक गए हैं और फिर भी हेयर नेचुरल नहीं लग रहे...' },
    { topic: 'ऐक्रेलिक पैलेट नाइफ स्पीडपेंटिंग: सनसेट माउंटेन', concept: 'कैनवास पर टेक्सचर्ड नाइफ स्ट्रोक्स और अंत में बेहद संतोषजनक टेप पील रिवील', hook: 'कैनवास पर पैलेट नाइफ का यह जादुई स्ट्रोक आपका मूड फ्रेश कर देगा!' },
    { topic: 'होंठों की 3D शेडिंग और रियलिस्टिक ग्लॉस इफेक्ट', concept: 'सॉफ्ट ग्रेफाइट लेयर्स और व्हाइट जेल पेन से रियलिस्टिक लिप्स की ड्राइंग', hook: 'होंठों में नैचुरल 3D डेप्थ और चमक लाने का 20 सेकंड का सीक्रेट तरीका!' },
    { topic: 'चेहरे के सही अनुपात (Face Proportions) का आसान नियम', concept: 'लूमिस मेथड को सरल बनाकर बिगिनर्स के लिए प्रोपोर्शन गाइड', hook: 'स्केच में एक आंख बड़ी और एक छोटी बन जाती है? यह गाइडलाइन याद रखें!' },
    { topic: 'चारकोल पेंसिल का जादू: विंटेज पोर्ट्रेट स्पीड ड्राइंग', concept: 'सॉफ्ट चारकोल पाउडर और इरेज़र से हाई-कंट्रास्ट ड्रामैटिक विंटेज पोर्ट्रेट', hook: 'चारकोल का यह हाई-कंट्रास्ट लुक ग्रेफाइट से 10 गुना ज्यादा आकर्षक दिखता है!' },
    { topic: 'सही स्केचबुक और पेपर GSM कैसे चुनें', concept: '90 GSM vs 180 GSM vs 300 GSM पेपर का सीधा अंतर और प्रभाव', hook: 'आपकी शेडिंग स्मूथ क्यों नहीं होती? गलती आपकी नहीं, आपके पेपर की है!' },
    { topic: 'ग्रेफाइट बनाम चारकोल: किस आर्ट में क्या इस्तेमाल करें?', concept: 'सिल्की टोन के लिए ग्रेफाइट और डीप ब्लैक कंट्रास्ट के लिए चारकोल का सीधा मुकाबला', hook: 'क्या आपको पता है कब ग्रेफाइट इस्तेमाल करना चाहिए और कब चारकोल?' },
    { topic: 'हाथों की ड्राइंग बिना किसी डर के: मिटेन मेथड', concept: 'अंगुलियों को अलग-अलग बनाने के बजाय बॉक्स और मिटेन शेप से ड्रा करने की ट्रिक', hook: 'हाथ बनाने में सबसे ज्यादा पसीने छूटते हैं? इस 30 सेकंड की ट्रिक को आजमाएं!' },
    { topic: 'वॉटरकलर वेट-ऑन-वेट ग्रेडिएंट का जादुई तरीका', concept: 'गीले पेपर पर पिगमेंट का सहज फैलाव और सॉफ्ट स्काई ग्रेडिएंट तैयार करना', hook: 'वॉटरकलर में हार्ड एज से परेशान हैं? बस पानी का यह बैलेंस सीख लीजिए!' },
    { topic: 'ग्लास स्फीयर और पानी की बूंद की 3D ड्राइंग', concept: 'सटीक हाईलाइट और ट्रांसपेरेंट रिफ्रैक्शन शेडिंग का 30 सेकंड का ट्यूटोरियल', hook: 'कागज पर 3D पानी की बूंद बनाना जादू जैसा लगता है, लेकिन यह इतना आसान है!' },
    { topic: '2-पॉइंट पर्सपेक्टिव से स्ट्रीट स्केचिंग की शुरुआत', concept: 'वैनिशिंग पॉइंट्स और होराइजन लाइन से 3D इमारतों का स्केच', hook: 'पर्सपेक्टिव ड्राइंग से डर लगता है? सिर्फ 2 बिंदुओं से पूरी दुनिया बना सकते हैं!' },
    { topic: 'ब्लेंडिंग स्टंप्स को घर पर नए जैसा साफ करने का हैक', concept: 'सैंडपेपर ब्लॉक से गंदे स्टंप को सिर्फ 5 सेकंड में शार्प और क्लीन करना', hook: 'काले गंदे ब्लेंडिंग स्टंप को फेंकने से पहले यह 5 सेकंड का हैक देख लें!' },
    { topic: 'सॉफ्ट पेस्टल गैलेक्सी आर्ट 60 सेकंड में', concept: 'डार्क वायलेंट और नेवी पेस्टल को स्मज करके स्टार्स का स्प्लैश लगाना', hook: 'अगर आपके पास सिर्फ 2 मिनट हैं, तो यह गैलेक्सी पेंटिंग जरूर ट्राई करें!' },
    { topic: 'क्लीन लाइन आर्ट के लिए पेंसिल पकड़ने की सही तकनीक', concept: 'ओवरहैंड ग्रिप बनाम ट्राइपॉड ग्रिप का सही इस्तेमाल कब और कैसे करें', hook: 'अगर आपकी पेंसिल लाइन कांपती है, तो आप पेंसिल गलत तरीके से पकड़ रहे हैं!' },
    { topic: 'कागज पर रियलिस्टिक पानी की बूंदें कैसे बनाएं', concept: 'कास्ट शैडो और ओवल हाईलाइट से बनने वाली जादुई वाटर ड्रॉपलेट', hook: 'कागज पर पानी की बूंदें जो छूने पर बिल्कुल असली लगेंगी!' },
    { topic: 'डिजिटल आर्ट बनाम ट्रेडिशनल आर्ट: एक क्रिएटर का सच्चा अनुभव', concept: 'आईपैड प्रोक्रिएट और असली कैनवास के खर्च, सीखने की गति और संतुष्टि की तुलना', hook: 'क्या 2026 में ट्रेडिशनल आर्टिस्ट्स को डिजिटल पर स्विच कर लेना चाहिए?' },
    { topic: 'क्विक स्टिल लाइफ: चाय का कुल्हड़ और टेक्सचर स्केचिंग', concept: 'मिट्टी के कुल्हड़ का रफ टेक्सचर और गर्म चाय की भाप का स्केच', hook: 'मिट्टी के कुल्हड़ का यह देसी स्केच आपके दिल को छू जाएगा!' }
  ];

  const artTopicsEnglish = [
    { topic: 'Photorealistic Eye Shading & Highlights', concept: 'Step-by-step macro timelapse using a mono eraser and 4B pencil to create lifelike iris depth.', hook: 'If your portrait sketches look flat and lifeless, this 30-second iris highlight technique will change everything.' },
    { topic: '3 Blending Mistakes Every Beginner Makes', concept: 'Why finger smudging ruins paper tooth and how tortillon stumps and makeup brushes create silk-smooth gradients.', hook: 'Stop blending your graphite with your fingers! Here is why it is ruining your artwork.' },
    { topic: 'The 3-Circle Rule to Draw ANY Nose Angle', concept: 'Using three simple intersecting spheres to lock down nose symmetry and nostrils in perspective.', hook: 'Struggling with nose anatomy? Just remember this simple 3-circle construction method.' },
    { topic: 'How to Sketch Glossy Hair With Ribbon Technique', concept: 'Grouping strands into ribbon clumps and shading depth rather than drawing individual single hairs.', hook: 'Stop drawing individual hair lines. Think in ribbons for instant volume and gloss.' },
    { topic: 'Acrylic Palette Knife Speedpainting: Sunset Mountains', concept: 'Thick acrylic paint textures sculpted with a knife, finished with an ultra-satisfying border tape peel.', hook: 'Ready for the most relaxing 60-second heavy texture palette knife painting session?' },
    { topic: 'Lip Shading & High-Gloss Lighting Tutorial', concept: 'Layering soft graphite contours and white gel pen accents for juicy photorealistic lips.', hook: 'The secret to drawing glossy lips comes down to this one simple highlight placement.' },
    { topic: 'Human Face Proportions Made Effortless', concept: 'Simplified Loomis guidelines to prevent drawing mismatched eyes and crooked jawlines.', hook: 'Why does one eye always turn out bigger than the other? Remember this universal grid.' },
    { topic: 'High-Contrast Charcoal Portrait Speed Drawing', concept: 'Dramatic vintage chiaroscuro lighting using charcoal powder and kneaded erasers.', hook: 'Charcoal delivers 10x the dramatic contrast of standard graphite in half the time.' },
    { topic: 'How to Pick the Right Sketchbook Paper Weight (GSM)', concept: 'Comparing 90 GSM vs 180 GSM vs 300 GSM paper to explain why shading looks grainy.', hook: 'Your shading is not bad — you are simply using the wrong sketchbook paper weight.' },
    { topic: 'Graphite vs Charcoal: The Ultimate Showdown', concept: 'When to choose the silky silvery tones of graphite versus the velvety pitch-black of charcoal.', hook: 'Stop guessing between graphite and charcoal. Here is exactly when to use each.' },
    { topic: 'Drawing Hands Without Fear: The Mitten Method', concept: 'Simplifying complex fingers into a unified mitten shape before carving out joints.', hook: 'Do hand drawings give you anxiety? This 30-second mitten trick makes it easy.' },
    { topic: 'Watercolor Wet-on-Wet Gradient Masterclass', concept: 'Balancing water tension and pigment dispersion for butter-smooth sunset washes without hard edges.', hook: 'Struggling with blotchy watercolor blooms? Master this water-to-pigment ratio.' },
    { topic: '3D Glass Sphere & Reflection Shading in 30 Seconds', concept: 'Curved crosshatching, ambient occlusion, and sharp specular highlights on spherical forms.', hook: 'Drawing transparent glass feels like pure magic, yet it only requires three simple steps.' },
    { topic: '2-Point Perspective Street Architecture Sketch', concept: 'Laying down two vanishing points on the horizon line to construct convincing 3D buildings.', hook: 'Perspective drawing is not hard math. Two dots can construct an entire cityscape.' },
    { topic: 'How to Clean Dirty Blending Stumps in 5 Seconds', concept: 'Using a sanding pad or sandpaper block to sharpen and purify stained tortillons instantly.', hook: 'Do not throw away your dirty blackened blending stumps! Use this 5-second restoration trick.' },
    { topic: 'Soft Pastel Galaxy in 60 Seconds', concept: 'Smudging deep violet and navy pigments, capped with starry white gouache splatters.', hook: 'Got two minutes to spare? Try this calming vibrant galaxy pastel artwork.' },
    { topic: 'Pencil Grip Techniques for Crisp Linework', concept: 'Switching between the overhand sketch grip and the precision tripod writing grip.', hook: 'If your linework feels shaky, you are likely gripping your pencil completely wrong.' },
    { topic: 'How to Draw Realistic Water Droplets', concept: 'Elliptical shadows, internal refractions, and intense specular dots creating illusion of wetness.', hook: 'These 2D water drops look so real on paper that you will want to wipe them off!' },
    { topic: 'Digital Art vs Traditional Canvas: A Creator Perspective', concept: 'Honest cost, learning curve, and tactile satisfaction breakdown of iPad Procreate vs real paints.', hook: 'Should traditional artists switch to digital tablets in 2026? Here is the honest truth.' },
    { topic: 'Cozy Still Life: Chai Clay Cup Charcoal Sketch', concept: 'Capturing the raw earthen texture of a desi kulhad and wisps of rising steam.', hook: 'This quick charcoal sketch of hot steaming chai will instantly warm your feed.' }
  ];

  const topicsList = lang === 'english' ? artTopicsEnglish : artTopicsHindi;
  const now = new Date();

  const getDaysOffset = (idx) => {
    switch (frequency) {
      case 'Daily': return idx + 1;
      case '3x/wk': return Math.floor(idx * 2.3) + 1;
      case '5x/wk': return Math.floor(idx * 1.4) + 1;
      case 'Weekly': return (idx + 1) * 7;
      default: return idx + 1;
    }
  };

  const generatedItems = [];

  for (let i = 0; i < itemCount; i++) {
    const topicData = topicsList[i % topicsList.length];
    const postDate = new Date(now.getTime() + getDaysOffset(i) * 86400000).toISOString().split('T')[0];
    const postTime = (platform === 'YouTube Short' || platform === 'YouTube Shorts') ? '17:30' : '18:30';

    const itemTopic = customTopic && i === 0 ? `${customTopic}: ${topicData.topic}` : topicData.topic;
    const cleanId = 'ap_' + Date.now() + '_' + (i + 1);

    const statuses = ['Idea', 'Script Ready', 'Recording', 'Editing', 'Ready', 'Published'];
    // Give early items progression so the user sees all statuses clearly
    const itemStatus = i === 0 ? 'Ready' : (i === 1 ? 'Recording' : (i === 2 ? 'Script Ready' : 'Idea'));

    const scene1 = {
      sceneNumber: 1,
      timestamp: '0:00 - 0:03',
      visualCues: `Macro dynamic close-up demonstrating ${itemTopic}, sudden snap zoom or paper tear transition.`,
      dialogue: topicData.hook,
      onScreenText: lang === 'hindi' ? `✨ ${itemTopic}` : `✨ ${topicData.topic}`,
      sfx: 'Pencil chime / whoosh'
    };

    const scene2 = {
      sceneNumber: 2,
      timestamp: '0:03 - 0:20',
      visualCues: `Timelapse showing key technique: ${topicData.concept}, high-contrast lighting.`,
      dialogue: lang === 'hindi' 
        ? `पहले हल्के स्ट्रोक से बेस तैयार करें, फिर शेडिंग और ब्लेंडिंग से गहराई जोड़ें।`
        : `Notice how layering soft base tones first lets the deeper contrast pop naturally.`,
      onScreenText: lang === 'hindi' ? 'स्टेप 1: बेस लेयरिंग और शेड्स' : 'Step 1: Layering & Shading',
      sfx: 'Lo-fi chill beat'
    };

    const scene3 = {
      sceneNumber: 3,
      timestamp: '0:20 - ${duration === "15s" ? "0:15" : (duration === "30s" ? "0:30" : "0:50")}',
      visualCues: 'Camera tilting to reveal finished artwork side-by-side with reference, signature stamped.',
      dialogue: defaultCta,
      onScreenText: lang === 'hindi' ? 'रेटिंग दें 1-10 👇' : 'Rate 1 to 10 in Comments 👇',
      sfx: 'Victory chime'
    };

    const scenes = [scene1, scene2, scene3];
    const scriptText = scenes.map(s => `[${s.timestamp}] Scene ${s.sceneNumber}:\nVisual: ${s.visualCues}\nAudio/Voiceover: "${s.dialogue}"\nText: ${s.onScreenText}`).join('\n\n');
    const voiceover = `${topicData.hook} ${scene2.dialogue} ${defaultCta}`;
    const onScreenText = scenes.map(s => s.onScreenText).join(' | ');

    const titleOptions = lang === 'hindi' ? [
      `${topicData.topic} (सिर्फ 30 सेकंड में सीखें)`,
      `यह 1 आर्ट सीक्रेट आपकी ड्राइंग 10 गुना बेहतर बना देगा!`,
      `${topicData.topic}: बिगिनर्स यह गलती कभी न करें`
    ] : [
      `${topicData.topic} (Step-by-Step Tutorial)`,
      `This 1 Art Technique Changes Everything!`,
      `How to Master ${topicData.topic} in 60s`
    ];

    const hashtags = [
      '#NikhilArts',
      '#' + category.replace(/[^a-zA-Z0-9]/g, ''),
      '#DrawingTutorial',
      '#ArtistOnInstagram',
      '#SketchingDaily',
      '#SpeedPainting',
      '#LearnArt',
      '#CreativeReels'
    ];

    const caption = lang === 'hindi'
      ? `🎨 ${topicData.topic}!\n\n${topicData.concept}\n\n📌 इस ट्यूटोरियल को सेव करें ताकि अगली बार स्केचिंग करते समय आसानी हो!\n\n${defaultCta}\n\n${hashtags.join(' ')}`
      : `🎨 ${topicData.topic}!\n\n${topicData.concept}\n\n📌 Save this reel so you can refer back to it during your next studio session!\n\n${defaultCta}\n\n${hashtags.join(' ')}`;

    const thumbnailIdea = `High-contrast split image: Left shows unfinished guideline with yellow question mark; Right shows stunning completed art detail of ${topicData.topic} with bold text: "TRY THIS!".`;

    generatedItems.push({
      id: cleanId,
      brandId: brand?.id || 'brand_arts',
      topic: itemTopic,
      concept: topicData.concept,
      hook: topicData.hook,
      category,
      platform,
      duration,
      language: lang,
      status: itemStatus,
      scriptText,
      scenes,
      voiceover,
      onScreenText,
      titleOptions,
      selectedTitle: titleOptions[0],
      caption,
      hashtags,
      cta: defaultCta,
      thumbnailIdea,
      scheduledDate: postDate,
      scheduledTime: postTime,
      createdAt: new Date().toISOString()
    });
  }

  return {
    success: true,
    count: generatedItems.length,
    plan: generatedItems
  };
}
