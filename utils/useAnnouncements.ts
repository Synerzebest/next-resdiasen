import { useState, useEffect } from 'react';
import { z, ZodError } from 'zod';

type Announcement = {
    id: string;
    author: string;
    text: string;
    date: string;
    userImageUrl?: string;
};

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const announcementSchema = z.object({
        author: z.string(),
        text: z.string(),
        date: z.string()
    });

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const response = await fetch('/api/announcements');
                if (!response.ok) {
                    throw new Error('An error occurred while fetching the announcements');
                }
                const data: any[] = await response.json();

                const validatedAnnouncements = data.map((announcement: any) => {
                    try {
                        announcementSchema.parse(announcement);

                        const formattedDate = new Date(announcement.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        return { ...announcement, formattedDate };
                    } catch (error) {
                        if (error instanceof ZodError) {
                            console.error('Invalid announcement:', error);
                        }
                        return null;
                    }
                }).filter(Boolean) as Announcement[];

                const sortedAnnouncements = validatedAnnouncements.reverse();
                setAnnouncements(sortedAnnouncements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        }
        fetchAnnouncements();
    }, [announcementSchema]);

    return { announcements, loading };
}
