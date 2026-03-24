import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
    );

    const today = new Date().toISOString().split('T')[0];
    
    console.log('Fetching students for date:', today);

    // Fetch students
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .order("roll_number");

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      throw studentsError;
    }

    // Fetch today's attendance records
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance_records")
      .select("student_id, status")
      .eq("date", today);

    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError);
      throw attendanceError;
    }

    // Create a map of student attendance
    const attendanceMap = new Map(
      attendanceData?.map(record => [
        record.student_id,
        record.status === 'present'
      ]) || []
    );

    // Combine student data with attendance status
    const studentsWithAttendance = studentsData.map((student) => ({
      id: student.id,
      name: student.name,
      grade: student.grade,
      rollNumber: student.roll_number,
      imageIdentifier: student.image_identifier,
      isPresent: attendanceMap.has(student.id) ? attendanceMap.get(student.id) : null,
    }));

    console.log('Successfully fetched', studentsWithAttendance.length, 'students');

    return new Response(
      JSON.stringify({ students: studentsWithAttendance }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-students function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
