import { useState } from "react";
import { Hero } from "@/components/Hero";
import { StudentCard } from "@/components/StudentCard";
import { AttendanceStats } from "@/components/AttendanceStats";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";
import student5 from "@/assets/student-5.jpg";
import student6 from "@/assets/student-6.jpg";

interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  image: string;
  isPresent: boolean | null;
}

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Amit Kumar Singh",
    grade: "4th Grade",
    rollNumber: "23tec2cs201",
    image: student1,
    isPresent: null,
  },
  {
    id: 2,
    name: "Ayush Raj",
    grade: "5th Grade",
    rollNumber: "23tec2cs207",
    image: student2,
    isPresent: null,
  },
  {
    id: 3,
    name: "Chandan kumar",
    grade: "3rd Grade",
    rollNumber: "23tec2cs212",
    image: student3,
    isPresent: null,
  },
  {
    id: 4,
    name: "Rajeev Ranjan",
    grade: "5th Grade",
    rollNumber: "23tec2cs166",
    image: student4,
    isPresent: null,
  },
  {
    id: 5,
    name: "Beauty Singh Rajput",
    grade: "4th Grade",
    rollNumber: "405",
    image: student5,
    isPresent: null,
  },
  {
    id: 6,
    name: "Shivam Singh Rajput",
    grade: "4th Grade",
    rollNumber: "406",
    image: student6,
    isPresent: null,
  },
];

const Index = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleMarkAttendance = (id: number, status: boolean) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, isPresent: status } : student
      )
    );
    toast.success(
      status ? "Marked as Present ✓" : "Marked as Absent",
      {
        description: students.find(s => s.id === id)?.name,
      }
    );
  };

  const handleSaveAttendance = () => {
    const unmarked = students.filter(s => s.isPresent === null).length;
    if (unmarked > 0) {
      toast.warning(`${unmarked} students not marked yet`);
      return;
    }
    toast.success("Attendance saved successfully!", {
      description: `${presentCount} present, ${absentCount} absent`,
    });
  };

  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.isPresent === true).length;
  const absentCount = students.filter((s) => s.isPresent === false).length;
  const unmarkedCount = students.filter((s) => s.isPresent === null).length;

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      <main className="container mx-auto px-4 py-8">
        {/* Date and Save Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{currentDate}</span>
          </div>
          <Button 
            size="lg" 
            onClick={handleSaveAttendance}
            className="bg-success hover:bg-success/90"
          >
            Save Attendance
          </Button>
        </div>

        {/* Statistics */}
        <AttendanceStats
          totalStudents={totalStudents}
          presentCount={presentCount}
          absentCount={absentCount}
          unmarkedCount={unmarkedCount}
        />

        {/* Student List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Student List</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                {...student}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
