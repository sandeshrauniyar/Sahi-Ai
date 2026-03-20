import { NextRequest, NextResponse } from 'next/server'

// ── TYPE DEFINITIONS ──────────────────────────────────────────────────────────
interface Tool {
  name: string
  tags: string[]
  mobile: boolean
  free: boolean
  paidPlan: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  indiaRank: number      // 0-100, how popular/useful in India
  hindiSupport: boolean
  offlineOk: boolean
  studentOk: boolean
}

interface ScoredTool extends Tool {
  score: number
  matchReasons: string[]
}

interface Signals {
  isStudent: boolean
  isMobileOnly: boolean
  isFreeOnly: boolean
  isLowBudget: boolean
  isHindiFirst: boolean
  isBeginner: boolean
  hasSlowNet: boolean
  wantsEarn: boolean
  wantsContent: boolean
  wantsBusiness: boolean
  wantsStudy: boolean
  wantsSkill: boolean
  wantsAI: boolean
  wantsOrganize: boolean
  wantsDesign: boolean
  wantsVideo: boolean
  wantsAudio: boolean
  wantsResearch: boolean
  wantsCode: boolean
  wantsJob: boolean
  wantsMarketing: boolean
  wantsFinance: boolean
  wantsHealth: boolean
  isCreator: boolean
  isFreelancer: boolean
  isBusinessOwner: boolean
  isFresher: boolean
  isStartupFounder: boolean
}

// ── 300+ TOOL DATABASE ────────────────────────────────────────────────────────
const TOOL_DB: Tool[] = [

  // ════════════════════════════════════════
  // AI WRITING & TEXT ASSISTANTS
  // ════════════════════════════════════════
  { name: 'ChatGPT', tags: ['writing','ai','study','research','content','earn','productivity','code','email','creative','chat'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 99, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Google Gemini', tags: ['writing','ai','study','research','hindi','content','productivity','chat','email'], mobile: true, free: true, paidPlan: '₹1,950/mo', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Microsoft Copilot', tags: ['writing','productivity','ai','study','research','office','chat'], mobile: true, free: true, paidPlan: '₹2,200/mo', difficulty: 'Easy', indiaRank: 82, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Claude AI', tags: ['writing','ai','research','study','code','analysis','creative','email','chat'], mobile: true, free: true, paidPlan: '₹1,700/mo', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Perplexity AI', tags: ['research','ai','study','information','news','search'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Quillbot', tags: ['writing','study','research','paraphrase','grammar','student','rewrite'], mobile: true, free: true, paidPlan: '₹650/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Grammarly', tags: ['writing','grammar','email','study','professional','student','editing'], mobile: true, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 93, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Writesonic', tags: ['writing','content','marketing','seo','email','blog','business'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Copy.ai', tags: ['writing','content','marketing','email','business','social','copywriting'], mobile: true, free: true, paidPlan: '₹2,900/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Jasper AI', tags: ['writing','content','marketing','business','email','seo','blog'], mobile: true, free: false, paidPlan: '₹3,300/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Rytr', tags: ['writing','content','email','marketing','blog','social','affordable'], mobile: true, free: true, paidPlan: '₹600/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Wordtune', tags: ['writing','content','email','study','professional','rewrite'], mobile: true, free: true, paidPlan: '₹750/mo', difficulty: 'Easy', indiaRank: 64, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Hemingway Editor', tags: ['writing','content','blog','professional','editing','clarity'], mobile: false, free: true, paidPlan: '₹1,650 one-time', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Notion AI', tags: ['writing','productivity','organize','study','research','notes','ai'], mobile: true, free: false, paidPlan: '₹800/mo', difficulty: 'Medium', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Otter.ai', tags: ['productivity','study','research','meeting','transcribe','notes'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Tactiq', tags: ['meeting','transcribe','productivity','study','notes'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Tome', tags: ['presentations','ai','writing','business','research','content'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Sudowrite', tags: ['writing','creative','fiction','blog','content'], mobile: false, free: false, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 45, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Ink for All', tags: ['writing','seo','content','blog','marketing'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 50, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Hypotenuse AI', tags: ['writing','ecommerce','content','seo','product'], mobile: false, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 48, hindiSupport: false, offlineOk: false, studentOk: false },

  // ════════════════════════════════════════
  // DESIGN & IMAGE CREATION
  // ════════════════════════════════════════
  { name: 'Canva', tags: ['content','design','business','earn','freelance','social','marketing','student','presentation'], mobile: true, free: true, paidPlan: '₹499/mo', difficulty: 'Easy', indiaRank: 99, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Adobe Express', tags: ['content','design','social','business','freelance','marketing','image'], mobile: true, free: true, paidPlan: '₹1,299/mo', difficulty: 'Easy', indiaRank: 76, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Microsoft Designer', tags: ['design','content','social','business','ai','image'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 68, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Adobe Firefly', tags: ['design','ai','content','creative','image','generative'], mobile: true, free: true, paidPlan: '₹1,675/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Midjourney', tags: ['design','ai','image','creative','freelance','earn','generative'], mobile: false, free: false, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'DALL-E 3', tags: ['design','ai','image','creative','content','generative'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Leonardo AI', tags: ['design','ai','image','creative','content','earn','generative'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Stable Diffusion', tags: ['design','ai','image','creative','free','generative','advanced'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 62, hindiSupport: false, offlineOk: true, studentOk: false },
  { name: 'Ideogram', tags: ['design','ai','image','creative','text','logo'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Flux AI', tags: ['design','ai','image','creative','generative'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Remove.bg', tags: ['design','content','mobile','freelance','earn','image','background'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Cleanup.pictures', tags: ['design','content','image','mobile','freelance','editing'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Photoroom', tags: ['design','image','mobile','business','ecommerce','background'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Figma', tags: ['design','ui','freelance','earn','code','professional','prototype'], mobile: false, free: true, paidPlan: '₹1,250/mo', difficulty: 'Hard', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Looka', tags: ['design','business','logo','brand','identity'], mobile: false, free: false, paidPlan: '₹4,150 one-time', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Brandmark', tags: ['design','business','logo','brand'], mobile: false, free: false, paidPlan: '₹2,500 one-time', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Namecheap Logo Maker', tags: ['design','business','logo','free','brand'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Snapseed', tags: ['design','image','mobile','photo','editing','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 88, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Lightroom Mobile', tags: ['design','image','mobile','photo','editing','professional'], mobile: true, free: true, paidPlan: '₹480/mo', difficulty: 'Medium', indiaRank: 85, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Picsart', tags: ['design','image','mobile','content','social','editing'], mobile: true, free: true, paidPlan: '₹299/mo', difficulty: 'Easy', indiaRank: 88, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // VIDEO CREATION & EDITING
  // ════════════════════════════════════════
  { name: 'CapCut', tags: ['content','video','reels','social','earn','mobile','editing','ai'], mobile: true, free: true, paidPlan: '₹399/mo', difficulty: 'Easy', indiaRank: 98, hindiSupport: true, offlineOk: true, studentOk: true },
  { name: 'InShot', tags: ['content','video','reels','mobile','social','editing'], mobile: true, free: true, paidPlan: '₹299/mo', difficulty: 'Easy', indiaRank: 93, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Kinemaster', tags: ['video','editing','mobile','content','reels','professional'], mobile: true, free: true, paidPlan: '₹349/mo', difficulty: 'Medium', indiaRank: 90, hindiSupport: true, offlineOk: true, studentOk: true },
  { name: 'VN Video Editor', tags: ['video','editing','mobile','content','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 85, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'DaVinci Resolve', tags: ['video','editing','professional','freelance','earn','advanced'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 68, hindiSupport: false, offlineOk: true, studentOk: false },
  { name: 'Veed.io', tags: ['video','editing','content','social','business','subtitle','ai'], mobile: true, free: true, paidPlan: '₹1,400/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Pictory AI', tags: ['content','video','ai','business','earn','marketing','text-to-video'], mobile: false, free: false, paidPlan: '₹1,600/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'HeyGen', tags: ['video','ai','business','marketing','content','earn','avatar'], mobile: false, free: true, paidPlan: '₹2,500/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Synthesia', tags: ['video','ai','business','marketing','earn','content','avatar'], mobile: false, free: false, paidPlan: '₹2,500/mo', difficulty: 'Easy', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Runway ML', tags: ['video','ai','creative','content','earn','professional','generative'], mobile: false, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Pika Labs', tags: ['content','ai','video','earn','creative','generative'], mobile: false, free: true, paidPlan: '₹1,200/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'D-ID', tags: ['content','ai','video','earn','avatar','talking'], mobile: false, free: true, paidPlan: '₹1,600/mo', difficulty: 'Medium', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Cliplama', tags: ['video','ai','content','social','mobile','shorts'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Descript', tags: ['audio','video','podcast','content','earn','editing','transcribe'], mobile: false, free: true, paidPlan: '₹1,000/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Kapwing', tags: ['video','editing','content','social','meme','subtitle'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Loom', tags: ['video','productivity','business','meeting','screen','professional'], mobile: true, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Animoto', tags: ['video','marketing','business','social','easy'], mobile: true, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // AUDIO, VOICE & MUSIC
  // ════════════════════════════════════════
  { name: 'ElevenLabs', tags: ['content','ai','earn','freelance','voice','audio','tts'], mobile: false, free: true, paidPlan: '₹1,800/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Murf AI', tags: ['content','voice','ai','business','earn','audio','hindi','tts'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 65, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Play.ht', tags: ['voice','ai','content','earn','audio','podcast'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 58, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Suno AI', tags: ['audio','music','ai','creative','content','generate'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Udio', tags: ['audio','music','ai','creative','content','generate'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Adobe Podcast', tags: ['audio','podcast','content','earn','professional','enhance'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Cleanvoice AI', tags: ['audio','podcast','content','editing','professional'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 52, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Voicify AI', tags: ['voice','ai','music','creative','cover'], mobile: true, free: false, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Krisp', tags: ['audio','productivity','meeting','professional','noise'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },

  // ════════════════════════════════════════
  // STUDY, LEARNING & EDUCATION
  // ════════════════════════════════════════
  { name: 'Khan Academy', tags: ['study','student','learn','math','science','free','hindi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Anki', tags: ['study','memory','student','organize','offline','flashcard'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 78, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Photomath', tags: ['study','student','math','mobile','solve','camera'], mobile: true, free: true, paidPlan: '₹550/mo', difficulty: 'Easy', indiaRank: 88, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Socratic by Google', tags: ['study','student','homework','mobile','ai','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 84, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Wolfram Alpha', tags: ['study','math','research','student','science','calculation'], mobile: true, free: true, paidPlan: '₹500/mo', difficulty: 'Medium', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Unacademy', tags: ['study','student','india','exam','competitive','hindi'], mobile: true, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'BYJU\'S', tags: ['study','student','india','exam','learn','math','hindi'], mobile: true, free: true, paidPlan: '₹2,500/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Vedantu', tags: ['study','student','india','exam','live','tutor','hindi'], mobile: true, free: true, paidPlan: '₹1,800/mo', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'NPTEL', tags: ['study','learn','student','certificate','india','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 90, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Coursera', tags: ['learn','skill','student','job','certificate','global'], mobile: true, free: true, paidPlan: '₹2,900/mo', difficulty: 'Easy', indiaRank: 87, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Udemy', tags: ['learn','skill','student','job','earn','freelance','hindi'], mobile: true, free: false, paidPlan: '₹449 per course', difficulty: 'Easy', indiaRank: 93, hindiSupport: true, offlineOk: true, studentOk: true },
  { name: 'edX', tags: ['learn','skill','student','certificate','global','university'], mobile: true, free: true, paidPlan: '₹2,500/mo', difficulty: 'Medium', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Skillshare', tags: ['learn','skill','creative','design','content','earn'], mobile: true, free: false, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'LinkedIn Learning', tags: ['learn','skill','job','professional','business','certificate'], mobile: true, free: false, paidPlan: '₹1,500/mo', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Quizgecko', tags: ['study','ai','student','quiz','research','generate'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Brainscape', tags: ['study','student','memory','flashcard','offline'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Duolingo', tags: ['learn','language','student','mobile','free','english'], mobile: true, free: true, paidPlan: '₹399/mo', difficulty: 'Easy', indiaRank: 85, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Forest App', tags: ['organize','study','focus','mobile','student','productivity'], mobile: true, free: true, paidPlan: '₹120 one-time', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Focusmate', tags: ['organize','study','productivity','accountability','focus'], mobile: false, free: true, paidPlan: '₹420/mo', difficulty: 'Easy', indiaRank: 52, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Consensus AI', tags: ['research','study','science','ai','student','papers'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Elicit', tags: ['research','study','ai','science','student','papers'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 52, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // PRODUCTIVITY & ORGANIZATION
  // ════════════════════════════════════════
  { name: 'Notion', tags: ['organize','productivity','study','research','notes','planning','wiki'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Medium', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Google Keep', tags: ['organize','productivity','mobile','notes','free','quick','simple'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 94, hindiSupport: true, offlineOk: true, studentOk: true },
  { name: 'Todoist', tags: ['organize','productivity','tasks','study','planning','todo'], mobile: true, free: true, paidPlan: '₹350/mo', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Google Workspace', tags: ['productivity','business','study','organize','research','office','email'], mobile: true, free: true, paidPlan: '₹125/mo', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Microsoft 365', tags: ['productivity','business','study','office','professional','word','excel'], mobile: true, free: false, paidPlan: '₹500/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: true, offlineOk: true, studentOk: true },
  { name: 'Trello', tags: ['organize','business','productivity','freelance','planning','kanban'], mobile: true, free: true, paidPlan: '₹420/mo', difficulty: 'Easy', indiaRank: 74, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Obsidian', tags: ['organize','notes','research','study','writing','offline'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 62, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'ClickUp', tags: ['organize','business','productivity','freelance','planning','team'], mobile: true, free: true, paidPlan: '₹420/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Airtable', tags: ['organize','business','research','productivity','data','database'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Reclaim.ai', tags: ['organize','productivity','schedule','calendar','professional'], mobile: true, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 52, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Any.do', tags: ['organize','productivity','tasks','mobile','todo','reminder'], mobile: true, free: true, paidPlan: '₹330/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Evernote', tags: ['notes','organize','productivity','research','study'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Bear', tags: ['notes','writing','organize','study','offline'], mobile: true, free: false, paidPlan: '₹1,000/yr', difficulty: 'Easy', indiaRank: 45, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Linear', tags: ['organize','code','professional','team','project'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Asana', tags: ['organize','business','productivity','team','project','planning'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Monday.com', tags: ['organize','business','productivity','team','project'], mobile: true, free: false, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Jira', tags: ['organize','code','professional','team','project','agile'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Hard', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Calendly', tags: ['productivity','business','meeting','professional','schedule'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },

  // ════════════════════════════════════════
  // BUSINESS, MARKETING & ECOMMERCE
  // ════════════════════════════════════════
  { name: 'WhatsApp Business', tags: ['business','india','marketing','mobile','sell','customer','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 99, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Meta Business Suite', tags: ['business','social','marketing','content','india','ads','facebook'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Dukaan', tags: ['business','india','sell','ecommerce','mobile','earn','shop'], mobile: true, free: true, paidPlan: '₹999/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Instamojo', tags: ['business','india','earn','sell','payments','freelance','digital'], mobile: true, free: true, paidPlan: '₹0 (small fee)', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Razorpay', tags: ['business','india','earn','payments','sell','ecommerce'], mobile: true, free: true, paidPlan: '₹0 (2% fee)', difficulty: 'Medium', indiaRank: 96, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Shopify', tags: ['business','ecommerce','sell','earn','marketing','store'], mobile: true, free: false, paidPlan: '₹1,994/mo', difficulty: 'Medium', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'WooCommerce', tags: ['business','ecommerce','sell','earn','website','free'], mobile: false, free: true, paidPlan: '₹0 (hosting extra)', difficulty: 'Hard', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Mailchimp', tags: ['business','marketing','email','earn','newsletter','automation'], mobile: true, free: true, paidPlan: '₹1,300/mo', difficulty: 'Medium', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Buffer', tags: ['content','social','business','marketing','schedule','instagram'], mobile: true, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Hootsuite', tags: ['social','business','marketing','content','schedule'], mobile: true, free: false, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Zoho CRM', tags: ['business','organize','marketing','india','customer','crm'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Hard', indiaRank: 84, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'HubSpot', tags: ['business','marketing','crm','email','customer','free'], mobile: true, free: true, paidPlan: '₹3,300/mo', difficulty: 'Medium', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Brevo (Sendinblue)', tags: ['business','marketing','email','sms','automation'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Ubersuggest', tags: ['seo','marketing','business','content','research','keyword'], mobile: false, free: true, paidPlan: '₹2,500/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Semrush', tags: ['seo','marketing','business','research','content','keyword'], mobile: false, free: true, paidPlan: '₹8,300/mo', difficulty: 'Hard', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Google Analytics', tags: ['business','marketing','data','research','seo','website'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 84, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Hotjar', tags: ['business','marketing','ux','research','website','analytics'], mobile: false, free: true, paidPlan: '₹2,500/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Typeform', tags: ['business','marketing','research','survey','lead'], mobile: true, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Google Forms', tags: ['research','survey','study','business','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Tally Forms', tags: ['research','survey','business','free','simple'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Stripe', tags: ['business','earn','payments','sell','international','ecommerce'], mobile: true, free: true, paidPlan: '₹0 (2% fee)', difficulty: 'Hard', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Tally (Accounting)', tags: ['business','india','accounting','finance','gst'], mobile: false, free: false, paidPlan: '₹18,000/yr', difficulty: 'Hard', indiaRank: 92, hindiSupport: true, offlineOk: true, studentOk: false },
  { name: 'Vyapar', tags: ['business','india','accounting','mobile','gst','invoice'], mobile: true, free: true, paidPlan: '₹1,999/yr', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: true, studentOk: false },

  // ════════════════════════════════════════
  // EARNING, FREELANCE & JOB SEARCH
  // ════════════════════════════════════════
  { name: 'Fiverr', tags: ['earn','freelance','business','skill','design','writing','global'], mobile: true, free: true, paidPlan: '₹0 (20% commission)', difficulty: 'Medium', indiaRank: 93, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Upwork', tags: ['earn','freelance','skill','professional','global'], mobile: true, free: true, paidPlan: '₹0 (commission)', difficulty: 'Hard', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Meesho', tags: ['earn','business','mobile','india','resell','sell','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Internshala', tags: ['earn','skill','job','student','freelance','india','internship'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Naukri.com', tags: ['job','india','earn','professional','resume','placement'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'LinkedIn', tags: ['job','professional','network','earn','skill','business','global'], mobile: true, free: true, paidPlan: '₹1,800/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Indeed India', tags: ['job','india','earn','professional','resume'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Topmate', tags: ['earn','freelance','skill','business','mentoring','consulting'], mobile: true, free: true, paidPlan: '₹0 (5% commission)', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Gumroad', tags: ['earn','sell','content','digital','freelance','creator'], mobile: true, free: true, paidPlan: '₹0 (10% fee)', difficulty: 'Easy', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Ko-fi', tags: ['earn','content','creator','donations','digital','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Teachable', tags: ['earn','skill','teach','course','business','online'], mobile: true, free: true, paidPlan: '₹2,900/mo', difficulty: 'Medium', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Thinkific', tags: ['earn','skill','teach','course','business'], mobile: true, free: true, paidPlan: '₹2,500/mo', difficulty: 'Medium', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Freelancer.com', tags: ['earn','freelance','skill','global','design'], mobile: true, free: true, paidPlan: '₹0 (commission)', difficulty: 'Medium', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'PeoplePerHour', tags: ['earn','freelance','skill','writing','design'], mobile: true, free: true, paidPlan: '₹0 (commission)', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Beacons.ai', tags: ['social','content','business','earn','creator','linkinbio'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Patreon', tags: ['earn','content','creator','membership','digital'], mobile: true, free: true, paidPlan: '₹0 (commission)', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },

  // ════════════════════════════════════════
  // SOCIAL MEDIA & CONTENT GROWTH
  // ════════════════════════════════════════
  { name: 'YouTube Studio', tags: ['content','video','earn','creator','social','india','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 98, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Moj', tags: ['content','social','india','reels','creator','earn','hindi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'ShareChat', tags: ['social','india','content','hindi','creator','regional'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 94, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Koo', tags: ['social','india','content','hindi','microblog'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 75, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Linktree', tags: ['social','content','business','earn','creator','bio'], mobile: true, free: true, paidPlan: '₹500/mo', difficulty: 'Easy', indiaRank: 84, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Later', tags: ['social','content','marketing','business','schedule','instagram'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Publer', tags: ['social','content','marketing','schedule','affordable'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Metricool', tags: ['social','analytics','marketing','business','schedule'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Flick', tags: ['social','instagram','hashtag','marketing','growth'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Taplink', tags: ['social','content','business','earn','creator','bio'], mobile: true, free: true, paidPlan: '₹420/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // PRESENTATIONS & RESEARCH
  // ════════════════════════════════════════
  { name: 'Gamma.app', tags: ['presentations','study','business','research','ai','content','slides'], mobile: false, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Beautiful.ai', tags: ['presentations','business','research','professional','slides'], mobile: false, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Canva Presentations', tags: ['presentations','study','business','design','easy'], mobile: true, free: true, paidPlan: '₹499/mo', difficulty: 'Easy', indiaRank: 94, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Google Slides', tags: ['presentations','study','business','free','collaborate'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Prezi', tags: ['presentations','business','creative','professional'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Mentimeter', tags: ['presentations','business','interactive','study','poll'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Tableau Public', tags: ['data','research','business','professional','visualization'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Power BI', tags: ['data','research','business','professional','microsoft'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Hard', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Datawrapper', tags: ['data','research','journalism','content','visualization'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // CODE & DEVELOPMENT
  // ════════════════════════════════════════
  { name: 'GitHub Copilot', tags: ['code','ai','professional','earn','freelance','developer'], mobile: false, free: false, paidPlan: '₹830/mo', difficulty: 'Hard', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Replit', tags: ['code','learn','student','ai','earn','professional','browser'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Cursor AI', tags: ['code','ai','professional','earn','freelance','editor'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Hard', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Bolt.new', tags: ['code','ai','earn','freelance','web','fullstack'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'v0 by Vercel', tags: ['code','ai','design','earn','freelance','web','ui'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Lovable', tags: ['code','ai','earn','freelance','web','app'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Codecademy', tags: ['code','learn','student','skill','earn'], mobile: true, free: true, paidPlan: '₹1,400/mo', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'freeCodeCamp', tags: ['code','learn','student','free','skill','earn'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // FINANCE & INVESTMENT (INDIA)
  // ════════════════════════════════════════
  { name: 'Groww', tags: ['finance','india','invest','earn','mobile','stocks','mutual'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Zerodha Kite', tags: ['finance','india','invest','earn','professional','stocks','trading'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 93, hindiSupport: true, offlineOk: false, studentOk: false },
  { name: 'Paytm Money', tags: ['finance','india','invest','earn','mobile','mutual'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 90, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'ET Money', tags: ['finance','india','invest','organize','budget'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 85, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'CRED', tags: ['finance','india','mobile','credit','bills','rewards'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 88, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Jupiter Money', tags: ['finance','india','mobile','banking','budget'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Walnut', tags: ['finance','india','budget','expense','track','mobile'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // HEALTH, WELLNESS & FOCUS
  // ════════════════════════════════════════
  { name: 'Calm', tags: ['wellness','health','student','organize','mobile','meditation'], mobile: true, free: true, paidPlan: '₹1,650/yr', difficulty: 'Easy', indiaRank: 74, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'Headspace', tags: ['wellness','health','student','organize','meditation'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: true, studentOk: true },
  { name: 'HealthifyMe', tags: ['health','india','wellness','mobile','diet','fitness'], mobile: true, free: true, paidPlan: '₹999/mo', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Nike Training Club', tags: ['health','fitness','mobile','free','workout'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // COMMUNICATION & COLLABORATION
  // ════════════════════════════════════════
  { name: 'Slack', tags: ['productivity','team','business','professional','communication'], mobile: true, free: true, paidPlan: '₹580/mo', difficulty: 'Easy', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Discord', tags: ['community','content','creator','gaming','study','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Zoom', tags: ['meeting','business','study','professional','video'], mobile: true, free: true, paidPlan: '₹1,300/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Google Meet', tags: ['meeting','business','study','professional','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Telegram', tags: ['community','business','content','marketing','india','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 90, hindiSupport: true, offlineOk: false, studentOk: true },

  // ════════════════════════════════════════
  // AI AUTOMATION & ADVANCED TOOLS
  // ════════════════════════════════════════
  { name: 'Zapier', tags: ['automation','productivity','business','professional','workflow'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Make (Integromat)', tags: ['automation','productivity','business','workflow','advanced'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Hard', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'n8n', tags: ['automation','code','professional','workflow','free'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Hard', indiaRank: 58, hindiSupport: false, offlineOk: true, studentOk: false },
  { name: 'Hugging Face', tags: ['ai','code','research','professional','models'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Poe', tags: ['ai','chat','research','study','creative','multiple'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Character.ai', tags: ['ai','creative','chat','study','entertainment'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Runway Gen-2', tags: ['video','ai','creative','professional','generative'], mobile: false, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Krea AI', tags: ['design','ai','image','creative','real-time'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true },
  { name: 'Magnific AI', tags: ['design','ai','image','upscale','professional'], mobile: false, free: false, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 52, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Luma AI', tags: ['design','ai','3d','video','creative'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: false },
  { name: 'Sora (OpenAI)', tags: ['video','ai','creative','professional','generative'], mobile: false, free: false, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false },

  // ════════════════════════════════════════
  // INDIA-SPECIFIC TOOLS
  // ════════════════════════════════════════
  { name: 'DigiLocker', tags: ['india','documents','government','mobile','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'UMANG App', tags: ['india','government','mobile','free','services'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 85, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Google Pay', tags: ['india','payments','mobile','free','business'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'PhonePe', tags: ['india','payments','mobile','free','business'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 96, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Paytm', tags: ['india','payments','mobile','business','earn'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Josh (Short Videos)', tags: ['content','social','india','reels','creator','earn'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Daily Hunt', tags: ['india','news','hindi','content','reading'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: true },
  { name: 'Vokal', tags: ['india','hindi','knowledge','q&a','earn'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 80, hindiSupport: true, offlineOk: false, studentOk: true },
]

// ── SIGNAL DETECTION ──────────────────────────────────────────────────────────
function detectSignals(
  answers: Record<string, string | string[]>,
  problem: string,
  language: string
): Signals {
  const goals = (Array.isArray(answers.goal) ? answers.goal : [answers.goal]) as string[]
  const struggles = (Array.isArray(answers.struggle) ? answers.struggle : [answers.struggle]) as string[]
  const p = problem.toLowerCase()
  const w = (answers.who as string) || ''
  const d = (answers.device as string) || ''
  const b = (answers.budget as string) || ''
  const s = (answers.skill as string) || ''

  const g = (rx: RegExp) => goals.some(x => rx.test(x)) || rx.test(p)
  const st = (rx: RegExp) => struggles.some(x => rx.test(x))

  return {
    isStudent:        /school|college|स्कूल|कॉलेज/i.test(w),
    isMobileOnly:     /android|iphone|phone|फोन/i.test(d) && !/laptop|both|दोनों/i.test(d),
    isFreeOnly:       /₹0|free|मुफ्त/i.test(b),
    isLowBudget:      /₹0|₹200|free|मुफ्त/i.test(b),
    isHindiFirst:     language === 'hindi' || st(/english|अंग्रेज़ी/i),
    isBeginner:       /beginner|शुरुआती|follow instructions|निर्देश/i.test(s),
    hasSlowNet:       st(/internet|slow|धीमा/i),
    wantsEarn:        g(/earn|income|money|कमाना|पैसे|freelance/i),
    wantsContent:     g(/content|viral|reel|youtube|creator|कंटेंट/i),
    wantsBusiness:    g(/business|customer|बिज़नेस|sell|shop/i),
    wantsStudy:       g(/study|marks|exam|पढ़ना|नंबर|homework/i),
    wantsSkill:       g(/skill|job|स्किल|नौकरी|learn|course/i),
    wantsAI:          g(/\bai\b|artificial intelligence/i),
    wantsOrganize:    g(/organize|productive|plan|schedule|ऑर्गेनाइज़/i),
    wantsDesign:      g(/design|graphic|logo|poster|image/i),
    wantsVideo:       g(/video|reel|edit|film|youtube/i),
    wantsAudio:       g(/audio|podcast|voice|music|sound/i),
    wantsResearch:    g(/research|report|analysis|data|project/i),
    wantsCode:        g(/code|app|website|web|program|software/i),
    wantsJob:         g(/job|placement|interview|resume|career/i),
    wantsMarketing:   g(/marketing|seo|ads|promote|grow|audience/i),
    wantsFinance:     g(/invest|finance|money management|stock|mutual/i),
    wantsHealth:      g(/health|fitness|wellness|meditation|exercise/i),
    isCreator:        /creator|content|क्रिएटर/i.test(w),
    isFreelancer:     /freelancer|freelance|फ्रीलांसर/i.test(w),
    isBusinessOwner:  /business|shop|बिज़नेस|दुकान/i.test(w),
    isFresher:        /job seeker|fresher|नौकरी/i.test(w),
    isStartupFounder: /startup|founder|स्टार्टअप/i.test(w),
  }
}

// ── SCORING ENGINE ────────────────────────────────────────────────────────────
function scoreTools(
  answers: Record<string, string | string[]>,
  problem: string,
  language: string
): { scored: ScoredTool[]; signals: Signals } {
  const sig = detectSignals(answers, problem, language)
  const p = problem.toLowerCase()

  // Build goal tag vector
  const goalTags: string[] = []
  if (sig.wantsEarn)      goalTags.push('earn', 'freelance', 'sell')
  if (sig.wantsContent)   goalTags.push('content', 'social', 'creator')
  if (sig.wantsVideo)     goalTags.push('video', 'reels', 'editing')
  if (sig.wantsAudio)     goalTags.push('audio', 'voice', 'podcast')
  if (sig.wantsBusiness)  goalTags.push('business', 'marketing', 'ecommerce')
  if (sig.wantsStudy)     goalTags.push('study', 'student', 'learn')
  if (sig.wantsSkill)     goalTags.push('learn', 'skill', 'course')
  if (sig.wantsAI)        goalTags.push('ai', 'research', 'chat')
  if (sig.wantsOrganize)  goalTags.push('organize', 'productivity', 'planning')
  if (sig.wantsDesign)    goalTags.push('design', 'image', 'creative')
  if (sig.wantsResearch)  goalTags.push('research', 'data', 'analysis')
  if (sig.wantsCode)      goalTags.push('code', 'web', 'developer')
  if (sig.wantsJob)       goalTags.push('job', 'professional', 'network')
  if (sig.wantsMarketing) goalTags.push('marketing', 'seo', 'social')
  if (sig.wantsFinance)   goalTags.push('finance', 'invest', 'stocks')
  if (sig.wantsHealth)    goalTags.push('health', 'wellness', 'fitness')
  if (goalTags.length === 0) goalTags.push('productivity', 'ai')

  const scored: ScoredTool[] = TOOL_DB.map((tool: Tool) => {
    let score = 50
    const reasons: string[] = []

    // ── GOAL TAG MATCH (highest weight) ──
    const tagMatches = goalTags.filter(t => tool.tags.includes(t)).length
    score += tagMatches * 9
    if (tagMatches >= 4)      { score += 10; reasons.push(`excellent match (${tagMatches} goals)`) }
    else if (tagMatches >= 2) { score += 5;  reasons.push(`good match (${tagMatches} goals)`) }
    else if (tagMatches > 0)  { reasons.push(`partial match`) }

    // ── INDIA POPULARITY ──
    score += Math.round((tool.indiaRank / 100) * 14)

    // ── HARD ELIMINATORS ──
    if (sig.isMobileOnly && !tool.mobile)  { score -= 65; reasons.push('no mobile') }
    if (sig.isFreeOnly   && !tool.free)    { score -= 75; reasons.push('not free') }

    // ── POSITIVE BONUSES ──
    if (sig.isFreeOnly   && tool.free)                    { score += 14; reasons.push('free') }
    if (sig.isMobileOnly && tool.mobile)                  { score += 12; reasons.push('mobile') }
    if (sig.isHindiFirst && tool.hindiSupport)            { score += 14; reasons.push('Hindi') }
    if (sig.isBeginner   && tool.difficulty === 'Easy')   { score += 12; reasons.push('beginner-friendly') }
    if (sig.hasSlowNet   && tool.offlineOk)               { score += 14; reasons.push('offline/slow-net') }
    if (sig.isStudent    && tool.studentOk)               { score += 10; reasons.push('student-friendly') }
    if (sig.isStudent    && !tool.studentOk)              { score -= 12 }
    if (sig.isLowBudget  && tool.free)                    { score += 8 }
    if (tool.tags.includes('india'))                      { score += 8 }
    if (sig.isHindiFirst && tool.tags.includes('hindi'))  { score += 8; reasons.push('Hindi-first') }

    // ── PROBLEM KEYWORD BOOST ──
    const words = p.split(/\s+/)
    const boost = tool.tags.filter(t => words.some(w => w.length > 3 && t.includes(w))).length
    score += boost * 6

    // ── PERSONA BONUS ──
    if (sig.isCreator        && tool.tags.some(t => ['content','video','reels','creator','social'].includes(t))) score += 8
    if (sig.isFreelancer     && tool.tags.some(t => ['freelance','earn','skill'].includes(t))) score += 8
    if (sig.isBusinessOwner  && tool.tags.some(t => ['business','marketing','sell'].includes(t))) score += 8
    if (sig.isStartupFounder && tool.tags.some(t => ['business','code','professional','team'].includes(t))) score += 8
    if (sig.isFresher        && tool.tags.some(t => ['job','skill','learn','certificate'].includes(t))) score += 8

    score = Math.max(15, Math.min(98, score))
    return { ...tool, score, matchReasons: reasons }
  })

  return {
    scored: scored.sort((a, b) => b.score - a.score),
    signals: sig,
  }
}

// ── ROUTE HANDLER ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { answers, problem, language } = await req.json()
    const isHindi = language === 'hindi'

    const { scored, signals } = scoreTools(answers, problem, language)

    const top15 = scored.slice(0, 15)
    const eliminated = scored.filter(t => t.score < 30).map(t => t.name).slice(0, 10)

    // Pre-select 4 distinct best tools
    const best = top15[0]
    const bestFree = top15.find(t => t.free && t.name !== best.name) || top15[1]
    const mostIndian = [...top15]
      .sort((a, b) => b.indiaRank - a.indiaRank)
      .find(t => t.name !== best.name && t.name !== bestFree.name) || top15[2]
    const struggles = (Array.isArray(answers.struggle) ? answers.struggle : [answers.struggle]) as string[]
    const customPick = top15.find(t =>
      t.name !== best.name &&
      t.name !== bestFree.name &&
      t.name !== mostIndian.name
    ) || top15[3]

    const signalList = Object.entries(signals)
      .filter(([, v]) => v)
      .map(([k]) => `✓${k}`)
      .join(' ')

    const context = `
SAHI AI SCORING ENGINE — analyzed ${TOOL_DB.length} tools

TOP 15 by score:
${top15.map((t, i) => `${i + 1}. ${t.name} | Score:${t.score} | Free:${t.free} | Mobile:${t.mobile} | IndiaRank:${t.indiaRank} | Hindi:${t.hindiSupport} | Difficulty:${t.difficulty} | Why:${t.matchReasons.join(',') || 'general'}`).join('\n')}

ALGORITHM PRE-SELECTED:
• BEST OVERALL → ${best.name} (score:${best.score}, price:${best.free ? 'Free' : best.paidPlan}, difficulty:${best.difficulty})
• BEST FREE    → ${bestFree.name} (score:${bestFree.score})
• MOST INDIAN  → ${mostIndian.name} (indiaRank:${mostIndian.indiaRank})  
• CUSTOM PICK  → ${customPick.name} for struggle: "${struggles[0]}"

ELIMINATED (constraint violations): ${eliminated.join(', ')}
USER SIGNALS: ${signalList}
`

    const prompt = `You are Sahi AI — India's most intelligent personalized tool recommendation engine.

A proprietary scoring algorithm just analyzed ${TOOL_DB.length} tools from across the world and India, and pre-selected the 4 perfect tools for this specific user. Your job: write WORLD-CLASS, deeply personalized copy for each tool. Be specific, warm, and insightful — like a brilliant friend who knows exactly what this person needs.

${context}

USER'S PROBLEM (their words): "${problem}"
WHO: ${answers.who}
GOALS: ${(Array.isArray(answers.goal) ? answers.goal : [answers.goal] as string[]).join(', ')}
STRUGGLES: ${(Array.isArray(answers.struggle) ? answers.struggle : [answers.struggle] as string[]).join(', ')}
DEVICE: ${answers.device}
BUDGET: ${answers.budget}
SKILL: ${answers.skill}

WRITING RULES — follow strictly:
1. "reason" — MUST name their specific struggle/goal/who. Zero generic lines.
2. "firstStep" — ultra-specific. Name the exact screen, button, prompt, or link.
3. "tagline" — punchy, memorable, feels like it was written just for them. Not boring.
4. "detailedReason" — the "why behind the why". Real depth. 2-3 specific sentences.
5. Confidence scores come from algorithm — use exactly as given.
6. Respond ENTIRELY in ${isHindi ? 'Hindi (Devanagari script)' : 'English'}.
7. All prices in ₹. Do NOT change tool names.

Return ONLY valid JSON — zero markdown, zero backticks, zero extra text:
{
  "recommendations": [
    {
      "type": "${isHindi ? 'आपके लिए सबसे अच्छा' : 'Best for You'}",
      "tool": "${best.name}",
      "tagline": "One unforgettable, specific line — not generic",
      "reason": "2 sentences naming their specific who/goal/struggle",
      "detailedReason": "2-3 sentences of deep, specific insight",
      "price": "${best.free ? '₹0 — Completely Free' : best.paidPlan}",
      "difficulty": "${best.difficulty}",
      "confidence": ${best.score},
      "firstStep": "Exact first action: name the screen/button/first prompt"
    },
    {
      "type": "${isHindi ? 'सबसे अच्छा मुफ्त विकल्प' : 'Best Free Option'}",
      "tool": "${bestFree.name}",
      "tagline": "One unforgettable line",
      "reason": "2 sentences specific to this user",
      "detailedReason": "2-3 sentences",
      "price": "₹0 — Completely Free",
      "difficulty": "${bestFree.difficulty}",
      "confidence": ${bestFree.score},
      "firstStep": "Exact first action"
    },
    {
      "type": "${isHindi ? 'भारत में सबसे लोकप्रिय' : 'Most Popular in India'}",
      "tool": "${mostIndian.name}",
      "tagline": "One unforgettable line with Indian flavour",
      "reason": "2 sentences — Indian context + their profile",
      "detailedReason": "2-3 sentences",
      "price": "${mostIndian.free ? '₹0 — Free' : mostIndian.paidPlan}",
      "difficulty": "${mostIndian.difficulty}",
      "confidence": ${mostIndian.score},
      "firstStep": "Exact first action"
    },
    {
      "type": "${isHindi ? 'कस्टम पिक' : 'Custom Pick'}",
      "tool": "${customPick.name}",
      "tagline": "One line addressing: ${struggles[0]}",
      "reason": "2 sentences solving: ${struggles[0]}",
      "detailedReason": "2-3 sentences",
      "price": "${customPick.free ? '₹0 — Free' : customPick.paidPlan}",
      "difficulty": "${customPick.difficulty}",
      "confidence": ${customPick.score},
      "firstStep": "Exact first action"
    }
  ]
}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.25, maxOutputTokens: 2048, topP: 0.85, topK: 40 },
        }),
      }
    )

    if (!res.ok) {
      const errData = await res.json()
      console.error('Gemini error:', errData)
      return NextResponse.json({ error: 'Gemini API failed' }, { status: 500 })
    }

    const data = await res.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = raw.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      const match = clean.match(/\{[\s\S]*\}/)
      if (match) parsed = JSON.parse(match[0])
      else throw new Error('JSON parse failed')
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}