-- Drop existing tables and types
DROP TABLE IF EXISTS user_answers CASCADE;
DROP TABLE IF EXISTS exam_sessions CASCADE;
DROP TABLE IF EXISTS exam_questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS test_type CASCADE;
DROP TYPE IF EXISTS sub_type CASCADE;

-- Create enum for test types
CREATE TYPE test_type AS ENUM ('TKD_BUMN', 'AKHLAK_BUMN', 'TWK_BUMN');

-- Create enum for sub types
CREATE TYPE sub_type AS ENUM (
  'verbal_logical',
  'number_sequence',
  'word_classification',
  'diagram_reasoning',
  'penilaian_diri',
  'wawasan_kebangsaan'
);

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'questioner', 'user');

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type test_type NOT NULL,
  sub_type sub_type NOT NULL,
  question TEXT NOT NULL,
  image_url TEXT,
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exams table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  passing_score INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exam_questions table (junction table between exams and questions)
CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(exam_id, question_id)
);

-- Create exam_sessions table
CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'expired'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_answers table
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create storage bucket for question images (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'question-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('question-images', 'question-images', true);
  END IF;
END $$;

-- Create policies for bucket
DROP POLICY IF EXISTS "Question images are publicly accessible" ON storage.objects;
CREATE POLICY "Question images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-images');

DROP POLICY IF EXISTS "Only questioners can upload images" ON storage.objects;
CREATE POLICY "Only questioners can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'question-images' AND
    auth.role() = 'questioner'
  );

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.role() = 'admin');

DROP POLICY IF EXISTS "Admins can insert users" ON users;
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (auth.role() = 'admin');

DROP POLICY IF EXISTS "Admins can update users" ON users;
CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (auth.role() = 'admin');

DROP POLICY IF EXISTS "Admins can delete users" ON users;
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (auth.role() = 'admin');

-- Create RLS policies for questions table
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are viewable by all authenticated users" ON questions;
CREATE POLICY "Questions are viewable by all authenticated users"
  ON questions FOR SELECT
  USING (auth.role() IN ('admin', 'questioner', 'user'));

DROP POLICY IF EXISTS "Only questioners and admins can insert questions" ON questions;
CREATE POLICY "Only questioners and admins can insert questions"
  ON questions FOR INSERT
  WITH CHECK (auth.role() IN ('admin', 'questioner'));

DROP POLICY IF EXISTS "Only questioners and admins can update questions" ON questions;
CREATE POLICY "Only questioners and admins can update questions"
  ON questions FOR UPDATE
  USING (auth.role() IN ('admin', 'questioner'));

DROP POLICY IF EXISTS "Only questioners and admins can delete questions" ON questions;
CREATE POLICY "Only questioners and admins can delete questions"
  ON questions FOR DELETE
  USING (auth.role() IN ('admin', 'questioner'));

-- Create RLS policies for exams table
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exams are viewable by all authenticated users" ON exams;
CREATE POLICY "Exams are viewable by all authenticated users"
  ON exams FOR SELECT
  USING (auth.role() IN ('admin', 'questioner', 'user'));

DROP POLICY IF EXISTS "Only admins can insert exams" ON exams;
CREATE POLICY "Only admins can insert exams"
  ON exams FOR INSERT
  WITH CHECK (auth.role() = 'admin');

DROP POLICY IF EXISTS "Only admins can update exams" ON exams;
CREATE POLICY "Only admins can update exams"
  ON exams FOR UPDATE
  USING (auth.role() = 'admin');

DROP POLICY IF EXISTS "Only admins can delete exams" ON exams;
CREATE POLICY "Only admins can delete exams"
  ON exams FOR DELETE
  USING (auth.role() = 'admin');

-- Create RLS policies for exam_questions table
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exam questions are viewable by all authenticated users" ON exam_questions;
CREATE POLICY "Exam questions are viewable by all authenticated users"
  ON exam_questions FOR SELECT
  USING (auth.role() IN ('admin', 'questioner', 'user'));

DROP POLICY IF EXISTS "Only admins can insert exam questions" ON exam_questions;
CREATE POLICY "Only admins can insert exam questions"
  ON exam_questions FOR INSERT
  WITH CHECK (auth.role() = 'admin');

DROP POLICY IF EXISTS "Only admins can update exam questions" ON exam_questions;
CREATE POLICY "Only admins can update exam questions"
  ON exam_questions FOR UPDATE
  USING (auth.role() = 'admin');

DROP POLICY IF EXISTS "Only admins can delete exam questions" ON exam_questions;
CREATE POLICY "Only admins can delete exam questions"
  ON exam_questions FOR DELETE
  USING (auth.role() = 'admin');

-- Create RLS policies for exam_sessions table
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own exam sessions" ON exam_sessions;
CREATE POLICY "Users can view their own exam sessions"
  ON exam_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins and questioners can view all exam sessions" ON exam_sessions;
CREATE POLICY "Admins and questioners can view all exam sessions"
  ON exam_sessions FOR SELECT
  USING (auth.role() IN ('admin', 'questioner'));

DROP POLICY IF EXISTS "Users can insert their own exam sessions" ON exam_sessions;
CREATE POLICY "Users can insert their own exam sessions"
  ON exam_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own exam sessions" ON exam_sessions;
CREATE POLICY "Users can update their own exam sessions"
  ON exam_sessions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete exam sessions" ON exam_sessions;
CREATE POLICY "Admins can delete exam sessions"
  ON exam_sessions FOR DELETE
  USING (auth.role() = 'admin');

-- Create RLS policies for user_answers table
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own answers" ON user_answers;
CREATE POLICY "Users can view their own answers"
  ON user_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exam_sessions
      WHERE exam_sessions.id = user_answers.session_id
      AND exam_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins and questioners can view all answers" ON user_answers;
CREATE POLICY "Admins and questioners can view all answers"
  ON user_answers FOR SELECT
  USING (auth.role() IN ('admin', 'questioner'));

DROP POLICY IF EXISTS "Users can insert their own answers" ON user_answers;
CREATE POLICY "Users can insert their own answers"
  ON user_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM exam_sessions
      WHERE exam_sessions.id = user_answers.session_id
      AND exam_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own answers" ON user_answers;
CREATE POLICY "Users can update their own answers"
  ON user_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM exam_sessions
      WHERE exam_sessions.id = user_answers.session_id
      AND exam_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can delete answers" ON user_answers;
CREATE POLICY "Admins can delete answers"
  ON user_answers FOR DELETE
  USING (auth.role() = 'admin');

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exams_updated_at ON exams;
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exam_questions_updated_at ON exam_questions;
CREATE TRIGGER update_exam_questions_updated_at
  BEFORE UPDATE ON exam_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exam_sessions_updated_at ON exam_sessions;
CREATE TRIGGER update_exam_sessions_updated_at
  BEFORE UPDATE ON exam_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_answers_updated_at ON user_answers;
CREATE TRIGGER update_user_answers_updated_at
  BEFORE UPDATE ON user_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert admin default
INSERT INTO users (email, full_name, role)
VALUES ('admin@example.com', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com'; 

INSERT INTO users (email, full_name, role)
VALUES ('questioner@example.com', 'Questioner', 'questioner')
ON CONFLICT (email) DO NOTHING;

INSERT INTO questions (type, sub_type, question, options, correct_answer, points)
VALUES 
('TKD_BUMN', 'verbal_logical', 'Soal contoh 1', 
 ARRAY['A. Pilihan 1', 'B. Pilihan 2', 'C. Pilihan 3', 'D. Pilihan 4'],
 'A. Pilihan 1', 5),
('TKD_BUMN', 'number_sequence', 'Soal contoh 2',
 ARRAY['A. 10', 'B. 20', 'C. 30', 'D. 40'],
 'B. 20', 5); 

INSERT INTO exams (title, description, duration, passing_score)
VALUES ('Ujian Contoh', 'Ujian untuk testing sistem', 60, 70); 

INSERT INTO exam_questions (exam_id, question_id, order_number)
SELECT 
  (SELECT id FROM exams WHERE title = 'Ujian Contoh'),
  id,
  1
FROM questions
WHERE type = 'TKD_BUMN'; 