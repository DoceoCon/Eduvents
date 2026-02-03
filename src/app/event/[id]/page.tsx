"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, User, Mail, Share2, Facebook, Twitter, Linkedin, Link2, PoundSterling, GraduationCap } from 'lucide-react';
import Layout from '@/components/Layout';
import CategoryBadge from '@/components/CategoryBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Event } from '@/data/events';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import EventEditDialog from '@/components/admin/EventEditDialog';

const EventDetail = () => {
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const id = params?.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shareUrl, setShareUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const fetchEvent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/events/${id}`);
            const data = await response.json();
            if (data.success) {
                setEvent(data.event);
            } else {
                // If not found in admin, try public
                const pubRes = await fetch(`/api/events/${id}`);
                const pubData = await pubRes.json();
                if (pubData.success) {
                    setEvent(pubData.event);
                }
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchEvent();
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setEvent(data.event);
                toast.success(`Event ${newStatus} successfully!`);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleApprove = () => {
        handleStatusChange('approved');
        setApproveDialogOpen(false);
    };

    const handleReject = () => {
        handleStatusChange('rejected');
        setRejectDialogOpen(false);
    };

    const handleFeaturedToggle = async (featured: boolean) => {
        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured })
            });
            const data = await response.json();
            if (data.success) {
                setEvent(data.event);
                toast.success(featured ? 'Event marked as featured' : 'Event removed from featured');
            }
        } catch (error) {
            toast.error('Failed to update featured status');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="container-tight py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading event details...</p>
                </div>
            </Layout>
        );
    }

    if (!event) {
        return (
            <Layout>
                <div className="container-tight py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
                    <p className="text-muted-foreground mb-8">The event you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/events">
                        <Button>Back to Events</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    const formattedDate = event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : '';
    const shareText = `Check out this event: ${event.title}`;

    const handleShare = (platform: string) => {
        let url = '';
        const currentShareUrl = shareUrl || window.location.href;
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentShareUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl)}`;
                break;
            case 'copy':
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(currentShareUrl);
                    toast.success('Link copied to clipboard!');
                } else {
                    // Fallback for non-secure contexts (HTTP)
                    try {
                        const textArea = document.createElement("textarea");
                        textArea.value = currentShareUrl;

                        // Ensure textarea is not visible
                        textArea.style.position = "fixed";
                        textArea.style.left = "-9999px";
                        textArea.style.top = "0";
                        document.body.appendChild(textArea);

                        textArea.focus();
                        textArea.select();

                        const success = document.execCommand('copy');
                        document.body.removeChild(textArea);

                        if (success) {
                            toast.success('Link copied to clipboard!');
                        } else {
                            toast.error('Failed to copy link');
                        }
                    } catch (err) {
                        console.error('Fallback copy failed:', err);
                        toast.error('Failed to copy link');
                    }
                }
                return;
        }
        window.open(url, '_blank', 'width=600,height=400');
    };

    return (
        <Layout>
            {/* Back Button */}
            <div className="container-tight py-4">
                <Link href={isAuthenticated ? "/admin" : "/events"} className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to {isAuthenticated ? "Dashboard" : "Events"}
                </Link>
            </div>

            {/* Hero Image */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            </div>

            <div className="container-tight py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <CategoryBadge category={event.category} size="lg" />
                            <span className="px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
                                {event.format}
                            </span>
                            {event.subjectAreas.map((subject) => (
                                <span key={subject} className="px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground rounded-full">
                                    {subject}
                                </span>
                            ))}
                        </div>

                        {/* Phase Tags */}
                        {event.phases && event.phases.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {event.phases.map((phase) => (
                                    <span key={phase} className="px-3 py-1 text-sm font-medium bg-muted text-muted-foreground rounded-full flex items-center">
                                        <GraduationCap className="h-3.5 w-3.5 mr-1" />
                                        {phase}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                {event.title}
                            </h1>
                            {isAuthenticated && (
                                <Button onClick={() => setIsEditing(true)} variant="outline">
                                    Edit Event
                                </Button>
                            )}
                        </div>

                        <div className="bg-card rounded-lg p-6 shadow-card mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center text-foreground">
                                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        <p className="font-medium">{formattedDate}</p>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-foreground">
                                    <Clock className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        <p className="font-medium">{event.startTime} - {event.endTime}</p>
                                        <p className="text-sm text-muted-foreground">Time</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-foreground">
                                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        <p className="font-medium">{event.location}</p>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-foreground">
                                    <PoundSterling className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        {event.isFree ? (
                                            <p className="font-medium">
                                                <span className="px-3 py-1 text-sm bg-success/10 text-success rounded-full">
                                                    Free
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="font-medium">
                                                <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                                                    £{event.price} per person
                                                </span>
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground mt-1">Cost</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                            {event.description?.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg p-6 shadow-card sticky top-24 space-y-6">
                            {/* Admin Controls or Book Now Button */}
                            {isAuthenticated ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Update Status</label>
                                        {event.status === 'approved' ? (
                                            <div className="w-full p-4 bg-success/10 border-2 border-success rounded-lg flex items-center justify-center">
                                                <span className="text-success font-semibold text-lg">
                                                    ✓ Approved
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setApproveDialogOpen(true)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant={event.status === 'rejected' ? 'destructive' : 'outline'}
                                                    onClick={() => setRejectDialogOpen(true)}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {event.status === 'approved' && (
                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span className="text-sm font-medium">Featured Event</span>
                                            <Switch
                                                checked={event.featured}
                                                onCheckedChange={handleFeaturedToggle}
                                            />
                                        </div>
                                    )}

                                    <div className="text-xs text-center text-muted-foreground">
                                        Current Status: <span className="capitalize font-bold">{event.status}</span>
                                    </div>
                                </div>
                            ) : (
                                <a href={event.bookingUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="w-full text-lg h-14">
                                        Book Now
                                    </Button>
                                </a>
                            )}

                            {/* Organiser Info */}
                            <div className="border-t border-border pt-6">
                                <h3 className="font-semibold mb-4">Organiser</h3>
                                <div className="flex items-center mb-3">
                                    <User className="h-5 w-5 mr-3 text-muted-foreground" />
                                    <span className="text-foreground">{event.organiser}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                                    <a href={`mailto:${event.organiserEmail}`} className="text-primary hover:underline">
                                        {event.organiserEmail}
                                    </a>
                                </div>
                            </div>

                            {/* Share Section */}
                            <div className="border-t border-border pt-6">
                                <h3 className="font-semibold mb-4 flex items-center">
                                    <Share2 className="h-5 w-5 mr-2" />
                                    Share This Event
                                </h3>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShare('facebook')}
                                        className="hover:bg-[#1877F2] hover:text-primary-foreground hover:border-[#1877F2]"
                                    >
                                        <Facebook className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShare('twitter')}
                                        className="hover:bg-[#1DA1F2] hover:text-primary-foreground hover:border-[#1DA1F2]"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShare('linkedin')}
                                        className="hover:bg-[#0A66C2] hover:text-primary-foreground hover:border-[#0A66C2]"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleShare('copy')}
                                    >
                                        <Link2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EventEditDialog
                event={event}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={(updated) => {
                    setEvent(updated);
                    setIsEditing(false);
                    fetchEvent();
                }}
            />

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve this event? The event will be published and visible to all users.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApprove}
                            className="bg-success hover:bg-success/90"
                        >
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this event? This action will notify the organizer and the event will not be published.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Layout>
    );
};

export default EventDetail;
