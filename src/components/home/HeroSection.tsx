import React from "react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Discover Uganda by Rail",
  subtitle = "Book your journey across Uganda's scenic landscapes with our easy-to-use railway ticketing platform.",
  backgroundImage = "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
}) => {
  return (
    <div className="relative w-full h-[500px] bg-slate-100 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          {title}
        </h1>

        <p className="text-lg md:text-xl mb-8 max-w-2xl">{subtitle}</p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Book Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20 hover:text-white"
          >
            View Schedules
          </Button>
        </div>
      </div>

      {/* Optional decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  );
};

export default HeroSection;
