import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Your Ideal Education Event",
  description:
    "Search Education events by subject, format & date. For teachers, school leaders & support staff. Find the right event fast.",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
