import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Education Event | Reach Teachers & Educators",
  description:
    "Promote your workshops, conferences, and seminars to teachers, school leaders, and support staff. Get your education event noticed quickly.",
  alternates: {
    canonical: "/list-your-event",
  },
};

export default function ListEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
