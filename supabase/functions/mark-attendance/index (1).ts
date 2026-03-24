import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarkAttendanceRequest {
  studentId: string;
  status: 'present' | 'absent';
  date?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
    );

    const { studentId, status, date }: MarkAttendanceRequest = await req.json();

    // Validation
    if (!studentId || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: studentId and status' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (status !== 'present' && status !== 'absent') {
      return new Response(
        JSON.stringify({ error: 'Status must be either "present" or "absent"' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const attendanceDate = date || new Date().toISOString().split('T')[0];
    
    console.log('Marking attendance:', { studentId, status, date: attendanceDate });

    // Verify student exists
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, name")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      console.error('Student not found:', studentError);
      return new Response(
        JSON.stringify({ error: 'Student not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Upsert attendance record
    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(
        {
          student_id: studentId,
          date: attendanceDate,
          status: status,
        },
        {
          onConflict: 'student_id,date'
        }
      )
      .select();

    if (error) {
      console.error('Error upserting attendance:', error);
      throw error;
    }

    console.log('Attendance marked successfully for student:', student.name);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Marked ${student.name} as ${status}`,
        data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in mark-attendance function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
