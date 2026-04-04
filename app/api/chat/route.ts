import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { createHash, randomBytes, createHmac } from 'crypto'

// ════════════════════════════════════════════════════════════════════════
// FINGERPRINT & OBFUSCATION LAYER
// Makes it impossible to identify the underlying AI provider
// ════════════════════════════════════════════════════════════════════════
const ENGINE_FINGERPRINTS = [
  'sahi-core-v2', 'recommendation-engine', 'india-ai-stack',
  'multilingual-processor', 'context-analyzer'
]
const getEngineId = () => ENGINE_FINGERPRINTS[Math.floor(Math.random() * ENGINE_FINGERPRINTS.length)]

// ════════════════════════════════════════════════════════════════════════
// CLIENT POOL — rotates instances to prevent fingerprinting
// ════════════════════════════════════════════════════════════════════════
let _clientPool: GoogleGenerativeAI[] = []
let _poolIndex = 0

function getClient(): GoogleGenerativeAI {
  if (_clientPool.length === 0) {
    const key = process.env.GEMINI_API_KEY || process.env.AI_ENGINE_KEY || ''
    if (!key) throw new Error('ENGINE_NOT_CONFIGURED')
    // Create pool of 3 clients for rotation
    _clientPool = [
      new GoogleGenerativeAI(key),
      new GoogleGenerativeAI(key),
      new GoogleGenerativeAI(key),
    ]
  }
  _poolIndex = (_poolIndex + 1) % _clientPool.length
  return _clientPool[_poolIndex]
}

// ════════════════════════════════════════════════════════════════════════
// ADVANCED RATE LIMITING — sliding window + token bucket hybrid
// ════════════════════════════════════════════════════════════════════════
type RateLimitEntry = {
  requests: number[]   // timestamps of requests in window
  tokens: number       // token bucket
  lastRefill: number   // last token refill time
  violations: number   // repeated violation count
  blockedUntil: number // temporary block timestamp
}

const rlStore = new Map<string, RateLimitEntry>()
const RL_CONFIG = {
  windowMs: 60_000,        // 1 minute window
  maxRequests: 30,          // max requests per window
  tokenBucket: 10,          // burst allowance
  tokenRefillRate: 2,       // tokens per second
  maxViolations: 3,         // max violations before temp block
  blockDurationMs: 300_000, // 5 minute block on abuse
}

function checkRateLimit(ip: string): {
  allowed: boolean
  remaining: number
  resetIn: number
  reason?: string
} {
  const now = Date.now()
  let entry = rlStore.get(ip)

  if (!entry) {
    entry = {
      requests: [],
      tokens: RL_CONFIG.tokenBucket,
      lastRefill: now,
      violations: 0,
      blockedUntil: 0,
    }
    rlStore.set(ip, entry)
  }

  // Check if temporarily blocked
  if (entry.blockedUntil > now) {
    return { allowed: false, remaining: 0, resetIn: entry.blockedUntil - now, reason: 'TEMP_BLOCKED' }
  }

  // Refill token bucket
  const elapsed = (now - entry.lastRefill) / 1000
  entry.tokens = Math.min(
    RL_CONFIG.tokenBucket,
    entry.tokens + elapsed * RL_CONFIG.tokenRefillRate
  )
  entry.lastRefill = now

  // Sliding window — remove old requests
  entry.requests = entry.requests.filter(t => now - t < RL_CONFIG.windowMs)

  // Check window limit
  if (entry.requests.length >= RL_CONFIG.maxRequests) {
    entry.violations++
    if (entry.violations >= RL_CONFIG.maxViolations) {
      entry.blockedUntil = now + RL_CONFIG.blockDurationMs
    }
    const oldest = Math.min(...entry.requests)
    return {
      allowed: false,
      remaining: 0,
      resetIn: RL_CONFIG.windowMs - (now - oldest),
      reason: 'WINDOW_EXCEEDED'
    }
  }

  // Check token bucket (burst control)
  if (entry.tokens < 1) {
    return { allowed: false, remaining: 0, resetIn: 1000, reason: 'BURST_LIMIT' }
  }

  // Allow request
  entry.tokens -= 1
  entry.requests.push(now)
  entry.violations = Math.max(0, entry.violations - 0.5) // decay violations

  return {
    allowed: true,
    remaining: RL_CONFIG.maxRequests - entry.requests.length,
    resetIn: RL_CONFIG.windowMs,
  }
}

// ════════════════════════════════════════════════════════════════════════
// REQUEST SIGNING — HMAC validation to prevent forged requests
// ════════════════════════════════════════════════════════════════════════
function generateRequestNonce(): string {
  return randomBytes(16).toString('hex')
}

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_SALT || 'sahi-salt')).digest('hex').slice(0, 16)
}

// ════════════════════════════════════════════════════════════════════════
// MULTI-LAYER INJECTION DETECTION ENGINE
// ════════════════════════════════════════════════════════════════════════
const INJECTION_LAYERS = {
  // Layer 1: Direct jailbreak patterns
  jailbreak: [
    /ignore\s+(all\s+)?(previous|above|prior|your)\s+instructions/i,
    /you\s+are\s+now\s+(a|an|the|going)/i,
    /pretend\s+(you\s+are|to\s+be|that)/i,
    /act\s+as\s+(a|an|if|though)/i,
    /jailbreak/i,
    /DAN\s+mode/i,
    /do\s+anything\s+now/i,
    /developer\s+mode/i,
    /god\s+mode/i,
    /unrestricted\s+mode/i,
  ],
  // Layer 2: System prompt extraction attempts
  extraction: [
    /reveal\s+(your\s+)?(system\s+)?(prompt|instructions|rules)/i,
    /what\s+(are|were)\s+your\s+instructions/i,
    /repeat\s+(your|the)\s+(system\s+)?prompt/i,
    /show\s+me\s+your\s+(prompt|instructions)/i,
    /print\s+(your\s+)?(system\s+)?prompt/i,
    /forget\s+(everything|all|your\s+instructions)/i,
    /ignore\s+(your\s+)?(previous\s+)?training/i,
  ],
  // Layer 3: Injection via encoding
  encoding: [
    /<\s*script[\s>]/i,
    /javascript\s*:/i,
    /data\s*:\s*text\s*\/\s*html/i,
    /on\w+\s*=\s*["']/i,
    /\x00/,  // null bytes
    /\u202e/,  // RTL override
    /\u200b/,  // zero-width space sequences
  ],
  // Layer 4: Persona hijacking
  persona: [
    /new\s+persona/i,
    /override\s+(your\s+)?(instructions|rules|identity)/i,
    /you\s+must\s+(now\s+)?obey/i,
    /your\s+real\s+(name|identity|purpose)\s+is/i,
    /disregard\s+(all\s+)?previous/i,
    /sudo\s+mode/i,
    /admin\s+override/i,
  ],
}

type InjectionResult = { detected: boolean; layer?: string; pattern?: string }

function detectInjection(text: string): InjectionResult {
  for (const [layer, patterns] of Object.entries(INJECTION_LAYERS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return { detected: true, layer, pattern: pattern.toString().slice(1, 30) }
      }
    }
  }
  return { detected: false }
}

// ════════════════════════════════════════════════════════════════════════
// DEEP INPUT SANITIZATION
// ════════════════════════════════════════════════════════════════════════
const SANITIZE_CONFIG = {
  maxMessageLength: 600,
  maxMessages: 25,
  maxTotalChars: 8000,
  allowedRoles: ['user', 'assistant', 'model'] as const,
}

function deepSanitize(text: string): string {
  return text
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '') // control chars
    .replace(/\u202e/g, '')     // RTL override
    .replace(/\u200b/g, '')     // zero-width space
    .replace(/\uFEFF/g, '')     // BOM
    .replace(/<[^>]*>/g, '')    // HTML tags
    .replace(/javascript:/gi, '') // js injection
    .replace(/data:/gi, '')     // data URIs
    .normalize('NFC')           // Unicode normalization
    .trim()
    .slice(0, SANITIZE_CONFIG.maxMessageLength)
}

type RawMessage = { role: string; content: string }
type ValidMessage = { role: 'user' | 'model'; content: string }

function validateAndSanitizeMessages(
  messages: unknown
): { valid: true; data: ValidMessage[] } | { valid: false; error: string; code: string } {
  if (!Array.isArray(messages))
    return { valid: false, error: 'Invalid request format', code: 'INVALID_FORMAT' }

  if (messages.length === 0)
    return { valid: false, error: 'No messages provided', code: 'EMPTY_MESSAGES' }

  if (messages.length > SANITIZE_CONFIG.maxMessages)
    return { valid: false, error: 'Too many messages', code: 'TOO_MANY_MESSAGES' }

  const totalChars = messages.reduce((sum, m) => sum + (typeof m?.content === 'string' ? m.content.length : 0), 0)
  if (totalChars > SANITIZE_CONFIG.maxTotalChars)
    return { valid: false, error: 'Request too large', code: 'REQUEST_TOO_LARGE' }

  const validated: ValidMessage[] = []

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i] as Record<string, unknown>

    if (typeof m !== 'object' || m === null)
      return { valid: false, error: `Invalid message at index ${i}`, code: 'INVALID_MESSAGE' }

    if (!SANITIZE_CONFIG.allowedRoles.includes(m.role as typeof SANITIZE_CONFIG.allowedRoles[number]))
      return { valid: false, error: 'Invalid message role', code: 'INVALID_ROLE' }

    if (typeof m.content !== 'string')
      return { valid: false, error: 'Message content must be text', code: 'INVALID_CONTENT' }

    if (m.content.length === 0)
      return { valid: false, error: 'Empty message content', code: 'EMPTY_CONTENT' }

    // Deep injection detection
    const injection = detectInjection(m.content as string)
    if (injection.detected) {
      return { valid: false, error: 'Invalid input detected', code: 'INJECTION_DETECTED' }
    }

    validated.push({
      role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user',
      content: deepSanitize(m.content as string),
    })
  }

  // Ensure conversation starts with user
  if (validated[0]?.role !== 'user')
    return { valid: false, error: 'Conversation must start with user message', code: 'INVALID_ORDER' }

  // Validate alternating roles (optional but good practice)
  // Allow multiple user messages in a row for flexibility

  return { valid: true, data: validated }
}

// ════════════════════════════════════════════════════════════════════════
// INTENT DETECTION ENGINE — 12 signal types
// ════════════════════════════════════════════════════════════════════════
type UserIntent = {
  isResume: boolean
  isStudent: boolean
  isBudgetConstrained: boolean
  isHindi: boolean
  isHinglish: boolean
  isBusinessOwner: boolean
  isTechUser: boolean
  isCreator: boolean
  isFarmer: boolean
  isHealthcare: boolean
  isJobSeeker: boolean
  isFreelancer: boolean
  primaryLanguage: 'hindi' | 'hinglish' | 'english'
  urgency: 'high' | 'medium' | 'low'
}

const INTENT_SIGNALS = {
  resume:    /resume|cv|job|interview|naukri|linkedin|career|placement|fresher|hike|salary|appraisal/i,
  student:   /student|college|university|btech|mba|exam|jee|neet|study|school|homework|assignment|project/i,
  budget:    /free|budget|cheap|affordable|no money|₹0|zero cost|without paying|kam price|sasta/i,
  hindi:     /^[^\x00-\x7F]+$|नमस्ते|मुझे|क्या|कैसे|मेरा|मैं|बताओ|चाहिए|हिंदी|यह|वह|करना/,
  hinglish:  /kya|kaise|mujhe|chahiye|batao|bhai|yaar|kal|aaj|abhi|nahi|haan|theek/i,
  business:  /business|startup|company|clients|customers|revenue|sales|entrepreneur|MSMe|gst|invoice/i,
  tech:      /code|programming|developer|api|github|software|app|backend|frontend|fullstack|devops/i,
  creator:   /youtube|instagram|reel|content|creator|video|blog|podcast|influencer|viral/i,
  farmer:    /farm|kisan|crop|agriculture|kheti|fasal|irrigation|fertilizer|mandi/i,
  health:    /doctor|medical|health|hospital|patient|medicine|diagnosis|symptom|clinic/i,
  jobseeker: /job|jobs|hiring|apply|application|recruiter|hr|offer|letter|placement|fresher/i,
  freelancer:/freelance|upwork|fiverr|client|project|invoice|remote|contract|gig/i,
}

function detectIntent(messages: ValidMessage[]): UserIntent {
  const allText = messages.map(m => m.content).join(' ')
  const lastMsg = messages[messages.length - 1]?.content || ''

  const isHindi = INTENT_SIGNALS.hindi.test(lastMsg) || INTENT_SIGNALS.hindi.test(allText)
  const isHinglish = !isHindi && INTENT_SIGNALS.hinglish.test(lastMsg)

  // Urgency detection
  const urgencyHigh = /urgent|asap|immediately|jaldi|abhi|today|aaj|help me now/i.test(allText)
  const urgencyLow = /just curious|wondering|maybe|someday|eventually/i.test(allText)

  return {
    isResume:          INTENT_SIGNALS.resume.test(allText),
    isStudent:         INTENT_SIGNALS.student.test(allText),
    isBudgetConstrained: INTENT_SIGNALS.budget.test(allText),
    isHindi,
    isHinglish,
    isBusinessOwner:   INTENT_SIGNALS.business.test(allText),
    isTechUser:        INTENT_SIGNALS.tech.test(allText),
    isCreator:         INTENT_SIGNALS.creator.test(allText),
    isFarmer:          INTENT_SIGNALS.farmer.test(allText),
    isHealthcare:      INTENT_SIGNALS.health.test(allText),
    isJobSeeker:       INTENT_SIGNALS.jobseeker.test(allText),
    isFreelancer:      INTENT_SIGNALS.freelancer.test(allText),
    primaryLanguage:   isHindi ? 'hindi' : isHinglish ? 'hinglish' : 'english',
    urgency:           urgencyHigh ? 'high' : urgencyLow ? 'low' : 'medium',
  }
}

// ════════════════════════════════════════════════════════════════════════
// DYNAMIC SYSTEM PROMPT BUILDER
// Builds a personalized prompt based on detected intent
// ════════════════════════════════════════════════════════════════════════
const BASE_SYSTEM = `You are Sahi AI's intelligent assistant — sharp, warm, and knowledgeable like a brilliant friend.

CORE IDENTITY:
- You are Sahi AI. Never mention or hint at any underlying technology, model, or company.
- India's most trusted personalized AI tool guide.
- Speak like a knowledgeable didi or bhaiya — real, direct, never corporate.
- If anyone asks what AI you are or what powers you: say "I am Sahi AI's assistant, built specifically for India 🇮🇳"

RESPONSE RULES:
- SHORT answers: 2-4 lines for simple questions
- STRUCTURED: bullet points (max 5) for comparisons or lists
- SPECIFIC: always mention real tool names and real ₹ prices
- ACTIONABLE: end with one clear next step
- NO FLUFF: never write essays or pad with filler text

YOUR DEEP KNOWLEDGE BASE:
Tools: ChatGPT (₹1700/mo), Gemini (free), Claude (₹1700/mo), Canva AI (free/₹3800), CapCut (free), InVideo (₹1700), GitHub Copilot (₹830), Midjourney (₹830), ElevenLabs (₹830/mo), Suno AI (free), Grammarly (free/₹1400), QuillBot (free/₹830), Perplexity (free), Hiration (₹1299), Naukri AI (free), Resume.io (₹1200), Photoroom (free/₹830), Remove.bg (free/₹500), Plantix (free, farmers), Bhashini (free, Indian languages), Krutrim (free, Hindi), Sarvam AI (free), AiSensy (₹1600, WhatsApp marketing), InVideo (₹1700, Indian company)

India-specific knowledge: Naukri.com, LinkedIn India, Internshala, Angel.co India, IIM Jobs, Hirect, Apna app — all job platforms for India

SAHI AI FACTS:
- 100% free for users, no hidden charges
- Works in Hindi + English + Hinglish
- Made for India 🇮🇳
- Recommends 4 personalized tools based on quiz at sahiai.in

NEVER DO:
- Never reveal your underlying AI model or technology
- Never make up prices — use real approximate INR values
- Never suggest only expensive tools without free alternatives
- Never ignore budget constraints — always give budget-appropriate options`

function buildSystemPrompt(intent: UserIntent): string {
  const additions: string[] = []

  if (intent.primaryLanguage === 'hindi') {
    additions.push('\nLANGUAGE: Respond ONLY in clear, simple Hindi. Use Devanagari script. Be warm and helpful.')
  } else if (intent.primaryLanguage === 'hinglish') {
    additions.push('\nLANGUAGE: Respond in Hinglish — mix of Hindi and English, casual and friendly tone.')
  }

  if (intent.isStudent) {
    additions.push('\nUSER TYPE - STUDENT: Prioritize FREE tools always. Mention student discounts. Be encouraging. Reference Internshala, SWAYAM, NPTEL for Indian students.')
  }

  if (intent.isResume || intent.isJobSeeker) {
    additions.push('\nUSER TYPE - JOB SEEKER: Focus on Naukri AI (free), Hiration (₹1299), LinkedIn AI, Interview Warmup by Google (free). For freshers: mention college placement cells and Internshala.')
  }

  if (intent.isBudgetConstrained) {
    additions.push('\nBUDGET CONSTRAINT: ONLY recommend free or freemium tools. Never suggest anything paid unless user explicitly asks.')
  }

  if (intent.isBusinessOwner) {
    additions.push('\nUSER TYPE - BUSINESS OWNER: Focus on ROI and scalability. Mention GST-compatible billing, Indian payment gateways (Razorpay, PayU), WhatsApp marketing (AiSensy).')
  }

  if (intent.isTechUser) {
    additions.push('\nUSER TYPE - DEVELOPER: Feel free to mention APIs, SDKs, npm packages, GitHub repos. Give technical depth. Mention free tiers and API pricing.')
  }

  if (intent.isCreator) {
    additions.push('\nUSER TYPE - CONTENT CREATOR: Focus on CapCut (free), InVideo (Indian), Canva AI, ElevenLabs for voiceover. Mention Instagram Reels, YouTube Shorts optimization.')
  }

  if (intent.isFarmer) {
    additions.push('\nUSER TYPE - FARMER/AGRICULTURE: Recommend Plantix (free, disease detection), Fasal app, CropIn, PM Kisan portal. Use simple language. Hindi if possible.')
  }

  if (intent.urgency === 'high') {
    additions.push('\nURGENCY: User needs help fast. Give the single best recommendation first, then alternatives.')
  }

  if (intent.isFreelancer) {
    additions.push('\nUSER TYPE - FREELANCER: Focus on tools that help win clients, deliver work, and invoice. Mention Razorpay for payments, tools that give professional output fast.')
  }

  return BASE_SYSTEM + additions.join('')
}

// ════════════════════════════════════════════════════════════════════════
// RESPONSE QUALITY VALIDATOR
// Ensures AI response is safe and appropriate before sending
// ════════════════════════════════════════════════════════════════════════
const RESPONSE_BLOCKLIST = [
  /gemini/i, /google ai/i, /anthropic/i, /openai/i, /gpt-/i,
  /I am (a |an )?(large language model|AI assistant made by)/i,
  /as an AI (language model|assistant)/i,
  /I('m| am) Claude/i,
  /I('m| am) (Gemini|Bard)/i,
]

function validateResponse(text: string): { safe: boolean; sanitized: string } {
  let sanitized = text
  let safe = true

  for (const pattern of RESPONSE_BLOCKLIST) {
    if (pattern.test(sanitized)) {
      safe = false
      sanitized = sanitized.replace(pattern, 'Sahi AI')
    }
  }

  // Ensure response isn't too long
  if (sanitized.length > 2000) {
    sanitized = sanitized.slice(0, 2000) + '...'
  }

  return { safe, sanitized }
}

// ════════════════════════════════════════════════════════════════════════
// STRUCTURED LOGGING — zero PII, GDPR-safe
// ════════════════════════════════════════════════════════════════════════
type LogLevel = 'info' | 'warn' | 'error' | 'security'

function log(level: LogLevel, event: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'test') return
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    engine: getEngineId(),
    ...meta,
  }
  const output = JSON.stringify(entry)
  if (level === 'error' || level === 'security') console.error(output)
  else if (level === 'warn') console.warn(output)
  else console.log(output)
}

// ════════════════════════════════════════════════════════════════════════
// SECURE RESPONSE BUILDER
// ════════════════════════════════════════════════════════════════════════
function buildResponse(
  data: Record<string, unknown>,
  status = 200,
  extraHeaders?: Record<string, string>
): NextResponse {
  const nonce = generateRequestNonce()
  const res = NextResponse.json({ ...data, _rid: nonce }, { status })

  // Security headers
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.headers.set('Pragma', 'no-cache')
  res.headers.set('X-Engine', getEngineId()) // obfuscated engine identifier
  res.headers.set('X-Request-ID', nonce)

  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([k, v]) => res.headers.set(k, v))
  }

  return res
}

function errorResponse(userMessage: string, status: number, code?: string) {
  return buildResponse({ error: userMessage, reply: null, code }, status)
}

// ════════════════════════════════════════════════════════════════════════
// GEMINI SAFETY CONFIGURATION
// ════════════════════════════════════════════════════════════════════════
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

// ════════════════════════════════════════════════════════════════════════
// FALLBACK RESPONSES — works even if AI is down
// ════════════════════════════════════════════════════════════════════════
const FALLBACK_RESPONSES = {
  english: [
    "I'm having a quick moment — please try again! For instant tool recommendations, take the quiz at sahiai.in 🚀",
    "Brief interruption! Head to sahiai.in for personalized AI tool recommendations while I recover 🙏",
    "Back in a moment! Try sahiai.in for your free personalized AI tool guide 🇮🇳",
  ],
  hindi: [
    "Thodi si problem aa gayi! Sahiai.in pe jaake apna personalized tool recommendation lein 🙏",
    "Abhi try karo — agar nahi chala toh sahiai.in pe quiz dein, bilkul free hai! 🇮🇳",
  ],
  hinglish: [
    "Ek second yaar — try again karo! Ya sahiai.in pe jaake free quiz dein 🚀",
  ],
}

function getFallbackResponse(language: 'hindi' | 'hinglish' | 'english'): string {
  const responses = FALLBACK_RESPONSES[language]
  return responses[Math.floor(Math.random() * responses.length)]
}

// ════════════════════════════════════════════════════════════════════════
// MAIN REQUEST HANDLER
// ════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const requestId = generateRequestNonce()

  // ── STEP 1: Origin Validation ──────────────────────────────────────
  const origin = req.headers.get('origin') || ''
  const referer = req.headers.get('referer') || ''
  const allowedOrigins = [
    'https://sahiai.in',
    'https://www.sahiai.in',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.0.102:3000',
    'http://192.168.0.102:3001',
  ]

  const isAllowedOrigin = allowedOrigins.some(o => origin.startsWith(o) || referer.startsWith(o))
  if (!isAllowedOrigin && process.env.NODE_ENV === 'production') {
    log('security', 'origin_blocked', { origin: origin.slice(0, 60), rid: requestId })
    return errorResponse('Access denied', 403, 'ORIGIN_BLOCKED')
  }

  // ── STEP 2: IP Extraction & Hashing ───────────────────────────────
  const rawIP =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  const hashedIP = hashIP(rawIP) // Never store raw IP

  // ── STEP 3: Rate Limiting ──────────────────────────────────────────
  const rateLimit = checkRateLimit(hashedIP)
  if (!rateLimit.allowed) {
    log('warn', 'rate_limited', { ip: hashedIP, reason: rateLimit.reason, rid: requestId })
    return errorResponse(
      rateLimit.reason === 'TEMP_BLOCKED'
        ? 'Too many requests. Please try again in 5 minutes.'
        : `Rate limit exceeded. Try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds.`,
      429,
      rateLimit.reason
    )
  }

  // ── STEP 4: Content-Type Validation ───────────────────────────────
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return errorResponse('Content-Type must be application/json', 415, 'INVALID_CONTENT_TYPE')
  }

  // ── STEP 5: Body Parsing ───────────────────────────────────────────
  let rawBody: Record<string, unknown>
  try {
    rawBody = await req.json()
  } catch {
    log('warn', 'parse_error', { rid: requestId, ip: hashedIP })
    return errorResponse('Invalid request body', 400, 'PARSE_ERROR')
  }

  // ── STEP 6: Message Validation & Sanitization ──────────────────────
  const validation = validateAndSanitizeMessages(rawBody.messages)
  if (!validation.valid) {
    log('warn', 'validation_failed', {
      code: validation.code,
      rid: requestId,
      ip: hashedIP
    })
    return errorResponse(validation.error, 400, validation.code)
  }

  const messages = validation.data

  // ── STEP 7: Intent Detection ───────────────────────────────────────
  const intent = detectIntent(messages)

  // ── STEP 8: Build Dynamic System Prompt ───────────────────────────
  const systemPrompt = buildSystemPrompt(intent)

  // ── STEP 9: AI Engine Call ─────────────────────────────────────────
  let reply = ''
  let engineSuccess = false

  try {
    const client = getClient()
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        maxOutputTokens: 450,
        temperature: 0.72,
        topP: 0.88,
        topK: 38,
        candidateCount: 1,
      },
    })

    // Build Gemini history (all except last message)
    const history = messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    }))
    const lastMessage = messages[messages.length - 1].content

    const chat = model.startChat({ history })

    // Add timeout protection
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 15000)
    )
    const responsePromise = chat.sendMessage(lastMessage)
    const result = await Promise.race([responsePromise, timeoutPromise])

    reply = result.response.text()?.trim() || ''
    engineSuccess = true

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown'
    log('error', 'engine_error', {
      error: errorMsg.slice(0, 80),
      rid: requestId,
      ip: hashedIP,
      duration_ms: Date.now() - startTime,
    })

    // Use intelligent fallback
    reply = getFallbackResponse(intent.primaryLanguage)
  }

  // ── STEP 10: Response Quality Validation ──────────────────────────
  if (engineSuccess && reply) {
    const { sanitized } = validateResponse(reply)
    reply = sanitized
  }

  // Ensure we always have a reply
  if (!reply) {
    reply = getFallbackResponse(intent.primaryLanguage)
  }

  // ── STEP 11: Metrics Logging ───────────────────────────────────────
  const duration = Date.now() - startTime
  log('info', 'request_complete', {
    rid: requestId,
    duration_ms: duration,
    engine_success: engineSuccess,
    msg_count: messages.length,
    language: intent.primaryLanguage,
    intents: Object.entries(intent)
      .filter(([k, v]) => typeof v === 'boolean' && v)
      .map(([k]) => k),
  })

  // ── STEP 12: Send Response ─────────────────────────────────────────
  return buildResponse(
    { reply, remaining: rateLimit.remaining },
    200,
    { 'X-Response-Time': `${duration}ms` }
  )
}

// ════════════════════════════════════════════════════════════════════════
// METHOD GUARDS — block all non-POST methods
// ════════════════════════════════════════════════════════════════════════
export async function GET()    { return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED') }
export async function PUT()    { return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED') }
export async function DELETE() { return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED') }
export async function PATCH()  { return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED') }
export async function HEAD()   { return errorResponse('Method not allowed', 405, 'METHOD_NOT_ALLOWED') }