"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, User, Mail, Share2, Facebook, Twitter, Linkedin, Link2, PoundSterling, GraduationCap } from 'lucide-react';
import Layout from '@/components/Layout';
import CategoryBadge from '@/components/CategoryBadge';
import { Button } from '@/components/ui/button';
import { events } from '@/data/events';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const EventDetail = () => {
    const params = useParams();
    const id = params?.id as string;
    const event = events.find(e => e.id === id);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, []);

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

    const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
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
                navigator.clipboard.writeText(currentShareUrl);
                toast.success('Link copied to clipboard!');
                return;
        }
        window.open(url, '_blank', 'width=600,height=400');
    };

    return (
        <Layout>
            {/* Back Button */}
            <div className="container-tight py-4">
                <Link href="/events" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
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

                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            {event.title}
                        </h1>

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
                            {event.fullDescription.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg p-6 shadow-card sticky top-24 space-y-6">
                            {/* Book Now Button */}
                            <a href={event.bookingUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="w-full text-lg h-14">
                                    Book Now
                                </Button>
                            </a>

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
        </Layout>
    );
};

export default EventDetail;
