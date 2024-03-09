"use client"

import { useState, useEffect } from 'react';
import { Card, Spin, Input, Button } from 'antd';
import { z, ZodError } from "zod";
import { CommentOutlined, ShareAltOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IComment } from '@/models/Comment';

const { TextArea } = Input;

export default function Announcements() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()


    const announcementSchema = z.object({
        author: z.string(),
        text: z.string(),
        date: z.string()
    });

    type Announcement = z.infer<typeof announcementSchema>;

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const response = await fetch('/api/announcements');
                if (!response.ok) {
                    throw new Error('An error occurred while fetching the announcements');
                }
                const data = await response.json();

                const announcementsWithCommentCount = await Promise.all(data.map(async (announcement: any) => {
                    try {
                        const commentsResponse = await fetch(`/api/getComments?postId=${announcement.id}`);
                        if (!commentsResponse.ok) {
                            throw new Error('An error occurred while fetching the comments');
                        }
                        const commentsData = await commentsResponse.json();
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
        fetchAnnouncements();
    }, []);

    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [postId, setPostId] = useState<string>('');

    
    async function fetchComments(postId: string) {
        setCommentLoading(true);
        try {
            const response = await fetch(`/api/getComments?postId=${postId}`);
            if (!response.ok) {
                throw new Error('An error occurred while fetching the comments');
            }
            const data: IComment[] = await response.json();
            const updatedAnnouncements = announcements.map((announcement) => {
                if (announcement.id === postId) {
                    return {
                        ...announcement,
                        commentCount: data.length
                    };
                }
                return announcement;
            });
            setAnnouncements(updatedAnnouncements);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentLoading(false);
        }
    }

    const { user, isLoaded, isSignedIn } = useUser();
    const author = user?.fullName
    const userImageUrl = user?.imageUrl

    // if (!isLoaded || !isSignedIn || !user) {
    //     router.push('/auth/signin');
    //     return null;
    // }

    async function handleSubmit(postId: string) {
        try {
            const response = await fetch('/api/postComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                    postId: postId,
                    author: author,
                    userImageUrl: userImageUrl
                }),
            });
            if (!response.ok) {
                throw new Error('An error occurred while posting the comment');
            }
            
            fetchComments(postId);
            
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    }
    return (
        <div className="relative top-44 w-11/12 m-auto flex flex-col gap-4 h-auto pb-12">
            <p className="text-3xl sm:text-4xl text-blue-900 font-bold">Découvrez les nouveautés</p>
    
            <div className="w-full mt-12 flex flex-col items-center gap-4 min-h-[300px] max-h-[800px] overflow-y-scroll shadow-b">
    
                {loading ? (
                    <div className="w-full flex flex-row gap-4 items-center pt-6">
                        <p className="text-lg">Chargement</p>
                        <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                ) : (
                    announcements.map((announcement, index) => {
                        const formattedDate = new Date(announcement.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });
    
                        return (
                            <Card
                                // <Image src={announcement.userImageUrl} alt="user profile picture" width={30} height={30} />
                                title={`${announcement.author}`}
                                key={index}
                                className="w-full sm:w-11/16 md:w-3/4"
                                actions={[
                                    <Button
                                        key="commentButton"
                                        onClick={() => {
                                            if (postId === announcement.id) {
                                                setPostId('');
                                            } else {
                                                setPostId(announcement.id);
                                                fetchComments(announcement.id);
                                            }
                                        }}
                                        className="border-none shadow-none"
                                    >
                                    <Button
                                        key="commentButton"
                                        onClick={() => {
                                            if (postId === announcement.id) {
                                                setPostId('');
                                            } else {
                                                setPostId(announcement.id);
                                                fetchComments(announcement.id);
                                            }
                                        }}
                                        className="border-none shadow-none outline-none"
                                    >
                                        <div className="flex items-center gap-2">
                                        <CommentOutlined />
                                        <p>{announcement.commentCount ?? 0}</p> 
                                        </div>
                                    </Button>
                                        
                                    </Button>,
                                    <ShareAltOutlined />,
                                    <p>{formattedDate}</p>
                                ]}
                            >
                                <p className='text-xl'>{announcement.text}</p>
                                {postId === announcement.id && (
                                    <div className="mt-6">
                                        <p className="text-lg font-bold">Commentaires</p>
                                        <div className="max-h-[350px] overflow-y-scroll">
                                            {commentLoading ? (
                                                <Spin indicator={<LoadingOutlined spin className="my-4" />} />
                                            ) : comments.length === 0 ? (
                                                <p className="py-4">Il n'y a pas encore de commentaires</p>
                                            ) : (
                                                comments.map((comment: any, index: number) => (
                                                    <div key={index} className="max-w-[300px] my-4 p-2 shadow rounded-lg flex flex-col gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Image alt='user profile picture' src={comment.userImageUrl} width={30} height={30} className="rounded-full" />
                                                            <p className="text-xl">{comment.author}</p>
                                                        </div>
                                                        <p className="text-lg">{comment.content}</p>
                                                        {/* FormattedDate */}
                                                        <p className="text-sm text-gray-500 italic">
                                                            {new Date(comment.date).toLocaleDateString("fr-FR", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <Input.TextArea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                        <button type="submit" className="bg-blue-500 text-white flex items-center justify-center gap-2 p-2 mt-4 rounded" onClick={() => handleSubmit(announcement.id)}>Publier <SendOutlined /></button>
                                    </div>
                                )}
    
                            </Card>
                        );
                    })
                )}
            </div>
            <div className="pt-[50px]">
                <p>Scrollez pour voir plus d'annonces</p>
            </div>
    
        </div>
    );
}    
