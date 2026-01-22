import Link from 'next/link';
import { Calendar, MapPin, Clock, PoundSterling } from 'lucide-react';
import { Event, getCategoryColor } from '@/data/events';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');

  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-primary-foreground rounded-full ${getCategoryColor(event.category)}`}>
          {event.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <PoundSterling className="h-4 w-4 mr-2 text-primary" />
            {event.isFree ? (
              <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded-full">
                Free
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                £{event.price}
              </span>
            )}
          </div>
        </div>

        {/* Phase Tags */}
        {event.phases && event.phases.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.phases.slice(0, 2).map((phase) => (
              <span key={phase} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                {phase}
              </span>
            ))}
            {event.phases.length > 2 && (
              <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                +{event.phases.length - 2}
              </span>
            )}
          </div>
        )}

        <Link href={`/event/${event.id}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
