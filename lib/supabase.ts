import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  role: 'player' | 'coach';
  name: string;
  age?: number;
  dominant_hand?: string;
  mode_default?: 'Maison' | 'Gym';
  streak: number;
  total_score_avg: number;
  start_date: string;
  days_per_week: number;
  created_at: string;
};

export type Drill = {
  id: string;
  category: string;
  name: string;
  goal?: string;
  equipment?: string;
  how_to?: string;
  reps?: string;
  focus?: string;
  common_mistakes?: string;
  level?: string;
  mode_tags?: string[];
};

export type Week = {
  id: number;
  theme: string;
  objectives_text?: string;
  success_metrics_text?: string;
  quiz_id?: number;
  major_test_flag: boolean;
};

export type Mission = {
  id: number;
  week_id: number;
  day_number: number;
  title: string;
  duration_min?: number;
  blocks_json?: any;
  notes?: string;
};

export type Submission = {
  id: string;
  user_id: string;
  week_id: number;
  day_number: number;
  completed_bool: boolean;
  mode?: 'Maison' | 'Gym';
  proof_url?: string;
  wall300_done: boolean;
  quality_1_5?: number;
  rotation_enum?: 'Jamais' | 'Parfois' | 'Souvent';
  max_clean_streak?: number;
  precision_1_5?: number;
  footwork_1_5?: number;
  decision_announced_bool: boolean;
  leadership_1_5?: number;
  attitude_1_10?: number;
  rpe_1_10?: number;
  sleep_hours?: number;
  error_text?: string;
  correction_text?: string;
  score_0_100?: number;
  created_at: string;
};

export type Quiz = {
  id: number;
  week_id?: number;
  title: string;
};

export type QuizQuestion = {
  id: number;
  quiz_id: number;
  type: 'QCM' | 'VF' | 'SA';
  question: string;
  options_json?: string[];
  correct_answer: string;
  explanation?: string;
  order_num?: number;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  quiz_id: number;
  score_percent: number;
  answers_json: any;
  created_at: string;
};

export type Badge = {
  id: number;
  name: string;
  rule_text?: string;
  icon?: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: number;
  created_at: string;
};
