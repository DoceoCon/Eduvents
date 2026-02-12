import {
  Check,
  X,
  Eye,
  Calendar,
  MapPin,
  PoundSterling,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Event, getCategoryColor } from "@/data/events";
import { safeFormatDate } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PendingEventCardProps {
  event: Event;
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  onViewDetails: (event: Event) => void;
  onFeaturedToggle: (eventId: string, featured: boolean) => void;
  onDelete?: (eventId: string) => void;
}

const PendingEventCard = ({
  event,
  onApprove,
  onReject,
  onViewDetails,
  onFeaturedToggle,
  onDelete,
}: PendingEventCardProps) => {
  const startDate = safeFormatDate(event.startDate || event.date || "", "MMM d, yyyy");
  const endDate = safeFormatDate(event.endDate || event.date || "", "MMM d, yyyy");
  const formattedDate = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
  const submittedDate = safeFormatDate(event.submissionDate || "", "MMM d, yyyy");

  return (
    <div className="bg-card rounded-lg border border-transparent hover:border-primary/20 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail */}
        <div className="lg:w-48 h-32 lg:h-auto flex-shrink-0 relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-semibold text-primary-foreground rounded-full ${getCategoryColor(event.category)}`}
              >
                {event.category}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                {event.format}
              </span>
              {event.phases.map((phase) => (
                <span
                  key={phase}
                  className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                >
                  {phase}
                </span>
              ))}
            </div>
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-1 break-all">
            {event.title}
          </h3>

          <div className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground break-all">
              {event.organiser}
            </span>
            <span className="mx-2">•</span>
            <a
              href={`mailto:${event.organiserEmail}`}
              className="text-primary hover:underline break-all"
            >
              {event.organiserEmail}
            </a>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 break-all">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              {formattedDate}
            </div>
            <div className="flex items-center min-w-0">
              <MapPin className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <PoundSterling className="h-4 w-4 mr-1 text-primary" />
              {event.isFree ? (
                <span className="text-success font-medium">Free</span>
              ) : event.priceFrom && event.priceTo ? (
                <span>£{event.priceFrom} - £{event.priceTo}</span>
              ) : event.price ? (
                <span>£{event.price}</span>
              ) : (
                <span>Paid</span>
              )}
            </div>
            <div className="text-muted-foreground/70">
              Submitted: {submittedDate}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="bg-success hover:bg-success/90">
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve "
                    {event.title.length > 60
                      ? event.title.substring(0, 60) + "..."
                      : event.title}
                    "? This will make the event live and visible to all users.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onApprove(event.id)}
                    className="bg-success text-white hover:bg-success/90"
                  >
                    Approve Event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject "
                    {event.title.length > 60
                      ? event.title.substring(0, 60) + "..."
                      : event.title}
                    "? The event will not be published, and the organiser will
                    be notified. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onReject(event.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Reject Event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(event)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>

            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "
                      {event.title.length > 60
                        ? event.title.substring(0, 60) + "..."
                        : event.title}
                      "? This action cannot be undone and will permanently
                      remove the event from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(event.id)}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete Event
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingEventCard;
