const Anthropic = require('@anthropic-ai/sdk')

let anthropic = null

function getClient() {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }
    anthropic = new Anthropic({ apiKey })
  }
  return anthropic
}

/**
 * Call Claude API with optional skill context injection
 * @param {string} prompt - The user prompt to evaluate
 * @param {string|null} skillContext - Optional skill content to inject as context
 * @param {string} model - Model to use (default: claude-sonnet-4-20250514)
 * @returns {Promise<string>} - The model's response text
 */
async function callClaude(prompt, skillContext = null, model = 'claude-sonnet-4-20250514') {
  const client = getClient()

  let systemPrompt = 'You are an expert AI assistant helping evaluate skill effectiveness.'
  let userMessage = prompt

  // Inject skill context if provided
  if (skillContext) {
    systemPrompt = `You are an expert AI assistant with the following skill loaded:

${skillContext}

When responding, apply this skill to provide the best possible answer.`
    userMessage = prompt
  }

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMessage }
    ]
  })

  // Extract text from response
  const textContent = response.content.find(c => c.type === 'text')
  return textContent ? textContent.text : ''
}

/**
 * Run a parallel evaluation comparing skill vs no-skill responses
 * @param {string} prompt - The test prompt
 * @param {string} skillContext - The skill content to test
 * @param {string} model - Optional model override
 * @returns {Promise<{withSkill: string, withoutSkill: string}>}
 */
async function runParallelEval(prompt, skillContext, model = 'claude-sonnet-4-20250514') {
  // Run both calls in parallel for efficiency
  const [withSkill, withoutSkill] = await Promise.all([
    callClaude(prompt, skillContext, model),
    callClaude(prompt, null, model)
  ])

  return { withSkill, withoutSkill }
}

/**
 * Determine the winner between two outputs based on quality
 * This is a simple heuristic - could be enhanced with more sophisticated evaluation
 * @param {string} withSkill - Output with skill
 * @param {string} withoutSkill - Output without skill
 * @returns {string} - 'with_skill', 'without_skill', or 'tie'
 */
function determineWinner(withSkill, withoutSkill) {
  // Simple heuristic: compare response lengths and check for skill-specific keywords
  // In a production system, this would use more sophisticated evaluation

  const withLength = withSkill.length
  const withoutLength = withoutSkill.length

  // If responses are very similar, it's a tie
  const similarity = calculateSimilarity(withSkill, withoutSkill)
  if (similarity > 0.95) return 'tie'

  // Prefer the longer, more detailed response as a simple heuristic
  // This can be enhanced with actual quality metrics
  if (withLength > withoutLength * 1.2) return 'with_skill'
  if (withoutLength > withLength * 1.2) return 'without_skill'

  return 'tie'
}

/**
 * Calculate simple similarity score between two strings
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

module.exports = {
  callClaude,
  runParallelEval,
  determineWinner
}