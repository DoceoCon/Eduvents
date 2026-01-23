"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CreditCard, Check, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { categories, formats, SubjectArea, EventPhase } from '@/data/events';
import SubjectTagInput from '@/components/SubjectTagInput';
import PhaseTagInput from '@/components/PhaseTagInput';
import { toast } from 'sonner';

interface ListEventContentProps {
    isAdminMode?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const ListEventContent = ({ isAdminMode = false, onSuccess, onCancel }: ListEventContentProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [verifyingPayment, setVerifyingPayment] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        format: '',
        subjectAreas: [] as SubjectArea[],
        phases: [] as EventPhase[],
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        isFree: 'free',
        price: '',
        organiserName: '',
        organiserEmail: '',
        bookingUrl: ''
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Required fields
        const requiredFields = ['title', 'description', 'category', 'format', 'date', 'startTime', 'endTime', 'location', 'organiserName', 'organiserEmail', 'bookingUrl'];
        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]?.toString().trim()) {
                newErrors[field] = 'Required';
            }
        });

        if (!selectedFile && !imagePreview) newErrors.image = 'Required';

        // Specific constraints
        if (formData.title && formData.title.length > 50) {
            newErrors.title = 'Title must be 50 characters or less';
        }
        if (formData.description && formData.description.length > 200) {
            newErrors.description = 'Description must be 200 characters or less';
        }
        if (formData.organiserName && formData.organiserName.length > 50) {
            newErrors.organiserName = 'Name must be 50 characters or less';
        }
        if (formData.organiserEmail && !formData.organiserEmail.includes('@')) {
            newErrors.organiserEmail = 'Incorrect email format. Email must contain @';
        }
        if (formData.bookingUrl) {
            try {
                new URL(formData.bookingUrl);
            } catch (e) {
                newErrors.bookingUrl = 'Incorrect URL. Please enter a valid URL.';
            }
        }

        // Past date validation
        if (formData.date) {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = 'Date cannot be in the past';
            }
        }

        if (formData.isFree === 'paid' && !formData.price) {
            newErrors.price = 'Required';
        }

        if (selectedFile) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(selectedFile.type)) {
                newErrors.image = 'Incorrect File Format. File must be PNG or JPG.';
            }
            if (selectedFile.size > 25 * 1024 * 1024) {
                newErrors.image = 'File size too big. File size should be less than 25mb';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubjectChange = (subjects: SubjectArea[]) => {
        setFormData(prev => ({ ...prev, subjectAreas: subjects }));
    };

    const handlePhaseChange = (phases: EventPhase[]) => {
        setFormData(prev => ({ ...prev, phases }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setErrors(prev => ({ ...prev, image: '' }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get('success');
        const canceled = query.get('canceled');
        const sessionId = query.get('session_id');
        const eventId = query.get('event_id');

        if (success === 'true' && sessionId && eventId) {
            verifyPayment(sessionId, eventId);
        } else if (canceled === 'true' && eventId) {
            handleCancellation(eventId);
        }
    }, []);

    const handleCancellation = async (eventId: string) => {
        try {
            await fetch('/api/checkout/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            });
            toast.error('Payment canceled. Your event was not listed.');
            // Clean up URL
            router.replace('/list-event');
        } catch (error) {
            console.error('Error cleaning up canceled event:', error);
        }
    };

    const verifyPayment = async (sessionId: string, eventId: string) => {
        setVerifyingPayment(true);
        try {
            const response = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, eventId })
            });

            const result = await response.json();
            if (result.success) {
                setShowSuccess(true);
                router.replace('/list-event');
            } else {
                toast.error(result.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Error verifying payment');
        } finally {
            setVerifyingPayment(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('format', formData.format);
            data.append('subjectAreas', JSON.stringify(formData.subjectAreas));
            data.append('phases', JSON.stringify(formData.phases));
            data.append('date', formData.date);
            data.append('startTime', formData.startTime);
            data.append('endTime', formData.endTime);
            data.append('location', formData.location);
            data.append('isFree', (formData.isFree === 'free').toString());
            data.append('price', formData.price);
            data.append('organiser', formData.organiserName);
            data.append('organiserEmail', formData.organiserEmail);
            data.append('bookingUrl', formData.bookingUrl);
            data.append('isAdmin', isAdminMode.toString());
            if (selectedFile) {
                data.append('image', selectedFile);
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                body: data
            });

            const result = await response.json();

            if (result.success) {
                if (isAdminMode) {
                    toast.success('Event Created Successfully.');
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        setShowSuccess(true);
                    }
                } else if (result.stripeUrl) {
                    // User mode: Redirect to Stripe immediately
                    window.location.href = result.stripeUrl;
                } else {
                    // Fallback for non-paid user events if any
                    setShowSuccess(true);
                }
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                }
                toast.error(result.message || 'Failed to create event');
            }
        } catch (error) {
            console.error('Error submitting event:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (verifyingPayment) {
        return (
            <Layout>
                <div className="container-tight py-20">
                    <div className="max-w-lg mx-auto text-center bg-card rounded-lg p-12 shadow-card">
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
                        <p className="text-muted-foreground">Please wait while we confirm your transaction.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (showSuccess && !isAdminMode) {
        return (
            <Layout>
                <div className="container-tight py-20">
                    <div className="max-w-lg mx-auto text-center bg-card rounded-lg p-12 shadow-card animate-slide-up">
                        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="h-8 w-8 text-success-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold mb-4">Event Submitted!</h1>
                        <p className="text-muted-foreground mb-8">
                            Thank you for submitting your event. Our team will review it within 24 hours and notify you once it&apos;s approved.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => router.push('/events')}>
                                Browse Events
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setShowSuccess(false);
                                setFormData({
                                    title: '', description: '', category: '', format: '', subjectAreas: [], phases: [],
                                    date: '', startTime: '', endTime: '', location: '', isFree: 'free', price: '',
                                    organiserName: '', organiserEmail: '', bookingUrl: ''
                                });
                                setImagePreview(null);
                            }}>
                                Submit Another
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Event Details</h2>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g., STEM Innovation Conference 2026"
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            {formData.title.length}/50 characters
                        </p>
                        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe your event in detail..."
                            rows={5}
                            className={errors.description ? 'border-destructive' : ''}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            {formData.description.length}/200 characters
                        </p>
                        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Category *</Label>
                            <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-card">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
                        </div>

                        <div>
                            <Label>Event Format *</Label>
                            <Select value={formData.format} onValueChange={(v) => handleChange('format', v)}>
                                <SelectTrigger className={errors.format ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent className="bg-card">
                                    {formats.map((format) => (
                                        <SelectItem key={format} value={format}>{format}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.format && <p className="text-sm text-destructive mt-1">{errors.format}</p>}
                        </div>
                    </div>

                    <div>
                        <Label>Subject Areas (Optional)</Label>
                        <SubjectTagInput
                            selectedSubjects={formData.subjectAreas}
                            onChange={handleSubjectChange}
                        />
                    </div>

                    <div>
                        <Label>Educational Phases (Optional)</Label>
                        <PhaseTagInput
                            selectedPhases={formData.phases}
                            onChange={handlePhaseChange}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Select the education levels this event is relevant to
                        </p>
                    </div>
                </div>
            </div>

            {/* Date & Time */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Date & Time</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="date">Event Date *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            className={errors.date ? 'border-destructive' : ''}
                        />
                        {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
                    </div>

                    <div>
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => handleChange('startTime', e.target.value)}
                            className={errors.startTime ? 'border-destructive' : ''}
                        />
                        {errors.startTime && <p className="text-sm text-destructive mt-1">{errors.startTime}</p>}
                    </div>

                    <div>
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => handleChange('endTime', e.target.value)}
                            className={errors.endTime ? 'border-destructive' : ''}
                        />
                        {errors.endTime && <p className="text-sm text-destructive mt-1">{errors.endTime}</p>}
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Location</h2>

                <div>
                    <Label htmlFor="location">Venue or Platform *</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Enter venue address or online platform"
                        className={errors.location ? 'border-destructive' : ''}
                    />
                    {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
                </div>
            </div>

            {/* Cost to Attend */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Cost to Attend</h2>

                <div className="space-y-4">
                    <RadioGroup
                        value={formData.isFree}
                        onValueChange={(v) => handleChange('isFree', v)}
                        className="flex gap-6"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="free" id="free" />
                            <Label htmlFor="free" className="cursor-pointer">Free</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paid" id="paid" />
                            <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
                        </div>
                    </RadioGroup>

                    {formData.isFree === 'paid' && (
                        <div className="animate-fade-in">
                            <Label htmlFor="price">Ticket Price *</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    placeholder="Enter price (e.g., 100)"
                                    className={`pl-7 ${errors.price ? 'border-destructive' : ''}`}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Price per person</p>
                            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Organiser Information */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Organiser Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="organiserName">Organisation Name *</Label>
                        <Input
                            id="organiserName"
                            value={formData.organiserName}
                            onChange={(e) => handleChange('organiserName', e.target.value)}
                            placeholder="Your organisation"
                            className={errors.organiserName ? 'border-destructive' : ''}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            {formData.organiserName.length}/50 characters
                        </p>
                        {errors.organiserName && <p className="text-sm text-destructive mt-1">{errors.organiserName}</p>}
                    </div>

                    <div>
                        <Label htmlFor="organiserEmail">Contact Email *</Label>
                        <Input
                            id="organiserEmail"
                            type="email"
                            value={formData.organiserEmail}
                            onChange={(e) => handleChange('organiserEmail', e.target.value)}
                            placeholder="email@example.com"
                            className={errors.organiserEmail ? 'border-destructive' : ''}
                        />
                        {errors.organiserEmail && <p className="text-sm text-destructive mt-1">{errors.organiserEmail}</p>}
                    </div>
                </div>
            </div>

            {/* Event Image */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Event Image</h2>

                <div className={`border-2 border-dashed ${errors.image ? 'border-destructive' : 'border-border'} rounded-lg p-8 text-center hover:border-primary transition-colors`}>
                    {imagePreview ? (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => {
                                    setImagePreview(null);
                                    setSelectedFile(null);
                                }}
                            >
                                Remove Image
                            </Button>
                        </div>
                    ) : (
                        <label className="cursor-pointer">
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-2">Drag and drop your image here, or click to browse</p>
                            <p className="text-sm text-muted-foreground">Recommended: 1200x630px, JPG or PNG</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                {errors.image && <p className="text-sm text-destructive mt-2">{errors.image}</p>}
            </div>

            {/* Booking Link */}
            <div className="bg-card rounded-lg p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-6">Booking</h2>

                <div>
                    <Label htmlFor="bookingUrl">External Booking Link</Label>
                    <Input
                        id="bookingUrl"
                        type="url"
                        value={formData.bookingUrl}
                        onChange={(e) => handleChange('bookingUrl', e.target.value)}
                        placeholder="https://your-booking-page.com"
                        className={errors.bookingUrl ? 'border-destructive' : ''}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Link where attendees can register</p>
                    {errors.bookingUrl && <p className="text-sm text-destructive mt-1">{errors.bookingUrl}</p>}
                </div>
            </div>
        </form>
    );

    // Admin mode - no layout wrapper, no payment
    if (isAdminMode) {
        return (
            <div className="space-y-6">
                {formContent}
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            'Create Event'
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="bg-gradient-hero py-12">
                <div className="container-tight">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">List Your Event</h1>
                    <p className="text-primary-foreground/80">Share your educational event with thousands of educators</p>
                </div>
            </div>

            <div className="container-tight py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        {formContent}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg p-6 shadow-card sticky top-24">
                            <div className="bg-accent rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-accent-foreground">Listing Fee</p>
                                        <p className="text-3xl font-bold text-primary my-2">£99</p>
                                        <p className="text-sm text-muted-foreground">One-time payment per listing</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-14 text-lg"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Pay with Stripe
                                    </>
                                )}
                            </Button>

                            <p className="text-sm text-muted-foreground text-center mt-4">
                                Your event will be reviewed within 24 hours
                            </p>

                            <div className="border-t border-border mt-6 pt-6">
                                <h3 className="font-semibold mb-3">What&apos;s included:</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                                        Listing on EDUVENTS for 3 months
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                                        Exposure to thousands of educators
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                                        Featured on category pages
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                                        Social sharing tools
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ListEventContent;
