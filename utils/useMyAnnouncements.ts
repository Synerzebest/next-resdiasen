import { useState, useEffect } from 'react';
import { z, ZodError } from 'zod';
import { IComment } from '@/models/Comment';

type Announcement = {
    id: string;
    author: string;
    text: string;
    date: string;
    userImageUrl?: string;
    commentCount: number;
};

export function useMyAnnouncements(userId: string) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const announcementSchema = z.object({
        author: z.string(),
        text: z.string(),
        date: z.string()
    });

    useEffect(() => {
        async function fetchMyAnnouncements() {
            try {
                const response = await fetch(`/api/myAnnouncements?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('An error occurred while fetching the announcements');
                }
                const data: any[] = await response.json();

                const announcementsWithCommentCount = await Promise.all(data.map(async (announcement: any) => {
                    try {
                        const commentsResponse = await fetch(`/api/getComments?postId=${announcement.id}`);
                        if (!commentsResponse.ok) {
                            throw new Error('An error occurred while fetching the comments');
                        }
                        const commentsData: IComment[] = await commentsResponse.json();
                        return {
                            ...announcement,
                            commentCount: commentsData.length
                        };
                    } catch (error) {
                        console.error('Error fetching comments for announcement:', error);
                        return {
                            ...announcement,
                            commentCount: 0
                        };
                    }
                }));

                const validatedAnnouncements = announcementsWithCommentCount.filter((announcement: any) => {
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
                        return false;
                    }
                });

                const sortedAnnouncements = validatedAnnouncements.reverse();

                setAnnouncements(sortedAnnouncements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        }
        fetchMyAnnouncements();
    }, [announcementSchema, userId]);

    return { announcements, loading };
}
