import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Cross, X } from "lucide-react";
import React, { useState } from "react";

const MediaCarousel = ({ media, createpost, setMedia }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    setCurrentSlide((currentSlide + 1) % media.length);
  };

  const prev = () => {
    setCurrentSlide((currentSlide - 1 + media.length) % media.length);
  };

  // aspect-auto md:aspect-[4/3]
  return (
    <div className="relative overflow-hidden mb-[-15px]">
      <div className="relative aspect-auto md:aspect-[4/3] w-full overflow-hidden rounded-md">
        {media.map((item, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
          >
            {createpost && (
              <X
                key={index}
                className="absolute right-3  bg-gray-300 rounded-full p-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  const newMedia = media.filter((_, idx) => idx !== index);
                  setMedia(newMedia);
                
                  // Safely adjust currentSlide
                  if (currentSlide >= newMedia.length) {
                    setCurrentSlide(newMedia.length - 1); // Go to last valid slide
                }
              }}
              />
            )}

            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.alt || "Post image"}
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                src={item.src}
                controls
                className="h-full w-full object-cover"
                poster="https://via.placeholder.com/640x640.png?text=Video"
              >
                Your browser does not support video playback.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1.5 text-social-gray-dark hover:text-social-purple hover:bg-white shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1.5 text-social-gray-dark hover:text-social-purple hover:bg-white shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentSlide
                    ? "bg-social-purple w-4"
                    : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaCarousel;
