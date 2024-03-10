"use client"

import { useState } from 'react';
import { Spin, Input } from 'antd';
import { CommentOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { PiSmileySad, PiSmiley, PiSmileyMeh } from "react-icons/pi";
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useAnnouncements } from '@/utils/useAnnouncements';
import { fetchComments, handleSubmitComment } from '@/utils/useComments';


export default function Announcements() {
    const { user } = useUser();
    const author = user?.fullName || "";
    const userImageUrl = user?.imageUrl || "";
    const { announcements, loading } = useAnnouncements();
    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [postId, setPostId] = useState<string>('');

    async function handleFetchComments(postId: string) {
        await fetchComments(postId, setComments, setCommentLoading);
    }

    async function handleCommentSubmission(postId: string) {
        await handleSubmitComment(postId, newComment, author, userImageUrl, setNewComment, setComments, setCommentLoading);
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
                            <div key={announcement.id || index} className="w-full sm:w-11/16 md:w-3/4 shadow min-h-[200px] flex flex-col justify-between gap-4 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
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
                                            <Input.TextArea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                            <button type="submit" className="bg-blue-500 text-white flex items-center justify-center gap-2 p-2 mt-4 rounded" onClick={() => handleCommentSubmission(announcement.id)}>Publier <SendOutlined /></button>
                                        </div>
                                    )}
                                </div>
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
                                        <p>{announcement.commentCount ?? 0}</p> 
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="hover:text-red-500"><PiSmileySad /></p>  
                                        <p className="hover:text-green-500"><PiSmileyMeh /></p> 
                                        <p className="hover:text-yellow-500"><PiSmiley /></p>     
                                    </div>
                                    <p className="text-gray-500 text-sm">{formattedDate}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="pt-[50px]">
                <p>Scrollez pour voir plus d&apos;annonces</p>
            </div>
    
        </div>
    );
}    
