import { IComment } from '../models/Comment';

export async function fetchComments(postId: string, setComments: (comments: IComment[]) => void, setCommentLoading: (loading: boolean) => void) {
    setCommentLoading(true);
    try {
        const response = await fetch(`/api/getComments?postId=${postId}`);
        if (!response.ok) {
            throw new Error('An error occurred while fetching the comments');
        }
        const data: IComment[] = await response.json();
        setComments(data);
    } catch (error) {
        console.error('Error fetching comments:', error);
    } finally {
        setCommentLoading(false);
    }
}

export async function handleSubmitComment(postId: string, newComment: string, author: string, userImageUrl: string, setNewComment: (comment: string) => void, setComments: (comments: IComment[]) => void, setCommentLoading: (loading: boolean) => void) {
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
        
        fetchComments(postId, setComments, setCommentLoading);
        
        setNewComment('');
    } catch (error) {
        console.error('Error posting comment:', error);
    }
}
