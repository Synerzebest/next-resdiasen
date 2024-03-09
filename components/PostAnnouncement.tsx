"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import toast, {Toaster} from 'react-hot-toast';
import { z, ZodError } from 'zod';
import { Card, Spin, Input, Button } from 'antd';
import { CommentOutlined, ShareAltOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';


const { TextArea } = Input;


export default function PostAnnouncement() {
    const [query, setQuery] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const { user, isLoaded, isSignedIn } = useUser();
    const [loading, setLoading] = useState(true);
    const author = user?.fullName;
    const userImageUrl = user?.imageUrl;
    const userId = user?.id;
    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [postId, setPostId] = useState<string>('');

    const announcementSchema = z.object({
        author: z.string(),
        text: z.string(),
        date: z.string()
    });

    type Announcement = z.infer<typeof announcementSchema>;

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                if (!isLoaded || !isSignedIn || !user) {
                    return;
                }

                const response = await fetch('/api/announcements');
                if (!response.ok) {
                    throw new Error('An error occurred while fetching the announcements');
                }
                const data = await response.json();

                const userAnnouncements = data.filter((announcement: any) => {
                    try {
                        announcementSchema.parse(announcement);
                        const formattedDate = new Date(announcement.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        // Comparez l'ID de l'utilisateur avec l'ID de l'auteur de l'annonce
                        return announcement.userId === user.id;
                    } catch (error) {
                        if (error instanceof ZodError) {
                            console.error('Invalid announcement:', error);
                        }
                        return false;
                    }
                });

                userAnnouncements.sort((a: Announcement, b: Announcement) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setAnnouncements(userAnnouncements);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        }
        fetchAnnouncements();
    }, [isLoaded, isSignedIn, user, announcementSchema]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/postAnnouncements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: query, author: author, userImageUrl: userImageUrl, userId: userId }),
            });

            if (!response.ok) {
                throw new Error('An error occurred while posting the announcement');
            }

            toast.success('Votre annonce a été publiée');

            setTimeout(() => {
                setIsPosting(false);
            }, 5000);

        } catch (error) {
            console.error('Error:', error);
            toast.error("Oups! Une erreur s'est produite, réessayez ultérieurement.");
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        return () => clearTimeout();
    }, []);

    async function fetchComments(postId: string) {
        setCommentLoading(true);
        try {
            const response = await fetch(`/api/getComments?postId=${postId}`);
            if (!response.ok) {
                throw new Error('An error occurred while fetching the comments');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentLoading(false);
        }
    }


    return (
        <div className="w-11/12 px-12 flex flex-col items-center relative top-[5rem] ">
            <div className="w-full md:w-1/2 flex justify-center">  
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                    <p className="text-2xl">Faire une annonce</p> 
                    <TextArea required showCount maxLength={300} className="h-24" onChange={handleInputChange} />
                    <button type="submit" className={`bg-blue-500 text-white flex items-center justify-center gap-2 p-2 mt-4 rounded ${isPosting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isPosting}>
                        {isPosting ? 'Publication en cours...' : 'Publier'} <SendOutlined />
                    </button>
                    <Toaster />
                </form>
            </div> 
            <div className="relative top-44 w-11/12 m-auto flex flex-col gap-4 h-auto pb-12">
            <p className="text-3xl sm:text-4xl text-blue-900 font-bold">Mes annonces</p>
    
            <div className="w-full mt-12 mb-[7rem] flex flex-col items-center gap-4 min-h-[300px] max-h-[800px] overflow-y-scroll shadow-b">
    
                {loading ? (
                    <div className="w-full flex flex-row gap-4 items-center pt-6">
                        <p className="text-lg">Chargement</p>
                        <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                    ) : (
                    announcements.map((announcement) => {
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
                                key={announcement.id}
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
                                        className="border-none shadow-none text-gray-500"
                                    >
                                        <CommentOutlined />
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
                                                <Spin indicator={<LoadingOutlined spin />} className="my-4"/>
                                            ) : comments.length === 0 ? (
                                                <p className="py-4">Il n&apos;y a pas encore de commentaires</p>
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
                                        <Input.TextArea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} maxLength={300} />
                                        <button type="submit" className="bg-blue-500 text-white flex items-center justify-center gap-2 p-2 mt-4 rounded" onClick={() => handleSubmit(announcement.id)}>Publier <SendOutlined /></button>
                                    </div>
                                )}
    
                            </Card>
                        );
                    })
                )}
            </div>
    
        </div>
        </div>
    );
}
