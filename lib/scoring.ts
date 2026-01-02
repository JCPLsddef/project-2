export type ScoringInput = {
  completed_bool: boolean;
  proof_url?: string;
  wall300_done: boolean;
  quality_1_5?: number;
  rotation_enum?: 'Jamais' | 'Parfois' | 'Souvent';
  precision_1_5?: number;
  decision_announced_bool: boolean;
  leadership_1_5?: number;
};

export function calculateScore(input: ScoringInput): number {
  let score = 0;

  // DISCIPLINE: 30 points
  if (input.completed_bool) score += 10;
  if (input.proof_url) score += 10;
  if (input.wall300_done) score += 10;

  // TECHNIQUE: 30 points
  if (input.quality_1_5) {
    const qualityScore = ((input.quality_1_5 - 1) / 4) * 20;
    score += qualityScore;
  }

  if (input.rotation_enum) {
    if (input.rotation_enum === 'Jamais') score += 10;
    else if (input.rotation_enum === 'Parfois') score += 5;
  }

  // PRECISION: 20 points
  if (input.precision_1_5) {
    const precisionScore = ((input.precision_1_5 - 1) / 4) * 20;
    score += precisionScore;
  }

  // BRAIN/DECISION: 10 points
  if (input.decision_announced_bool) score += 10;

  // LEADERSHIP: 10 points
  if (input.leadership_1_5) {
    const leadershipScore = ((input.leadership_1_5 - 1) / 4) * 10;
    score += leadershipScore;
  }

  return Math.round(score * 100) / 100;
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-green-50 border-green-200';
  if (score >= 70) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

export function needsCorrectiveSession(score: number): boolean {
  return score < 70;
}

export function isValidated(proof_url?: string): boolean {
  return !!proof_url;
}
