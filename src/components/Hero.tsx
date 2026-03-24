import { GraduationCap } from "lucide-react";
import schoolHero from "@/assets/school-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={schoolHero} 
          alt="Village School" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary-foreground/20 p-6 backdrop-blur-sm">
            <GraduationCap className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
          Village School Attendance
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Simple and efficient attendance management for rural education
        </p>
      </div>
    </section>
  );
};
