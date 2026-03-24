import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  image: string;
  isPresent: boolean | null;
  onMarkAttendance: (id: number, status: boolean) => void;
}

export const StudentCard = ({
  id,
  name,
  grade,
  rollNumber,
  image,
  isPresent,
  onMarkAttendance,
}: StudentCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg",
      isPresent === true && "ring-2 ring-success",
      isPresent === false && "ring-2 ring-destructive"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Student Photo */}
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-4 border-muted"
            />
            {isPresent !== null && (
              <div className={cn(
                "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-card",
                isPresent ? "bg-success" : "bg-destructive"
              )}>
                {isPresent ? (
                  <Check className="h-4 w-4 text-success-foreground" />
                ) : (
                  <X className="h-4 w-4 text-destructive-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Student Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">Grade: {grade}</p>
            <p className="text-sm text-muted-foreground">Roll No: {rollNumber}</p>

            {/* Attendance Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant={isPresent === true ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  isPresent === true && "bg-success hover:bg-success/90"
                )}
                onClick={() => onMarkAttendance(id, true)}
              >
                <Check className="h-4 w-4 mr-1" />
                Present
              </Button>
              <Button
                size="sm"
                variant={isPresent === false ? "destructive" : "outline"}
                className="flex-1"
                onClick={() => onMarkAttendance(id, false)}
              >
                <X className="h-4 w-4 mr-1" />
                Absent
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
