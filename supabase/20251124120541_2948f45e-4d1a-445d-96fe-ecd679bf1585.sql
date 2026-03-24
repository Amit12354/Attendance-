-- Create students table
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  grade text NOT NULL,
  roll_number text NOT NULL UNIQUE,
  image_identifier text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - you should add authentication later)
CREATE POLICY "Allow read access to students"
ON public.students
FOR SELECT
USING (true);

CREATE POLICY "Allow insert access to students"
ON public.students
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update access to students"
ON public.students
FOR UPDATE
USING (true);

CREATE POLICY "Allow delete access to students"
ON public.students
FOR DELETE
USING (true);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present', 'absent')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to attendance_records"
ON public.attendance_records
FOR SELECT
USING (true);

CREATE POLICY "Allow insert access to attendance_records"
ON public.attendance_records
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update access to attendance_records"
ON public.attendance_records
FOR UPDATE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_attendance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_attendance_records_timestamp
BEFORE UPDATE ON public.attendance_records
FOR EACH ROW
EXECUTE FUNCTION public.update_attendance_timestamp();

-- Insert initial student data
INSERT INTO public.students (name, grade, roll_number, image_identifier) VALUES
  ('Rajesh Kumar', 'Grade 5', '001', 'student-1'),
  ('Priya Singh', 'Grade 4', '002', 'student-2'),
  ('Amit Patel', 'Grade 5', '003', 'student-3'),
  ('Sneha Reddy', 'Grade 3', '004', 'student-4'),
  ('Vikram Shah', 'Grade 4', '005', 'student-5'),
  ('Meera Gupta', 'Grade 5', '006', 'student-6');