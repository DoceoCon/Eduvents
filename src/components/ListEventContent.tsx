"use client";

import { useState } from 'react';
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
}

const ListEventContent = ({ isAdminMode = false, onSuccess }: ListEventContentProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Event title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.format) newErrors.format = 'Format is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.startTime) newErrors.startTime = 'Start time is required';
        if (!formData.endTime) newErrors.endTime = 'End time is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (formData.isFree === 'paid' && !formData.price) newErrors.price = 'Price is required for paid events';
        if (formData.isFree === 'paid' && formData.price && isNaN(parseFloat(formData.price))) {
            newErrors.price = 'Please enter a valid price';
        }
        if (!formData.organiserName.trim()) newErrors.organiserName = 'Organisation name is required';
        if (!formData.organiserEmail.trim()) newErrors.organiserEmail = 'Email is required';
        if (formData.organiserEmail && !/\S+@\S+\.\S+/.test(formData.organiserEmail)) {
            newErrors.organiserEmail = 'Please enter a valid email';
        }
        if (formData.bookingUrl && !formData.bookingUrl.startsWith('http')) {
            newErrors.bookingUrl = 'Please enter a valid URL starting with http:// or https://';
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);

        if (isAdminMode && onSuccess) {
            onSuccess();
            toast.success('Event created successfully!');
        } else {
            setShowSuccess(true);
            toast.success('Event submitted successfully!');
        }
    };

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
                            {formData.description.length}/50 characters minimum
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

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {imagePreview ? (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => setImagePreview(null)}
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
