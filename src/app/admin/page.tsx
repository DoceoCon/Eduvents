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
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [eventsList, setEventsList] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/events');
            const data = await response.json();
            if (data.success) {
                setEventsList(data.events);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                fetchEvents();
            }
        }
    }, [isAuthenticated, isAuthLoading, router]);

    if (isAuthLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const pendingEvents = eventsList.filter(e => e.status === 'pending');
    const approvedEvents = eventsList.filter(e => e.status === 'approved');
    const rejectedEvents = eventsList.filter(e => e.status === 'rejected');

    const handleStatusChange = async (eventId: string, newStatus: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setEventsList(prev =>
                    prev.map(event =>
                        event.id === eventId ? { ...event, status: newStatus } : event
                    )
                );
                const statusText = newStatus === 'approved' ? 'approved' : 'rejected';
                toast.success(`Event ${statusText} successfully! Email notification sent to organiser.`);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleFeaturedToggle = async (eventId: string, featured: boolean) => {
        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured })
            });
            const data = await response.json();
            if (data.success) {
                setEventsList(prev =>
                    prev.map(event =>
                        event.id === eventId ? { ...event, featured } : event
                    )
                );
                toast.success(featured ? 'Event marked as featured' : 'Event removed from featured');
            }
        } catch (error) {
            toast.error('Failed to toggle featured status');
        }
    };

    const handleEventSave = (updatedEvent: Event) => {
        setEventsList(prev =>
            prev.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
        fetchEvents(); // Refresh to be safe
    };

    const handleAddEvent = () => {
        // Now handled by ListEventContent via API
        setIsAddingEvent(false);
        fetchEvents();
    };

    const handleViewDetails = (event: Event) => {
        router.push(`/event/${event.slug || event.id}`);
    };

    const handleDelete = async (eventId: string) => {
        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setEventsList(prev => prev.filter(event => event.id !== eventId));
                toast.success('Event deleted successfully!');
            } else {
                toast.error(data.message || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
        }
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
                                    onCancel={() => setIsAddingEvent(false)}
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

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading events...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Pending Events - Enhanced View */}
                            <TabsContent key="pending" value="pending" className="space-y-4">
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
                                                onViewDetails={(event) => handleViewDetails(event)}
                                                onFeaturedToggle={handleFeaturedToggle}
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
                            <TabsContent key="approved" value="approved" className="space-y-4">
                                {approvedEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {approvedEvents.map(event => (
                                            <EventRow
                                                key={event.id}
                                                event={event}
                                                onFeaturedToggle={handleFeaturedToggle}
                                                onEdit={setEditingEvent}
                                                onDelete={handleDelete}
                                                showActions={false}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-card rounded-lg">
                                        <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No approved events</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Rejected Events */}
                            <TabsContent key="rejected" value="rejected" className="space-y-4">
                                {rejectedEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {rejectedEvents.map(event => (
                                            <EventRow
                                                key={event.id}
                                                event={event}
                                                onFeaturedToggle={handleFeaturedToggle}
                                                onDelete={handleDelete}
                                                showActions={false}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-card rounded-lg">
                                        <X className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No rejected events</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent key="all" value="all" className="space-y-4">
                                {eventsList.length > 0 ? (
                                    <div className="space-y-4">
                                        {eventsList.map(event => (
                                            <EventRow
                                                key={event.id}
                                                event={event}
                                                onStatusChange={event.status === 'pending' ? handleStatusChange : undefined}
                                                onFeaturedToggle={handleFeaturedToggle}
                                                onEdit={event.status === 'approved' ? setEditingEvent : undefined}
                                                onDelete={handleDelete}
                                                showActions={event.status === 'pending'}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-card rounded-lg">
                                        <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No events</p>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    )}
                </Tabs>
            </div>

            {/* Edit Dialog */}
            <EventEditDialog
                event={editingEvent}
                isOpen={!!editingEvent}
                onClose={() => { setEditingEvent(null); fetchEvents(); }}
                onSave={handleEventSave}
            />
        </Layout>
    );
};

export default AdminDashboard;
