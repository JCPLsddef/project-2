/*
  # Fix Security and Performance Issues

  ## Performance Improvements
  
  ### 1. Add Missing Indexes on Foreign Keys
    - Add index on `coach_comments.coach_user_id`
    - Add index on `coach_comments.submission_id`
    - Add index on `quiz_attempts.quiz_id`
    - Add index on `quizzes.week_id`
    - Add index on `user_badges.badge_id`
  
  ### 2. Optimize RLS Policies
    - Replace `auth.uid()` with `(select auth.uid())` for better performance
    - This prevents re-evaluation of auth functions for each row
  
  ### 3. Clean Up Unused Indexes
    - Remove `idx_quiz_questions_quiz_id` (not being used)
    - Remove `idx_user_badges_user_id` (not being used)
  
  ### 4. Fix Multiple Permissive Policies
    - Consolidate submissions SELECT policies
*/

-- Step 1: Add missing indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_coach_comments_coach_user_id ON coach_comments(coach_user_id);
CREATE INDEX IF NOT EXISTS idx_coach_comments_submission_id ON coach_comments(submission_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_week_id ON quizzes(week_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

-- Step 2: Drop unused indexes
DROP INDEX IF EXISTS idx_quiz_questions_quiz_id;
DROP INDEX IF EXISTS idx_user_badges_user_id;

-- Step 3: Drop existing RLS policies that need optimization
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON submissions;
DROP POLICY IF EXISTS "Coaches can read player submissions" ON submissions;
DROP POLICY IF EXISTS "Users can read own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can read own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can insert own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can read comments on own submissions" ON coach_comments;
DROP POLICY IF EXISTS "Coaches can insert comments" ON coach_comments;

-- Step 4: Recreate optimized RLS policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Step 5: Recreate optimized RLS policies for submissions (consolidate SELECT policies)
CREATE POLICY "Users can read submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'coach'
    )
  );

CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Step 6: Recreate optimized RLS policies for quiz_attempts
CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Step 7: Recreate optimized RLS policies for user_badges
CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Step 8: Recreate optimized RLS policies for coach_comments
CREATE POLICY "Users can read comments on own submissions"
  ON coach_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submissions
      WHERE submissions.id = coach_comments.submission_id
      AND submissions.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Coaches can insert comments"
  ON coach_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    coach_user_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'coach'
    )
  );
