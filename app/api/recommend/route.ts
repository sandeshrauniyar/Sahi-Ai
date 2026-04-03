import { NextRequest, NextResponse } from 'next/server'

// ── TYPE DEFINITIONS ──────────────────────────────────────────────────────────
interface Tool {
  name: string
  tags: string[]
  mobile: boolean
  free: boolean
  paidPlan: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  indiaRank: number
  hindiSupport: boolean
  offlineOk: boolean
  studentOk: boolean
  learningCurveMinutes: number  // how fast to first result
  trustScore: number            // 0-100 reliability score
  vpnNeeded: boolean
  upiSupported: boolean
  mobileQuality: number         // 0-10 mobile experience score
}

interface ScoredTool extends Tool {
  score: number
  matchReasons: string[]
  dimensionScores: Record<string, number>
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
  isCreator: boolean
  isFreelancer: boolean
  isBusinessOwner: boolean
  isFresher: boolean
  isStartupFounder: boolean
  budgetINR: number
}

// ── 207 TOOL DATABASE ─────────────────────────────────────────────────────────
const TOOL_DB: Tool[] = [

  // ══ AI WRITING & ASSISTANTS ══
  { name: 'ChatGPT', tags: ['writing','ai','study','research','content','earn','productivity','code','email','creative','chat'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 99, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 98, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Google Gemini', tags: ['writing','ai','study','research','hindi','content','productivity','chat','email'], mobile: true, free: true, paidPlan: '₹1,950/mo', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 97, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Microsoft Copilot', tags: ['writing','productivity','ai','study','research','office','chat'], mobile: true, free: true, paidPlan: '₹2,200/mo', difficulty: 'Easy', indiaRank: 82, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Claude AI', tags: ['writing','ai','research','study','code','analysis','creative','email','chat'], mobile: true, free: true, paidPlan: '₹1,700/mo', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 96, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Perplexity AI', tags: ['research','ai','study','information','news','search'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Quillbot', tags: ['writing','study','research','paraphrase','grammar','student','rewrite'], mobile: true, free: true, paidPlan: '₹650/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Grammarly', tags: ['writing','grammar','email','study','professional','student','editing'], mobile: true, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 93, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Writesonic', tags: ['writing','content','marketing','seo','email','blog','business'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Copy.ai', tags: ['writing','content','marketing','email','business','social','copywriting'], mobile: true, free: true, paidPlan: '₹2,900/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Rytr', tags: ['writing','content','email','marketing','blog','social','affordable'], mobile: true, free: true, paidPlan: '₹600/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Wordtune', tags: ['writing','content','email','study','professional','rewrite'], mobile: true, free: true, paidPlan: '₹750/mo', difficulty: 'Easy', indiaRank: 64, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Notion AI', tags: ['writing','productivity','organize','study','research','notes','ai'], mobile: true, free: false, paidPlan: '₹800/mo', difficulty: 'Medium', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 15, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Otter.ai', tags: ['productivity','study','research','meeting','transcribe','notes'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Jasper AI', tags: ['writing','content','marketing','business','email','seo','blog'], mobile: true, free: false, paidPlan: '₹3,300/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },

  // ══ DESIGN & IMAGE CREATION ══
  { name: 'Canva', tags: ['content','design','business','earn','freelance','social','marketing','student','presentation'], mobile: true, free: true, paidPlan: '₹499/mo', difficulty: 'Easy', indiaRank: 99, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 98, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Adobe Express', tags: ['content','design','social','business','freelance','marketing','image'], mobile: true, free: true, paidPlan: '₹1,299/mo', difficulty: 'Easy', indiaRank: 76, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 8, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Microsoft Designer', tags: ['design','content','social','business','ai','image'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 68, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Adobe Firefly', tags: ['design','ai','content','creative','image','generative'], mobile: true, free: true, paidPlan: '₹1,675/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Midjourney', tags: ['design','ai','image','creative','freelance','earn','generative'], mobile: false, free: false, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },
  { name: 'DALL-E 3', tags: ['design','ai','image','creative','content','generative'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Leonardo AI', tags: ['design','ai','image','creative','content','earn','generative'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Remove.bg', tags: ['design','content','mobile','freelance','earn','image','background'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 1, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Cleanup.pictures', tags: ['design','content','image','mobile','freelance','editing'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 1, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Photoroom', tags: ['design','image','mobile','business','ecommerce','background'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Figma', tags: ['design','ui','freelance','earn','code','professional','prototype'], mobile: false, free: true, paidPlan: '₹1,250/mo', difficulty: 'Hard', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 60, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },
  { name: 'Snapseed', tags: ['design','image','mobile','photo','editing','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 5, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Lightroom Mobile', tags: ['design','image','mobile','photo','editing','professional'], mobile: true, free: true, paidPlan: '₹480/mo', difficulty: 'Medium', indiaRank: 87, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 15, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Picsart', tags: ['design','image','mobile','content','social','editing'], mobile: true, free: true, paidPlan: '₹299/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },

  // ══ VIDEO CREATION & EDITING ══
  { name: 'CapCut', tags: ['content','video','reels','social','earn','mobile','editing','ai'], mobile: true, free: true, paidPlan: '₹399/mo', difficulty: 'Easy', indiaRank: 98, hindiSupport: true, offlineOk: true, studentOk: true, learningCurveMinutes: 10, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'InShot', tags: ['content','video','reels','mobile','social','editing'], mobile: true, free: true, paidPlan: '₹299/mo', difficulty: 'Easy', indiaRank: 93, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 8, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Kinemaster', tags: ['video','editing','mobile','content','reels','professional'], mobile: true, free: true, paidPlan: '₹349/mo', difficulty: 'Medium', indiaRank: 90, hindiSupport: true, offlineOk: true, studentOk: true, learningCurveMinutes: 20, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'VN Video Editor', tags: ['video','editing','mobile','content','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 85, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 10, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'DaVinci Resolve', tags: ['video','editing','professional','freelance','earn','advanced'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 68, hindiSupport: false, offlineOk: true, studentOk: false, learningCurveMinutes: 120, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 0 },
  { name: 'Veed.io', tags: ['video','editing','content','social','business','subtitle','ai'], mobile: true, free: true, paidPlan: '₹1,400/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 8, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'HeyGen', tags: ['video','ai','business','marketing','content','earn','avatar'], mobile: false, free: true, paidPlan: '₹2,500/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },
  { name: 'Pictory AI', tags: ['content','video','ai','business','earn','marketing','text-to-video'], mobile: false, free: false, paidPlan: '₹1,600/mo', difficulty: 'Medium', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 15, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },
  { name: 'Runway ML', tags: ['video','ai','creative','content','earn','professional','generative'], mobile: false, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },
  { name: 'Kapwing', tags: ['video','editing','content','social','meme','subtitle'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 8, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Loom', tags: ['video','productivity','business','meeting','screen','professional'], mobile: true, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },

  // ══ AUDIO & VOICE ══
  { name: 'ElevenLabs', tags: ['content','ai','earn','freelance','voice','audio','tts'], mobile: false, free: true, paidPlan: '₹1,800/mo', difficulty: 'Medium', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },
  { name: 'Murf AI', tags: ['content','voice','ai','business','earn','audio','hindi','tts'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 65, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },
  { name: 'Suno AI', tags: ['audio','music','ai','creative','content','generate'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Adobe Podcast', tags: ['audio','podcast','content','earn','professional','enhance'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 58, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },
  { name: 'Krisp', tags: ['audio','productivity','meeting','professional','noise'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 60, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 3, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },

  // ══ STUDY & LEARNING ══
  { name: 'Khan Academy', tags: ['study','student','learn','math','science','free','hindi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Anki', tags: ['study','memory','student','organize','offline','flashcard'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 78, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 20, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Photomath', tags: ['study','student','math','mobile','solve','camera'], mobile: true, free: true, paidPlan: '₹550/mo', difficulty: 'Easy', indiaRank: 88, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 1, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Socratic by Google', tags: ['study','student','homework','mobile','ai','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 84, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 1, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Wolfram Alpha', tags: ['study','math','research','student','science','calculation'], mobile: true, free: true, paidPlan: '₹500/mo', difficulty: 'Medium', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Unacademy', tags: ['study','student','india','exam','competitive','hindi'], mobile: true, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 88, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'BYJU\'S', tags: ['study','student','india','exam','learn','math','hindi'], mobile: true, free: true, paidPlan: '₹2,500/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 82, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Vedantu', tags: ['study','student','india','exam','live','tutor','hindi'], mobile: true, free: true, paidPlan: '₹1,800/mo', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 82, vpnNeeded: false, upiSupported: true, mobileQuality: 8 },
  { name: 'NPTEL', tags: ['study','learn','student','certificate','india','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 90, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Coursera', tags: ['learn','skill','student','job','certificate','global'], mobile: true, free: true, paidPlan: '₹2,900/mo', difficulty: 'Easy', indiaRank: 87, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Udemy', tags: ['learn','skill','student','job','earn','freelance','hindi'], mobile: true, free: false, paidPlan: '₹449 per course', difficulty: 'Easy', indiaRank: 93, hindiSupport: true, offlineOk: true, studentOk: true, learningCurveMinutes: 5, trustScore: 90, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Quizgecko', tags: ['study','ai','student','quiz','research','generate'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 75, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Forest App', tags: ['organize','study','focus','mobile','student','productivity'], mobile: true, free: true, paidPlan: '₹120 one-time', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 2, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Duolingo', tags: ['learn','language','student','mobile','free','english'], mobile: true, free: true, paidPlan: '₹399/mo', difficulty: 'Easy', indiaRank: 85, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Consensus AI', tags: ['research','study','science','ai','student','papers'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 55, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },

  // ══ PRODUCTIVITY & ORGANIZATION ══
  { name: 'Notion', tags: ['organize','productivity','study','research','notes','planning','wiki'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Medium', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 30, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Google Keep', tags: ['organize','productivity','mobile','notes','free','quick','simple'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 94, hindiSupport: true, offlineOk: true, studentOk: true, learningCurveMinutes: 1, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Todoist', tags: ['organize','productivity','tasks','study','planning','todo'], mobile: true, free: true, paidPlan: '₹350/mo', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 5, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Google Workspace', tags: ['productivity','business','study','organize','research','office','email'], mobile: true, free: true, paidPlan: '₹125/mo', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 97, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Microsoft 365', tags: ['productivity','business','study','office','professional','word','excel'], mobile: true, free: false, paidPlan: '₹500/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: true, offlineOk: true, studentOk: true, learningCurveMinutes: 10, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Trello', tags: ['organize','business','productivity','freelance','planning','kanban'], mobile: true, free: true, paidPlan: '₹420/mo', difficulty: 'Easy', indiaRank: 74, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Obsidian', tags: ['organize','notes','research','study','writing','offline'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 62, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 60, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 6 },
  { name: 'ClickUp', tags: ['organize','business','productivity','freelance','planning','team'], mobile: true, free: true, paidPlan: '₹420/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 30, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Any.do', tags: ['organize','productivity','tasks','mobile','todo','reminder'], mobile: true, free: true, paidPlan: '₹330/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: true, studentOk: true, learningCurveMinutes: 3, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Calendly', tags: ['productivity','business','meeting','professional','schedule'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Asana', tags: ['organize','business','productivity','team','project','planning'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },

  // ══ BUSINESS & MARKETING ══
  { name: 'WhatsApp Business', tags: ['business','india','marketing','mobile','sell','customer','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 99, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 98, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },
  { name: 'Meta Business Suite', tags: ['business','social','marketing','content','india','ads','facebook'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Dukaan', tags: ['business','india','sell','ecommerce','mobile','earn','shop'], mobile: true, free: true, paidPlan: '₹999/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 85, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Instamojo', tags: ['business','india','earn','sell','payments','freelance','digital'], mobile: true, free: true, paidPlan: '₹0 (small fee)', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 82, vpnNeeded: false, upiSupported: true, mobileQuality: 8 },
  { name: 'Razorpay', tags: ['business','india','earn','payments','sell','ecommerce'], mobile: true, free: true, paidPlan: '₹0 (2% fee)', difficulty: 'Medium', indiaRank: 96, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 95, vpnNeeded: false, upiSupported: true, mobileQuality: 8 },
  { name: 'Shopify', tags: ['business','ecommerce','sell','earn','marketing','store'], mobile: true, free: false, paidPlan: '₹1,994/mo', difficulty: 'Medium', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 30, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Mailchimp', tags: ['business','marketing','email','earn','newsletter','automation'], mobile: true, free: true, paidPlan: '₹1,300/mo', difficulty: 'Medium', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Buffer', tags: ['content','social','business','marketing','schedule','instagram'], mobile: true, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Zoho CRM', tags: ['business','organize','marketing','india','customer','crm'], mobile: true, free: true, paidPlan: '₹800/mo', difficulty: 'Hard', indiaRank: 84, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 60, trustScore: 85, vpnNeeded: false, upiSupported: true, mobileQuality: 7 },
  { name: 'Vyapar', tags: ['business','india','accounting','mobile','gst','invoice'], mobile: true, free: true, paidPlan: '₹1,999/yr', difficulty: 'Easy', indiaRank: 88, hindiSupport: true, offlineOk: true, studentOk: false, learningCurveMinutes: 10, trustScore: 88, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Google Analytics', tags: ['business','marketing','data','research','seo','website'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Hard', indiaRank: 84, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 60, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 6 },
  { name: 'Ubersuggest', tags: ['seo','marketing','business','content','research','keyword'], mobile: false, free: true, paidPlan: '₹2,500/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 15, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 4 },
  { name: 'Google Forms', tags: ['research','survey','study','business','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },

  // ══ EARNING & FREELANCE ══
  { name: 'Fiverr', tags: ['earn','freelance','business','skill','design','writing','global'], mobile: true, free: true, paidPlan: '₹0 (20% commission)', difficulty: 'Medium', indiaRank: 93, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 20, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Meesho', tags: ['earn','business','mobile','india','resell','sell','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 88, vpnNeeded: false, upiSupported: true, mobileQuality: 10 },
  { name: 'Internshala', tags: ['earn','skill','job','student','freelance','india','internship'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Naukri.com', tags: ['job','india','earn','professional','resume','placement'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'LinkedIn', tags: ['job','professional','network','earn','skill','business','global'], mobile: true, free: true, paidPlan: '₹1,800/mo', difficulty: 'Easy', indiaRank: 92, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Topmate', tags: ['earn','freelance','skill','business','mentoring','consulting'], mobile: true, free: true, paidPlan: '₹0 (5% commission)', difficulty: 'Easy', indiaRank: 78, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 82, vpnNeeded: false, upiSupported: true, mobileQuality: 8 },
  { name: 'Gumroad', tags: ['earn','sell','content','digital','freelance','creator'], mobile: true, free: true, paidPlan: '₹0 (10% fee)', difficulty: 'Easy', indiaRank: 65, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Ko-fi', tags: ['earn','content','creator','donations','digital','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Freelancer.com', tags: ['earn','freelance','skill','global','design'], mobile: true, free: true, paidPlan: '₹0 (commission)', difficulty: 'Medium', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 15, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Upwork', tags: ['earn','freelance','skill','professional','global'], mobile: true, free: true, paidPlan: '₹0 (commission)', difficulty: 'Hard', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 30, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Beacons.ai', tags: ['social','content','business','earn','creator','linkinbio'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },

  // ══ SOCIAL MEDIA & CONTENT GROWTH ══
  { name: 'YouTube Studio', tags: ['content','video','earn','creator','social','india','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 98, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 97, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Moj', tags: ['content','social','india','reels','creator','earn','hindi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'ShareChat', tags: ['social','india','content','hindi','creator','regional'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 94, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Linktree', tags: ['social','content','business','earn','creator','bio'], mobile: true, free: true, paidPlan: '₹500/mo', difficulty: 'Easy', indiaRank: 84, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Later', tags: ['social','content','marketing','business','schedule','instagram'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Easy', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 10, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Josh', tags: ['content','social','india','reels','creator','earn','hindi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 90, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Telegram', tags: ['community','business','content','marketing','india','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 90, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 10 },

  // ══ PRESENTATIONS & RESEARCH ══
  { name: 'Gamma.app', tags: ['presentations','study','business','research','ai','content','slides'], mobile: false, free: true, paidPlan: '₹1,200/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },
  { name: 'Google Slides', tags: ['presentations','study','business','free','collaborate'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Beautiful.ai', tags: ['presentations','business','research','professional','slides'], mobile: false, free: true, paidPlan: '₹1,000/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },
  { name: 'Mentimeter', tags: ['presentations','business','interactive','study','poll'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Power BI', tags: ['data','research','business','professional','microsoft'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Hard', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 90, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 5 },
  { name: 'Elicit', tags: ['research','study','ai','science','student','papers'], mobile: false, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 52, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 2 },

  // ══ CODE & DEVELOPMENT ══
  { name: 'GitHub Copilot', tags: ['code','ai','professional','earn','freelance','developer'], mobile: false, free: false, paidPlan: '₹830/mo', difficulty: 'Hard', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 30, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 0 },
  { name: 'Replit', tags: ['code','learn','student','ai','earn','professional','browser'], mobile: true, free: true, paidPlan: '₹1,250/mo', difficulty: 'Medium', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 15, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },
  { name: 'Cursor AI', tags: ['code','ai','professional','earn','freelance','editor'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Hard', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 30, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 0 },
  { name: 'Bolt.new', tags: ['code','ai','earn','freelance','web','fullstack'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 80, vpnNeeded: false, upiSupported: false, mobileQuality: 0 },
  { name: 'freeCodeCamp', tags: ['code','learn','student','free','skill','earn'], mobile: false, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 4 },
  { name: 'Codecademy', tags: ['code','learn','student','skill','earn'], mobile: true, free: true, paidPlan: '₹1,400/mo', difficulty: 'Easy', indiaRank: 80, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 10, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 7 },

  // ══ FINANCE & INVESTMENT (INDIA) ══
  { name: 'Groww', tags: ['finance','india','invest','earn','mobile','stocks','mutual'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 95, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 90, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'Zerodha Kite', tags: ['finance','india','invest','earn','professional','stocks','trading'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Medium', indiaRank: 93, hindiSupport: true, offlineOk: false, studentOk: false, learningCurveMinutes: 20, trustScore: 92, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'ET Money', tags: ['finance','india','invest','organize','budget'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 85, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 85, vpnNeeded: false, upiSupported: true, mobileQuality: 9 },
  { name: 'CRED', tags: ['finance','india','mobile','credit','bills','rewards'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 88, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 5, trustScore: 85, vpnNeeded: false, upiSupported: true, mobileQuality: 10 },
  { name: 'Google Pay', tags: ['india','payments','mobile','free','business','upi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 97, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 97, vpnNeeded: false, upiSupported: true, mobileQuality: 10 },
  { name: 'PhonePe', tags: ['india','payments','mobile','free','business','upi'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 96, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 95, vpnNeeded: false, upiSupported: true, mobileQuality: 10 },

  // ══ AI AUTOMATION & ADVANCED ══
  { name: 'Zapier', tags: ['automation','productivity','business','professional','workflow'], mobile: false, free: true, paidPlan: '₹1,650/mo', difficulty: 'Medium', indiaRank: 68, hindiSupport: false, offlineOk: false, studentOk: false, learningCurveMinutes: 30, trustScore: 88, vpnNeeded: false, upiSupported: false, mobileQuality: 3 },
  { name: 'Poe', tags: ['ai','chat','research','study','creative','multiple'], mobile: true, free: true, paidPlan: '₹1,650/mo', difficulty: 'Easy', indiaRank: 70, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 82, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Character.ai', tags: ['ai','creative','chat','study','entertainment'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 72, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'NotebookLM', tags: ['study','research','ai','notes','student','pdf','analysis'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 75, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 90, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Ideogram', tags: ['design','ai','image','creative','text','logo'], mobile: true, free: true, paidPlan: '₹830/mo', difficulty: 'Easy', indiaRank: 62, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 78, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },

  // ══ INDIA-SPECIFIC TOOLS ══
  { name: 'DigiLocker', tags: ['india','documents','government','mobile','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Vokal', tags: ['india','hindi','knowledge','q&a','earn'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 80, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 75, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Koo', tags: ['social','india','content','hindi','microblog'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 75, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 72, vpnNeeded: false, upiSupported: false, mobileQuality: 8 },
  { name: 'Discord', tags: ['community','content','creator','gaming','study','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 82, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 5, trustScore: 85, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Google Meet', tags: ['meeting','business','study','professional','free'], mobile: true, free: true, paidPlan: '₹0', difficulty: 'Easy', indiaRank: 92, hindiSupport: true, offlineOk: false, studentOk: true, learningCurveMinutes: 2, trustScore: 95, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
  { name: 'Zoom', tags: ['meeting','business','study','professional','video'], mobile: true, free: true, paidPlan: '₹1,300/mo', difficulty: 'Easy', indiaRank: 90, hindiSupport: false, offlineOk: false, studentOk: true, learningCurveMinutes: 3, trustScore: 92, vpnNeeded: false, upiSupported: false, mobileQuality: 9 },
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

  // Parse budget to INR number
  let budgetINR = 9999
  if (/₹0|free|मुफ्त/i.test(b)) budgetINR = 0
  else if (/₹200|200/i.test(b)) budgetINR = 200
  else if (/₹500|500/i.test(b)) budgetINR = 500
  else if (/₹2,000|2000/i.test(b)) budgetINR = 2000

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
    isCreator:        /creator|content|क्रिएटर/i.test(w),
    isFreelancer:     /freelancer|freelance|फ्रीलांसर/i.test(w),
    isBusinessOwner:  /business|shop|बिज़नेस|दुकान/i.test(w),
    isFresher:        /job seeker|fresher|नौकरी/i.test(w),
    isStartupFounder: /startup|founder|स्टार्टअप/i.test(w),
    budgetINR,
  }
}

// ── ADVANCED 12-DIMENSION SCORING ENGINE ─────────────────────────────────────
function scoreTools(
  answers: Record<string, string | string[]>,
  problem: string,
  language: string
): { scored: ScoredTool[]; signals: Signals } {
  const sig = detectSignals(answers, problem, language)
  const p = problem.toLowerCase()

  // Build weighted goal tag vector
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
  if (sig.wantsResearch)  goalTags.push('research', 'data')
  if (sig.wantsCode)      goalTags.push('code', 'web', 'developer')
  if (sig.wantsJob)       goalTags.push('job', 'professional', 'network')
  if (sig.wantsMarketing) goalTags.push('marketing', 'seo', 'social')
  if (sig.wantsFinance)   goalTags.push('finance', 'invest', 'stocks')
  if (goalTags.length === 0) goalTags.push('productivity', 'ai')

  const scored: ScoredTool[] = TOOL_DB.map((tool: Tool) => {
    const dim: Record<string, number> = {}
    const reasons: string[] = []

    // D1 — GOAL ALIGNMENT (30% weight)
    const tagMatches = goalTags.filter(t => tool.tags.includes(t)).length
    dim.goalAlignment = Math.min(30, tagMatches * 7)
    if (tagMatches >= 4)      { dim.goalAlignment += 6; reasons.push(`strong match (${tagMatches} goals)`) }
    else if (tagMatches >= 2) { reasons.push(`good match`) }
    else if (tagMatches === 1) { reasons.push(`partial match`) }

    // D2 — INDIA POPULARITY (15% weight)
    dim.indiaPopularity = Math.round((tool.indiaRank / 100) * 15)

    // D3 — HARD CONSTRAINT ELIMINATION
    dim.constraints = 0
    if (sig.isMobileOnly && !tool.mobile)  { dim.constraints -= 70; reasons.push('no mobile') }
    if (sig.isFreeOnly && !tool.free)       { dim.constraints -= 80; reasons.push('not free') }
    if (tool.vpnNeeded)                     { dim.constraints -= 15; reasons.push('needs VPN') }

    // D4 — AFFORDABILITY (10% weight)
    dim.affordability = 0
    if (sig.isFreeOnly && tool.free)        { dim.affordability += 10; reasons.push('free') }
    else if (sig.isLowBudget && tool.free)  { dim.affordability += 8 }
    else if (!sig.isFreeOnly)               { dim.affordability += 5 }

    // D5 — MOBILE EXPERIENCE (8% weight)
    dim.mobileExp = 0
    if (sig.isMobileOnly) {
      dim.mobileExp = tool.mobile ? Math.round((tool.mobileQuality / 10) * 8) : 0
      if (tool.mobileQuality >= 9) reasons.push('excellent mobile')
    } else {
      dim.mobileExp = tool.mobile ? 4 : 2
    }

    // D6 — LANGUAGE ACCESSIBILITY (10% weight)
    dim.language = 0
    if (sig.isHindiFirst) {
      if (tool.hindiSupport)  { dim.language += 10; reasons.push('Hindi supported') }
      else                    { dim.language -= 5 }
    } else {
      dim.language += 5
    }

    // D7 — SKILL MATCH (8% weight)
    dim.skillMatch = 0
    if (sig.isBeginner) {
      if (tool.difficulty === 'Easy')   { dim.skillMatch += 8; reasons.push('beginner-friendly') }
      else if (tool.difficulty === 'Medium') { dim.skillMatch += 2 }
      else { dim.skillMatch -= 5 }
    } else {
      dim.skillMatch += 4
    }

    // D8 — SPEED TO VALUE (5% weight)
    dim.speedToValue = 0
    if (tool.learningCurveMinutes <= 5)   dim.speedToValue = 5
    else if (tool.learningCurveMinutes <= 15) dim.speedToValue = 3
    else if (tool.learningCurveMinutes <= 30) dim.speedToValue = 1

    // D9 — CONNECTIVITY RESILIENCE (5% weight)
    dim.connectivity = 0
    if (sig.hasSlowNet) {
      if (tool.offlineOk)  { dim.connectivity += 5; reasons.push('works offline') }
      else                 { dim.connectivity -= 3 }
    } else {
      dim.connectivity += 2
    }

    // D10 — TRUST & RELIABILITY (5% weight)
    dim.trust = Math.round((tool.trustScore / 100) * 5)

    // D11 — STUDENT SAFETY (4% weight)
    dim.studentSafety = 0
    if (sig.isStudent) {
      if (tool.studentOk)  { dim.studentSafety += 4; reasons.push('student-friendly') }
      else                 { dim.studentSafety -= 8 }
    } else {
      dim.studentSafety += 2
    }

    // D12 — INDIA CONTEXT BONUS (keywords + UPI + India tags)
    dim.indiaContext = 0
    if (tool.tags.includes('india')) dim.indiaContext += 6
    if (sig.isHindiFirst && tool.tags.includes('hindi')) dim.indiaContext += 4
    if (tool.upiSupported) dim.indiaContext += 3

    // D13 — PROBLEM TEXT SEMANTIC MATCH
    const words = p.split(/\s+/)
    const semanticBoost = tool.tags.filter(t => words.some(w => w.length > 3 && (t.includes(w) || w.includes(t)))).length
    dim.semanticMatch = Math.min(10, semanticBoost * 4)

    // D14 — PERSONA MATCH
    dim.persona = 0
    if (sig.isCreator        && tool.tags.some(t => ['content','video','reels','creator','social'].includes(t))) dim.persona += 6
    if (sig.isFreelancer     && tool.tags.some(t => ['freelance','earn','skill'].includes(t))) dim.persona += 6
    if (sig.isBusinessOwner  && tool.tags.some(t => ['business','marketing','sell'].includes(t))) dim.persona += 6
    if (sig.isStartupFounder && tool.tags.some(t => ['business','code','professional'].includes(t))) dim.persona += 6
    if (sig.isFresher        && tool.tags.some(t => ['job','skill','learn','certificate'].includes(t))) dim.persona += 6

    // TOTAL SCORE
    const rawScore = Object.values(dim).reduce((a, b) => a + b, 0)
    const finalScore = Math.max(10, Math.min(98, rawScore + 50))

    return { ...tool, score: finalScore, matchReasons: reasons, dimensionScores: dim }
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
    const eliminated = scored.filter(t => t.score < 30).map(t => t.name).slice(0, 8)

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
      .filter(([k, v]) => v && k !== 'budgetINR')
      .map(([k]) => `✓${k}`)
      .join(' ')

    const context = `
SAHI AI SCORING ENGINE v3.0 — analyzed ${TOOL_DB.length} tools across 14 dimensions

TOP 15 RANKED TOOLS:
${top15.map((t, i) => `${i + 1}. ${t.name} | Score:${t.score} | Free:${t.free} | Mobile:${t.mobile} | IndiaRank:${t.indiaRank} | Hindi:${t.hindiSupport} | Difficulty:${t.difficulty} | LearningTime:${t.learningCurveMinutes}min | Trust:${t.trustScore} | UPI:${t.upiSupported} | Why:${t.matchReasons.join(',') || 'general match'}`).join('\n')}

ALGORITHM PRE-SELECTED:
• BEST OVERALL  → ${best.name} (score:${best.score}, free:${best.free}, price:${best.free ? '₹0' : best.paidPlan}, difficulty:${best.difficulty}, learningTime:${best.learningCurveMinutes}min)
• BEST FREE     → ${bestFree.name} (score:${bestFree.score}, indiaRank:${bestFree.indiaRank})
• MOST INDIAN   → ${mostIndian.name} (indiaRank:${mostIndian.indiaRank}, upi:${mostIndian.upiSupported}, hindi:${mostIndian.hindiSupport})
• CUSTOM PICK   → ${customPick.name} for struggle: "${struggles[0]}" (score:${customPick.score})

ELIMINATED (constraint violations): ${eliminated.join(', ')}
USER SIGNALS DETECTED: ${signalList}
BUDGET: ₹${signals.budgetINR === 9999 ? '2000+' : signals.budgetINR}
`

    const prompt = `You are Sahi AI — India's most advanced personalized tool recommendation engine, powered by a 14-dimension scoring algorithm that just analyzed ${TOOL_DB.length} tools.

The algorithm has already selected the 4 perfect tools. Your ONLY job: write WORLD-CLASS, deeply personal copy that makes users feel this was built specifically for them.

${context}

USER'S EXACT PROBLEM: "${problem}"
WHO: ${answers.who}
GOALS: ${(Array.isArray(answers.goal) ? answers.goal : [answers.goal] as string[]).join(', ')}
STRUGGLES: ${(Array.isArray(answers.struggle) ? answers.struggle : [answers.struggle] as string[]).join(', ')}
DEVICE: ${answers.device}
BUDGET: ${answers.budget}
SKILL: ${answers.skill}

WRITING RULES — non-negotiable:
1. "reason" MUST name their specific struggle/goal/who. Zero generic lines allowed.
2. "firstStep" — ultra-specific. Name the exact screen, button, or first prompt to type.
3. "tagline" — punchy, memorable, feels handcrafted for this exact person.
4. "detailedReason" — the "why behind the why". Real depth. 2-3 specific sentences.
5. Use confidence scores from algorithm exactly as given. Do not change them.
6. Respond ENTIRELY in ${isHindi ? 'Hindi (Devanagari script)' : 'English'}.
7. All prices must be in ₹. Do NOT change tool names.
8. Reference India-specific context where relevant — UPI, WhatsApp, no VPN needed, etc.

Return ONLY valid JSON — zero markdown, zero backticks, zero extra text outside JSON:
{
  "recommendations": [
    {
      "type": "${isHindi ? 'आपके लिए सबसे अच्छा' : 'Best for You'}",
      "tool": "${best.name}",
      "tagline": "One unforgettable line written specifically for this person — not generic",
      "reason": "2 sentences naming their specific who/goal/struggle",
      "detailedReason": "2-3 sentences of deep, specific, India-relevant insight",
      "price": "${best.free ? '₹0 — Completely Free' : best.paidPlan}",
      "difficulty": "${best.difficulty}",
      "confidence": ${best.score},
      "firstStep": "Exact first action: name the screen/button/first prompt to type"
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
      "reason": "2 sentences — Indian context + their specific profile",
      "detailedReason": "2-3 sentences with India-specific insight",
      "price": "${mostIndian.free ? '₹0 — Free' : mostIndian.paidPlan}",
      "difficulty": "${mostIndian.difficulty}",
      "confidence": ${mostIndian.score},
      "firstStep": "Exact first action"
    },
    {
      "type": "${isHindi ? 'कस्टम पिक' : 'Custom Pick'}",
      "tool": "${customPick.name}",
      "tagline": "One line that directly addresses: ${struggles[0]}",
      "reason": "2 sentences solving their #1 struggle: ${struggles[0]}",
      "detailedReason": "2-3 sentences",
      "price": "${customPick.free ? '₹0 — Free' : customPick.paidPlan}",
      "difficulty": "${customPick.difficulty}",
      "confidence": ${customPick.score},
      "firstStep": "Exact first action"
    }
  ]
}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 2048,
            topP: 0.85,
            topK: 40,
          },
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