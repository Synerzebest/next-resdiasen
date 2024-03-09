import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const postId = req.query.postId as string;

            const url = process.env.MONGODB_URI || "";

            if(!url) {
                throw new Error("Mongodb url is undefined")
            }

            const client = await MongoClient.connect(url);
            const db = client.db('test');

            
            const comments = await db.collection('comments').find({ postId }).toArray();

           
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ message: 'Error fetching comments' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
