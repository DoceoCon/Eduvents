import { Check, X, Clock, Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Event } from "@/data/events";
import { format } from "date-fns";

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

interface EventRowProps {
  event: Event;
  onStatusChange?: (
    eventId: string,
    newStatus: "approved" | "rejected",
  ) => void;
  onFeaturedToggle: (eventId: string, featured: boolean) => void;
  onEdit?: (event: Event) => void;
  showActions?: boolean;
}

const EventRow = ({
  event,
  onStatusChange,
  onFeaturedToggle,
  onEdit,
  showActions = true,
}: EventRowProps) => (
  <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 bg-card rounded-lg shadow-sm hover:shadow-card transition-shadow">
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <img
        src={event.image}
        alt={event.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <h3 className="font-medium text-foreground break-all">
            {event.title}
          </h3>
          {event.isAdminCreated && (
            <span className="px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full whitespace-nowrap">
              Admin upload - Free Listing
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground break-all">
          {event.organiser}
        </p>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>
            Submitted: {format(new Date(event.submissionDate), "MMM d, yyyy")}
          </span>
          {event.lastUpdated && (
            <span className="text-primary">
              • Updated: {format(new Date(event.lastUpdated), "MMM d, yyyy")}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      {/* Status Badge */}
      <div>
        {event.status === "pending" && (
          <span className="flex items-center px-3 py-1 text-xs font-medium bg-warning/10 text-warning rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        )}
        {event.status === "approved" && (
          <span className="flex items-center px-3 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </span>
        )}
        {event.status === "rejected" && (
          <span className="flex items-center px-3 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </span>
        )}
      </div>

      {/* Featured Toggle - Only for approved events */}
      {event.status === "approved" && (
        <div className="flex items-center gap-2">
          <Switch
            checked={event.featured}
            onCheckedChange={(checked) => onFeaturedToggle(event.id, checked)}
            className="data-[state=checked]:bg-yellow-400"
          />
          <button
            onClick={() => onFeaturedToggle(event.id, !event.featured)}
            className="focus:outline-none transition-transform active:scale-90"
            title={event.featured ? "Remove from featured" : "Mark as featured"}
          >
            <Star
              className={`h-5 w-5 ${event.featured ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-foreground"}`}
            />
          </button>
          {event.featured && (
            <span className="text-xs text-yellow-600 font-medium hidden sm:inline">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Edit Button - Only for approved events */}
      {event.status === "approved" && onEdit && (
        <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      )}

      {/* Action Buttons - For pending events */}
      {event.status === "pending" && showActions && onStatusChange && (
        <div className="flex gap-2">
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
                  onClick={() => onStatusChange(event.id, "approved")}
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
                <AlertDialogTitle>Reject Event</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject "
                  {event.title.length > 60
                    ? event.title.substring(0, 60) + "..."
                    : event.title}
                  "? The event will not be published, and the organiser will be
                  notified. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onStatusChange(event.id, "rejected")}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Reject Event
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  </div>
);

export default EventRow;
