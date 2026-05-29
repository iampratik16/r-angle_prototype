// =====================================================================
// Vertex AI Gemini responseSchema — forces the model to return the full
// structured call-analysis report as strict JSON. Field shape mirrors the
// dashboard renderer in src/pages/CallAnalysis.jsx.
// =====================================================================
const SENTIMENT = { type: 'string', enum: ['positive', 'neutral', 'negative'] }

export const analysisSchema = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'One-paragraph executive summary of the call.' },
    language: { type: 'string', description: 'Languages used, e.g. "English + Hindi".' },
    durationEstimate: { type: 'string', description: 'Approx call length, e.g. "1m 30s".' },

    // 1. TRANSCRIPTION (punctuation preserved, tagged per line)
    transcript: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          speaker: { type: 'string', description: 'Label, e.g. "Caller (Pratik)" or "Receiver".' },
          role: { type: 'string', enum: ['salesperson', 'customer', 'unknown'] },
          text: { type: 'string', description: 'Exact words with punctuation preserved.' },
          sentiment: SENTIMENT,
          emotion: { type: 'string', description: 'Dominant emotion in this line.' },
          pause: { type: 'string', description: 'Notable pause/hesitation near this line, if any.' },
        },
        required: ['speaker', 'text', 'sentiment'],
      },
    },

    // 2. TONE ANALYSIS
    toneAnalysis: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          speaker: { type: 'string' },
          tone: { type: 'string' },
          analysis: { type: 'string' },
        },
        required: ['speaker', 'tone', 'analysis'],
      },
    },
    toneShifts: {
      type: 'array',
      items: {
        type: 'object',
        properties: { moment: { type: 'string' }, description: { type: 'string' } },
      },
    },

    // 3. SENTIMENT ANALYSIS (journey + overall)
    sentiment: {
      type: 'object',
      properties: {
        caller: {
          type: 'object',
          properties: { start: { type: 'string' }, middle: { type: 'string' }, end: { type: 'string' } },
        },
        receiver: {
          type: 'object',
          properties: { start: { type: 'string' }, middle: { type: 'string' }, end: { type: 'string' } },
        },
        overall: {
          type: 'object',
          properties: { label: SENTIMENT, summary: { type: 'string' } },
          required: ['label'],
        },
      },
      required: ['overall'],
    },

    // 4. EMOTIONAL EXPRESSION
    emotionalExpression: {
      type: 'object',
      properties: {
        caller: {
          type: 'array',
          items: { type: 'object', properties: { emotion: { type: 'string' }, evidence: { type: 'string' } } },
        },
        receiver: {
          type: 'array',
          items: { type: 'object', properties: { emotion: { type: 'string' }, evidence: { type: 'string' } } },
        },
        turningPoint: { type: 'string' },
      },
    },

    // 5. INTENT DETECTION
    intent: {
      type: 'object',
      properties: {
        callerPrimary: { type: 'string' },
        callerSecondary: { type: 'string' },
        receiver: { type: 'string' },
      },
    },

    // 6. MOOD ASSESSMENT
    mood: {
      type: 'object',
      properties: {
        startCaller: { type: 'string' },
        startReceiver: { type: 'string' },
        endCaller: { type: 'string' },
        endReceiver: { type: 'string' },
        trajectory: { type: 'string' },
      },
    },

    // Pauses & stress (extra depth requested)
    pauses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          note: { type: 'string' },
          interpretation: { type: 'string' },
        },
      },
    },
    stressIndicators: {
      type: 'object',
      properties: { caller: { type: 'string' }, receiver: { type: 'string' } },
    },

    // 7. SCORES
    scores: {
      type: 'object',
      properties: {
        conversationQuality: { type: 'integer', description: '0-10' },
        conversationQualityReason: { type: 'string' },
        objectiveResolved: { type: 'boolean' },
        objectiveResolvedReason: { type: 'string' },
        salespersonPerformance: { type: 'integer', description: '0-10' },
        salespersonPerformanceReason: { type: 'string' },
        receiverProfessionalism: { type: 'integer', description: '0-10' },
        receiverProfessionalismReason: { type: 'string' },
      },
      required: ['conversationQuality'],
    },

    // 8. INSIGHTS & RECOMMENDATIONS + coaching
    insights: { type: 'array', items: { type: 'string' } },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, detail: { type: 'string' } },
        required: ['title'],
      },
    },
    trainingScript: {
      type: 'array',
      description: 'Concrete example lines the rep should say next time, to replicate the founder’s rapport-building style.',
      items: { type: 'string' },
    },
  },
  required: ['transcript', 'sentiment', 'scores'],
}
