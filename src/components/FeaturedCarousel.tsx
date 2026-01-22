import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Event, getCategoryColor } from '@/data/events';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface FeaturedCarouselProps {
  events: Event[];
}

const FeaturedCarousel = ({ events }: FeaturedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="w-full flex-shrink-0">
              <div className="relative h-[400px] md:h-[500px]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold text-primary-foreground rounded-full mb-4 ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>

                  <h3 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
                    {event.title}
                  </h3>

                  <p className="text-primary-foreground/80 mb-4 max-w-2xl line-clamp-2 text-sm md:text-base">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-6 text-primary-foreground/80 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link href={`/event/${event.id}`}>
                    <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                      View Event
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 text-card-foreground hover:bg-card transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 text-card-foreground hover:bg-card transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
              ? 'bg-primary-foreground w-6'
              : 'bg-primary-foreground/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
