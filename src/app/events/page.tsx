"use client";

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X, Calendar as CalendarIcon, Search, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Event, categories, formats, subjectAreas, eventPhases, EventCategory, EventFormat, SubjectArea, EventPhase } from '@/data/events';
import { DateRange, Range } from 'react-date-range';
import { format as formatDate } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const ITEMS_PER_PAGE = 12;

const EventsContent = () => {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
    const [selectedFormat, setSelectedFormat] = useState<EventFormat | 'all'>('all');
    const [selectedSubject, setSelectedSubject] = useState<SubjectArea | 'all'>('all');
    const [selectedPhase, setSelectedPhase] = useState<EventPhase | 'all'>('all');
    const [dateRange, setDateRange] = useState<Range>({
        startDate: undefined,
        endDate: undefined,
        key: 'selection'
    });
    const [sortBy, setSortBy] = useState<'newest' | 'date' | 'popularity'>('newest');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (debouncedSearch) params.append('search', debouncedSearch);
                if (selectedCategory !== 'all') params.append('category', selectedCategory);
                if (selectedFormat !== 'all') params.append('format', selectedFormat);
                if (selectedSubject !== 'all') params.append('subject', selectedSubject);
                if (selectedPhase !== 'all') params.append('phase', selectedPhase);
                if (dateRange.startDate) {
                    params.append('dateFrom', formatDate(dateRange.startDate, 'yyyy-MM-dd'));
                }
                if (dateRange.endDate) {
                    params.append('dateTo', formatDate(dateRange.endDate, 'yyyy-MM-dd'));
                }
                if (minPrice !== '' && parseFloat(minPrice) >= 0) params.append('minPrice', minPrice);
                if (maxPrice !== '' && parseFloat(maxPrice) >= 0) params.append('maxPrice', maxPrice);
                params.append('sort', sortBy);

                const response = await fetch(`/api/events?${params.toString()}`);
                const data = await response.json();
                if (data.success) {
                    setAllEvents(data.events);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [debouncedSearch, selectedCategory, selectedFormat, selectedSubject, selectedPhase, dateRange, sortBy, minPrice, maxPrice]);

    const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = allEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedFormat('all');
        setSelectedSubject('all');
        setSelectedPhase('all');
        setDateRange({
            startDate: undefined,
            endDate: undefined,
            key: 'selection'
        });
        setMinPrice('');
        setMaxPrice('');
        setSearchQuery('');
        setDebouncedSearch('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedFormat !== 'all' || selectedSubject !== 'all' || selectedPhase !== 'all' || (dateRange.startDate || dateRange.endDate) || minPrice || maxPrice;

    const activeFilterCount = [
        selectedCategory !== 'all',
        selectedFormat !== 'all',
        selectedSubject !== 'all',
        selectedPhase !== 'all',
        dateRange.startDate || dateRange.endDate,
        minPrice,
        maxPrice
    ].filter(Boolean).length;

    const renderFilterSection = () => (
        <div className="space-y-6">
            <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v as EventCategory | 'all'); setCurrentPage(1); }}>
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Event Format</Label>
                <Select value={selectedFormat} onValueChange={(v) => { setSelectedFormat(v as EventFormat | 'all'); setCurrentPage(1); }}>
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="All Formats" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                        <SelectItem value="all">All Formats</SelectItem>
                        {formats.map((format) => (
                            <SelectItem key={format} value={format}>{format}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Subject Area</Label>
                <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v as SubjectArea | 'all'); setCurrentPage(1); }}>
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjectAreas.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Educational Phase</Label>
                <Select value={selectedPhase} onValueChange={(v) => { setSelectedPhase(v as EventPhase | 'all'); setCurrentPage(1); }}>
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="All Phases" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                        <SelectItem value="all">All Phases</SelectItem>
                        {eventPhases.map((phase) => (
                            <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <Label className="text-sm font-medium block">Price Range (£)</Label>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
                        <Input
                            type="number"
                            placeholder="Min"
                            min="0"
                            value={minPrice}
                            onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                            className="bg-background h-10 pl-6 text-sm"
                        />
                    </div>
                    <span className="text-muted-foreground font-bold"> - </span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            min="0"
                            value={maxPrice}
                            onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                            className="bg-background h-10 pl-6 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Event Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-card text-sm"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                                {dateRange.startDate ? (
                                    dateRange.endDate ? (
                                        <>
                                            {formatDate(dateRange.startDate, "MMM d, yyyy")} -{" "}
                                            {formatDate(dateRange.endDate, "MMM d, yyyy")}
                                        </>
                                    ) : (
                                        formatDate(dateRange.startDate, "MMM d, yyyy")
                                    )
                                ) : (
                                    "Select date"
                                )}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <DateRange
                            ranges={[dateRange]}
                            onChange={(ranges) => {
                                setDateRange(ranges.selection);
                                setCurrentPage(1);
                            }}
                            months={1}
                            direction="vertical"
                            showDateDisplay={false}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                </Button>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="bg-gradient-hero py-12">
                <div className="container-tight">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Discover Your Ideal Educational Event</h1>
                    <p className="text-primary-foreground/80">Filter by event category, format, subject and educational phase</p>
                </div>
            </div>

            <div className="container-tight py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-card rounded-lg p-6 shadow-card sticky top-24">
                            <h2 className="font-semibold text-lg mb-4">Filters</h2>
                            {renderFilterSection()}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <SearchBar
                                value={searchQuery}
                                onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
                                className="flex-1"
                            />

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="lg:hidden w-[160px] h-12"
                                    onClick={() => setShowMobileFilters(true)}
                                >
                                    <div className="relative mr-2">
                                        <Filter className="h-4 w-4" />
                                        {activeFilterCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-background">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </div>
                                    Filters
                                </Button>

                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                    <SelectTrigger className="w-[160px] h-12 bg-card">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card">
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="date">By Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Results Count */}
                        {!isLoading && (
                            <p className="text-muted-foreground mb-6">
                                Showing {paginatedEvents.length} of {allEvents.length} events
                            </p>
                        )}

                        {/* Content Area */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-card rounded-lg shadow-sm">
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                <p className="text-lg font-bold text-foreground mb-1 uppercase tracking-tight">Loading events</p>
                                <p className="text-sm text-muted-foreground">Finding the best educational opportunities for you...</p>
                            </div>
                        ) : paginatedEvents.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedEvents.map((event, index) => (
                                        <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12">
                                        <Button
                                            variant="outline"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className="w-10"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-card rounded-lg border-2 border-dashed border-muted-foreground/20">
                                <div className="w-20 h-20 mb-6 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/40">
                                    <Search className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-tight">No events found</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                                    We couldn't find any events matching your current search{hasActiveFilters ? ' or filters' : ''}. Try adjusting {hasActiveFilters ? 'them or clear all filters' : 'your search'} to start over.
                                </p>
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={clearFilters} className="px-8 h-12">
                                        <X className="h-4 w-4 mr-2" />
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute right-0 top-0 h-full w-[350px] max-w-full bg-background p-6 shadow-xl animate-slide-in-right overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-lg">Filters</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        {renderFilterSection()}
                        <Button className="w-full mt-6" onClick={() => setShowMobileFilters(false)}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default function Events() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventsContent />
        </Suspense>
    );
}
