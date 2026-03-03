import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/list-event`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic event routes
  let eventRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    // Fetch all approved events
    const events = await Event.find({ status: 'approved', slug: { $exists: true, $ne: null } })
      .select('slug updatedAt')
      .lean()
      .exec();

    eventRoutes = events.map((event) => ({
      url: `${baseUrl}/event/${event.slug}`,
      lastModified: event.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
  }

  return [...staticRoutes, ...eventRoutes];
}
