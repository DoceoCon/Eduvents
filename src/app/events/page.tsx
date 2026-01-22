"use client";

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { events, categories, formats, subjectAreas, eventPhases, EventCategory, EventFormat, SubjectArea, EventPhase } from '@/data/events';

const ITEMS_PER_PAGE = 12;

const EventsContent = () => {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
    const [selectedFormat, setSelectedFormat] = useState<EventFormat | 'all'>('all');
    const [selectedSubject, setSelectedSubject] = useState<SubjectArea | 'all'>('all');
    const [selectedPhase, setSelectedPhase] = useState<EventPhase | 'all'>('all');
    const [dateFilter, setDateFilter] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'date' | 'popularity'>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const filteredEvents = useMemo(() => {
        let filtered = events.filter(e => e.status === 'approved');

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query) ||
                e.location.toLowerCase().includes(query) ||
                e.organiser.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(e => e.category === selectedCategory);
        }

        if (selectedFormat !== 'all') {
            filtered = filtered.filter(e => e.format === selectedFormat);
        }

        if (selectedSubject !== 'all') {
            filtered = filtered.filter(e => e.subjectAreas.includes(selectedSubject));
        }

        if (selectedPhase !== 'all') {
            filtered = filtered.filter(e => e.phases && e.phases.includes(selectedPhase));
        }

        if (dateFilter) {
            filtered = filtered.filter(e => e.date >= dateFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'newest':
                default:
                    return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
            }
        });

        return filtered;
    }, [searchQuery, selectedCategory, selectedFormat, selectedSubject, selectedPhase, dateFilter, sortBy]);

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedFormat('all');
        setSelectedSubject('all');
        setSelectedPhase('all');
        setDateFilter('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedFormat !== 'all' || selectedSubject !== 'all' || selectedPhase !== 'all' || dateFilter || searchQuery;

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

            <div>
                <Label className="text-sm font-medium mb-2 block">From Date</Label>
                <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-card"
                />
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
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Find Educational Events</h1>
                    <p className="text-primary-foreground/80">Discover professional development opportunities near you</p>
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
                                    className="lg:hidden"
                                    onClick={() => setShowMobileFilters(true)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>

                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                    <SelectTrigger className="w-[160px] bg-card">
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
                        <p className="text-muted-foreground mb-6">
                            Showing {paginatedEvents.length} of {filteredEvents.length} events
                        </p>

                        {/* Events Grid */}
                        {paginatedEvents.length > 0 ? (
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
                            <div className="text-center py-16 bg-card rounded-lg">
                                <p className="text-muted-foreground text-lg mb-4">No events found matching your criteria</p>
                                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowMobileFilters(false)} />
                    <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-background p-6 shadow-xl animate-slide-in-right overflow-y-auto">
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
