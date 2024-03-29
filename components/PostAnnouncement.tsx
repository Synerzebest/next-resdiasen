"use client"

import { useState, FormEvent, ChangeEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import toast, {Toaster} from 'react-hot-toast';
import { Spin, Input } from 'antd';
import { PiSmileySad, PiSmiley, PiSmileyMeh } from "react-icons/pi";
import { CommentOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useMyAnnouncements } from '@/utils/useMyAnnouncements';
import { fetchComments, handleSubmitComment } from '@/utils/useComments';


const { TextArea } = Input;


export default function PostAnnouncement() {
    const [query, setQuery] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const { user } = useUser();
    const author = user?.fullName || "";
    const userImageUrl = user?.imageUrl || "";
    const userId = user?.id || "";
    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [postId, setPostId] = useState<string>('');

    const { announcements, loading } = useMyAnnouncements(userId);



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

    async function handleFetchComments(postId: string) {
        await fetchComments(postId, setComments, setCommentLoading);
    }

    async function handleCommentSubmission(postId: string) {
        await handleSubmitComment(postId, newComment, author, userImageUrl, setNewComment, setComments, setCommentLoading);
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
                    ) : announcements.length === 0 ? (
                        <p className="py-4">Vous n&apos;avez posté aucune annonce</p>
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
                            <div key={announcement.id || index} className="w-full sm:w-11/16 md:w-3/4 shadow-lg h-auto flex flex-col justify-between p-4 rounded-lg">
                                <div className="flex flex-col gap-[10px]">
                                    <div className="flex items-center gap-2 py-[5px]">
                                        {announcement.userImageUrl && (
                                            <div className="rounded-full overflow-hidden mr-2">
                                                <Image
                                                    src={announcement.userImageUrl}
                                                    width={30}
                                                    height={30}
                                                    alt="user logo"
                                                />
                                            </div>
                                        )}
                                        <p className="text-2xl">{announcement.author}</p>
                                    </div>
                                    <hr className="w-full py-[10px]"></hr>
                                </div>
                                <div className="min-h-[80px]">
                                    <p>{announcement.text}</p>
                                    {postId === announcement.id && (
                                        <div className="mt-6">
                                            <p className="text-lg font-bold">Commentaires</p>
                                            <div className="max-h-[350px] overflow-y-scroll">
                                                {commentLoading ? (
                                                    <Spin indicator={<LoadingOutlined spin className="my-4" />} />
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
                                            <div className="py-4">
                                                <Input.TextArea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                                <button type="submit" className="bg-blue-500 text-white flex items-center justify-center gap-2 p-2 mt-4 rounded" onClick={() => handleCommentSubmission(announcement.id)}>Publier <SendOutlined /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <hr className="w-full"></hr>
                                    <div className="flex justify-evenly">
                                        <div className="flex items-center gap-2">
                                            <button className="border-none shadow-none outline-none" onClick={() => {
                                                if (postId === announcement.id) {
                                                    setPostId('');
                                                } else {
                                                    setPostId(announcement.id);
                                                    handleFetchComments(announcement.id);
                                                }
                                            }}>
                                                <CommentOutlined />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <p className="hover:text-red-500 hover:cursor-pointer text-lg"><PiSmileySad /></p>  
                                            <p className="hover:text-yellow-500 hover:cursor-pointer text-lg"><PiSmileyMeh /></p> 
                                            <p className="hover:text-green-500 hover:cursor-pointer text-lg"><PiSmiley /></p>     
                                        </div>
                                        <p className="text-gray-500 text-sm">{formattedDate}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
    
        </div>
        </div>
    );
}
