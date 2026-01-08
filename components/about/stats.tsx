// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
"use client";
import { useEffect, useRef, useState } from "react";
import { User, Users, Projector } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StatsSection = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 bg-background py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 text-foreground">
      <div className="container max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 lg:flex-row lg:items-start">
          
          {/* Title Section */}
          <div className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl space-y-4 lg:space-y-6 xl:space-y-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tighter leading-tight">
              Empowering Innovation with <span className="text-primary">SDGP</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-muted-foreground leading-relaxed">
              Driving sustainable development through innovative student projects and collaborative solutions.
            </p>
          </div>

          {/* Stats Card */}
          <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl border-primary/10 lg:-mt-4 xl:-mt-6 2xl:-mt-8 shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-10">
              <div className="grid gap-6 sm:gap-8 lg:gap-10 xl:gap-12 grid-cols-1 sm:grid-cols-3">
                <StatItem
                  finalValue={10000}
                  icon={<User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />}
                  platform="Students Enrolled"
                  suffix="+"
                />
                <StatItem
                  finalValue={30}
                  icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />}
                  platform="Module Team"
                  suffix="+"
                />
                <StatItem
                  finalValue={1000}
                  icon={<Projector className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />}
                  platform="Completed Projects"
                  suffix="+"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional spacing for ultra-wide screens */}
      <div className="hidden 2xl:block h-8" />
    </section>
  );
};

const StatItem = ({
  finalValue,
  icon,
  platform,
  suffix = "",
}: {
  finalValue: number;
  icon: React.ReactNode;
  platform: string;
  suffix?: string;
}) => {
  const [value, setValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Function to format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500; // Slightly longer animation for better effect
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    
    const incrementPerFrame = finalValue / totalFrames;
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const newValue = Math.min(Math.round(incrementPerFrame * frame), finalValue);
      setValue(newValue);
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [isVisible, finalValue]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 lg:gap-3 xl:gap-4 text-center group hover:scale-105 transition-transform duration-300">
      
      {/* Number Display */}
      <div className="flex items-center gap-1 text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold pb-2 lg:pb-3 text-primary">
        <span className="tabular-nums">{formatNumber(value)}{suffix}</span>
      </div>
      
      {/* Icon and Label */}
      <div className="flex flex-col items-center gap-1 lg:gap-2">
        <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {icon}
        </div>
        <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
          {platform}
        </span>
      </div>
    </div>
  );
};

export default StatsSection;