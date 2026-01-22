import { Check, X, Eye, Calendar, MapPin, PoundSterling } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, getCategoryColor } from '@/data/events';
import { format } from 'date-fns';

interface PendingEventCardProps {
  event: Event;
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  onViewDetails: (event: Event) => void;
}

const PendingEventCard = ({ event, onApprove, onReject, onViewDetails }: PendingEventCardProps) => {
  const formattedDate = format(new Date(event.date), 'MMM d, yyyy');
  const submittedDate = format(new Date(event.submissionDate), 'MMM d, yyyy');

  return (
    <div className="bg-card rounded-lg shadow-card overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail */}
        <div className="lg:w-48 h-32 lg:h-auto flex-shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-0.5 text-xs font-semibold text-primary-foreground rounded-full ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
              {event.format}
            </span>
            {event.phases.map(phase => (
              <span key={phase} className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                {phase}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-1">{event.title}</h3>
          
          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">{event.organiser}</span>
            <span className="mx-2">•</span>
            <a href={`mailto:${event.organiserEmail}`} className="text-primary hover:underline">
              {event.organiserEmail}
            </a>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              {formattedDate}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              {event.location}
            </div>
            <div className="flex items-center">
              <PoundSterling className="h-4 w-4 mr-1 text-primary" />
              {event.isFree ? (
                <span className="text-success font-medium">Free</span>
              ) : (
                <span>£{event.price}</span>
              )}
            </div>
            <div className="text-muted-foreground/70">
              Submitted: {submittedDate}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => onApprove(event.id)}
              className="bg-success hover:bg-success/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(event.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(event)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingEventCard;
