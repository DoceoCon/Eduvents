import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Event, getCategoryColor } from '@/data/events';
import { Button } from '@/components/ui/button';
import { safeFormatDate } from '@/lib/utils';

interface FeaturedCarouselProps {
  events: Event[];
}

const FeaturedCarousel = ({ events }: FeaturedCarouselProps) => {
  // Add cloned slides for infinite effect
  const slides = events.length > 1
    ? [events[events.length - 1], ...events, events[0]]
    : events;

  const [currentIndex, setCurrentIndex] = useState(events.length > 1 ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(false);

  const handleNext = useCallback(() => {
    if (isTransitioning || events.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning, events.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || events.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning, events.length]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (events.length <= 1) return;

    if (currentIndex === 0) {
      // Cloned last slide -> real last slide
      setCurrentIndex(events.length);
    } else if (currentIndex === events.length + 1) {
      // Cloned first slide -> real first slide
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(handleNext, 3000);
    return () => clearInterval(timer);
  }, [handleNext, events.length]);

  if (events.length === 0) {
    return (
      <div className="relative rounded-xl bg-muted/30 border-2 border-dashed border-muted-foreground/20">
        <div className="flex flex-col items-center justify-center h-[400px] md:h-[500px] p-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-tight">NO FEATURED EVENTS</h3>
          <p className="text-muted-foreground max-w-md">
            There are no featured events at the moment. Check back soon for exciting educational opportunities!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-xl">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((event, index) => (
          <div key={`${event.id}-${index}`} className="w-full flex-shrink-0">
            <div className="relative h-[400px] md:h-[500px]">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className={`inline-block px-3 py-1 text-xs font-semibold text-primary-foreground rounded-full mb-4 ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>

                <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 break-words">
                  {event.title}
                </h3>

                <p className="text-white/80 mb-4 max-w-2xl line-clamp-2 text-sm md:text-base break-words">
                  {event.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-white/80 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{safeFormatDate(event.date || event.startDate, 'MMMM d, yyyy')}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="truncate max-w-[200px]">{event.location}</span>
                    </div>
                  )}
                </div>

                <Link href={`/event/${event.id}`}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    View Event
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition-all z-20 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition-all z-20 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {events.map((_, index) => {
            const actualIndex = index + 1;
            // Map the dot to the correct slide even during wrap-around
            let displayActive = currentIndex === actualIndex;
            if (currentIndex === 0 && index === events.length - 1) displayActive = true;
            if (currentIndex === events.length + 1 && index === 0) displayActive = true;

            return (
              <button
                key={index}
                onClick={() => {
                  if (displayActive) return;
                  setIsTransitioning(true);
                  setCurrentIndex(actualIndex);
                }}
                className={`w-2 h-2 rounded-full transition-all ${displayActive
                  ? 'bg-white w-6'
                  : 'bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarousel;
