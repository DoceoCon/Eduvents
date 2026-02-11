"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import Layout from "@/components/Layout";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Event } from "@/data/events";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (data.success) {
          setAllEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const featuredEvents = allEvents.filter(
    (e) => e.featured && e.status === "approved",
  );
  const latestEvents = allEvents
    .filter((e) => e.status === "approved")
    .slice(0, 12);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-10 md:py-16">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Educations Events That Inspire
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 font-league-gothic tracking-wide uppercase">
              Discover CPD training, Webinars, Conferences, Award Shows and more
              globally.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="pl-12 h-12 text-base bg-card border-0 shadow-lg"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90"
              >
                Search
              </Button>
            </form>

            <Link href="/list-event">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8"
              >
                List Your Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section - Moved up */}
      <section className="py-12 bg-background">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Featured Events
            </h2>
            <Link
              href="/events"
              className="text-primary hover:underline font-medium flex items-center"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <FeaturedCarousel events={featuredEvents} />
        </div>
      </section>

      {/* Latest Events Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Latest Events
            </h2>
            <Link
              href="/events"
              className="text-primary hover:underline font-medium flex items-center"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {latestEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg">
              <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-muted-foreground/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No Events Found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no events available at the moment. Check back soon for
                new educational opportunities!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to List your Event?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Reach thousands of users searching for events every month. Share
              your educational event with our community of passionate teachers
              and school leaders.
            </p>
            <Link href="/list-event">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
