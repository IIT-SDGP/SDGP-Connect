// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className, style }) => {
  return (
    <Card 
      className={cn(
        "neo-card p-6 rounded-xl transition-all duration-300 hover:translate-y-[-5px]",
        "border border-white/5 relative overflow-hidden group",
        "backdrop-blur-md bg-gradient-to-br from-black/80 via-card/30 to-black/90",
        className
      )}
      style={style}
    >
      {/* Ambient glow effect that moves on hover */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-primary-accent/10 blur-xl 
                    transition-all duration-500 group-hover:bg-primary-accent/15 group-hover:w-28 group-hover:h-28"></div>
      
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div className="text-muted-foreground text-sm font-medium tracking-wide">
        <div className="p-2.5 rounded-lg bg-primary-accent/10 text-primary-accent shadow-lg shadow-primary-accent/10
                       transition-all duration-300 group-hover:shadow-primary-accent/30 group-hover:bg-primary-accent/15">
          {icon}
        </div>{title}</div>
        <div className="text-4xl font-bold text-align-center justify-center mb-1.5 bg-gradient-to-r from-white via-white/95 to-white/80 
                         bg-clip-text text-transparent transition-all duration-300
                         group-hover:from-white group-hover:to-white/90 group-hover:glow-text">
            {value}
          </div>
        
      </div>
      
      {/* Card highlight effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Subtle border effect */}
      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
    </Card>
  );
};

export default StatCard;
