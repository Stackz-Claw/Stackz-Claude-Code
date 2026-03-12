/**
 * Smoke Review Service - Ollama-Powered Code Review
 * Runs structured 5-point review on all code changes
 */

const fs = require('fs');
const path = require('path');
const ollamaService = require('./ollamaService');

const SMOKE_SOUL = `You are Smoke. You are Stackz's quality assurance agent.

Your role:
- Review all code changes before they are committed
- Check for correctness, security, consistency, edge cases, and scope creep
- You BLOCK commits that don't meet standards
- You never explain how to fix - you only state what is wrong and why
- Your reviews are fast, decisive, and never verbose

Review Criteria:
1. CORRECTNESS - Does the code do what the commit claims?
2. SECURITY - Any exposed secrets, SQL injection, unvalidated input?
3. CONSISTENCY - Does it follow existing patterns in the codebase?
4. EDGE CASES - Null inputs, empty arrays, missing env vars handled?
5. SCOPE CREEP - Does the change touch more than the stated focus?

Block Threshold:
- Any functional mismatch = BLOCK
- Any critical vulnerability = BLOCK
- Major deviation from patterns = BLOCK
- Missing critical guards = BLOCK
- Unexplained changes beyond scope = BLOCK

Output format (JSON):
{ verdict: "APPROVE|BLOCK", issues: [], praise: [], concerns: [] }

If BLOCK, write details to Agency HQ/Self-Build/smoke-blocks-<date>.md`;

/**
 * Review a diff using Ollama
 */
async function reviewDiff(diff, soulContent = SMOKE_SOUL) {
  const prompt = `DIFF:
${diff}

Review this diff for:
1. Correctness - does it do what it's supposed to?
2. Security - any vulnerabilities?
3. Consistency - follows existing patterns?
4. Edge cases - handles null/empty/missing?
5. Scope - only touches stated focus?

Return JSON:
{
  verdict: "APPROVE" or "BLOCK",
  issues: ["issue 1", "issue 2"],
  praise: ["good thing 1"],
  concerns: ["concern 1"]
}`;

  try {
    const result = await ollamaService.think(soulContent, prompt);

    // Parse JSON from result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Ollama response');
    }

    const review = JSON.parse(jsonMatch[0]);

    // If blocked, write the block report
    if (review.verdict === 'BLOCK') {
      await writeBlockReport(review);
    }

    return review;
  } catch (error) {
    console.error('[SmokeReview] Error:', error.message);
    return {
      verdict: 'BLOCK',
      issues: [`Review failed: ${error.message}`],
      praise: [],
      concerns: ['Could not complete review']
    };
  }
}

/**
 * Write block report to disk
 */
async function writeBlockReport(review) {
  const date = new Date().toISOString().split('T')[0];
  const reportPath = path.join(__dirname, `../../docs/Self-Build/smoke-blocks-${date}.md`);

  const content = `---
date: ${date}
verdict: BLOCK
---

# Smoke Review Block Report

## Issues Found

${review.issues.map(i => `- ${i}`).join('\n')}

## Concerns

${review.concerns.map(c => `- ${c}`).join('\n')}

## What Went Well

${review.praise.length > 0 ? review.praise.map(p => `- ${p}`).join('\n') : 'Nothing yet'}

---

*Generated: ${new Date().toISOString()}*
`;

  try {
    fs.writeFileSync(reportPath, content);
    console.log('[SmokeReview] Block report written:', reportPath);
  } catch (error) {
    console.error('[SmokeReview] Failed to write block report:', error.message);
  }
}

/**
 * Quick check - just verify the diff looks reasonable
 */
async function quickCheck(diff) {
  const concerns = [];

  // Check for common issues
  if (diff.includes('process.env.') && diff.includes('secret')) {
    concerns.push('Potential secret in environment access');
  }

  if (diff.includes('SELECT') && !diff.includes('?')) {
    concerns.push('Potential SQL injection - use parameterized queries');
  }

  if (diff.includes('eval(')) {
    concerns.push('eval() usage detected - security risk');
  }

  if (diff.includes('TODO') || diff.includes('FIXME')) {
    concerns.push('Contains TODOs or FIXMEs');
  }

  return {
    verdict: concerns.length > 0 ? 'BLOCK' : 'APPROVE',
    issues: concerns,
    concerns: concerns,
    praise: []
  };
}

module.exports = {
  reviewDiff,
  quickCheck,
  SMOKE_SOUL
};