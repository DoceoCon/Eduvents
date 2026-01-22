"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Clock, Plus, Star, List } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { events as initialEvents, Event, SubjectArea, EventPhase } from '@/data/events';
import { toast } from 'sonner';
import ListEventContent from '@/components/ListEventContent';
import EventRow from '@/components/admin/EventRow';
import PendingEventCard from '@/components/admin/PendingEventCard';
import EventEditDialog from '@/components/admin/EventEditDialog';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const pendingEvents = eventsList.filter(e => e.status === 'pending');
    const approvedEvents = eventsList.filter(e => e.status === 'approved');
    const rejectedEvents = eventsList.filter(e => e.status === 'rejected');

    const handleStatusChange = (eventId: string, newStatus: 'approved' | 'rejected') => {
        setEventsList(prev =>
            prev.map(event =>
                event.id === eventId ? { ...event, status: newStatus } : event
            )
        );
        const statusText = newStatus === 'approved' ? 'approved' : 'rejected';
        toast.success(`Event ${statusText} successfully! Email notification sent to organiser.`);
    };

    const handleFeaturedToggle = (eventId: string, featured: boolean) => {
        setEventsList(prev =>
            prev.map(event =>
                event.id === eventId ? { ...event, featured } : event
            )
        );
        toast.success(featured ? 'Event marked as featured' : 'Event removed from featured');
    };

    const handleEventSave = (updatedEvent: Event) => {
        setEventsList(prev =>
            prev.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
    };

    const handleAddEvent = () => {
        const newEvent: Event = {
            id: Date.now().toString(),
            title: 'New Admin Event',
            description: 'Event description',
            fullDescription: 'Full event description',
            category: 'Conference',
            format: 'In-Person',
            subjectAreas: ['Leadership'] as SubjectArea[],
            phases: ['Secondary'] as EventPhase[],
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '17:00',
            location: 'TBD',
            organiser: 'EDUVENTS Admin',
            organiserEmail: 'admin@eduvents.co.uk',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
            bookingUrl: '#',
            featured: false,
            status: 'approved',
            submissionDate: new Date().toISOString().split('T')[0],
            isFree: true,
            isAdminCreated: true
        };

        setEventsList(prev => [newEvent, ...prev]);
        setIsAddingEvent(false);
        toast.success('Free event added successfully!');
    };

    return (
        <Layout>
            <div className="container-tight py-8 md:py-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage event submissions</p>
                    </div>

                    <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
                        <DialogTrigger asChild>
                            <Button size="lg">
                                <Plus className="h-5 w-5 mr-2" />
                                Create Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create Free Event Listing</DialogTitle>
                            </DialogHeader>

                            <div className="mt-4">
                                <ListEventContent
                                    isAdminMode={true}
                                    onSuccess={() => {
                                        handleAddEvent();
                                    }}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList className="bg-muted flex-wrap h-auto gap-1">
                        <TabsTrigger value="pending" className="data-[state=active]:bg-card">
                            <Clock className="h-4 w-4 mr-1" />
                            Pending ({pendingEvents.length})
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="data-[state=active]:bg-card">
                            <Check className="h-4 w-4 mr-1" />
                            Approved ({approvedEvents.length})
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="data-[state=active]:bg-card">
                            <X className="h-4 w-4 mr-1" />
                            Rejected ({rejectedEvents.length})
                        </TabsTrigger>
                        <TabsTrigger value="all" className="data-[state=active]:bg-card">
                            <List className="h-4 w-4 mr-1" />
                            All Events ({eventsList.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Pending Events - Enhanced View */}
                    <TabsContent value="pending" className="space-y-4">
                        {pendingEvents.length > 0 ? (
                            <div className="space-y-4">
                                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                                    <p className="text-sm text-warning font-medium">
                                        {pendingEvents.length} event{pendingEvents.length !== 1 ? 's' : ''} awaiting review
                                    </p>
                                </div>
                                {pendingEvents.map(event => (
                                    <PendingEventCard
                                        key={event.id}
                                        event={event}
                                        onApprove={(id) => handleStatusChange(id, 'approved')}
                                        onReject={(id) => handleStatusChange(id, 'rejected')}
                                        onViewDetails={setViewingEvent}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card rounded-lg">
                                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No pending events</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Approved Events - With Edit */}
                    <TabsContent value="approved" className="space-y-4">
                        {approvedEvents.length > 0 ? (
                            approvedEvents.map(event => (
                                <EventRow
                                    key={event.id}
                                    event={event}
                                    onFeaturedToggle={handleFeaturedToggle}
                                    onEdit={setEditingEvent}
                                    showActions={false}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-card rounded-lg">
                                <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No approved events</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Rejected Events */}
                    <TabsContent value="rejected" className="space-y-4">
                        {rejectedEvents.length > 0 ? (
                            rejectedEvents.map(event => (
                                <EventRow
                                    key={event.id}
                                    event={event}
                                    onFeaturedToggle={handleFeaturedToggle}
                                    showActions={false}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-card rounded-lg">
                                <X className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No rejected events</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* All Events */}
                    <TabsContent value="all" className="space-y-4">
                        {eventsList.length > 0 ? (
                            eventsList.map(event => (
                                <EventRow
                                    key={event.id}
                                    event={event}
                                    onStatusChange={event.status === 'pending' ? handleStatusChange : undefined}
                                    onFeaturedToggle={handleFeaturedToggle}
                                    onEdit={event.status === 'approved' ? setEditingEvent : undefined}
                                    showActions={event.status === 'pending'}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-card rounded-lg">
                                <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No events</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Edit Dialog */}
            <EventEditDialog
                event={editingEvent}
                isOpen={!!editingEvent}
                onClose={() => setEditingEvent(null)}
                onSave={handleEventSave}
            />

            {/* View Details Dialog */}
            <Dialog open={!!viewingEvent} onOpenChange={() => setViewingEvent(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Event Details</DialogTitle>
                    </DialogHeader>
                    {viewingEvent && (
                        <div className="space-y-4 mt-4">
                            <img
                                src={viewingEvent.image}
                                alt={viewingEvent.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <h2 className="text-xl font-bold">{viewingEvent.title}</h2>
                            <p className="text-muted-foreground">{viewingEvent.fullDescription}</p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Category:</span> {viewingEvent.category}
                                </div>
                                <div>
                                    <span className="font-medium">Format:</span> {viewingEvent.format}
                                </div>
                                <div>
                                    <span className="font-medium">Date:</span> {viewingEvent.date}
                                </div>
                                <div>
                                    <span className="font-medium">Time:</span> {viewingEvent.startTime} - {viewingEvent.endTime}
                                </div>
                                <div>
                                    <span className="font-medium">Location:</span> {viewingEvent.location}
                                </div>
                                <div>
                                    <span className="font-medium">Cost:</span> {viewingEvent.isFree ? 'Free' : `£${viewingEvent.price}`}
                                </div>
                            </div>

                            {viewingEvent.phases.length > 0 && (
                                <div>
                                    <span className="font-medium text-sm">Educational Phases:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {viewingEvent.phases.map(phase => (
                                            <span key={phase} className="px-2 py-0.5 text-xs bg-muted rounded-full">
                                                {phase}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    onClick={() => {
                                        handleStatusChange(viewingEvent.id, 'approved');
                                        setViewingEvent(null);
                                    }}
                                    className="bg-success hover:bg-success/90"
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        handleStatusChange(viewingEvent.id, 'rejected');
                                        setViewingEvent(null);
                                    }}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default AdminDashboard;
