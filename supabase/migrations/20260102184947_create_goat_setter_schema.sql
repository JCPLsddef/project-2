/*
  # GOAT SETTER - Schema Principal
  
  ## Tables créées
  
  1. **profiles**
     - Profils utilisateurs (joueur et coach)
     - Colonnes: id, role, name, age, dominant_hand, mode_default, streak, total_score_avg, created_at
  
  2. **drills**
     - Bibliothèque d'exercices avec détails complets
     - Colonnes: id, category, name, goal, equipment, how_to, reps, focus, common_mistakes, level, mode_tags
  
  3. **weeks**
     - 12 semaines du programme avec thèmes et objectifs
     - Colonnes: id (1-12), theme, objectives_text, success_metrics_text, quiz_id, major_test_flag
  
  4. **missions**
     - Missions quotidiennes (7 jours × 12 semaines)
     - Colonnes: id, week_id, day_number, title, duration_min, blocks_json, notes
  
  5. **submissions**
     - Soumissions quotidiennes avec scoring automatique
     - Colonnes: completed, proof, metrics (quality, precision, footwork, etc.), score_0_100
  
  6. **quizzes**
     - Quiz hebdomadaires
     - Colonnes: id, week_id, title
  
  7. **quiz_questions**
     - Questions avec réponses et explications
     - Colonnes: id, quiz_id, type, question, options_json, correct_answer, explanation
  
  8. **quiz_attempts**
     - Tentatives de quiz par utilisateur
     - Colonnes: id, user_id, quiz_id, score_percent, answers_json, created_at
  
  9. **badges**
     - Badges disponibles
     - Colonnes: id, name, rule_text, icon
  
  10. **user_badges**
      - Badges obtenus par utilisateur
      - Colonnes: id, user_id, badge_id, created_at
  
  11. **coach_comments**
      - Commentaires du coach sur soumissions
      - Colonnes: id, submission_id, coach_user_id, comment_text, created_at
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Policies restrictives basées sur auth.uid()
  - Accès coach limité aux fonctions de lecture et commentaires
*/

-- Création des types ENUM
CREATE TYPE user_role AS ENUM ('player', 'coach');
CREATE TYPE training_mode AS ENUM ('Maison', 'Gym');
CREATE TYPE rotation_frequency AS ENUM ('Jamais', 'Parfois', 'Souvent');
CREATE TYPE quiz_question_type AS ENUM ('QCM', 'VF', 'SA');

-- Table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'player',
  name text NOT NULL,
  age integer,
  dominant_hand text,
  mode_default training_mode DEFAULT 'Maison',
  streak integer DEFAULT 0,
  total_score_avg numeric(5,2) DEFAULT 0,
  start_date date DEFAULT CURRENT_DATE,
  days_per_week integer DEFAULT 6,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Table drills
CREATE TABLE IF NOT EXISTS drills (
  id text PRIMARY KEY,
  category text NOT NULL,
  name text NOT NULL,
  goal text,
  equipment text,
  how_to text,
  reps text,
  focus text,
  common_mistakes text,
  level text,
  mode_tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read drills"
  ON drills FOR SELECT
  TO authenticated
  USING (true);

-- Table weeks
CREATE TABLE IF NOT EXISTS weeks (
  id integer PRIMARY KEY CHECK (id >= 1 AND id <= 12),
  theme text NOT NULL,
  objectives_text text,
  success_metrics_text text,
  quiz_id integer,
  major_test_flag boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read weeks"
  ON weeks FOR SELECT
  TO authenticated
  USING (true);

-- Table missions
CREATE TABLE IF NOT EXISTS missions (
  id serial PRIMARY KEY,
  week_id integer NOT NULL REFERENCES weeks(id),
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  title text NOT NULL,
  duration_min integer,
  blocks_json jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(week_id, day_number)
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read missions"
  ON missions FOR SELECT
  TO authenticated
  USING (true);

-- Table submissions
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_id integer NOT NULL REFERENCES weeks(id),
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  completed_bool boolean DEFAULT false,
  mode training_mode,
  proof_url text,
  wall300_done boolean DEFAULT false,
  quality_1_5 integer CHECK (quality_1_5 >= 1 AND quality_1_5 <= 5),
  rotation_enum rotation_frequency,
  max_clean_streak integer,
  precision_1_5 integer CHECK (precision_1_5 >= 1 AND precision_1_5 <= 5),
  footwork_1_5 integer CHECK (footwork_1_5 >= 1 AND footwork_1_5 <= 5),
  decision_announced_bool boolean DEFAULT false,
  leadership_1_5 integer CHECK (leadership_1_5 >= 1 AND leadership_1_5 <= 5),
  attitude_1_10 integer CHECK (attitude_1_10 >= 1 AND attitude_1_10 <= 10),
  rpe_1_10 integer CHECK (rpe_1_10 >= 1 AND rpe_1_10 <= 10),
  sleep_hours numeric(3,1),
  error_text text,
  correction_text text,
  score_0_100 numeric(5,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_id, day_number)
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can read player submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
  );

-- Table quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id serial PRIMARY KEY,
  week_id integer REFERENCES weeks(id),
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Table quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id serial PRIMARY KEY,
  quiz_id integer NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  type quiz_question_type NOT NULL,
  question text NOT NULL,
  options_json jsonb,
  correct_answer text NOT NULL,
  explanation text,
  order_num integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- Table quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id integer NOT NULL REFERENCES quizzes(id),
  score_percent numeric(5,2),
  answers_json jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Table badges
CREATE TABLE IF NOT EXISTS badges (
  id serial PRIMARY KEY,
  name text NOT NULL,
  rule_text text,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Table user_badges
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id integer NOT NULL REFERENCES badges(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Table coach_comments
CREATE TABLE IF NOT EXISTS coach_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  coach_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coach_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read comments on own submissions"
  ON coach_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions
      WHERE submissions.id = submission_id
      AND submissions.user_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can insert comments"
  ON coach_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'coach'
    )
    AND auth.uid() = coach_user_id
  );

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_week_day ON submissions(week_id, day_number);
CREATE INDEX IF NOT EXISTS idx_missions_week_id ON missions(week_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);