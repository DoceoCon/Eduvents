import Layout from "@/components/Layout";
import { Mail, Target, Users, Heart, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Eduvents",
  description: "Learn about Eduvents, the dedicated education events marketplace for teachers and education professionals.",
};

export default function About() {
  return (
    <Layout>
      <div className="bg-gradient-hero py-12">
        <div className="container-tight">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            About Us
          </h1>
          <p className="text-primary-foreground/80">
            Your dedicated education events marketplace
          </p>
        </div>
      </div>

      <div className="container-tight py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Eduvents is a dedicated education events marketplace designed to make it simple for teachers and education professionals to find the most relevant conferences, festivals, CPD, training and webinars in one place.
            </p>
          </div>

          {/* Who We Are */}
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card">
            <div className="flex items-start gap-4 mb-4">
              <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold text-foreground">Who we are</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Eduvents brings together educational events from across the UK and internationally into a single, easy-to-navigate platform focused on teaching and learning. Our aim is to remove the noise and help educators quickly discover opportunities that genuinely support their professional growth and networking.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card">
            <div className="flex items-start gap-4 mb-4">
              <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold text-foreground">Our mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to connect teachers with the best networking and professional development opportunities across the education sector via a clear, intuitive search experience. Whether you are looking for subject-specific CPD, leadership conferences, SEND training, or large-scale festivals and exhibitions, Eduvents is built to surface the right events at the right time.
            </p>
          </div>

          {/* What We Offer Educators */}
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card">
            <div className="flex items-start gap-4 mb-6">
              <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold text-foreground">What we offer educators</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              On Eduvents, educators can:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Search and filter events by category (webinar, conference, CPD training, awards, festivals, exhibitions and more).</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Refine results by phase and subject focus.</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>See key details at a glance: dates, times, location or online link, cost, and organiser information, with a clear route to book directly with the event organiser.</span>
              </li>
            </ul>
          </div>

          {/* What We Offer Event Organisers */}
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold text-foreground">What we offer event organisers</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              For event organisers, Eduvents provides a focused channel to reach engaged educators actively looking for high-quality professional opportunities. Organisers can submit events through a simple online form, with paid listings processed securely via Stripe. Featured listing options and homepage visibility are available to amplify reach and drive more targeted attendance.
            </p>
          </div>

          {/* How to Get in Touch */}
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-semibold text-foreground">How to get in touch</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              If you have any questions about listing an event, using the platform, or potential partnerships, you can contact us at:
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <a
                href="mailto:info@doceoconsulting.co.uk"
                className="text-primary hover:underline font-medium"
              >
                info@doceoconsulting.co.uk
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
