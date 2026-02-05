import Layout from "@/components/Layout";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Eduvent",
  description: "Get in touch with the EDUVENTS team.",
};

export default function Contact() {
  return (
    <Layout>
      <div className="bg-gradient-hero py-12">
        <div className="container-tight">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80">
            Get in touch with the EDUVENTS team
          </p>
        </div>
      </div>

      <div className="container-tight py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg p-8 md:p-12 shadow-card text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              We&apos;d love to hear from you
            </h2>

            <p className="text-muted-foreground mb-8">
              Contact information will be provided here. Whether you have
              questions about listing your event, need support, or want to
              partner with us, our team is here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@eduvents.co.uk</span>
              </div>

              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span>+44 (0) 20 1234 5678</span>
              </div>

              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>London, United Kingdom</span>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8">
              <p className="text-sm text-muted-foreground">
                Office hours: Monday - Friday, 9:00 AM - 5:00 PM GMT
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
